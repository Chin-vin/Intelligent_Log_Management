from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timezone
import hashlib
import uuid

from app.core.supabase import supabase
from app.models.files import RawFile
from app.models.user_team import UserTeam
from app.models.team_upload_policy import TeamUploadPolicy
from app.models.file_format import FileFormat
from app.models.audit import AuditTrail
from app.models.lookup import UploadStatus

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

async def upload_file_service(
    *,
    db: Session,
    current_user,
    file,
    content: bytes,
    checksum: str,
    team_id: int,
    source_id: int,
):
    # Validate user belongs to selected team
    is_member = db.query(UserTeam).filter(
        UserTeam.user_id == current_user.user_id,
        UserTeam.team_id == team_id
    ).first()

    if not is_member:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of the selected team"
        )

    # Detect file format
    ext = file.filename.lower().rsplit(".", 1)[-1]
    ext_to_format = {
        "txt": "TEXT",
        "json": "JSON",
        "csv": "CSV",
        "xml": "XML"
    }

    format_name = ext_to_format.get(ext)
    if not format_name:
        raise HTTPException(400, "Unsupported file format")

    format_row = db.query(FileFormat).filter(
        FileFormat.format_name == format_name
    ).first()

    if not format_row:
        raise HTTPException(500, "File format not configured in system")

  

   
    storage_path = (
        f"{current_user.user_id}_"
        f"{team_id}_"
        f"{uuid.uuid4().hex}_"
        f"{file.filename}"
    )

    # Upload to Supabase
    try:
        supabase.storage.from_("raw_files").upload(
            storage_path,
            content,
            {"content-type": file.content_type}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Storage upload failed: {e}"
        )

    # Persist raw_files metadata
    raw_file = RawFile(
        team_id=team_id,
        uploaded_by=current_user.user_id,
        original_name=file.filename,
        file_size_bytes=len(content),
        checksum=checksum,
        format_id=format_row.format_id,
        source_id=source_id,
        storage_type_id=2, 
        storage_path=storage_path,
        
        status_id=get_status_id_by_code(db, "UPLOADED"),
        uploaded_at=datetime.now(timezone.utc)
    )

    db.add(raw_file)
    db.flush()

    #Audit trail
    db.add(AuditTrail(
        user_id=current_user.user_id,
        action_type="UPLOAD_FILE",
        entity_type="RAW_FILE",
        entity_id=raw_file.file_id
    ))

    db.commit()
    db.refresh(raw_file)

    return raw_file
