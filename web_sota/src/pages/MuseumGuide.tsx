import React, { useState, useEffect } from 'react';
import { 
    Palette, 
    Calendar as CalendarIcon, 
    MapPin, 
    Info, 
    ArrowRight, 
    Sparkles,
    Eye,
    Landmark
} from 'lucide-react';

interface Exhibition {
    museum: string;
    title: string;
    dates: string;
    image?: string;
}

export default function MuseumGuide() {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:10922/api/vienna/museums')
            .then(res => res.json())
            .then(data => {
                setExhibitions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-white">Curating the collections...</div>;

    return (
        <div className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Museum Guide</h1>
                    <p className="text-slate-500 font-medium tracking-tight uppercase flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-cosmos-400" />
                        From the Imperial Collections to Modernism
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-[10px] font-black uppercase tracking-widest border border-white/[0.1] transition-all">
                        MuseumsQuartier (MQ)
                    </button>
                    <button className="px-5 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-[10px] font-black uppercase tracking-widest border border-white/[0.1] transition-all">
                        Inner City
                    </button>
                </div>
            </div>

            {/* Featured Highlight: The Belvedere */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/[0.1] bg-[#0A0A0A] aspect-[16/10] lg:aspect-auto">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=2000&auto=format&fit=crop')] opacity-20 group-hover:scale-105 transition-all duration-1000"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                    
                    <div className="relative p-10 h-full flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-4">
                            <Landmark className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Cultural Beacon</span>
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">Belvedere</h2>
                        <p className="text-lg text-slate-300 max-w-lg leading-relaxed italic mb-8">The most famous kiss in the world. Experience Gustav Klimt's masterpieces in the imperial Baroque palace.</p>
                        
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5" />
                                Interactive Tour
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="glass-card p-10 flex-1 relative overflow-hidden group border-indigo-500/20 hover:border-indigo-500/40">
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all"></div>
                        <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-8 border border-indigo-500/20 w-fit">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-4">Albertina Modern</h3>
                        <p className="text-sm text-slate-400 leading-relaxed italic pr-12 mb-8">Experience the pulse of contemporary Vienna. From post-war masterpieces to SOTA digital art.</p>
                        <button className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-all">
                            Current Program <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 flex-1">
                        <div className="glass-card p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors border-rose-500/10 hover:border-rose-500/30">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Museums Quartier</h4>
                            <p className="text-xl font-black text-white leading-none uppercase tracking-tighter mb-4">Mumok</p>
                            <p className="text-[10px] text-slate-400 italic">"The dark stone monolith of modern art."</p>
                        </div>
                        <div className="glass-card p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors border-amber-500/10 hover:border-amber-500/30">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Museums Quartier</h4>
                            <p className="text-xl font-black text-white leading-none uppercase tracking-tighter mb-4">Leopold</p>
                            <p className="text-[10px] text-slate-400 italic">"Schiele and Klimt at their peaks."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid of Exhibitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {exhibitions.map((ex) => (
                    <div key={`${ex.museum}-${ex.title}`} className="glass-card p-6 group hover:translate-y-[-4px] transition-all duration-300 border-white/[0.06] hover:border-white/20">
                        <div className="flex justify-between items-start mb-8">
                            <div className="p-3 rounded-xl bg-white/[0.03] text-slate-400 group-hover:text-cosmos-400 transition-colors border border-white/[0.08]">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1.5 rounded-full bg-white/[0.05] text-slate-500 border border-white/[0.08]">Exhibition</span>
                        </div>

                        <div className="space-y-1.5 mb-8">
                            <h4 className="text-[10px] font-black text-cosmos-400 uppercase tracking-widest">{ex.museum}</h4>
                            <p className="text-lg font-black text-white uppercase tracking-tighter leading-snug">{ex.title}</p>
                        </div>

                        <div className="pt-6 border-t border-white/[0.04] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5 text-slate-600" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{ex.dates}</span>
                            </div>
                            <button className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all">
                                <Info className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
