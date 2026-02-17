from datetime import datetime
from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    JSON,
    DateTime,func
)
from app.core.database import Base

class AuditTrail(Base):
    __tablename__ = "audit_trail"

    audit_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=True)  # or ForeignKey if needed

    action_type = Column(String(50), nullable=False)
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(BigInteger, nullable=True)

    action_time = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )




from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    DateTime,
    ForeignKey,
    func
)
from app.core.database import Base


class FileProcessingLog(Base):
    __tablename__ = "file_processing_log"

    process_id = Column(
        BigInteger,
        primary_key=True,
        index=True
    )

    file_id = Column(
        BigInteger,
        ForeignKey("raw_files.file_id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    status = Column(
        String(30),
        nullable=False
    )
    # Examples: PROCESSING, PARSED, FAILED

    error_message = Column(
        Text,
        nullable=True
    )

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )
 


class Archive(Base):
    __tablename__ = "archives"

    archive_id = Column(BigInteger, primary_key=True)
    file_id = Column(BigInteger)

    archived_on = Column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False
)

    total_records = Column(BigInteger)
