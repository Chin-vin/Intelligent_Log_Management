from sqlalchemy import (
    Column,
    BigInteger,
    SmallInteger,
    String,
    DateTime,
    ForeignKey ,func  # ✅ THIS WAS MISSING
)
from app.core.database import Base


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(SmallInteger, primary_key=True)
    role_name = Column(String(50), unique=True, nullable=False)
    description = Column(String)


class Permission(Base):
    __tablename__ = "permissions"

    permission_id = Column(SmallInteger, primary_key=True)
    permission_key = Column(String(100), unique=True, nullable=False)
    description = Column(String)


class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id = Column(
        SmallInteger,
        ForeignKey("roles.role_id", ondelete="CASCADE"),
        primary_key=True
    )
    permission_id = Column(
        SmallInteger,
        ForeignKey("permissions.permission_id", ondelete="CASCADE"),
        primary_key=True
    )


class UserRole(Base):
    __tablename__ = "user_roles"

    user_id = Column(
        BigInteger,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True
    )
    role_id = Column(
        SmallInteger,
        ForeignKey("roles.role_id", ondelete="CASCADE"),
        primary_key=True
    )
    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
