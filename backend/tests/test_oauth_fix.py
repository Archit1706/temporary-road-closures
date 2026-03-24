"""
Tests for GitHub Issue #18: OAuth2 StringDataRightTruncation fix.

Verifies that:
1. Long avatar URLs from OAuth providers are stored without truncation
2. OAuth errors redirect to the login page with error query parameters
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.main import app
from app.models.user import User
from app.schemas.user import OAuthUser
from app.services.user_service import UserService

LONG_AVATAR_URL = "https://www.openstreetmap.org/" + "a" * 570  # 600+ chars total


class TestAvatarUrlLongString:
    """Test that long avatar URLs are handled correctly after widening to TEXT."""

    def test_avatar_url_long_string_does_not_truncate(self):
        """
        Create an OAuthUser with a 600+ char avatar_url, call
        create_or_get_oauth_user(), and verify the full URL is stored.
        """
        oauth_user = OAuthUser(
            provider="osm",
            provider_id="123456",
            email=None,
            name="Test User",
            username="testuser_osm",
            avatar_url=LONG_AVATAR_URL,
        )

        # Mock the DB session
        mock_db = MagicMock()

        # No existing user found by provider/provider_id
        mock_db.query.return_value.filter.return_value.first.return_value = None

        # Capture the User object passed to db.add()
        created_user = None

        def capture_add(user):
            nonlocal created_user
            created_user = user

        mock_db.add.side_effect = capture_add
        mock_db.commit.return_value = None

        # db.refresh should populate the user (simulate DB refresh)
        def fake_refresh(user):
            user.id = 1

        mock_db.refresh.side_effect = fake_refresh

        service = UserService(mock_db)

        # Mock _generate_unique_username to avoid extra DB queries
        with patch.object(
            service, "_generate_unique_username", return_value="testuser_osm"
        ):
            user = service.create_or_get_oauth_user(oauth_user)

        assert user is not None
        assert user.avatar_url == LONG_AVATAR_URL
        assert len(user.avatar_url) > 255
        assert len(user.avatar_url) == len(LONG_AVATAR_URL)

    def test_oauth_user_schema_accepts_long_avatar_url(self):
        """Verify the OAuthUser Pydantic schema accepts URLs > 255 chars."""
        oauth_user = OAuthUser(
            provider="osm",
            provider_id="999",
            avatar_url=LONG_AVATAR_URL,
        )
        assert oauth_user.avatar_url == LONG_AVATAR_URL
        assert len(oauth_user.avatar_url) > 255

    def test_user_model_avatar_url_is_text_type(self):
        """Verify the User model avatar_url column is Text, not String(255)."""
        from sqlalchemy import Text

        column = User.__table__.columns["avatar_url"]
        assert isinstance(column.type, Text)


@pytest.mark.asyncio
class TestOAuthErrorRedirect:
    """Test that OAuth callback errors redirect with proper error params."""

    async def test_oauth_error_redirects_to_login_with_error_param(self):
        """
        Mock OAuthService to raise during token exchange, then verify the
        callback redirects to /login?error=oauth_failed with a reason param.
        """
        # Override get_db to avoid real DB connection
        mock_db = MagicMock()
        app.dependency_overrides[get_db] = lambda: mock_db

        try:
            transport = ASGITransport(app=app)
            async with AsyncClient(
                transport=transport, base_url="http://test"
            ) as client:
                # Set the oauth_state cookie so state validation passes
                client.cookies.set("oauth_state_osm", "test_state")

                # Mock OAuthService.exchange_code_for_token to raise
                with patch("app.api.auth.OAuthService") as MockOAuthService:
                    mock_instance = MockOAuthService.return_value
                    mock_instance.exchange_code_for_token = AsyncMock(
                        side_effect=Exception("Token exchange failed")
                    )

                    # Also need OAUTH_ENABLED=True
                    with patch("app.api.auth.settings") as mock_settings:
                        mock_settings.OAUTH_ENABLED = True
                        mock_settings.FRONTEND_URL = "http://localhost:3000"
                        mock_settings.OAUTH_ERROR_REDIRECT = "/login?error=oauth_failed"

                        response = await client.get(
                            "/api/v1/auth/oauth/osm/callback",
                            params={"code": "test_code", "state": "test_state"},
                            follow_redirects=False,
                        )

                assert response.status_code in (302, 307)
                location = response.headers.get("location", "")
                assert "error=oauth_failed" in location
                assert "reason=" in location
        finally:
            app.dependency_overrides.clear()

    async def test_oauth_callback_with_error_param_redirects(self):
        """
        When the OAuth provider returns an error param directly,
        the callback should redirect with that error as the reason.
        """
        mock_db = MagicMock()
        app.dependency_overrides[get_db] = lambda: mock_db

        try:
            transport = ASGITransport(app=app)
            async with AsyncClient(
                transport=transport, base_url="http://test"
            ) as client:
                with patch("app.api.auth.settings") as mock_settings:
                    mock_settings.OAUTH_ENABLED = True
                    mock_settings.FRONTEND_URL = "http://localhost:3000"
                    mock_settings.OAUTH_ERROR_REDIRECT = "/login?error=oauth_failed"

                    response = await client.get(
                        "/api/v1/auth/oauth/osm/callback",
                        params={"error": "access_denied"},
                        follow_redirects=False,
                    )

                assert response.status_code in (302, 307)
                location = response.headers.get("location", "")
                assert "error=oauth_failed" in location
                assert "reason=access_denied" in location
        finally:
            app.dependency_overrides.clear()
