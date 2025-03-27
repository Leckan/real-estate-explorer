'use client';

import { useState } from 'react';

export default function Sidebar({ data, setFilteredData }) {
  const [filters, setFilters] = useState({
    search: '',
    propertyTypes: new Set(data.map(d => d.propertyType)),
    priceRange: [0, Math.max(...data.map(d => d.price || 0))],
    bedrooms: [0, Math.max(...data.map(d => d.beds || 0))],
    bathrooms: [0, Math.max(...data.map(d => d.baths || 0))],
    squareFeet: [Math.min(...data.map(d => d.squareFeet || 0)), Math.max(...data.map(d => d.squareFeet || 0))],
    yearBuilt: [Math.min(...data.map(d => d.yearBuilt || 0)), Math.max(...data.map(d => d.yearBuilt || 0))],
    statuses: new Set(data.map(d => d.status)),
  });

  const applyFilters = () => {
    const filtered = data.filter(item => 
      (filters.search === '' || 
        (item.address && item.address.toLowerCase().includes(filters.search.toLowerCase())) || 
        (item.city && item.city.toLowerCase().includes(filters.search.toLowerCase()))) &&
      filters.propertyTypes.has(item.propertyType) &&
      (item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]) &&
      (item.beds >= filters.bedrooms[0] && item.beds <= filters.bedrooms[1]) &&
      (item.baths >= filters.bathrooms[0] && item.baths <= filters.bathrooms[1]) &&
      (item.squareFeet >= filters.squareFeet[0] && item.squareFeet <= filters.squareFeet[1]) &&
      (item.yearBuilt >= filters.yearBuilt[0] && item.yearBuilt <= filters.yearBuilt[1]) &&
      filters.statuses.has(item.status)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <input
        type="text"
        placeholder="Search by Address or City"
        className="w-full p-2 mb-4 border rounded"
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
        onBlur={applyFilters}
      />
      {/* Add more filter controls here if needed */}
      <button onClick={applyFilters} className="w-full bg-blue-500 text-white p-2 rounded">Apply Filters</button>
    </div>
  );
}