from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.org import Role, UserRole
from app.core.database import get_db
from app.models.org import Role
from app.models.lookup import (
    LogSeverity,
    LogCategory,
    Environment,
)
from app.models.file_format import FileFormat
from app.models.team import Team
from app.models.user_team import UserTeam
from app.core.dependencies import get_current_user
from app.models.lookup import LogSource
from app.models.team_upload_policy import TeamUploadPolicy

router = APIRouter(prefix="/lookups", tags=["Lookups"])


@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    return [
        {
            "role_id": r.role_id,
            "role_name": r.role_name,
            "description": r.description,
        }
        for r in db.query(Role).order_by(Role.role_name).all()
    ]


@router.get("/severities")
def get_severities(db: Session = Depends(get_db)):
    return [
        {
            "severity_id": s.severity_id,
            "severity_code": s.severity_code,
            "severity_level": s.severity_level,
        }
        for s in db.query(LogSeverity).order_by(LogSeverity.severity_level).all()
    ]


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return [
        {
            "category_id": c.category_id,
            "category_name": c.category_name,
        }
        for c in db.query(LogCategory).order_by(LogCategory.category_name).all()
    ]


@router.get("/environments")
def get_environments(db: Session = Depends(get_db)):
    return [
        {
            "environment_id": e.environment_id,
            "environment_code": e.environment_code,
        }
        for e in db.query(Environment).all()
    ]


@router.get("/teams")
def get_teams(db: Session = Depends(get_db)):
    return [
        {
            "team_id": t.team_id,
            "team_name": t.team_name,
        }
        for t in db.query(Team).order_by(Team.team_name).all()
    ]

# lookups.py
@router.get("/my-teams")
def my_teams(db: Session = Depends(get_db), user=Depends(get_current_user)):
    teams = (
        db.query(Team.team_id, Team.team_name)
        .join(UserTeam, UserTeam.team_id == Team.team_id)
        .filter(UserTeam.user_id == user.user_id)
        .all()
    )

    return [
        {"team_id": t.team_id, "team_name": t.team_name}
        for t in teams
    ]


@router.get("/log-sources")
def log_sources(db: Session = Depends(get_db)):
    return db.query(LogSource).all()



def require_admin(db: Session, user_id: int):
    is_admin = (
        db.query(UserRole)
        .join(Role)
        .filter(
            UserRole.user_id == user_id,
            Role.role_name == "ADMIN"
        )
        .first()
    )
    if not is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/teams/{team_id}/allowed-formats")
def get_team_allowed_formats(
    team_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    formats = (
        db.query(FileFormat.format_id, FileFormat.format_name)
        .join(
            TeamUploadPolicy,
            TeamUploadPolicy.format_id == FileFormat.format_id
        )
        .filter(
            TeamUploadPolicy.team_id == team_id,
            TeamUploadPolicy.is_allowed == True
        )
        .all()
    )

    return [
        {
            "format_id": f.format_id,
            "format_name": f.format_name
        }
        for f in formats
    ]