import {
	Calendar as CalendarIcon,
	Clock,
	Loader2,
	MapPin,
	Plus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../lib/api";

type Event = {
	id: number;
	date?: string;
	time: string;
	title: string;
	location: string;
	category: string;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function Calendar() {
	const [today, setToday] = useState<Event[]>([]);
	const [week, setWeek] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState<"today" | "week">("today");
	const [saved, setSaved] = useState("");
	const [form, setForm] = useState({
		date: todayIso(),
		time: "09:00",
		title: "",
		location: "",
		category: "general",
	});

	const load = useCallback(() => {
		Promise.all([
			apiGet<{ events: Event[] }>(API.life.calendarToday),
			apiGet<{ events: Event[] }>(API.life.calendarWeek),
		])
			.then(([t, w]) => {
				setToday(t.events || []);
				setWeek(w.events || []);
			})
			.catch(() => {
				setToday([]);
				setWeek([]);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const addEvent = useCallback(async () => {
		if (!form.title || !form.date) return;
		const r = await apiPost<{ event: Event }>(API.life.calendar, form);
		setSaved(`Event added: ${r.event.title}`);
		setForm({
			date: todayIso(),
			time: "09:00",
			title: "",
			location: "",
			category: "general",
		});
		load();
		setTimeout(() => setSaved(""), 2500);
	}, [form, load]);

	const events = tab === "today" ? today : week;

	if (loading) {
		return <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />;
	}

	return (
		<div className="space-y-8 page-enter">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Calendar
					</h1>
					<p className="text-slate-300 mt-2 text-sm">
						Today and week ahead — Alsergrund grid
					</p>
				</div>
				<div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
					{(["today", "week"] as const).map((k) => (
						<button
							key={k}
							type="button"
							onClick={() => setTab(k)}
							className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
								tab === k
									? "bg-cosmos-500 text-white"
									: "text-slate-300 hover:text-white"
							}`}
						>
							{k}
						</button>
					))}
				</div>
			</div>

			<div className="glass-card p-6" data-testid="calendar-add">
				<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
					<Plus className="w-4 h-4 text-cosmos-400" /> Add event
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-6 gap-3">
					<input
						data-testid="event-date"
						type="date"
						value={form.date}
						onChange={(e) => setForm({ ...form, date: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="event-time"
						type="time"
						value={form.time}
						onChange={(e) => setForm({ ...form, time: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="event-title"
						placeholder="Title"
						value={form.title}
						onChange={(e) => setForm({ ...form, title: e.target.value })}
						className="input-dark md:col-span-2"
					/>
					<input
						data-testid="event-location"
						placeholder="Location"
						value={form.location}
						onChange={(e) => setForm({ ...form, location: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="event-category"
						placeholder="Category (health/work/pet…)"
						value={form.category}
						onChange={(e) => setForm({ ...form, category: e.target.value })}
						className="input-dark"
					/>
					<button
						data-testid="event-add"
						onClick={addEvent}
						className="px-4 py-2 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 text-white text-xs font-black uppercase tracking-widest md:col-span-6 justify-self-start"
					>
						Add event
					</button>
				</div>
			</div>

			{saved && (
				<p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
					{saved}
				</p>
			)}

			<div className="glass-card overflow-hidden">
				<div className="px-8 py-5 border-b border-white/[0.06] flex items-center gap-3">
					<CalendarIcon className="w-5 h-5 text-cosmos-400" />
					<span className="text-xs font-black uppercase tracking-widest text-white">
						{events.length} events
					</span>
				</div>
				<div className="divide-y divide-white/[0.04]">
					{events.map((ev) => (
						<div
							key={ev.id}
							className="px-8 py-6 hover:bg-white/[0.02] transition-colors flex gap-6"
						>
							<div className="w-20 shrink-0">
								<p className="text-lg font-black text-white tabular-nums">
									{ev.time}
								</p>
								{ev.date && (
									<p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">
										{ev.date}
									</p>
								)}
							</div>
							<div className="flex-1">
								<p className="text-sm font-black text-white uppercase tracking-tight">
									{ev.title}
								</p>
								<p className="text-xs text-slate-300 mt-2 flex items-center gap-2 uppercase font-bold">
									<MapPin className="w-3 h-3" />
									{ev.location}
								</p>
							</div>
							<span className="text-xs font-black text-cosmos-400 uppercase tracking-widest self-center">
								{ev.category}
							</span>
						</div>
					))}
					{events.length === 0 && (
						<p className="px-8 py-12 text-slate-300 text-sm uppercase tracking-widest">
							No events
						</p>
					)}
				</div>
			</div>

			<p className="text-xs text-slate-300 uppercase tracking-widest flex items-center gap-2">
				<Clock className="w-3 h-3" />
				Source: GET /api/life/calendar — MCP
				vienna_life(operation=calendar_today)
			</p>
		</div>
	);
}
