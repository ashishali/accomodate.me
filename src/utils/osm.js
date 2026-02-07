

export const fetchStreetGeometry = async (streetNames) => {
    // We will query OpenStreetMap via Overpass API
    // Jersey City Bounding Box (approximate)
    const bbox = '40.710,-74.060,40.730,-74.030';

    // Construct the query
    // We want ways with names matching our street list within the bounding box
    // escape names just in case
    const streetsQuery = streetNames.map(name => `way["name"="${name}"](${bbox});`).join('\n');

    const query = `
        [out:json][timeout:25];
        (
            ${streetsQuery}
        );
        out body;
        >;
        out skel qt;
    `;

    const url = 'https://overpass-api.de/api/interpreter';

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: query
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Overpass API');
        }

        const data = await response.json();
        return processOSMData(data, streetNames);

    } catch (error) {
        console.error("Error fetching street geometry:", error);
        throw error;
    }
};

const processOSMData = (data, streetNames) => {
    const nodes = {};
    const ways = [];

    // First pass: Index all nodes
    data.elements.forEach(el => {
        if (el.type === 'node') {
            nodes[el.id] = [el.lat, el.lon];
        }
    });

    // Second pass: Process ways
    data.elements.forEach(el => {
        if (el.type === 'way' && el.tags && el.tags.name && streetNames.includes(el.tags.name)) {
            const coordinates = el.nodes.map(nodeId => nodes[nodeId]).filter(Boolean);
            if (coordinates.length > 0) {
                ways.push({
                    name: el.tags.name,
                    id: el.id,
                    segments: coordinates
                });
            }
        }
    });

    // Group segments by street name
    const result = streetNames.map(name => {
        const streetWays = ways.filter(w => w.name === name);
        // We might have multiple disjoint segments for one street name
        // For simplicity in the map component, we can return an array of polylines
        // But the map expects objects with { name, segments }
        // Let's verify what MapComponent expects.
        // It expects: streetLines.map(street => <Polyline positions={street.segments} ... />)
        // If a street has multiple segments (disjoint), passing a single array of [lat,lng]s might draw connecting lines where they shouldn't exist.
        // Ideally, we should return an array of arrays of coordinates for a MultiPolyline, OR just return one object per way fragment.

        // Let's flatten it for now: return one object per street name, 
        // but wait, if we merge disjoint segments, we get jump lines. 
        // Leaflet Polyline can take an array of arrays (MultiPolyline). 
        // let's construct that.

        const multiPolyline = streetWays.map(w => w.segments);
        return {
            name: name,
            segments: multiPolyline // This will be passed to Polyline positions, which supports MultiPolyline
        };
    });

    return result;
};
