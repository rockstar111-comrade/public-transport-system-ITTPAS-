//project/src/components/passenger/PassengerDashboard.tsx 
import { useState } from "react";
import ReactDOM from "react-dom";
import {
  Bus,
  Ticket,
  User,
  LogOut,
  Search,
  Wallet as WalletIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { RouteSearch } from "./RouteSearch";
import TicketBooking from "./TicketBooking";
import { PassengerProfile } from "./PassengerProfile";
import Wallet from "./Wallet";
// import { VoiceBookingController } from "./VoiceBookingController";

import ChatbotWidget from "../chatbot/ChatbotWidget";
import { ChatbotProvider } from "../../chatbot/chatbotContext";

type View = "search" | "booking" | "wallet" | "profile";

interface PassengerDashboardProps {
  onGoHome: () => void;
  initialView?: View;
}

export interface VoiceBookingData {
  routeId?: string;
  sourceName?: string;
  destinationName?: string;
}


export function PassengerDashboard(props: PassengerDashboardProps) {
  return (
    <ChatbotProvider>
      <PassengerDashboardContent {...props} />
    </ChatbotProvider>
  );
}

function PassengerDashboardContent({
  onGoHome,
  initialView = "search",
}: PassengerDashboardProps) {
  const [activeView, setActiveView] = useState<View>(initialView);

  const [voiceBookingData, setVoiceBookingData] =
    useState<VoiceBookingData | null>(null);

  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onGoHome();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow border-b">
          <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <button onClick={onGoHome} className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Smart Transport</h1>
                <p className="text-xs text-gray-500">Passenger Portal</p>
              </div>
            </button>

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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-2 mb-6 flex-wrap">
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
              icon={<WalletIcon />}
              label="Wallet"
              active={activeView === "wallet"}
              onClick={() => setActiveView("wallet")}
            />

            <Tab
              icon={<User />}
              label="Profile"
              active={activeView === "profile"}
              onClick={() => setActiveView("profile")}
            />
          </div>
          {activeView === "search" && <RouteSearch />}
          {activeView === "booking" && (
            <TicketBooking voiceBookingData={voiceBookingData} />
          )}
          {activeView === "wallet" && <Wallet />}
          {activeView === "profile" && <PassengerProfile />}
        </div>
      </div>
      {ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            bottom: "30px", 
            right: "24px",
            zIndex: 999999,
          }}
        >
          <ChatbotWidget
            onBookingReady={(data: VoiceBookingData) => {
              console.log("CHATBOT BOOKING:", data);
              setVoiceBookingData(data);
              setActiveView("booking"); 
            }}
          />
        </div>,
        document.body
      )}

      {ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999999,
          }}
        >
          {/* <VoiceBookingController
            onBookingReady={(data: VoiceBookingData) => {
              console.log("VOICE BOOKING:", data);
              setVoiceBookingData(data);
              setActiveView("booking"); 
            }}
          /> */}
        </div>,
        document.body
      )}
    </>
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
