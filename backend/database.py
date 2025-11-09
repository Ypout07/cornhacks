from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import datetime

# Setup
DATABASE_URL = "sqlite:///./project.db"

# Base class
Base = declarative_base()

# The following are different tables:

class Batch(Base):
    """
    This class defines the 'batches' table.
    It holds the initial "birth certificate" info for a harvest.
    """
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    batch_uuid = Column(String, unique=True, index=True, nullable=False)
    farm_name = Column(String, nullable=False)
    harvest_date = Column(String)
    quantity_kg = Column(Float)
    
    ledger_blocks = relationship("LedgerBlock", back_populates="batch")

class LedgerBlock(Base):
    """
    This class defines the 'ledger_blocks' table.
    This is the actual "chain." Each row is a block.
    """
    __tablename__ = "ledger_blocks"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    actor_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    
    latitude = Column(Float)
    longitude = Column(Float)

    harvest_date = Column(String)
    
    previous_hash = Column(Text, nullable=True) # Null only for the genesis block
    current_hash = Column(Text, unique=True, nullable=False)
    
    batch_id = Column(Integer, ForeignKey("batches.id"))
    batch = relationship("Batch", back_populates="ledger_blocks")

# Connection point
engine = create_engine(DATABASE_URL)

# Use in app.py to save data
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db_and_tables(): # Only run ONCE in app.py
    Base.metadata.create_all(bind=engine)