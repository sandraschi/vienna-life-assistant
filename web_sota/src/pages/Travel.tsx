import { useEffect, useState } from 'react';
import { Plane, Train, Loader2, MapPin, CheckCircle2, Circle } from 'lucide-react';
import { API, apiGet } from '../lib/api';

type Trip = {
    id: string;
    title: string;
    date_start: string;
    date_end: string;
    mode: string;
    carrier: string;
    from: string;
    to: string;
    status: string;
    ref: string | null;
};

type PackItem = { item: string; done: string };

const statusColor: Record<string, string> = {
    booked: 'text-emerald-400',
    planned: 'text-amber-400',
    watchlist: 'text-slate-500',
};

export default function Travel() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [packing, setPacking] = useState<PackItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiGet<{ trips: Trip[] }>(API.life.travelUpcoming),
            apiGet<{ items: PackItem[] }>(API.life.travelPacking),
        ])
            .then(([t, p]) => {
                setTrips(t.trips || []);
                setPacking(p.items || []);
            })
            .catch(() => {
                setTrips([]);
                setPacking([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />;
    }

    return (
        <div className="space-y-8 page-enter">
            <div>
                <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Travel</h1>
                <p className="text-slate-500 mt-2 text-sm">ÖBB, flights, packing — from Vienna Hbf</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {trips.map((trip) => (
                        <div key={trip.id} className="glass-card p-8 flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                                {trip.mode === 'flight' ? (
                                    <Plane className="w-6 h-6 text-cosmos-400" />
                                ) : (
                                    <Train className="w-6 h-6 text-emerald-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-black text-white uppercase tracking-tight">{trip.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold">
                                            {trip.date_start} → {trip.date_end}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${statusColor[trip.status] || 'text-slate-500'}`}>
                                        {trip.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {trip.carrier}: {trip.from} → {trip.to}
                                </p>
                                {trip.ref && (
                                    <p className="text-[10px] text-cosmos-400 mt-2 font-mono">Ref {trip.ref}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-card p-8 space-y-4 h-fit">
                    <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Packing list</h2>
                    {packing.map((item) => (
                        <div key={item.item} className="flex items-center gap-3 text-sm">
                            {item.done === 'yes' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                            <span className={item.done === 'yes' ? 'text-slate-500 line-through' : 'text-slate-300'}>
                                {item.item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
