import React, { useState, useEffect } from 'react';
import './MapSearch.css';

const MapSearch = ({ onLocationSelect, destinations }) => {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        // Initialize Google Maps
        if (window.google) {
            initMap();
        } else {
            loadGoogleMaps();
        }
    }, []);

    const loadGoogleMaps = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
        script.onload = initMap;
        document.head.appendChild(script);
    };

    const initMap = () => {
        const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 20.5937, lng: 78.9629 }, // Center on India
            zoom: 4,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'on' }]
                }
            ]
        });

        setMap(mapInstance);
        addDestinationMarkers(mapInstance);
    };

    const addDestinationMarkers = (mapInstance) => {
        const newMarkers = destinations.map(dest => {
            // For demo, using approximate coordinates
            const coordinates = getApproximateCoordinates(dest.name);
            
            const marker = new window.google.maps.Marker({
                position: coordinates,
                map: mapInstance,
                title: dest.name,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
            });

            marker.addListener('click', () => {
                onLocationSelect(dest.name);
            });

            return marker;
        });

        setMarkers(newMarkers);
    };

    const getApproximateCoordinates = (destination) => {
        // Simplified coordinates for demo - in real app, use geocoding
        const coordinates = {
            'Kerala': { lat: 10.8505, lng: 76.2711 },
            'Paris': { lat: 48.8566, lng: 2.3522 },
            'Bali': { lat: -8.4095, lng: 115.1889 },
            'Ladakh': { lat: 34.1526, lng: 77.5771 },
            'Kyoto': { lat: 35.0116, lng: 135.7681 },
            'Cape Town': { lat: -33.9249, lng: 18.4241 },
            'New York': { lat: 40.7128, lng: -74.0060 },
            'Dubai': { lat: 25.2048, lng: 55.2708 },
            'Venice': { lat: 45.4408, lng: 12.3155 }
        };
        
        return coordinates[destination] || { lat: 20.5937, lng: 78.9629 };
    };

    return (
        <div className="map-search">
            <h3>Explore Destinations on Map</h3>
            <div id="map" className="map-container"></div>
            <div className="map-instructions">
                <p>Click on markers to explore destinations</p>
            </div>
        </div>
    );
};

export default MapSearch;