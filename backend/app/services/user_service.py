"""
User service for managing user accounts and authentication.
"""

from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from datetime import datetime, timedelta, timezone

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, OAuthUser, UserUpdate
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_api_key,
    create_email_verification_token,
    verify_email_verification_token,
)
from app.core.exceptions import (
    AuthenticationException,
    ValidationException,
    ConflictException,
    NotFoundException,
)
from app.config import settings


class UserService:
    """
    Service class for user-related operations.
    """

    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate) -> User:
        """
        Create a new user account.

        Args:
            user_data: User registration data

        Returns:
            User: Created user

        Raises:
            ConflictException: If username or email already exists
            ValidationException: If data is invalid
        """
        # Check if username already exists
        if User.get_by_username(self.db, user_data.username):
            raise ConflictException(f"Username '{user_data.username}' already exists")

        # Check if email already exists
        if User.get_by_email(self.db, user_data.email):
            raise ConflictException(f"Email '{user_data.email}' already exists")

        try:
            # Hash password
            hashed_password = hash_password(user_data.password)

            # Create user
            user = User(
                username=user_data.username,
                email=user_data.email,
                full_name=user_data.full_name,
                hashed_password=hashed_password,
                is_active=True,
                is_moderator=False,
                is_verified=False,  # Email verification required
            )

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            return user

        except Exception as e:
            self.db.rollback()
            raise ValidationException(f"Failed to create user: {str(e)}")

    def authenticate_user(self, login_data: UserLogin) -> User:
        """
        Authenticate user with username/email and password.

        Args:
            login_data: Login credentials

        Returns:
            User: Authenticated user

        Raises:
            AuthenticationException: If authentication fails
        """
        # Find user by username or email
        user = User.get_by_username(self.db, login_data.username)
        if not user:
            user = User.get_by_email(self.db, login_data.username)

        if not user:
            raise AuthenticationException("Invalid username or password")

        # Check if user is active
        if not user.is_active:
            raise AuthenticationException("Account is disabled")

        # Verify password
        if not user.hashed_password or not verify_password(
            login_data.password, user.hashed_password
        ):
            raise AuthenticationException("Invalid username or password")

        # Update last login
        user.update_last_login(self.db)

        return user

    def create_access_token_for_user(self, user: User) -> Dict[str, Any]:
        """
        Create access token for user.

        Args:
            user: User to create token for

        Returns:
            dict: Token data
        """
        # Create token data
        token_data = {"sub": str(user.id), "username": user.username}

        # Create token with expiration
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(token_data, expires_delta)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user,
        }

    def create_or_get_oauth_user(self, oauth_user: OAuthUser) -> User:
        """
        Create or get existing user from OAuth data.

        Args:
            oauth_user: OAuth user information

        Returns:
            User: Created or existing user
        """
        # Try to find existing user by email
        user = User.get_by_email(self.db, oauth_user.email)

        if user:
            # Update user info from OAuth if needed
            if oauth_user.name and not user.full_name:
                user.full_name = oauth_user.name

            # Mark email as verified if from OAuth
            if not user.is_verified:
                user.is_verified = True

            # Update last login
            user.update_last_login(self.db)

            self.db.commit()
            return user

        # Create new user from OAuth data
        username = self._generate_unique_username(oauth_user)

        try:
            user = User(
                username=username,
                email=oauth_user.email,
                full_name=oauth_user.name,
                hashed_password=None,  # OAuth users don't have passwords
                is_active=True,
                is_moderator=False,
                is_verified=True,  # OAuth emails are considered verified
            )

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            return user

        except Exception as e:
            self.db.rollback()
            raise ValidationException(f"Failed to create OAuth user: {str(e)}")

    def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        """
        Update user information.

        Args:
            user_id: User ID to update
            user_data: Update data

        Returns:
            User: Updated user

        Raises:
            NotFoundException: If user not found
            ConflictException: If email already exists
        """
        user = User.get_by_id(self.db, user_id)
        if not user:
            raise NotFoundException("User", user_id)

        # Check email uniqueness if being updated
        if user_data.email and user_data.email != user.email:
            existing_user = User.get_by_email(self.db, user_data.email)
            if existing_user and existing_user.id != user_id:
                raise ConflictException(f"Email '{user_data.email}' already exists")

            # If email changes, mark as unverified
            user.is_verified = False

        try:
            # Update fields
            update_data = user_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                if hasattr(user, field):
                    setattr(user, field, value)

            self.db.commit()
            self.db.refresh(user)

            return user

        except Exception as e:
            self.db.rollback()
            raise ValidationException(f"Failed to update user: {str(e)}")

    def change_password(
        self, user_id: int, current_password: str, new_password: str
    ) -> bool:
        """
        Change user password.

        Args:
            user_id: User ID
            current_password: Current password
            new_password: New password

        Returns:
            bool: True if password changed successfully

        Raises:
            NotFoundException: If user not found
            AuthenticationException: If current password is wrong
        """
        user = User.get_by_id(self.db, user_id)
        if not user:
            raise NotFoundException("User", user_id)

        # Verify current password
        if not user.hashed_password or not verify_password(
            current_password, user.hashed_password
        ):
            raise AuthenticationException("Current password is incorrect")

        try:
            # Hash and set new password
            user.hashed_password = hash_password(new_password)
            self.db.commit()

            return True

        except Exception as e:
            self.db.rollback()
            raise ValidationException(f"Failed to change password: {str(e)}")

    def regenerate_api_key(self, user_id: int) -> str:
        """
        Regenerate API key for user.

        Args:
            user_id: User ID

        Returns:
            str: New API key

        Raises:
            NotFoundException: If user not found
        """
        user = User.get_by_id(self.db, user_id)
        if not user:
            raise NotFoundException("User", user_id)

        return user.regenerate_api_key(self.db)

    def send_email_verification(self, user_id: int) -> str:
        """
        Generate email verification token.

        Args:
            user_id: User ID

        Returns:
            str: Verification token

        Raises:
            NotFoundException: If user not found
        """
        user = User.get_by_id(self.db, user_id)
        if not user:
            raise NotFoundException("User", user_id)

        if user.is_verified:
            raise ValidationException("Email is already verified")

        # Generate verification token
        token = create_email_verification_token(user.email)

        # In a real application, you would send this token via email
        # For now, we'll return it directly
        return token

    def verify_email(self, token: str) -> bool:
        """
        Verify user email with token.

        Args:
            token: Email verification token

        Returns:
            bool: True if verification successful

        Raises:
            AuthenticationException: If token is invalid
            NotFoundException: If user not found
        """
        email = verify_email_verification_token(token)
        if not email:
            raise AuthenticationException("Invalid or expired verification token")

        user = User.get_by_email(self.db, email)
        if not user:
            raise NotFoundException("User not found for email")

        try:
            user.is_verified = True
            self.db.commit()

            return True

        except Exception as e:
            self.db.rollback()
            raise ValidationException(f"Failed to verify email: {str(e)}")

    def deactivate_user(self, user_id: int) -> bool:
        """
        Deactivate user account.

        Args:
            user_id: User ID to deactivate

        Returns:
            bool: True if deactivated successfully

        Raises:
            NotFoundException: If user not found
        """
        user = User.get_by_id(self.db, user_id)
        if not user:
            raise NotFoundException("User", user_id)

        try:
            user.is_active = False
            self.db.commit()

            return True

        except Exception as e:
            self.db.rollback()
            raise ValidationException(f"Failed to deactivate user: {str(e)}")

    def get_user_stats(self, user_id: int) -> Dict[str, Any]:
        """
        Get user statistics.

        Args:
            user_id: User ID

        Returns:
            dict: User statistics

        Raises:
            NotFoundException: If user not found
        """
        user = User.get_by_id(self.db, user_id)
        if not user:
            raise NotFoundException("User", user_id)

        # Get closure statistics
        from app.models.closure import Closure, ClosureStatus
        from sqlalchemy import func

        total_closures = (
            self.db.query(Closure).filter(Closure.submitter_id == user_id).count()
        )

        active_closures = (
            self.db.query(Closure)
            .filter(
                Closure.submitter_id == user_id, Closure.status == ClosureStatus.ACTIVE
            )
            .count()
        )

        # Get last submission
        last_closure = (
            self.db.query(Closure)
            .filter(Closure.submitter_id == user_id)
            .order_by(Closure.created_at.desc())
            .first()
        )

        return {
            "total_closures": total_closures,
            "active_closures": active_closures,
            "last_submission": last_closure.created_at if last_closure else None,
        }

    def _generate_unique_username(self, oauth_user: OAuthUser) -> str:
        """
        Generate unique username for OAuth user.

        Args:
            oauth_user: OAuth user data

        Returns:
            str: Unique username
        """
        # Start with preferred username
        base_username = oauth_user.username or oauth_user.email.split("@")[0]

        # Clean username (remove special characters)
        import re

        base_username = re.sub(r"[^a-zA-Z0-9_-]", "", base_username.lower())

        # Ensure minimum length
        if len(base_username) < 3:
            base_username = f"user_{base_username}"

        # Check if username is unique
        username = base_username
        counter = 1

        while User.get_by_username(self.db, username):
            username = f"{base_username}_{counter}"
            counter += 1

        return username
