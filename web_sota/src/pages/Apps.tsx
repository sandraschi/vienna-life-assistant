import { useEffect, useState } from 'react';
import { ExternalLink, Grid3X3, Loader2 } from 'lucide-react';
import { API, apiGet } from '../lib/api';

type Ship = {
    id: string;
    name: string;
    frontend_port: number;
    url: string | null;
    status: string;
};

type Overview = { ships: Ship[] };

export default function Apps() {
    const [ships, setShips] = useState<Ship[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet<Overview>(API.fleetOverview(0))
            .then((d) => setShips(d.ships.filter((s) => s.frontend_port > 0)))
            .catch(() => setShips([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8 page-enter">
            <div>
                <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Apps Hub</h1>
                <p className="text-slate-500 mt-2 text-sm">Fleet webapps from registry — one click to L2 destroyers</p>
            </div>
            {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-cosmos-400 mx-auto" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {ships.slice(0, 24).map((s) => (
                        <a
                            key={s.id}
                            href={s.url ?? `http://127.0.0.1:${s.frontend_port}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-card p-6 hover:border-cosmos-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <Grid3X3 className="w-5 h-5 text-cosmos-400" />
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60" />
                            </div>
                            <h3 className="font-black text-white mt-4 text-sm uppercase tracking-widest">{s.name}</h3>
                            <p className="text-[10px] text-slate-500 mt-2">:{s.frontend_port} · {s.status}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
