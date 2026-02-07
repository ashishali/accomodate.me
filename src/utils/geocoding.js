
export const geocodeAddress = async (address) => {
    // We will query OpenStreetMap Nominatim API
    // Doc: https://nominatim.org/release-docs/develop/api/Search/

    // Append ", New Jersey" to context if not present, to bias results to NJ
    const queryAddress = address.toLowerCase().includes('nj') || address.toLowerCase().includes('new jersey')
        ? address
        : `${address}, New Jersey`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryAddress)}&limit=1`;

    try {
        const response = await fetch(url, {
            headers: {
                // Nominatim requires a User-Agent
                'User-Agent': 'AccomodateMe/1.0'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Nominatim API');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                displayName: result.display_name
            };
        } else {
            return null;
        }

    } catch (error) {
        console.error("Error geocoding address:", error);
        throw error;
    }
};
