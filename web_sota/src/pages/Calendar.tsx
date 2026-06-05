import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Loader2 } from 'lucide-react';
import { API, apiGet } from '../lib/api';

type Event = {
    id: string;
    date?: string;
    time: string;
    title: string;
    location: string;
    category: string;
};

export default function Calendar() {
    const [today, setToday] = useState<Event[]>([]);
    const [week, setWeek] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'today' | 'week'>('today');

    useEffect(() => {
        Promise.all([
            apiGet<{ events: Event[] }>(API.life.calendarToday),
            apiGet<{ events: Event[] }>(API.life.calendarWeek),
        ])
            .then(([t, w]) => {
                setToday(t.events || []);
                setWeek(w.events || []);
            })
            .catch(() => {
                setToday([]);
                setWeek([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const events = tab === 'today' ? today : week;

    if (loading) {
        return <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />;
    }

    return (
        <div className="space-y-8 page-enter">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Calendar</h1>
                    <p className="text-slate-500 mt-2 text-sm">Today and week ahead — Alsergrund grid</p>
                </div>
                <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
                    {(['today', 'week'] as const).map((k) => (
                        <button
                            key={k}
                            type="button"
                            onClick={() => setTab(k)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                                tab === k ? 'bg-cosmos-500 text-white' : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="px-8 py-5 border-b border-white/[0.06] flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-cosmos-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {events.length} events
                    </span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {events.map((ev) => (
                        <div key={ev.id} className="px-8 py-6 hover:bg-white/[0.02] transition-colors flex gap-6">
                            <div className="w-20 shrink-0">
                                <p className="text-lg font-black text-white tabular-nums">{ev.time}</p>
                                {ev.date && (
                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                                        {ev.date}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-white uppercase tracking-tight">{ev.title}</p>
                                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-2 uppercase font-bold">
                                    <MapPin className="w-3 h-3" />
                                    {ev.location}
                                </p>
                            </div>
                            <span className="text-[9px] font-black text-cosmos-400 uppercase tracking-widest self-center">
                                {ev.category}
                            </span>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <p className="px-8 py-12 text-slate-600 text-sm uppercase tracking-widest">No events</p>
                    )}
                </div>
            </div>

            <p className="text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Source: GET /api/life/calendar — MCP vienna_life(operation=calendar_today)
            </p>
        </div>
    );
}
