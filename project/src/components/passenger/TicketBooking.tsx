// src/passenger/TicketBooking.tsx
import { useEffect, useRef, useState } from "react";
import { Ticket, CreditCard, Check } from "lucide-react";
import QRCode from "qrcode";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { getRoutes, getRouteDetails } from "../../api/transportApi";

interface Route {
  route_id: string;
  route_number: string;
  route_name: string;
}

interface StopEntry {
  stop_id: string;
  name: string;
  lat: number;
  lon: number;
}

export default function TicketBooking() {
  const { user, profile } = useAuth();

  /* ---------------- ROUTES ---------------- */
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeText, setRouteText] = useState("");
  const [routeId, setRouteId] = useState("");

  /* ---------------- STOPS ---------------- */
  const [routeStops, setRouteStops] = useState<StopEntry[]>([]);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");

  /* ---------------- TICKET COUNT ---------------- */
  const [ticketCount, setTicketCount] = useState(1);

  /* ---------------- UI ---------------- */
  const [fare, setFare] = useState<number | null>(null);
  const [ticketBooked, setTicketBooked] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  /* ---------------- LOAD ROUTES ---------------- */
  useEffect(() => {
    getRoutes().then(setRoutes).catch(console.error);
  }, []);

  /* ---------------- LOAD STOPS ---------------- */
  useEffect(() => {
    if (!routeId) {
      setRouteStops([]);
      setFromText("");
      setToText("");
      setSourceId("");
      setDestinationId("");
      return;
    }

    getRouteDetails(routeId)
      .then((route: any) => setRouteStops(route.stops || []))
      .catch(console.error);
  }, [routeId]);

  /* ---------------- CLOSE DROPDOWNS ---------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(e.target as Node))
        setShowFromList(false);
      if (toRef.current && !toRef.current.contains(e.target as Node))
        setShowToList(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- FILTER STOPS ---------------- */
  const filteredFromStops = routeStops.filter(
    s =>
      typeof s.name === "string" &&
      s.name.toLowerCase().includes(fromText.toLowerCase())
  );

  const filteredToStops = routeStops.filter(
    s =>
      typeof s.name === "string" &&
      s.name.toLowerCase().includes(toText.toLowerCase())
  );

  /* ---------------- CALCULATE FARE ---------------- */
  useEffect(() => {
    calculateFare();
  }, [routeId, sourceId, destinationId]);

  async function calculateFare() {
    if (!routeId || !sourceId || !destinationId) {
      setFare(null);
      return;
    }

    const route = await getRouteDetails(routeId);

    const sIndex = route.stops.findIndex(
      (s: any) => String(s.stop_id) === sourceId
    );
    const dIndex = route.stops.findIndex(
      (s: any) => String(s.stop_id) === destinationId
    );

    if (sIndex === -1 || dIndex === -1 || sIndex >= dIndex) {
      setFare(null);
      return;
    }

    const baseFare = (dIndex - sIndex) * 10;
    setFare(profile?.is_verified_woman ? 0 : baseFare);
  }

  /* ---------------- MOCK PAYMENT ---------------- */
  function handlePayment() {
    if (!user || fare === null || loading) return;

    const totalAmount = fare * ticketCount;

    const confirmPay = window.confirm(
      `Confirm payment of ₹${totalAmount} for ${ticketCount} ticket(s)?`
    );

    if (!confirmPay) return;

    setLoading(true);

    setTimeout(async () => {
      await createTicketAfterPayment();
      setLoading(false);
    }, 1500);
  }

  /* ---------------- CREATE SINGLE QR TICKET ---------------- */
  async function createTicketAfterPayment() {
    if (!user || fare === null) return;

    const qrPayload = {
      ticketId: crypto.randomUUID(),
      tickets: ticketCount
    };

    const totalAmount = fare * ticketCount;

    const { error } = await supabase.from("tickets").insert({
      passenger_id: user.id,
      source: fromText,
      destination: toText,
      fare: fare,
      ticket_count: ticketCount,
      total_amount: totalAmount,
      qr_data: JSON.stringify(qrPayload),
    });

    if (error) {
      console.error(error);
      alert("Ticket creation failed");
      return;
    }

    const qr = await QRCode.toDataURL(JSON.stringify(qrPayload));
    setQrImage(qr);
    setTicketBooked(true);

    // Reset form
    setRouteId("");
    setRouteText("");
    setFromText("");
    setToText("");
    setSourceId("");
    setDestinationId("");
    setFare(null);
    setTicketCount(1);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold flex items-center">
        <Ticket className="mr-2 text-blue-600" />
        Book Ticket
      </h2>

      {/* ROUTE */}
      <input
        list="routes"
        placeholder="Select Route"
        value={routeText}
        onChange={(e) => {
          const text = e.target.value;
          setRouteText(text);
          const match = routes.find(
            r => `${r.route_number} - ${r.route_name}` === text
          );
          setRouteId(match ? match.route_id : "");
        }}
        className="border p-3 rounded-lg w-full"
      />

      <datalist id="routes">
        {routes.map(r => (
          <option
            key={r.route_id}
            value={`${r.route_number} - ${r.route_name}`}
          />
        ))}
      </datalist>

      {/* FROM */}
      <div className="relative" ref={fromRef}>
        <input
          placeholder="From"
          value={fromText}
          onChange={(e) => {
            setFromText(e.target.value);
            setShowFromList(true);
            setSourceId("");
          }}
          onFocus={() => setShowFromList(true)}
          disabled={!routeId}
          className="border p-3 rounded-lg w-full"
        />

        {showFromList && (
          <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
            {filteredFromStops.map(s => (
              <div
                key={s.stop_id}
                onClick={() => {
                  setFromText(s.name);
                  setSourceId(s.stop_id);
                  setShowFromList(false);
                }}
                className="p-3 cursor-pointer hover:bg-blue-50"
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TO */}
      <div className="relative" ref={toRef}>
        <input
          placeholder="To"
          value={toText}
          onChange={(e) => {
            setToText(e.target.value);
            setShowToList(true);
            setDestinationId("");
          }}
          onFocus={() => setShowToList(true)}
          disabled={!sourceId}
          className="border p-3 rounded-lg w-full"
        />

        {showToList && (
          <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto">
            {filteredToStops.map(s => (
              <div
                key={s.stop_id}
                onClick={() => {
                  setToText(s.name);
                  setDestinationId(s.stop_id);
                  setShowToList(false);
                }}
                className="p-3 cursor-pointer hover:bg-blue-50"
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TICKET COUNT */}
      {/* <input
        type="number"
        min={1}
        max={10}
        value={ticketCount}
        onChange={(e) =>
          setTicketCount(Math.min(10, Math.max(1, Number(e.target.value))))
        }
        className="border p-3 rounded-lg w-full"
        placeholder="Number of Tickets (max 10)"
      /> */}
      <div className="flex items-center justify-between border rounded-lg p-3">
  <span className="font-medium">Number of Tickets</span>

  <div className="flex items-center space-x-4">
    {/* Minus */}
    <button
      onClick={() =>
        setTicketCount(prev => Math.max(1, prev - 1))
      }
      disabled={ticketCount === 1}
      className="w-10 h-10 rounded-full bg-gray-200 text-xl font-bold disabled:opacity-50"
    >
      −
    </button>

    {/* Count */}
    <span className="text-lg font-bold w-6 text-center">
      {ticketCount}
    </span>

    {/* Plus */}
    <button
      onClick={() =>
        setTicketCount(prev => Math.min(10, prev + 1))
      }
      disabled={ticketCount === 10}
      className="w-10 h-10 rounded-full bg-blue-600 text-white text-xl font-bold disabled:opacity-50"
    >
      +
    </button>
  </div>
</div>


      {/* FARE */}
      {fare !== null && (
        <div className="text-lg font-bold text-black-600">
          Fare per ticket: ₹{fare} <br />
          Total amount: ₹{fare * ticketCount}
        </div>
      )}

      {/* PAY */}
      <button
        onClick={handlePayment}
        disabled={fare === null || loading}
        className="bg-blue-600 text-white py-3 rounded-lg w-full disabled:opacity-50"
      >
        <CreditCard className="inline mr-2" />
        {loading ? "Processing Payment..." : "Pay & Book Ticket"}
      </button>

      {/* QR */}
      {ticketBooked && qrImage && (
        <div className="text-center mt-6">
          <Check className="mx-auto text-green-600 w-8 h-8" />
          <img src={qrImage} className="mx-auto mt-4 w-48" />
          <p className="text-sm text-gray-500 mt-2">
            Tickets: {ticketCount} | One-time valid
          </p>
        </div>
      )}
    </div>
  );
}
