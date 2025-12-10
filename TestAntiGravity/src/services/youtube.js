import axios from 'axios';

export const fetchVideos = async (lat, lng, radius, apiKey) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                type: 'video',
                location: `${lat},${lng}`,
                locationRadius: radius,
                order: 'date',
                maxResults: 20,
                key: apiKey
            }
        });

        return response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channel: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            // Note: YouTube Search API doesn't return exact coordinates for privacy reasons, 
            // but we can jitter the location slightly around the center or use a separate call if needed.
            // For this demo, we'll randomize slightly around the search center to simulate distribution 
            // if the API doesn't give geo-details (often it just filters by it).
            // UPGRADE: Use video details endpoint if needed.
            lat: parseFloat(lat) + (Math.random() - 0.5) * 0.05,
            lng: parseFloat(lng) + (Math.random() - 0.5) * 0.05,
        }));
    } catch (error) {
        console.error('YouTube API Error:', error);
        throw error;
    }
};
