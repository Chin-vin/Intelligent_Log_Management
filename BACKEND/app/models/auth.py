from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Integer,
    Boolean,
    DateTime,
    func
)
from app.core.database import Base


class UserCredential(Base):
    __tablename__ = "user_credentials"

    credential_id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, unique=True, nullable=False)

    password_hash = Column(String, nullable=False)
    password_algo = Column(String(50), nullable=False)

    failed_attempts = Column(Integer, default=0)
    last_failed_at = Column(DateTime(timezone=True))

    is_locked = Column(Boolean, default=False)
    locked_until = Column(DateTime(timezone=True))

    password_changed_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

class LoginHistory(Base):
    __tablename__ = "login_history"

    login_id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger)

    login_time = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    login_ip = Column(String)
    user_agent = Column(String)

    success = Column(Boolean)
    failure_reason = Column(String(100))
