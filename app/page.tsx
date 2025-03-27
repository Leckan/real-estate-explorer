"use client";

import { useState, useEffect } from 'react';
import Sidebar from './_components/Sidebar';
import MapView from './_components/MapView';
import Listings from './_components/Listings';
import Statistics from './_components/Statistics';
import PropertyDetails from './_components/PropertyDetails';
import DealAnalyzer from './_components/DealAnalyzer';
import Papa from 'papaparse';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const address = searchParams.get('address');
  const [activeTab, setActiveTab] = useState(tab || 'map');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/_data/real_estate_data.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          transformHeader: header => header.trim(),
          transform: (value, header) => {
            const numericFields = ['PRICE', 'BEDS', 'BATHS', 'SQUARE FEET', 'LOT SIZE', 'YEAR BUILT', 'DAYS ON MARKET', '$/SQUARE FEET', 'HOA/MONTH', 'LATITUDE', 'LONGITUDE'];
            if (numericFields.includes(header)) {
              return value === '' || value === null ? 0 : parseFloat(value) || 0;
            }
            return value === '' || value === null ? 'N/A' : value;
          },
          complete: (result) => {
            const cleanedData = result.data.map(row => ({
              saleType: row['SALE TYPE'] || 'N/A',
              soldDate: row['SOLD DATE'] || 'N/A',
              propertyType: row['PROPERTY TYPE'] || 'N/A',
              address: row['ADDRESS'] || 'Unknown Address',
              city: row['CITY'] || 'N/A',
              state: row['STATE OR PROVINCE'] || 'N/A',
              zipCode: row['ZIP OR POSTAL CODE'] || 'N/A',
              price: row['PRICE'] !== undefined ? row['PRICE'] : 0,
              beds: row['BEDS'] !== undefined ? row['BEDS'] : 0,
              baths: row['BATHS'] !== undefined ? row['BATHS'] : 0,
              location: row['LOCATION'] || 'N/A',
              squareFeet: row['SQUARE FEET'] !== undefined ? row['SQUARE FEET'] : 0,
              lotSize: row['LOT SIZE'] || 0,
              yearBuilt: row['YEAR BUILT'] || 0,
              daysOnMarket: row['DAYS ON MARKET'] || 0,
              pricePerSquareFoot: row['$/SQUARE FEET'] || 0,
              hoaMonthly: row['HOA/MONTH'] || 0,
              status: row['STATUS'] || 'N/A',
              openHouseStart: row['NEXT OPEN HOUSE START TIME'] || 'N/A',
              openHouseEnd: row['NEXT OPEN HOUSE END TIME'] || 'N/A',
              url: row['URL (SEE https://www.redfin.com/buy-a-home/comparative-market-analysis FOR INFO ON PRICING)'] || '',
              source: row['SOURCE'] || 'N/A',
              mlsNumber: row['MLS#'] || 'N/A',
              favorite: row['FAVORITE'] || 'N/A',
              interested: row['INTERESTED'] || 'N/A',
              latitude: row['LATITUDE'] || 0,
              longitude: row['LONGITUDE'] || 0,
            }));
            setFilteredData(cleanedData);
            if (address) {
              const selected = cleanedData.find(prop => prop.address === address);
              setSelectedProperty(selected || null);
              setActiveTab(tab || 'details');
            }
            setLoading(false);
          },
          error: (error) => {
            console.error('CSV Parsing Error:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
        setLoading(false);
      });
  }, [address, tab]);

  const tabs = [
    { id: 'map', name: 'Map View', component: <MapView data={filteredData} /> },
    { id: 'listings', name: 'Listings', component: <Listings data={filteredData} setSelectedProperty={setSelectedProperty} /> },
    { id: 'statistics', name: 'Statistics', component: <Statistics data={filteredData} /> },
    { id: 'details', name: 'Property Details', component: <PropertyDetails property={selectedProperty} /> },
    { id: 'analyzer', name: 'Deal Analyzer', component: <DealAnalyzer property={selectedProperty} /> },
  ];

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar data={filteredData} setFilteredData={setFilteredData} />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold">Los Angeles Real Estate Explorer</h1>
          <p>Showing {filteredData.length} properties as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </header>
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <main className="flex-1 p-4 overflow-auto">
          {tabs.find(tab => tab.id === activeTab).component}
        </main>
      </div>
    </div>
  );
}