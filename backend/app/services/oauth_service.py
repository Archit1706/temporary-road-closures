"""
OAuth service for handling authentication with external providers.
"""

import secrets
import urllib.parse
from typing import Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import httpx
import json

from app.config import settings
from app.core.exceptions import AuthenticationException, ExternalServiceException
from app.schemas.user import OAuthUser


class OAuthService:
    """
    Service for handling OAuth authentication flows.
    """

    def __init__(self):
        self.providers = {
            "google": GoogleOAuthProvider(),
            "github": GitHubOAuthProvider(),
        }

    def get_authorization_url(
        self, provider: str, redirect_uri: Optional[str] = None
    ) -> Tuple[str, str]:
        """
        Get authorization URL for OAuth flow.

        Args:
            provider: OAuth provider name
            redirect_uri: Optional custom redirect URI

        Returns:
            tuple: (authorization_url, state)

        Raises:
            AuthenticationException: If provider is not supported
        """
        if provider not in self.providers:
            raise AuthenticationException(
                f"OAuth provider '{provider}' is not supported"
            )

        # Generate secure random state
        state = secrets.token_urlsafe(32)

        oauth_provider = self.providers[provider]
        auth_url = oauth_provider.get_authorization_url(state, redirect_uri)

        return auth_url, state

    async def exchange_code_for_token(
        self, provider: str, code: str, state: str
    ) -> str:
        """
        Exchange authorization code for access token.

        Args:
            provider: OAuth provider name
            code: Authorization code from OAuth callback
            state: State parameter for security

        Returns:
            str: Access token

        Raises:
            AuthenticationException: If token exchange fails
        """
        if provider not in self.providers:
            raise AuthenticationException(
                f"OAuth provider '{provider}' is not supported"
            )

        oauth_provider = self.providers[provider]
        return await oauth_provider.exchange_code_for_token(code)

    async def get_user_info(self, provider: str, access_token: str) -> OAuthUser:
        """
        Get user information from OAuth provider.

        Args:
            provider: OAuth provider name
            access_token: Access token from OAuth provider

        Returns:
            OAuthUser: User information from provider

        Raises:
            AuthenticationException: If user info retrieval fails
        """
        if provider not in self.providers:
            raise AuthenticationException(
                f"OAuth provider '{provider}' is not supported"
            )

        oauth_provider = self.providers[provider]
        user_data = await oauth_provider.get_user_info(access_token)

        return OAuthUser(
            provider=provider,
            provider_id=user_data["id"],
            email=user_data["email"],
            name=user_data.get("name"),
            username=user_data.get("username"),
            avatar_url=user_data.get("avatar_url"),
        )


class BaseOAuthProvider:
    """
    Base class for OAuth providers.
    """

    def __init__(self):
        self.client_id = None
        self.client_secret = None
        self.redirect_uri = None
        self.scope = []
        self.auth_url = None
        self.token_url = None
        self.user_info_url = None

    def get_authorization_url(
        self, state: str, redirect_uri: Optional[str] = None
    ) -> str:
        """
        Generate authorization URL for OAuth flow.

        Args:
            state: State parameter for security
            redirect_uri: Optional custom redirect URI

        Returns:
            str: Authorization URL
        """
        params = {
            "client_id": self.client_id,
            "redirect_uri": redirect_uri or self.redirect_uri,
            "scope": " ".join(self.scope),
            "response_type": "code",
            "state": state,
        }

        # Add provider-specific parameters
        params.update(self.get_additional_auth_params())

        query_string = urllib.parse.urlencode(params)
        return f"{self.auth_url}?{query_string}"

    def get_additional_auth_params(self) -> Dict[str, str]:
        """
        Get additional provider-specific authorization parameters.

        Returns:
            dict: Additional parameters
        """
        return {}

    async def exchange_code_for_token(self, code: str) -> str:
        """
        Exchange authorization code for access token.

        Args:
            code: Authorization code

        Returns:
            str: Access token

        Raises:
            ExternalServiceException: If token exchange fails
        """
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
        }

        headers = {"Accept": "application/json"}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.token_url, data=data, headers=headers, timeout=10.0
                )
                response.raise_for_status()

                token_data = response.json()

                if "access_token" not in token_data:
                    raise ExternalServiceException(
                        self.__class__.__name__, "Access token not found in response"
                    )

                return token_data["access_token"]

        except httpx.HTTPError as e:
            raise ExternalServiceException(
                self.__class__.__name__, f"Token exchange failed: {str(e)}"
            )

    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """
        Get user information from OAuth provider.

        Args:
            access_token: Access token

        Returns:
            dict: User information

        Raises:
            ExternalServiceException: If user info retrieval fails
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.user_info_url, headers=headers, timeout=10.0
                )
                response.raise_for_status()

                return response.json()

        except httpx.HTTPError as e:
            raise ExternalServiceException(
                self.__class__.__name__, f"User info retrieval failed: {str(e)}"
            )


class GoogleOAuthProvider(BaseOAuthProvider):
    """
    Google OAuth provider implementation.
    """

    def __init__(self):
        super().__init__()
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI
        self.scope = ["openid", "email", "profile"]
        self.auth_url = settings.GOOGLE_OAUTH_URL
        self.token_url = settings.GOOGLE_TOKEN_URL
        self.user_info_url = settings.GOOGLE_USER_INFO_URL

    def get_additional_auth_params(self) -> Dict[str, str]:
        """Get Google-specific authorization parameters."""
        return {"access_type": "offline", "prompt": "consent"}

    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """
        Get user information from Google.

        Args:
            access_token: Google access token

        Returns:
            dict: Normalized user information
        """
        user_data = await super().get_user_info(access_token)

        # Normalize Google user data
        return {
            "id": user_data["id"],
            "email": user_data["email"],
            "name": user_data.get("name"),
            "username": user_data.get("email", "").split("@")[
                0
            ],  # Use email prefix as username
            "avatar_url": user_data.get("picture"),
        }


class GitHubOAuthProvider(BaseOAuthProvider):
    """
    GitHub OAuth provider implementation.
    """

    def __init__(self):
        super().__init__()
        self.client_id = settings.GITHUB_CLIENT_ID
        self.client_secret = settings.GITHUB_CLIENT_SECRET
        self.redirect_uri = settings.GITHUB_REDIRECT_URI
        self.scope = ["user:email"]
        self.auth_url = settings.GITHUB_OAUTH_URL
        self.token_url = settings.GITHUB_TOKEN_URL
        self.user_info_url = settings.GITHUB_USER_INFO_URL

    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """
        Get user information from GitHub.

        Args:
            access_token: GitHub access token

        Returns:
            dict: Normalized user information
        """
        # Get basic user info
        user_data = await super().get_user_info(access_token)

        # Get user email (GitHub requires separate API call for emails)
        email = await self._get_user_email(access_token)

        # Normalize GitHub user data
        return {
            "id": str(user_data["id"]),
            "email": email,
            "name": user_data.get("name"),
            "username": user_data.get("login"),
            "avatar_url": user_data.get("avatar_url"),
        }

    async def _get_user_email(self, access_token: str) -> str:
        """
        Get user's primary email from GitHub.

        Args:
            access_token: GitHub access token

        Returns:
            str: User's primary email
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.github.com/user/emails", headers=headers, timeout=10.0
                )
                response.raise_for_status()

                emails = response.json()

                # Find primary email
                for email_data in emails:
                    if email_data.get("primary", False):
                        return email_data["email"]

                # Fallback to first email if no primary
                if emails:
                    return emails[0]["email"]

                raise ExternalServiceException("GitHub", "No email found for user")

        except httpx.HTTPError as e:
            raise ExternalServiceException(
                "GitHub", f"Email retrieval failed: {str(e)}"
            )
