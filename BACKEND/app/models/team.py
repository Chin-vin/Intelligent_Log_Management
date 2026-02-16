from sqlalchemy import Column, BigInteger, String, DateTime,func
from app.core.database import Base


class Team(Base):
    __tablename__ = "teams"   # 🔥 MUST be plural

    team_id = Column(BigInteger, primary_key=True)
    team_name = Column(String(150), unique=True, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )