import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import { AuthProvider, RequireAuth } from "./lib/auth";
import { LanguageProvider } from "./lib/i18n";
import Accommodation from "./pages/Accommodation";
import Apps from "./pages/Apps";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import ConcertHall from "./pages/ConcertHall";
import Contacts from "./pages/Contacts";
import ControlTower from "./pages/ControlTower";
import Crossconnects from "./pages/Crossconnects";
import Culture from "./pages/Culture";
import Dashboard from "./pages/Dashboard";
import Economy from "./pages/Economy";
import Education from "./pages/Education";
import Email from "./pages/Email";
import Expenses from "./pages/Expenses";
import Fleet from "./pages/Fleet";
import Goliath from "./pages/Goliath";
import Health from "./pages/Health";
import Help from "./pages/Help";
import History from "./pages/History";
import Household from "./pages/Household";
import Journal from "./pages/Journal";
import KaffeehausHub from "./pages/KaffeehausHub";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import MuseumGuide from "./pages/MuseumGuide";
import News from "./pages/News";
import Notes from "./pages/Notes";
import Onboarding from "./pages/Onboarding";
import Politics from "./pages/Politics";
import Restaurants from "./pages/Restaurants";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import ShoppingOffers from "./pages/ShoppingOffers";
import Skills from "./pages/Skills";
import Tools from "./pages/Tools";
import Transport from "./pages/Transport";
import Travel from "./pages/Travel";

export default function App() {
	return (
		<LanguageProvider>
			<AuthProvider>
				<Routes>
					<Route path="login" element={<Login />} />
					<Route element={<AppLayout />}>
						<Route index element={<Dashboard />} />
						<Route path="onboarding" element={<Onboarding />} />
						<Route path="dashboard" element={<Navigate to="/" replace />} />

						{/* App pages */}
						<Route path="tools" element={<Tools />} />
						<Route path="chat" element={<Chat />} />
						<Route path="skills" element={<Skills />} />
						<Route path="logs" element={<Logs />} />
						<Route path="apps" element={<Apps />} />
						<Route path="help" element={<Help />} />
						<Route path="settings" element={<Settings />} />

						<Route path="fleet" element={<Fleet />} />
						<Route path="control-tower" element={<ControlTower />} />
						<Route path="services" element={<Services />} />
						<Route path="goliath" element={<Goliath />} />

						{/* Vienna Life domain */}
						<Route path="vienna/coffee" element={<KaffeehausHub />} />
						<Route path="vienna/restaurants" element={<Restaurants />} />
						<Route path="vienna/accommodation" element={<Accommodation />} />
						<Route path="vienna/culture" element={<Culture />} />
						<Route path="vienna/history" element={<History />} />
						<Route path="vienna/education" element={<Education />} />
						<Route path="vienna/economy" element={<Economy />} />
						<Route path="vienna/politics" element={<Politics />} />
						<Route path="vienna/transport" element={<Transport />} />
						<Route path="crossconnects" element={<Crossconnects />} />
						<Route path="vienna/music" element={<ConcertHall />} />
						<Route path="vienna/museums" element={<MuseumGuide />} />
						<Route
							path="vienna/shopping"
							element={
								<RequireAuth>
									<ShoppingOffers />
								</RequireAuth>
							}
						/>

						<Route
							path="shopping"
							element={<Navigate to="/vienna/shopping" replace />}
						/>
						<Route path="calendar" element={<Calendar />} />
						<Route
							path="expenses"
							element={
								<RequireAuth>
									<Expenses />
								</RequireAuth>
							}
						/>
						<Route
							path="travel"
							element={
								<RequireAuth>
									<Travel />
								</RequireAuth>
							}
						/>
						<Route
							path="health"
							element={
								<RequireAuth>
									<Health />
								</RequireAuth>
							}
						/>
						<Route path="contacts" element={<Contacts />} />
						<Route path="household" element={<Household />} />
						<Route
							path="journal"
							element={
								<RequireAuth>
									<Journal />
								</RequireAuth>
							}
						/>
						<Route path="news" element={<News />} />
						<Route path="notes" element={<Notes />} />
						<Route path="email" element={<Email />} />

						<Route path="*" element={<Navigate to="/" replace />} />
					</Route>
				</Routes>
			</AuthProvider>
		</LanguageProvider>
	);
}
