import React from 'react'
import Question from '../components/Question'


import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyDFbLw6QN-OI-1VkXz5GZ3wGstAgCC4hA4';

function ParkingSearch() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchCenter, setSearchCenter] = useState(null);
  const [parkingResults, setParkingResults] = useState([]);
  const [status, setStatus] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.body.appendChild(script);
    } else {
      initMap();
    }
    // eslint-disable-next-line
  }, []);

  function initMap() {
    if (mapRef.current && window.google && !map) {
      const defaultCenter = { lat: 39.9526, lng: -75.1652 };
      const gMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
      });
      setMap(gMap);
    }
  }

  function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!locationInput) {
      setStatus('Please enter a location.');
      return;
    }
    setLoading(true);
    setStatus('Searching for parking spots...');
    clearMarkers();
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: locationInput }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        map.setCenter(loc);
        setSearchCenter(loc);
        const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: loc,
          radius: 2000,
          type: ['parking'],
        }, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setParkingResults(results);
            setStatus('');
            // Add markers
            const newMarkers = results.map(place => {
              const marker = new window.google.maps.Marker({
                map,
                position: place.geometry.location,
                title: place.name,
              });
              return marker;
            });
            setMarkers(newMarkers);
          } else {
            setParkingResults([]);
            setStatus('No parking spots found.');
          }
          setLoading(false);
        });
      } else {
        setStatus('Could not find location.');
        setLoading(false);
      }
    });
  }

  function formatDistance(distanceMeters) {
    if (!window.google || !searchCenter) return 'N/A';
    if (!distanceMeters || isNaN(distanceMeters)) return 'N/A';
    if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m`;
    return `${(distanceMeters / 1000).toFixed(2)} km`;
  }

  // Compute distances and sort top 10
  const rankedResults = (parkingResults || [])
    .filter(place => place.geometry && place.geometry.location)
    .map(place => {
      let distance = Number.MAX_SAFE_INTEGER;
      if (window.google && searchCenter && place.geometry.location) {
        distance = window.google.maps.geometry.spherical.computeDistanceBetween(searchCenter, place.geometry.location);
      }
      return { place, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Parking Search</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={locationInput}
          onChange={e => setLocationInput(e.target.value)}
          placeholder="Enter city or ZIP code"
          style={{ padding: 8, width: 240, marginRight: 8 }}
        />
        <button type="submit" style={{ padding: 8 }}>Find Parking</button>
      </form>
      <div ref={mapRef} style={{ width: '100%', height: 400, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc' }} />
      {loading && <div>Loading...</div>}
      {status && <div style={{ color: 'red', marginBottom: 8 }}>{status}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rankedResults.map(({ place, distance }) => (
          <li key={place.place_id} style={{ marginBottom: 12, background: '#f9f9f9', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px #eee' }}>
            <strong>{place.name}</strong><br />
            {place.vicinity || place.formatted_address || 'Address unavailable'}<br />
            Distance: {formatDistance(distance)}<br />
            Rating: {place.rating || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
}

const Home = () => {
  return (
    <>
      <Question />
      <ParkingSearch />
    </>
  );
}

export default Home