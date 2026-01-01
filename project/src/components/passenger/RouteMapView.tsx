import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* 🔴 FIX LEAFLET MARKER ICON (VERY IMPORTANT) */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* 🔧 Fix map resize when toggled */
function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
}

export default function RouteMapView({ route }: any) {
  if (!route) return null;

  const shape = route.shape || [];
  const poly = shape.map((p: any) => [p[0], p[1]]);

  const center =
    poly.length > 0 ? poly[Math.floor(poly.length / 2)] : [17.4, 78.48];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <FixMapSize />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {poly.length > 1 && (
        <Polyline positions={poly} pathOptions={{ color: "blue", weight: 5 }} />
      )}

      {route.stops?.map((s: any) => (
        <Marker key={s.stop_id} position={[s.lat, s.lon]}>
          <Popup>{s.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
