// project/src/chatbot/entityExtractor.ts
export function extractSourceDestination(text: string): {
  source?: string;
  destination?: string;
} {
  const match = text.match(/from (.+?) to (.+)/i);

  if (!match) return {};

  return {
    source: match[1].trim(),
    destination: match[2].trim(),
  };
}
