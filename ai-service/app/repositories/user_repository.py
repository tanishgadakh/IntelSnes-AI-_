from sqlalchemy import select
from app.repositories.base_repository import BaseRepository
from app.models.user import User


class UserRepository(BaseRepository):
    async def get_by_username(self, username: str):
        q = select(User).where(User.username == username)
        res = await self.session.execute(q)
        return res.scalar_one_or_none()

    async def get_by_email(self, email: str):
        q = select(User).where(User.email == email)
        res = await self.session.execute(q)
        return res.scalar_one_or_none()

    async def set_password_hash(self, user: User, password_hash: str):
        """Update password and save previous for reuse check."""
        user.password_previous = user.password_hash or user.password
        user.password_hash = password_hash
        user.password = password_hash
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def set_otp(self, user: User, code: str, expires_at):
        user.otp_code = code
        user.otp_expires_at = expires_at
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def clear_otp(self, user: User):
        user.otp_code = None
        user.otp_expires_at = None
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def set_reset_token_expiry(self, user: User, expires_at):
        """Track reset token validity period."""
        user.reset_token_expires_at = expires_at
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user
