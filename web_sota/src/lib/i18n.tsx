import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export type Lang = "en" | "de";

/** Phase 1: UI chrome EN/DE. Content (curated German essays) stays as-is — Phase 2. */
const dict: Record<Lang, Record<string, string>> = {
	en: {
		"nav.home": "Home",
		"nav.chat": "Chat",
		"nav.tools": "Tools",
		"nav.skills": "Skills",
		"nav.logs": "Logs",
		"nav.apps": "Apps",
		"nav.help": "Help",
		"nav.travel": "Travel",
		"nav.health": "Health",
		"nav.calendar": "Calendar",
		"nav.journal": "Journal",
		"nav.news": "News",
		"nav.notes": "Notes",
		"nav.email": "Email",
		"nav.contacts": "Contacts",
		"nav.household": "Household",
		"nav.expenses": "Expenses",
		"nav.medical": "Medical",
		"nav.diary": "Diary",
		"nav.travelplans": "Travel plans",
		"nav.finances": "Finances",
		"nav.group.personal": "Personal",
		"nav.coffee": "Coffee houses",
		"nav.restaurants": "Restaurants",
		"nav.culture": "Culture",
		"nav.concerts": "Concert Hall",
		"nav.museums": "Museums",
		"nav.shopping": "Shopping",
		"nav.living": "Living",
		"nav.history": "History",
		"nav.education": "Education",
		"nav.economy": "Economy",
		"nav.politics": "Politics",
		"nav.transport": "Transport",
		"nav.tower": "Control",
		"nav.fleet": "Fleet",
		"nav.services": "Services",
		"nav.crossconnects": "Crossconnects",
		"nav.goliath": "Goliath",
		"nav.settings": "Settings",
		"nav.group.fleet": "App",
		"nav.group.life": "Life",
		"nav.group.wien": "Wien",
		"nav.group.system": "System",
		"top.search": "Ask ViLife for help… (⌘K)",
		"top.ok": "All systems operational",
		"top.offline": "Backend offline",
		"dash.title": "Vienna Life",
		"dash.subtitle":
			"Your local layer for Vienna — transit, culture, coffee, and daily logistics. All data served from your own fleet, zero cloud dependence.",
		"dash.pulse": "Life Pulse",
		"dash.vienna": "Vienna Today",
		"dash.guide": "Vienna Guide",
		"dash.orf": "ORF Wien",
		"dash.stadt": "Stadt Wien",
		"dash.env": "Environment",
	},
	de: {
		"nav.home": "Start",
		"nav.chat": "Chat",
		"nav.tools": "Werkzeuge",
		"nav.skills": "Skills",
		"nav.logs": "Protokoll",
		"nav.apps": "Apps",
		"nav.help": "Hilfe",
		"nav.travel": "Reisen",
		"nav.health": "Gesundheit",
		"nav.calendar": "Kalender",
		"nav.journal": "Tagebuch",
		"nav.news": "Nachrichten",
		"nav.notes": "Notizen",
		"nav.email": "E-Mail",
		"nav.contacts": "Kontakte",
		"nav.household": "Haushalt",
		"nav.expenses": "Ausgaben",
		"nav.medical": "Medizin",
		"nav.diary": "Tagebuch",
		"nav.travelplans": "Reisepläne",
		"nav.finances": "Finanzen",
		"nav.group.personal": "Persönlich",
		"nav.coffee": "Kaffeehäuser",
		"nav.restaurants": "Restaurants",
		"nav.culture": "Kultur",
		"nav.concerts": "Konzerthaus",
		"nav.museums": "Museen",
		"nav.shopping": "Einkaufen",
		"nav.living": "Wohnen",
		"nav.history": "Geschichte",
		"nav.education": "Bildung",
		"nav.economy": "Wirtschaft",
		"nav.politics": "Politik",
		"nav.transport": "Verkehr",
		"nav.tower": "Steuerung",
		"nav.fleet": "Flotte",
		"nav.services": "Dienste",
		"nav.crossconnects": "Anbindungen",
		"nav.goliath": "Goliath",
		"nav.settings": "Einstellungen",
		"nav.group.fleet": "App",
		"nav.group.life": "Leben",
		"nav.group.wien": "Wien",
		"nav.group.system": "System",
		"top.search": "Frag ViLife … (⌘K)",
		"top.ok": "Alle Systeme aktiv",
		"top.offline": "Backend offline",
		"dash.title": "Vienna Life",
		"dash.subtitle":
			"Deine Wien-Schicht — Öffis, Kultur, Kaffee und Alltag. Alle Daten aus der eigenen Flotte, keine Cloud.",
		"dash.pulse": "Lebenszeichen",
		"dash.vienna": "Wien heute",
		"dash.guide": "Wien-Guide",
		"dash.orf": "ORF Wien",
		"dash.stadt": "Stadt Wien",
		"dash.env": "Umgebung",
	},
};

interface LangCtx {
	lang: Lang;
	setLang: (l: Lang) => void;
	t: (key: string) => string;
}

const Ctx = createContext<LangCtx>({
	lang: "en",
	setLang: () => {},
	t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [lang, setLangState] = useState<Lang>(() => {
		try {
			return (localStorage.getItem("vilife-lang") as Lang) || "en";
		} catch {
			return "en";
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem("vilife-lang", lang);
		} catch {
			/* ignore */
		}
	}, [lang]);

	const setLang = useCallback((l: Lang) => setLangState(l), []);
	const t = useCallback(
		(key: string) => dict[lang][key] ?? dict.en[key] ?? key,
		[lang],
	);

	return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
	return useContext(Ctx);
}
