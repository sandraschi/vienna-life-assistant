import { useState, useEffect } from 'react';
import { 
    Coffee, 
    Heart, 
    Clock, 
    MapPin, 
    Info,
    CheckCircle2,
    Palette
} from 'lucide-react';

interface CoffeeHouse {
    name: string;
    status: string;
    highlight: string;
    is_favorite?: boolean;
    is_aida?: boolean;
}

export default function KaffeehausHub() {
    const [cafes, setCafes] = useState<CoffeeHouse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:10922/api/vienna/coffee')
            .then(res => res.json())
            .then(data => {
                setCafes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-white">Loading the Melange...</div>;

    return (
        <div className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Kaffeehaus Hub</h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-tight">The heartbeat of Vienna. From the 1st to the 9th District.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
                    <div className="px-4 py-2 rounded-xl bg-cosmos-600 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        Live Status
                    </div>
                    <div className="px-4 py-2 text-slate-400 text-xs font-bold uppercase tracking-widest border border-transparent hover:text-white transition-colors cursor-pointer">
                        Favorites Only
                    </div>
                </div>
            </div>

            {/* Featured Favorite: Cafe Berg */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 relative group overflow-hidden rounded-[2.5rem] border border-white/[0.1] bg-gradient-to-br from-slate-900 via-[#050505] to-slate-900 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=2000&auto=format&fit=crop')] opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                    
                    <div className="relative p-10 h-full flex flex-col justify-end min-h-[400px]">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30">Sandra's High-Level Choice</span>
                        </div>
                        <h2 className="text-6xl font-black text-white tracking-tighter uppercase mb-4 group-hover:translate-x-2 transition-transform duration-500">Café Berg</h2>
                        <p className="text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">Berggasse 8. The cultural anchor of Alsergrund. Perfect balance of history and modernized intellectual vibe.</p>
                        
                        <div className="flex flex-wrap gap-6 mt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white">
                                    <Coffee className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Recommended</p>
                                    <p className="text-sm font-bold text-white uppercase italic">Wiener Melange + Berg-Torte</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Atmosphere</p>
                                    <p className="text-sm font-bold text-white uppercase italic">Intellectual / Vibrant</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Melange of the Day Widget */}
                <div className="glass-card p-10 flex flex-col justify-center items-center text-center border-cosmos-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cosmos-500/10 blur-[60px] rounded-full"></div>
                    <div className="p-5 rounded-3xl bg-cosmos-500/10 text-cosmos-500 mb-8 border border-cosmos-500/20">
                        <Palette className="w-10 h-10" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-cosmos-400 mb-4">Melange of the Day</h3>
                    <p className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4 italic">The Alsergrund Gold</p>
                    <p className="text-sm text-slate-400 leading-relaxed italic mb-8 px-4">"A double-shot espresso with steamed milk and a signature Berg-style foam architecture."</p>
                    <button className="w-full py-4 rounded-2xl bg-cosmos-600 hover:bg-cosmos-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-cosmos-500/20 mt-4">
                        Remind to try
                    </button>
                </div>
            </div>

            {/* Grid of Other Cafes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cafes.map((cafe) => (
                    <div 
                        key={cafe.name} 
                        className={`glass-card p-6 group transition-all duration-300 relative border-l-4 ${
                            cafe.is_aida ? 'border-l-[#E89AB0] hover:bg-[#E89AB0]/[0.02]' : 
                            cafe.is_favorite ? 'border-l-emerald-500 hover:bg-emerald-500/[0.02]' : 
                            'border-l-slate-800 hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${
                                cafe.is_aida ? "bg-[#E89AB0]/10 text-[#E89AB0]" : 
                                cafe.is_favorite ? "bg-emerald-500/10 text-emerald-500" :
                                "bg-white/[0.03] text-slate-400"
                            }`}>
                                <Coffee className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                                    cafe.status === 'Crowded' ? 'bg-red-500/10 text-red-500' : 
                                    cafe.status === 'Busy' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                    {cafe.status}
                                </span>
                                {cafe.is_aida && (
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-[#E89AB0]/20 text-[#E89AB0] border border-[#E89AB0]/30 animate-pulse">AIDA Special</span>
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                            {cafe.name}
                            {cafe.is_favorite && <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500 animate-pulse" />}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mb-6 uppercase italic leading-snug">{cafe.highlight}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-600" />
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{cafe.is_favorite ? "ALSERGRUND" : "INNER CITY"}</span>
                            </div>
                            <button title="Café details" className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all">
                                <Info className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
