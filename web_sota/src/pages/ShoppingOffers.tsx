import { useState, useEffect } from 'react';
import { 
    TrendingDown, 
    Store,
    Tag,
    ChevronDown
} from 'lucide-react';

interface ShoppingOffer {
    store: string;
    product: string;
    price: number;
    old_price?: number;
    discount: number;
    category: string;
}

export default function ShoppingOffers() {
    const [offers, setOffers] = useState<ShoppingOffer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:10922/api/vienna/shopping/offers')
            .then(res => res.json())
            .then(data => {
                setOffers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-white">Scanning the shelves...</div>;

    return (
        <div className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Price Monitor</span>
                    </div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic leading-none">Shopping Offers</h1>
                    <p className="text-slate-500 font-medium tracking-tight uppercase flex items-center gap-2 mt-2">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        Weekly Discounts: Spar vs. Billa
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
                    <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Store className="w-3.5 h-3.5" />
                        All Stores
                    </div>
                    <div className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer border border-transparent">
                        Favorites Only
                    </div>
                    <div className="w-px h-4 bg-white/[0.1] mx-2"></div>
                    <div className="flex items-center gap-2 pr-4 text-slate-400 hover:text-white transition-colors cursor-pointer group">
                        <span className="text-[10px] font-black uppercase tracking-widest">Catgeory</span>
                        <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Price Battle Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spar Highlight */}
                <div className="relative group overflow-hidden rounded-[2.5rem] border border-red-500/10 bg-[#0A0A0A] p-12 transition-all hover:border-red-500/30">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full group-hover:bg-red-600/10 transition-all"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white scale-110 shadow-lg shadow-red-600/20">
                            <span className="font-black text-xl italic">S</span>
                        </div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">SPAR Austria</h2>
                    </div>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed italic mb-10 max-w-lg">Focusing on regional quality and Bio-organic highlights from Natur*pur.</p>
                    <div className="flex items-center gap-6">
                        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Top Discount</p>
                            <p className="text-2xl font-black text-red-500">-34%</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Offers</p>
                            <p className="text-2xl font-black text-white">42</p>
                        </div>
                    </div>
                </div>

                {/* Billa Highlight */}
                <div className="relative group overflow-hidden rounded-[2.5rem] border border-amber-500/10 bg-[#0A0A0A] p-12 transition-all hover:border-amber-500/30">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-600/5 blur-[120px] rounded-full group-hover:bg-amber-600/10 transition-all"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-black scale-110 shadow-lg shadow-amber-500/20">
                            <span className="font-black text-xl italic">B</span>
                        </div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">BILLA</h2>
                    </div>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed italic mb-10 max-w-lg">Your neighborhood fresh market with exclusive JÖ bonus club highlights.</p>
                    <div className="flex items-center gap-6">
                        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Top Discount</p>
                            <p className="text-2xl font-black text-amber-500">-33%</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Offers</p>
                            <p className="text-2xl font-black text-white">38</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List of Offers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {offers.map((offer, idx) => (
                    <div key={`${offer.store}-${offer.product}-${idx}`} className="glass-card p-6 group hover:translate-y-[-4px] transition-all duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] flex items-center gap-2`}>
                                <div className={`w-3 h-3 rounded-full ${offer.store === 'spar' ? 'bg-red-600' : 'bg-amber-500'}`}></div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{offer.store}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <Tag className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="space-y-1 mb-8 h-12 flex flex-col justify-center">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{offer.category}</p>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight leading-snug truncate group-hover:text-emerald-400 transition-colors">{offer.product}</h4>
                        </div>

                        <div className="flex items-end justify-between pt-6 border-t border-white/[0.04]">
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 line-through">
                                    {offer.old_price ? `€${offer.old_price.toFixed(2)}` : ''}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-white italic tracking-tighter">€{offer.price.toFixed(2)}</span>
                                    <span className="text-[10px] font-black text-emerald-500">-{offer.discount}%</span>
                                </div>
                            </div>
                            <button title="Add to shopping list" className="p-3 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/20">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
