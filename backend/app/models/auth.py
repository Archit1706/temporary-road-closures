"""
Authentication-related models for session management and audit logging.
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
    func,
)
from sqlalchemy.orm import relationship, Session
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List
import uuid

from app.models.base import BaseModel


class AuthSession(BaseModel):
    """
    Model for tracking user authentication sessions.
    """

    __tablename__ = "auth_sessions"

    id = Column(Integer, primary_key=True, index=True, doc="Session ID")

    # User relationship
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
        doc="User who owns this session",
    )

    # Session data
    session_id = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        doc="Unique session identifier",
    )

    # Request metadata
    ip_address = Column(String(45), nullable=True, doc="IP address of the session")

    user_agent = Column(Text, nullable=True, doc="User agent string")

    # Session status
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Whether session is active",
    )

    expires_at = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        doc="Session expiration time",
    )

    # Relationships
    user = relationship("User", back_populates="auth_sessions")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.session_id:
            self.session_id = str(uuid.uuid4())
        if not self.expires_at:
            self.expires_at = datetime.now(timezone.utc) + timedelta(hours=24)


class AuthEvent(BaseModel):
    """
    Model for logging authentication events for audit purposes.
    """

    __tablename__ = "auth_events"

    id = Column(Integer, primary_key=True, index=True, doc="Event ID")

    # User relationship (nullable for failed attempts)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
        doc="User associated with this event",
    )

    # Event details
    event_type = Column(
        String(50), nullable=False, index=True, doc="Type of authentication event"
    )

    # Request metadata
    ip_address = Column(String(45), nullable=True, doc="IP address of the request")

    user_agent = Column(Text, nullable=True, doc="User agent string")

    # Event outcome
    success = Column(
        Boolean, nullable=False, index=True, doc="Whether the event was successful"
    )

    # Additional event data
    details = Column(JSON, nullable=True, doc="Additional event details as JSON")

    # Override created_at to add index
    created_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False,
        index=True,
        doc="Event timestamp",
    )

    # Relationships
    user = relationship("User", back_populates="auth_events")


class OAuthState(BaseModel):
    """
    Model for managing OAuth state parameters for security.
    """

    __tablename__ = "oauth_states"

    id = Column(Integer, primary_key=True, index=True, doc="State ID")

    # OAuth state data
    state = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        doc="OAuth state parameter",
    )

    provider = Column(String(50), nullable=False, doc="OAuth provider name")

    redirect_uri = Column(String(255), nullable=True, doc="Custom redirect URI")

    # Request metadata
    ip_address = Column(
        String(45), nullable=True, doc="IP address that initiated OAuth flow"
    )

    expires_at = Column(
        DateTime(timezone=True), nullable=False, index=True, doc="State expiration time"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.expires_at:
            self.expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
