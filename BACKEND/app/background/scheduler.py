from apscheduler.schedulers.background import BackgroundScheduler
from app.core.database import SessionLocal
from app.routes.file_routes import archive_old_files
from app.routes.file_routes import purge_soft_deleted_files

def start_scheduler():
    scheduler = BackgroundScheduler(timezone="UTC")

    scheduler.add_job(
        func=run_archive_job,
        trigger="cron",
        hour=2,     # every day at 2 AM
        minute=0,
        id="archive_old_files",
        replace_existing=True
    )

    scheduler.add_job(
        func=run_purge_job,
        trigger="cron",
        hour=3,
        minute=0,
        id="purge_soft_deleted_files",
        replace_existing=True
    )
    scheduler.start()

def run_archive_job():
    db = SessionLocal()
    try:
        archive_old_files(db)
    finally:
        db.close()


def run_purge_job():
    db = SessionLocal()
    try:
        purge_soft_deleted_files(db)
    finally:
        db.close()
