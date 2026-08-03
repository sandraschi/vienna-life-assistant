/** Strip markdown to plain text for TTS. */
export function stripMarkdown(md: string): string {
	return md
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[*_`#~>]/g, "")
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/\n+/g, " ")
		.trim();
}

export function speak(text: string, onEnd?: () => void): () => void {
	if (typeof window === "undefined" || !window.speechSynthesis) return () => {};
	const plain = stripMarkdown(text);
	if (!plain) return () => {};
	window.speechSynthesis.cancel();
	const u = new SpeechSynthesisUtterance(plain);
	u.rate = 1;
	u.pitch = 1;
	if (onEnd) u.onend = onEnd;
	window.speechSynthesis.speak(u);
	return () => window.speechSynthesis.cancel();
}

export function isTTSSupported(): boolean {
	return typeof window !== "undefined" && !!window.speechSynthesis;
}

interface SpeechRecognitionEvent extends Event {
	resultIndex: number;
	results: SpeechRecognitionResultList;
}
interface SpeechRecognition extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	onresult: (event: SpeechRecognitionEvent) => void;
	onend: () => void;
	onerror: (event: Event) => void;
	start: () => void;
	stop: () => void;
	abort: () => void;
}
interface SpeechRecognitionConstructor {
	new (): SpeechRecognition;
}
declare global {
	interface Window {
		SpeechRecognition?: SpeechRecognitionConstructor;
		webkitSpeechRecognition?: SpeechRecognitionConstructor;
	}
}

const SpeechRecognitionAPI =
	typeof window !== "undefined" &&
	(window.SpeechRecognition || window.webkitSpeechRecognition);

export function isSTTSupported(): boolean {
	return !!SpeechRecognitionAPI;
}

export function createSpeechRecognition(
	onResult: (transcript: string, isFinal: boolean) => void,
	onEnd: () => void,
): { start: () => void; stop: () => void } {
	if (!SpeechRecognitionAPI) return { start: () => {}, stop: () => {} };
	const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = navigator.language || "en-US";
	recognition.onresult = (e: SpeechRecognitionEvent) => {
		let transcript = "";
		for (let i = e.resultIndex; i < e.results.length; i++) {
			transcript += e.results[i][0].transcript;
		}
		onResult(transcript, e.results[e.results.length - 1].isFinal);
	};
	recognition.onend = onEnd;
	recognition.onerror = () => onEnd();
	return {
		start: () => {
			try {
				recognition.start();
			} catch {
				onEnd();
			}
		},
		stop: () => {
			try {
				recognition.abort();
			} catch {
				/* noop */
			}
			onEnd();
		},
	};
}
