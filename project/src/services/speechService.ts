// project/src/services/speechService.ts
// export function startListening(onResult: (text: string) => void): void {
//   const SpeechRecognition =
//     (window as any).SpeechRecognition ||
//     (window as any).webkitSpeechRecognition;

//   const recognition = new SpeechRecognition();
//   recognition.lang = "en-IN";

//   recognition.onresult = (e: any) => {
//     onResult(e.results[0][0].transcript);
//   };

//   recognition.start();
// }

// export function speak(text: string): void {
//   const msg = new SpeechSynthesisUtterance(text);
//   window.speechSynthesis.speak(msg);
// }


export function startListening(onResult: (t: string) => void) {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  const rec = new SpeechRecognition();
  rec.lang = "en-IN";
  rec.onresult = (e: any) => onResult(e.results[0][0].transcript);
  rec.start();
}
