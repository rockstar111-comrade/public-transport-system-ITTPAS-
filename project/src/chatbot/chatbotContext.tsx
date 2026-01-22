// project/src/chatbot/chatbotContext.tsx
// import React, { createContext, useContext, useState } from "react";

// /* ================= TYPES ================= */

// export interface ChatbotState {
//   /* spoken / typed stop names */
//   source?: string;
//   destination?: string;

//   /* backend IDs used for booking */
//   routeId?: string;
//   sourceId?: string;
//   destinationId?: string;
// }

// interface ChatbotContextType {
//   context: ChatbotState;
//   updateContext: (data: Partial<ChatbotState>) => void;
// }

// /* ================= CONTEXT ================= */

// const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// /* ================= PROVIDER ================= */

// export function ChatbotProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }): JSX.Element {
//   const [context, setContext] = useState<ChatbotState>({});

//   const updateContext = (data: Partial<ChatbotState>) => {
//     setContext((prev) => ({ ...prev, ...data }));
//   };

//   return (
//     <ChatbotContext.Provider value={{ context, updateContext }}>
//       {children}
//     </ChatbotContext.Provider>
//   );
// }

// /* ================= HOOK ================= */

// export function useChatbotContext(): ChatbotContextType {
//   const ctx = useContext(ChatbotContext);
//   if (!ctx) {
//     throw new Error("useChatbotContext must be used inside ChatbotProvider");
//   }
//   return ctx;
// }


import React, { createContext, useContext, useState } from "react";

export interface ChatbotState {
  source?: string;
  destination?: string;
  routeId?: string;
  sourceId?: string;
  destinationId?: string;
}

interface ChatbotContextType {
  context: ChatbotState;
  updateContext: (data: Partial<ChatbotState>) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<ChatbotState>({});

  const updateContext = (data: Partial<ChatbotState>) => {
    setContext((prev) => ({ ...prev, ...data }));
  };

  return (
    <ChatbotContext.Provider value={{ context, updateContext }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbotContext() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("ChatbotContext missing");
  return ctx;
}
