// src/components/conductor/DailySummary.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Calendar, IndianRupee } from "lucide-react";

export function DailySummary() {
  const [ticketsToday, setTicketsToday] = useState(0);
  const [amountCollected, setAmountCollected] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySummary();
  }, []);

  async function fetchTodaySummary() {
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("tickets")
      .select("fare")
      .gte("used_at", `${today}T00:00:00`)
      .lte("used_at", `${today}T23:59:59`);

    if (error) {
      console.error("Daily summary error:", error);
      setLoading(false);
      return;
    }

    const totalTickets = data.length;
    const totalAmount = data.reduce(
      (sum, t) => sum + (t.fare || 0),
      0
    );

    setTicketsToday(totalTickets);
    setAmountCollected(totalAmount);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Tickets Today */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Tickets Today</p>
          <h2 className="text-3xl font-bold">
            {loading ? "—" : ticketsToday}
          </h2>
        </div>
        <Calendar className="w-10 h-10 text-green-600" />
      </div>

      {/* Amount Collected */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Amount Collected</p>
          <h2 className="text-3xl font-bold">
            ₹{loading ? "—" : amountCollected}
          </h2>
        </div>
        <IndianRupee className="w-10 h-10 text-green-600" />
      </div>
    </div>
  );
}
