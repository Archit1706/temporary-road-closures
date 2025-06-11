"""
Base model class with common fields and methods.
"""

from sqlalchemy import Column, DateTime, func
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import Session
from typing import Any, Dict, List, Optional
import datetime

from app.core.database import Base


class TimestampMixin:
    """Mixin for adding timestamp fields to models."""

    created_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False,
        doc="Record creation timestamp",
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
        nullable=False,
        doc="Record last update timestamp",
    )


class BaseModel(Base, TimestampMixin):
    """
    Base model class that includes common fields and methods.
    """

    __abstract__ = True

    @declared_attr
    def __tablename__(cls) -> str:
        """Generate table name from class name."""
        return cls.__name__.lower()

    def to_dict(self, exclude: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Convert model instance to dictionary.

        Args:
            exclude: List of fields to exclude from the dictionary

        Returns:
            dict: Model data as dictionary
        """
        exclude = exclude or []
        result = {}

        for column in self.__table__.columns:
            if column.name not in exclude:
                value = getattr(self, column.name)

                # Handle datetime serialization
                if isinstance(value, datetime.datetime):
                    value = value.isoformat()

                result[column.name] = value

        return result

    def update_from_dict(
        self, data: Dict[str, Any], exclude: Optional[List[str]] = None
    ) -> None:
        """
        Update model instance from dictionary.

        Args:
            data: Dictionary containing field updates
            exclude: List of fields to exclude from update
        """
        exclude = exclude or ["id", "created_at"]

        for key, value in data.items():
            if key not in exclude and hasattr(self, key):
                setattr(self, key, value)

    @classmethod
    def create(cls, db: Session, **kwargs) -> "BaseModel":
        """
        Create and save a new instance.

        Args:
            db: Database session
            **kwargs: Field values for the new instance

        Returns:
            BaseModel: Created instance
        """
        instance = cls(**kwargs)
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance

    @classmethod
    def get_by_id(cls, db: Session, id: int) -> Optional["BaseModel"]:
        """
        Get instance by ID.

        Args:
            db: Database session
            id: Instance ID

        Returns:
            BaseModel or None: Found instance or None
        """
        return db.query(cls).filter(cls.id == id).first()

    @classmethod
    def get_all(cls, db: Session, skip: int = 0, limit: int = 100) -> List["BaseModel"]:
        """
        Get all instances with pagination.

        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List[BaseModel]: List of instances
        """
        return db.query(cls).offset(skip).limit(limit).all()

    def save(self, db: Session) -> "BaseModel":
        """
        Save instance to database.

        Args:
            db: Database session

        Returns:
            BaseModel: Saved instance
        """
        db.add(self)
        db.commit()
        db.refresh(self)
        return self

    def delete(self, db: Session) -> None:
        """
        Delete instance from database.

        Args:
            db: Database session
        """
        db.delete(self)
        db.commit()

    def __repr__(self) -> str:
        """String representation of the model."""
        return f"<{self.__class__.__name__}(id={getattr(self, 'id', None)})>"


class SoftDeleteMixin:
    """Mixin for soft delete functionality."""

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
        doc="Soft delete timestamp",
    )

    @property
    def is_deleted(self) -> bool:
        """Check if the record is soft deleted."""
        return self.deleted_at is not None

    def soft_delete(self, db: Session) -> None:
        """
        Soft delete the record.

        Args:
            db: Database session
        """
        self.deleted_at = func.now()
        self.save(db)

    def restore(self, db: Session) -> None:
        """
        Restore a soft deleted record.

        Args:
            db: Database session
        """
        self.deleted_at = None
        self.save(db)

    @classmethod
    def get_active(
        cls, db: Session, skip: int = 0, limit: int = 100
    ) -> List["BaseModel"]:
        """
        Get all non-deleted instances.

        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List[BaseModel]: List of active instances
        """
        return (
            db.query(cls)
            .filter(cls.deleted_at.is_(None))
            .offset(skip)
            .limit(limit)
            .all()
        )


class AuditMixin:
    """Mixin for audit trail functionality."""

    @declared_attr
    def created_by_id(cls):
        return Column(
            "created_by_id", nullable=True, doc="ID of user who created this record"
        )

    @declared_attr
    def updated_by_id(cls):
        return Column(
            "updated_by_id",
            nullable=True,
            doc="ID of user who last updated this record",
        )
