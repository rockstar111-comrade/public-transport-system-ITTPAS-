// // src/pages/Home.tsx
// import {
//   Bus,
//   MapPin,
//   Shield,
//   Clock,
//   CreditCard,
//   Award,
// } from "lucide-react";

// /* ================= PROPS ================= */
// interface HomeProps {
//   isLoggedIn: boolean;
//   onLogin: () => void;
//   onRegister: () => void;
//   onOpenSearch: () => void;
//   onOpenBookings: () => void;
//   onOpenTracking: () => void;
//   onOpenProfile: () => void;
// }

// export default function Home({
//   isLoggedIn,
//   onLogin,
//   onRegister,
//   onOpenSearch,
//   onOpenBookings,
//   onOpenTracking,
//   onOpenProfile,
// }: HomeProps) {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ================= NAVBAR ================= */}
//       <nav className="bg-white shadow border-b">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
//           {/* LOGO */}
//           <div className="flex items-center space-x-2">
//             <Bus className="w-7 h-7 text-blue-600" />
//             <span className="text-xl font-bold text-blue-600">
//               State Transport
//             </span>
//           </div>

//           {/* NAV ACTIONS */}
//           <div className="flex space-x-4">
//             {!isLoggedIn ? (
//               <>
//                 <button
//                   onClick={onLogin}
//                   className="text-gray-700 font-medium hover:text-blue-600"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={onRegister}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Register
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button onClick={onOpenSearch}>Search Routes</button>
//                 <button onClick={onOpenBookings}>Book Ticket</button>
//                 <button onClick={onOpenTracking}>Track Bus</button>
//                 <button onClick={onOpenProfile}>Profile</button>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* ================= HERO ================= */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//         <div className="max-w-7xl mx-auto px-4 py-20 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-6">
//             Welcome to State Transport Services
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 text-blue-100">
//             Book tickets, track buses in real-time, and travel with confidence
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={onOpenBookings}
//               className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold text-lg hover:bg-blue-50 shadow-lg"
//             >
//               Search & Book Tickets
//             </button>
//             <button
//               onClick={onOpenTracking}
//               className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 shadow-lg"
//             >
//               Track Bus Live
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= SERVICES ================= */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">
//             Our Services
//           </h2>
//           <p className="text-lg text-gray-600">
//             Comprehensive bus transport solutions for all citizens
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//           <ServiceCard
//             icon={<MapPin className="h-7 w-7 text-blue-600" />}
//             title="Real-Time Tracking"
//             desc="Track your bus location in real-time on interactive maps."
//             bg="bg-blue-100"
//           />
//           <ServiceCard
//             icon={<CreditCard className="h-7 w-7 text-green-600" />}
//             title="Easy Online Booking"
//             desc="Fast, secure and paperless ticket booking."
//             bg="bg-green-100"
//           />
//           <ServiceCard
//             icon={<Shield className="h-7 w-7 text-purple-600" />}
//             title="Secure & Verified"
//             desc="QR-based tickets with one-time validation."
//             bg="bg-purple-100"
//           />
//           <ServiceCard
//             icon={<Clock className="h-7 w-7 text-orange-600" />}
//             title="24/7 Availability"
//             desc="Multiple routes operating round-the-clock."
//             bg="bg-orange-100"
//           />
//           <ServiceCard
//             icon={<Award className="h-7 w-7 text-pink-600" />}
//             title="Women's Benefits"
//             desc="Free or discounted travel after Aadhaar verification."
//             bg="bg-pink-100"
//           />
//           <ServiceCard
//             icon={<Bus className="h-7 w-7 text-teal-600" />}
//             title="Modern Fleet"
//             desc="Well-maintained AC, Express and Ordinary buses."
//             bg="bg-teal-100"
//           />
//         </div>

//         {/* ================= SCHEME ================= */}
//         <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
//           <h3 className="text-xl font-semibold text-blue-900 mb-3">
//             Special Scheme: Free Travel for Women
//           </h3>
//           <p className="text-gray-700 mb-4">
//             Eligible women passengers can enjoy free or discounted travel after Aadhaar verification.
//           </p>
//           <button
//             onClick={onRegister}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Register & Verify Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= SERVICE CARD ================= */
// function ServiceCard({
//   icon,
//   title,
//   desc,
//   bg,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
//   bg: string;
// }) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
//       <div className={`${bg} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
//         {icon}
//       </div>
//       <h3 className="text-xl font-semibold mb-3">{title}</h3>
//       <p className="text-gray-600">{desc}</p>
//     </div>
//   );
// }



// // // src/pages/Home.tsx
// // import {
// //   Bus,
// //   MapPin,
// //   Shield,
// //   Clock,
// //   CreditCard,
// //   Award,
// // } from "lucide-react";

// // /* ================= PROPS ================= */
// // interface HomeProps {
// //   isLoggedIn: boolean;
// //   onLogin: () => void;
//   onRegister: () => void;
//   onOpenSearch: () => void;
//   onOpenBookings: () => void;
//   onOpenTracking: () => void;
//   onOpenProfile: () => void;
//   onOpenConductor: () => void; // ✅ NEW
// }

// export default function Home({
//   isLoggedIn,
//   onLogin,
//   onRegister,
//   onOpenSearch,
//   onOpenBookings,
//   onOpenTracking,
//   onOpenProfile,
//   onOpenConductor,
// }: HomeProps) {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ================= NAVBAR ================= */}
//       <nav className="bg-white shadow border-b">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          
//           {/* LOGO */}
//           <div className="flex items-center space-x-2">
//             <Bus className="w-7 h-7 text-blue-600" />
//             <span className="text-xl font-bold text-blue-600">
//               State Transport
//             </span>
//           </div>

//           {/* NAV ACTIONS */}
//           <div className="flex items-center space-x-4">
//             {!isLoggedIn ? (
//               <>
//                 <button
//                   onClick={onLogin}
//                   className="text-gray-700 font-medium hover:text-blue-600"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={onRegister}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Register
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={onOpenSearch}
//                   className="text-gray-700 hover:text-blue-600 font-medium"
//                 >
//                   Search Routes
//                 </button>
//                 <button
//                   onClick={onOpenBookings}
//                   className="text-gray-700 hover:text-blue-600 font-medium"
//                 >
//                   Book Ticket
//                 </button>
//                 <button
//                   onClick={onOpenTracking}
//                   className="text-gray-700 hover:text-blue-600 font-medium"
//                 >
//                   Track Bus
//                 </button>
//                 <button
//                   onClick={onOpenProfile}
//                   className="text-gray-700 hover:text-blue-600 font-medium"
//                 >
//                   Profile
//                 </button>

//                 {/* ✅ CONDUCTOR PORTAL BUTTON */}
//                 <button
//                   onClick={onOpenConductor}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//                 >
//                   Conductor Portal
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* ================= HERO ================= */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//         <div className="max-w-7xl mx-auto px-4 py-20 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-6">
//             Welcome to State Transport Services
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 text-blue-100">
//             Book tickets, track buses in real-time, and travel with confidence
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={onOpenBookings}
//               className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold text-lg hover:bg-blue-50 shadow-lg"
//             >
//               Search & Book Tickets
//             </button>
//             <button
//               onClick={onOpenTracking}
//               className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 shadow-lg"
//             >
//               Track Bus Live
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= SERVICES ================= */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">
//             Our Services
//           </h2>
//           <p className="text-lg text-gray-600">
//             Comprehensive bus transport solutions for all citizens
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//           <ServiceCard
//             icon={<MapPin className="h-7 w-7 text-blue-600" />}
//             title="Real-Time Tracking"
//             desc="Track your bus location in real-time on interactive maps."
//             bg="bg-blue-100"
//           />
//           <ServiceCard
//             icon={<CreditCard className="h-7 w-7 text-green-600" />}
//             title="Easy Online Booking"
//             desc="Fast, secure and paperless ticket booking."
//             bg="bg-green-100"
//           />
//           <ServiceCard
//             icon={<Shield className="h-7 w-7 text-purple-600" />}
//             title="Secure & Verified"
//             desc="QR-based tickets with one-time validation."
//             bg="bg-purple-100"
//           />
//           <ServiceCard
//             icon={<Clock className="h-7 w-7 text-orange-600" />}
//             title="24/7 Availability"
//             desc="Multiple routes operating round-the-clock."
//             bg="bg-orange-100"
//           />
//           <ServiceCard
//             icon={<Award className="h-7 w-7 text-pink-600" />}
//             title="Women's Benefits"
//             desc="Free or discounted travel after Aadhaar verification."
//             bg="bg-pink-100"
//           />
//           <ServiceCard
//             icon={<Bus className="h-7 w-7 text-teal-600" />}
//             title="Modern Fleet"
//             desc="Well-maintained AC, Express and Ordinary buses."
//             bg="bg-teal-100"
//           />
//         </div>

//         {/* ================= SCHEME ================= */}
//         <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
//           <h3 className="text-xl font-semibold text-blue-900 mb-3">
//             Special Scheme: Free Travel for Women
//           </h3>
//           <p className="text-gray-700 mb-4">
//             Eligible women passengers can enjoy free or discounted travel after Aadhaar verification.
//           </p>
//           <button
//             onClick={onRegister}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Register & Verify Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= SERVICE CARD ================= */
// function ServiceCard({
//   icon,
//   title,
//   desc,
//   bg,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
//   bg: string;
// }) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
//       <div className={`${bg} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
//         {icon}
//       </div>
//       <h3 className="text-xl font-semibold mb-3">{title}</h3>
//       <p className="text-gray-600">{desc}</p>
//     </div>
//   );
// }



// src/pages/Home.tsx
import {
  Bus,
  MapPin,
  Shield,
  Clock,
  CreditCard,
  Award,
} from "lucide-react";

/* ================= PROPS ================= */
interface HomeProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onOpenSearch: () => void;
  onOpenBookings: () => void;
  onOpenTracking: () => void;
  onOpenProfile: () => void;
  onOpenConductor: () => void;
   // ✅ Conductor Portal
  //  onOpenMeeseva: () => void;
}

export default function Home({
  isLoggedIn,
  onLogin,
  onRegister,
  onOpenSearch,
  onOpenBookings,
  onOpenTracking,
  onOpenProfile,
  onOpenConductor,
}: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center space-x-2">
            <Bus className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">
              State Transport
            </span>
          </div>

          {/* NAV ACTIONS */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={onLogin}
                  className="text-gray-700 font-medium hover:text-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={onRegister}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenSearch}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Search Routes
                </button>

                <button
                  onClick={onOpenBookings}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Book Ticket
                </button>

                <button
                  onClick={onOpenTracking}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Track Bus
                </button>

                <button
                  onClick={onOpenProfile}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Profile
                </button>

                {/* ✅ CONDUCTOR PORTAL */}
                <button
                  onClick={onOpenConductor}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Conductor Portal
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to State Transport Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Book tickets, track buses in real-time, and travel with confidence
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onOpenBookings}
              className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold text-lg hover:bg-blue-50 shadow-lg"
            >
              Search & Book Tickets
            </button>
            <button
              onClick={onOpenTracking}
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 shadow-lg"
            >
              Track Bus Live
            </button>
          </div>
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive bus transport solutions for all citizens
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ServiceCard
            icon={<MapPin className="h-7 w-7 text-blue-600" />}
            title="Real-Time Tracking"
            desc="Track your bus location in real-time on interactive maps."
            bg="bg-blue-100"
          />
          <ServiceCard
            icon={<CreditCard className="h-7 w-7 text-green-600" />}
            title="Easy Online Booking"
            desc="Fast, secure and paperless ticket booking."
            bg="bg-green-100"
          />
          <ServiceCard
            icon={<Shield className="h-7 w-7 text-purple-600" />}
            title="Secure & Verified"
            desc="QR-based tickets with one-time validation."
            bg="bg-purple-100"
          />
          <ServiceCard
            icon={<Clock className="h-7 w-7 text-orange-600" />}
            title="24/7 Availability"
            desc="Multiple routes operating round-the-clock."
            bg="bg-orange-100"
          />
          <ServiceCard
            icon={<Award className="h-7 w-7 text-pink-600" />}
            title="Women's Benefits"
            desc="Free or discounted travel after Aadhaar verification."
            bg="bg-pink-100"
          />
          <ServiceCard
            icon={<Bus className="h-7 w-7 text-teal-600" />}
            title="Modern Fleet"
            desc="Well-maintained AC, Express and Ordinary buses."
            bg="bg-teal-100"
          />
        </div>

        {/* ================= SCHEME ================= */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">
            Special Scheme: Free Travel for Women
          </h3>
          <p className="text-gray-700 mb-4">
            Eligible women passengers can enjoy free or discounted travel after Aadhaar verification.
          </p>
          <button
            onClick={onRegister}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register & Verify Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= SERVICE CARD ================= */
function ServiceCard({
  icon,
  title,
  desc,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
      <div
        className={`${bg} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
