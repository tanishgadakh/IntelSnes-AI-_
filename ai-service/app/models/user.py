from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.base import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), nullable=True)
    role = Column(String(64), nullable=True)
    password = Column(String(255), nullable=True)
    password_hash = Column(String(1024), nullable=True)
    password_previous = Column(String(1024), nullable=True)  # to check password reuse
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    phone = Column(String(64), nullable=True)
    department = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)
    experience = Column(String(255), nullable=True)
    access_reason = Column(String(4096), nullable=True)
    rejection_reason = Column(String(4096), nullable=True)
    status = Column(String(64), nullable=True)
    otp_code = Column(String(32), nullable=True)
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)
    reset_token_expires_at = Column(DateTime(timezone=True), nullable=True)  # track reset token validity
    created_at = Column(DateTime(timezone=True), server_default=func.now())
