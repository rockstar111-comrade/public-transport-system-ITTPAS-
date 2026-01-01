const fs = require("fs");
const fetch = require("node-fetch");

const stops = JSON.parse(fs.readFileSync("./data/stops.json", "utf8"));
const routes = JSON.parse(fs.readFileSync("./data/routes.json", "utf8"));
const routeStops = JSON.parse(fs.readFileSync("./data/route_stops_generated.json", "utf8"));

async function generateShape(routeId, stopIds) {
  const coords = stopIds
    .map(id => {
      const stop = stops.find(s => s.stop_id === id);
      if (!stop) return null;
      return `${stop.lon},${stop.lat}`; // OSRM requires lon,lat
    })
    .filter(Boolean)
    .join(";");

  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!json.routes || json.routes.length === 0) {
      console.log(`❌ No OSRM route for ${routeId}`);
      return [];
    }

    console.log(`✔ OSRM route generated for ${routeId}`);
    return json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); // convert back to [lat, lon]
  } catch (err) {
    console.log("OSRM Error:", err);
    return [];
  }
}

(async () => {
  const output = {};

  for (const route of routes) {
    const stopIds = routeStops[route.route_id] || [];

    if (stopIds.length < 2) {
      console.log(`Skipping ${route.route_id}, not enough stops`);
      continue;
    }

    const shape = await generateShape(route.route_id, stopIds);
    output[route.route_id] = shape;
  }

  fs.writeFileSync("./data/routes_with_shapes_generated.json", JSON.stringify(output, null, 2));
  console.log("🎉 All shapes generated and saved!");
})();
