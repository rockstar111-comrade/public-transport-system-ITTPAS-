// project/src/components/chatbot/MessageBubble.tsx
interface Props {
  from: "user" | "bot";
  text: string;
}

export default function MessageBubble({ from, text }: Props): JSX.Element {
  return <div className={`message ${from}`}>{text}</div>;
}
