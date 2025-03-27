import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRouter } from 'next/router';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

export default function PropertyDetails({ property }) {
  const router = useRouter();

  if (!property) return <p className="text-center text-gray-500">Select a property from the listings</p>;

  const handleAnalyzeDeal = () => {
    router.push({
      pathname: '/',
      query: { tab: 'analyzer', address: property.address },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{property.address || 'Unknown Address'}</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div>
          <p><strong>City:</strong> {property.city || 'N/A'}</p>
          <p><strong>State:</strong> {property.state || 'N/A'}</p>
          <p><strong>Zip Code:</strong> {property.zipCode || 'N/A'}</p>
          <p><strong>Price:</strong> ${property.price !== undefined ? property.price.toLocaleString() : 'N/A'}</p>
          <p><strong>Property Type:</strong> {property.propertyType || 'N/A'}</p>
          <p><strong>Status:</strong> {property.status || 'N/A'}</p>
          {property.url && (
            <p>
              <a href={property.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Listing
              </a>
            </p>
          )}
        </div>

        {/* Right Column - Details */}
        <div>
          <p><strong>Beds:</strong> {property.beds ?? 'N/A'}</p>
          <p><strong>Baths:</strong> {property.baths ?? 'N/A'}</p>
          <p><strong>Square Feet:</strong> {property.squareFeet !== undefined ? property.squareFeet.toLocaleString() : 'N/A'}</p>
          <p><strong>Lot Size:</strong> {property.lotSize !== undefined ? property.lotSize.toLocaleString() : 'N/A'}</p>
          <p><strong>Year Built:</strong> {property.yearBuilt || 'N/A'}</p>
          <p><strong>Days on Market:</strong> {property.daysOnMarket || 'N/A'}</p>
          <p><strong>HOA/Month:</strong> ${property.hoaMonthly !== undefined ? property.hoaMonthly.toLocaleString() : 'N/A'}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6">
        <p><strong>Sale Type:</strong> {property.saleType || 'N/A'}</p>
        <p><strong>Sold Date:</strong> {property.soldDate || 'N/A'}</p>
        <p><strong>Next Open House:</strong> {property.openHouseStart !== 'N/A' ? `${property.openHouseStart} - ${property.openHouseEnd}` : 'N/A'}</p>
        <p><strong>MLS#:</strong> {property.mlsNumber || 'N/A'}</p>
      </div>

      {/* Mini Map */}
      {property.latitude !== 0 && property.longitude !== 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <MapContainer
            center={[property.latitude, property.longitude]}
            zoom={15}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[property.latitude, property.longitude]}>
              <Popup>{property.address || 'Unknown Address'}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={handleAnalyzeDeal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Analyze This Deal
        </button>
      </div>
    </div>
  );
}