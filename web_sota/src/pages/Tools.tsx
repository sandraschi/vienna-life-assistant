import { useEffect, useState } from 'react';
import { Wrench, Loader2, AlertCircle } from 'lucide-react';
import { API, apiGet } from '../lib/api';

type Capabilities = {
    status: string;
    server: { name: string; version: string };
    tool_surface: {
        portmanteau_tools: string[];
        atomic_tools: string[];
        total: number;
    };
    features: Record<string, boolean>;
};

export default function Tools() {
    const [caps, setCaps] = useState<Capabilities | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet<Capabilities>(API.capabilities)
            .then(setCaps)
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const tools = caps
        ? [...caps.tool_surface.portmanteau_tools, ...caps.tool_surface.atomic_tools]
        : [];

    return (
        <div className="space-y-8 page-enter">
            <div>
                <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">MCP Tools</h1>
                <p className="text-slate-500 mt-2 text-sm">ViLife agent surface — mounted at <code className="text-cosmos-400">/mcp</code></p>
            </div>

            {loading && (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
                </div>
            )}
            {error && (
                <div className="glass-card p-6 flex items-center gap-3 text-amber-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}
            {caps && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((name) => (
                        <div key={name} className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Wrench className="w-5 h-5 text-cosmos-400" />
                                <h3 className="font-black text-white text-sm uppercase tracking-widest">{name}</h3>
                            </div>
                            <p className="text-xs text-slate-500">
                                {name === 'vienna_life' ? 'Life admin portmanteau (calendar, todos, brief)' : 'Legacy stdio tool'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
