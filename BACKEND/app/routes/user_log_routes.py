from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, time,timedelta
from typing import Optional
from sqlalchemy import func,case
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.logs import LogEntry
from app.models.files import RawFile
from app.models.user_team import UserTeam
from app.models.lookup import LogSeverity
from datetime import timezone
router = APIRouter(
    prefix="/user/logs",
    tags=["User Logs"]
)

# @router.get("/summary")
# def logs_summary(
#     days: int = Query(7, ge=1, le=30),
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     start_date = datetime.utcnow() - timedelta(days=days)

#     rows = (
#         db.query(
#             func.date(LogEntry.log_timestamp).label("day"),
#             func.count().label("total_logs"),
#             func.sum(
#                 case(
#                     (LogEntry.severity_id >= 4, 1),
#                     else_=0
#                 )
#             ).label("error_logs"),
#         )
#         .join(RawFile, LogEntry.file_id == RawFile.file_id)
#         .filter(RawFile.uploaded_by == current_user.user_id)
#         .filter(LogEntry.log_timestamp >= start_date)
#         .group_by(func.date(LogEntry.log_timestamp))
#         .order_by(func.date(LogEntry.log_timestamp))
#         .all()
#     )

#     result = []
#     for r in rows:
#         error_percent = (
#             round((r.error_logs / r.total_logs) * 100, 2)
#             if r.total_logs else 0
#         )
#         result.append({
#             "day": r.day.strftime("%d-%m-%Y"),
#             "total_logs": r.total_logs,
#             "error_logs": r.error_logs,
#             "error_percent": error_percent,
#         })

#     return result

@router.get("/summary")
def logs_summary(
    days: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    

    start_date = datetime.now(timezone.utc) - timedelta(days=days)

    rows = (
        db.query(
            func.date(LogEntry.log_timestamp).label("day"),
            func.count().label("total_logs"),
            func.sum(
                case(
                    (LogSeverity.severity_code.in_(["ERROR", "FATAL"]), 1),
                    else_=0
                )
            ).label("error_logs"),
        )
        .join(RawFile, LogEntry.file_id == RawFile.file_id)
        .join(LogSeverity, LogSeverity.severity_id == LogEntry.severity_id)
        .filter(RawFile.uploaded_by == current_user.user_id)
        .filter(LogEntry.log_timestamp >= start_date)
        .group_by(func.date(LogEntry.log_timestamp))
        .order_by(func.date(LogEntry.log_timestamp))
        .all()
    )

    result = []

    for r in rows:
        error_percent = (
            round((r.error_logs / r.total_logs) * 100, 2)
            if r.total_logs else 0
        )

        result.append({
            "day": r.day.strftime("%d-%m-%Y"),
            "total_logs": r.total_logs,
            "error_logs": r.error_logs,
            "error_percent": error_percent,
        })

    return result

@router.get("/search")
def search_my_logs(
    start_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    end_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    category_id: Optional[int] = Query(None),
    severity_id: Optional[int] = Query(None),
    keyword: Optional[str] = Query(None),

    # 🔥 NEW FILTER
    scope: str = Query("team", regex="^(team|mine)$"),

    # pagination
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),

    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    scope = team → logs from all teams user belongs to
    scope = mine → logs from files uploaded by user
    """

    # 1️⃣ Base query
    query = (
        db.query(LogEntry)
        .join(RawFile, LogEntry.file_id == RawFile.file_id)
    )

    # 2️⃣ Scope logic
    if scope == "mine":
        query = query.filter(
            RawFile.uploaded_by == current_user.user_id
        )
    else:
        team_ids_subq = (
            db.query(UserTeam.team_id)
            .filter(UserTeam.user_id == current_user.user_id)
            .subquery()
        )
        query = query.filter(
            RawFile.team_id.in_(team_ids_subq)
        )

    # 3️⃣ Date filters
    if start_date:
        try:
            d = datetime.strptime(start_date, "%d-%m-%Y")
            query = query.filter(
                LogEntry.log_timestamp >= datetime.combine(d.date(), time.min)
            )
        except ValueError:
            raise HTTPException(400, "start_date must be DD-MM-YYYY")

    if end_date:
        try:
            d = datetime.strptime(end_date, "%d-%m-%Y")
            query = query.filter(
                LogEntry.log_timestamp <= datetime.combine(d.date(), time.max)
            )
        except ValueError:
            raise HTTPException(400, "end_date must be DD-MM-YYYY")

    # 4️⃣ Other filters
    if category_id:
        query = query.filter(LogEntry.category_id == category_id)

    if severity_id:
        query = query.filter(LogEntry.severity_id == severity_id)

    if keyword:
        query = query.filter(
            LogEntry.message.ilike(f"%{keyword}%") |
            LogEntry.service_name.ilike(f"%{keyword}%") |
            LogEntry.host_name.ilike(f"%{keyword}%")
        )

    # 5️⃣ Total count
    total = query.count()

    # 6️⃣ Pagination
    offset = (page - 1) * page_size
    logs = (
        query
        .order_by(LogEntry.log_timestamp.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "logs": logs,
        "total": total,
        "page": page,
        "page_size": page_size,
        "scope": scope
    }
