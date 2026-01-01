import { Bus, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type Page =
  | "home"
  | "login"
  | "register"
  | "search"
  | "booking"
  | "profile";

interface Props {
  page: Page;
  setPage: (p: Page) => void;
}

export default function HomeNavbar({ page, setPage }: Props) {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        {/* LOGO → HOME */}
        <button
          onClick={() => setPage("home")}
          className="flex items-center space-x-3"
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bus className="text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold">Gov Bus</h1>
            <p className="text-xs text-gray-500">Passenger Portal</p>
          </div>
        </button>

        {/* NAV ITEMS */}
        <div className="flex items-center space-x-6">
          {!user ? (
            <>
              <button
                onClick={() => setPage("login")}
                className="font-medium"
              >
                Login
              </button>
              <button
                onClick={() => setPage("register")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("search")}>Search Routes</button>
              <button onClick={() => setPage("booking")}>Book Ticket</button>
              <button onClick={() => setPage("profile")}>Profile</button>
              <button
                onClick={signOut}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
