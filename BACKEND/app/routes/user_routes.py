from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime,timedelta
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User, UserProfile
from app.models.org import Role, UserRole
from app.models.user_team import UserTeam
from app.models.team import Team
from app.core.database import get_db
from app.schemas.user import AdminCreateUserRequest
from app.schemas.user_profile import UpdateMyProfileRequest
from app.models.audit import AuditTrail
from app.services.user_service import create_user_by_admin
from sqlalchemy import func,case
from app.models.logs import LogEntry
from app.models.lookup import LogSeverity as Severity
from app.models.files import RawFile
router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Roles
    roles = (
        db.query(Role.role_name)
        .join(UserRole, UserRole.role_id == Role.role_id)
        .filter(UserRole.user_id == current_user.user_id)
        .all()
    )

    # Teams
    teams = (
        db.query(Team.team_name)
        .join(UserTeam, UserTeam.team_id == Team.team_id)
        .filter(UserTeam.user_id == current_user.user_id)
        .all()
    )

    # Profile (optional)
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.user_id)
        .first()
    )

    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "username": current_user.username,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,

        "roles": [r.role_name for r in roles],
        "teams": [t.team_name for t in teams],

        "profile": {
            "first_name": profile.first_name if profile else "",
            "last_name": profile.last_name if profile else "",
            "phone_number": profile.phone_number if profile else "",
            "job_title": profile.job_title if profile else "",
            "profile_image_url": profile.profile_image_url if profile else "",
        }
    }


@router.get("/me/profile")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.user_id)
        .first()
    )

    teams = (
        db.query(Team.team_name)
        .join(UserTeam, UserTeam.team_id == Team.team_id)
        .filter(UserTeam.user_id == current_user.user_id)
        .all()
    )

    return {
        "first_name": profile.first_name if profile else "",
        "last_name": profile.last_name if profile else "",
        "phone_number": profile.phone_number if profile else "",
        "job_title": profile.job_title if profile else "",
        "profile_image_url": profile.profile_image_url if profile else "",
        "teams": [t.team_name for t in teams],  # 👈 VIEW ONLY
    }



@router.put("/me/profile")
def update_my_profile(
    payload: UpdateMyProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.user_id)
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Update only provided fields
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    db.add(AuditTrail(
        user_id=current_user.user_id,
        action_type="UPDATE_PROFILE",
        entity_type="USER_PROFILE",
        entity_id=profile.profile_id
    ))

    db.commit()
    db.refresh(profile)

    return {
        "message": "Profile updated successfully",
        "profile": {
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "phone_number": profile.phone_number,
            "job_title": profile.job_title,
            "profile_image_url": profile.profile_image_url
        }
    }


@router.post("/admin/create")
def admin_create_user(
    payload: AdminCreateUserRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)   # ✅ JWT user
):
    result = create_user_by_admin(
        db=db,
        admin_user_id=current_user.user_id,   # ✅ derived from JWT
        payload=payload
    )

    return {
        "message": "User created successfully",
        **result
    }




@router.get("/me/logs/summary")
def my_log_summary(
    days: int = 5,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=days)

    stats = (
        db.query(
            func.date(LogEntry.log_timestamp).label("day"),
            func.count().label("total_logs"),
            func.sum(
                case(
                    (Severity.severity_code == "ERROR", 1),
                    else_=0
                )
            ).label("error_logs")
        )
        .join(RawFile, RawFile.file_id == LogEntry.file_id)
        .join(Severity, Severity.severity_id == LogEntry.severity_id)
        .filter(
            RawFile.uploaded_by == current_user.user_id,
            LogEntry.log_timestamp >= since
        )
        .group_by("day")
        .order_by("day")
        .all()
    )

    return [
        {
            "day": r.day,
            "total_logs": r.total_logs,
            "error_logs": r.error_logs,
            "error_percent": round((r.error_logs / r.total_logs) * 100, 2)
            if r.total_logs else 0
        }
        for r in stats
    ]
