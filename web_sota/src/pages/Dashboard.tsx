import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Calendar as CalendarIcon,
    ShoppingBag,
    CreditCard,
    Plus,
    ArrowRight,
    Coffee,
    Music,
    Palette,
    Zap,
    MapPin,
    AlertCircle
} from 'lucide-react';
import TransitWidget from '../components/TransitWidget';

export default function Dashboard() {
    const [viennaToday, setViennaToday] = useState<any>(null);

    useEffect(() => {
        const fetchViennaToday = async () => {
            try {
                const [coffee, music, museums] = await Promise.all([
                    fetch('http://localhost:10922/api/vienna/coffee').then(r => r.json()),
                    fetch('http://localhost:10922/api/vienna/music').then(r => r.json()),
                    fetch('http://localhost:10922/api/vienna/museums').then(r => r.json())
                ]);
                setViennaToday({ coffee, music, museums });
            } catch (error) {
                console.error("Failed to fetch Vienna Today data", error);
            }
        };
        fetchViennaToday();
    }, []);

    const stats = [
        { title: 'Total Budget', value: '€4,250', change: '+12%', icon: CreditCard, color: 'text-emerald-400' },
        { title: 'Shopping Items', value: '18', change: '5 urgent', icon: ShoppingBag, color: 'text-amber-400' },
        { title: 'Upcoming Events', value: '3 today', change: 'Next in 2h', icon: CalendarIcon, color: 'text-cosmos-400' },
        { title: 'Total Expenses', value: '€1,820', change: '-4% vs last month', icon: TrendingUp, color: 'text-blue-400' },
    ];

    return (
        <div className="space-y-12 page-enter">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.04]">
                <div>
                    <h1 className="text-5xl font-black gradient-text tracking-tighter uppercase italic leading-none">Status Overview</h1>
                    <p className="text-slate-500 mt-3 font-medium tracking-tight uppercase flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cosmos-500" />
                        Guten Morgen, Sandra. Alsergrund Grid is Optimal.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95">
                        <Plus className="w-4 h-4" />
                        <span>Quick Entry</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <div key={stat.title} className="glass-card p-8 group hover:border-white/20 transition-all cursor-pointer relative overflow-hidden">
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.change}</span>
                        </div>
                        <div className="mt-8 relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Transit Widget Integration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TransitWidget />
                        
                        {/* Vienna Life Highlights */}
                        <div className="glass-card p-8 flex flex-col space-y-6 border-cosmos-500/10 hover:border-cosmos-500/30 transition-all">
                            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                                <h3 className="font-black text-xs tracking-[0.3em] uppercase text-white italic">Vienna Life Today</h3>
                                <ArrowRight className="w-4 h-4 text-slate-600" />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-cosmos-500/10 text-cosmos-500 border border-cosmos-500/20 flex items-center justify-center group-hover:scale-110 transition-all">
                                        <Music className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Musikverein</p>
                                        <p className="text-xs font-bold text-white uppercase truncate">Vivaldi: The Four Seasons</p>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500">LAST FEW</span>
                                </div>

                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-all">
                                        <Coffee className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Favorite Spot</p>
                                        <p className="text-xs font-bold text-white uppercase">Café Berg - Berggasse 8</p>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500">OPTIMAL</span>
                                </div>

                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-all">
                                        <Palette className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Leopold Museum</p>
                                        <p className="text-xs font-bold text-white uppercase">Schiele & Klimt Masterpieces</p>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500">PERMANENT</span>
                                </div>
                            </div>

                            <button className="w-full py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/[0.06] mt-4">
                                Personal Cultural Guide
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card overflow-hidden">
                        <div className="px-8 py-5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                            <h3 className="font-black text-xs tracking-[0.3em] uppercase">System Activity Feed</h3>
                            <button className="text-[10px] font-black text-cosmos-400 hover:text-cosmos-300 transition-colors flex items-center gap-2 group uppercase tracking-widest">
                                Expand Log <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="divide-y divide-white/[0.04]">
                            {[
                                { title: "Added to Shopping List", desc: "Metronom Coffee Grounds", time: "2 mins ago", loc: "WIEN-9-ALT", icon: <ShoppingBag className="w-4 h-4" /> },
                                { title: "Calendar Sync", desc: "Musikverein Tickets Added", time: "15 mins ago", loc: "CLOUD", icon: <CalendarIcon className="w-4 h-4" /> },
                                { title: "Expense Tracked", desc: "Restaurant Orlik - €68.50", time: "1h ago", loc: "WIEN-9-STORE", icon: <CreditCard className="w-4 h-4" /> },
                                { title: "Transit Alert", desc: "Tram D - Delay cleared", time: "2h ago", loc: "JULIUS-TANDLER", icon: <Zap className="w-4 h-4" /> },
                            ].map((item, i) => (
                                <div key={i} className="px-8 py-5 hover:bg-white/[0.02] transition-colors flex items-center gap-6 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest font-medium group-hover:text-cosmos-400 transition-colors">{item.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold italic tracking-tight">{item.desc} • {item.time}</p>
                                    </div>
                                    <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-500">{item.loc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Ecosystem Status */}
                    <div className="glass-card p-8 space-y-8 h-full bg-gradient-to-br from-[#0A0A0A] to-transparent">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                            <h3 className="font-black text-xs tracking-[0.3em] uppercase text-white italic">Ecosystem Grid</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-emerald-500 uppercase">100% ONLINE</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'Ollama LLM', status: 'Online', color: 'bg-emerald-500' },
                                { name: 'Wiener Linien API', status: 'Healthy', color: 'bg-emerald-500' },
                                { name: 'Home Assistant', status: 'Degraded', color: 'bg-amber-500' },
                                { name: 'Meta MCP Hub', status: 'Running', color: 'bg-emerald-500' },
                                { name: 'Sandra-Vault-01', status: 'Synced', color: 'bg-emerald-500' },
                            ].map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] group hover:bg-white/[0.03] transition-all">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all">{item.status}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.color} shadow-glow shadow-${item.color.split('-')[1]}-500/50`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden group mt-8">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/20 blur-3xl group-hover:scale-150 transition-transform"></div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">Benny Monitoring</h4>
                                <p className="text-xs font-bold text-white uppercase tracking-tight mb-4">German Shepherd status: Resting in 9th Dist.</p>
                                <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
