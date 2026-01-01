// // src/components/passenger/PassengerDashboard.tsx
// import { useState } from "react";
// import { Bus, Ticket, User, LogOut, Search } from "lucide-react";
// import { RouteSearch } from "./RouteSearch";
// import TicketBooking from "./TicketBooking";
// import { PassengerProfile } from "./PassengerProfile";
// import { useAuth } from "../../contexts/AuthContext";

// type View = "search" | "booking" | "profile";

// interface PassengerDashboardProps {
//   onGoHome: () => void;
//   initialView?: View; // ✅ NEW
// }

// export function PassengerDashboard({
//   onGoHome,
//   initialView = "search", // ✅ DEFAULT
// }: PassengerDashboardProps) {
//   const [activeView, setActiveView] = useState<View>(initialView);
//   const { profile, signOut } = useAuth();

//   const handleLogout = async () => {
//     try {
//       await signOut();
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ================= NAVBAR ================= */}
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
            
//             {/* LOGO → HOME */}
//             <button
//               onClick={onGoHome}
//               className="flex items-center space-x-3 hover:opacity-80 transition"
//             >
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <Bus className="w-6 h-6 text-white" />
//               </div>
//               <div className="text-left">
//                 <h1 className="text-xl font-bold text-gray-900">
//                   Smart Transport
//                 </h1>
//                 <p className="text-xs text-gray-500">Passenger Portal</p>
//               </div>
//             </button>

//             {/* USER + LOGOUT */}
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-700 font-medium hidden sm:inline">
//                 {profile?.full_name}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span className="text-sm font-medium">Logout</span>
//               </button>
//             </div>

//           </div>
//         </div>
//       </nav>

//       {/* ================= CONTENT ================= */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* TABS */}
//         <div className="flex space-x-2 mb-6 overflow-x-auto">
//           <button
//             onClick={() => setActiveView("search")}
//             className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
//               activeView === "search"
//                 ? "bg-blue-600 text-white shadow-md"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             <Search className="w-5 h-5" />
//             <span>Search Routes</span>
//           </button>

//           <button
//             onClick={() => setActiveView("booking")}
//             className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
//               activeView === "booking"
//                 ? "bg-blue-600 text-white shadow-md"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             <Ticket className="w-5 h-5" />
//             <span>Book Ticket</span>
//           </button>

//           <button
//             onClick={() => setActiveView("profile")}
//             className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
//               activeView === "profile"
//                 ? "bg-blue-600 text-white shadow-md"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             <User className="w-5 h-5" />
//             <span>Profile</span>
//           </button>
//         </div>

//         {/* TAB CONTENT */}
//         <div>
//           {activeView === "search" && <RouteSearch />}
//           {activeView === "booking" && <TicketBooking />}
//           {activeView === "profile" && <PassengerProfile />}
//         </div>

//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { Bus, Ticket, User, LogOut, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { RouteSearch } from "./RouteSearch";
import TicketBooking from "./TicketBooking";
import { PassengerProfile } from "./PassengerProfile";

type View = "search" | "booking" | "profile";

interface PassengerDashboardProps {
  onGoHome: () => void;
  initialView?: View;
}

export function PassengerDashboard({
  onGoHome,
  initialView = "search",
}: PassengerDashboardProps) {
  const [activeView, setActiveView] = useState<View>(initialView);
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onGoHome();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          {/* LOGO */}
          <button
            onClick={onGoHome}
            className="flex items-center space-x-3"
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Smart Transport</h1>
              <p className="text-xs text-gray-500">Passenger Portal</p>
            </div>
          </button>

          {/* USER */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {profile?.full_name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= TABS ================= */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <Tab
            icon={<Search />}
            label="Search Routes"
            active={activeView === "search"}
            onClick={() => setActiveView("search")}
          />
          <Tab
            icon={<Ticket />}
            label="Book Ticket"
            active={activeView === "booking"}
            onClick={() => setActiveView("booking")}
          />
          <Tab
            icon={<User />}
            label="Profile"
            active={activeView === "profile"}
            onClick={() => setActiveView("profile")}
          />
        </div>

        {/* ================= CONTENT ================= */}
        {activeView === "search" && <RouteSearch />}
        {activeView === "booking" && <TicketBooking />}
        {activeView === "profile" && <PassengerProfile />}
      </div>
    </div>
  );
}

function Tab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
        active
          ? "bg-blue-600 text-white"
          : "bg-white border hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
