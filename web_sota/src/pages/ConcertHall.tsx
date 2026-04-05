import { useState, useEffect } from 'react';
import { 
    Music, 
    Ticket, 
    PlayCircle,
    ArrowRight,
    CircleDot,
    Clock
} from 'lucide-react';

interface Concert {
    venue: string;
    performance: string;
    time: string;
    tickets: string;
}

export default function ConcertHall() {
    const [concerts, setConcerts] = useState<Concert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:10922/api/vienna/music')
            .then(res => res.json())
            .then(data => {
                setConcerts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-white">Tuning the orchestra...</div>;

    return (
        <div className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Concert Hall</h1>
                    <p className="text-slate-500 font-medium tracking-tight uppercase flex items-center gap-2">
                        <CircleDot className="w-3 h-3 text-emerald-500 fill-emerald-500 animate-pulse" />
                        Tonight in the World's Music Capital
                    </p>
                </div>
                <div className="group relative flex items-center bg-white/[0.03] p-1.5 rounded-3xl border border-white/[0.08] hover:border-cosmos-500/30 transition-all cursor-pointer">
                    <div className="flex -space-x-3 px-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center">
                                <Music className="w-3.5 h-3.5 text-cosmos-400" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest pl-4 pr-6 text-slate-400 group-hover:text-white transition-colors">3 Exclusive Highlights</span>
                </div>
            </div>

            {/* Featured Venue: Musikverein */}
            <div className="relative group overflow-hidden rounded-[3rem] border border-white/[0.1] bg-[#0A0A0A]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514320297442-701262d59663?q=80&w=2000&auto=format&fit=crop')] opacity-10 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent"></div>
                
                <div className="relative p-12 lg:p-16 h-full flex flex-col justify-end min-h-[500px]">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-4 py-1 rounded-full bg-cosmos-500/20 text-cosmos-400 text-[10px] font-black uppercase tracking-[0.3em] border border-cosmos-500/30">Masterpiece Tonight</span>
                    </div>
                    <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none mb-6">Musikverein</h2>
                    <p className="text-2xl text-slate-300 max-w-2xl leading-relaxed italic mb-10">Experience the world's finest acoustics in the Golden Hall. Tonight, Vivaldi's masterpiece returns home.</p>
                    
                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                            <Ticket className="w-4 h-4" />
                            Secure Standplatz
                        </button>
                        <button className="px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-black uppercase tracking-widest border border-white/[0.1] transition-all flex items-center gap-3">
                            <PlayCircle className="w-4 h-4" />
                            Listen Preview
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {concerts.map((concert) => (
                    <div key={concert.venue} className="glass-card p-8 group hover:translate-y-[-4px] transition-all duration-300 border-cosmos-500/10 hover:border-cosmos-500/40">
                        <div className="flex justify-between items-start mb-10">
                            <div className="p-4 rounded-2xl bg-cosmos-500/10 text-cosmos-500 border border-cosmos-500/20">
                                <Music className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                                concert.tickets === 'Sold Out' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                concert.tickets === 'Last Few' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                                {concert.tickets}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-black text-cosmos-400 uppercase tracking-widest">{concert.venue}</h3>
                            <p className="text-2xl font-black text-white uppercase tracking-tighter leading-snug group-hover:text-cosmos-300 transition-colors">{concert.performance}</p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/[0.06] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-bold text-white italic">{concert.time}</span>
                            </div>
                            <button title="View details" className="p-3 rounded-xl bg-white/[0.03] hover:bg-cosmos-500/10 text-slate-500 hover:text-cosmos-400 transition-all border border-transparent hover:border-cosmos-500/20">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
