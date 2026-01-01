// // src/components/passenger/PassengerProfile.tsx
// import { useState, useEffect } from "react";
// import {
//   User,
//   CheckCircle,
//   Clock,
//   XCircle,
//   ShieldCheck,
// } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import { supabase } from "../../lib/supabase";

// interface AadhaarVerification {
//   id: string;
//   aadhaar_number: string;
//   aadhaar_image_url: string | null;
//   status: "pending" | "approved" | "rejected";
//   created_at: string;
//   verified_at: string | null;
// }

// export function PassengerProfile() {
//   const { profile, user } = useAuth();
//   const [verification, setVerification] =
//     useState<AadhaarVerification | null>(null);
//   const [showApplyForm, setShowApplyForm] = useState(false);
//   const [aadhaarNumber, setAadhaarNumber] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user && profile?.gender === "female") {
//       fetchVerification();
//     }
//   }, [user, profile]);

//   const fetchVerification = async () => {
//     if (!user) return;

//     const { data } = await supabase
//       .from("aadhaar_verifications")
//       .select("*")
//       .eq("passenger_id", user.id)
//       .maybeSingle();

//     setVerification(data);
//   };

//   const applyForVerification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     setLoading(true);
//     try {
//       const maskedAadhaar = aadhaarNumber.replace(/\d(?=\d{4})/g, "X");

//       const { error } = await supabase.from("aadhaar_verifications").insert({
//         passenger_id: user.id,
//         aadhaar_number: maskedAadhaar,
//         status: "pending",
//       });

//       if (error) throw error;

//       await fetchVerification();
//       setShowApplyForm(false);
//       setAadhaarNumber("");
//     } catch (err) {
//       alert("Failed to submit application");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StatusBadge = ({ status }: { status: string }) => {
//     if (status === "approved")
//       return (
//         <span className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
//           <CheckCircle className="w-4 h-4" /> Approved
//         </span>
//       );
//     if (status === "pending")
//       return (
//         <span className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
//           <Clock className="w-4 h-4" /> Pending
//         </span>
//       );
//     return (
//       <span className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
//         <XCircle className="w-4 h-4" /> Rejected
//       </span>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {/* ================= PROFILE CARD ================= */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
//           <User className="w-6 h-6 mr-2 text-blue-600" />
//           My Profile
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ProfileItem label="Full Name" value={profile?.full_name} />
//           <ProfileItem label="Email" value={user?.email} />
//           <ProfileItem label="Phone" value={profile?.phone || "—"} />
//           <ProfileItem
//             label="Gender"
//             value={profile?.gender || "Not specified"}
//           />
//           <ProfileItem label="Role" value={profile?.role} />
//         </div>
//       </div>

//       {/* ================= WOMEN BENEFIT ================= */}
//       {profile?.gender === "female" && (
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6">
//           <h3 className="text-xl font-bold text-blue-900 flex items-center mb-4">
//             <ShieldCheck className="w-6 h-6 mr-2" />
//             Women Free Travel Scheme
//           </h3>

//           {/* APPLY */}
//           {!verification && !showApplyForm && (
//             <div className="bg-white rounded-xl p-6 shadow-sm">
//               <p className="text-gray-700 mb-4">
//                 Apply for Aadhaar verification to enjoy <b>free bus travel</b>.
//                 Once approved by MeeSeva, the benefit activates automatically.
//               </p>
//               <button
//                 onClick={() => setShowApplyForm(true)}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//               >
//                 Apply Now
//               </button>
//             </div>
//           )}

//           {/* FORM */}
//           {showApplyForm && (
//             <form
//               onSubmit={applyForVerification}
//               className="bg-white rounded-xl p-6 shadow-sm space-y-4"
//             >
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Aadhaar Number
//                 </label>
//                 <input
//                   value={aadhaarNumber}
//                   onChange={(e) => setAadhaarNumber(e.target.value)}
//                   maxLength={12}
//                   pattern="\d{12}"
//                   placeholder="12-digit Aadhaar"
//                   required
//                   className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Aadhaar will be securely masked
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {loading ? "Submitting..." : "Submit"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowApplyForm(false)}
//                   className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* STATUS */}
//           {verification && (
//             <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
//               <div className="flex items-center justify-between">
//                 <h4 className="font-semibold text-gray-900">
//                   Verification Status
//                 </h4>
//                 <StatusBadge status={verification.status} />
//               </div>

//               <InfoRow
//                 label="Aadhaar"
//                 value={verification.aadhaar_number}
//               />
//               <InfoRow
//                 label="Applied On"
//                 value={new Date(
//                   verification.created_at
//                 ).toLocaleDateString()}
//               />
//               {verification.verified_at && (
//                 <InfoRow
//                   label="Verified On"
//                   value={new Date(
//                     verification.verified_at
//                   ).toLocaleDateString()}
//                 />
//               )}

//               {verification.status === "approved" && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium">
//                   🎉 You are eligible for free travel on all routes!
//                 </div>
//               )}

//               {verification.status === "pending" && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
//                   Your application is under review by MeeSeva.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- SMALL COMPONENTS ---------- */

// function ProfileItem({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | null;
// }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="text-lg font-semibold text-gray-900 capitalize">
//         {value || "—"}
//       </p>
//     </div>
//   );
// }

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className="text-gray-600">{label}</span>
//       <span className="font-medium text-gray-900">{value}</span>
//     </div>
//   );
// }




// import { useState, useEffect } from "react";
// import {
//   User,
//   CheckCircle,
//   Clock,
//   XCircle,
//   ShieldCheck,
// } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import { supabase } from "../../lib/supabase";

// /* ---------- TYPES ---------- */
// interface AadhaarVerification {
//   id: string;
//   aadhaar_number: string;
//   aadhaar_image_url: string | null;
//   status: "pending" | "approved" | "rejected";
//   created_at: string;
//   verified_at: string | null;
// }

// /* ---------- PAGE ---------- */
// export default function PassengerProfile() {
//   const { profile, user } = useAuth();

//   const [verification, setVerification] =
//     useState<AadhaarVerification | null>(null);
//   const [showApplyForm, setShowApplyForm] = useState(false);
//   const [aadhaarNumber, setAadhaarNumber] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ---------- FETCH VERIFICATION ---------- */
//   useEffect(() => {
//     if (user && profile?.gender === "female") {
//       fetchVerification();
//     }
//   }, [user, profile]);

//   const fetchVerification = async () => {
//     if (!user) return;

//     const { data, error } = await supabase
//       .from("aadhaar_verifications")
//       .select("*")
//       .eq("passenger_id", user.id)
//       .maybeSingle();

//     if (!error) {
//       setVerification(data);
//     }
//   };

//   /* ---------- APPLY ---------- */
//   const applyForVerification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     setLoading(true);
//     try {
//       const maskedAadhaar = aadhaarNumber.replace(/\d(?=\d{4})/g, "X");

//       const { error } = await supabase.from("aadhaar_verifications").insert({
//         passenger_id: user.id,
//         aadhaar_number: maskedAadhaar,
//         status: "pending",
//       });

//       if (error) throw error;

//       await fetchVerification();
//       setShowApplyForm(false);
//       setAadhaarNumber("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit Aadhaar verification");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- STATUS BADGE ---------- */
//   const StatusBadge = ({ status }: { status: string }) => {
//     if (status === "approved")
//       return (
//         <span className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
//           <CheckCircle className="w-4 h-4" /> Approved
//         </span>
//       );

//     if (status === "pending")
//       return (
//         <span className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
//           <Clock className="w-4 h-4" /> Pending
//         </span>
//       );

//     return (
//       <span className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
//         <XCircle className="w-4 h-4" /> Rejected
//       </span>
//     );
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="max-w-5xl mx-auto space-y-8 p-6">
//       {/* PROFILE */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <h2 className="text-2xl font-bold flex items-center mb-6">
//           <User className="w-6 h-6 mr-2 text-blue-600" />
//           My Profile
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ProfileItem label="Full Name" value={profile?.full_name} />
//           <ProfileItem label="Email" value={user?.email} />
//           <ProfileItem label="Phone" value={profile?.phone || "—"} />
//           <ProfileItem label="Gender" value={profile?.gender} />
//           <ProfileItem label="Role" value={profile?.role} />
//         </div>
//       </div>

//       {/* WOMEN SCHEME */}
//       {profile?.gender === "female" && (
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6">
//           <h3 className="text-xl font-bold flex items-center mb-4">
//             <ShieldCheck className="w-6 h-6 mr-2" />
//             Women Free Travel Scheme
//           </h3>

//           {!verification && !showApplyForm && (
//             <div className="bg-white p-6 rounded-xl">
//               <p className="mb-4">
//                 Apply for Aadhaar verification to enjoy free bus travel.
//               </p>
//               <button
//                 onClick={() => setShowApplyForm(true)}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-lg"
//               >
//                 Apply Now
//               </button>
//             </div>
//           )}

//           {showApplyForm && (
//             <form
//               onSubmit={applyForVerification}
//               className="bg-white p-6 rounded-xl space-y-4"
//             >
//               <input
//                 value={aadhaarNumber}
//                 onChange={(e) => setAadhaarNumber(e.target.value)}
//                 placeholder="12-digit Aadhaar"
//                 maxLength={12}
//                 required
//                 className="w-full border px-4 py-3 rounded-lg"
//               />

//               <div className="flex gap-3">
//                 <button
//                   disabled={loading}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg"
//                 >
//                   {loading ? "Submitting..." : "Submit"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowApplyForm(false)}
//                   className="bg-gray-200 px-6 py-3 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {verification && (
//             <div className="bg-white p-6 rounded-xl space-y-4">
//               <div className="flex justify-between">
//                 <h4 className="font-semibold">Verification Status</h4>
//                 <StatusBadge status={verification.status} />
//               </div>

//               <InfoRow label="Aadhaar" value={verification.aadhaar_number} />
//               <InfoRow
//                 label="Applied On"
//                 value={new Date(
//                   verification.created_at
//                 ).toLocaleDateString()}
//               />

//               {verification.status === "approved" && (
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   🎉 Free travel activated!
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- SMALL COMPONENTS ---------- */

// function ProfileItem({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | null;
// }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="text-lg font-semibold">{value || "—"}</p>
//     </div>
//   );
// }

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className="text-gray-600">{label}</span>
//       <span className="font-medium">{value}</span>
//     </div>
//   );
// }



// // src/components/passenger/PassengerProfile.tsx
// import { useState, useEffect } from "react";
// import {
//   User,
//   CheckCircle,
//   Clock,
//   XCircle,
//   ShieldCheck,
// } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import { supabase } from "../../lib/supabase";

// interface AadhaarVerification {
//   id: string;
//   aadhaar_number: string;
//   aadhaar_image_url: string | null;
//   status: "pending" | "approved" | "rejected";
//   created_at: string;
//   verified_at: string | null;
// }

// export function PassengerProfile() {
//   const { profile, user } = useAuth();
//   const [verification, setVerification] =
//     useState<AadhaarVerification | null>(null);
//   const [showApplyForm, setShowApplyForm] = useState(false);
//   const [aadhaarNumber, setAadhaarNumber] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user && profile?.gender === "female") {
//       fetchVerification();
//     }
//   }, [user, profile]);

//   const fetchVerification = async () => {
//     if (!user) return;

//     const { data } = await supabase
//       .from("aadhaar_verifications")
//       .select("*")
//       .eq("passenger_id", user.id)
//       .maybeSingle();

//     setVerification(data);
//   };

//   const applyForVerification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     setLoading(true);
//     try {
//       const maskedAadhaar = aadhaarNumber.replace(/\d(?=\d{4})/g, "X");

//       const { error } = await supabase.from("aadhaar_verifications").insert({
//         passenger_id: user.id,
//         aadhaar_number: maskedAadhaar,
//         status: "pending",
//       });

//       if (error) throw error;

//       await fetchVerification();
//       setShowApplyForm(false);
//       setAadhaarNumber("");
//     } catch (err) {
//       alert("Failed to submit application");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StatusBadge = ({ status }: { status: string }) => {
//     if (status === "approved")
//       return (
//         <span className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
//           <CheckCircle className="w-4 h-4" /> Approved
//         </span>
//       );
//     if (status === "pending")
//       return (
//         <span className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
//           <Clock className="w-4 h-4" /> Pending
//         </span>
//       );
//     return (
//       <span className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
//         <XCircle className="w-4 h-4" /> Rejected
//       </span>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {/* ================= PROFILE CARD ================= */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
//           <User className="w-6 h-6 mr-2 text-blue-600" />
//           My Profile
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ProfileItem label="Full Name" value={profile?.full_name} />
//           <ProfileItem label="Email" value={user?.email} />
//           <ProfileItem label="Phone" value={profile?.phone || "—"} />
//           <ProfileItem
//             label="Gender"
//             value={profile?.gender || "Not specified"}
//           />
//           <ProfileItem label="Role" value={profile?.role} />
//         </div>
//       </div>

//       {/* ================= WOMEN BENEFIT ================= */}
//       {profile?.gender === "female" && (
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6">
//           <h3 className="text-xl font-bold text-blue-900 flex items-center mb-4">
//             <ShieldCheck className="w-6 h-6 mr-2" />
//             Women Free Travel Scheme
//           </h3>

//           {/* APPLY */}
//           {!verification && !showApplyForm && (
//             <div className="bg-white rounded-xl p-6 shadow-sm">
//               <p className="text-gray-700 mb-4">
//                 Apply for Aadhaar verification to enjoy <b>free bus travel</b>.
//                 Once approved by MeeSeva, the benefit activates automatically.
//               </p>
//               <button
//                 onClick={() => setShowApplyForm(true)}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//               >
//                 Apply Now
//               </button>
//             </div>
//           )}

//           {/* FORM */}
//           {showApplyForm && (
//             <form
//               onSubmit={applyForVerification}
//               className="bg-white rounded-xl p-6 shadow-sm space-y-4"
//             >
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Aadhaar Number
//                 </label>
//                 <input
//                   value={aadhaarNumber}
//                   onChange={(e) => setAadhaarNumber(e.target.value)}
//                   maxLength={12}
//                   pattern="\d{12}"
//                   placeholder="12-digit Aadhaar"
//                   required
//                   className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Aadhaar will be securely masked
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {loading ? "Submitting..." : "Submit"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowApplyForm(false)}
//                   className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* STATUS */}
//           {verification && (
//             <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
//               <div className="flex items-center justify-between">
//                 <h4 className="font-semibold text-gray-900">
//                   Verification Status
//                 </h4>
//                 <StatusBadge status={verification.status} />
//               </div>

//               <InfoRow
//                 label="Aadhaar"
//                 value={verification.aadhaar_number}
//               />
//               <InfoRow
//                 label="Applied On"
//                 value={new Date(
//                   verification.created_at
//                 ).toLocaleDateString()}
//               />
//               {verification.verified_at && (
//                 <InfoRow
//                   label="Verified On"
//                   value={new Date(
//                     verification.verified_at
//                   ).toLocaleDateString()}
//                 />
//               )}

//               {verification.status === "approved" && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium">
//                   🎉 You are eligible for free travel on all routes!
//                 </div>
//               )}

//               {verification.status === "pending" && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
//                   Your application is under review by MeeSeva.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- SMALL COMPONENTS ---------- */

// function ProfileItem({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | null;
// }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="text-lg font-semibold text-gray-900 capitalize">
//         {value || "—"}
//       </p>
//     </div>
//   );
// }

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className="text-gray-600">{label}</span>
//       <span className="font-medium text-gray-900">{value}</span>
//     </div>
//   );
// }





// // src/components/passenger/PassengerProfile.tsx

// import { useEffect } from "react";
// import {
//   User,
//   ShieldCheck,
//   CheckCircle,
//   Phone,
//   Mail,
//   UserCheck,
// } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import { supabase } from "../../lib/supabase";

// export function PassengerProfile() {
//   const { profile, user } = useAuth();

//   /* =====================================================
//      AUTO-LINK AADHAAR (RUNS AFTER LOGIN)
//      ===================================================== */
//   useEffect(() => {
//     if (user) {
//       supabase.rpc("link_aadhaar_to_profile");
//     }
//   }, [user]);

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       {/* =====================================================
//           BASIC PROFILE DETAILS
//          ===================================================== */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
//           <User className="w-6 h-6 mr-2 text-blue-600" />
//           Passenger Profile
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ProfileItem
//             icon={<UserCheck />}
//             label="Full Name"
//             value={profile?.full_name}
//           />
//           <ProfileItem
//             icon={<Mail />}
//             label="Email"
//             value={user?.email}
//           />
//           <ProfileItem
//             icon={<Phone />}
//             label="Mobile"
//             value={profile?.mobile || "—"}
//           />
//           <ProfileItem
//             icon={<User />}
//             label="Gender"
//             value={profile?.gender || "Not specified"}
//           />
//           <ProfileItem
//             icon={<ShieldCheck />}
//             label="Role"
//             value={profile?.role}
//           />
//         </div>
//       </div>

//       {/* =====================================================
//           WOMEN FREE TRAVEL SECTION
//          ===================================================== */}
//       {profile?.gender === "female" && (
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6">
//           <h3 className="text-xl font-bold text-blue-900 flex items-center mb-4">
//             <ShieldCheck className="w-6 h-6 mr-2" />
//             Women Free Travel Scheme
//           </h3>

//           {/* ================= VERIFIED ================= */}
//           {profile?.is_aadhaar_verified ? (
//             <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
//               <div className="flex items-center gap-2 text-green-700 font-semibold">
//                 <CheckCircle className="w-5 h-5" />
//                 Aadhaar Verified by MeeSeva
//               </div>

//               <InfoRow label="Aadhaar Number" value={profile.aadhaar_no} />
//               <InfoRow
//                 label="Verified On"
//                 value={
//                   profile.aadhaar_verified_at
//                     ? new Date(
//                         profile.aadhaar_verified_at
//                       ).toLocaleDateString()
//                     : "—"
//                 }
//               />

//               {profile.aadhaar_image && (
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 mb-2">
//                     Aadhaar Document
//                   </p>
//                   <img
//                     src={
//                       supabase.storage
//                         .from("aadhaar-documents")
//                         .getPublicUrl(profile.aadhaar_image).data.publicUrl
//                     }
//                     alt="Aadhaar"
//                     className="max-w-xs rounded border"
//                   />
//                 </div>
//               )}

//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium">
//                 🎉 You are eligible for <b>FREE bus travel</b> on all routes.
//               </div>
//             </div>
//           ) : (
//             /* ================= NOT VERIFIED ================= */
//             <div className="bg-white rounded-xl p-6 shadow-sm">
//               <p className="text-gray-700">
//                 To activate <b>free travel</b>, please visit the nearest
//                 <b> MeeSeva office</b> with your Aadhaar card.
//               </p>
//               <p className="text-sm text-gray-500 mt-2">
//                 Aadhaar verification is done only at MeeSeva and cannot be
//                 submitted online.
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* =====================================================
//           GENERAL INFO / NOTES
//          ===================================================== */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <h3 className="text-lg font-bold mb-3">Important Notes</h3>
//         <ul className="list-disc ml-5 text-gray-700 space-y-2">
//           <li>Your QR tickets are valid for <b>one scan only</b>.</li>
//           <li>Bus capacity is updated live by conductors.</li>
//           <li>Aadhaar verification is permanent once approved.</li>
//           <li>
//             Free travel applies only to women passengers verified by MeeSeva.
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// /* =====================================================
//    SMALL REUSABLE COMPONENTS
//    ===================================================== */

// function ProfileItem({
//   label,
//   value,
//   icon,
// }: {
//   label: string;
//   value?: string | null;
//   icon?: React.ReactNode;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="text-blue-600 mt-1">{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-lg font-semibold text-gray-900 capitalize">
//           {value || "—"}
//         </p>
//       </div>
//     </div>
//   );
// }

// // function InfoRow({ label, value }: { label: string; value: string }) {
// function InfoRow({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | null;
// }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className="text-gray-600">{label}</span>
//       <span className="font-medium text-gray-900">
//         {value ?? "—"}
//       </span>
//     </div>
//   );
// }





// // src/components/passenger/PassengerProfile.tsx

// import { useState } from "react";
// import {
//   User,
//   ShieldCheck,
//   CheckCircle,
//   Phone,
//   Mail,
//   UserCheck,
// } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import { supabase } from "../../lib/supabase";

// export function PassengerProfile() {
//   const { profile, user } = useAuth();

//   /* ================= AADHAAR INPUT STATE ================= */
//   const [aadhaarNo, setAadhaarNo] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   /* ================= VERIFY AADHAAR ================= */
//   const handleVerifyAadhaar = async () => {
//     setError(null);

//     if (!aadhaarNo || aadhaarNo.length !== 12) {
//       setError("Please enter a valid 12-digit Aadhaar number");
//       return;
//     }

//     try {
//       setLoading(true);

//       const { error } = await supabase.rpc(
//         "verify_aadhaar_and_link_profile",
//         {
//           p_aadhaar_no: aadhaarNo,
//         }
//       );

//       if (error) {
//         throw error;
//       }

//       // Reload profile after successful verification
//       window.location.reload();
//     } catch (err: any) {
//       setError(err.message || "Aadhaar verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">

//       {/* ================= BASIC PROFILE DETAILS ================= */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
//           <User className="w-6 h-6 mr-2 text-blue-600" />
//           Passenger Profile
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ProfileItem icon={<UserCheck />} label="Full Name" value={profile?.full_name} />
//           <ProfileItem icon={<Mail />} label="Email" value={user?.email} />
//           <ProfileItem icon={<Phone />} label="Mobile" value={profile?.mobile || "—"} />
//           <ProfileItem icon={<User />} label="Gender" value={profile?.gender || "Not specified"} />
//           <ProfileItem icon={<ShieldCheck />} label="Role" value={profile?.role} />
//         </div>
//       </div>

//       {/* ================= WOMEN FREE TRAVEL SECTION ================= */}
//       {profile?.gender === "female" && (
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6">
//           <h3 className="text-xl font-bold text-blue-900 flex items-center mb-4">
//             <ShieldCheck className="w-6 h-6 mr-2" />
//             Women Free Travel Scheme
//           </h3>

//           {/* ===== VERIFIED ===== */}
//           {profile?.is_aadhaar_verified ? (
//             <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
//               <div className="flex items-center gap-2 text-green-700 font-semibold">
//                 <CheckCircle className="w-5 h-5" />
//                 Aadhaar Verified by MeeSeva
//               </div>

//               <InfoRow label="Aadhaar Number" value={profile.aadhaar_no} />
//               <InfoRow
//                 label="Verified On"
//                 value={
//                   profile.aadhaar_verified_at
//                     ? new Date(profile.aadhaar_verified_at).toLocaleDateString()
//                     : "—"
//                 }
//               />

//               {profile.aadhaar_image && (
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 mb-2">
//                     Aadhaar Document
//                   </p>
//                   <img
//                     src={
//                       supabase.storage
//                         .from("aadhaar-documents")
//                         .getPublicUrl(profile.aadhaar_image).data.publicUrl
//                     }
//                     alt="Aadhaar"
//                     className="max-w-xs rounded border"
//                   />
//                 </div>
//               )}

//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 font-medium">
//                 🎉 You are eligible for <b>FREE bus travel</b> on all routes.
//               </div>
//             </div>
//           ) : (
//             /* ===== NOT VERIFIED ===== */
//             <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
//               <p className="text-gray-700">
//                 Enter your Aadhaar number that was verified at
//                 <b> MeeSeva</b> to activate free travel.
//               </p>

//               <input
//                 value={aadhaarNo}
//                 onChange={(e) => setAadhaarNo(e.target.value)}
//                 placeholder="Enter 12-digit Aadhaar number"
//                 maxLength={12}
//                 className="w-full border p-3 rounded-lg"
//               />

//               {error && (
//                 <div className="bg-red-50 text-red-700 p-3 rounded">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handleVerifyAadhaar}
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {loading ? "Verifying..." : "Verify Aadhaar"}
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ================= GENERAL NOTES ================= */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         <h3 className="text-lg font-bold mb-3">Important Notes</h3>
//         <ul className="list-disc ml-5 text-gray-700 space-y-2">
//           <li>Your QR tickets are valid for <b>one scan only</b>.</li>
//           <li>Bus capacity is updated live by conductors.</li>
//           <li>Aadhaar verification is permanent once approved.</li>
//           <li>Free travel applies only to women verified by MeeSeva.</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// /* ================= SMALL COMPONENTS ================= */

// function ProfileItem({
//   label,
//   value,
//   icon,
// }: {
//   label: string;
//   value?: string | null;
//   icon?: React.ReactNode;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="text-blue-600 mt-1">{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-lg font-semibold text-gray-900 capitalize">
//           {value || "—"}
//         </p>
//       </div>
//     </div>
//   );
// }

// function InfoRow({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | null;
// }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className="text-gray-600">{label}</span>
//       <span className="font-medium text-gray-900">{value ?? "—"}</span>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  CheckCircle,
  Phone,
  Mail,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

export function PassengerProfile() {
  const { profile, user } = useAuth();

  /* ================= AADHAAR INPUT ================= */
  const [aadhaarNo, setAadhaarNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= SIGNED IMAGE ================= */
  const [aadhaarImageUrl, setAadhaarImageUrl] = useState<string | null>(null);

  /* ================= LOAD AADHAAR IMAGE ================= */
  // useEffect(() => {
  //   if (!profile?.aadhaar_image) return;

  //   const loadImage = async () => {
  //     const { data, error } = await supabase.storage
  //       .from("aadhaar-documents")
  //       .createSignedUrl(profile.aadhaar_image, 300); // 5 minutes

  //     if (!error) {
  //       setAadhaarImageUrl(data.signedUrl);
  //     }
  //   };

  //   loadImage();
  // }, [profile?.aadhaar_image]);
  useEffect(() => {
  if (!profile || !profile.aadhaar_image) return;

  const imagePath: string = profile.aadhaar_image;

  const loadImage = async () => {
    const { data, error } = await supabase.storage
      .from("aadhaar-documents")
      .createSignedUrl(imagePath, 300); // 5 minutes

    if (!error && data?.signedUrl) {
      setAadhaarImageUrl(data.signedUrl);
    }
  };

  loadImage();
}, [profile]);


  /* ================= VERIFY AADHAAR ================= */
  const handleVerifyAadhaar = async () => {
    setError(null);

    if (!aadhaarNo || aadhaarNo.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.rpc(
        "verify_aadhaar_and_link_profile",
        { p_aadhaar_no: aadhaarNo }
      );

      if (error) throw error;

      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Aadhaar verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* ================= PROFILE ================= */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold flex items-center mb-6">
          <User className="w-6 h-6 mr-2 text-blue-600" />
          Passenger Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileItem icon={<UserCheck />} label="Full Name" value={profile?.full_name} />
          <ProfileItem icon={<Mail />} label="Email" value={user?.email} />
          <ProfileItem icon={<Phone />} label="Mobile" value={profile?.mobile || "—"} />
          <ProfileItem icon={<User />} label="Gender" value={profile?.gender} />
          <ProfileItem icon={<ShieldCheck />} label="Role" value={profile?.role} />
        </div>
      </div>

      {/* ================= WOMEN FREE TRAVEL ================= */}
      {profile?.gender === "female" && (
        <div className="bg-blue-50 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold flex items-center mb-4">
            <ShieldCheck className="w-6 h-6 mr-2" />
            Women Free Travel Scheme
          </h3>

          {/* ===== VERIFIED ===== */}
          {profile.is_aadhaar_verified ? (
            <div className="bg-white p-6 rounded-xl space-y-4">
              <div className="flex items-center text-green-700 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Aadhaar Verified by MeeSeva
              </div>

              <InfoRow label="Aadhaar Number" value={profile.aadhaar_no} />
              <InfoRow
                label="Verified On"
                value={profile.aadhaar_verified_at
                  ? new Date(profile.aadhaar_verified_at).toLocaleDateString()
                  : "—"}
              />

              {/* ✅ AADHAAR IMAGE */}
              {aadhaarImageUrl ? (
                <div>
                  <p className="text-sm font-medium mb-2">Aadhaar Document</p>
                  <img
                    src={aadhaarImageUrl}
                    alt="Aadhaar"
                    className="max-w-xs rounded border"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">Loading Aadhaar image…</p>
              )}

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800">
                🎉 You are eligible for <b>FREE bus travel</b> on all routes.
              </div>
            </div>
          ) : (
            /* ===== NOT VERIFIED ===== */
            <div className="bg-white p-6 rounded-xl space-y-4">
              <p>
                Enter the Aadhaar number verified at <b>MeeSeva</b>.
              </p>

              <input
                value={aadhaarNo}
                onChange={(e) => setAadhaarNo(e.target.value)}
                maxLength={12}
                placeholder="Enter Aadhaar number"
                className="w-full border p-3 rounded-lg"
              />

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyAadhaar}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                {loading ? "Verifying..." : "Verify Aadhaar"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= NOTES ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="font-bold mb-3">Important Notes</h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>QR ticket is valid for one scan only</li>
          <li>Aadhaar verification is permanent</li>
          <li>Only MeeSeva verified women get free travel</li>
        </ul>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function ProfileItem({ label, value, icon }: any) {
  return (
    <div className="flex gap-3">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">{value || "—"}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value ?? "—"}</span>
    </div>
  );
}
