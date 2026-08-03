import {
	ArrowRight,
	Building2,
	Calendar as CalendarIcon,
	CloudSun,
	Coffee,
	HeartPulse,
	Home,
	MessageSquare,
	Moon,
	Music,
	Newspaper,
	Palette,
	Plane,
	Receipt,
	ShoppingBag,
	Sun,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransitWidget from "../components/TransitWidget";
import { API, apiGet } from "../lib/api";

interface ViennaTip {
	coffee: { name: string; status: string }[];
	music: { venue: string; performance: string; tickets: string }[];
	museums: { museum: string; title: string }[];
}

interface NewsItem {
	title: string;
	url: string;
	source: string;
}

interface DashboardStat {
	title: string;
	value: string;
	change: string;
	icon: string;
	color: string;
}

interface LifeOverview {
	active_medications: { name: string }[];
	next_visits: { doctor: string; date: string }[];
	birthdays: { name: string; days_until: number }[];
	trips: { title: string; start_date: string }[];
	renewals: { name: string; renewal_date: string }[];
}

const quickLinks = [
	{ label: "Health", icon: HeartPulse, path: "/health" },
	{ label: "Calendar", icon: CalendarIcon, path: "/calendar" },
	{ label: "Travel", icon: Plane, path: "/travel" },
	{ label: "Contacts", icon: Users, path: "/contacts" },
	{ label: "Household", icon: Home, path: "/household" },
	{ label: "Expenses", icon: Receipt, path: "/expenses" },
	{ label: "Shopping", icon: ShoppingBag, path: "/vienna/shopping" },
	{ label: "Chat", icon: MessageSquare, path: "/chat" },
];

function useTimeGreeting() {
	return useMemo(() => {
		const h = new Date().getHours();
		if (h < 5) return { text: "Gute Nacht", icon: Moon };
		if (h < 12) return { text: "Guten Morgen", icon: CloudSun };
		if (h < 17) return { text: "Guten Tag", icon: Sun };
		if (h < 22) return { text: "Guten Abend", icon: Moon };
		return { text: "Gute Nacht", icon: Moon };
	}, []);
}

export default function Dashboard() {
	const navigate = useNavigate();
	const greeting = useTimeGreeting();
	const GreetIcon = greeting.icon;
	const [viennaTips, setViennaTips] = useState<ViennaTip | null>(null);
	const [headlines, setHeadlines] = useState<NewsItem[]>([]);
	const [press, setPress] = useState<NewsItem[]>([]);
	const [stats, setStats] = useState<DashboardStat[]>([]);
	const [life, setLife] = useState<LifeOverview | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					coffee,
					music,
					museums,
					news,
					pressReleases,
					dashboard,
					overview,
				] = await Promise.all([
					apiGet<{ name: string; status: string }[]>(API.vienna.coffee),
					apiGet<{ venue: string; performance: string; tickets: string }[]>(
						API.vienna.music,
					),
					apiGet<{ museum: string; title: string }[]>(API.vienna.museums),
					apiGet<NewsItem[]>(API.vienna.news),
					apiGet<NewsItem[]>(API.vienna.press),
					apiGet<{ stats: DashboardStat[] }>(API.dashboard),
					apiGet<LifeOverview>(API.life.overview),
				]);
				setViennaTips({ coffee, music, museums });
				setHeadlines(news);
				setPress(pressReleases);
				setStats(dashboard.stats || []);
				setLife(overview);
			} catch {
				// Backend starting
			}
		};
		fetchData();
	}, []);

	return (
		<div className="space-y-10 page-enter" data-testid="dashboard">
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cosmos-500/10 via-transparent to-emerald-500/5 border border-white/[0.06] p-8 md:p-10">
				<div className="absolute top-0 right-0 w-64 h-64 bg-cosmos-500/5 blur-3xl rounded-full" />
				<div className="relative z-10">
					<div className="flex items-center gap-3 text-cosmos-400 mb-4">
						<GreetIcon className="w-5 h-5" />
						<span className="text-sm font-black uppercase tracking-[0.3em]">
							{greeting.text}, Alsergrund.
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-black gradient-text tracking-tighter uppercase italic leading-tight mb-3">
						Vienna Life
					</h1>
					<p className="text-slate-400 text-sm max-w-xl leading-relaxed">
						Your local layer for the 9th district — transit, culture, coffee,
						and daily logistics. All data served from your own fleet, zero cloud
						dependence.
					</p>
				</div>
			</div>

			{/* KPIs */}
			{stats.length > 0 && (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((s) => (
						<div
							key={s.title}
							className="glass-card p-5"
							data-testid={`kpi-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
						>
							<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
								{s.title}
							</p>
							<p className="text-2xl font-black text-white truncate">
								{s.value}
							</p>
							<p className="text-xs text-slate-400 mt-1 truncate">{s.change}</p>
						</div>
					))}
				</div>
			)}

			{/* Life pulse */}
			{life && (
				<div className="glass-card p-6">
					<h3 className="font-black text-sm tracking-[0.3em] uppercase text-white italic mb-4 flex items-center gap-3">
						<HeartPulse className="w-4 h-4 text-cosmos-400" /> Life Pulse
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						<div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
							<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
								Medications
							</p>
							<p
								className="text-sm font-bold text-emerald-400"
								data-testid="pulse-meds"
							>
								{life.active_medications.length > 0
									? life.active_medications.map((m) => m.name).join(", ")
									: "None"}
							</p>
						</div>
						<div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
							<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
								Next doctor
							</p>
							<p
								className="text-sm font-bold text-cosmos-400"
								data-testid="pulse-visit"
							>
								{life.next_visits[0]
									? `${life.next_visits[0].doctor} (${life.next_visits[0].date})`
									: "None scheduled"}
							</p>
						</div>
						<div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
							<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
								Next trip
							</p>
							<p
								className="text-sm font-bold text-amber-400"
								data-testid="pulse-trip"
							>
								{life.trips[0]
									? `${life.trips[0].title} (${life.trips[0].start_date})`
									: "None planned"}
							</p>
						</div>
						<div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
							<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
								Birthdays soon
							</p>
							<p
								className="text-sm font-bold text-pink-400"
								data-testid="pulse-birthdays"
							>
								{life.birthdays.length > 0
									? life.birthdays
											.map((b) => `${b.name} in ${b.days_until}d`)
											.join(", ")
									: "None"}
							</p>
						</div>
						<div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
							<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
								Renewals soon
							</p>
							<p
								className="text-sm font-bold text-red-400"
								data-testid="pulse-renewals"
							>
								{life.renewals.length > 0
									? life.renewals.map((r) => r.name).join(", ")
									: "None"}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Quick nav */}
			<div className="flex items-center gap-3 overflow-x-auto pb-1">
				{quickLinks.map((link) => {
					const Icon = link.icon;
					return (
						<button
							key={link.label}
							onClick={() => navigate(link.path)}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
						>
							<Icon className="w-3.5 h-3.5" />
							{link.label}
						</button>
					);
				})}
			</div>

			{/* Content grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<TransitWidget />

				{viennaTips && (
					<div className="glass-card p-8 flex flex-col space-y-6 border-cosmos-500/10 hover:border-cosmos-500/30 transition-all">
						<div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
							<h3 className="font-black text-sm tracking-[0.3em] uppercase text-white italic">
								Vienna Today
							</h3>
							<ArrowRight className="w-4 h-4 text-slate-600" />
						</div>

						<div className="space-y-4">
							{viennaTips.music?.slice(0, 2).map((item, _i) => (
								<div
									key={_i}
									className="flex items-center gap-4 group cursor-pointer"
									onClick={() => navigate("/vienna/music")}
								>
									<div className="w-10 h-10 rounded-xl bg-cosmos-500/10 text-cosmos-500 border border-cosmos-500/20 flex items-center justify-center group-hover:scale-110 transition-all shrink-0">
										<Music className="w-5 h-5" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
											{item.venue}
										</p>
										<p className="text-sm font-bold text-white truncate">
											{item.performance}
										</p>
									</div>
									<span
										className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${item.tickets === "Available" ? "text-emerald-500" : item.tickets === "Last Few" ? "text-amber-500" : "text-red-500"}`}
									>
										{item.tickets}
									</span>
								</div>
							))}
							{viennaTips.coffee?.slice(0, 1).map((item, i) => (
								<div
									key={`coffee-${i}`}
									className="flex items-center gap-4 group cursor-pointer"
									onClick={() => navigate("/vienna/coffee")}
								>
									<div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-all shrink-0">
										<Coffee className="w-5 h-5" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
											{item.name}
										</p>
										<p className="text-sm font-bold text-white">
											{item.status}
										</p>
									</div>
								</div>
							))}
							{viennaTips.museums?.slice(0, 1).map((item, i) => (
								<div
									key={`museum-${i}`}
									className="flex items-center gap-4 group cursor-pointer"
									onClick={() => navigate("/vienna/museums")}
								>
									<div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-all shrink-0">
										<Palette className="w-5 h-5" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
											{item.museum}
										</p>
										<p className="text-sm font-bold text-white truncate">
											{item.title}
										</p>
									</div>
								</div>
							))}
						</div>

						<button
							onClick={() => navigate("/vienna/coffee")}
							className="w-full py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/[0.06] mt-2"
						>
							Vienna Guide
						</button>
					</div>
				)}
			</div>

			{/* News + Press */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{headlines.length > 0 && (
					<div className="glass-card p-6 space-y-4">
						<div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
							<Newspaper className="w-4 h-4 text-cosmos-400" />
							<h3 className="font-black text-sm tracking-[0.3em] uppercase text-white italic">
								ORF Wien
							</h3>
						</div>
						<div className="space-y-2">
							{headlines.slice(0, 6).map((item, i) => (
								<a
									key={i}
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									className="block p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/20 transition-all group"
								>
									<p className="text-xs font-bold text-white group-hover:text-cosmos-400 transition-colors leading-relaxed">
										{item.title}
									</p>
								</a>
							))}
						</div>
					</div>
				)}

				{press.length > 0 && (
					<div className="glass-card p-6 space-y-4">
						<div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
							<Building2 className="w-4 h-4 text-emerald-400" />
							<h3 className="font-black text-sm tracking-[0.3em] uppercase text-white italic">
								Stadt Wien
							</h3>
						</div>
						<div className="space-y-2">
							{press.slice(0, 6).map((item, i) => (
								<div
									key={i}
									className="block p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/20 transition-all group"
								>
									<p className="text-xs font-bold text-white leading-relaxed">
										{item.title}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
