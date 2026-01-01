
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const stopsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/stops.json"), "utf8")
);

const routesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/routes.json"), "utf8")
);

const routeStops = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/route_stops_generated.json"), "utf8")
);

const routeShapes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/routes_with_shapes_generated.json"), "utf8")
);

app.get("/routes", (req, res) => {
  res.json(routesData);
});

app.get("/stops", (req, res) => {
  res.json(stopsData);
});

app.get("/route/:routeId", (req, res) => {
  const id = req.params.routeId;

  const route = routesData.find((r) => r.route_id === id);
  if (!route) return res.status(404).json({ error: "Route not found" });

  // Get stops for this route
  const stopIds = routeStops[id] || [];
  const stopsForRoute = stopIds
    .map((stopId) => stopsData.find((s) => s.stop_id === stopId))
    .filter(Boolean);

  // Get OSRM shape for this route
  const shape = routeShapes[id] || [];

  res.json({
    ...route,
    stops: stopsForRoute,
    shape
  });
});
app.get("/search", (req, res) => {
  const from = req.query.from;
  const to = req.query.to;

  if (!from || !to) return res.json([]);

  const result = [];

  for (const r of routesData) {
    const routeId = r.route_id;
    const list = routeStops[routeId] || [];

    const i1 = list.indexOf(from);
    const i2 = list.indexOf(to);

    if (i1 !== -1 && i2 !== -1 && i1 < i2) {
      result.push(r);
    }
  }

  res.json(result);
});
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`TSRTC API running on http://localhost:${PORT}`)
);
