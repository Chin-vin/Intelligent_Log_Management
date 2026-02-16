# app/schemas/admin_user.py
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class AdminUpdateUser(BaseModel):
    is_active: Optional[bool]

    first_name: Optional[str]
    last_name: Optional[str]
    phone_number: Optional[str]
    job_title: Optional[str]

    roles: Optional[List[str]]     # ["USER", "ADMIN"]
    teams: Optional[List[int]]     # team_ids
