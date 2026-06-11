"""
Test configuration: stub the PostgreSQL engine before any app modules are
imported so that unit tests can run without a real database connection.
"""

from unittest.mock import MagicMock, patch

# app/core/database.py calls create_engine() at module load time.
# Patch it here (conftest is imported before test-module collection) so that
# tests focused on pure business logic don't need a live database.
_engine_mock = MagicMock()
_create_engine_patcher = patch("sqlalchemy.create_engine", return_value=_engine_mock)
_create_engine_patcher.start()
