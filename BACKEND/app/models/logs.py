from sqlalchemy import (
    Column,
    BigInteger,
    SmallInteger,
    String,
    Text,
    DateTime,
    func
)
from app.core.database import Base


class LogEntry(Base):
    __tablename__ = "log_entries"

    log_id = Column(BigInteger, primary_key=True)

    file_id = Column(BigInteger, nullable=False)

    log_timestamp = Column(DateTime(timezone=True), nullable=False)

    severity_id = Column(SmallInteger)
    category_id = Column(SmallInteger)
    environment_id = Column(SmallInteger)

    service_name = Column(String(150))
    host_name = Column(String(150))

    message = Column(Text, nullable=False)
    raw_log = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )