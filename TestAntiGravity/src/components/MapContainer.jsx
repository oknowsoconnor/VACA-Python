import React, { useState, useEffect, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { Play } from 'lucide-react';

const MapContainer = ({ center, onCenterChanged, videos }) => {
    const map = useMap();
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Debounce center change to avoid too many API calls
    useEffect(() => {
        if (!map) return;

        const listener = map.addListener('idle', () => {
            const c = map.getCenter();
            onCenterChanged({ lat: c.lat(), lng: c.lng() });
        });

        return () => google.maps.event.removeListener(listener);
    }, [map, onCenterChanged]);

    // Heatmap Layer Effect
    useEffect(() => {
        if (!map || !window.google || videos.length === 0) return;

        // Check if visualization library is loaded
        if (!google.maps.visualization) {
            console.warn("Google Maps Visualization library not loaded");
            return;
        }

        const heatmapData = videos.map(v => new google.maps.LatLng(v.lat, v.lng));
        const heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map: map,
            radius: 40,
            opacity: 0.6
        });

        return () => heatmap.setMap(null);
    }, [map, videos]);

    return (
        <>
            <Map
                defaultCenter={center}
                defaultZoom={12}
                mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                options={{
                    disableDefaultUI: true,
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        // ... more dark mode styles could be added here
                    ]
                }}
                style={{ width: '100%', height: '100%' }}
            >
                {videos.map(video => (
                    <AdvancedMarker
                        key={video.id}
                        position={{ lat: video.lat, lng: video.lng }}
                        onClick={() => setSelectedVideo(video)}
                    >
                        <div style={{
                            width: 30, height: 30,
                            backgroundColor: '#ef4444',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                            cursor: 'pointer'
                        }}>
                            <Play size={16} color="white" fill="white" />
                        </div>
                    </AdvancedMarker>
                ))}
            </Map>

            {selectedVideo && (
                <div className="glass-panel video-popup">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{selectedVideo.channel}</span>
                        <button
                            onClick={() => setSelectedVideo(null)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                        >✕</button>
                    </div>
                    <img
                        src={selectedVideo.thumbnail}
                        alt={selectedVideo.title}
                        style={{ width: '100%', borderRadius: 8, marginBottom: 8 }}
                    />
                    <h3 style={{ fontSize: '1rem', margin: '0 0 4px 0' }}>{selectedVideo.title}</h3>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        {new Date(selectedVideo.publishedAt).toLocaleDateString()}
                    </span>
                    <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: 'block',
                            marginTop: 12,
                            padding: '8px 12px',
                            background: '#ef4444',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: 6,
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}
                    >
                        Watch on YouTube
                    </a>
                </div>
            )}
        </>
    );
};

export default MapContainer;
