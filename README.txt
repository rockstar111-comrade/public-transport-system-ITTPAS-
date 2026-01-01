TSRTC Addon Integration
=======================

Folder: tsrtc_addon

1) Backend
- cd tsrtc_addon
- npm install
- npm start
API endpoints:
- GET /stops
- GET /routes
- GET /routes/:id
- GET /search?from=STOP_ID&to=STOP_ID

2) Frontend
- Copy RouteMap.jsx and SearchRoutes.jsx into your React src/components or pages
- Ensure 'react-leaflet' and 'leaflet' are installed in your React project
  npm i react-leaflet leaflet
- Import 'leaflet/dist/leaflet.css' in your main entry (e.g., index.js)
- Add a route or page in your app to render the SearchRoutes component

Notes:
- The addon uses the data in tsrtc_addon/data (stops.json, routes_with_shapes.json).
- Shapes are visualization-only. For road-accurate shapes, run map-matching (OSRM).
