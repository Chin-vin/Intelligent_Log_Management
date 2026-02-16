from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
# from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.database import get_db
from app.schemas.auth import LoginRequest, ChangePasswordRequest
from app.services.auth_service import login_user, change_password
from app.core.dependencies import get_current_user


router = APIRouter(prefix="/auth", tags=["Authentication"])




@router.post("/login", status_code=status.HTTP_200_OK)
def login(
    request: Request,
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(
        db=db,
        email=payload.email,
        password=payload.password,
        ip_address=request.client.host if request.client else "unknown",
        user_agent=request.headers.get("user-agent", "unknown"),
    )

@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password_route(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return change_password(
        db=db,
        user_id=current_user.user_id,
        old_password=data.old_password,
        new_password=data.new_password
    )
