from fastapi import APIRouter, Depends, Query,  HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.models.logs import LogEntry
from sqlalchemy import func
from app.core.database import get_db
from app.models.logs import LogEntry
from app.models.lookup import LogSeverity   # 👈 correct severity lookup table
from datetime import datetime, timedelta, timezone, time,date
from sqlalchemy import func
from app.models.logs import LogEntry
from app.models.lookup import LogCategory, LogSeverity, Environment

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.get("/search")
def search_logs(
    range: Optional[str] = Query("all", description="all,7d,10d,30d"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    severity_id: Optional[int] = Query(None),
    keyword: Optional[str] = Query(None),

    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=5, le=100),

    db: Session = Depends(get_db),
):
    query = db.query(LogEntry)

    # 🔹 RANGE FILTER (ONLY IF NOT 'all')
    if range and range != "all":
        try:
            days = int(range.rstrip("d"))
            from_date = datetime.utcnow() - timedelta(days=days)
            query = query.filter(LogEntry.log_timestamp >= from_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid range format")

    # 🔹 MANUAL DATE RANGE (overrides range)
    if start_date:
        start = datetime.strptime(start_date, "%d-%m-%Y")
        query = query.filter(
            LogEntry.log_timestamp >= datetime.combine(start.date(), time.min)
        )

    if end_date:
        end = datetime.strptime(end_date, "%d-%m-%Y")
        query = query.filter(
            LogEntry.log_timestamp <= datetime.combine(end.date(), time.max)
        )

    # 🔹 OTHER FILTERS
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

    total = query.count()

    logs = (
        query
        .order_by(LogEntry.log_timestamp.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "data": logs,
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.get("/summary/logs-per-day")
def logs_per_day(
    range: Optional[str] = Query(None, description="7d,10d,30d,90d,all"),
    start_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    end_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=5, le=50),
    db: Session = Depends(get_db),
):
    query = (
        db.query(
            func.date(LogEntry.log_timestamp).label("day"),
            func.count(LogEntry.log_id).label("total_logs")
        )
        .group_by(func.date(LogEntry.log_timestamp))
    )

    # ---------- RANGE FILTER ----------
    if range and range != "all":
        try:
            days = int(range.rstrip("d"))
            from_date = datetime.utcnow() - timedelta(days=days)
            query = query.filter(LogEntry.log_timestamp >= from_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid range format")

    # ---------- CUSTOM DATE FILTER ----------
    if start_date:
        start = datetime.strptime(start_date, "%d-%m-%Y")
        query = query.filter(LogEntry.log_timestamp >= start)

    if end_date:
        end = datetime.strptime(end_date, "%d-%m-%Y")
        query = query.filter(LogEntry.log_timestamp <= end)

    # ---------- TOTAL (AFTER GROUP BY) ----------
    total = query.count()

    # ---------- PAGINATION ----------
    rows = (
        query
        .order_by(func.date(LogEntry.log_timestamp).desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "data": [
            {
                "date": row.day.strftime("%d-%m-%Y"),
                "total_logs": row.total_logs
            }
            for row in rows
        ],
        "page": page,
        "page_size": page_size,
        "total": total
    }


@router.get("/summary/top-errors")
def top_error_types(
    range: Optional[str] = Query("all", description="all,7d,10d,30d,90d"),
    start_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    end_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=5, le=50),
    db: Session = Depends(get_db),
):
    """
    Returns most frequent ERROR / FATAL messages.
    Supports:
    - quick time range
    - custom date range
    - pagination
    """

    # ---------- BASE QUERY ----------
    base_query = (
        db.query(
            LogEntry.message.label("message"),
            func.count(LogEntry.log_id).label("count")
        )
        .join(
            LogSeverity,
            LogEntry.severity_id == LogSeverity.severity_id
        )
        .filter(LogSeverity.severity_code.in_(["ERROR", "FATAL"]))
    )

    # ---------- RANGE FILTER ----------
    if range and range != "all":
        try:
            days = int(range.rstrip("d"))
            from_date = datetime.utcnow() - timedelta(days=days)
            base_query = base_query.filter(
                LogEntry.log_timestamp >= from_date
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid range format")

    # ---------- CUSTOM DATE RANGE ----------
    if start_date:
        try:
            start = datetime.strptime(start_date, "%d-%m-%Y")
            base_query = base_query.filter(
                LogEntry.log_timestamp >= start
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid start_date format (expected DD-MM-YYYY)"
            )

    if end_date:
        try:
            # +1 day to include full end date
            end = datetime.strptime(end_date, "%d-%m-%Y") + timedelta(days=1)
            base_query = base_query.filter(
                LogEntry.log_timestamp < end
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid end_date format (expected DD-MM-YYYY)"
            )

    # ---------- GROUP & ORDER ----------
    grouped_query = (
        base_query
        .group_by(LogEntry.message)
        .order_by(func.count(LogEntry.log_id).desc())
    )

    # ---------- TOTAL ----------
    total = grouped_query.count()

    # ---------- PAGINATION ----------
    rows = (
        grouped_query
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "data": [
            {
                "message": row.message,
                "count": row.count
            }
            for row in rows
        ],
        "page": page,
        "page_size": page_size,
        "total": total
    }


# @router.get("/summary/active-systems")
# def most_active_systems(
#     range: Optional[str] = Query("all", description="all,7d,10d,30d,90d"),
#     host: Optional[str] = Query(None, description="Host name search"),
#     start_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
#     end_date: Optional[str] = Query(None, description="DD-MM-YYYY"),
#     page: int = Query(1, ge=1),
#     page_size: int = Query(10, ge=5, le=50),
#     db: Session = Depends(get_db),
# ):
#     """
#     Returns most active systems grouped by host name.
#     Supports:
#     - time range (7d, 30d, etc.)
#     - host search (ILIKE)
#     - custom date range
#     - pagination
#     """

#     # ---------- BASE QUERY ----------
#     base_query = (
#         db.query(
#             LogEntry.host_name.label("host"),
#             func.count(LogEntry.log_id).label("log_count")
#         )
#         .filter(LogEntry.host_name.isnot(None))
#     )

#     # ---------- RANGE FILTER ----------
#     if range and range != "all":
#         try:
#             days = int(range.rstrip("d"))
#             from_date = datetime.utcnow() - timedelta(days=days)
#             base_query = base_query.filter(
#                 LogEntry.log_timestamp >= from_date
#             )
#         except ValueError:
#             raise HTTPException(status_code=400, detail="Invalid range format")

#     # ---------- HOST SEARCH ----------
#     if host:
#         base_query = base_query.filter(
#             LogEntry.host_name.ilike(f"%{host}%")
#         )

#     # ---------- CUSTOM DATE RANGE ----------
#     if start_date:
#         try:
#             start = datetime.strptime(start_date, "%d-%m-%Y")
#             base_query = base_query.filter(
#                 LogEntry.log_timestamp >= start
#             )
#         except ValueError:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Invalid start_date format (expected DD-MM-YYYY)"
#             )

#     if end_date:
#         try:
#             end = datetime.strptime(end_date, "%d-%m-%Y") + timedelta(days=1)
#             base_query = base_query.filter(
#                 LogEntry.log_timestamp < end
#             )
#         except ValueError:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Invalid end_date format (expected DD-MM-YYYY)"
#             )

#     # ---------- GROUP & ORDER ----------
#     grouped_query = (
#         base_query
#         .group_by(LogEntry.host_name)
#         .order_by(func.count(LogEntry.log_id).desc())
#     )

#     # ---------- TOTAL (AFTER GROUPING) ----------
#     total = grouped_query.count()

#     # ---------- PAGINATION ----------
#     rows = (
#         grouped_query
#         .offset((page - 1) * page_size)
#         .limit(page_size)
#         .all()
#     )

#     return {
#         "data": [
#             {
#                 "host": row.host,
#                 "log_count": row.log_count
#             }
#             for row in rows
#         ],
#         "page": page,
#         "page_size": page_size,
#         "total": total
#     }
@router.get("/summary/active-systems")
def most_active_systems(
    range: Optional[str] = Query("all"),
    host: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=5, le=100),
    db: Session = Depends(get_db),
):

    base_query = (
        db.query(
            LogEntry.host_name.label("host"),
            func.count(LogEntry.log_id).label("log_count")
        )
        .filter(LogEntry.host_name.isnot(None))
    )

    # RANGE
    if range and range != "all":
        days = int(range.rstrip("d"))
        from_date = datetime.utcnow() - timedelta(days=days)
        base_query = base_query.filter(
            LogEntry.log_timestamp >= from_date
        )

    # HOST SEARCH
    if host:
        base_query = base_query.filter(
            LogEntry.host_name.ilike(f"%{host}%")
        )

    # DATE RANGE
    if start_date:
        start = datetime.strptime(start_date, "%d-%m-%Y")
        base_query = base_query.filter(
            LogEntry.log_timestamp >= start
        )

    if end_date:
        end = datetime.strptime(end_date, "%d-%m-%Y") + timedelta(days=1)
        base_query = base_query.filter(
            LogEntry.log_timestamp < end
        )

    grouped_query = (
        base_query
        .group_by(LogEntry.host_name)
        .order_by(func.count(LogEntry.log_id).desc())
    )

    # SAFE COUNT
    all_rows = grouped_query.all()
    total = len(all_rows)

    # SAFE PAGINATION
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_rows = all_rows[start_index:end_index]

    return {
        "data": [
            {
                "host": row.host,
                "log_count": row.log_count
            }
            for row in paginated_rows
        ],
        "page": page,
        "page_size": page_size,
        "total": total
    }


# @router.get("/summary/severity-per-day/all")
# def severity_per_day_all(
#     range: Optional[str] = Query(None),
#     start_date: Optional[str] = Query(None),
#     end_date: Optional[str] = Query(None),
#     page: int = Query(1, ge=1),
#     page_size: int = Query(10, ge=5, le=100),
#     db: Session = Depends(get_db),
# # ):
# #     # -------- BASE QUERY --------
# #     base_query = (
# #         db.query(
# #             func.date(LogEntry.log_timestamp).label("day"),
# #             LogSeverity.severity_code.label("severity"),
# #             func.count(LogEntry.log_id).label("log_count"),
# #         )
# #         .join(LogSeverity, LogEntry.severity_id == LogSeverity.severity_id)
# #     )

# #     # -------- QUICK RANGE FILTER --------
# #     if range and range != "all":
# #         try:
# #             days = int(range.rstrip("d"))
# #             from_date = datetime.now(timezone.utc) - timedelta(days=days)
# #             base_query = base_query.filter(
# #                 LogEntry.log_timestamp >= from_date
# #             )
# #         except ValueError:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Invalid range format"
# #             )

# #     # -------- CUSTOM DATE FILTER --------
# #     if start_date:
# #         try:
# #             start = datetime.strptime(start_date, "%d-%m-%Y")
# #             base_query = base_query.filter(
# #                 LogEntry.log_timestamp >= start
# #             )
# #         except ValueError:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Invalid start_date format (DD-MM-YYYY)"
# #             )

# #     if end_date:
# #         try:
# #             end = datetime.strptime(end_date, "%d-%m-%Y") + timedelta(days=1)
# #             base_query = base_query.filter(
# #                 LogEntry.log_timestamp < end
# #             )
# #         except ValueError:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Invalid end_date format (DD-MM-YYYY)"
# #             )

# #     # -------- GROUP & ORDER --------
# #     grouped_query = (
# #         base_query
# #         .group_by(
# #             func.date(LogEntry.log_timestamp),
# #             LogSeverity.severity_code
# #         )
# #         .order_by(func.date(LogEntry.log_timestamp).desc())
# #     )

# #     # -------- EXECUTE FULL RESULT --------
# #     all_rows = grouped_query.all()
# #     total = len(all_rows)

# #     # -------- PAGINATION (SAFE SLICE) --------
# #     start_index = (page - 1) * page_size
# #     end_index = start_index + page_size
# #     paginated_rows = all_rows[start_index:end_index]

# #     return {
# #         "data": [
# #             {
# #                 "day": row.day.isoformat(),
# #                 "severity": row.severity,
# #                 "count": row.log_count
# #             }
# #             for row in paginated_rows
# #         ],
# #         "page": page,
# #         "page_size": page_size,
# #         "total": total
# #     }
# @router.get("/summary/severity-trend")
# def severity_trend(
#     range: Optional[str] = Query("all"),
#     start_date: Optional[str] = Query(None),
#     end_date: Optional[str] = Query(None),
#     page: int = Query(1, ge=1),
#     page_size: int = Query(20, ge=5, le=200),
#     db: Session = Depends(get_db),
# ):
#     from datetime import datetime, timedelta

#     base_query = db.query(
#         LogEntry.log_timestamp,
#         LogSeverity.severity_code.label("severity")
#     ).join(
#         LogSeverity,
#         LogEntry.severity_id == LogSeverity.severity_id
#     )

#     now = datetime.utcnow()
#     from_date = None

#     # ---------- RANGE FILTER ----------
#     if range and range != "all":
#         days = int(range.rstrip("d"))
#         from_date = now - timedelta(days=days)
#         base_query = base_query.filter(
#             LogEntry.log_timestamp >= from_date
#         )

#     # ---------- CUSTOM DATE FILTER ----------
#     if start_date:
#         from_date = datetime.strptime(start_date, "%d-%m-%Y")
#         base_query = base_query.filter(
#             LogEntry.log_timestamp >= from_date
#         )

#     if end_date:
#         end = datetime.strptime(end_date, "%d-%m-%Y") + timedelta(days=1)
#         base_query = base_query.filter(
#             LogEntry.log_timestamp < end
#         )

#     # ---------- DYNAMIC AGGREGATION ----------
#     aggregation = "day"

#     if from_date:
#         diff_days = (now - from_date).days

#         if diff_days > 90:
#             aggregation = "month"
#         elif diff_days > 15:
#             aggregation = "week"

#     if aggregation == "day":
#         period = func.date(LogEntry.log_timestamp)
#     elif aggregation == "week":
#         period = func.date_trunc("week", LogEntry.log_timestamp)
#     else:
#         period = func.date_trunc("month", LogEntry.log_timestamp)

#     grouped_query = (
#         db.query(
#             period.label("period"),
#             LogSeverity.severity_code.label("severity"),
#             func.count(LogEntry.log_id).label("count")
#         )
#         .join(LogSeverity, LogEntry.severity_id == LogSeverity.severity_id)
#         .filter(
#             LogEntry.log_timestamp >= from_date if from_date else True
#         )
#         .group_by(period, LogSeverity.severity_code)
#         .order_by(period)
#     )

#     # ---------- SAFE TOTAL COUNT ----------
#     all_rows = grouped_query.all()
#     total = len(all_rows)

#     # ---------- SAFE PAGINATION ----------
#     start_index = (page - 1) * page_size
#     end_index = start_index + page_size
#     paginated_rows = all_rows[start_index:end_index]

#     return {
#         "aggregation": aggregation,
#         "page": page,
#         "page_size": page_size,
#         "total": total,
#         "data": [
#             {
#                 "period": row.period.strftime("%Y-%m-%d"),
#                 "severity": row.severity,
#                 "count": row.count
#             }
#             for row in paginated_rows
#         ]
#     }
@router.get("/summary/severity-trend")
def severity_trend(
    range: Optional[str] = Query("all"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=5, le=200),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timedelta

    now = datetime.utcnow()
    from_date = None
    to_date = None

    # ---------------- RANGE FILTER ----------------
    if range and range != "all":
        try:
            days = int(range.rstrip("d"))
            from_date = now - timedelta(days=days)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid range format")

    # ---------------- CUSTOM DATE FILTER ----------------
    if start_date:
        try:
            from_date = datetime.strptime(start_date, "%d-%m-%Y")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid start_date format (DD-MM-YYYY)"
            )

    if end_date:
        try:
            to_date = datetime.strptime(end_date, "%d-%m-%Y") + timedelta(days=1)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid end_date format (DD-MM-YYYY)"
            )

    # ---------------- DETERMINE AGGREGATION ----------------
    aggregation = "day"

    if from_date:
        diff_days = (now - from_date).days
        if diff_days > 90:
            aggregation = "month"
        elif diff_days > 15:
            aggregation = "week"

    if aggregation == "day":
        period_expr = func.date(LogEntry.log_timestamp)
    elif aggregation == "week":
        period_expr = func.date_trunc("week", LogEntry.log_timestamp)
    else:
        period_expr = func.date_trunc("month", LogEntry.log_timestamp)

    # ---------------- BASE FILTER QUERY ----------------
    filter_query = db.query(LogEntry)

    if from_date:
        filter_query = filter_query.filter(
            LogEntry.log_timestamp >= from_date
        )

    if to_date:
        filter_query = filter_query.filter(
            LogEntry.log_timestamp < to_date
        )

    # ---------------- STEP 1: GET UNIQUE PERIODS ----------------
    periods_query = (
        db.query(period_expr.label("period"))
        .select_from(LogEntry)
    )

    if from_date:
        periods_query = periods_query.filter(
            LogEntry.log_timestamp >= from_date
        )

    if to_date:
        periods_query = periods_query.filter(
            LogEntry.log_timestamp < to_date
        )

    periods_query = (
        periods_query
        .group_by(period_expr)
        .order_by(period_expr)
    )

    all_periods = [row.period for row in periods_query.all()]
    total = len(all_periods)

    # ---------------- STEP 2: PAGINATE PERIODS ----------------
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    selected_periods = all_periods[start_index:end_index]

    if not selected_periods:
        return {
            "aggregation": aggregation,
            "page": page,
            "page_size": page_size,
            "total": total,
            "data": []
        }

    # ---------------- STEP 3: FETCH FULL DATA FOR SELECTED PERIODS ----------------
    data_query = (
        db.query(
            period_expr.label("period"),
            LogSeverity.severity_code.label("severity"),
            func.count(LogEntry.log_id).label("count")
        )
        .join(LogSeverity, LogEntry.severity_id == LogSeverity.severity_id)
        .filter(period_expr.in_(selected_periods))
    )

    if from_date:
        data_query = data_query.filter(
            LogEntry.log_timestamp >= from_date
        )

    if to_date:
        data_query = data_query.filter(
            LogEntry.log_timestamp < to_date
        )

    rows = (
        data_query
        .group_by(period_expr, LogSeverity.severity_code)
        .order_by(period_expr)
        .all()
    )

    return {
        "aggregation": aggregation,
        "page": page,
        "page_size": page_size,
        "total": total,
        "data": [
            {
                "period": row.period.strftime("%Y-%m-%d"),
                "severity": row.severity,
                "count": row.count
            }
            for row in rows
        ]
    }
