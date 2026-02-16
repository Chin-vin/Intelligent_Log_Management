from sqlalchemy import (
    Column,
    BigInteger,
    SmallInteger,
    Boolean,
    DateTime,
    ForeignKey,
    func,
    UniqueConstraint
)
from app.core.database import Base


class TeamUploadPolicy(Base):
    __tablename__ = "team_upload_policies"

    policy_id = Column(BigInteger, primary_key=True, index=True)

    team_id = Column(
        BigInteger,
        ForeignKey("teams.team_id", ondelete="CASCADE"),
        nullable=False
    )

    

    format_id = Column(
        SmallInteger,
        ForeignKey("file_formats.format_id"),
        nullable=False
    )

    is_allowed = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "team_id",
            
            "format_id",
            name="uq_team_category_format"
        ),
    )
