import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import KaffeehausHub from './pages/KaffeehausHub';
import ConcertHall from './pages/ConcertHall';
import MuseumGuide from './pages/MuseumGuide';
import ShoppingOffers from './pages/ShoppingOffers';
import Tools from './pages/Tools';
import Logs from './pages/Logs';
import Apps from './pages/Apps';
import Help from './pages/Help';
import Settings from './pages/Settings';

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Navigate to="/" replace />} />

                {/* Fleet SOTA standard pages */}
                <Route path="tools" element={<Tools />} />
                <Route path="logs" element={<Logs />} />
                <Route path="apps" element={<Apps />} />
                <Route path="help" element={<Help />} />
                <Route path="settings" element={<Settings />} />

                <Route path="fleet" element={<Fleet />} />

                {/* Vienna Life domain */}
                <Route path="vienna/coffee" element={<KaffeehausHub />} />
                <Route path="vienna/music" element={<ConcertHall />} />
                <Route path="vienna/museums" element={<MuseumGuide />} />
                <Route path="vienna/shopping" element={<ShoppingOffers />} />

                <Route path="shopping" element={<Navigate to="/vienna/shopping" replace />} />
                <Route path="calendar" element={<Placeholder title="Calendar" />} />
                <Route path="expenses" element={<Placeholder title="Expenses" />} />
                <Route path="travel" element={<Placeholder title="Travel" />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}

function Placeholder({ title }: { title: string }) {
    return (
        <div className="page-enter p-8 text-slate-500 font-bold uppercase tracking-widest italic">
            {title} — wired to main backend in Phase 2
        </div>
    );
}
