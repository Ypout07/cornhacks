# /backend/models.py

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import datetime

# --- Database Setup ---
# This tells SQLAlchemy what our database file is called.
# 'sqlite:///./provenance.db' means it will create a file named 'provenance.db'
# right inside your /backend folder.
DATABASE_URL = "sqlite:///./provenance.db"

# This is the "base" class all our table-models will inherit from
Base = declarative_base()

# --- Table Definitions ---

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
    
    # This creates a "one-to-many" relationship.
    # One Batch can have MANY LedgerBlocks.
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
    
    previous_hash = Column(Text, nullable=True) # Null only for the genesis block
    current_hash = Column(Text, unique=True, nullable=False)
    
    # This is the "many-to-one" side.
    # It links this block to a specific Batch.
    batch_id = Column(Integer, ForeignKey("batches.id"))
    batch = relationship("Batch", back_populates="ledger_blocks")


# --- Engine and Session Setup ---
# These are the tools that connect to and talk to the database.

# The "engine" is the connection.
engine = create_engine(DATABASE_URL)

# The "SessionLocal" is what you'll use in your app.py to
# actually query or save data.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Helper Function ---
def create_db_and_tables():
    """
    A function to create the database file and all tables.
    You'll run this once from your app.py.
    """
    Base.metadata.create_all(bind=engine)