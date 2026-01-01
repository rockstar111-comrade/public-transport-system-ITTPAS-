  import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RouteMap({ route }) {
  if (!route) return <div style={{padding:20}}>Select a route to view on map</div>;
  if (!route.shape || route.shape.length === 0) return <div style={{padding:20}}>No shape available</div>;
  const poly = route.shape.map(([lon, lat]) => [lat, lon]);
  const center = poly[0] || [17.4,78.48];
  return (
    <MapContainer center={center} zoom={12} style={{height:'500px', width:'100%'}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={poly} color="blue" weight={4} />
      {route.stop_mapping && route.stop_mapping.map((s, idx) => {
        if (!s.stop_id) return null;
        const pos = route.shape[idx];
        if(!pos) return null;
        return (
          <Marker key={idx} position={[pos[1], pos[0]]}>
            <Popup>{s.orig_name} <br/> ID: {s.stop_id}</Popup>
          </Marker>
        )
      })}
    </MapContainer>
  );
}
