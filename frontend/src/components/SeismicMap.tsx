import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Earthquake } from '../services/api';

interface SeismicMapProps {
  data: Earthquake[];
}

const getColor = (mag: number) => {
  if (mag > 7) return '#ef4444';
  if (mag > 5) return '#f97316';
  if (mag > 3) return '#eab308';
  return '#22c55e';
};

export function SeismicMap({ data }: SeismicMapProps) {
  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {data.map((eq) => (
          <CircleMarker
            key={eq.id}
            center={[eq.latitude, eq.longitude]}
            pathOptions={{ 
              color: getColor(eq.magnitude), 
              fillColor: getColor(eq.magnitude), 
              fillOpacity: 0.7 
            }}
            radius={eq.magnitude * 2}
          >
            <Popup>
              <div className="text-slate-900">
                <strong className="text-lg">Mag: {eq.magnitude}</strong>
                <br />
                {eq.place}
                <br />
                <span className="text-xs text-slate-500">
                  {new Date(eq.time).toLocaleString()}
                </span>
                <br />
                <a href={eq.url} target="_blank" className="text-blue-600 underline text-xs">
                  Ver na USGS
                </a>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}