import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to fly to location when changed
const FlyToLocation = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 16, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
};

const MapComponent = ({ houses, onSelectHouse, selectedHouse, onSelectStreet, selectedStreet, streetGeometry, onHoverHouse }) => {
    const jerseyCity = [40.7194, -74.0431];
    const streetLines = useMemo(() => streetGeometry || [], [streetGeometry]);

    return (
        <div className="map-container glass-panel" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <MapContainer center={jerseyCity} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {streetLines.map((street) => (
                    <Polyline
                        key={street.name}
                        positions={street.segments}
                        pathOptions={{
                            color: selectedStreet === street.name ? '#38bdf8' : '#64748b',
                            weight: selectedStreet === street.name ? 5 : 3,
                            opacity: selectedStreet === street.name ? 0.9 : 0.45
                        }}
                        eventHandlers={{
                            click: () => onSelectStreet?.(street.name)
                        }}
                    >
                        <Tooltip sticky>{street.name}</Tooltip>
                    </Polyline>
                ))}

                {houses.map(house => (
                    <Marker
                        key={house.id}
                        position={house.position}
                        eventHandlers={{
                            click: () => onSelectHouse(house),
                            mouseover: (e) => {
                                e.target.openPopup();
                                onHoverHouse && onHoverHouse(house.id);
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                                onHoverHouse && onHoverHouse(null);
                            }
                        }}
                    >
                        <Popup className="glass-popup">
                            <div style={{ minWidth: '150px' }}>
                                <strong>{house.address}</strong>
                                <br />
                                {house.residents.length} Student(s)
                                <br />
                                {house.dietPreference} · {house.lookingForRoommates ? `Looking for ${house.roommatePreference}` : 'Not looking'}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {selectedHouse && <FlyToLocation center={selectedHouse.position} />}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
