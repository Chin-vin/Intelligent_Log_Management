from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.files import RawFile
from app.models.logs import LogEntry
from app.models.lookup import LogSeverity

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
@router.get("/overview")
def dashboard_overview(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    # 1️⃣ Total files uploaded by user
    total_files = (
        db.query(func.count(RawFile.file_id))
        .filter(RawFile.uploaded_by == current_user.user_id)
        .scalar()
    )

    # 2️⃣ Total logs generated from user's files
    total_logs = (
        db.query(func.count(LogEntry.log_id))
        .join(RawFile, RawFile.file_id == LogEntry.file_id)
        .filter(RawFile.uploaded_by == current_user.user_id)
        .scalar()
    )

    # 3️⃣ Error + Fatal logs
    error_logs = (
        db.query(func.count(LogEntry.log_id))
        .join(RawFile, RawFile.file_id == LogEntry.file_id)
        .join(LogSeverity, LogSeverity.severity_id == LogEntry.severity_id)
        .filter(
            RawFile.uploaded_by == current_user.user_id,
            LogSeverity.severity_code.in_(["ERROR", "FATAL"])
        )
        .scalar()
    )

    # 4️⃣ Last upload timestamp
    last_upload_at = (
        db.query(func.max(RawFile.uploaded_at))
        .filter(RawFile.uploaded_by == current_user.user_id)
        .scalar()
    )

    return {
        "total_files": total_files or 0,
        "total_logs": total_logs or 0,
        "error_logs": error_logs or 0,
        "last_upload_at": last_upload_at,
    }
