"""
Models package initialization.
Import all models here to ensure they are registered with SQLAlchemy.
"""

# Import base first
from app.models.base import BaseModel

# Import all models to register them with SQLAlchemy
from app.models.user import User
from app.models.closure import Closure, ClosureType, ClosureStatus
from app.models.auth import AuthSession, AuthEvent, OAuthState

# Export models for easy importing
__all__ = [
    "BaseModel",
    "User",
    "Closure",
    "ClosureType",
    "ClosureStatus",
    "AuthSession",
    "AuthEvent",
    "OAuthState",
]
