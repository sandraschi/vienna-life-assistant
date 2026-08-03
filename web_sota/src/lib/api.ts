export const API_BASE = "http://127.0.0.1:10922";
/** Relative API base — Vite proxies /api → backend (10922). */
export async function apiGet<T = unknown>(path: string): Promise<T> {
	const res = await fetch(path.startsWith("/") ? path : `/${path}`);
	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}

export async function apiSend<T = unknown>(
	path: string,
	method: "POST" | "PUT" | "DELETE",
	body?: unknown,
): Promise<T> {
	const res = await fetch(path.startsWith("/") ? path : `/${path}`, {
		method,
		headers:
			body !== undefined ? { "Content-Type": "application/json" } : undefined,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}

export const apiPost = <T = unknown>(path: string, body?: unknown) =>
	apiSend<T>(path, "POST", body);
export const apiPut = <T = unknown>(path: string, body?: unknown) =>
	apiSend<T>(path, "PUT", body);
export const apiDelete = <T = unknown>(path: string) =>
	apiSend<T>(path, "DELETE");

export const API = {
	health: "/health",
	capabilities: "/api/capabilities",
	fleetOverview: (probe = 0) => `/api/fleet/overview?probe=${probe}`,
	dashboard: "/api/dashboard",
	llmStatus: "/api/llm/status",
	llmProviders: "/api/llm/providers",
	llmModels: (
		opts: { provider?: string; base_url?: string; api_key?: string } = {},
	) => {
		const q = new URLSearchParams();
		q.set("provider", opts.provider ?? "ollama");
		if (opts.base_url) q.set("base_url", opts.base_url);
		if (opts.api_key) q.set("api_key", opts.api_key);
		return `/api/llm/models?${q.toString()}`;
	},
	llmChat: "/api/llm/chat",
	llmPreprompts: "/api/llm/preprompts",
	settings: "/api/settings",
	settingsLlm: "/api/settings/llm",
	skills: "/api/skills",
	skill: (name: string) => `/api/skills/${name}`,
	prompts: "/api/prompts",
	vienna: {
		coffee: "/api/vienna/coffee",
		music: "/api/vienna/music",
		museums: "/api/vienna/museums",
		transport: "/api/vienna/transport",
		shoppingOffers: "/api/vienna/shopping/offers",
		news: "/api/vienna/news",
		press: "/api/vienna/press",
	},
	life: {
		calendarToday: "/api/life/calendar/today",
		calendarWeek: "/api/life/calendar/week",
		expensesSummary: "/api/life/expenses/summary",
		expensesRecent: "/api/life/expenses/recent",
		travelUpcoming: "/api/life/travel/upcoming",
		travelPacking: "/api/life/travel/packing",
		brief: "/api/life/brief",
		overview: "/api/life/overview",
		calendar: "/api/life/calendar",
		todos: "/api/life/todos",
		expenses: "/api/life/expenses",
		visits: "/api/life/health/visits",
		conditions: "/api/life/health/conditions",
		medications: "/api/life/health/medications",
		vitals: "/api/life/health/vitals",
		trips: "/api/life/travel/trips",
		packing: "/api/life/travel/packing",
		documents: "/api/life/travel/documents",
		contacts: "/api/life/contacts",
		pet: "/api/life/pet",
		subscriptions: "/api/life/subscriptions",
		homeTasks: "/api/life/home-tasks",
	},
} as const;
