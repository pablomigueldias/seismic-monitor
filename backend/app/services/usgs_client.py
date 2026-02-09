import requests
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.earthquake import Earthquake
from app.schemas.earthquake import EarthquakeCreate

USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"


def fetch_earthquakes(db: Session):
    try:
        response = requests.get(USGS_URL)
        response.raise_for_status()
        data = response.json()

        count_new = 0
        count_updated = 0

        for feature in data['features']:
            props = feature['properties']
            geometry = feature['geometry']

            event_time = datetime.fromtimestamp(props['time'] / 1000.0)
            updated_time = datetime.fromtimestamp(props['updated'] / 1000.0)

            earthquake_data = {
                "id": feature['id'],
                "magnitude": props['mag'] or 0.0,
                "place": props['place'],
                "time": event_time,
                "updated": updated_time,
                "url": props['url'],
                "detail": props['detail'],
                "status": props['status'],
                "tsunami": props['tsunami'],
                "sig": props['sig'],
                "net": props['net'],
                "code": props['code'],
                "latitude": geometry['coordinates'][1],
                "longitude": geometry['coordinates'][0],
                "depth": geometry['coordinates'][2],
                "raw_data": feature
            }

            existing = db.query(Earthquake).filter(
                Earthquake.id == feature['id']).first()

            if existing:
                if existing.updated != updated_time:
                    for key, value in earthquake_data.items():
                        setattr(existing, key, value)
                    count_updated += 1
            else:
                new_eq = Earthquake(**earthquake_data)
                db.add(new_eq)
                count_new += 1

        db.commit()
        return {"status": "success", "new": count_new, "updated": count_updated}

    except Exception as e:
        print(f"Erro ao buscar dados da USGS: {e}")
        return {"status": "error", "message": str(e)}
