from app.core.database import SessionLocal
from app.services.archive_service import archive_old_files
from app.models.users import User

def main():
    db = SessionLocal()
    try:
        # ✅ SYSTEM USER (or service account)
        system_user = db.query(User).filter(
            User.username == "system"
        ).first()

        if not system_user:
            raise Exception("System user not found")

        archive_old_files(db=db, user=system_user)

    finally:
        db.close()

if __name__ == "__main__":
    main()
