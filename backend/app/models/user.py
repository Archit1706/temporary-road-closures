"""
User model for authentication and authorization with OAuth support.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, CheckConstraint
from sqlalchemy.orm import relationship, Session
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
import uuid

from app.models.base import BaseModel


class User(BaseModel):
    """
    User model for managing user accounts and permissions with OAuth support.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, doc="Unique user identifier")

    # Authentication fields
    username = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        doc="Unique username for authentication",
    )

    email = Column(
        String(255), unique=True, nullable=False, index=True, doc="User email address"
    )

    hashed_password = Column(
        String(255),
        nullable=True,  # Allow OAuth users without password
        doc="Hashed password for authentication",
    )

    # OAuth fields
    provider = Column(
        String(50),
        nullable=True,
        index=True,
        doc="OAuth provider (google, github, etc.)",
    )

    provider_id = Column(String(255), nullable=True, doc="User ID from OAuth provider")

    avatar_url = Column(
        String(255), nullable=True, doc="Avatar URL from OAuth provider"
    )

    # User profile
    full_name = Column(String(255), nullable=True, doc="User's full name")

    # Permissions and status
    is_active = Column(
        Boolean, default=True, nullable=False, doc="Whether the user account is active"
    )

    is_moderator = Column(
        Boolean,
        default=False,
        nullable=False,
        doc="Whether the user has moderator privileges",
    )

    is_verified = Column(
        Boolean,
        default=False,
        nullable=False,
        doc="Whether the user's email is verified",
    )

    # Enhanced security fields
    email_verified_at = Column(
        DateTime(timezone=True), nullable=True, doc="Timestamp when email was verified"
    )

    last_password_change = Column(
        DateTime(timezone=True), nullable=True, doc="Timestamp of last password change"
    )

    login_attempts = Column(
        Integer, default=0, nullable=False, doc="Number of failed login attempts"
    )

    locked_until = Column(
        DateTime(timezone=True), nullable=True, doc="Account lock expiration time"
    )

    # Activity tracking
    last_login_at = Column(
        DateTime(timezone=True), nullable=True, doc="Last login timestamp"
    )

    # API usage tracking
    api_key = Column(
        String(255), nullable=True, unique=True, doc="API key for programmatic access"
    )

    # Relationships
    closures = relationship(
        "Closure",
        back_populates="submitter",
        cascade="all, delete-orphan",
        doc="Closures submitted by this user",
    )

    auth_sessions = relationship(
        "AuthSession",
        back_populates="user",
        cascade="all, delete-orphan",
        doc="Active authentication sessions",
    )

    auth_events = relationship(
        "AuthEvent",
        back_populates="user",
        cascade="all, delete-orphan",
        doc="Authentication event log",
    )

    # Table constraints
    __table_args__ = (
        CheckConstraint(
            "login_attempts >= 0 AND login_attempts <= 10",
            name="ck_users_login_attempts",
        ),
        CheckConstraint(
            "provider IS NULL OR provider_id IS NOT NULL", name="ck_oauth_consistency"
        ),
    )

    def __init__(self, **kwargs):
        """Initialize user with generated API key."""
        super().__init__(**kwargs)
        if not self.api_key:
            self.api_key = self.generate_api_key()
        if self.provider and not self.is_verified:
            # OAuth users are automatically verified
            self.is_verified = True
            self.email_verified_at = datetime.now(timezone.utc)

    @staticmethod
    def generate_api_key() -> str:
        """
        Generate a unique API key for the user.

        Returns:
            str: Generated API key
        """
        return f"osm_closures_{uuid.uuid4().hex}"

    def regenerate_api_key(self, db: Session) -> str:
        """
        Regenerate the user's API key.

        Args:
            db: Database session

        Returns:
            str: New API key
        """
        self.api_key = self.generate_api_key()
        self.save(db)
        return self.api_key

    def update_last_login(self, db: Session) -> None:
        """
        Update the user's last login timestamp and reset login attempts.

        Args:
            db: Database session
        """
        self.last_login_at = func.now()
        self.login_attempts = 0
        self.locked_until = None
        self.save(db)

    def increment_login_attempts(self, db: Session) -> None:
        """
        Increment failed login attempts and lock account if necessary.

        Args:
            db: Database session
        """
        self.login_attempts += 1

        # Lock account after 5 failed attempts for 15 minutes
        if self.login_attempts >= 5:
            self.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)

        self.save(db)

    def reset_login_attempts(self, db: Session) -> None:
        """
        Reset login attempts and unlock account.

        Args:
            db: Database session
        """
        self.login_attempts = 0
        self.locked_until = None
        self.save(db)

    @property
    def is_locked(self) -> bool:
        """Check if account is currently locked."""
        if not self.locked_until:
            return False
        return datetime.now(timezone.utc) < self.locked_until

    @property
    def is_oauth_user(self) -> bool:
        """Check if user registered via OAuth."""
        return self.provider is not None

    @property
    def can_login(self) -> bool:
        """Check if user can login (active, verified, not locked)."""
        return self.is_active and self.is_verified and not self.is_locked

    def verify_email(self, db: Session) -> None:
        """
        Mark email as verified.

        Args:
            db: Database session
        """
        self.is_verified = True
        self.email_verified_at = datetime.now(timezone.utc)
        self.save(db)

    def change_password(self, db: Session, new_password_hash: str) -> None:
        """
        Change user password and update timestamp.

        Args:
            db: Database session
            new_password_hash: New hashed password
        """
        self.hashed_password = new_password_hash
        self.last_password_change = datetime.now(timezone.utc)
        self.save(db)

    def has_permission(self, permission: str) -> bool:
        """
        Check if user has a specific permission.

        Args:
            permission: Permission name to check

        Returns:
            bool: True if user has permission
        """
        if not self.can_login:
            return False

        # Moderators have all permissions
        if self.is_moderator:
            return True

        # Define permission mappings
        permissions_map = {
            "create_closure": True,  # All verified users can create closures
            "edit_own_closure": True,  # Users can edit their own closures
            "edit_any_closure": self.is_moderator,
            "delete_own_closure": True,
            "delete_any_closure": self.is_moderator,
            "moderate_closures": self.is_moderator,
            "moderate_users": self.is_moderator,
            "view_user_info": self.is_moderator,
            "view_analytics": self.is_moderator,
        }

        return permissions_map.get(permission, False)

    def get_active_sessions(self, db: Session) -> List["AuthSession"]:
        """
        Get all active sessions for this user.

        Args:
            db: Database session

        Returns:
            List[AuthSession]: Active sessions
        """
        from app.models.auth import AuthSession

        return (
            db.query(AuthSession)
            .filter(
                AuthSession.user_id == self.id,
                AuthSession.is_active == True,
                AuthSession.expires_at > datetime.now(timezone.utc),
            )
            .all()
        )

    def invalidate_all_sessions(self, db: Session) -> int:
        """
        Invalidate all active sessions for this user.

        Args:
            db: Database session

        Returns:
            int: Number of sessions invalidated
        """
        from app.models.auth import AuthSession

        count = (
            db.query(AuthSession)
            .filter(AuthSession.user_id == self.id, AuthSession.is_active == True)
            .count()
        )

        db.query(AuthSession).filter(
            AuthSession.user_id == self.id, AuthSession.is_active == True
        ).update({"is_active": False})

        db.commit()
        return count

    @classmethod
    def get_by_username(cls, db: Session, username: str) -> Optional["User"]:
        """
        Get user by username.

        Args:
            db: Database session
            username: Username to search for

        Returns:
            User or None: Found user or None
        """
        return db.query(cls).filter(cls.username == username).first()

    @classmethod
    def get_by_email(cls, db: Session, email: str) -> Optional["User"]:
        """
        Get user by email.

        Args:
            db: Database session
            email: Email to search for

        Returns:
            User or None: Found user or None
        """
        return db.query(cls).filter(cls.email == email).first()

    @classmethod
    def get_by_api_key(cls, db: Session, api_key: str) -> Optional["User"]:
        """
        Get user by API key.

        Args:
            db: Database session
            api_key: API key to search for

        Returns:
            User or None: Found user or None
        """
        return (
            db.query(cls).filter(cls.api_key == api_key, cls.is_active == True).first()
        )

    @classmethod
    def get_by_oauth_provider(
        cls, db: Session, provider: str, provider_id: str
    ) -> Optional["User"]:
        """
        Get user by OAuth provider and provider ID.

        Args:
            db: Database session
            provider: OAuth provider name
            provider_id: Provider user ID

        Returns:
            User or None: Found user or None
        """
        return (
            db.query(cls)
            .filter(cls.provider == provider, cls.provider_id == provider_id)
            .first()
        )

    @classmethod
    def get_moderators(cls, db: Session) -> List["User"]:
        """
        Get all moderator users.

        Args:
            db: Database session

        Returns:
            List[User]: List of moderator users
        """
        return (
            db.query(cls).filter(cls.is_moderator == True, cls.is_active == True).all()
        )

    @classmethod
    def search_users(
        cls, db: Session, query: str, limit: int = 50, active_only: bool = True
    ) -> List["User"]:
        """
        Search users by username, email, or full name.

        Args:
            db: Database session
            query: Search query
            limit: Maximum results
            active_only: Whether to include only active users

        Returns:
            List[User]: Matching users
        """
        search_term = f"%{query.lower()}%"

        query = db.query(cls).filter(
            (cls.username.ilike(search_term))
            | (cls.email.ilike(search_term))
            | (cls.full_name.ilike(search_term))
        )

        if active_only:
            query = query.filter(cls.is_active == True)

        return query.limit(limit).all()

    @classmethod
    def cleanup_locked_accounts(cls, db: Session) -> int:
        """
        Unlock accounts where lock period has expired.

        Args:
            db: Database session

        Returns:
            int: Number of accounts unlocked
        """
        count = (
            db.query(cls)
            .filter(
                cls.locked_until.isnot(None),
                cls.locked_until <= datetime.now(timezone.utc),
            )
            .count()
        )

        db.query(cls).filter(
            cls.locked_until.isnot(None), cls.locked_until <= datetime.now(timezone.utc)
        ).update({"locked_until": None, "login_attempts": 0})

        db.commit()
        return count

    def to_dict(self, exclude: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Convert user to dictionary, excluding sensitive fields.

        Args:
            exclude: Additional fields to exclude

        Returns:
            dict: User data dictionary
        """
        default_exclude = ["hashed_password", "api_key", "provider_id"]
        if exclude:
            default_exclude.extend(exclude)

        data = super().to_dict(exclude=default_exclude)

        # Add computed properties
        data.update(
            {
                "is_locked": self.is_locked,
                "is_oauth_user": self.is_oauth_user,
                "can_login": self.can_login,
            }
        )

        return data

    def to_public_dict(self) -> Dict[str, Any]:
        """
        Convert user to public dictionary (safe for public display).

        Returns:
            dict: Public user data
        """
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "avatar_url": self.avatar_url,
            "is_moderator": self.is_moderator,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        """String representation of the user."""
        provider_info = f", provider={self.provider}" if self.provider else ""
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}'{provider_info})>"
