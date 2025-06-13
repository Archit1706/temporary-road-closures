"""
User model for authentication and authorization.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship, Session
from typing import Optional
import uuid

from app.models.base import BaseModel


class User(BaseModel):
    """
    User model for managing user accounts and permissions.
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

    def __init__(self, **kwargs):
        """Initialize user with generated API key."""
        super().__init__(**kwargs)
        if not self.api_key:
            self.api_key = self.generate_api_key()

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
        Update the user's last login timestamp.

        Args:
            db: Database session
        """
        self.last_login_at = func.now()
        self.save(db)

    def has_permission(self, permission: str) -> bool:
        """
        Check if user has a specific permission.

        Args:
            permission: Permission name to check

        Returns:
            bool: True if user has permission
        """
        if not self.is_active:
            return False

        # Moderators have all permissions
        if self.is_moderator:
            return True

        # Define permission mappings
        permissions_map = {
            "create_closure": True,  # All users can create closures
            "edit_own_closure": True,  # Users can edit their own closures
            "edit_any_closure": self.is_moderator,
            "delete_own_closure": True,
            "delete_any_closure": self.is_moderator,
            "moderate_closures": self.is_moderator,
            "view_user_info": self.is_moderator,
        }

        return permissions_map.get(permission, False)

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
    def get_moderators(cls, db: Session) -> list["User"]:
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

    def to_dict(self, exclude: Optional[list[str]] = None) -> dict:
        """
        Convert user to dictionary, excluding sensitive fields.

        Args:
            exclude: Additional fields to exclude

        Returns:
            dict: User data dictionary
        """
        default_exclude = ["hashed_password", "api_key"]
        if exclude:
            default_exclude.extend(exclude)

        return super().to_dict(exclude=default_exclude)

    def __repr__(self) -> str:
        """String representation of the user."""
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
