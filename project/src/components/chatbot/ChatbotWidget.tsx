// project/src/components/chatbot/ChatbotWidget.tsx
// import { useState } from "react";
// import ChatbotWindow from "./ChatbotWindow";

// /* ================= TYPES ================= */

// interface BookingData {
//   routeId?: string;
//   sourceId?: string;
//   destinationId?: string;
// }

// interface ChatbotWidgetProps {
//   onBookingReady: (data: BookingData) => void;
// }

// /* ================= COMPONENT ================= */

// export default function ChatbotWidget({
//   onBookingReady,
// }: ChatbotWidgetProps): JSX.Element {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* ================= FLOATING CHATBOT BUTTON ================= */}
//       <button
//         aria-label="Open chatbot"
//         onClick={() => setOpen(true)}
//         style={{
//           width: "56px",
//           height: "56px",
//           borderRadius: "50%",
//           backgroundColor: "#2563eb",
//           color: "#fff",
//           fontSize: "24px",
//           border: "none",
//           cursor: "pointer",
//           boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
//         }}
//       >
//         🤖
//       </button>

//       {/* ================= CHATBOT WINDOW ================= */}
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "160px", // above voice button
//             right: "24px",
//             width: "360px",
//             maxHeight: "420px",
//             background: "white",
//             borderRadius: "16px",
//             boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
//             overflow: "hidden",
//             zIndex: 999999,
//           }}
//         >
//           <ChatbotWindow
//             onClose={() => setOpen(false)}
//             onBookingReady={onBookingReady}
//           />
//         </div>
//       )}
//     </>
//   );
// }


import { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotWidget({ onBookingReady }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          fontSize: 24,
        }}
      >
        🤖
      </button>

      {open && (
        <ChatbotWindow
          onClose={() => setOpen(false)}
          onBookingReady={onBookingReady}
        />
      )}
    </>
  );
}
