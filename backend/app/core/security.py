"""
Security functions for authentication and authorization.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from passlib.context import CryptContext
from passlib.hash import bcrypt
import secrets
import string

from app.config import settings


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(
    data: Dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.

    Args:
        data: Data to encode in the token
        expires_delta: Token expiration time

    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})

    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token to verify

    Returns:
        dict: Decoded token payload

    Raises:
        jwt.ExpiredSignatureError: If token has expired
        jwt.InvalidTokenError: If token is invalid
    """
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

    return payload


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password to verify against

    Returns:
        bool: True if password is correct
    """
    return pwd_context.verify(plain_password, hashed_password)


def generate_password_reset_token(email: str) -> str:
    """
    Generate a password reset token.

    Args:
        email: User email address

    Returns:
        str: Password reset token
    """
    delta = timedelta(hours=1)  # Password reset tokens expire in 1 hour

    return create_access_token(
        data={"sub": email, "type": "password_reset"}, expires_delta=delta
    )


def verify_password_reset_token(token: str) -> Optional[str]:
    """
    Verify a password reset token and extract email.

    Args:
        token: Password reset token

    Returns:
        str or None: Email if token is valid, None otherwise
    """
    try:
        payload = verify_token(token)
        email = payload.get("sub")
        token_type = payload.get("type")

        if token_type != "password_reset":
            return None

        return email

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def generate_api_key() -> str:
    """
    Generate a secure API key.

    Returns:
        str: Generated API key
    """
    # Generate a 32-character random string
    alphabet = string.ascii_letters + string.digits
    api_key = "".join(secrets.choice(alphabet) for _ in range(32))

    return f"osm_closures_{api_key}"


def verify_api_key(api_key: str) -> bool:
    """
    Verify API key format.

    Args:
        api_key: API key to verify

    Returns:
        bool: True if format is valid
    """
    if not api_key:
        return False

    if not api_key.startswith("osm_closures_"):
        return False

    key_part = api_key[13:]  # Remove prefix
    if len(key_part) != 32:
        return False

    # Check if all characters are alphanumeric
    return key_part.isalnum()


def create_email_verification_token(email: str) -> str:
    """
    Create an email verification token.

    Args:
        email: User email address

    Returns:
        str: Email verification token
    """
    delta = timedelta(days=1)  # Email verification tokens expire in 1 day

    return create_access_token(
        data={"sub": email, "type": "email_verification"}, expires_delta=delta
    )


def verify_email_verification_token(token: str) -> Optional[str]:
    """
    Verify an email verification token and extract email.

    Args:
        token: Email verification token

    Returns:
        str or None: Email if token is valid, None otherwise
    """
    try:
        payload = verify_token(token)
        email = payload.get("sub")
        token_type = payload.get("type")

        if token_type != "email_verification":
            return None

        return email

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def generate_secure_filename(original_filename: str) -> str:
    """
    Generate a secure filename for uploads.

    Args:
        original_filename: Original filename

    Returns:
        str: Secure filename
    """
    import os
    import uuid

    # Get file extension
    _, ext = os.path.splitext(original_filename)

    # Generate UUID-based filename
    secure_name = f"{uuid.uuid4().hex}{ext.lower()}"

    return secure_name


class SecurityHeaders:
    """
    Security headers for API responses.
    """

    @staticmethod
    def get_headers() -> Dict[str, str]:
        """
        Get security headers for API responses.

        Returns:
            dict: Security headers
        """
        return {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Content-Security-Policy": "default-src 'self'",
        }


def mask_sensitive_data(data: Dict[str, Any], fields: list = None) -> Dict[str, Any]:
    """
    Mask sensitive fields in data dictionary.

    Args:
        data: Data dictionary
        fields: List of fields to mask (default: common sensitive fields)

    Returns:
        dict: Data with sensitive fields masked
    """
    if fields is None:
        fields = [
            "password",
            "hashed_password",
            "api_key",
            "secret_key",
            "access_token",
            "refresh_token",
            "private_key",
        ]

    masked_data = data.copy()

    for field in fields:
        if field in masked_data:
            masked_data[field] = "***masked***"

    return masked_data


def validate_password_strength(password: str) -> Dict[str, Any]:
    """
    Validate password strength and return requirements status.

    Args:
        password: Password to validate

    Returns:
        dict: Validation results with requirements status
    """
    import re

    requirements = {
        "min_length": len(password) >= 8,
        "has_uppercase": bool(re.search(r"[A-Z]", password)),
        "has_lowercase": bool(re.search(r"[a-z]", password)),
        "has_digit": bool(re.search(r"\d", password)),
        "has_special": bool(re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)),
        "no_common_patterns": not any(
            pattern in password.lower()
            for pattern in ["password", "123456", "qwerty", "admin"]
        ),
    }

    is_valid = all(requirements.values())
    score = sum(requirements.values())

    strength_levels = {
        0: "Very Weak",
        1: "Very Weak",
        2: "Weak",
        3: "Weak",
        4: "Medium",
        5: "Strong",
        6: "Very Strong",
    }

    return {
        "is_valid": is_valid,
        "score": score,
        "strength": strength_levels.get(score, "Unknown"),
        "requirements": requirements,
    }
