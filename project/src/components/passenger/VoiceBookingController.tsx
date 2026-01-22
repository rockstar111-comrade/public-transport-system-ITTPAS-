// //project/src/components/passenger/VoiceBookingController.tsx
// import { useState } from "react";
// import { getRoutes, getRouteDetails } from "../../api/transportApi";

// /* ================= TYPESCRIPT FIX ================= */
// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// /* ================= TYPES ================= */
// interface VoiceBookingData {
//   routeId?: string;
//   sourceId?: string;
//   destinationId?: string;
// }

// interface Props {
//   onBookingReady: (data: VoiceBookingData) => void;
// }

// export function VoiceBookingController({ onBookingReady }: Props) {
//   const [listening, setListening] = useState(false);

//   /* ================= START VOICE ================= */
//   const startVoice = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported. Use Chrome or Edge.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onend = () => setListening(false);

//     recognition.onerror = (e: any) => {
//       alert("Microphone access denied. Please allow mic permission.");
//       setListening(false);
//     };

//     recognition.onresult = async (event: any) => {
//       const text = event.results[0][0].transcript.toLowerCase();
//       console.log("VOICE:", text);
//       await handleCommand(text);
//     };

//     recognition.start();
//   };

//   /* ================= MAIN INTENT HANDLER ================= */
//   async function handleCommand(text: string) {
//     const isBooking =
//       text.includes("book") || text.includes("ticket");

//     const isRouteQuery =
//       text.includes("how to go") ||
//       text.includes("route") ||
//       text.includes("stops");

//     if (isRouteQuery) {
//       await explainRouteFlow(text);
//       return;
//     }

//     if (isBooking) {
//       await bookingFlow(text);
//       return;
//     }

//     speak("Please say book ticket or ask how to go.");
//   }

//   /* ================= BOOKING FLOW ================= */
//   async function bookingFlow(text: string) {
//     const match = text.match(/from (.+?) to (.+)/);

//     if (!match) {
//       speak("Please say book ticket from place to place.");
//       return;
//     }

//     const from = match[1].trim();
//     const to = match[2].trim();

//     speak(`Finding ticket from ${from} to ${to}`);

//     const routes = await getRoutes();

//     for (const route of routes) {
//       const details: any = await getRouteDetails(route.route_id);
//       const stops = details?.stops || [];

//       const source = stops.find((s: any) =>
//         s.name.toLowerCase().includes(from)
//       );
//       const destination = stops.find((s: any) =>
//         s.name.toLowerCase().includes(to)
//       );

//       if (source && destination) {
//         speak("Route found. Opening booking page.");

//         onBookingReady({
//           routeId: route.route_id,
//           sourceId: String(source.stop_id),
//           destinationId: String(destination.stop_id),
//         });
//         return;
//       }
//     }

//     speak("No matching route found for booking.");
//   }

//   /* ================= ROUTE EXPLANATION FLOW ================= */
//   async function explainRouteFlow(text: string) {
//     const match = text.match(/from (.+?) to (.+)/);

//     if (!match) {
//       speak("Please tell from where to where you want to travel.");
//       return;
//     }

//     const from = match[1].trim();
//     const to = match[2].trim();

//     speak(`Explaining route from ${from} to ${to}`);

//     const routes = await getRoutes();

//     for (const route of routes) {
//       const details: any = await getRouteDetails(route.route_id);
//       const stops = details?.stops || [];

//       const sIndex = stops.findIndex((s: any) =>
//         s.name.toLowerCase().includes(from)
//       );
//       const dIndex = stops.findIndex((s: any) =>
//         s.name.toLowerCase().includes(to)
//       );

//       if (sIndex >= 0 && dIndex > sIndex) {
//         const routeStops = stops
//           .slice(sIndex, dIndex + 1)
//           .map((s: any) => s.name);

//         speakRouteExplanation(routeStops);
//         speak("Do you want to book the ticket?");
//         return;
//       }
//     }

//     speak("Sorry, no route found for this journey.");
//   }

//   /* ================= SPEAK ROUTE ================= */
//   function speakRouteExplanation(stops: string[]) {
//     let message = "Your journey will be like this. ";

//     stops.forEach((stop, index) => {
//       if (index === 0) {
//         message += `Start from ${stop}. `;
//       } else if (index === stops.length - 1) {
//         message += `Finally reach ${stop}. `;
//       } else {
//         message += `Then the bus stops at ${stop}. `;
//       }
//     });

//     speak(message);
//   }

//   /* ================= TEXT TO SPEECH ================= */
//   function speak(text: string) {
//     const msg = new SpeechSynthesisUtterance(text);
//     msg.rate = 0.9;
//     msg.lang = "en-IN";
//     window.speechSynthesis.speak(msg);
//   }

//   /* ================= UI ================= */
//   return (
//     <button
//       onClick={startVoice}
//       style={{
//         background: "#2563eb",
//         color: "white",
//         padding: "16px 20px",
//         borderRadius: "999px",
//         fontSize: "16px",
//         fontWeight: "600",
//         boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
//         cursor: "pointer",
//       }}
//     >
//       {listening ? "🎧 Listening..." : "🎤 Voice Assistant"}
//     </button>
//   );
// }
