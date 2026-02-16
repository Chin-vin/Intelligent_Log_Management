from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.parsing_service import parse_file
from app.models.files import RawFile

router = APIRouter(
    prefix="/processing",
    tags=["File Processing"]
)
