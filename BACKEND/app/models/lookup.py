from sqlalchemy import Column, SmallInteger, String
from app.core.database import Base


class LogCategory(Base):
    __tablename__ = "log_categories"

    category_id = Column(SmallInteger, primary_key=True)
    category_name = Column(String(50), unique=True, nullable=False)


class StorageType(Base):
    __tablename__ = "storage_types"

    storage_type_id = Column(SmallInteger, primary_key=True)
    storage_name = Column(String(30), unique=True)


class UploadStatus(Base):
    __tablename__ = "upload_statuses"

    status_id = Column(SmallInteger, primary_key=True)
    status_code = Column(String(30), unique=True)
    description = Column(String)


class LogSource(Base):
    __tablename__ = "log_sources"

    source_id = Column(SmallInteger, primary_key=True)
    source_name = Column(String(50), unique=True)


class LogSeverity(Base):
    __tablename__ = "log_severities"

    severity_id = Column(SmallInteger, primary_key=True)
    severity_code = Column(String(10), unique=True)
    severity_level = Column(SmallInteger)
    description = Column(String)


class Environment(Base):
    __tablename__ = "environments"

    environment_id = Column(SmallInteger, primary_key=True)
    environment_code = Column(String(20), unique=True)
    description = Column(String)
