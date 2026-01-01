// //src/passanger/RouteSearch.tsx
// import { useState, useEffect } from 'react';
// import { Search, MapPin, Bus as BusIcon, ArrowRight } from 'lucide-react';
// import { supabase } from '../../lib/supabase';
// import { RouteMapView } from './RouteMapView';

// interface BusStop {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
// }

// interface Route {
//   id: string;
//   route_number: string;
//   route_name: string;
// }

// interface RouteWithStops extends Route {
//   stops: Array<BusStop & { sequence: number; fare_from_start: number }>;
//   buses: Array<{ capacity_status: string; bus_number: string }>;
// }

// export function RouteSearch() {
//   const [busStops, setBusStops] = useState<BusStop[]>([]);
//   const [source, setSource] = useState('');
//   const [destination, setDestination] = useState('');
//   const [searchResults, setSearchResults] = useState<RouteWithStops[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRoute, setSelectedRoute] = useState<RouteWithStops | null>(null);

//   useEffect(() => {
//     fetchBusStops();
//   }, []);

//   const fetchBusStops = async () => {
//     const { data, error } = await supabase
//       .from('bus_stops')
//       .select('*')
//       .order('name');

//     if (error) {
//       console.error('Error fetching bus stops:', error);
//       return;
//     }

//     setBusStops(data || []);
//   };

//   const searchRoutes = async () => {
//     if (!source || !destination) return;

//     setLoading(true);
//     setSearchResults([]);
//     setSelectedRoute(null);

//     try {
//       const { data: routeStops, error } = await supabase
//         .from('route_stops')
//         .select(`
//           route_id,
//           stop_id,
//           sequence,
//           fare_from_start,
//           routes (id, route_number, route_name),
//           bus_stops (id, name, latitude, longitude)
//         `);

//       if (error) throw error;

//       const routeMap = new Map<string, RouteWithStops>();

//       routeStops?.forEach((rs: any) => {
//         const routeId = rs.route_id;
//         if (!routeMap.has(routeId)) {
//           routeMap.set(routeId, {
//             id: rs.routes.id,
//             route_number: rs.routes.route_number,
//             route_name: rs.routes.route_name,
//             stops: [],
//             buses: [],
//           });
//         }

//         const route = routeMap.get(routeId)!;
//         route.stops.push({
//           id: rs.bus_stops.id,
//           name: rs.bus_stops.name,
//           latitude: rs.bus_stops.latitude,
//           longitude: rs.bus_stops.longitude,
//           sequence: rs.sequence,
//           fare_from_start: rs.fare_from_start,
//         });
//       });

//       const matchingRoutes: RouteWithStops[] = [];

//       routeMap.forEach((route) => {
//         route.stops.sort((a, b) => a.sequence - b.sequence);

//         const sourceIndex = route.stops.findIndex((s) => s.id === source);
//         const destIndex = route.stops.findIndex((s) => s.id === destination);

//         if (sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex) {
//           matchingRoutes.push(route);
//         }
//       });

//       for (const route of matchingRoutes) {
//         const { data: buses } = await supabase
//           .from('buses')
//           .select('capacity_status, bus_number')
//           .eq('route_id', route.id);

//         route.buses = buses || [];
//       }

//       setSearchResults(matchingRoutes);
//     } catch (error) {
//       console.error('Error searching routes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//           <Search className="w-6 h-6 mr-2 text-blue-600" />
//           Search Bus Routes
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <MapPin className="w-4 h-4 inline mr-1" />
//               Source Stop
//             </label>
//             <select
//               value={source}
//               onChange={(e) => setSource(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select source</option>
//               {busStops.map((stop) => (
//                 <option key={stop.id} value={stop.id}>
//                   {stop.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <MapPin className="w-4 h-4 inline mr-1" />
//               Destination Stop
//             </label>
//             <select
//               value={destination}
//               onChange={(e) => setDestination(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select destination</option>
//               {busStops.map((stop) => (
//                 <option key={stop.id} value={stop.id}>
//                   {stop.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={searchRoutes}
//           disabled={!source || !destination || loading}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//         >
//           {loading ? (
//             'Searching...'
//           ) : (
//             <>
//               <Search className="w-5 h-5 mr-2" />
//               Search Routes
//             </>
//           )}
//         </button>
//       </div>

//       {searchResults.length > 0 && (
//         <div className="space-y-4">
//           <h3 className="text-xl font-bold text-gray-900">Available Routes</h3>

//           {searchResults.map((route) => {
//             const sourceStop = route.stops.find((s) => s.id === source);
//             const destStop = route.stops.find((s) => s.id === destination);
//             const fare =
//               (destStop?.fare_from_start || 0) - (sourceStop?.fare_from_start || 0);

//             return (
//               <div
//                 key={route.id}
//                 className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h4 className="text-lg font-bold text-gray-900 flex items-center">
//                       <BusIcon className="w-5 h-5 mr-2 text-blue-600" />
//                       {route.route_number} - {route.route_name}
//                     </h4>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {sourceStop?.name} <ArrowRight className="w-4 h-4 inline mx-2" />{' '}
//                       {destStop?.name}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-green-600">₹{fare}</p>
//                     <p className="text-xs text-gray-500">Fare</p>
//                   </div>
//                 </div>

//                 {route.buses.length > 0 && (
//                   <div className="mb-4">
//                     <p className="text-sm font-medium text-gray-700 mb-2">Bus Status:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {route.buses.map((bus, idx) => (
//                         <div
//                           key={idx}
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             bus.capacity_status === 'free'
//                               ? 'bg-green-100 text-green-700'
//                               : bus.capacity_status === 'moderate'
//                               ? 'bg-yellow-100 text-yellow-700'
//                               : 'bg-red-100 text-red-700'
//                           }`}
//                         >
//                           {bus.bus_number}: {bus.capacity_status.toUpperCase()}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   onClick={() => setSelectedRoute(route)}
//                   className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
//                 >
//                   View Route on Map
//                 </button>

//                 {selectedRoute?.id === route.id && (
//                   <div className="mt-4">
//                     <RouteMapView route={route} sourceId={source} destId={destination} />
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {searchResults.length === 0 && !loading && source && destination && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
//           <p className="text-yellow-800 font-medium">
//             No direct routes found between selected stops
//           </p>
//           <p className="text-yellow-600 text-sm mt-2">
//             Try selecting different stops or check for connecting routes
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { Search, Bus } from "lucide-react";

import { getRouteDetails } from "../../api/transportApi";
// import { RouteMapView } from "./RouteMapView";
import RouteMapView from "./RouteMapView";


interface StopEntry {
  stop_id: string;
  name: string;
  lat: number;
  lon: number;
}

export function RouteSearch() {
  const [stops, setStops] = useState<StopEntry[]>([]);

  // Display text
  const [sourceText, setSourceText] = useState("");
  const [destinationText, setDestinationText] = useState("");

  // Internal IDs
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");

  // Dropdown control
  const [showSourceList, setShowSourceList] = useState(false);
  const [showDestinationList, setShowDestinationList] = useState(false);

  // Routes & map
  const [routes, setRoutes] = useState<any[]>([]);
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  /* ---------------- LOAD STOPS ---------------- */
  useEffect(() => {
    fetch("http://localhost:5000/stops")
      .then(r => r.json())
      .then(data =>
        data.filter((s: any) => typeof s.name === "string")
      )
      .then(setStops)
      .catch(console.error);
  }, []);

  /* ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setShowSourceList(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestinationList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- FILTER STOPS ---------------- */
  const filteredSourceStops = stops.filter(
    s =>
      s.name.toLowerCase().includes(sourceText.toLowerCase())
  );

  const filteredDestinationStops = stops.filter(
    s =>
      s.name.toLowerCase().includes(destinationText.toLowerCase())
  );

  /* ---------------- SEARCH ROUTES ---------------- */
  async function handleSearch() {
    if (!sourceId || !destinationId || sourceId === destinationId) return;

    setLoading(true);
    setRoutes([]);
    setExpandedRouteId(null);

    try {
      const baseRoutes = await fetch(
        `http://localhost:5000/search?from=${sourceId}&to=${destinationId}`
      ).then(r => r.json());

      const detailed = [];
      for (const r of baseRoutes) {
        const full = await getRouteDetails(r.route_id);
        detailed.push(full);
      }

      setRoutes(detailed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* SEARCH PANEL */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <Search className="mr-2" />
          Search Routes
        </h2>

        {/* SOURCE */}
        <div className="relative" ref={sourceRef}>
          <input
            placeholder="Source"
            value={sourceText}
            onChange={(e) => {
              setSourceText(e.target.value);
              setSourceId("");
              setShowSourceList(true);
            }}
            onFocus={() => setShowSourceList(true)}
            className="border p-3 rounded-lg w-full"
          />

          {showSourceList && (
            <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
              {filteredSourceStops.map(s => (
                <div
                  key={s.stop_id}
                  onClick={() => {
                    setSourceText(s.name);
                    setSourceId(s.stop_id);
                    setShowSourceList(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-blue-50"
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DESTINATION */}
        <div className="relative mt-3" ref={destRef}>
          <input
            placeholder="Destination"
            value={destinationText}
            onChange={(e) => {
              setDestinationText(e.target.value);
              setDestinationId("");
              setShowDestinationList(true);
            }}
            onFocus={() => setShowDestinationList(true)}
            className="border p-3 rounded-lg w-full"
          />

          {showDestinationList && (
            <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
              {filteredDestinationStops.map(s => (
                <div
                  key={s.stop_id}
                  onClick={() => {
                    setDestinationText(s.name);
                    setDestinationId(s.stop_id);
                    setShowDestinationList(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-blue-50"
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={!sourceId || !destinationId}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* RESULTS */}
      {routes.map(route => (
        <div key={route.route_id} className="bg-white p-5 rounded shadow space-y-3">
          <h3 className="font-bold flex items-center text-lg">
            <Bus className="mr-2" />
            {route.route_name}
          </h3>

          <p className="text-gray-600">
            Distance: {route.distance_km} km • Fare: ₹{route.base_fare}
          </p>

          <button
            onClick={() =>
              setExpandedRouteId(
                expandedRouteId === route.route_id ? null : route.route_id
              )
            }
            className="border px-4 py-2 rounded"
          >
            {expandedRouteId === route.route_id ? "Hide Map" : "View Map"}
          </button>

          {/* MAP */}
          {expandedRouteId === route.route_id && (
            <div className="mt-4" style={{ height: "400px" }}>
              <RouteMapView route={route} />
            </div>
          )}
        </div>
      ))}

      {!loading && routes.length === 0 && (
        <p className="text-center text-gray-500">No routes found</p>
      )}
    </div>
  );
}



// import { useEffect, useState, useRef } from "react";
// import { Search, Bus } from "lucide-react";
// import RouteMapView from "./RouteMapView";
// import { getRouteDetails } from "../../api/transportApi";

// interface StopEntry {
//   stop_id: string;
//   name: string;
//   lat: number;
//   lon: number;
// }

// export function RouteSearch() {
//   const [stops, setStops] = useState<StopEntry[]>([]);
//   const [sourceText, setSourceText] = useState("");
//   const [destinationText, setDestinationText] = useState("");
//   const [sourceId, setSourceId] = useState("");
//   const [destinationId, setDestinationId] = useState("");
//   const [showSourceList, setShowSourceList] = useState(false);
//   const [showDestinationList, setShowDestinationList] = useState(false);
//   const [routes, setRoutes] = useState<any[]>([]);
//   const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const sourceRef = useRef<HTMLDivElement>(null);
//   const destRef = useRef<HTMLDivElement>(null);

//   /* LOAD STOPS */
//   useEffect(() => {
//     fetch("http://localhost:5000/stops")
//       .then(r => r.json())
//       .then(data => data.filter((s: any) => typeof s.name === "string"))
//       .then(setStops)
//       .catch(console.error);
//   }, []);

//   /* CLOSE DROPDOWNS */
//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (sourceRef.current && !sourceRef.current.contains(e.target as Node))
//         setShowSourceList(false);
//       if (destRef.current && !destRef.current.contains(e.target as Node))
//         setShowDestinationList(false);
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const filteredSourceStops = stops.filter(s =>
//     s.name.toLowerCase().includes(sourceText.toLowerCase())
//   );

//   const filteredDestinationStops = stops.filter(s =>
//     s.name.toLowerCase().includes(destinationText.toLowerCase())
//   );

//   async function handleSearch() {
//     if (!sourceId || !destinationId || sourceId === destinationId) return;

//     setLoading(true);
//     setRoutes([]);
//     setExpandedRouteId(null);

//     const base = await fetch(
//       `http://localhost:5000/search?from=${sourceId}&to=${destinationId}`
//     ).then(r => r.json());

//     const full: any[] = [];
//     for (const r of base) {
//       full.push(await getRouteDetails(r.route_id));
//     }

//     setRoutes(full);
//     setLoading(false);
//   }

//   return (
//     <div className="space-y-6">
//       {/* SEARCH */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-bold flex items-center mb-4">
//           <Search className="mr-2" /> Search Routes
//         </h2>

//         <div className="relative" ref={sourceRef}>
//           <input
//             placeholder="Source"
//             value={sourceText}
//             onChange={e => {
//               setSourceText(e.target.value);
//               setSourceId("");
//               setShowSourceList(true);
//             }}
//             className="border p-3 rounded-lg w-full"
//           />
//           {showSourceList && (
//             <div className="absolute z-10 w-full bg-white border max-h-60 overflow-y-auto">
//               {filteredSourceStops.map(s => (
//                 <div
//                   key={s.stop_id}
//                   onClick={() => {
//                     setSourceText(s.name);
//                     setSourceId(s.stop_id);
//                     setShowSourceList(false);
//                   }}
//                   className="p-3 hover:bg-blue-50 cursor-pointer"
//                 >
//                   {s.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="relative mt-3" ref={destRef}>
//           <input
//             placeholder="Destination"
//             value={destinationText}
//             onChange={e => {
//               setDestinationText(e.target.value);
//               setDestinationId("");
//               setShowDestinationList(true);
//             }}
//             className="border p-3 rounded-lg w-full"
//           />
//           {showDestinationList && (
//             <div className="absolute z-10 w-full bg-white border max-h-60 overflow-y-auto">
//               {filteredDestinationStops.map(s => (
//                 <div
//                   key={s.stop_id}
//                   onClick={() => {
//                     setDestinationText(s.name);
//                     setDestinationId(s.stop_id);
//                     setShowDestinationList(false);
//                   }}
//                   className="p-3 hover:bg-blue-50 cursor-pointer"
//                 >
//                   {s.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleSearch}
//           disabled={!sourceId || !destinationId}
//           className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
//         >
//           Search
//         </button>
//       </div>

//       {/* RESULTS */}
//       {routes.map(route => (
//         <div key={route.route_id} className="bg-white p-5 rounded shadow">
//           <h3 className="font-bold flex items-center text-lg">
//             <Bus className="mr-2" />
//             {route.route_name}
//           </h3>

//           <button
//             type="button"
//             onClick={() =>
//               setExpandedRouteId(
//                 expandedRouteId === route.route_id ? null : route.route_id
//               )
//             }
//             className="border px-4 py-2 rounded mt-2"
//           >
//             {expandedRouteId === route.route_id ? "Hide Map" : "View Map"}
//           </button>

//           {expandedRouteId === route.route_id && (
//             <div style={{ height: "420px" }} className="mt-4 border rounded">
//               <RouteMapView route={route} />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
