from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime,timezone
# DB
from app.core.database import get_db

# Auth / security
from app.core.dependencies import get_current_user
from app.routes.lookup_routes import require_admin 

# Models
from app.models.user import User, UserProfile
from app.models.org import Role, UserRole
from app.models.user_team import UserTeam
from app.models.team import Team
from app.models.audit import AuditTrail
from app.schemas.admin_user import AdminUpdateUser

router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"]
)
from fastapi import Query


@router.get("")
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=5, le=100),
    email: str | None = Query(None),
    role: str | None = Query(None),
    team: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_admin(db, current_user.user_id)

    offset = (page - 1) * page_size

    query = db.query(User).filter(User.user_id != current_user.user_id)

    # 🔍 EMAIL FILTER
    if email:
        query = query.filter(User.email.ilike(f"%{email}%"))

    # 🏷 ROLE FILTER
    if role:
        query = (
            query
            .join(UserRole)
            .join(Role)
            .filter(Role.role_name == role)
        )

    # 👥 TEAM FILTER
    if team:
        query = (
            query
            .join(UserTeam)
            .join(Team)
            .filter(Team.team_name == team)
        )

    # ✅ TOTAL COUNT (AFTER FILTERS)
    total = query.group_by(User.user_id).count()

    # ✅ USERS QUERY (NO DISTINCT!)
    users = (
        query
        .group_by(User.user_id)
        .order_by(User.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # ---- SERIALIZE ----
    result = []

    for u in users:
        roles = (
            db.query(Role.role_name)
            .join(UserRole)
            .filter(UserRole.user_id == u.user_id)
            .all()
        )

        teams = (
            db.query(Team.team_name)
            .join(UserTeam)
            .filter(UserTeam.user_id == u.user_id)
            .all()
        )

        result.append({
            "user_id": u.user_id,
            "email": u.email,
            "username": u.username,
            "is_active": u.is_active,
            "is_deleted": u.is_deleted,
            "created_at": u.created_at,
            "roles": [r.role_name for r in roles],
            "teams": [t.team_name for t in teams],
        })

    return {
        "data": result,
        "page": page,
        "page_size": page_size,
        "total": total,
    }


@router.get("/{user_id}")
def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_admin(db, current_user.user_id)

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == user_id)
        .first()
    )

    roles = (
        db.query(Role.role_id, Role.role_name)
        .join(UserRole)
        .filter(UserRole.user_id == user_id)
        .all()
    )

    teams = (
        db.query(Team.team_id, Team.team_name)
        .join(UserTeam)
        .filter(UserTeam.user_id == user_id)
        .all()
    )

    return {
        "user_id": user.user_id,
        "email": user.email,
        "username": user.username,
        "is_active": user.is_active,
        "is_deleted": user.is_deleted,
         "profile": {
            "first_name": profile.first_name if profile else None,
            "last_name": profile.last_name if profile else None,
            "phone_number": profile.phone_number if profile else None,
            "job_title": profile.job_title if profile else None,
        },
         # ✅ SERIALIZED ROLES
        "roles": [
            {"role_id": r.role_id, "role_name": r.role_name}
            for r in roles
        ],

        # ✅ SERIALIZED TEAMS
        "teams": [
            {"team_id": t.team_id, "team_name": t.team_name}
            for t in teams
        ],
    }


@router.patch("/{user_id}/status")
def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_admin(db, current_user.user_id)

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    user.is_active = is_active

    db.add(AuditTrail(
        user_id=current_user.user_id,
        action_type="UPDATE_USER_STATUS",
        entity_type="USER",
        entity_id=user_id
    ))

    db.commit()

    return {"message": "User status updated"}

@router.delete("/{user_id}/delete")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_user)
):
    require_admin(db,current_admin.user_id)
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(404, "User not found")

    if user.is_deleted:
        return {"message": "User already deleted"}

    user.is_deleted = True
    user.is_active = False

    db.add(AuditTrail(
        user_id=current_admin.user_id,
        action_type="DELETE_USER",
        entity_type="USER",
        entity_id=user.user_id,
        action_time=datetime.now(timezone.utc)
    ))

    db.commit()
    return {"message": "User deleted successfully"}

@router.patch("/{user_id}/restore")
def restore_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_user)
):
    require_admin(db, current_admin.user_id)
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(404, "User not found")

    if not user.is_deleted:
        raise HTTPException(400, "User is not deleted")

    user.is_deleted = False
    user.is_active = True

    db.add(AuditTrail(
        user_id=current_admin.user_id,
        action_type="RESTORE_USER",
        entity_type="USER",
        entity_id=user.user_id,
        action_time=datetime.now(timezone.utc)
    ))

    db.commit()
    return {"message": "User restored successfully"}


@router.put("/{user_id}")
def update_user(
    user_id: int,
    payload: AdminUpdateUser,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_admin(db, current_user.user_id)

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    # -------- USER --------
    if payload.is_active is not None:
        user.is_active = payload.is_active

    # -------- PROFILE --------
    profile = db.query(UserProfile).filter_by(user_id=user_id).first()
    if profile:
        for field in ["first_name", "last_name", "phone_number", "job_title"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(profile, field, value)

    # -------- ROLES --------
    if payload.roles is not None:
        db.query(UserRole).filter(UserRole.user_id == user_id).delete()

        roles = db.query(Role).filter(Role.role_name.in_(payload.roles)).all()
        for r in roles:
            db.add(UserRole(user_id=user_id, role_id=r.role_id))

    # -------- TEAMS --------
    if payload.teams is not None:
        db.query(UserTeam).filter(UserTeam.user_id == user_id).delete()

        for team_id in payload.teams:
            db.add(UserTeam(user_id=user_id, team_id=team_id))

    # -------- AUDIT --------
    db.add(AuditTrail(
        user_id=current_user.user_id,
        action_type="UPDATE_USER",
        entity_type="USER",
        entity_id=user_id
    ))

    db.commit()
    return {"message": "User updated successfully"}
