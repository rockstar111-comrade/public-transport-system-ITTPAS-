// src/components/conductor/ConductorDashboard.tsx
import { useState } from "react";
import { Bus, QrCode, LogOut, Activity } from "lucide-react";
import { QRScanner } from "./QRScanner";
import { BusCapacityManager } from "./BusCapacityManager";
import { useAuth } from "../../contexts/AuthContext";
import { DailySummary } from "./DailySummary";

type View = "scanner" | "capacity";

interface ConductorDashboardProps {
  onGoHome: () => void;
  initialView?: View; // ✅ optional (future-proof)
}

export function ConductorDashboard({
  onGoHome,
  initialView = "scanner",
}: ConductorDashboardProps) {
  const [activeView, setActiveView] = useState<View>(initialView);
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

          {/* LOGO → HOME */}
          <button
            onClick={onGoHome}
            className="flex items-center space-x-3 hover:opacity-80 transition"
          >
            <div className="bg-white p-2 rounded-lg">
              <Bus className="w-6 h-6 text-green-700" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">
                Smart Transport
              </h1>
              <p className="text-xs text-green-100">
                Conductor Portal
              </p>
            </div>
          </button>

          {/* USER + LOGOUT */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white font-medium hidden sm:inline">
              {profile?.full_name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-green-800 hover:bg-green-900 rounded-lg transition text-white"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-8">
      <DailySummary />
        {/* TABS */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveView("scanner")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
              activeView === "scanner"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>Scan Tickets</span>
          </button>

          <button
            onClick={() => setActiveView("capacity")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
              activeView === "capacity"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Bus Capacity</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div>
          {activeView === "scanner" && <QRScanner />}
          {activeView === "capacity" && <BusCapacityManager />}
          
        </div>

      </div>
    </div>
  );
}
