import { useState, useEffect, useCallback } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps';
import MapContainer from './components/MapContainer';
import { fetchVideos } from './services/youtube';
import './index.css';

// PLACEHOLDERS - User should replace these in .env.local
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

function App() {
    const [videos, setVideos] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 }); // Los Angeles
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCenterChanged = useCallback(async (center) => {
        setMapCenter(center);
        if (!YOUTUBE_API_KEY) return;

        setLoading(true);
        try {
            const results = await fetchVideos(center.lat, center.lng, '10km', YOUTUBE_API_KEY);
            setVideos(results);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch videos", err);
            // Don't show error to user constantly on drag, maybe just log
        } finally {
            setLoading(false);
        }
    }, []);

    if (!GOOGLE_MAPS_KEY) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <h1>Configuration Required</h1>
                <p>Please provide VITE_GOOGLE_MAPS_KEY and VITE_YOUTUBE_API_KEY in a .env file.</p>
            </div>
        )
    }

    return (
        <APIProvider apiKey={GOOGLE_MAPS_KEY} libraries={['visualization']}>
            <div className="glass-panel controls-overlay">
                <h1 className="title">GeoTube</h1>
                {loading && <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Searching area...</span>}
                {!YOUTUBE_API_KEY && <span style={{ color: 'red', fontSize: '0.8rem' }}>No YouTube API Key</span>}
            </div>

            <div className="map-container">
                <MapContainer
                    center={mapCenter}
                    onCenterChanged={handleCenterChanged}
                    videos={videos}
                />
            </div>
        </APIProvider>
    )
}

export default App
