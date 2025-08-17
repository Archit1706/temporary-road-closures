#!/usr/bin/env python3
"""
Database initialization script without alembic.
Creates all tables defined in SQLAlchemy models.
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import your models
try:
    from app.config import settings
    from app.models.base import Base
    from app.models.user import User
    from app.models.closure import Closure

    print("✅ Models imported successfully")
except ImportError as e:
    print(f"❌ Error importing models: {e}")
    sys.exit(1)


def create_tables():
    """Create all database tables."""
    try:
        # Create engine
        engine = create_engine(settings.DATABASE_URL)

        # Create all tables
        Base.metadata.create_all(bind=engine)

        print("✅ Database tables created successfully!")

    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        sys.exit(1)


if __name__ == "__main__":
    create_tables()
