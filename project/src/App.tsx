// // src/App.tsx
// import { useState } from "react";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";

// import Home from "./pages/Home";
// import { LoginPage } from "./components/auth/LoginPage";
// import { RegisterPage } from "./components/auth/RegisterPage";

// import { PassengerDashboard } from "./components/passenger/PassengerDashboard";
// import { ConductorDashboard } from "./components/conductor/ConductorDashboard";
// import { MeesevaDashboard } from "./components/meeseva/MeesevaDashboard";

// import "leaflet/dist/leaflet.css";

// type AuthView = "home" | "login" | "register";

// function AppContent() {
//   const { user, profile, loading, signIn, signUp } = useAuth();
//   const [authView, setAuthView] = useState<AuthView>("home");

//   /* ---------- LOADING ---------- */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   /* =====================================================
//      NOT LOGGED IN → HOME / LOGIN / REGISTER
//   ===================================================== */
//   if (!user || !profile) {
//     if (authView === "login") {
//       return (
//         <LoginPage
//           onLogin={async (email, password) => {
//             await signIn(email, password);
//             // AuthContext will auto-load profile
//           }}
//           onSwitchToRegister={() => setAuthView("register")}
//         />
//       );
//     }

//     if (authView === "register") {
//       return (
//         <RegisterPage
//           onRegister={async (email, password, data) => {
//             await signUp(email, password, data);
//           }}
//           onSwitchToLogin={() => setAuthView("login")}
//         />
//       );
//     }

//     return (
//       <Home
//         isLoggedIn={false}
//         onLogin={() => setAuthView("login")}
//         onRegister={() => setAuthView("register")}
//         onOpenSearch={() => {}}
//         onOpenBookings={() => {}}
//         onOpenTracking={() => {}}
//         onOpenProfile={() => {}}
//         onOpenConductor={() => {}}
//       />
//     );
//   }

//   /* =====================================================
//      ROLE-BASED DIRECT DASHBOARDS
//   ===================================================== */

//   if (profile.role === "passenger") {
//     return <PassengerDashboard onGoHome={() => {}} />;
//   }

//   if (profile.role === "conductor") {
//     return <ConductorDashboard onGoHome={() => {}} />;
//   }

//   if (profile.role === "meeseva") {
//     return <MeesevaDashboard onGoHome={() => {}} />;
//   }

//   /* =====================================================
//      SAFETY FALLBACK
//   ===================================================== */
//   return (
//     <div className="min-h-screen flex items-center justify-center text-red-600">
//       Invalid role: {profile.role}
//     </div>
//   );
// }

// /* ---------- APP ROOT ---------- */
// export default function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }



// src/App.tsx
import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Home from "./pages/Home";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";

import { PassengerDashboard } from "./components/passenger/PassengerDashboard";
import { ConductorDashboard } from "./components/conductor/ConductorDashboard";
import { MeesevaDashboard } from "./components/meeseva/MeesevaDashboard";

import "leaflet/dist/leaflet.css";

type PublicView = "home" | "login" | "register";

function AppContent() {
  const { user, profile, loading, signIn, signUp } = useAuth();
  const [view, setView] = useState<PublicView>("home");

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* =====================================================
     🔓 NOT LOGGED IN
  ===================================================== */
  if (!user || !profile) {
    if (view === "login") {
      return (
        <LoginPage
          onLogin={async (email, password) => {
            await signIn(email, password);
          }}
          onSwitchToRegister={() => setView("register")}
        />
      );
    }

    if (view === "register") {
      return (
        <RegisterPage
          onRegister={async (email, password, data) => {
            await signUp(email, password, data);
          }}
          onSwitchToLogin={() => setView("login")}
        />
      );
    }

    return (
      <Home
        isLoggedIn={false}
        onLogin={() => setView("login")}
        onRegister={() => setView("register")}
        onOpenSearch={() => {}}
        onOpenBookings={() => {}}
        onOpenTracking={() => {}}
        onOpenProfile={() => {}}
        onOpenConductor={() => {}}
      />
    );
  }

  /* =====================================================
     🔐 ROLE BASED DASHBOARDS
  ===================================================== */
  switch (profile.role) {
    case "passenger":
      return <PassengerDashboard onGoHome={() => {}} />;

    case "conductor":
      return <ConductorDashboard onGoHome={() => {}} />;

    case "meeseva":
      return <MeesevaDashboard onGoHome={() => {}} />;

    default:
      return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
          Invalid role: {profile.role}
        </div>
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
