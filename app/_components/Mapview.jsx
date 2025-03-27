import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/_leaflet/marker-icon-2x.png',
  iconUrl: '/_leaflet/marker-icon.png',
  shadowUrl: '/_leaflet/marker-shadow.png',
});

export default function MapView({ data }) {
  const validData = Array.isArray(data) ? data.filter(property => 
    property && 
    typeof property.latitude === 'number' && 
    typeof property.longitude === 'number'
  ) : [];

  return (
    <MapContainer center={[34.0522, -118.2437]} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {validData.map((property, index) => (
        <Marker key={index} position={[property.latitude, property.longitude]}>
          <Popup>
            ${property.price !== undefined && property.price !== null ? property.price.toLocaleString() : 'N/A'} - 
            {property.address || 'Unknown Address'}<br />
            {property.propertyType || 'Unknown Type'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}