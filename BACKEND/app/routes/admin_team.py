from fastapi import APIRouter, Depends, HTTPException, status,Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.files import RawFile
from app.core.database import get_db
from app.routes.admin_lookup_routes import require_admin

from app.models.team import Team
from app.models.user import User
from app.models.user_team import UserTeam
from app.models.files import RawFile
from app.models.lookup import UploadStatus

router = APIRouter(
    prefix="/admin/teams",
    tags=["Admin Teams"]
)

@router.post("")
def create_team(
    name: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    existing = db.query(Team).filter(Team.team_name == name).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Team already exists"
        )

    team = Team(team_name=name)
    db.add(team)
    db.commit()
    db.refresh(team)

    return {
        "message": "Team created successfully",
        "team_id": team.team_id
    }

@router.get("")
def get_teams(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    teams = db.query(Team).order_by(Team.team_name).all()

    return [
        {
            "team_id": t.team_id,
            "team_name": t.team_name,
            "created_at": (
                t.created_at
            )
        }
        for t in teams
    ]

@router.put("/{team_id}")
def update_team(
    team_id: int,
    name: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    team = db.query(Team).filter(Team.team_id == team_id).first()

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    team.team_name = name
    db.commit()

    return {"message": "Team updated successfully"}


@router.get("/{team_id}/users")
def get_team_users(
    team_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    team = db.query(Team).filter(Team.team_id == team_id).first()

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    users = (
        db.query(User)
        .join(UserTeam, User.user_id == UserTeam.user_id)
        .filter(UserTeam.team_id == team_id)
        .all()
    )

    return [
        {
            "user_id": u.user_id,
            "username": u.username,
            "email": u.email
        }
        for u in users
    ]


@router.post("/{team_id}/users")
def add_user_to_team(
    team_id: int,
    username: str = Query(..., description="Username of the user"),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    # Check if team exists
    team = db.query(Team).filter(Team.team_id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if user exists by username
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User '{username}' does not exist"
        )

    # Check if mapping already exists
    exists = db.query(UserTeam).filter(
        UserTeam.user_id == user.user_id,
        UserTeam.team_id == team_id
    ).first()

    if exists:
        raise HTTPException(
            status_code=400,
            detail="User already in team"
        )

    # Create mapping
    mapping = UserTeam(
        user_id=user.user_id,
        team_id=team_id
    )

    db.add(mapping)
    db.commit()

    return {
        "message": f"User '{username}' added to team successfully"
    }

# REMOVE USER FROM TEAM
@router.delete("/{team_id}/users/{user_id}")
def remove_user_from_team(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    mapping = db.query(UserTeam).filter(
        UserTeam.user_id == user_id,
        UserTeam.team_id == team_id
    ).first()

    if not mapping:
        raise HTTPException(
            status_code=404,
            detail="User is not part of this team"
        )

    db.delete(mapping)
    db.commit()

    return {"message": "User removed from team successfully"}


# GET FILES UPLOADED BY TEAM
@router.get("/{team_id}/files")
def get_team_files(
    team_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    team = db.query(Team).filter(Team.team_id == team_id).first()

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    files = (
        db.query(
            RawFile.file_id,
            RawFile.original_name,
            RawFile.uploaded_at,
            RawFile.file_size_bytes,
            UploadStatus.status_code
        )
        .outerjoin(
            UploadStatus,
            RawFile.status_id == UploadStatus.status_id
        )
        .filter(RawFile.team_id == team_id)
        .order_by(RawFile.uploaded_at.desc())
        .all()
    )

    return {
        "team_id": team.team_id,
        "team_name": team.team_name,
        "total_files": len(files),
        "files": [
            {
                "file_id": f.file_id,
                "file_name": f.original_name,
                "uploaded_at": f.uploaded_at,
                "file_size_kb": round(f.file_size_bytes / 1024, 2),
                "status": f.status_code 
            }
            for f in files
        ]
    }