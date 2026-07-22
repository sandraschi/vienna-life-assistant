import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '../lib/api';
import { ScrollText, RefreshCw, Download, Trash2 } from 'lucide-react';

type LogEntry = {
    id: string;
    timestamp: string;
    level: string;
    kind: string;
    detail: string;
};

type LogResponse = {
    entries: LogEntry[];
    total: number;
    max_entries: number;
};

export default function Logs() {
    const [data, setData] = useState<LogResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState('');
    const [search, setSearch] = useState('');

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: '100', sort: 'desc' });
            if (level) params.set('level', level);
            if (search.trim()) params.set('search', search.trim());
            const r = await fetch(API_BASE + `/api/logs?${params}`);
            setData((await r.json()) as LogResponse);
        } catch (e) {
            setData({ entries: [{ id: '0', timestamp: new Date().toISOString(), level: 'ERROR', kind: 'client', detail: String(e) }], total: 1, max_entries: 2000 });
        } finally {
            setLoading(false);
        }
    }, [level, search]);

    useEffect(() => { void refresh(); }, [refresh]);

    const exportLogs = async () => {
        const r = await fetch(API_BASE + '/api/logs/export?format=json');
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vilife-logs.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearLogs = async () => {
        await fetch(API_BASE + '/api/logs', { method: 'DELETE' });
        await refresh();
    };

    return (
        <div className="space-y-8 page-enter">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Event Logs</h1>
                    <p className="text-slate-500 mt-2 text-sm">Fleet ring buffer at /api/logs</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => void refresh()} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]" title="Refresh">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => void exportLogs()} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]" title="Export JSON">
                        <Download className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => void clearLogs()} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]" title="Clear buffer">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
                <label className="text-sm text-slate-400 flex items-center gap-2">
                    Level
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-sm">
                        <option value="">All</option>
                        <option value="INFO">INFO</option>
                        <option value="WARNING">WARNING</option>
                        <option value="ERROR">ERROR</option>
                    </select>
                </label>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="flex-1 min-w-[180px] bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
            </div>

            {data && (
                <p className="text-sm text-slate-500">{data.total} entries (max {data.max_entries})</p>
            )}

            <div className="glass-card p-6 font-mono text-sm space-y-2 max-h-[60vh] overflow-y-auto">
                {loading ? (
                    <div className="text-slate-500">Loading…</div>
                ) : (
                    data?.entries.map((l) => (
                        <div key={l.id} className="flex gap-4 text-slate-400 flex-wrap">
                            <ScrollText className="w-4 h-4 shrink-0 opacity-40" />
                            <span className="text-slate-600">{l.timestamp}</span>
                            <span className={l.level === 'ERROR' ? 'text-red-400' : 'text-emerald-400'}>{l.level}</span>
                            <span className="text-slate-500">{l.kind}</span>
                            <span className="text-slate-300">{l.detail}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
