import { detectIntent } from "./intentDetector";
import { extractSourceDestination } from "./entityExtractor";
import { chatbotApi } from "../services/chatbotApi";
import { ChatbotState } from "./chatbotContext";

interface ChatbotResponse {
  reply: string;
  bookingData?: any;
}

export async function chatbotController(
  text: string,
  context: ChatbotState,
  updateContext: (data: Partial<ChatbotState>) => void
): Promise<ChatbotResponse> {
  const normalizedText = text.toLowerCase().trim();
  const intent = detectIntent(normalizedText);

  const entities = extractSourceDestination(normalizedText);

  if (entities.source || entities.destination) {
    updateContext({
      source: entities.source ?? context.source,
      destination: entities.destination ?? context.destination,
    });
  }

  /* ================= BOOK TICKET ================= */

  if (
    intent === "BOOK_TICKET" &&
    (entities.source || context.source) &&
    (entities.destination || context.destination)
  ) {
    const sourceName = entities.source ?? context.source!;
    const destinationName = entities.destination ?? context.destination!;

    const resolved = await chatbotApi.resolveStopsByName(
      sourceName,
      destinationName
    );

    /* ---------- DIRECT ROUTE ---------- */
    if (resolved.type === "DIRECT") {
      return {
        reply: `Direct bus available from ${resolved.source.name} to ${resolved.destination.name}. Say YES to book.`,
        bookingData: {
          type: "DIRECT",
          routeId: resolved.routeId,
          sourceId: resolved.source.stop_id,
          destinationId: resolved.destination.stop_id,
        },
      };
    }

    /* ---------- TRANSFER ROUTE ---------- */
    if (resolved.type === "TRANSFER") {
      return {
        reply: `You need to change bus at ${resolved.leg1.to.name}. First take route ${resolved.leg1.routeId}, then route ${resolved.leg2.routeId}. Say YES to continue.`,
        bookingData: {
          type: "TRANSFER",
          leg1: {
            routeId: resolved.leg1.routeId,
            sourceId: resolved.leg1.from.stop_id,
            destinationId: resolved.leg1.to.stop_id,
          },
          leg2: {
            routeId: resolved.leg2.routeId,
            sourceId: resolved.leg2.from.stop_id,
            destinationId: resolved.leg2.to.stop_id,
          },
        },
      };
    }

    return {
      reply: "No route found for this journey.",
    };
  }

  /* ================= CONFIRM ================= */

  if (normalizedText === "yes") {
    return {
      reply: "Opening ticket booking screen…",
      bookingData: context,
    };
  }

  return {
    reply:
      "You can say: book ticket from Miyapur X Road to Panama.",
  };
}
