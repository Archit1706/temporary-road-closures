"""
Security middleware for enhanced protection and monitoring.
"""

from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any, Callable
import time
import json
import hashlib
from datetime import datetime, timezone, timedelta
from collections import defaultdict
import asyncio

from app.core.database import SessionLocal
from app.models.auth import AuthEvent, AuthEventType
from app.core.exceptions import RateLimitException
from app.config import settings


class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Security middleware for rate limiting, monitoring, and threat detection.
    """

    def __init__(self, app):
        super().__init__(app)
        self.rate_limit_storage = defaultdict(list)
        self.suspicious_ips = set()
        self.cleanup_interval = 300  # 5 minutes
        self.last_cleanup = time.time()

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request through security checks.

        Args:
            request: FastAPI request
            call_next: Next middleware/endpoint

        Returns:
            Response: HTTP response
        """
        start_time = time.time()

        # Get client information
        client_ip = self._get_client_ip(request)
        user_agent = request.headers.get("user-agent", "")

        # Skip security checks for health endpoints
        if self._is_health_endpoint(request.url.path):
            return await call_next(request)

        try:
            # Rate limiting check
            await self._check_rate_limits(request, client_ip)

            # Suspicious activity detection
            await self._check_suspicious_activity(request, client_ip, user_agent)

            # Process request
            response = await call_next(request)

            # Log security events
            await self._log_security_event(request, response, client_ip, user_agent)

            # Add security headers
            self._add_security_headers(response)

            # Cleanup old data periodically
            await self._periodic_cleanup()

            return response

        except RateLimitException as e:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "rate_limit_exceeded",
                    "message": str(e),
                    "retry_after": e.details.get("retry_after", 60),
                },
                headers={"Retry-After": str(e.details.get("retry_after", 60))},
            )
        except Exception as e:
            # Log unexpected errors
            await self._log_security_event(
                request, None, client_ip, user_agent, error=str(e)
            )
            raise

    def _get_client_ip(self, request: Request) -> str:
        """
        Get client IP address considering proxy headers.

        Args:
            request: FastAPI request

        Returns:
            str: Client IP address
        """
        # Check for forwarded headers (load balancer/proxy)
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip

        # Fallback to direct connection
        if hasattr(request, "client") and request.client:
            return request.client.host

        return "unknown"

    def _is_health_endpoint(self, path: str) -> bool:
        """
        Check if path is a health/monitoring endpoint.

        Args:
            path: Request path

        Returns:
            bool: True if health endpoint
        """
        health_paths = ["/health", "/metrics", "/ping", "/status"]
        return any(path.startswith(hp) for hp in health_paths)

    async def _check_rate_limits(self, request: Request, client_ip: str) -> None:
        """
        Check rate limits for the request.

        Args:
            request: FastAPI request
            client_ip: Client IP address

        Raises:
            RateLimitException: If rate limit exceeded
        """
        if not settings.RATE_LIMIT_ENABLED:
            return

        current_time = time.time()
        window_start = current_time - settings.RATE_LIMIT_WINDOW

        # Clean old requests
        self.rate_limit_storage[client_ip] = [
            req_time
            for req_time in self.rate_limit_storage[client_ip]
            if req_time > window_start
        ]

        # Check limits
        request_count = len(self.rate_limit_storage[client_ip])

        # Different limits for different endpoints
        limit = self._get_rate_limit_for_endpoint(request.url.path)

        if request_count >= limit:
            raise RateLimitException(
                "Rate limit exceeded", retry_after=int(settings.RATE_LIMIT_WINDOW)
            )

        # Record this request
        self.rate_limit_storage[client_ip].append(current_time)

    def _get_rate_limit_for_endpoint(self, path: str) -> int:
        """
        Get rate limit for specific endpoint.

        Args:
            path: Request path

        Returns:
            int: Rate limit for this endpoint
        """
        # Authentication endpoints have stricter limits
        if "/auth/" in path:
            return min(20, settings.RATE_LIMIT_REQUESTS // 5)

        # API endpoints
        if "/api/" in path:
            return settings.RATE_LIMIT_REQUESTS

        # Default limit
        return settings.RATE_LIMIT_REQUESTS * 2

    async def _check_suspicious_activity(
        self, request: Request, client_ip: str, user_agent: str
    ) -> None:
        """
        Check for suspicious activity patterns.

        Args:
            request: FastAPI request
            client_ip: Client IP address
            user_agent: User agent string

        Raises:
            HTTPException: If suspicious activity detected
        """
        # Check if IP is already flagged
        if client_ip in self.suspicious_ips:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied due to suspicious activity",
            )

        # Check for common attack patterns
        if self._is_suspicious_request(request, user_agent):
            self.suspicious_ips.add(client_ip)

            # Log suspicious activity
            db = SessionLocal()
            try:
                AuthEvent.log_event(
                    db=db,
                    event_type=AuthEventType.SUSPICIOUS_ACTIVITY,
                    success=False,
                    ip_address=client_ip,
                    user_agent=user_agent,
                    details={
                        "path": str(request.url.path),
                        "method": request.method,
                        "reason": "suspicious_patterns",
                    },
                )
            finally:
                db.close()

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied due to suspicious activity",
            )

    def _is_suspicious_request(self, request: Request, user_agent: str) -> bool:
        """
        Detect suspicious request patterns.

        Args:
            request: FastAPI request
            user_agent: User agent string

        Returns:
            bool: True if request is suspicious
        """
        path = request.url.path.lower()

        # Check for common attack patterns
        suspicious_patterns = [
            "eval(",
            "script>",
            "javascript:",
            "onload=",
            "onerror=",
            "../",
            "..\\",
            "/etc/passwd",
            "/etc/shadow",
            "union select",
            "drop table",
            "insert into",
            "'; drop",
            "1=1",
            "1' or '1'='1",
            "wp-admin",
            "wp-content",
            "phpinfo",
            ".php",
            ".asp",
            ".jsp",
        ]

        for pattern in suspicious_patterns:
            if pattern in path or pattern in str(request.url.query):
                return True

        # Check for suspicious user agents
        if not user_agent or len(user_agent) < 10:
            return True

        suspicious_ua_patterns = [
            "sqlmap",
            "nikto",
            "nmap",
            "burp",
            "gobuster",
            "masscan",
            "zap",
            "w3af",
            "scanner",
        ]

        ua_lower = user_agent.lower()
        for pattern in suspicious_ua_patterns:
            if pattern in ua_lower:
                return True

        return False

    async def _log_security_event(
        self,
        request: Request,
        response: Optional[Response],
        client_ip: str,
        user_agent: str,
        error: Optional[str] = None,
    ) -> None:
        """
        Log security-relevant events.

        Args:
            request: FastAPI request
            response: HTTP response (if available)
            client_ip: Client IP address
            user_agent: User agent string
            error: Error message (if any)
        """
        # Only log certain events to avoid noise
        if not self._should_log_event(request, response):
            return

        db = SessionLocal()
        try:
            # Determine event type
            event_type = self._determine_event_type(request, response, error)
            success = response.status_code < 400 if response else False

            # Prepare event details
            details = {
                "method": request.method,
                "path": str(request.url.path),
                "status_code": response.status_code if response else None,
                "response_time": getattr(response, "response_time", None),
            }

            if error:
                details["error"] = error

            # Log the event
            AuthEvent.log_event(
                db=db,
                event_type=event_type,
                success=success,
                ip_address=client_ip,
                user_agent=user_agent,
                details=details,
            )

        except Exception:
            # Don't let logging errors break the request
            pass
        finally:
            db.close()

    def _should_log_event(self, request: Request, response: Optional[Response]) -> bool:
        """
        Determine if event should be logged.

        Args:
            request: FastAPI request
            response: HTTP response

        Returns:
            bool: True if should log
        """
        path = request.url.path

        # Always log auth-related events
        if "/auth/" in path:
            return True

        # Log failed requests
        if response and response.status_code >= 400:
            return True

        # Log admin actions
        if "/admin/" in path:
            return True

        # Don't log routine API calls
        return False

    def _determine_event_type(
        self, request: Request, response: Optional[Response], error: Optional[str]
    ) -> str:
        """
        Determine the type of security event.

        Args:
            request: FastAPI request
            response: HTTP response
            error: Error message

        Returns:
            str: Event type
        """
        path = request.url.path

        if error:
            return "system_error"

        if "/auth/login" in path:
            if response and response.status_code == 200:
                return AuthEventType.LOGIN
            else:
                return AuthEventType.FAILED_LOGIN

        if "/auth/oauth/" in path:
            if response and response.status_code in [200, 302]:
                return AuthEventType.OAUTH_LOGIN
            else:
                return AuthEventType.OAUTH_ERROR

        if response and response.status_code == 403:
            return "access_denied"

        if response and response.status_code == 429:
            return "rate_limit_exceeded"

        return "api_access"

    def _add_security_headers(self, response: Response) -> None:
        """
        Add security headers to response.

        Args:
            response: HTTP response
        """
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Content-Security-Policy": "default-src 'self'",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        }

        if not settings.DEBUG:
            security_headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains"
            )

        for header, value in security_headers.items():
            response.headers[header] = value

    async def _periodic_cleanup(self) -> None:
        """
        Periodic cleanup of old data.
        """
        current_time = time.time()

        if current_time - self.last_cleanup < self.cleanup_interval:
            return

        # Clean rate limit storage
        cutoff_time = current_time - settings.RATE_LIMIT_WINDOW
        for ip in list(self.rate_limit_storage.keys()):
            self.rate_limit_storage[ip] = [
                req_time
                for req_time in self.rate_limit_storage[ip]
                if req_time > cutoff_time
            ]

            # Remove empty entries
            if not self.rate_limit_storage[ip]:
                del self.rate_limit_storage[ip]

        # Clean suspicious IPs (remove after 1 hour)
        # In production, you might want to persist this data
        self.suspicious_ips.clear()

        # Database cleanup
        await self._cleanup_database()

        self.last_cleanup = current_time

    async def _cleanup_database(self) -> None:
        """
        Clean up old database records.
        """
        db = SessionLocal()
        try:
            from app.models.auth import AuthSession, OAuthState
            from app.models.user import User

            # Clean expired sessions
            AuthSession.cleanup_expired_sessions(db)

            # Clean expired OAuth states
            OAuthState.cleanup_expired_states(db)

            # Unlock expired account locks
            User.cleanup_locked_accounts(db)

        except Exception:
            # Don't let cleanup errors break the application
            pass
        finally:
            db.close()


class AuthenticationMiddleware(BaseHTTPMiddleware):
    """
    Enhanced authentication middleware with session tracking.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process authentication and session tracking.

        Args:
            request: FastAPI request
            call_next: Next middleware/endpoint

        Returns:
            Response: HTTP response
        """
        # Skip auth middleware for public endpoints
        if self._is_public_endpoint(request.url.path):
            return await call_next(request)

        # Check for session tracking
        session_id = request.headers.get("X-Session-ID")
        if session_id:
            await self._track_session(session_id, request)

        response = await call_next(request)

        # Add session tracking to response if user is authenticated
        if hasattr(request.state, "user") and request.state.user:
            await self._update_session_activity(session_id, request.state.user)

        return response

    def _is_public_endpoint(self, path: str) -> bool:
        """
        Check if endpoint is public (doesn't require authentication).

        Args:
            path: Request path

        Returns:
            bool: True if public endpoint
        """
        public_paths = [
            "/health",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/auth/login",
            "/auth/register",
            "/auth/oauth/",
            "/closures",  # Public read access
        ]

        return any(path.startswith(pp) for pp in public_paths)

    async def _track_session(self, session_id: str, request: Request) -> None:
        """
        Track session activity.

        Args:
            session_id: Session identifier
            request: FastAPI request
        """
        db = SessionLocal()
        try:
            from app.models.auth import AuthSession

            session = AuthSession.get_active_session(db, session_id)
            if session:
                # Update session activity
                session.updated_at = datetime.now(timezone.utc)
                db.commit()

                # Store user in request state
                request.state.session = session
                request.state.user = session.user

        except Exception:
            pass
        finally:
            db.close()

    async def _update_session_activity(self, session_id: str, user) -> None:
        """
        Update session activity timestamp.

        Args:
            session_id: Session identifier
            user: Authenticated user
        """
        if not session_id:
            return

        db = SessionLocal()
        try:
            from app.models.auth import AuthSession

            session = AuthSession.get_active_session(db, session_id)
            if session and session.user_id == user.id:
                session.updated_at = datetime.now(timezone.utc)
                db.commit()

        except Exception:
            pass
        finally:
            db.close()


# Request ID middleware for tracing
class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add unique request IDs for tracing.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Add request ID to request and response.

        Args:
            request: FastAPI request
            call_next: Next middleware/endpoint

        Returns:
            Response: HTTP response with request ID
        """
        # Generate request ID
        request_id = self._generate_request_id()

        # Add to request state
        request.state.request_id = request_id

        # Process request
        response = await call_next(request)

        # Add to response headers
        response.headers["X-Request-ID"] = request_id

        return response

    def _generate_request_id(self) -> str:
        """
        Generate unique request ID.

        Returns:
            str: Request ID
        """
        import uuid

        return str(uuid.uuid4())


# CORS middleware enhancement
def get_cors_middleware():
    """
    Get configured CORS middleware.

    Returns:
        CORSMiddleware: Configured middleware
    """
    from fastapi.middleware.cors import CORSMiddleware

    return CORSMiddleware(
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=[
            "Authorization",
            "Content-Type",
            "X-API-Key",
            "X-Session-ID",
            "X-Request-ID",
            "Accept",
            "Origin",
            "User-Agent",
        ],
        expose_headers=[
            "X-Request-ID",
            "X-Process-Time",
            "X-RateLimit-Remaining",
            "X-RateLimit-Reset",
        ],
    )
