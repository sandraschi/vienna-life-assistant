import { useEffect, useState } from 'react';
import { ScrollText, RefreshCw } from 'lucide-react';
import { API, apiGet } from '../lib/api';

type LogLine = { ts: string; level: string; msg: string };

export default function Logs() {
    const [lines, setLines] = useState<LogLine[]>([]);

    const refresh = async () => {
        try {
            const h = await apiGet<{ status: string; version: string }>(API.health);
            setLines([
                { ts: new Date().toISOString(), level: 'INFO', msg: `Backend ${h.status} v${h.version}` },
                { ts: new Date().toISOString(), level: 'INFO', msg: 'ViLife web_sota — fleet-standard logs page (ring buffer Phase 2)' },
            ]);
        } catch (e) {
            setLines([{ ts: new Date().toISOString(), level: 'ERROR', msg: String(e) }]);
        }
    };

    useEffect(() => { void refresh(); }, []);

    return (
        <div className="space-y-8 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Event Logs</h1>
                    <p className="text-slate-500 mt-2 text-sm">Live tail wiring planned — health probe for now</p>
                </div>
                <button onClick={() => void refresh()} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>
            <div className="glass-card p-6 font-mono text-xs space-y-2 max-h-[60vh] overflow-y-auto">
                {lines.map((l, i) => (
                    <div key={i} className="flex gap-4 text-slate-400">
                        <ScrollText className="w-4 h-4 shrink-0 opacity-40" />
                        <span className="text-slate-600">{l.ts}</span>
                        <span className={l.level === 'ERROR' ? 'text-red-400' : 'text-emerald-400'}>{l.level}</span>
                        <span className="text-slate-300">{l.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
