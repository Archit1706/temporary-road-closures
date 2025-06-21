"""
User schemas for authentication and user management.
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import re


class UserBase(BaseModel):
    """Base user schema with common fields."""

    username: str = Field(..., min_length=3, max_length=50, description="Username")
    email: EmailStr = Field(..., description="Email address")
    full_name: Optional[str] = Field(None, max_length=255, description="Full name")

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        """Validate username format."""
        if not re.match(r"^[a-zA-Z0-9_-]+$", v):
            raise ValueError(
                "Username can only contain letters, numbers, hyphens, and underscores"
            )
        return v.lower()


class UserCreate(UserBase):
    """Schema for user registration."""

    password: str = Field(..., min_length=8, description="Password")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "chicago_mapper",
                "email": "mapper@chicago.gov",
                "password": "SecurePass123",
                "full_name": "Chicago City Mapper",
            }
        }
    }


class UserLogin(BaseModel):
    """Schema for user login."""

    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")

    model_config = {
        "json_schema_extra": {
            "example": {"username": "chicago_mapper", "password": "SecurePass123"}
        }
    }


class UserResponse(UserBase):
    """Schema for user responses."""

    id: int = Field(..., description="User ID")
    is_active: bool = Field(..., description="Whether user is active")
    is_moderator: bool = Field(..., description="Whether user is a moderator")
    is_verified: bool = Field(..., description="Whether email is verified")
    last_login_at: Optional[datetime] = Field(None, description="Last login timestamp")
    created_at: datetime = Field(..., description="Account creation timestamp")

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """Schema for authentication token response."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
    user: UserResponse = Field(..., description="User information")

    model_config = {
        "json_schema_extra": {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 1800,
                "user": {
                    "id": 1,
                    "username": "chicago_mapper",
                    "email": "mapper@chicago.gov",
                    "full_name": "Chicago City Mapper",
                    "is_active": True,
                    "is_moderator": False,
                    "is_verified": True,
                },
            }
        }
    }


class OAuthUser(BaseModel):
    """Schema for OAuth user information."""

    provider: str = Field(..., description="OAuth provider (google, github, etc.)")
    provider_id: str = Field(..., description="User ID from OAuth provider")
    email: EmailStr = Field(..., description="Email from OAuth provider")
    name: Optional[str] = Field(None, description="Full name from OAuth provider")
    username: Optional[str] = Field(None, description="Username from OAuth provider")
    avatar_url: Optional[str] = Field(
        None, description="Avatar URL from OAuth provider"
    )


class OAuthCallback(BaseModel):
    """Schema for OAuth callback data."""

    code: str = Field(..., description="OAuth authorization code")
    state: str = Field(..., description="OAuth state parameter")
    error: Optional[str] = Field(None, description="OAuth error if any")


class PasswordReset(BaseModel):
    """Schema for password reset request."""

    email: EmailStr = Field(..., description="Email address for password reset")


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation."""

    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., min_length=8, description="New password")

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class EmailVerification(BaseModel):
    """Schema for email verification."""

    token: str = Field(..., description="Email verification token")


class UserUpdate(BaseModel):
    """Schema for updating user information."""

    full_name: Optional[str] = Field(
        None, max_length=255, description="Updated full name"
    )
    email: Optional[EmailStr] = Field(None, description="Updated email address")


class ChangePassword(BaseModel):
    """Schema for changing password."""

    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, description="New password")

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class ApiKeyResponse(BaseModel):
    """Schema for API key response."""

    api_key: str = Field(..., description="Generated API key")
    created_at: datetime = Field(..., description="Creation timestamp")


class UserStats(BaseModel):
    """Schema for user statistics."""

    total_closures: int = Field(..., description="Total closures submitted")
    active_closures: int = Field(..., description="Currently active closures")
    last_submission: Optional[datetime] = Field(
        None, description="Last closure submission"
    )
