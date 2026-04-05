import React, { useState, useEffect } from 'react';
import { 
    Clock, 
    ArrowRight, 
    Train, 
    Bus, 
    Zap,
    MapPin,
    AlertCircle
} from 'lucide-react';

interface Departure {
    line: string;
    destination: string;
    time: string;
    type: string;
}

interface TransitData {
    Friedensbrücke: Departure[];
    "Julius-Tandler-Platz": Departure[];
}

export default function TransitWidget() {
    const [data, setData] = useState<TransitData | null>(null);
    const [activeTab, setActiveTab] = useState<keyof TransitData>("Friedensbrücke");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:10922/api/vienna/transport');
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch transit data", error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="glass-card p-6 h-full flex flex-col justify-center items-center">
            <Zap className="w-8 h-8 text-cosmos-500 animate-pulse" />
            <p className="text-[10px] uppercase tracking-widest mt-4 font-bold text-slate-500">Connecting Wiener Linien...</p>
        </div>
    );

    if (!data) return null;

    const currentDepartures = data[activeTab];

    return (
        <div className="glass-card overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-widest uppercase mb-0.5">Transit Monitor</h3>
                        <p className="text-[10px] text-slate-500 font-medium">9. Alsergrund Real-time</p>
                    </div>
                </div>
            </div>

            {/* Station Tabs */}
            <div className="flex border-b border-white/[0.04]">
                {Object.keys(data).map((station) => (
                    <button
                        key={station}
                        onClick={() => setActiveTab(station as keyof TransitData)}
                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                            activeTab === station 
                            ? "border-emerald-500 text-white bg-white/[0.02]" 
                            : "border-transparent text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        {station}
                    </button>
                ))}
            </div>

            <div className="divide-y divide-white/[0.04] flex-1">
                {currentDepartures.map((departure, idx) => (
                    <div key={`${departure.line}-${departure.destination}-${idx}`} className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors flex items-center gap-4 group">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                            departure.line === 'U4' ? 'bg-emerald-600' :
                            departure.line === 'D' ? 'bg-red-600' :
                            departure.line === '5' ? 'bg-orange-600' :
                            departure.line === '12' ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}>
                            {departure.line}
                        </div>
                        
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-white uppercase truncate">{departure.destination}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {departure.type === 'u-bahn' ? (
                                    <Train className="w-3 h-3 text-emerald-500" />
                                ) : (
                                    <Zap className="w-3 h-3 text-orange-400" />
                                )}
                                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                                    {departure.type}
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center gap-1.5 text-emerald-400">
                                <span className="text-sm font-bold">{departure.time}</span>
                                <Clock className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-center gap-2">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Normal operation on all lines</span>
            </div>
        </div>
    );
}
