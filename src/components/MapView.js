import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Фикс иконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ inspections, centerLat = 55.03, centerLon = 82.92, zoom = 12 }) => {
  const position = [centerLat, centerLon];

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '400px', width: '100%', borderRadius: '12px', marginTop: '20px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {inspections.map((item) => (
        item.lat && item.lon && (
          <Marker
            key={item.id}
            position={[item.lat, item.lon]}
          >
            <Popup>
              <div>
                <strong>{item.buildingName}</strong><br />
                <span>Оценка: {item.safetyScore}%</span><br />
                <span>Статус: {item.status}</span><br />
                <Link to={`/detail/${item.id}`}>Подробнее →</Link>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapView;
