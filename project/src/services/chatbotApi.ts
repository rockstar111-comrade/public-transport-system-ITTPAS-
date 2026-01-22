// src/services/chatbotApi.ts
// export const chatbotApi = {
//   getFare: async (from: string, to: string) =>
//     fetch(`/api/fare?from=${from}&to=${to}`).then((r) => r.json()),

//   getStops: async (from: string, to: string) =>
//     fetch(`/api/stops?from=${from}&to=${to}`).then((r) => r.json()),

//   resolveStopsByName: async (sourceName: string, destinationName: string) => {
//     const res = await fetch(
//       `/api/resolve-stops?source=${encodeURIComponent(
//         sourceName
//       )}&destination=${encodeURIComponent(destinationName)}`
//     );
//     return res.json();
//   },
// };

// src/services/chatbotApi.ts

// Helper function to safely parse JSON
async function safeJson(res: Response) {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ API returned non-JSON response:", text);
    throw new Error("Invalid JSON response from backend");
  }
}

// Base API path (Vite proxy will forward /api → backend)
const API_BASE = "/api";

export const chatbotApi = {
  /* -----------------------------------------
     Resolve route + stop names
     ----------------------------------------- */
  resolveStopsByName: async (source: string, destination: string) => {
    const url = `${API_BASE}/resolve-stops?source=${encodeURIComponent(
      source
    )}&destination=${encodeURIComponent(destination)}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ resolveStopsByName failed:", res.status);
      throw new Error("Failed to resolve stops");
    }

    return safeJson(res);
  },

  /* -----------------------------------------
     Get stops between source and destination
     ----------------------------------------- */
  getStops: async (source: string, destination: string) => {
    const url = `${API_BASE}/stops?from=${encodeURIComponent(
      source
    )}&to=${encodeURIComponent(destination)}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ getStops failed:", res.status);
      throw new Error("Failed to fetch stops");
    }

    return safeJson(res);
  },

  /* -----------------------------------------
     Get fare between source and destination
     ----------------------------------------- */
  getFare: async (source: string, destination: string) => {
    const url = `${API_BASE}/fare?from=${encodeURIComponent(
      source
    )}&to=${encodeURIComponent(destination)}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ getFare failed:", res.status);
      throw new Error("Failed to fetch fare");
    }

    return safeJson(res);
  },
};
