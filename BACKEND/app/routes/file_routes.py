# app/api/routes/file_routes.py
from fastapi import APIRouter, UploadFile, File, Depends, status,  HTTPException,Form,status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from sqlalchemy import or_
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.file_service import upload_file_service
from fastapi import BackgroundTasks
from app.services.parsing_service import parse_file
from app.models.file_format import FileFormat
from app.models.lookup import UploadStatus
from app.models.files import RawFile
from app.models.audit import AuditTrail
from datetime import datetime, timezone,timedelta
from app.services.storage_service import move_storage_file
from app.models.files import RawFile
from app.models.lookup import UploadStatus
from app.models.user_team import UserTeam
from app.models.logs import LogEntry
from app.models.org import Role,UserRole
from typing import List
from fastapi.responses import StreamingResponse
from app.services.storage_service import download_file_from_supabase
import io
import mimetypes
from sqlalchemy import func

from app.services.storage_service import download_file_from_supabase

from app.services.storage_service import delete_storage_file
from app.models.logs import LogEntry
from app.models.files import RawFile
from app.models.audit import AuditTrail



import hashlib

from app.models.user_team import UserTeam
from app.models.team_upload_policy import TeamUploadPolicy

from app.services.file_service import upload_file_service

# from app.routes.admin_lookup_routes import require_admin as is_admin
router = APIRouter(prefix="/files", tags=[" Files"])



def is_admin(db: Session, user_id: int) -> bool:
    return (
        db.query(Role)
        .join(UserRole, Role.role_id == UserRole.role_id)
        .filter(
            UserRole.user_id == user_id,
            Role.role_name == "ADMIN"
        )
        .first()
        is not None
    )


@router.delete("/{file_id}")
def soft_delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    file = db.query(RawFile).filter(RawFile.file_id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # 🔐 Authorization
    admin = is_admin(db, user.user_id)
    if not admin and file.uploaded_by != user.user_id:
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own uploaded files"
        )

    # ✅ ONLY PARSED FILES CAN BE DELETED
    parsed_id = get_status_id_by_code(db, "PARSED")
    if file.status_id != parsed_id:
        raise HTTPException(
            status_code=400,
            detail="Only PARSED files can be deleted"
        )

    soft_deleted_id = get_status_id_by_code(db, "SOFT_DELETED")

    file.status_id = soft_deleted_id
    file.is_deleted = True
    file.deleted_at = datetime.now(timezone.utc)

    db.add(AuditTrail(
        user_id=user.user_id,
        action_type="SOFT_DELETE_FILE",
        entity_type="RAW_FILE",
        entity_id=file.file_id
    ))

    db.commit()

    return {"message": "File moved to recycle bin"}


@router.patch("/{file_id}/restore")
def restore_file(
    file_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    file = db.query(RawFile).filter(RawFile.file_id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    admin = is_admin(db, user.user_id)
    if not admin and file.uploaded_by != user.user_id:
        raise HTTPException(
            status_code=403,
            detail="You can restore only your own uploaded files"
        )

    soft_deleted_id = get_status_id_by_code(db, "SOFT_DELETED")
    parsed_id = get_status_id_by_code(db, "PARSED")

    if file.status_id != soft_deleted_id:
        raise HTTPException(
            status_code=400,
            detail="File is not restorable"
        )

    file.status_id = parsed_id
    file.is_deleted = False
    file.deleted_at = None

    db.add(AuditTrail(
        user_id=user.user_id,
        action_type="RESTORE_FILE",
        entity_type="RAW_FILE",
        entity_id=file.file_id
    ))

    db.commit()

    return {"message": "File restored successfully"}


def archive_old_files(db: Session):
    cutoff = datetime.now(timezone.utc) - timedelta(days=90)

    uploaded_id = get_status_id_by_code(db, "PARSED")
    soft_deleted_id = get_status_id_by_code(db, "SOFT_DELETED")
    archived_id = get_status_id_by_code(db, "ARCHIVED")

    files = (
        db.query(RawFile)
        .filter(
            RawFile.status_id == uploaded_id,
            RawFile.uploaded_at < cutoff
        )
        .all()
    )

    for file in files:
        try:
            old_path = file.storage_path
            new_path = f"archive/{old_path}"

            move_storage_file(old_path, new_path)

            db.add(Archive(
                file_id=file.file_id,
                archived_on=datetime.now(timezone.utc),
                total_records=db.query(LogEntry)
                    .filter(LogEntry.file_id == file.file_id)
                    .count()
            ))

            file.storage_path = new_path
            file.status_id = archived_id

            db.add(AuditTrail(
                user_id=None,  # system action
                action_type="ARCHIVE_FILE",
                entity_type="RAW_FILE",
                entity_id=file.file_id
            ))

        except Exception as e:
            # log and continue, do NOT stop the job
            print(f"[ARCHIVE ERROR] file_id={file.file_id} error={e}")

    db.commit()

def purge_soft_deleted_files(db: Session):
    cutoff = datetime.now(timezone.utc) - timedelta(days=90)

    soft_deleted_id = get_status_id_by_code(db, "SOFT_DELETED")
    permanently_deleted_id = get_status_id_by_code(db, "PERMANENTLY_DELETED")

    files = (
        db.query(RawFile)
        .filter(
            RawFile.status_id == soft_deleted_id,
            RawFile.deleted_at.isnot(None),
            RawFile.deleted_at < cutoff
        )
        .all()
    )

    for file in files:
        try:
            # 1️⃣ DELETE related log entries
            deleted_logs = (
                db.query(LogEntry)
                .filter(LogEntry.file_id == file.file_id)
                .delete(synchronize_session=False)
            )

            # 2️⃣ DELETE file from storage (Supabase)
            if file.storage_path:
                delete_storage_file(file.storage_path)

            # 3️⃣ MARK file permanently deleted (keep DB row for audit)
            file.status_id = permanently_deleted_id
            file.is_deleted = True
            file.deleted_at = None
            file.storage_path = None

            # 4️⃣ AUDIT trail
            db.add(AuditTrail(
                user_id=None,  # system job
                action_type="PERMANENT_DELETE_FILE",
                entity_type="RAW_FILE",
                entity_id=file.file_id
            ))

            print(
                f"🗑️ Permanently deleted file_id={file.file_id}, "
                f"logs_deleted={deleted_logs}"
            )

        except Exception as e:
            print(
                f"[PURGE ERROR] file_id={file.file_id} error={e}"
            )

    db.commit()




def get_status_id_by_code(db: Session, code: str) -> int:
    status = (
        db.query(UploadStatus)
        .filter(UploadStatus.status_code == code)
        .first()
    )
    if not status:
        raise HTTPException(
            status_code=500,
            detail=f"Upload status '{code}' not found"
        )
    return status.status_id

# @router.post("/upload", status_code=201)
# async def upload_file(
#     background_tasks: BackgroundTasks,
#     files: List[UploadFile] = File(...),
#     team_id: int = Form(...),
#     source_id: int = Form(...),
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     uploaded_files = []
#     duplicate_files = []
#     request_file_names = set()  # To detect duplicates in same request

#     for file in files:
#         file_name = file.filename.strip()

#         # 1️⃣ Detect duplicate inside same upload request
#         if file_name.lower() in request_file_names:
#             duplicate_files.append(file_name)
#             continue

#         request_file_names.add(file_name.lower())

#         # 2️⃣ Detect duplicate already in DB (case-insensitive)
#         existing = db.query(RawFile).filter(
#             RawFile.original_name.ilike(file_name),
#             RawFile.team_id == team_id,
#             RawFile.source_id == source_id
#         ).first()

#         if existing:
#             duplicate_files.append(file_name)
#             continue

#         # 3️⃣ Save new file
#         raw_file = await upload_file_service(
#             db=db,
#             current_user=current_user,
#             file=file,
#             team_id=team_id,
#             source_id=source_id,
#         )

#         background_tasks.add_task(
#             parse_file,
#             db=db,
#             file_id=raw_file.file_id
#         )

#         uploaded_files.append({
#             "file_id": raw_file.file_id,
#             "file_name": file_name
#         })

#     return {
#         "uploaded_files": uploaded_files,
#         "duplicate_files": duplicate_files,
#         "total_uploaded": len(uploaded_files),
#         "total_duplicates": len(duplicate_files),
#         "message": "Upload completed"
#     }


@router.post("/upload", status_code=201)
async def upload_file(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    team_id: int = Form(...),
    source_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    uploaded_files = []
    duplicate_files = []
    seen_names = set()

    for file in files:
        file_name = file.filename.strip()
        lower_name = file_name.lower()

        # 1️⃣ Duplicate inside same request
        if lower_name in seen_names:
            duplicate_files.append(file_name)
            continue

        seen_names.add(lower_name)

        # 2️⃣ Duplicate in DB (case-insensitive exact match)
        existing = db.query(RawFile).filter(
            func.lower(RawFile.original_name) == lower_name,
            RawFile.team_id == team_id,
            RawFile.source_id == source_id
        ).first()

        if existing:
            duplicate_files.append(file_name)
            continue

        # 3️⃣ Save file
        raw_file = await upload_file_service(
            db=db,
            current_user=current_user,
            file=file,
            team_id=team_id,
            source_id=source_id,
        )

        background_tasks.add_task(
            parse_file,
            raw_file.file_id
        )

        uploaded_files.append({
            "file_id": raw_file.file_id,
            "file_name": file_name
        })

    return {
        "uploaded_files": uploaded_files,
        "duplicate_files": duplicate_files,
        "total_uploaded": len(uploaded_files),
        "total_duplicates": len(duplicate_files),
        "message": "Upload completed"
    }

@router.get("/{file_id}/preview")
def user_preview_file(
    file_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    file = db.query(RawFile).filter(RawFile.file_id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # OPTIONAL: ownership / team check
    # if file.uploaded_by != user.id:
    #     raise HTTPException(status_code=403, detail="Not allowed")

    file_bytes = download_file_from_supabase(file.storage_path)

    mime_type, _ = mimetypes.guess_type(file.original_name)
    mime_type = mime_type or "application/octet-stream"

    return StreamingResponse(
        io.BytesIO(file_bytes),
        media_type=mime_type,
        headers={
            "Content-Disposition": f'inline; filename="{file.original_name}"'
        }
    )


@router.get("/my-uploads")
def get_my_uploaded_files(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    files = (
        db.query(
            RawFile.file_id,
            RawFile.original_name,
            RawFile.file_size_bytes,
            RawFile.uploaded_at,
            FileFormat.format_name,
            UploadStatus.status_code
        )
        .join(FileFormat, FileFormat.format_id == RawFile.format_id)
        .join(UploadStatus, UploadStatus.status_id == RawFile.status_id)
        .filter(RawFile.uploaded_by == current_user.user_id)
        .order_by(desc(RawFile.uploaded_at))
        .all()
    )
    # print(files[0].status_code)
    return [
        {
            "file_id": f.file_id,
            "original_name": f.original_name,
            "file_size_bytes": f.file_size_bytes,
            "uploaded_at": f.uploaded_at,
            "format": f.format_name,
            "status": f.status_code
        }
        for f in files
    ]


@router.get("/team-uploads")
def my_and_team_files(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    team_ids = (
        db.query(UserTeam.team_id)
        .filter(UserTeam.user_id == current_user.user_id)
        .subquery()
    )

    files = (
        db.query(
            RawFile.file_id,
            RawFile.original_name,
            RawFile.file_size_bytes,
            RawFile.uploaded_at,
            UploadStatus.status_code
        )
        .join(UploadStatus, UploadStatus.status_id == RawFile.status_id)
        .filter(
            or_(
                RawFile.uploaded_by == current_user.user_id,
                RawFile.team_id.in_(team_ids)
            )
        )
        .order_by(RawFile.uploaded_at.desc())
        .all()
    )

    return [
        {
            "file_id": f.file_id,
            "original_name": f.original_name,
            "file_size_bytes": f.file_size_bytes,
            "uploaded_at": f.uploaded_at,
            "status": f.status_code   # ✅ IMPORTANT
        }
        for f in files
    ]
