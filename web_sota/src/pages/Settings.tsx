import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { API, apiGet } from '../lib/api';

type Capabilities = {
    server: { name: string; version: string; fastmcp?: string };
    features: Record<string, boolean>;
    runtime: { transport: string; surface_mode: string };
};

export default function Settings() {
    const [caps, setCaps] = useState<Capabilities | null>(null);

    useEffect(() => {
        apiGet<Capabilities>(API.capabilities).then(setCaps).catch(() => setCaps(null));
    }, []);

    return (
        <div className="space-y-8 page-enter max-w-2xl">
            <div>
                <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Settings</h1>
                <p className="text-slate-500 mt-2 text-sm">Runtime capabilities from backend introspection</p>
            </div>
            {!caps ? (
                <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
            ) : (
                <div className="glass-card p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="w-6 h-6 text-cosmos-400" />
                        <div>
                            <p className="font-black text-white uppercase tracking-widest text-sm">{caps.server.name}</p>
                            <p className="text-xs text-slate-500">v{caps.server.version} · {caps.server.fastmcp ?? 'FastMCP'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        {Object.entries(caps.features).map(([k, v]) => (
                            <div key={k} className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                <span className="text-slate-500 uppercase tracking-widest">{k}</span>
                                <span className={v ? 'text-emerald-400' : 'text-slate-600'}>{v ? 'on' : 'off'}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-600">
                        Transport: {caps.runtime.transport} · Surface: {caps.runtime.surface_mode}
                    </p>
                </div>
            )}
        </div>
    );
}
