// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// interface RouteMapProps {
//   route: any;
// }

// export default function RouteMap({ route }: RouteMapProps) {
//   if (!route) return null;

//   const shape = route.shape || [];
//   const polyline = shape.map((p: any) => [p[0], p[1]]);

//   const center =
//     polyline.length > 0
//       ? polyline[Math.floor(polyline.length / 2)]
//       : [17.385, 78.486];

//   return (
//     <MapContainer
//       center={center}
//       zoom={12}
//       style={{ width: "100%", height: "100%" }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//       {/* Route polyline */}
//       {polyline.length > 1 && (
//         <Polyline positions={polyline} pathOptions={{ color: "blue", weight: 5 }} />
//       )}

//       {/* Stop markers */}
//       {route.stops?.map((s: any) => (
//         <Marker key={s.stop_id} position={[s.lat, s.lon]}>
//           <Popup>{s.name}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }
