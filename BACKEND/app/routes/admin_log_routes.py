from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, time
from typing import Optional

from app.core.dependencies import get_current_user
from app.models.logs import LogEntry
from app.models.files import RawFile
from app.models.user_team import UserTeam   # optional (if team filtering is needed)
from sqlalchemy import or_

from app.core.database import get_db
from app.routes.admin_lookup_routes import require_admin

router = APIRouter(
    prefix="/admin/logs",
    tags=["Admin Logs"]
)

# @router.get("/search")
# def search_all_logs(
#     # -------- Filters --------
#     start_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
#     end_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
#     category_id: Optional[int] = Query(None),
#     severity_id: Optional[int] = Query(None),
#     keyword: Optional[str] = Query(None),
#     user_id: Optional[int] = Query(None),
#     team_id: Optional[int] = Query(None),
#     file_id: Optional[int] = Query(None),

#     # -------- Pagination --------
#     page: int = Query(1, ge=1),
#     page_size: int = Query(50, ge=1, le=200),

#     db: Session = Depends(get_db),
#     admin = Depends(require_admin)
# ):
#     offset = (page - 1) * page_size

#     query = (
#         db.query(LogEntry)
#         .join(RawFile, LogEntry.file_id == RawFile.file_id)
#         .filter(RawFile.is_deleted == False )
#     )

#     # -------- Filters --------
#     if user_id:
#         query = query.filter(RawFile.uploaded_by == user_id)

#     if team_id:
#         query = query.filter(RawFile.team_id == team_id)

#     if file_id:
#         query = query.filter(LogEntry.file_id == file_id)

#     if start_date:
#         try:
#             d = datetime.strptime(start_date, "%d-%m-%Y")
#             query = query.filter(
#                 LogEntry.log_timestamp >= datetime.combine(d.date(), time.min)
#             )
#         except ValueError:
#             raise HTTPException(400, "start_date must be DD-MM-YYYY")

#     if end_date:
#         try:
#             d = datetime.strptime(end_date, "%d-%m-%Y")
#             query = query.filter(
#                 LogEntry.log_timestamp <= datetime.combine(d.date(), time.max)
#             )
#         except ValueError:
#             raise HTTPException(400, "end_date must be DD-MM-YYYY")

#     if category_id:
#         query = query.filter(LogEntry.category_id == category_id)

#     if severity_id:
#         query = query.filter(LogEntry.severity_id == severity_id)

#     if keyword:
#         query = query.filter(
#             or_(
#                 LogEntry.message.ilike(f"%{keyword}%"),
#                 LogEntry.service_name.ilike(f"%{keyword}%"),
#                 LogEntry.host_name.ilike(f"%{keyword}%")
#             )
#         )

#     # -------- TOTAL COUNT (before pagination) --------
#     total = query.count()

#     # -------- PAGINATED DATA --------
#     logs = (
#         query
#         .order_by(LogEntry.log_timestamp.desc())
#         .offset(offset)
#         .limit(page_size)
#         .all()
#     )
#     # print(logs)
#     # print(logs)
#     return {
#         "data": logs,
#         "total": total,
#         "page": page,
#         "page_size": page_size,
#         "total_pages": (total + page_size - 1) // page_size
#     }

@router.get("/search")
def search_all_logs(
    # -------- Log Filters --------
    start_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    end_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    category_id: Optional[int] = Query(None),
    severity_id: Optional[int] = Query(None),
    keyword: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    team_id: Optional[int] = Query(None),
    file_id: Optional[int] = Query(None),

    # -------- File Filters (ONLY THESE TWO) --------
    file_name: Optional[str] = Query(None),
    file_type: Optional[str] = Query(None),

    # -------- Pagination --------
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),

    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    offset = (page - 1) * page_size

    query = (
        db.query(LogEntry)
        .join(RawFile, LogEntry.file_id == RawFile.file_id)
        .filter(RawFile.is_deleted == False)
    )

    # ---------------- LOG FILTERS ----------------

    if user_id:
        query = query.filter(RawFile.uploaded_by == user_id)

    if team_id:
        query = query.filter(RawFile.team_id == team_id)

    if file_id:
        query = query.filter(LogEntry.file_id == file_id)

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

    if category_id:
        query = query.filter(LogEntry.category_id == category_id)

    if severity_id:
        query = query.filter(LogEntry.severity_id == severity_id)

    if keyword:
        query = query.filter(
            or_(
                LogEntry.message.ilike(f"%{keyword}%"),
                LogEntry.service_name.ilike(f"%{keyword}%"),
                LogEntry.host_name.ilike(f"%{keyword}%")
            )
        )

    # ---------------- FILE FILTERS (ONLY TWO) ----------------

    if file_name:
        query = query.filter(
            RawFile.original_name.ilike(f"%{file_name}%")
        )

    if file_type:
        query = query.filter(
            RawFile.original_name.ilike(f"%.{file_type}")
        )

    # ---------------- COUNT ----------------
    total = query.count()

    # ---------------- PAGINATION ----------------
    logs = (
        query
        .order_by(LogEntry.log_timestamp.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "data": logs,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }
