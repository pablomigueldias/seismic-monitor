from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.earthquake import Earthquake
from app.schemas.earthquake import Earthquake as EarthquakeSchema
from app.services.usgs_client import fetch_earthquakes


router = APIRouter()

@router.post('/sync')
def sync_earthquakes(db:Session = Depends(get_db)):
    result = fetch_earthquakes(db)
    if result['status'] == 'error':
        raise HTTPException(status_code=500, detail=result['message'])
    return result

@router.get('/', response_model=List[EarthquakeSchema])
def read_earthquakes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    min_mag: Optional[float] = 0
):
    query = db.query(Earthquake)

    if min_mag:
        query = query.filter(Earthquake.magnitude >= min_mag)

    return query.order_by(Earthquake.time.desc()).offset(skip).limit(limit).all()
