# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.routes.admin_lookup_routes import require_admin
# from app.models.team import Team
# from app.models.user import User
# from app.models.user_team import UserTeam
 
# router = APIRouter(prefix="/admin/teams", tags=["Admin Teams"])


# @router.post("")
# def create_team(
#     name: str,
#     db: Session = Depends(get_db),
#     admin=Depends(require_admin)
# ):
 
#     existing = db.query(Team).filter(Team.team_name == name).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Team already exists")
 
#     team = Team(team_name=name)
#     db.add(team)
#     db.commit()
#     db.refresh(team)
 
#     return {"message": "Team created", "team_id": team.team_id}
 
# # @router.get("")
# # def get_teams(db: Session = Depends(get_db), admin=Depends(require_admin)):
# #     teams = db.query(Team).all()
 
# #     return [
# #         {
# #             "team_id": t.team_id,
# #             "team_name": t.team_name,
# #             "created_at": t.created_at
# #         }
# #         for t in teams
# #     ]

# @router.put("/{team_id}")
# def update_team(team_id: int, name: str,
#                 db: Session = Depends(get_db),
#                 admin=Depends(require_admin)):
 
#     team = db.query(Team).filter(Team.team_id == team_id).first()
#     if not team:
#         raise HTTPException(status_code=404, detail="Team not found")
 
#     team.team_name = name
#     db.commit()
 
#     return {"message": "Team updated"}
 
# @router.delete("/{team_id}")
# def delete_team(team_id: int,
#                 db: Session = Depends(get_db),
#                 admin=Depends(require_admin)):
 
#     team = db.query(Team).filter(Team.team_id == team_id).first()
#     if not team:
#         raise HTTPException(status_code=404, detail="Team not found")
 
#     db.delete(team)
#     db.commit()
 
#     return {"message": "Team deleted"}
 
# @router.post("/{team_id}/users/{user_id}")
# def add_user_to_team(team_id: int,
#                      user_id: int,
#                      db: Session = Depends(get_db),
#                      admin=Depends(require_admin)):
 
#     exists = db.query(UserTeam).filter(
#         UserTeam.user_id == user_id,
#         UserTeam.team_id == team_id
#     ).first()
 
#     if exists:
#         raise HTTPException(status_code=400, detail="User already in team")
 
#     mapping = UserTeam(user_id=user_id, team_id=team_id)
#     db.add(mapping)
#     db.commit()
 
#     return {"message": "User added to team"}
 
# @router.delete("/{team_id}/users/{user_id}")
# def remove_user(team_id: int,
#                 user_id: int,
#                 db: Session = Depends(get_db),
#                 admin=Depends(require_admin)):
 
#     mapping = db.query(UserTeam).filter(
#         UserTeam.user_id == user_id,
#         UserTeam.team_id == team_id
#     ).first()
 
#     if not mapping:
#         raise HTTPException(status_code=404, detail="Mapping not found")
 
#     db.delete(mapping)
#     db.commit()
 
#     return {"message": "User removed from team"}
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.routes.admin_lookup_routes import require_admin

from app.models.team import Team
from app.models.user import User
from app.models.user_team import UserTeam

router = APIRouter(
    prefix="/admin/teams",
    tags=["Admin Teams"]
)

# ------------------------------------------------------
# CREATE TEAM
# ------------------------------------------------------
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


# ------------------------------------------------------
# GET ALL TEAMS
# ------------------------------------------------------
# @router.get("")
# def get_teams(
#     db: Session = Depends(get_db),
#     admin=Depends(require_admin)
# ):
#     teams = db.query(Team).order_by(Team.team_name).all()

#     return [
#         {
#             "team_id": t.team_id,
#             "team_name": t.team_name,
#             "created_at": t.created_at.isoformat() if t.created_at else None
#         }
#         for t in teams
#     ]

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
# ------------------------------------------------------
# UPDATE TEAM
# ------------------------------------------------------
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


# ------------------------------------------------------
# DELETE TEAM (SAFE DELETE)
# ------------------------------------------------------
@router.delete("/{team_id}")
def delete_team(
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

    try:
        db.delete(team)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete team. It is assigned to users."
        )

    return {"message": "Team deleted successfully"}


# ------------------------------------------------------
# GET USERS IN TEAM
# ------------------------------------------------------
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


# ------------------------------------------------------
# ADD USER TO TEAM
# ------------------------------------------------------
@router.post("/{team_id}/users/{user_id}")
def add_user_to_team(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    # Check if team exists
    team = db.query(Team).filter(Team.team_id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if user exists
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if mapping already exists
    exists = db.query(UserTeam).filter(
        UserTeam.user_id == user_id,
        UserTeam.team_id == team_id
    ).first()

    if exists:
        raise HTTPException(
            status_code=400,
            detail="User already in team"
        )

    mapping = UserTeam(user_id=user_id, team_id=team_id)
    db.add(mapping)
    db.commit()

    return {"message": "User added to team successfully"}


# ------------------------------------------------------
# REMOVE USER FROM TEAM
# ------------------------------------------------------
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