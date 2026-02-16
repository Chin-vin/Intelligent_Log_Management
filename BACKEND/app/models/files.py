from sqlalchemy import (
    Column,
    BigInteger,
    SmallInteger,
    String,
    DateTime,
    ForeignKey,
    func,
    Boolean
)
from app.core.database import Base


class RawFile(Base):
    __tablename__ = "raw_files"

    file_id = Column(BigInteger, primary_key=True, index=True)

    team_id = Column(
        BigInteger,
        ForeignKey("teams.team_id", ondelete="CASCADE"),
        nullable=False
    )

    uploaded_by = Column(
        BigInteger,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    original_name = Column(String(255), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)

    checksum = Column(String(64), unique=True, nullable=False)

    format_id = Column(
        SmallInteger,
        ForeignKey("file_formats.format_id"),
        nullable=False
    )

    source_id = Column(
        SmallInteger,
        ForeignKey("log_sources.source_id"),
        nullable=True
    )

    storage_type_id = Column(
        SmallInteger,
        ForeignKey("storage_types.storage_type_id"),
        nullable=False
    )

    storage_path = Column(String, nullable=False)

    status_id = Column(
        SmallInteger,
        ForeignKey("upload_statuses.status_id"),
        nullable=False
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    is_deleted=Column(Boolean, default=False)
    deleted_at= Column(
        DateTime(timezone=True),
        server_default=func.now()
    )