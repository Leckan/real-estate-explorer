'use client';

import { useRouter } from 'next/navigation';

export default function Listings({ data, setSelectedProperty }) {
  const router = useRouter();
  const validData = Array.isArray(data) ? data.filter(property => property && property.address) : [];

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    router.push(`/?tab=details&address=${encodeURIComponent(property.address)}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Address</th>
            <th className="p-2">City</th>
            <th className="p-2">Price</th>
            <th className="p-2">Beds</th>
            <th className="p-2">Baths</th>
            <th className="p-2">Sq Ft</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {validData.map((property, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">
                {property.url ? (
                  <a href={property.url} target="_blank" className="text-blue-500">
                    {property.address || 'Unknown Address'}
                  </a>
                ) : (
                  property.address || 'Unknown Address'
                )}
              </td>
              <td className="p-2">{property.city || 'N/A'}</td>
              <td className="p-2">
                ${property.price !== undefined && property.price !== null ? property.price.toLocaleString() : 'N/A'}
              </td>
              <td className="p-2">{property.beds ?? 'N/A'}</td>
              <td className="p-2">{property.baths ?? 'N/A'}</td>
              <td className="p-2">
                {property.squareFeet !== undefined && property.squareFeet !== null ? property.squareFeet.toLocaleString() : 'N/A'}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleSelectProperty(property)}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}