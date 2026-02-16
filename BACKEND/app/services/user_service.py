import secrets
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timezone
from app.core.security import hash_password

# ✅ Import MODEL CLASSES
from app.models.user import User, UserProfile
from app.models.auth import UserCredential
from app.models.org import UserRole, Role   # 🔥 Role added
from app.models.user_team import UserTeam
# from app.models.audit import audit_logs 
from app.models.audit import AuditTrail

def create_user_by_admin(
    *,
    db: Session,
    admin_user_id: int,
    payload
):
    # 1️⃣ Verify ADMIN role (CORRECT way)
    is_admin = (
        db.query(UserRole)
        .join(Role, Role.role_id == UserRole.role_id)
        .filter(
            UserRole.user_id == admin_user_id,
            Role.role_name == "ADMIN"
        )
        .first()
    )

    if not is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # 2️⃣ Check email uniqueness
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # ✅ NEW: Check username uniqueness
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already exists try different one!")

    # 3️⃣ Generate temporary password
    temp_password = secrets.token_urlsafe(10)

    try:
        # 4️⃣ Create User
        user = User(
            email=payload.email,
            username=payload.username,
            is_active=True,
            is_deleted=False
        )
        db.add(user)
        db.flush()  # get user_id

        # 5️⃣ Create User Profile
        db.add(UserProfile(
            user_id=user.user_id,
            first_name=payload.first_name,
            last_name=payload.last_name,
            phone_number=payload.phone_number,
            profile_image_url=payload.profile_image_url,
            job_title=payload.job_title
        ))
        print(temp_password)
        # 6️⃣ Create User Credentials
        db.add(UserCredential(
            user_id=user.user_id,
            password_hash=hash_password(temp_password),
            password_algo="bcrypt"
        ))

        # 7️⃣ Assign MULTIPLE roles
        for role_id in payload.role_ids:
            db.add(UserRole(
                user_id=user.user_id,
                role_id=role_id
            ))

        # 8️⃣ Assign MULTIPLE teams
        for team_id in payload.team_ids:
            db.add(UserTeam(
                user_id=user.user_id,
                team_id=team_id
            ))

        db.add(AuditTrail(
            user_id=admin_user_id,          # ADMIN (actor)
            action_type="CREATE_USER",
            entity_type="USER",
            entity_id=user.user_id,          # newly created user
            action_time=datetime.now(timezone.utc)
        ))
        
       
        db.commit()

    except Exception:
        db.rollback()
        raise

    return {
        "user_id": user.user_id,
        "temporary_password": temp_password
    }
