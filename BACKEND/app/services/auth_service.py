from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.models.auth import UserCredential, LoginHistory
from app.core.security import verify_password

from app.models.auth import UserCredential
from app.core.security import verify_password, hash_password

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.models.auth import UserCredential, LoginHistory
from app.core.security import verify_password, create_access_token

MAX_FAILED_ATTEMPTS = 5
LOCK_DURATION_MINUTES = 15
DUMMY_USER_ID = -1
credentials = None

def login_user(
    *,
    db: Session,
    email: str,
    password: str,
    ip_address: str,
    user_agent: str
):
    now = datetime.now(timezone.utc)

    user = db.query(User).filter(
        User.email == email,
        User.is_deleted == False
    ).first()

    if not user:
        db.add(LoginHistory(
            user_id=None,
            login_ip=ip_address,
            user_agent=user_agent,
            success=False,
            failure_reason="INVALID_CREDENTIALS"
        ))
        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    
    #  ACCOUNT DISABLED
      if not user.is_active:
        db.add(LoginHistory(
            user_id=user.user_id,
            login_ip=ip_address,
            user_agent=user_agent,
            success=False,
            failure_reason="ACCOUNT_DISABLED"
        ))
        db.commit()

        raise HTTPException(
            status_code=403,
            detail="Account disabled"
        )

    credentials = db.query(UserCredential).filter(
        UserCredential.user_id == user.user_id
    ).first()

    if not credentials:
        db.add(LoginHistory(
            user_id=user.user_id,
            login_ip=ip_address,
            user_agent=user_agent,
            success=False,
            failure_reason="AUTH_SYSTEM_ERROR"
        ))
        db.commit()

        raise HTTPException(
            status_code=500,
            detail="Authentication system error"
        )

    # AUTO UNLOCK IF TIME EXPIRED
    if (
        credentials.is_locked
        and credentials.locked_until
        and credentials.locked_until <= now
    ):
        credentials.is_locked = False
        credentials.failed_attempts = 0
        credentials.locked_until = None

    # ACCOUNT LOCKED
    if (
        credentials.is_locked
        and credentials.locked_until
        and credentials.locked_until > now
    ):
        db.add(LoginHistory(
            user_id=user.user_id,
            login_ip=ip_address,
            user_agent=user_agent,
            success=False,
            failure_reason="ACCOUNT_LOCKED"
        ))
        db.commit()

        raise HTTPException(
            status_code=403,
            detail=f"Account locked until {credentials.locked_until}"
        )

    # INVALID PASSWORD
    if not verify_password(password, credentials.password_hash):
        credentials.failed_attempts += 1
        credentials.last_failed_at = now

        if credentials.failed_attempts >= MAX_FAILED_ATTEMPTS:
            credentials.is_locked = True
            credentials.locked_until = now + timedelta(minutes=LOCK_DURATION_MINUTES)

        db.add(LoginHistory(
            user_id=user.user_id,
            login_ip=ip_address,
            user_agent=user_agent,
            success=False,
            failure_reason="INVALID_CREDENTIALS"
        ))

        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    # SUCCESS LOGIN
    credentials.failed_attempts = 0
    credentials.is_locked = False
    credentials.locked_until = None
    credentials.last_failed_at = None

    access_token = create_access_token(
        data={"sub": str(user.user_id)},
        expires_delta=timedelta(minutes=30)
    )

    db.add(LoginHistory(
        user_id=user.user_id,
        login_ip=ip_address,
        user_agent=user_agent,
        success=True,
        failure_reason=None
    ))

    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "email": user.email,
            "username": user.username,
        }
    }

def change_password(
    *,
    db: Session,
    user_id: int,
    old_password: str,
    new_password: str
):
    credentials = db.query(UserCredential).filter(
        UserCredential.user_id == user_id
    ).first()

    if not credentials:
        raise HTTPException(status_code=404, detail="Credentials not found")

    # Verify old password
    if not verify_password(old_password, credentials.password_hash):
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    # Prevent reusing same password
    if verify_password(new_password, credentials.password_hash):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from old password"
        )

    # Hash new password
    credentials.password_hash = hash_password(new_password)

    # Update password change timestamp
    credentials.password_changed_at = datetime.now(timezone.utc)

    #  Reset security counters
    credentials.failed_attempts = 0
    credentials.is_locked = False
    credentials.locked_until = None

    db.commit()

    return {"message": "Password changed successfully"}

