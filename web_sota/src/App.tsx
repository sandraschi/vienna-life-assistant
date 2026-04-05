import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import Dashboard from './pages/Dashboard';
import KaffeehausHub from './pages/KaffeehausHub';
import ConcertHall from './pages/ConcertHall';
import MuseumGuide from './pages/MuseumGuide';
import ShoppingOffers from './pages/ShoppingOffers';

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Vienna Life Ecosystem */}
                <Route path="vienna/coffee" element={<KaffeehausHub />} />
                <Route path="vienna/music" element={<ConcertHall />} />
                <Route path="vienna/museums" element={<MuseumGuide />} />
                <Route path="vienna/shopping" element={<ShoppingOffers />} />

                {/* Legacy / Standard Sections */}
                <Route path="shopping" element={<Navigate to="/vienna/shopping" replace />} />
                <Route path="calendar" element={<div className="page-enter p-8 text-slate-500 font-bold uppercase tracking-widest italic">Calendar Section (WIP)</div>} />
                <Route path="expenses" element={<div className="page-enter p-8 text-slate-500 font-bold uppercase tracking-widest italic">Expenses Section (WIP)</div>} />
                <Route path="travel" element={<div className="page-enter p-8 text-slate-500 font-bold uppercase tracking-widest italic">Travel Section (WIP)</div>} />
                <Route path="settings" element={<div className="page-enter p-8 text-slate-500 font-bold uppercase tracking-widest italic">Settings Section (WIP)</div>} />
            </Route>
        </Routes>
    );
}
