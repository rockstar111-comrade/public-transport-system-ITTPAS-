// src/services/ticketService.ts
import { supabase } from "../lib/supabase";

/* ===============================
   TYPES
================================ */
export interface CreateTicketInput {
  passengerId: string;
  routeId: string;
  source: string;
  destination: string;
  fare: number;
}

/* ===============================
   CREATE & STORE TICKET
   (Valid for SAME DAY / 1 hour)
================================ */
export async function createTicket({
  passengerId,
  routeId,
  source,
  destination,
  fare,
}: CreateTicketInput) {
  const issuedAt = new Date();

  // Ticket valid for 1 hour
  const expiresAt = new Date(issuedAt.getTime() + 60 * 60 * 1000);

  const qrPayload = {
    ticketId: crypto.randomUUID(),
    passengerId,
    routeId,
    source,
    destination,
    fare,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const { error } = await supabase.from("tickets").insert({
    passenger_id: passengerId,
    route_id: routeId,
    source,
    destination,
    fare,
    total_amount: fare,
    qr_data: JSON.stringify(qrPayload),
    issued_at: issuedAt,
    expires_at: expiresAt,
    status: "UNUSED",
  });

  if (error) {
    console.error("Ticket insert failed:", error);
    throw new Error("Ticket creation failed");
  }

  return qrPayload;
}
