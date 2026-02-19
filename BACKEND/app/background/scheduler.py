# from apscheduler.schedulers.background import BackgroundScheduler
# from app.core.database import SessionLocal
# from app.routes.file_routes import archive_old_files
# from app.routes.file_routes import purge_soft_deleted_files

# def start_scheduler():
#     scheduler = BackgroundScheduler(timezone="UTC")

#     scheduler.add_job(
#         func=run_archive_job,
#         trigger="cron",
#         hour=2,     # every day at 2 AM
#         minute=0,
#         id="archive_old_files",
#         replace_existing=True
#     )

#     scheduler.add_job(
#         func=run_purge_job,
#         trigger="cron",
#         hour=3,
#         minute=0,
#         id="purge_soft_deleted_files",
#         replace_existing=True
#     )
#     scheduler.start()

# # def run_archive_job():
# #     db = SessionLocal()
# #     try:
# #         archive_old_files(db)
# #     finally:
# #         db.close()


# # def run_purge_job():
# #     db = SessionLocal()
# #     try:
# #         purge_soft_deleted_files(db)
# #     finally:
# #         db.close()
# def run_archive_job():
#     print("🔥 ARCHIVE JOB STARTED")
#     db = SessionLocal()
#     try:
#         archive_old_files(db)
#         print("✅ ARCHIVE JOB COMPLETED")
#     except Exception as e:
#         print("❌ ARCHIVE ERROR:", e)
#     finally:
#         db.close()


# def run_purge_job():
#     print("🔥 PURGE JOB STARTED")
#     db = SessionLocal()
#     try:
#         purge_soft_deleted_files(db)
#         print("✅ PURGE JOB COMPLETED")
#     except Exception as e:
#         print("❌ PURGE ERROR:", e)
#     finally:
#         db.close()
from apscheduler.schedulers.background import BackgroundScheduler
from app.core.database import SessionLocal
from app.routes.file_routes import archive_old_files, purge_soft_deleted_files
from datetime import datetime, timedelta

def run_archive_job():
    print("🔥 ARCHIVE JOB STARTED")
    db = SessionLocal()
    try:
        archive_old_files(db)
        print("✅ ARCHIVE JOB COMPLETED")
    except Exception as e:
        print("❌ ARCHIVE ERROR:", e)
    finally:
        db.close()

def run_purge_job():
    print("🔥 PURGE JOB STARTED")
    db = SessionLocal()
    try:
        purge_soft_deleted_files(db)
        print("✅ PURGE JOB COMPLETED")
    except Exception as e:
        print("❌ PURGE ERROR:", e)
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler(timezone="UTC")

    scheduler.add_job(
        func=run_archive_job,
        trigger="date",
        run_date=datetime.utcnow() + timedelta(seconds=5),
        id="archive_old_files",
        replace_existing=True
    )

    scheduler.add_job(
        func=run_purge_job,
        trigger="date",
        run_date=datetime.utcnow() + timedelta(seconds=10),
        id="purge_soft_deleted_files",
        replace_existing=True
    )

    scheduler.start()
    print("📅 Scheduler started")
