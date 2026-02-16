from pydantic import BaseModel, EmailStr
from typing import Optional,List

class AdminCreateUserRequest(BaseModel):
    email: EmailStr
    username: Optional[str]

    first_name: str
    last_name: Optional[str]

    phone_number: Optional[str]
    profile_image_url: Optional[str]
    job_title: Optional[str]

    role_ids:List[ int ]       # ADMIN / USER / SECURITY_ANALYST / AUDITOR
    team_ids: List[int]
