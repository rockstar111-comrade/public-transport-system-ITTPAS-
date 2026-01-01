// //src/components/conductor/QRScanner.tsx
// import { useState, useEffect } from 'react';
// import { QrCode, Check, X, Camera } from 'lucide-react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { supabase } from '../../lib/supabase';
// import { useAuth } from '../../contexts/AuthContext';

// interface ScanResult {
//   success: boolean;
//   message: string;
//   ticketData?: {
//     passenger_name: string;
//     route: string;
//     from: string;
//     to: string;
//     fare: number;
//   };
// }

// export function QRScanner() {
//   const [scanning, setScanning] = useState(false);
//   const [manualCode, setManualCode] = useState('');
//   const [scanResult, setScanResult] = useState<ScanResult | null>(null);
//   const [recentScans, setRecentScans] = useState<Array<{ time: string; result: ScanResult }>>([]);
//   const { user } = useAuth();
//   const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

//   useEffect(() => {
//     return () => {
//       if (html5QrCode && scanning) {
//         html5QrCode.stop().catch(console.error);
//       }
//     };
//   }, [html5QrCode, scanning]);

//   const startScanning = async () => {
//     try {
//       const qrCodeScanner = new Html5Qrcode('qr-reader');
//       setHtml5QrCode(qrCodeScanner);

//       await qrCodeScanner.start(
//         { facingMode: 'environment' },
//         {
//           fps: 10,
//           qrbox: { width: 250, height: 250 },
//         },
//         async (decodedText) => {
//           await validateTicket(decodedText);
//           qrCodeScanner.stop();
//           setScanning(false);
//         },
//         undefined
//       );

//       setScanning(true);
//     } catch (error) {
//       console.error('Error starting scanner:', error);
//       alert('Failed to start camera. Please allow camera access or use manual entry.');
//     }
//   };

//   const stopScanning = () => {
//     if (html5QrCode) {
//       html5QrCode
//         .stop()
//         .then(() => {
//           setScanning(false);
//         })
//         .catch(console.error);
//     }
//   };

//   const validateTicket = async (qrCode: string) => {
//     if (!user) return;

//     try {
//       const { data: ticket, error } = await supabase
//         .from('tickets')
//         .select(
//           `
//           id,
//           status,
//           fare,
//           used_at,
//           profiles:passenger_id (full_name),
//           routes (route_number, route_name),
//           source:bus_stops!tickets_source_stop_id_fkey (name),
//           destination:bus_stops!tickets_destination_stop_id_fkey (name)
//         `
//         )
//         .eq('qr_code', qrCode)
//         .maybeSingle();

//       if (error) throw error;

//       if (!ticket) {
//         const result: ScanResult = {
//           success: false,
//           message: 'Invalid ticket - QR code not found',
//         };
//         setScanResult(result);
//         addToRecentScans(result);
//         return;
//       }

//       if (ticket.status === 'used') {
//         await supabase.from('ticket_scans').insert({
//           ticket_id: ticket.id,
//           conductor_id: user.id,
//           scan_result: 'already_used',
//         });

//         const result: ScanResult = {
//           success: false,
//           message: 'INVALID - Ticket already used',
//         };
//         setScanResult(result);
//         addToRecentScans(result);
//         return;
//       }

//       if (ticket.status !== 'active') {
//         const result: ScanResult = {
//           success: false,
//           message: `Invalid ticket status: ${ticket.status}`,
//         };
//         setScanResult(result);
//         addToRecentScans(result);
//         return;
//       }

//       await supabase
//         .from('tickets')
//         .update({ status: 'used', used_at: new Date().toISOString() })
//         .eq('id', ticket.id);

//       await supabase.from('ticket_scans').insert({
//         ticket_id: ticket.id,
//         conductor_id: user.id,
//         scan_result: 'valid',
//       });

//       const result: ScanResult = {
//         success: true,
//         message: 'Ticket validated successfully',
//         ticketData: {
//           passenger_name: (ticket.profiles as any)?.full_name || 'Unknown',
//           route: `${(ticket.routes as any)?.route_number} - ${(ticket.routes as any)?.route_name}`,
//           from: (ticket.source as any)?.name || '',
//           to: (ticket.destination as any)?.name || '',
//           fare: ticket.fare,
//         },
//       };

//       setScanResult(result);
//       addToRecentScans(result);
//     } catch (error) {
//       console.error('Error validating ticket:', error);
//       const result: ScanResult = {
//         success: false,
//         message: 'Error validating ticket',
//       };
//       setScanResult(result);
//       addToRecentScans(result);
//     }
//   };

//   const addToRecentScans = (result: ScanResult) => {
//     setRecentScans((prev) => [
//       { time: new Date().toLocaleTimeString(), result },
//       ...prev.slice(0, 9),
//     ]);
//   };

//   const handleManualValidation = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (manualCode.trim()) {
//       validateTicket(manualCode.trim());
//       setManualCode('');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//           <QrCode className="w-6 h-6 mr-2 text-green-600" />
//           Ticket Scanner
//         </h2>

//         <div className="space-y-6">
//           {!scanning && (
//             <div className="text-center">
//               <button
//                 onClick={startScanning}
//                 className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-md"
//               >
//                 <Camera className="w-5 h-5 mr-2" />
//                 Start Camera Scanner
//               </button>
//             </div>
//           )}

//           {scanning && (
//             <div>
//               <div
//                 id="qr-reader"
//                 className="border-4 border-green-500 rounded-lg overflow-hidden"
//               ></div>
//               <button
//                 onClick={stopScanning}
//                 className="w-full mt-4 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
//               >
//                 Stop Scanning
//               </button>
//             </div>
//           )}

//           <div className="border-t pt-6">
//             <h3 className="font-semibold text-gray-900 mb-3">Manual Entry</h3>
//             <form onSubmit={handleManualValidation} className="flex space-x-3">
//               <input
//                 type="text"
//                 value={manualCode}
//                 onChange={(e) => setManualCode(e.target.value)}
//                 placeholder="Enter QR code manually"
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
//               >
//                 Validate
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {scanResult && (
//         <div
//           className={`rounded-xl shadow-lg p-6 ${
//             scanResult.success
//               ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
//               : 'bg-gradient-to-br from-red-500 to-red-600 text-white'
//           }`}
//         >
//           <div className="flex items-center justify-center mb-4">
//             <div className="bg-white bg-opacity-20 p-4 rounded-full">
//               {scanResult.success ? (
//                 <Check className="w-12 h-12" />
//               ) : (
//                 <X className="w-12 h-12" />
//               )}
//             </div>
//           </div>

//           <h3 className="text-2xl font-bold text-center mb-2">{scanResult.message}</h3>

//           {scanResult.success && scanResult.ticketData && (
//             <div className="bg-white bg-opacity-20 rounded-lg p-4 mt-4 space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Passenger:</span>
//                 <span className="font-medium">{scanResult.ticketData.passenger_name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Route:</span>
//                 <span className="font-medium">{scanResult.ticketData.route}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>From:</span>
//                 <span className="font-medium">{scanResult.ticketData.from}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>To:</span>
//                 <span className="font-medium">{scanResult.ticketData.to}</span>
//               </div>
//               <div className="flex justify-between border-t border-white border-opacity-30 pt-2">
//                 <span>Fare Paid:</span>
//                 <span className="font-bold text-lg">₹{scanResult.ticketData.fare}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {recentScans.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Scans</h3>
//           <div className="space-y-2">
//             {recentScans.map((scan, idx) => (
//               <div
//                 key={idx}
//                 className={`flex items-center justify-between p-3 rounded-lg ${
//                   scan.result.success ? 'bg-green-50' : 'bg-red-50'
//                 }`}
//               >
//                 <div className="flex items-center">
//                   {scan.result.success ? (
//                     <Check className="w-5 h-5 text-green-600 mr-3" />
//                   ) : (
//                     <X className="w-5 h-5 text-red-600 mr-3" />
//                   )}
//                   <div>
//                     <p
//                       className={`font-medium text-sm ${
//                         scan.result.success ? 'text-green-800' : 'text-red-800'
//                       }`}
//                     >
//                       {scan.result.message}
//                     </p>
//                     {scan.result.ticketData && (
//                       <p className="text-xs text-gray-600">
//                         {scan.result.ticketData.passenger_name} - ₹
//                         {scan.result.ticketData.fare}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-500">{scan.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useState, useEffect } from "react";
// import { QrCode, Check, X, Camera } from "lucide-react";
// import { Html5Qrcode } from "html5-qrcode";
// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";

// interface ScanResult {
//   success: boolean;
//   message: string;
//   ticket?: {
//     source: string;
//     destination: string;
//     ticket_count: number;
//     fare: number;
//     total_amount: number;
//   };
// }

// export function QRScanner() {
//   const { user } = useAuth();

//   const [scanning, setScanning] = useState(false);
//   const [manualCode, setManualCode] = useState("");
//   const [scanResult, setScanResult] = useState<ScanResult | null>(null);
//   const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

//   useEffect(() => {
//     return () => {
//       if (html5QrCode && scanning) {
//         html5QrCode.stop().catch(console.error);
//       }
//     };
//   }, [html5QrCode, scanning]);

//   const startScanning = async () => {
//     try {
//       const qr = new Html5Qrcode("qr-reader");
//       setHtml5QrCode(qr);

//       // await qr.start(
//       //   { facingMode: "environment" },
//       //   { fps: 10, qrbox: 250 },
//       //   async (decodedText) => {
//       //     await validateTicket(decodedText);
//       //     await qr.stop();
//       //     setScanning(false);
//       //   }
//       // );
//       await qr.start(
//   { facingMode: "environment" },
//   { fps: 10, qrbox: 250 },
//   async (decodedText) => {
//     await validateTicket(decodedText);
//     await qr.stop();
//     setScanning(false);
//   },
//   (errorMessage) => {
//     // optional: console.log(errorMessage);
//   }
// );


//       setScanning(true);
//     } catch (err) {
//       alert("Camera access failed. Use manual entry.");
//     }
//   };

//   const validateTicket = async (qrValue: string) => {
//     if (!user) return;

//     setScanResult(null);

//     const { data: ticket, error } = await supabase
//       .from("tickets")
//       .select("*")
//       .eq("qr_data", qrValue)
//       .maybeSingle();

//     if (error || !ticket) {
//       setScanResult({
//         success: false,
//         message: "INVALID – Ticket not found",
//       });
//       return;
//     }

//     if (ticket.scanned) {
//       setScanResult({
//         success: false,
//         message: "INVALID – Ticket already scanned",
//       });
//       return;
//     }

//     // ✅ Mark as scanned (ONE TIME)
//     await supabase
//       .from("tickets")
//       .update({
//         scanned: true,
//         scanned_at: new Date().toISOString(),
//       })
//       .eq("id", ticket.id);

//     setScanResult({
//       success: true,
//       message: "VALID TICKET",
//       ticket: {
//         source: ticket.source,
//         destination: ticket.destination,
//         ticket_count: ticket.ticket_count,
//         fare: ticket.fare,
//         total_amount: ticket.total_amount,
//       },
//     });
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-6">
//       <h2 className="text-2xl font-bold flex items-center">
//         <QrCode className="mr-2 text-green-600" />
//         Scan Ticket
//       </h2>

//       {!scanning && (
//         <button
//           onClick={startScanning}
//           className="w-full bg-green-600 text-white py-3 rounded-lg"
//         >
//           <Camera className="inline mr-2" /> Start Camera Scan
//         </button>
//       )}

//       {scanning && (
//         <div>
//           <div id="qr-reader" className="border-4 border-green-500 rounded-lg" />
//         </div>
//       )}

//       {/* Manual */}
//       <input
//         value={manualCode}
//         onChange={(e) => setManualCode(e.target.value)}
//         placeholder="Paste QR value manually"
//         className="border p-3 rounded-lg w-full"
//       />
//       <button
//         onClick={() => validateTicket(manualCode)}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg"
//       >
//         Validate Manually
//       </button>

//       {/* RESULT */}
//       {scanResult && (
//         <div
//           className={`p-5 rounded-lg text-white ${
//             scanResult.success ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           <div className="flex items-center justify-center mb-3">
//             {scanResult.success ? (
//               <Check size={40} />
//             ) : (
//               <X size={40} />
//             )}
//           </div>

//           <h3 className="text-xl text-center font-bold">
//             {scanResult.message}
//           </h3>

//           {scanResult.success && scanResult.ticket && (
//             <div className="mt-4 space-y-2 text-sm">
//               <p><b>From:</b> {scanResult.ticket.source}</p>
//               <p><b>To:</b> {scanResult.ticket.destination}</p>
//               <p><b>Tickets:</b> {scanResult.ticket.ticket_count}</p>
//               <p><b>Fare / Ticket:</b> ₹{scanResult.ticket.fare}</p>
//               <p className="font-bold text-lg">
//                 Total: ₹{scanResult.ticket.total_amount}
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




// import { useState, useEffect } from "react";
// import { QrCode, Check, X, Camera } from "lucide-react";
// import { Html5Qrcode } from "html5-qrcode";
// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";

// interface ScanResult {
//   success: boolean;
//   message: string;
//   ticket?: {
//     source: string;
//     destination: string;
//     ticket_count: number;
//     fare: number;
//     total_amount: number;
//   };
// }

// export function QRScanner() {
//   const { user } = useAuth();

//   const [scanning, setScanning] = useState(false);
//   const [manualCode, setManualCode] = useState("");
//   const [scanResult, setScanResult] = useState<ScanResult | null>(null);
//   const [qrInstance, setQrInstance] = useState<Html5Qrcode | null>(null);

//   /* ================= CLEANUP ================= */
//   useEffect(() => {
//     return () => {
//       if (qrInstance) {
//         qrInstance.stop().catch(() => {});
//       }
//     };
//   }, [qrInstance]);

//   /* ================= START SCAN ================= */
//   // const startScanning = async () => {
//   //   try {
//   //     const qr = new Html5Qrcode("qr-reader");
//   //     setQrInstance(qr);

//   //     await qr.start(
//   //       { facingMode: { ideal: "environment" } }, // ✅ mobile + laptop
//   //       { fps: 10, qrbox: 250 },
//   //       async (decodedText) => {
//   //         await validateTicket(decodedText);
//   //         await qr.stop();
//   //         setScanning(false);
//   //       },
//   //       () => {} // ✅ REQUIRED error callback (TypeScript fix)
//   //     );

//   //     setScanning(true);
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Camera access failed. Use manual entry.");
//   //   }
//   // };
//   const startScanning = async () => {
//   try {
//     setScanning(true); // ✅ render div FIRST

//     setTimeout(async () => {
//       const qr = new Html5Qrcode("qr-reader");
//       setQrInstance(qr);

//       await qr.start(
//         { facingMode: { ideal: "environment" } },
//         { fps: 10, qrbox: 250 },
//         async (decodedText) => {
//           await validateTicket(decodedText);
//           await qr.stop();
//           setScanning(false);
//         },
//         () => {} // required error callback
//       );
//     }, 300); // ⏳ small delay ensures DOM exists
//   } catch (err) {
//     console.error(err);
//     alert("Camera access failed. Use manual entry.");
//     setScanning(false);
//   }
// };


//   /* ================= VALIDATE ================= */
//   const validateTicket = async (qrValue: string) => {
//     if (!user || !qrValue) return;

//     setScanResult(null);

//     const { data: ticket, error } = await supabase
//       .from("tickets")
//       .select("*")
//       .eq("qr_data", qrValue)
//       .maybeSingle();

//     if (error || !ticket) {
//       setScanResult({
//         success: false,
//         message: "INVALID – Ticket not found",
//       });
//       return;
//     }

//     if (ticket.scanned) {
//       setScanResult({
//         success: false,
//         message: "INVALID – Ticket already scanned",
//       });
//       return;
//     }

//     // ✅ Mark ticket as used (ONE TIME)
//     const { error: updateError } = await supabase
//       .from("tickets")
//       .update({
//         scanned: true,
//         scanned_at: new Date().toISOString(),
//       })
//       .eq("id", ticket.id);

//     if (updateError) {
//       setScanResult({
//         success: false,
//         message: "Scan failed. Try again.",
//       });
//       return;
//     }

//     setScanResult({
//       success: true,
//       message: "VALID TICKET",
//       ticket: {
//         source: ticket.source,
//         destination: ticket.destination,
//         ticket_count: ticket.ticket_count,
//         fare: ticket.fare,
//         total_amount: ticket.total_amount,
//       },
//     });
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-6">
//       <h2 className="text-2xl font-bold flex items-center">
//         <QrCode className="mr-2 text-green-600" />
//         Scan Ticket
//       </h2>

//       {!scanning && (
//         <button
//           onClick={startScanning}
//           className="w-full bg-green-600 text-white py-3 rounded-lg"
//         >
//           <Camera className="inline mr-2" />
//           Start Camera Scan
//         </button>
//       )}

//       {/* {scanning && (
//         <div
//           id="qr-reader"
//           className="border-4 border-green-500 rounded-lg"
//         />
//       )} */}
//       <div
//   id="qr-reader"
//   className={`border-4 border-green-500 rounded-lg ${
//     scanning ? "block" : "hidden"
//   }`}
// />


//       {/* MANUAL ENTRY */}
//       <input
//         value={manualCode}
//         onChange={(e) => setManualCode(e.target.value)}
//         placeholder="Paste QR value manually"
//         className="border p-3 rounded-lg w-full"
//       />

//       <button
//         onClick={() => validateTicket(manualCode)}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg"
//       >
//         Validate Manually
//       </button>

//       {/* RESULT */}
//       {scanResult && (
//         <div
//           className={`p-5 rounded-lg text-white ${
//             scanResult.success ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           <div className="flex justify-center mb-3">
//             {scanResult.success ? <Check size={40} /> : <X size={40} />}
//           </div>

//           <h3 className="text-xl text-center font-bold">
//             {scanResult.message}
//           </h3>

//           {scanResult.success && scanResult.ticket && (
//             <div className="mt-4 space-y-2 text-sm">
//               <p><b>From:</b> {scanResult.ticket.source}</p>
//               <p><b>To:</b> {scanResult.ticket.destination}</p>
//               <p><b>Tickets:</b> {scanResult.ticket.ticket_count}</p>
//               <p><b>Fare / Ticket:</b> ₹{scanResult.ticket.fare}</p>
//               <p className="font-bold text-lg">
//                 Total: ₹{scanResult.ticket.total_amount}
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { QrCode, Check, X, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

interface ScanResult {
  success: boolean;
  message: string;
  ticket?: {
    source: string;
    destination: string;
    ticket_count: number;
    fare: number;
    total_amount: number;
  };
}

export function QRScanner() {
  const { user } = useAuth();
  const qrRef = useRef<Html5Qrcode | null>(null);

  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  /* ================= FORCE STOP CAMERA ================= */
  const stopCamera = async () => {
    try {
      if (qrRef.current) {
        await qrRef.current.stop();
        await qrRef.current.clear();
        qrRef.current = null;
      }

      // 🔴 HARD stop media stream (fixes camera staying ON)
      document.querySelectorAll("video").forEach(video => {
        const stream = video.srcObject as MediaStream | null;
        stream?.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      });
    } catch {
      // ignore
    } finally {
      setScanning(false);
    }
  };

  /* ================= CLEANUP ON UNMOUNT ================= */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* ================= START CAMERA ================= */
    const startScanning = async () => {
  if (scanning) return;

  setScanResult(null);
  setScanning(true);

  setTimeout(async () => {
    try {
      const qr = new Html5Qrcode("qr-reader");
      qrRef.current = qr;

      const onScanSuccess = async (decodedText: string) => {
        await validateTicket(decodedText);
        await stopCamera();
      };

      const onScanError = () => {};

      // ✅ GET CAMERAS FIRST (SAFE FOR ALL DEVICES)
      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        alert("No camera found");
        await stopCamera();
        return;
      }

      // ✅ TRY TO PICK BACK CAMERA (MOBILE)
      const backCamera =
        cameras.find(c =>
          c.label.toLowerCase().includes("back") ||
          c.label.toLowerCase().includes("rear")
        ) || cameras[0]; // fallback

      await qr.start(
        backCamera.id,        // ✅ STRING ONLY
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanError
      );

    } catch (err) {
      alert("Camera access failed. Use manual entry.");
      await stopCamera();
    }
  }, 300);
};


  /* ================= VALIDATE TICKET ================= */
  const validateTicket = async (qrValue: string) => {
    if (!user || !qrValue) return;

    const { data: ticket } = await supabase
      .from("tickets")
      .select("*")
      .eq("qr_data", qrValue)
      .maybeSingle();

    if (!ticket) {
      setScanResult({
        success: false,
        message: "INVALID – Ticket not found",
      });
      return;
    }

    if (ticket.scanned) {
      setScanResult({
        success: false,
        message: "INVALID – Ticket already scanned",
      });
      return;
    }

    await supabase
      .from("tickets")
      .update({
        scanned: true,
        scanned_at: new Date().toISOString(),
      })
      .eq("id", ticket.id);

    setScanResult({
      success: true,
      message: "VALID TICKET",
      ticket: {
        source: ticket.source,
        destination: ticket.destination,
        ticket_count: ticket.ticket_count,
        fare: ticket.fare,
        total_amount: ticket.total_amount,
      },
    });
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <QrCode className="mr-2 text-green-600" />
        Scan Ticket
      </h2>

      {!scanning && (
        <button
          onClick={startScanning}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          <Camera className="inline mr-2" />
          Start Camera Scan
        </button>
      )}

      {/* CAMERA CONTAINER (MUST ALWAYS EXIST) */}
      <div
        id="qr-reader"
        className={`border-4 border-green-500 rounded-lg ${
          scanning ? "block" : "hidden"
        }`}
      />

      {/* MANUAL ENTRY */}
      <input
        value={manualCode}
        onChange={(e) => setManualCode(e.target.value)}
        placeholder="Paste QR value manually"
        className="border p-3 rounded-lg w-full"
      />
      <button
        onClick={() => validateTicket(manualCode)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Validate Manually
      </button>

      {/* RESULT */}
      {scanResult && (
        <div
          className={`p-5 rounded-lg text-white ${
            scanResult.success ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center justify-center mb-3">
            {scanResult.success ? <Check size={40} /> : <X size={40} />}
          </div>

          <h3 className="text-xl text-center font-bold">
            {scanResult.message}
          </h3>

          {scanResult.success && scanResult.ticket && (
            <div className="mt-4 space-y-2 text-sm">
              <p><b>From:</b> {scanResult.ticket.source}</p>
              <p><b>To:</b> {scanResult.ticket.destination}</p>
              <p><b>Tickets:</b> {scanResult.ticket.ticket_count}</p>
              <p><b>Fare / Ticket:</b> ₹{scanResult.ticket.fare}</p>
              <p className="font-bold text-lg">
                Total: ₹{scanResult.ticket.total_amount}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
