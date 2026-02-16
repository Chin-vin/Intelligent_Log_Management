from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
import io
import mimetypes
from app.routes.admin_lookup_routes import require_admin
from app.models.files import RawFile
from app.models.lookup import UploadStatus


from fastapi import APIRouter, Depends, Query, HTTPException

from datetime import datetime, timezone

from app.core.database import get_db
from app.models.logs import LogEntry
from app.models.user import User
from app.models.team import Team
from app.models.lookup import UploadStatus
from app.models.audit import AuditTrail
from app.services.storage_service import move_storage_file

from fastapi.responses import StreamingResponse
from app.services.storage_service import download_file_from_supabase


router = APIRouter(prefix="/admin/files", tags=["Admin Files"])


@router.get("/{file_id}/download")
def admin_download_file(
    file_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    file = db.query(RawFile).filter(RawFile.file_id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    file_bytes = download_file_from_supabase(file.storage_path)

    return StreamingResponse(
        io.BytesIO(file_bytes),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{file.original_name}"'
        }
    )

def get_status_id_by_code(db: Session, status_code: str) -> int:
    status = (
        db.query(UploadStatus)
        .filter(UploadStatus.status_code == status_code)
        .first()
    )

    if not status:
        raise HTTPException(
            status_code=500,
            detail=f"UploadStatus '{status_code}' not found"
        )

    return status.status_id


@router.get("")
def get_all_uploaded_files(
    db: Session = Depends(get_db),
    admin=Depends(require_admin),

    page: int = Query(1, ge=1),
    page_size: int = Query(10, le=100),

    file_type: str | None = None,
    team_id: int | None = None,
    file_name: str | None = None, 
    status: str | None = Query(None),  # ✅ NEW
):
    query = (
        db.query(
            RawFile.file_id,
            RawFile.original_name,
            RawFile.file_size_bytes,
            RawFile.uploaded_at,
            UploadStatus.status_code.label("status"),
            User.username.label("uploaded_by"),
            Team.team_name.label("team_name"),
            RawFile.storage_path,
        )
        .join(User, User.user_id == RawFile.uploaded_by)
        .join(Team, Team.team_id == RawFile.team_id)
        .join(UploadStatus, UploadStatus.status_id == RawFile.status_id)
    )

    # 🔎 FILTER: file type
    if file_type:
        query = query.filter(RawFile.original_name.ilike(f"%.{file_type}"))

    # 🔎 FILTER: team
    if team_id:
        query = query.filter(RawFile.team_id == team_id)

    # 🔎 FILTER: file name (partial match)
    if file_name:
        query = query.filter(
            RawFile.original_name.ilike(f"%{file_name}%")
        )
        # 🔎 FILTER: status
    if status:
        query = query.filter(UploadStatus.status_code == status)


    total = query.count()

    files = (
        query
        .order_by(RawFile.uploaded_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "files": [
            {
                "file_id": f.file_id,
                "file_name": f.original_name,
                "size_kb": round(f.file_size_bytes / 1024, 2),
                "uploaded_at": f.uploaded_at,
                "status": f.status,
                "uploaded_by": f.uploaded_by,
                "team": f.team_name,
                "download_url": f"/admin/files/{f.file_id}/download",
            }
            for f in files
        ]
    }



@router.get("/{file_id}/preview")
def admin_preview_file(
    file_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    file = db.query(RawFile).filter(RawFile.file_id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

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