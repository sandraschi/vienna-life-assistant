import { Volume2 } from "lucide-react";
import { useState } from "react";
import { isTTSSupported, speak } from "../common/speech";

export function SpeakButton({ text }: { text: string }) {
	const [speaking, setSpeaking] = useState(false);
	if (!isTTSSupported()) return null;
	return (
		<button
			type="button"
			onClick={() => {
				if (speaking) {
					window.speechSynthesis.cancel();
					setSpeaking(false);
					return;
				}
				setSpeaking(true);
				speak(text, () => setSpeaking(false));
			}}
			className={`p-1.5 rounded transition-colors ${speaking ? "text-cosmos-400" : "text-slate-300 hover:text-white"}`}
			title={speaking ? "Stop" : "Speak"}
		>
			<Volume2 className="h-3.5 w-3.5" />
		</button>
	);
}
