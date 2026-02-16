from pydantic import BaseModel
from typing import Optional

class UpdateMyProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_image_url: Optional[str] = None
    # job_title: Optional[str] = None
