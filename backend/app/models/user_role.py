from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from app.models.base import Base, TimestampMixin

class UserRole(Base, TimestampMixin):
    __tablename__ = "user_roles"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
