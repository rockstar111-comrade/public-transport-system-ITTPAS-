// project/src/components/chatbot/VoiceInputButton.tsx
interface Props {
  onResult: (text: string) => void;
}

import { startListening } from "../../services/speechService";

export default function VoiceInputButton({ onResult }: Props): JSX.Element {
  return (
    <button onClick={() => startListening(onResult)} aria-label="Voice input">
      🎤
    </button>
  );
}
