from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.org import Role,UserRole
from app.models.team import Team



router = APIRouter(
    prefix="/admin",
    tags=["Admin Lookups"]
)

def require_admin(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    is_admin = (
        db.query(UserRole)
        .join(Role, Role.role_id == UserRole.role_id)
        .filter(
            UserRole.user_id == current_user.user_id,
            Role.role_name == "ADMIN"
        )
        .first()
    )

    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user

@router.get("/roles")
def get_roles(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_admin(db, current_user.user_id)

    roles = (
        db.query(Role.role_id, Role.role_name)
        .order_by(Role.role_name)
        .all()
    )

    return [
        {
            "role_id": r.role_id,
            "role_name": r.role_name
        }
        for r in roles
    ]

@router.get("/teams")
def get_teams(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_admin(db, current_user.user_id)

    teams = (
        db.query(Team.team_id, Team.team_name)
        .order_by(Team.team_name)
        .all()
    )

    return [
        {
            "team_id": t.team_id,
            "team_name": t.team_name
        }
        for t in teams
    ]
