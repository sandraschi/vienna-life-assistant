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
    vienna: {
        coffee: '/api/vienna/coffee',
        music: '/api/vienna/music',
        museums: '/api/vienna/museums',
        transport: '/api/vienna/transport',
        shoppingOffers: '/api/vienna/shopping/offers',
    },
} as const;
