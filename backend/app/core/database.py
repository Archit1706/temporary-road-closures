"""
Database configuration and session management.
"""

from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from typing import Generator
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Database engine configuration
engine_kwargs = {
    "pool_size": settings.DB_POOL_SIZE,
    "max_overflow": settings.DB_MAX_OVERFLOW,
    "pool_recycle": settings.DB_POOL_RECYCLE,
    "pool_pre_ping": True,  # Verify connections before use
}

# Create engine
engine = create_engine(settings.get_database_url(), **engine_kwargs)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Metadata with naming convention for constraints
naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=naming_convention)

# Base class for models
Base = declarative_base(metadata=metadata)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.

    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


async def init_database() -> None:
    """
    Initialize database with tables and extensions.
    """
    try:
        # Import all models to ensure they're registered
        from app.models import closure, user  # noqa

        # Check if PostGIS extension is available
        with engine.connect() as conn:
            # Enable PostGIS extension if not already enabled
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis_topology;"))
                conn.commit()
                logger.info("PostGIS extensions enabled")
            except Exception as e:
                logger.warning(f"Could not enable PostGIS extensions: {e}")

        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")

    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


async def close_database() -> None:
    """
    Close database connections.
    """
    try:
        engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database connections: {e}")


def create_test_engine():
    """
    Create a test database engine for testing.
    """
    return create_engine(
        settings.DATABASE_URL,
        poolclass=StaticPool,
        connect_args=(
            {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
        ),
    )


class DatabaseManager:
    """
    Database connection manager for advanced operations.
    """

    def __init__(self):
        self.engine = engine
        self.session_factory = SessionLocal

    def get_session(self) -> Session:
        """Get a new database session."""
        return self.session_factory()

    def health_check(self) -> bool:
        """
        Check database connectivity.

        Returns:
            bool: True if database is accessible, False otherwise
        """
        try:
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return False

    def get_database_info(self) -> dict:
        """
        Get database information for monitoring.

        Returns:
            dict: Database connection information
        """
        try:
            with self.engine.connect() as conn:
                # Get PostgreSQL version
                result = conn.execute(text("SELECT version()"))
                version = result.fetchone()[0]

                # Get PostGIS version if available
                try:
                    result = conn.execute(text("SELECT PostGIS_Version()"))
                    postgis_version = result.fetchone()[0]
                except:
                    postgis_version = "Not available"

                return {
                    "postgresql_version": version,
                    "postgis_version": postgis_version,
                    "pool_size": self.engine.pool.size(),
                    "checked_out": self.engine.pool.checkedout(),
                    "overflow": self.engine.pool.overflow(),
                }
        except Exception as e:
            logger.error(f"Could not get database info: {e}")
            return {"error": str(e)}


# Global database manager instance
db_manager = DatabaseManager()
