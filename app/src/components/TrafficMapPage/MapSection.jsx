import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Custom marker icon to replace the default
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom component to handle map interactions
const MapController = ({ coordinates, onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    // Center the map on the current coordinates
    map.setView(coordinates, 13);
  }, [coordinates, map]);

  return null;
};

const MapSection = ({ location }) => {
  // Default location (Richmond, VA)
  const defaultLocation = { lat: 37.54129, lng: -77.434769 };

  // State management
  const [coordinates, setCoordinates] = useState(location || defaultLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  // Perform geocoding search
  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // Use Nominatim OpenStreetMap Geocoding API
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 5,
        },
      });

      if (response.data && response.data.length > 0) {
        const results = response.data.map(result => ({
          display_name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }));

        setSearchResults(results);
        setError(null);
      } else {
        setError('No locations found');
        setSearchResults([]);
      }
    } catch (err) {
      setError('Error searching for location');
      setSearchResults([]);
      console.error('Search error:', err);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = e => {
    e.preventDefault();
    performSearch();
  };

  // Handle selecting a specific search result
  const handleSelectLocation = result => {
    setCoordinates({
      lat: result.lat,
      lng: result.lon,
    });
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  return (
    <section className="map-section relative w-full">
      {/* Search Container */}
      <div className="search-container relative z-[1000] w-full max-w-md mx-auto mb-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search location..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded"
          >
            Search
          </button>
        </form>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSelectLocation(result)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              >
                {result.display_name}
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      </div>

      {/* Map Container */}
      <MapContainer center={coordinates} zoom={13} className="w-full h-[500px] rounded-lg" style={{ zIndex: 0 }}>
        <MapController coordinates={coordinates} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates} icon={customMarkerIcon}>
          <Popup>
            <span>
              Location: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </section>
  );
};

export default MapSection;
