// project/src/components/chatbot/ChatbotWindow.tsx
// import { useState } from "react";
// import MessageBubble from "./MessageBubble";
// import VoiceInputButton from "./VoiceInputButton";
// import { chatbotController } from "../../chatbot/chatbotController";
// import {
//   useChatbotContext,
//   ChatbotState,
// } from "../../chatbot/chatbotContext";

// /* ================= TYPES ================= */

// interface Message {
//   from: "user" | "bot";
//   text: string;
// }

// interface ChatbotWindowProps {
//   onClose: () => void;
//   onBookingReady: (data: ChatbotState) => void;
// }

// /* ================= COMPONENT ================= */

// export default function ChatbotWindow({
//   onClose,
//   onBookingReady,
// }: ChatbotWindowProps): JSX.Element {
//   const [input, setInput] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]); // ✅ FIX never[]

//   const { context, updateContext } = useChatbotContext();

//   const sendMessage = async (text: string) => {
//     if (!text.trim()) return;

//     setMessages((prev) => [...prev, { from: "user", text }]);
//     setInput("");

//     const response = await chatbotController(text, context, updateContext);

//     setMessages((prev) => [
//       ...prev,
//       { from: "bot", text: response.reply },
//     ]);

//     if (response.bookingData) {
//       onBookingReady(response.bookingData);
//     }
//   };

//   return (
//     <div className="chatbot-window">
//       <header className="chatbot-header">
//         <span>AI Ticket Assistant</span>
//         <button onClick={onClose}>✖</button>
//       </header>

//       <div className="chatbot-body">
//         {messages.map((m, i) => (
//           <MessageBubble key={i} from={m.from} text={m.text} />
//         ))}
//       </div>

//       <div className="chatbot-input">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type or speak your request"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
//         />
//         <VoiceInputButton onResult={sendMessage} />
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { chatbotController } from "../../chatbot/chatbotController";
import { useChatbotContext } from "../../chatbot/chatbotContext";
import VoiceInputButton from "./VoiceInputButton";

export default function ChatbotWindow({ onClose, onBookingReady }: any) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { context, updateContext } = useChatbotContext();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");

    const res = await chatbotController(text, context, updateContext);
    setMessages((m) => [...m, { from: "bot", text: res.reply }]);

    if (res.bookingData) onBookingReady(res.bookingData);
  };

  return (
    <div style={{ width: 360, height: 420, background: "#fff" }}>
      <header>
        AI Ticket Assistant <button onClick={onClose}>✖</button>
      </header>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>{m.text}</div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
        />
        <button onClick={() => send(input)}>Send</button>
        <VoiceInputButton onResult={send} />
      </div>
    </div>
  );
}
