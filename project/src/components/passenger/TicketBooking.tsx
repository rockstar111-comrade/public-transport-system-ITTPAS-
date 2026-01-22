// // src/passenger/TicketBooking.tsx
// import { useEffect, useRef, useState } from "react";
// import { Ticket, CreditCard, Check } from "lucide-react";
// import QRCode from "qrcode";

// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";
// import { getRoutes, getRouteDetails } from "../../api/transportApi";

// interface Route {
//   route_id: string;
//   route_number: string;
//   route_name: string;
// }

// interface StopEntry {
//   stop_id: string;
//   name: string;
//   lat: number;
//   lon: number;
// }

// export default function TicketBooking() {
//   const { user, profile } = useAuth();

//   /* ---------------- ROUTES ---------------- */
//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [routeText, setRouteText] = useState("");
//   const [routeId, setRouteId] = useState("");

//   /* ---------------- STOPS ---------------- */
//   const [routeStops, setRouteStops] = useState<StopEntry[]>([]);
//   const [fromText, setFromText] = useState("");
//   const [toText, setToText] = useState("");
//   const [sourceId, setSourceId] = useState("");
//   const [destinationId, setDestinationId] = useState("");

//   /* ---------------- TICKET COUNT ---------------- */
//   const [ticketCount, setTicketCount] = useState(1);

//   /* ---------------- UI ---------------- */
//   const [fare, setFare] = useState<number | null>(null);
//   const [ticketBooked, setTicketBooked] = useState(false);
//   const [qrImage, setQrImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [showFromList, setShowFromList] = useState(false);
//   const [showToList, setShowToList] = useState(false);

//   const fromRef = useRef<HTMLDivElement>(null);
//   const toRef = useRef<HTMLDivElement>(null);

//   /* ---------------- LOAD ROUTES ---------------- */
//   useEffect(() => {
//     getRoutes().then(setRoutes).catch(console.error);
//   }, []);

//   /* ---------------- LOAD STOPS ---------------- */
//   useEffect(() => {
//     if (!routeId) {
//       setRouteStops([]);
//       setFromText("");
//       setToText("");
//       setSourceId("");
//       setDestinationId("");
//       return;
//     }

//     getRouteDetails(routeId)
//       .then((route: any) => setRouteStops(route.stops || []))
//       .catch(console.error);
//   }, [routeId]);

//   /* ---------------- CLOSE DROPDOWNS ---------------- */
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (fromRef.current && !fromRef.current.contains(e.target as Node))
//         setShowFromList(false);
//       if (toRef.current && !toRef.current.contains(e.target as Node))
//         setShowToList(false);
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ---------------- FILTER STOPS ---------------- */
//   const filteredFromStops = routeStops.filter(
//     s =>
//       typeof s.name === "string" &&
//       s.name.toLowerCase().includes(fromText.toLowerCase())
//   );

//   const filteredToStops = routeStops.filter(
//     s =>
//       typeof s.name === "string" &&
//       s.name.toLowerCase().includes(toText.toLowerCase())
//   );

//   /* ---------------- CALCULATE FARE ---------------- */
//   useEffect(() => {
//     calculateFare();
//   }, [routeId, sourceId, destinationId]);

//   async function calculateFare() {
//     if (!routeId || !sourceId || !destinationId) {
//       setFare(null);
//       return;
//     }

//     const route = await getRouteDetails(routeId);

//     const sIndex = route.stops.findIndex(
//       (s: any) => String(s.stop_id) === sourceId
//     );
//     const dIndex = route.stops.findIndex(
//       (s: any) => String(s.stop_id) === destinationId
//     );

//     if (sIndex === -1 || dIndex === -1 || sIndex >= dIndex) {
//       setFare(null);
//       return;
//     }

//     const baseFare = (dIndex - sIndex) * 10;
//     setFare(profile?.is_verified_woman ? 0 : baseFare);
//   }

//   /* ---------------- MOCK PAYMENT ---------------- */
//   function handlePayment() {
//     if (!user || fare === null || loading) return;

//     const totalAmount = fare * ticketCount;

//     const confirmPay = window.confirm(
//       `Confirm payment of ₹${totalAmount} for ${ticketCount} ticket(s)?`
//     );

//     if (!confirmPay) return;

//     setLoading(true);

//     setTimeout(async () => {
//       await createTicketAfterPayment();
//       setLoading(false);
//     }, 1500);
//   }

//   /* ---------------- CREATE SINGLE QR TICKET ---------------- */
//   async function createTicketAfterPayment() {
//     if (!user || fare === null) return;

//     const qrPayload = {
//       ticketId: crypto.randomUUID(),
//       tickets: ticketCount
//     };

//     const totalAmount = fare * ticketCount;

//     const { error } = await supabase.from("tickets").insert({
//       passenger_id: user.id,
//       source: fromText,
//       destination: toText,
//       fare: fare,
//       ticket_count: ticketCount,
//       total_amount: totalAmount,
//       qr_data: JSON.stringify(qrPayload),
//     });

//     if (error) {
//       console.error(error);
//       alert("Ticket creation failed");
//       return;
//     }

//     const qr = await QRCode.toDataURL(JSON.stringify(qrPayload));
//     setQrImage(qr);
//     setTicketBooked(true);

//     // Reset form
//     setRouteId("");
//     setRouteText("");
//     setFromText("");
//     setToText("");
//     setSourceId("");
//     setDestinationId("");
//     setFare(null);

//     setTicketCount(1);
//   }

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-4">
//       <h2 className="text-2xl font-bold flex items-center">
//         <Ticket className="mr-2 text-blue-600" />
//         Book Ticket
//       </h2>

//       {/* ROUTE */}
//       <input
//         list="routes"
//         placeholder="Select Route"
//         value={routeText}
//         onChange={(e) => {
//           const text = e.target.value;
//           setRouteText(text);
//           const match = routes.find(
//             r => `${r.route_number} - ${r.route_name}` === text
//           );
//           setRouteId(match ? match.route_id : "");
//         }}
//         className="border p-3 rounded-lg w-full"
//       />

//       <datalist id="routes">
//         {routes.map(r => (
//           <option
//             key={r.route_id}
//             value={`${r.route_number} - ${r.route_name}`}
//           />
//         ))}
//       </datalist>

//       {/* FROM */}
//       <div className="relative" ref={fromRef}>
//         <input
//           placeholder="From"
//           value={fromText}
//           onChange={(e) => {
//             setFromText(e.target.value);
//             setShowFromList(true);
//             setSourceId("");
//           }}
//           onFocus={() => setShowFromList(true)}
//           disabled={!routeId}
//           className="border p-3 rounded-lg w-full"
//         />

//         {showFromList && (
//           <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
//             {filteredFromStops.map(s => (
//               <div
//                 key={s.stop_id}
//                 onClick={() => {
//                   setFromText(s.name);
//                   setSourceId(s.stop_id);
//                   setShowFromList(false);
//                 }}
//                 className="p-3 cursor-pointer hover:bg-blue-50"
//               >
//                 {s.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* TO */}
//       <div className="relative" ref={toRef}>
//         <input
//           placeholder="To"
//           value={toText}
//           onChange={(e) => {
//             setToText(e.target.value);
//             setShowToList(true);
//             setDestinationId("");
//           }}
//           onFocus={() => setShowToList(true)}
//           disabled={!sourceId}
//           className="border p-3 rounded-lg w-full"
//         />

//         {showToList && (
//           <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
//             {filteredToStops.map(s => (
//               <div
//                 key={s.stop_id}
//                 onClick={() => {
//                   setToText(s.name);
//                   setDestinationId(s.stop_id);
//                   setShowToList(false);
//                 }}
//                 className="p-3 cursor-pointer hover:bg-blue-50"
//               >
//                 {s.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* TICKET COUNT */}
//       {/* <input
//         type="number"
//         min={1}
//         max={10}
//         value={ticketCount}
//         onChange={(e) =>
//           setTicketCount(Math.min(10, Math.max(1, Number(e.target.value))))
//         }
//         className="border p-3 rounded-lg w-full"
//         placeholder="Number of Tickets (max 10)"
//       /> */}
//       <div className="flex items-center justify-between border rounded-lg p-3">
//   <span className="font-medium">Number of Tickets</span>

//   <div className="flex items-center space-x-4">
//     {/* Minus */}
//     <button
//       onClick={() =>
//         setTicketCount(prev => Math.max(1, prev - 1))
//       }
//       disabled={ticketCount === 1}
//       className="w-10 h-10 rounded-full bg-gray-200 text-xl font-bold disabled:opacity-50"
//     >
//       −
//     </button>

//     {/* Count */}
//     <span className="text-lg font-bold w-6 text-center">
//       {ticketCount}
//     </span>

//     {/* Plus */}
//     <button
//       onClick={() =>
//         setTicketCount(prev => Math.min(10, prev + 1))
//       }
//       disabled={ticketCount === 10}
//       className="w-10 h-10 rounded-full bg-blue-600 text-white text-xl font-bold disabled:opacity-50"
//     >
//       +
//     </button>
//   </div>
// </div>


//       {/* FARE */}
//       {fare !== null && (
//         <div className="text-lg font-bold text-black-600">
//           Fare per ticket: ₹{fare} <br />
//           Total amount: ₹{fare * ticketCount}
//         </div>
//       )}

//       {/* PAY */}
//       <button
//         onClick={handlePayment}
//         disabled={fare === null || loading}
//         className="bg-blue-600 text-white py-3 rounded-lg w-full disabled:opacity-50"
//       >
//         <CreditCard className="inline mr-2" />
//         {loading ? "Processing Payment..." : "Pay & Book Ticket"}
//       </button>

//       {/* QR */}
//       {ticketBooked && qrImage && (
//         <div className="text-center mt-6">
//           <Check className="mx-auto text-green-600 w-8 h-8" />
//           <img src={qrImage} className="mx-auto mt-4 w-48" />
//           <p className="text-sm text-gray-500 mt-2">
//             Tickets: {ticketCount} | One-time valid
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


// // src/passenger/TicketBooking.tsx
// import { useEffect, useRef, useState } from "react";
// import { Ticket, CreditCard, Check } from "lucide-react";
// import QRCode from "qrcode";

// import {
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";
// import { getRoutes, getRouteDetails } from "../../api/transportApi";

// /* ---------------- TYPES ---------------- */
// interface Route {
//   route_id: string;
//   route_number: string;
//   route_name: string;
// }

// interface StopEntry {
//   stop_id: string;
//   name: string;
//   lat: number;
//   lon: number;
// }

// /* ====================================================== */

// export default function TicketBooking() {
//   const { user } = useAuth();
//   const stripe = useStripe();
//   const elements = useElements();

//   /* ---------------- ROUTES ---------------- */
//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [routeText, setRouteText] = useState("");
//   const [routeId, setRouteId] = useState("");

//   /* ---------------- STOPS ---------------- */
//   const [routeStops, setRouteStops] = useState<StopEntry[]>([]);
//   const [fromText, setFromText] = useState("");
//   const [toText, setToText] = useState("");
//   const [sourceId, setSourceId] = useState("");
//   const [destinationId, setDestinationId] = useState("");

//   /* ---------------- TICKET COUNT ---------------- */
//   const [ticketCount, setTicketCount] = useState(1);

//   /* ---------------- UI ---------------- */
//   const [fare, setFare] = useState<number | null>(null);
//   const [ticketBooked, setTicketBooked] = useState(false);
//   const [qrImage, setQrImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [showFromList, setShowFromList] = useState(false);
//   const [showToList, setShowToList] = useState(false);

//   const fromRef = useRef<HTMLDivElement>(null);
//   const toRef = useRef<HTMLDivElement>(null);

//   /* ---------------- LOAD ROUTES ---------------- */
//   useEffect(() => {
//     getRoutes().then(setRoutes).catch(console.error);
//   }, []);

//   /* ---------------- LOAD STOPS ---------------- */
//   useEffect(() => {
//     if (!routeId) {
//       setRouteStops([]);
//       setFromText("");
//       setToText("");
//       setSourceId("");
//       setDestinationId("");
//       return;
//     }

//     getRouteDetails(routeId)
//       .then((route: any) => setRouteStops(route.stops || []))
//       .catch(console.error);
//   }, [routeId]);

//   /* ---------------- CLOSE DROPDOWNS ---------------- */
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (fromRef.current && !fromRef.current.contains(e.target as Node))
//         setShowFromList(false);
//       if (toRef.current && !toRef.current.contains(e.target as Node))
//         setShowToList(false);
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ---------------- FILTER STOPS ---------------- */
//   const filteredFromStops = routeStops.filter(s =>
//     s.name.toLowerCase().includes(fromText.toLowerCase())
//   );

//   const filteredToStops = routeStops.filter(s =>
//     s.name.toLowerCase().includes(toText.toLowerCase())
//   );

//   /* ---------------- CALCULATE FARE ---------------- */
//   useEffect(() => {
//     calculateFare();
//   }, [routeId, sourceId, destinationId]);

//   async function calculateFare() {
//     if (!routeId || !sourceId || !destinationId) {
//       setFare(null);
//       return;
//     }

//     const route = await getRouteDetails(routeId);

//     const sIndex = route.stops.findIndex(
//       (s: any) => String(s.stop_id) === sourceId
//     );
//     const dIndex = route.stops.findIndex(
//       (s: any) => String(s.stop_id) === destinationId
//     );

//     if (sIndex === -1 || dIndex === -1 || sIndex >= dIndex) {
//       setFare(null);
//       return;
//     }

//     setFare((dIndex - sIndex) * 10);
//   }

//   /* ======================================================
//      STRIPE PAYMENT FLOW
//   ====================================================== */

//   async function handlePayment() {
//     if (!stripe || !elements || !user || fare === null) return;

//     setLoading(true);
//     const totalAmount = fare * ticketCount;

//     /* 1️⃣ Create payment log */
//     const { data: payment } = await supabase
//       .from("payments")
//       .insert({
//         user_id: user.id,
//         amount: totalAmount,
//         gateway: "STRIPE_TEST",
//         payment_mode: "CARD",
//         status: "PENDING",
//       })
//       .select()
//       .single();

//     /* 2️⃣ Call Edge Function */
//     const session = (await supabase.auth.getSession()).data.session;

// if (!session) {
//   alert("Session expired. Please login again.");
//   setLoading(false);
//   return;
// }

// const res = await fetch(
//   "https://nmifzpsamcktsckabfkm.supabase.co/functions/v1/create-payment-intent",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
//       Authorization: `Bearer ${session.access_token}`, // ✅ THIS IS MISSING
//     },
//     body: JSON.stringify({
//       amount: totalAmount,
//     }),
//   }
// );


// const data = await res.json();

// if (!res.ok) {
//   console.error("Edge Function error:", data);
//   alert("Payment initialization failed");
//   setLoading(false);
//   return;
// }

// const { clientSecret } = data;



//     /* 3️⃣ Confirm payment */
//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement)!,
//       },
//     });

//     if (result.paymentIntent?.status === "succeeded") {
//       await supabase
//         .from("payments")
//         .update({ status: "SUCCESS" })
//         .eq("id", payment.id);

//       await createTicket(payment.id);
//     } else {
//       await supabase
//         .from("payments")
//         .update({ status: "FAILED" })
//         .eq("id", payment.id);

//       alert("Payment failed");
//     }

//     setLoading(false);
//   }

//   /* ======================================================
//      TICKET CREATION
//   ====================================================== */

//   async function createTicket(paymentId: string) {
//     if (!user) return;

//     const issuedAt = new Date();
//     const expiresAt = new Date(issuedAt.getTime() + 60 * 60 * 1000);

//     const qrPayload = {
//       ticketId: crypto.randomUUID(),
//       userId: user.id,
//       expiresAt: expiresAt.toISOString(),
//     };

//     await supabase.from("tickets").insert({
//       passenger_id: user.id,
//       source: fromText,
//       destination: toText,
//       fare,
//       ticket_count: ticketCount,
//       total_amount: fare! * ticketCount,
//       payment_id: paymentId,
//       qr_data: JSON.stringify(qrPayload),
//       issued_at: issuedAt,
//       expires_at: expiresAt,
//       status: "UNUSED",
//     });

//     const qr = await QRCode.toDataURL(JSON.stringify(qrPayload));
//     setQrImage(qr);
//     setTicketBooked(true);
//   }

//   /* ====================================================== */

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-4">
//       <h2 className="text-2xl font-bold flex items-center">
//         <Ticket className="mr-2 text-blue-600" />
//         Book Ticket
//       </h2>

//       {/* ROUTE */}
//       {/* <input
//         list="routes"
//         placeholder="Select Route"
//         value={routeText}
//         onChange={(e) => {
//   const text = e.target.value;
//   setRouteText(text);

//   const match = routes.find(
//     r =>
//       text.includes(r.route_name) ||
//       (r.route_number && text.includes(r.route_number))
//   );

//   setRouteId(match ? match.route_id : "");
// }}

//         className="border p-3 rounded-lg w-full"
//       />

//       <datalist id="routes">
//         {routes.map(r => (
//           <option
//             key={r.route_id}
//             value={`${r.route_number} - ${r.route_name}`}
//           />
//         ))}
//       </datalist> */}
//       <select
//   value={routeId}
//   onChange={(e) => {
//     const selectedId = e.target.value;
//     setRouteId(selectedId);

//     const route = routes.find(r => r.route_id === selectedId);
//     setRouteText(
//       route
//         ? `${route.route_number ?? "Route"} - ${route.route_name}`
//         : ""
//     );
//   }}
//   className="border p-3 rounded-lg w-full"
// >
//   <option value="">Select Route</option>

//   {routes.map(r => (
//     <option key={r.route_id} value={r.route_id}>
//       {r.route_number ?? "Route"} - {r.route_name}
//     </option>
//   ))}
// </select>

// {/* FROM STOP */}
// <select
//   value={sourceId}
//   onChange={(e) => {
//     const id = e.target.value;
//     setSourceId(id);

//     const stop = routeStops.find(s => s.stop_id === id);
//     setFromText(stop ? stop.name : "");

//     // reset TO when FROM changes
//     setDestinationId("");
//     setToText("");
//   }}
//   disabled={!routeId}
//   className="border p-3 rounded-lg w-full"
// >
//   <option value="">Select From Stop</option>

//   {routeStops.map(s => (
//     <option key={s.stop_id} value={s.stop_id}>
//       {s.name}
//     </option>
//   ))}
// </select>
// {/* TO STOP */}
// <select
//   value={destinationId}
//   onChange={(e) => {
//     const id = e.target.value;
//     setDestinationId(id);

//     const stop = routeStops.find(s => s.stop_id === id);
//     setToText(stop ? stop.name : "");
//   }}
//   disabled={!sourceId}
//   className="border p-3 rounded-lg w-full"
// >
//   <option value="">Select To Stop</option>

//   {routeStops
//     .filter(s => s.stop_id !== sourceId)
//     .map(s => (
//       <option key={s.stop_id} value={s.stop_id}>
//         {s.name}
//       </option>
//     ))}
// </select>

//       {/* FROM & TO */}
//       {/* (unchanged – same as your existing code) */}

//       {/* FARE */}
//       {fare !== null && (
//         <div className="text-lg font-bold">
//           Fare per ticket: ₹{fare} <br />
//           Total: ₹{fare * ticketCount}
//         </div>
//       )}

//       {/* STRIPE CARD */}
//       <div className="border p-4 rounded-lg">
//         <h3 className="font-semibold mb-2">Card Details</h3>
//         <CardElement />
//       </div>

//       {/* PAY */}
//       <button
//         onClick={handlePayment}
//         disabled={loading || fare === null}
//         className="bg-blue-600 text-white py-3 rounded-lg w-full disabled:opacity-50"
//       >
//         <CreditCard className="inline mr-2" />
//         {loading ? "Processing Payment..." : "Pay & Book Ticket"}
//       </button>

//       {/* QR */}
//       {ticketBooked && qrImage && (
//         <div className="text-center mt-6">
//           <Check className="mx-auto text-green-600 w-8 h-8" />
//           <img src={qrImage} className="mx-auto mt-4 w-48" />
//           <p className="text-sm text-gray-500 mt-2">
//             One-time ticket · Valid for 1 hour
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }



// // src/passenger/TicketBooking.tsx
// import { useEffect, useState } from "react";
// import { Ticket, Check } from "lucide-react";
// import QRCode from "qrcode";
// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";
// import { getRoutes, getRouteDetails } from "../../api/transportApi";

// /* ---------------- TYPES ---------------- */
// interface Route {
//   route_id: string;
//   route_number: string;
//   route_name: string;
// }

// interface StopEntry {
//   stop_id: string | number;
//   name: string;
// }

// /* ====================================================== */

// export default function TicketBooking() {
//   const { user } = useAuth();

//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [routeId, setRouteId] = useState("");
//   const [routeStops, setRouteStops] = useState<StopEntry[]>([]);
//   const [sourceId, setSourceId] = useState("");
//   const [destinationId, setDestinationId] = useState("");

//   const [fare, setFare] = useState<number | null>(null);
//   const [walletBalance, setWalletBalance] = useState<number>(0);
//   const [qrImage, setQrImage] = useState<string | null>(null);
//   const [ticketBooked, setTicketBooked] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- LOAD ROUTES ---------------- */
//   useEffect(() => {
//     getRoutes().then(setRoutes).catch(console.error);
//   }, []);

//   /* ---------------- LOAD STOPS ---------------- */
//   useEffect(() => {
//     if (!routeId) {
//       setRouteStops([]);
//       setSourceId("");
//       setDestinationId("");
//       setFare(null);
//       return;
//     }

//     getRouteDetails(routeId)
//       .then((route: any) => setRouteStops(route.stops || []))
//       .catch(console.error);
//   }, [routeId]);

//   /* ---------------- LOAD WALLET ---------------- */
//   useEffect(() => {
//     if (!user) return;

//     supabase
//       .from("wallets")
//       .select("balance")
//       .eq("user_id", user.id)
//       .single()
//       .then(({ data }) => setWalletBalance(data?.balance ?? 0));
//   }, [user]);

//   /* ---------------- CALCULATE FARE ---------------- */
//   useEffect(() => {
//     if (!routeId || !sourceId || !destinationId) {
//       setFare(null);
//       return;
//     }

//     getRouteDetails(routeId).then((route: any) => {
//       const sIndex = route.stops.findIndex(
//         (s: any) => String(s.stop_id) === String(sourceId)
//       );
//       const dIndex = route.stops.findIndex(
//         (s: any) => String(s.stop_id) === String(destinationId)
//       );

//       if (sIndex === -1 || dIndex === -1 || dIndex <= sIndex) {
//         setFare(null);
//         return;
//       }

//       setFare((dIndex - sIndex) * 10);
//     });
//   }, [routeId, sourceId, destinationId]);

//   /* ======================================================
//      WALLET-BASED TICKET BOOKING
//   ====================================================== */

//   async function bookTicket() {
//     if (!user || fare === null) return;

//     setLoading(true);

//     // Refresh wallet
//     const { data: wallet } = await supabase
//       .from("wallets")
//       .select("balance")
//       .eq("user_id", user.id)
//       .single();

//     const balance = wallet?.balance ?? 0;
//     setWalletBalance(balance);

//     if (balance < fare) {
//       alert(
//         `Insufficient wallet balance.\nRequired: ₹${fare}\nAvailable: ₹${balance}\nPlease recharge your wallet.`
//       );
//       setLoading(false);
//       return;
//     }

//     // Deduct balance
//     await supabase.rpc("deduct_wallet_balance", {
//       uid: user.id,
//       amt: fare,
//     });

//     // Create ticket
//     await createTicket();

//     setWalletBalance(balance - fare);
//     setLoading(false);
//   }

//   /* ---------------- CREATE TICKET ---------------- */
//   async function createTicket() {
//     if (!user || fare === null) return;

//     const issuedAt = new Date();
//     const expiresAt = new Date(issuedAt.getTime() + 60 * 60 * 1000);

//     const qrPayload = {
//       ticketId: crypto.randomUUID(),
//       userId: user.id,
//       routeId,
//       sourceId,
//       destinationId,
//       fare,
//       expiresAt: expiresAt.toISOString(),
//     };

//     await supabase.from("tickets").insert({
//       passenger_id: user.id,
//       route_id: routeId,
//       source: sourceId,
//       destination: destinationId,
//       fare,
//       total_amount: fare,
//       qr_data: JSON.stringify(qrPayload),
//       issued_at: issuedAt,
//       expires_at: expiresAt,
//       status: "UNUSED",
//     });

//     const qr = await QRCode.toDataURL(JSON.stringify(qrPayload));
//     setQrImage(qr);
//     setTicketBooked(true);
//   }

//   /* ====================================================== */

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-4">
//       <h2 className="text-2xl font-bold flex items-center">
//         <Ticket className="mr-2 text-blue-600" />
//         Book Ticket
//       </h2>

//       <div className="text-sm text-gray-600">
//         Wallet Balance: <b>₹{walletBalance}</b>
//       </div>

//       {/* ROUTE */}
//       <select
//         value={routeId}
//         onChange={(e) => setRouteId(e.target.value)}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">Select Route</option>
//         {routes.map((r) => (
//           <option key={r.route_id} value={r.route_id}>
//             {r.route_number} - {r.route_name}
//           </option>
//         ))}
//       </select>

//       {/* FROM */}
//       <select
//         value={sourceId}
//         onChange={(e) => setSourceId(e.target.value)}
//         disabled={!routeId}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">From Stop</option>
//         {routeStops.map((s) => (
//           <option key={s.stop_id} value={s.stop_id}>
//             {s.name}
//           </option>
//         ))}
//       </select>

//       {/* TO */}
//       <select
//         value={destinationId}
//         onChange={(e) => setDestinationId(e.target.value)}
//         disabled={!sourceId}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">To Stop</option>
//         {routeStops
//           .filter((s) => String(s.stop_id) !== String(sourceId))
//           .map((s) => (
//             <option key={s.stop_id} value={s.stop_id}>
//               {s.name}
//             </option>
//           ))}
//       </select>

//       {fare !== null && (
//         <div className="text-lg font-bold">Fare: ₹{fare}</div>
//       )}

//       <button
//         onClick={bookTicket}
//         disabled={loading || fare === null}
//         className="bg-blue-600 text-white py-3 rounded-lg w-full disabled:opacity-50"
//       >
//         {loading ? "Booking..." : "Book Ticket (Wallet)"}
//       </button>

//       {ticketBooked && qrImage && (
//         <div className="text-center mt-6">
//           <Check className="mx-auto text-green-600 w-8 h-8" />
//           <img src={qrImage} className="mx-auto mt-4 w-48" />
//           <p className="text-sm text-gray-500 mt-2">
//             One-time ticket · Valid for 1 hour
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { Ticket, Check } from "lucide-react";
// import QRCode from "qrcode";
// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";
// import { getRoutes, getRouteDetails } from "../../api/transportApi";
// import { createTicket } from "../../services/ticketService";

// /* ---------------- TYPES ---------------- */
// interface Route {
//   route_id: string;
//   route_number: string;
//   route_name: string;
// }

// interface StopEntry {
//   stop_id: string | number;
//   name: string;
// }

// /* ====================================================== */

// export default function TicketBooking() {
//   const { user } = useAuth();

//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [routeId, setRouteId] = useState("");
//   const [routeStops, setRouteStops] = useState<StopEntry[]>([]);
//   const [sourceId, setSourceId] = useState("");
//   const [destinationId, setDestinationId] = useState("");

//   const [fare, setFare] = useState<number | null>(null);
//   const [walletBalance, setWalletBalance] = useState<number>(0);
//   const [qrImage, setQrImage] = useState<string | null>(null);
//   const [ticketBooked, setTicketBooked] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- LOAD ROUTES ---------------- */
//   useEffect(() => {
//     getRoutes().then(setRoutes).catch(console.error);
//   }, []);

//   /* ---------------- LOAD STOPS ---------------- */
//   useEffect(() => {
//     if (!routeId) {
//       setRouteStops([]);
//       setSourceId("");
//       setDestinationId("");
//       setFare(null);
//       return;
//     }

//     getRouteDetails(routeId)
//       .then((route: any) => setRouteStops(route.stops || []))
//       .catch(console.error);
//   }, [routeId]);

//   /* ---------------- LOAD WALLET ---------------- */
//   useEffect(() => {
//     if (!user) return;

//     supabase
//       .from("wallets")
//       .select("balance")
//       .eq("user_id", user.id)
//       .single()
//       .then(({ data }) => setWalletBalance(data?.balance ?? 0));
//   }, [user]);

//   /* ---------------- CALCULATE FARE ---------------- */
//   useEffect(() => {
//     if (!routeId || !sourceId || !destinationId) {
//       setFare(null);
//       return;
//     }

//     getRouteDetails(routeId).then((route: any) => {
//       const sIndex = route.stops.findIndex(
//         (s: any) => String(s.stop_id) === String(sourceId)
//       );
//       const dIndex = route.stops.findIndex(
//         (s: any) => String(s.stop_id) === String(destinationId)
//       );

//       if (sIndex === -1 || dIndex === -1 || dIndex <= sIndex) {
//         setFare(null);
//         return;
//       }

//       setFare((dIndex - sIndex) * 10);
//     });
//   }, [routeId, sourceId, destinationId]);

//   /* ======================================================
//      WALLET-BASED TICKET BOOKING
//   ====================================================== */

//   async function bookTicket() {
//     if (!user || fare === null) return;

//     setLoading(true);

//     // Refresh wallet balance
//     const { data: wallet } = await supabase
//       .from("wallets")
//       .select("balance")
//       .eq("user_id", user.id)
//       .single();

//     const balance = wallet?.balance ?? 0;
//     setWalletBalance(balance);

//     if (balance < fare) {
//       alert(
//         `Insufficient wallet balance.\nRequired: ₹${fare}\nAvailable: ₹${balance}\nPlease recharge your wallet.`
//       );
//       setLoading(false);
//       return;
//     }

//     // Deduct wallet balance
//     await supabase.rpc("deduct_wallet_balance", {
//       uid: user.id,
//       amt: fare,
//     });

//     // Create ticket + QR
//     await createTicket();

//     setWalletBalance(balance - fare);
//     setLoading(false);
//   }

//   /* ======================================================
//      CREATE TICKET + STORE QR SEPARATELY (1 DAY)
//   ====================================================== */

//   async function createTicket() {
//     if (!user || fare === null) return;

//     const issuedAt = new Date();
//     const expiresAt = new Date(
//       issuedAt.getTime() + 24 * 60 * 60 * 1000 // ✅ 1 DAY
//     );

//     /* 1️⃣ Create Ticket */
//     const { data: ticket, error } = await supabase
//   .from("tickets")
//   .insert({
//     passenger_id: user.id,
//     route_id: routeId || null,
//     source: String(sourceId),
//     destination: String(destinationId),
//     fare: Number(fare),
//     ticket_count: 1,
//     total_amount: Number(fare),
//     status: "ACTIVE",
//     issued_at: new Date().toISOString(),
//     expires_at: new Date(
//       Date.now() + 24 * 60 * 60 * 1000
//     ).toISOString(),
//   })
//   .select()
//   .single();

// if (error) {
//   console.error("INSERT ERROR →", error);
//   alert(error.message);
//   return;
// }


//     /* 2️⃣ Create QR Payload */
//     const qrPayload = {
//       ticketId: ticket.id,
//       userId: user.id,
//       routeId,
//       sourceId,
//       destinationId,
//       fare,
//       expiresAt: expiresAt.toISOString(),
//     };

//     /* 3️⃣ Store QR in separate table */
//     await supabase.from("ticket_qr_codes").insert({
//       ticket_id: ticket.id,
//       qr_payload: JSON.stringify(qrPayload),
//       expires_at: expiresAt,
//       is_active: true,
//     });

//     /* 4️⃣ Generate QR image */
//     const qr = await QRCode.toDataURL(JSON.stringify(qrPayload));
//     setQrImage(qr);
//     setTicketBooked(true);
//   }

//   /* ====================================================== */

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-4">
//       <h2 className="text-2xl font-bold flex items-center">
//         <Ticket className="mr-2 text-blue-600" />
//         Book Ticket
//       </h2>

//       <div className="text-sm text-gray-600">
//         Wallet Balance: <b>₹{walletBalance}</b>
//       </div>

//       {/* ROUTE */}
//       <select
//         value={routeId}
//         onChange={(e) => setRouteId(e.target.value)}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">Select Route</option>
//         {routes.map((r) => (
//           <option key={r.route_id} value={r.route_id}>
//             {r.route_number} - {r.route_name}
//           </option>
//         ))}
//       </select>

//       {/* FROM */}
//       <select
//         value={sourceId}
//         onChange={(e) => setSourceId(e.target.value)}
//         disabled={!routeId}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">From Stop</option>
//         {routeStops.map((s) => (
//           <option key={s.stop_id} value={s.stop_id}>
//             {s.name}
//           </option>
//         ))}
//       </select>

//       {/* TO */}
//       <select
//         value={destinationId}
//         onChange={(e) => setDestinationId(e.target.value)}
//         disabled={!sourceId}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">To Stop</option>
//         {routeStops
//           .filter((s) => String(s.stop_id) !== String(sourceId))
//           .map((s) => (
//             <option key={s.stop_id} value={s.stop_id}>
//               {s.name}
//             </option>
//           ))}
//       </select>

//       {fare !== null && (
//         <div className="text-lg font-bold">Fare: ₹{fare}</div>
//       )}

//       <button
//         onClick={bookTicket}
//         disabled={loading || fare === null}
//         className="bg-blue-600 text-white py-3 rounded-lg w-full disabled:opacity-50"
//       >
//         {loading ? "Booking..." : "Book Ticket (Wallet)"}
//       </button>

//       {ticketBooked && qrImage && (
//         <div className="text-center mt-6">
//           <Check className="mx-auto text-green-600 w-8 h-8" />
//           <img src={qrImage} className="mx-auto mt-4 w-48" />
//           <p className="text-sm text-gray-500 mt-2">
//             QR valid for 24 hours · One-time use
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


// //src/passenger/TicketBooking.tsx
// import { useEffect, useState } from "react";
// import { Ticket, Check } from "lucide-react";
// import QRCode from "qrcode";
// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";
// import { getRoutes, getRouteDetails } from "../../api/transportApi";

// /* ---------------- TYPES ---------------- */
// interface Route {
//   route_id: string;
//   route_number: string;
//   route_name: string;
// }

// interface StopEntry {
//   stop_id: string | number;
//   name: string;
// }

// export default function TicketBooking({
//   voiceBookingData,
// }: {
//   voiceBookingData?: {
//     routeId?: string;
//     sourceId?: string;
//     destinationId?: string;
//   } | null;
// }) {
//   const { user } = useAuth();

//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [routeId, setRouteId] = useState("");
//   const [routeStops, setRouteStops] = useState<StopEntry[]>([]);
//   const [sourceId, setSourceId] = useState("");
//   const [destinationId, setDestinationId] = useState("");
//   const [fare, setFare] = useState<number | null>(null);
//   const [walletBalance, setWalletBalance] = useState<number>(0);
//   const [qrImage, setQrImage] = useState<string | null>(null);
//   const [ticketBooked, setTicketBooked] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- LOAD ROUTES ---------------- */
//   useEffect(() => {
//     getRoutes().then(setRoutes).catch(console.error);
//   }, []);

//   /* 🔥 AUTO-FILL FROM VOICE */
//   // Step 1: apply route AFTER routes load
// useEffect(() => {
//   if (!voiceBookingData?.routeId) return;
//   if (routes.length === 0) return;

//   setRouteId(voiceBookingData.routeId);
// }, [voiceBookingData, routes]);

//   /* ---------------- LOAD STOPS ---------------- */
//   useEffect(() => {
//     if (!routeId) {
//       setRouteStops([]);
//       setSourceId("");
//       setDestinationId("");
//       setFare(null);
//       return;
//     }

//     getRouteDetails(routeId)
//       .then((route: any) => setRouteStops(route.stops || []))
//       .catch(console.error);
//   }, [routeId]);

//   /* ---------------- LOAD WALLET ---------------- */
//   useEffect(() => {
//     if (!user) return;

//     supabase
//       .from("wallets")
//       .select("balance")
//       .eq("user_id", user.id)
//       .single()
//       .then(({ data }) => setWalletBalance(data?.balance ?? 0));
//   }, [user]);
  
//   /* ---------------- CALCULATE FARE ---------------- */
//   useEffect(() => {
//     if (!routeId || !sourceId || !destinationId) {
//       setFare(null);
//       return;
//     }

//     getRouteDetails(routeId).then((route: any) => {
//       const sIndex = route.stops.findIndex(
//         (s: any) => String(s.stop_id) === String(sourceId)
//       );
//       const dIndex = route.stops.findIndex(
//         (s: any) => String(s.stop_id) === String(destinationId)
//       );

//       if (sIndex === -1 || dIndex === -1 || dIndex <= sIndex) {
//         setFare(null);
//         return;
//       }

//       setFare((dIndex - sIndex) * 10);
//     });
//   }, [routeId, sourceId, destinationId]);

//   /* ---------------- BOOK TICKET ---------------- */
//   async function bookTicket() {
//     if (!user || fare === null) return;
//     setLoading(true);

//     const { data: wallet } = await supabase
//       .from("wallets")
//       .select("balance")
//       .eq("user_id", user.id)
//       .single();

//     const balance = wallet?.balance ?? 0;
//     setWalletBalance(balance);

//     if (balance < fare) {
//       alert(`Insufficient wallet balance`);
//       setLoading(false);
//       return;
//     }

//     await supabase.rpc("deduct_wallet_balance", {
//       uid: user.id,
//       amt: fare,
//     });

//     await createTicket();
//     setWalletBalance(balance - fare);
//     setLoading(false);
//   }

//   async function createTicket() {
//     if (!user || fare === null) return;

//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

//     const { data: ticket } = await supabase
//       .from("tickets")
//       .insert({
//         passenger_id: user.id,
//         route_id: routeId,
//         source: String(sourceId),
//         destination: String(destinationId),
//         fare,
//         status: "ACTIVE",
//         issued_at: new Date().toISOString(),
//         expires_at: expiresAt.toISOString(),
//       })
//       .select()
//       .single();

//     const payload = {
//       ticketId: ticket.id,
//       routeId,
//       sourceId,
//       destinationId,
//       fare,
//     };

//     const qr = await QRCode.toDataURL(JSON.stringify(payload));
//     setQrImage(qr);
//     setTicketBooked(true);
//   }

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-4">
//       <h2 className="text-2xl font-bold flex items-center">
//         <Ticket className="mr-2 text-blue-600" />
//         Book Ticket
//       </h2>

//       <div>Wallet Balance: ₹{walletBalance}</div>

//       <select
//         value={routeId}
//         onChange={(e) => setRouteId(e.target.value)}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">Select Route</option>
//         {routes.map((r) => (
//           <option key={r.route_id} value={r.route_id}>
//             {r.route_number} - {r.route_name}
//           </option>
//         ))}
//       </select>

//       <select
//         value={sourceId}
//         onChange={(e) => setSourceId(e.target.value)}
//         disabled={!routeId}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">From Stop</option>
//         {routeStops.map((s) => (
//           <option key={s.stop_id} value={s.stop_id}>
//             {s.name}
//           </option>
//         ))}
//       </select>

//       <select
//         value={destinationId}
//         onChange={(e) => setDestinationId(e.target.value)}
//         disabled={!sourceId}
//         className="border p-3 rounded-lg w-full"
//       >
//         <option value="">To Stop</option>
//         {routeStops
//           .filter((s) => String(s.stop_id) !== String(sourceId))
//           .map((s) => (
//             <option key={s.stop_id} value={s.stop_id}>
//               {s.name}
//             </option>
//           ))}
//       </select>

//       {fare !== null && <div className="font-bold">Fare: ₹{fare}</div>}

//       <button
//         onClick={bookTicket}
//         disabled={loading || fare === null}
//         className="bg-blue-600 text-white py-3 rounded-lg w-full"
//       >
//         {loading ? "Booking..." : "Book Ticket (Wallet)"}
//       </button>

//       {ticketBooked && qrImage && (
//         <div className="text-center mt-4">
//           <Check className="mx-auto text-green-600 w-8 h-8" />
//           <img src={qrImage} className="mx-auto mt-3 w-48" />
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Ticket, Check } from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { getRoutes, getRouteDetails } from "../../api/transportApi";

/* ---------------- TYPES ---------------- */
interface Route {
  route_id: string;
  route_number: string;
  route_name: string;
}

interface StopEntry {
  stop_id: string | number;
  name: string;
}

interface VoiceBookingData {
  routeId?: string;
  sourceId?: string;
  destinationId?: string;
}

/* ---------------- COMPONENT ---------------- */
export default function TicketBooking({
  voiceBookingData,
}: {
  voiceBookingData?: VoiceBookingData | null;
}) {
  const { user } = useAuth();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeId, setRouteId] = useState("");
  const [routeStops, setRouteStops] = useState<StopEntry[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [fare, setFare] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [ticketBooked, setTicketBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD ROUTES ---------------- */
  useEffect(() => {
    getRoutes().then(setRoutes).catch(console.error);
  }, []);

  /* 🔥 STEP 1: APPLY ROUTE ONLY AFTER ROUTES LOAD */
  useEffect(() => {
    if (!voiceBookingData?.routeId) return;
    if (routes.length === 0) return;

    setRouteId(voiceBookingData.routeId);
  }, [voiceBookingData, routes]);

  /* ---------------- LOAD STOPS ---------------- */
  useEffect(() => {
    if (!routeId) {
      setRouteStops([]);
      setFare(null);
      return;
    }

    getRouteDetails(routeId)
      .then((route: any) => setRouteStops(route.stops || []))
      .catch(console.error);
  }, [routeId]);

  /* 🔥 STEP 2: APPLY STOPS ONLY AFTER STOPS LOAD */
  useEffect(() => {
    if (!voiceBookingData) return;
    if (routeStops.length === 0) return;

    if (voiceBookingData.sourceId) {
      setSourceId(voiceBookingData.sourceId);
    }

    if (voiceBookingData.destinationId) {
      setDestinationId(voiceBookingData.destinationId);
    }
  }, [routeStops, voiceBookingData]);

  /* ---------------- LOAD WALLET ---------------- */
  useEffect(() => {
    if (!user) return;

    supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setWalletBalance(data?.balance ?? 0));
  }, [user]);

  /* ---------------- CALCULATE FARE ---------------- */
  useEffect(() => {
    if (!routeId || !sourceId || !destinationId) {
      setFare(null);
      return;
    }

    getRouteDetails(routeId).then((route: any) => {
      const sIndex = route.stops.findIndex(
        (s: any) => String(s.stop_id) === String(sourceId)
      );
      const dIndex = route.stops.findIndex(
        (s: any) => String(s.stop_id) === String(destinationId)
      );

      if (sIndex === -1 || dIndex === -1 || dIndex <= sIndex) {
        setFare(null);
        return;
      }

      setFare((dIndex - sIndex) * 10);
    });
  }, [routeId, sourceId, destinationId]);

  /* ---------------- BOOK TICKET ---------------- */
  async function bookTicket() {
    if (!user || fare === null) return;
    setLoading(true);

    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    const balance = wallet?.balance ?? 0;
    setWalletBalance(balance);

    if (balance < fare) {
      alert("Insufficient wallet balance");
      setLoading(false);
      return;
    }

    await supabase.rpc("deduct_wallet_balance", {
      uid: user.id,
      amt: fare,
    });

    await createTicket();
    setWalletBalance(balance - fare);
    setLoading(false);
  }

  async function createTicket() {
    if (!user || fare === null) return;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const { data: ticket } = await supabase
      .from("tickets")
      .insert({
        passenger_id: user.id,
        route_id: routeId,
        source: String(sourceId),
        destination: String(destinationId),
        fare,
        status: "ACTIVE",
        issued_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    const payload = {
      ticketId: ticket.id,
      routeId,
      sourceId,
      destinationId,
      fare,
    };

    const qr = await QRCode.toDataURL(JSON.stringify(payload));
    setQrImage(qr);
    setTicketBooked(true);
  }

  /* ---------------- UI ---------------- */
  return (
    // <div className="bg-white p-6 rounded-xl shadow space-y-4">
    <div className="bg-white p-6 rounded-xl shadow space-y-4 relative z-10">

      <h2 className="text-2xl font-bold flex items-center">
        <Ticket className="mr-2 text-blue-600" />
        Book Ticket
      </h2>

      <div>Wallet Balance: ₹{walletBalance}</div>

      <select
        value={routeId}
        onChange={(e) => setRouteId(e.target.value)}
        className="border p-3 rounded-lg w-full"
      >
        <option value="">Select Route</option>
        {routes.map((r) => (
          <option key={r.route_id} value={r.route_id}>
            {r.route_number} - {r.route_name}
          </option>
        ))}
      </select>

      <select
        value={sourceId}
        onChange={(e) => setSourceId(e.target.value)}
        disabled={!routeId}
        className="border p-3 rounded-lg w-full"
      >
        <option value="">From Stop</option>
        {routeStops.map((s) => (
          <option key={s.stop_id} value={s.stop_id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={destinationId}
        onChange={(e) => setDestinationId(e.target.value)}
        disabled={!sourceId}
        className="border p-3 rounded-lg w-full"
      >
        <option value="">To Stop</option>
        {routeStops
          .filter((s) => String(s.stop_id) !== String(sourceId))
          .map((s) => (
            <option key={s.stop_id} value={s.stop_id}>
              {s.name}
            </option>
          ))}
      </select>

      {fare !== null && <div className="font-bold">Fare: ₹{fare}</div>}

      <button
        onClick={bookTicket}
        disabled={loading || fare === null}
        className="bg-blue-600 text-white py-3 rounded-lg w-full"
      >
        {loading ? "Booking..." : "Book Ticket (Wallet)"}
      </button>

      {ticketBooked && qrImage && (
        <div className="text-center mt-4">
          <Check className="mx-auto text-green-600 w-8 h-8" />
          <img src={qrImage} className="mx-auto mt-3 w-48" />
        </div>
      )}
    </div>
  );
}
