import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Calendar,
    Receipt,
    Plane,
    Settings,
    ChevronRight,
    User,
    Bell,
    Search,
    Menu,
    X,
    Coffee,
    Music,
    Palette,
    Landmark,
    MapPin
} from 'lucide-react';
import { cn } from './lib/utils';

export default function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const mainNav = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { title: 'Shopping', icon: ShoppingCart, path: '/vienna/shopping' },
        { title: 'Calendar', icon: Calendar, path: '/calendar' },
        { title: 'Expenses', icon: Receipt, path: '/expenses' },
    ];

    const viennaLifeNav = [
        { title: 'Coffee houses', icon: Coffee, path: '/vienna/coffee' },
        { title: 'Concert Hall', icon: Music, path: '/vienna/music' },
        { title: 'Museums', icon: Palette, path: '/vienna/museums' },
    ];

    const systemNav = [
        { title: 'Travel', icon: Plane, path: '/travel' },
        { title: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cosmos-500/30">
            {/* Sidebar */}
            <aside className={cn(
                "glass-sidebar transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-50 sticky top-0 h-screen",
                isSidebarOpen ? "w-64" : "w-20"
            )}>
                <div className="p-8 pb-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cosmos-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cosmos-500/20 group cursor-pointer hover:rotate-12 transition-transform duration-500">
                        <span className="font-black text-white text-sm tracking-tighter italic">VLA</span>
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col">
                            <span className="font-black text-xs text-white uppercase tracking-[0.3em] leading-none mb-1">Vienna Life</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Assistant SOTA</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto no-scrollbar">
                    {/* Main Section */}
                    <div>
                        {isSidebarOpen && <p className="px-4 mb-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Core</p>}
                        <div className="space-y-1">
                            {mainNav.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => cn(
                                        "nav-item group",
                                        isActive && "active",
                                        !isSidebarOpen && "justify-center px-0"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0 transition-colors group-hover:text-white" />
                                    {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">{item.title}</span>}
                                    {isSidebarOpen && location.pathname === item.path && (
                                        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Vienna Life Section */}
                    <div>
                        {isSidebarOpen && <p className="px-4 mb-4 text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">Vienna Today</p>}
                        <div className="space-y-1">
                            {viennaLifeNav.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => cn(
                                        "nav-item border-l-2 border-transparent group",
                                        isActive && "active border-l-emerald-500 bg-emerald-500/[0.03]",
                                        !isSidebarOpen && "justify-center px-0"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0 transition-colors group-hover:text-emerald-400" />
                                    {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">{item.title}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* System Section */}
                    <div>
                        {isSidebarOpen && <p className="px-4 mb-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">System</p>}
                        <div className="space-y-1">
                            {systemNav.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => cn(
                                        "nav-item group",
                                        isActive && "active",
                                        !isSidebarOpen && "justify-center px-0"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">{item.title}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-6 border-t border-white/[0.04]">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all group"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 mx-auto" />}
                        {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1 transition-all duration-500 flex flex-col relative",
                isSidebarOpen ? "ml-0" : "ml-0"
            )}>
                {/* Top Header */}
                <header className="h-20 border-b border-white/[0.04] bg-black/40 backdrop-blur-3xl sticky top-0 z-40 px-10 flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative group max-w-lg w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cosmos-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Guten Morgen, Sandra. What's happening in Vienna?"
                                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl py-3 pl-12 pr-6 text-xs font-medium focus:outline-none focus:border-cosmos-500/40 focus:bg-white/[0.05] transition-all tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50 animate-pulse"></div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Alsergrund Grid ACTIVE</span>
                        </div>
                        
                        <button className="p-3 rounded-2xl hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all relative group" aria-label="Notifications">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-cosmos-500 rounded-full border-2 border-[#050505] group-hover:scale-125 transition-transform"></span>
                        </button>
                        
                        <div className="flex items-center gap-4 pl-6 border-l border-white/[0.04] group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Sandra Schipal</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Architect</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.1] flex items-center justify-center shadow-lg group-hover:border-cosmos-500/50 transition-all">
                                <User className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="max-w-[1600px] mx-auto p-12">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
