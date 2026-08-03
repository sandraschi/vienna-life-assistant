import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createSpeechRecognition, isSTTSupported } from "../common/speech";

export function MicButton({
	onTranscript,
}: {
	onTranscript: (text: string) => void;
}) {
	const [listening, setListening] = useState(false);
	const recognitionRef = useRef<ReturnType<
		typeof createSpeechRecognition
	> | null>(null);

	useEffect(() => {
		if (!isSTTSupported()) return;
		recognitionRef.current = createSpeechRecognition(
			(transcript, isFinal) => {
				if (isFinal) {
					onTranscript(transcript);
				}
			},
			() => setListening(false),
		);
		return () => {
			recognitionRef.current?.stop();
		};
	}, [onTranscript]);

	if (!isSTTSupported()) return null;

	return (
		<button
			type="button"
			onClick={() => {
				if (!recognitionRef.current) return;
				if (listening) {
					recognitionRef.current.stop();
				} else {
					recognitionRef.current.start();
					setListening(true);
				}
			}}
			className={`p-3 rounded-2xl transition-colors shrink-0 ${
				listening
					? "bg-red-500/20 text-red-400 border border-red-500/40"
					: "bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white"
			}`}
			title={listening ? "Stop listening" : "Voice input"}
			data-testid="chat-mic"
		>
			{listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
		</button>
	);
}
