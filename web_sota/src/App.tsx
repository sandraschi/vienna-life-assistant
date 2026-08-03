import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import Apps from "./pages/Apps";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import ConcertHall from "./pages/ConcertHall";
import Contacts from "./pages/Contacts";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Fleet from "./pages/Fleet";
import Health from "./pages/Health";
import Help from "./pages/Help";
import Household from "./pages/Household";
import Journal from "./pages/Journal";
import KaffeehausHub from "./pages/KaffeehausHub";
import Logs from "./pages/Logs";
import MuseumGuide from "./pages/MuseumGuide";
import News from "./pages/News";
import Settings from "./pages/Settings";
import ShoppingOffers from "./pages/ShoppingOffers";
import Skills from "./pages/Skills";
import Tools from "./pages/Tools";
import Travel from "./pages/Travel";

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

				<Route
					path="shopping"
					element={<Navigate to="/vienna/shopping" replace />}
				/>
				<Route path="calendar" element={<Calendar />} />
				<Route path="expenses" element={<Expenses />} />
				<Route path="travel" element={<Travel />} />
				<Route path="health" element={<Health />} />
				<Route path="contacts" element={<Contacts />} />
				<Route path="household" element={<Household />} />
				<Route path="journal" element={<Journal />} />
				<Route path="news" element={<News />} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}
