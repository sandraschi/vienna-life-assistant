export const API_BASE = "http://127.0.0.1:10922";
/** Relative API base — Vite proxies /api → backend (10922). */
export async function apiGet<T = unknown>(path: string): Promise<T> {
    const res = await fetch(path.startsWith('/') ? path : `/${path}`);
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

export const API = {
    health: '/health',
    capabilities: '/api/capabilities',
    fleetOverview: (probe = 0) => `/api/fleet/overview?probe=${probe}`,
    dashboard: '/api/dashboard',
    llmStatus: '/api/llm/status',
    llmProviders: '/api/llm/providers',
    llmModels: (opts: {
        provider?: string;
        base_url?: string;
        api_key?: string;
    } = {}) => {
        const q = new URLSearchParams();
        q.set('provider', opts.provider ?? 'ollama');
        if (opts.base_url) q.set('base_url', opts.base_url);
        if (opts.api_key) q.set('api_key', opts.api_key);
        return `/api/llm/models?${q.toString()}`;
    },
    llmChat: '/api/llm/chat',
    llmPreprompts: '/api/llm/preprompts',
    settings: '/api/settings',
    settingsLlm: '/api/settings/llm',
    skills: '/api/skills',
    skill: (name: string) => `/api/skills/${name}`,
    prompts: '/api/prompts',
    vienna: {
        coffee: '/api/vienna/coffee',
        music: '/api/vienna/music',
        museums: '/api/vienna/museums',
        transport: '/api/vienna/transport',
        shoppingOffers: '/api/vienna/shopping/offers',
    },
    life: {
        calendarToday: '/api/life/calendar/today',
        calendarWeek: '/api/life/calendar/week',
        expensesSummary: '/api/life/expenses/summary',
        expensesRecent: '/api/life/expenses/recent',
        travelUpcoming: '/api/life/travel/upcoming',
        travelPacking: '/api/life/travel/packing',
        brief: '/api/life/brief',
    },
} as const;
