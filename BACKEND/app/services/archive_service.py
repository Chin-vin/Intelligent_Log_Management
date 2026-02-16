from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.logs import LogEntry
from app.models.audit import Archive, AuditTrail
from app.models.files import RawFile
from app.services.storage_service import move_storage_file

ARCHIVE_AFTER_DAYS = 90

def archive_old_files(*, db: Session, user):
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=ARCHIVE_AFTER_DAYS)

    # ✅ STEP 1: find files older than 90 days (UPLOAD BASED)
    old_files = (
        db.query(RawFile)
        .filter(RawFile.uploaded_at < cutoff_date)
        .filter(RawFile.storage_path.notlike("archive/%"))  # avoid double archive
        .all()
    )

    archived_files = []

    for raw_file in old_files:
        file_id = raw_file.file_id

        # ✅ STEP 2: count logs for this file
        total_logs = (
            db.query(LogEntry)
            .filter(LogEntry.file_id == file_id)
            .count()
        )

        # ✅ STEP 3: archive metadata
        db.add(Archive(
            file_id=file_id,
            archived_on=datetime.now(timezone.utc),
            total_records=total_logs
        ))

        # ✅ STEP 4: delete logs
        db.query(LogEntry).filter(
            LogEntry.file_id == file_id
        ).delete(synchronize_session=False)

        # ✅ STEP 5: move file in storage
        old_path = raw_file.storage_path
        new_path = f"archive/{old_path}"

        move_storage_file(old_path, new_path)

        # ✅ STEP 6: update file record
        raw_file.storage_path = new_path

        # ✅ STEP 7: audit trail
        db.add(AuditTrail(
            user_id=user.user_id,
            action_type="ARCHIVE_FILE",
            entity_type="RAW_FILE",
            entity_id=file_id
        ))

        archived_files.append({
            "file_id": file_id,
            "uploaded_at": raw_file.uploaded_at,
            "archived_on": datetime.now(timezone.utc),
            "total_logs": total_logs
        })

    db.commit()
    return archived_files


# from datetime import datetime, timedelta, timezone
# from sqlalchemy.orm import Session

# from app.models.logs import LogEntry
# from app.models.audit import Archive
# from app.models.files import RawFile
# from app.models.audit import AuditTrail
# from app.services.storage_service import move_storage_file

# ARCHIVE_AFTER_DAYS = 90

# def archive_old_files(*, db: Session, user):
#     cutoff_date = datetime.now(timezone.utc) - timedelta(days=ARCHIVE_AFTER_DAYS)

#     file_ids = (
#         db.query(LogEntry.file_id)
#         .filter(LogEntry.log_timestamp < cutoff_date)
#         .distinct()
#         .all()
#     )

#     archived_files = []

#     for (file_id,) in file_ids:
#         raw_file = db.query(RawFile).filter(
#             RawFile.file_id == file_id
#         ).first()

#         if not raw_file:
#             continue

#         # 1️⃣ Count logs to archive
#         total_logs = db.query(LogEntry).filter(
#             LogEntry.file_id == file_id,
#             LogEntry.log_timestamp < cutoff_date
#         ).count()

#         if total_logs == 0:
#             continue

#         # 2️⃣ Insert archive record
#         db.add(Archive(
#             file_id=file_id,
#             archived_on=datetime.now(timezone.utc),
#             total_records=total_logs
#         ))

#         # 3️⃣ Delete old logs
#         db.query(LogEntry).filter(
#             LogEntry.file_id == file_id,
#             LogEntry.log_timestamp < cutoff_date
#         ).delete(synchronize_session=False)

#         # 4️⃣ Move file in storage
#         old_path = raw_file.storage_path
#         new_path = f"archive/{old_path}"

#         move_storage_file(old_path, new_path)

#         # 5️⃣ Update storage path in DB
#         raw_file.storage_path = new_path

#         # 6️⃣ Audit trail
#         db.add(AuditTrail(
#             user_id=user.user_id,
#             action_type="ARCHIVE_FILE",
#             entity_type="RAW_FILE",
#             entity_id=file_id
#         ))

#         archived_files.append({
#             "file_id": file_id,
#             "archived_records": total_logs,
#             "new_storage_path": new_path
#         })

#     db.commit()
#     return archived_files
