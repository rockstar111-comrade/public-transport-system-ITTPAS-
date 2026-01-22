// project/src/chatbot/intentDetector.ts
export type Intent =
  | "BOOK_TICKET"
  | "FARE_QUERY"
  | "ROUTE_QUERY"
  | "CONFIRM"
  | "UNKNOWN";

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase();

  if (t === "yes" || t === "confirm") return "CONFIRM";
  if (t.includes("book")) return "BOOK_TICKET";
  if (t.includes("fare") || t.includes("price")) return "FARE_QUERY";
  if (t.includes("how") || t.includes("route") || t.includes("stop"))
    return "ROUTE_QUERY";

  return "UNKNOWN";
}
