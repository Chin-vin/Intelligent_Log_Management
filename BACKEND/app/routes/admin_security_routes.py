from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.routes.admin_lookup_routes import require_admin
from datetime import datetime, timedelta, timezone
from app.models.auth import LoginHistory
from app.models.user import User
from app.models.audit import AuditTrail

from app.models.files import RawFile
from app.models.team import Team


router = APIRouter(
    prefix="/admin/security",
    tags=["Admin Security"]
)

# ✅ ALL FILE-RELATED ENTITY TYPES GO HERE
FILE_ENTITY_TYPES = {
    "FILE",
    "RAW_FILE",
    "DOWNLOAD_FILE",
    "PREVIEW_FILE",
    "UPLOAD_FILE",
}


@router.get("/audit-trail")
def audit_trail(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
    action_type: str | None = Query(None),
    entity_type: str | None = Query(None),
    days: int | None = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    offset = (page - 1) * page_size

    # ---------------- BASE QUERY ----------------
    q = (
        db.query(
            AuditTrail.audit_id,
            AuditTrail.action_time,
            AuditTrail.action_type,
            AuditTrail.entity_type,
            AuditTrail.entity_id,
            User.username,
            User.email,
        )
        .outerjoin(User, User.user_id == AuditTrail.user_id)
    )

    if action_type:
        q = q.filter(AuditTrail.action_type.ilike(f"%{action_type}%"))

    if entity_type:
        q = q.filter(AuditTrail.entity_type.ilike(f"%{entity_type}%"))

    if days:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        q = q.filter(AuditTrail.action_time >= since)

    q = q.order_by(AuditTrail.action_time.desc())

    total = q.count()
    rows = q.offset(offset).limit(page_size).all()

    # ---------------- COLLECT ENTITY IDS ----------------
    user_ids = {r.entity_id for r in rows if r.entity_type in ["USER","USER_PROFILE"]}

    file_ids = {
        r.entity_id
        for r in rows
        if r.entity_type in FILE_ENTITY_TYPES
    }

    team_ids = {r.entity_id for r in rows if r.entity_type == "TEAM"}

    # ---------------- FETCH USERS ----------------
    user_map = {
        u.user_id: (u.username or u.email)
        for u in db.query(User)
        .filter(User.user_id.in_(user_ids))
        .all()
    } if user_ids else {}

    # ---------------- FETCH FILES (FILENAME) ----------------
    file_map = {
        f.file_id: f.original_name   # ✅ FILE NAME
        for f in db.query(RawFile)
        .filter(RawFile.file_id.in_(file_ids))
        .all()
    } if file_ids else {}

    # ---------------- FETCH TEAMS ----------------
    team_map = {
        t.team_id: t.team_name
        for t in db.query(Team)
        .filter(Team.team_id.in_(team_ids))
        .all()
    } if team_ids else {}

    # ---------------- ENTITY RESOLVER ----------------
    def resolve_entity(r):
        if r.entity_type in ["USER", "USER_PROFILE"]:
            return user_map.get(r.entity_id, f"User #{r.entity_id}")

        if r.entity_type in FILE_ENTITY_TYPES:
            return file_map.get(r.entity_id, f"File #{r.entity_id}")

        if r.entity_type == "TEAM":
            return team_map.get(r.entity_id, f"Team #{r.entity_id}")

        return str(r.entity_id)

    # ---------------- RESPONSE ----------------
    return {
        "data": [
            {
                "audit_id": r.audit_id,
                "action_time": r.action_time,
                "action_type": r.action_type,
                "entity_type": r.entity_type,
                "entity_id": r.entity_id,              # raw ID (kept)
                "entity_display": resolve_entity(r),   # ✅ filename / username
                "user": r.username or r.email,
            }
            for r in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/login-history")
def get_login_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
    success: bool | None = Query(None),  # ✅ FILTER

    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    offset = (page - 1) * page_size

    q = (
        db.query(
            LoginHistory.login_id,
            LoginHistory.login_time,
            LoginHistory.login_ip,
            LoginHistory.success,
            LoginHistory.failure_reason,
            User.username.label("username"),
            User.email.label("email"),
        )
        .outerjoin(User, User.user_id == LoginHistory.user_id)
        .order_by(LoginHistory.login_time.desc())
    )

    # ✅ STATUS FILTER
    if success is not None:
        q = q.filter(LoginHistory.success == success)

    total = q.count()
    rows = q.offset(offset).limit(page_size).all()

    return {
        "data": [
            {
                "login_id": r.login_id,
                "login_time": r.login_time,
                "login_ip": r.login_ip,
                "success": r.success,
                "failure_reason": r.failure_reason,
                "user": r.username or r.email or "Unknown",
            }
            for r in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }
