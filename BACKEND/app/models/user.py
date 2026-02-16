from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Boolean,
    DateTime,func
)
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(BigInteger, primary_key=True)

    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(100), unique=True)

    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

class UserProfile(Base):
    __tablename__ = "user_profiles"

    profile_id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, nullable=False)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100))

    phone_number = Column(String(20))
    profile_image_url = Column(String)
    job_title = Column(String(150))

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
