import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import KaffeehausHub from './pages/KaffeehausHub';
import ConcertHall from './pages/ConcertHall';
import MuseumGuide from './pages/MuseumGuide';
import ShoppingOffers from './pages/ShoppingOffers';
import Tools from './pages/Tools';
import Chat from './pages/Chat';
import Skills from './pages/Skills';
import Logs from './pages/Logs';
import Apps from './pages/Apps';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import Expenses from './pages/Expenses';
import Travel from './pages/Travel';

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Navigate to="/" replace />} />

                {/* Fleet SOTA standard pages */}
                <Route path="tools" element={<Tools />} />
                <Route path="chat" element={<Chat />} />
                <Route path="skills" element={<Skills />} />
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
                <Route path="calendar" element={<Calendar />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="travel" element={<Travel />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
