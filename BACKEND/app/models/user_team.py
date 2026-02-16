from sqlalchemy import Column, BigInteger, DateTime, ForeignKey,func
from app.core.database import Base


class UserTeam(Base):
    __tablename__ = "user_teams"

    user_id = Column(
        BigInteger,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True
    )

    team_id = Column(
        BigInteger,
        ForeignKey("teams.team_id", ondelete="CASCADE"),
        primary_key=True
    )

    joined_at=Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
