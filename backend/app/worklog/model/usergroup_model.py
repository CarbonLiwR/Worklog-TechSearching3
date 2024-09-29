from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime


Base = declarative_base()


class UserGroup(Base):
    __tablename__ = "user_group"
    id = Column(Integer, primary_key=True, index=True)
    user_uuid = Column(String(32), ForeignKey("user.uuid"), nullable=False)
    group_uuid = Column(String(32), ForeignKey("group.uuid"), nullable=False)
    role = Column(Enum('creator', 'admin', 'member', name='group_roles'), default='member')
    join_datetime = Column(DateTime, default=datetime.utcnow)

    # # Relationships
    # user = relationship("User", back_populates="groups")
    # group = relationship("Group", back_populates="users")
