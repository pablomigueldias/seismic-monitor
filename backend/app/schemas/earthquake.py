from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class EarthquakeBase(BaseModel):
    id: str
    magnitude: float
    place: str
    time: datetime
    url: str
    detail: Optional[str] = None
    status: Optional[str] = None
    tsunami: Optional[int] = 0
    sig: Optional[int] = 0
    net: Optional[str] = None
    code: Optional[str] = None
    latitude: float
    longitude: float
    depth: float
    raw_data: Optional[Any] = None

    class Config:
        from_attributes = True

class EarthquakeCreate(EarthquakeBase):
    pass

class Earthquake(EarthquakeBase):
    updated: Optional[datetime] = None

    class Config:
        from_attributes = True