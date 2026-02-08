from sqlalchemy import Column,String,Float,DateTime,JSON
from app.db.session import Base
from datetime import datetime


class Earthquake(Base):

    __tablename__='earthquakes'

    id =  Column(String, primary_key=True, index=True)
    magnitude = Column(Float, index=True)
    place= Column(String)
    time = Column(DateTime, index=True)
    update = Column(DateTime)
    tz = Column(String, nullable=True)
    url = Column(String)
    datail =  Column(String, nullable=True)
    status =  Column(String, nullable=True)
    tsunami = Column(Float, nullable=True)
    sig = Column(Float, nullable=True)
    net = Column(String, nullable=True)
    code = Column(String,nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)
    depth = Column(Float)

    raw_data = Column(JSON, nullable=True)
