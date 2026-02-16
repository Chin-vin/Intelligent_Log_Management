from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.archive_service import archive_old_files

router = APIRouter(prefix="/archive", tags=["Archival"])

@router.post("/older-than-90-days")
def archive_logs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = archive_old_files(db=db, user=current_user)
    return {
        "message": "Archival completed",
        "archived_files": result
    }

