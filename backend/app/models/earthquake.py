from sqlalchemy import Column, String, Float, DateTime, Integer, JSON
from app.db.session import Base

class Earthquake(Base):
    __tablename__ = "earthquakes"

    id = Column(String, primary_key=True, index=True)
    magnitude = Column(Float, index=True)
    place = Column(String)
    time = Column(DateTime, index=True)
    updated = Column(DateTime)
    tz = Column(String, nullable=True)
    url = Column(String)
    
 
    detail = Column(String, nullable=True)
    status = Column(String, nullable=True)
    tsunami = Column(Integer, nullable=True)
    sig = Column(Integer, nullable=True)
    net = Column(String, nullable=True)
    code = Column(String, nullable=True)

    latitude = Column(Float)
    longitude = Column(Float)
    depth = Column(Float)
    
    raw_data = Column(JSON, nullable=True)