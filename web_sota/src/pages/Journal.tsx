import {
	BookMarked,
	Flame,
	History,
	Loader2,
	NotebookPen,
	Plus,
	RefreshCw,
	Search,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiDelete, apiGet, apiPost } from "../lib/api";

type JournalEntry = {
	id: number;
	date: string;
	time: string;
	title: string;
	body: string;
	mood: number;
	tags: string;
};

const todayIso = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);

const moodLabel = (m: number) =>
	m >= 9
		? "Fantastic"
		: m >= 7
			? "Good"
			: m >= 5
				? "Okay"
				: m >= 3
					? "Meh"
					: "Rough";

const moodColor = (m: number) =>
	m >= 8 ? "text-emerald-400" : m >= 5 ? "text-amber-400" : "text-red-400";

export default function Journal() {
	const [entries, setEntries] = useState<JournalEntry[]>([]);
	const [streak, setStreak] = useState(0);
	const [onThisDay, setOnThisDay] = useState<JournalEntry[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searching, setSearching] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState("");
	const [form, setForm] = useState({
		date: todayIso(),
		time: nowTime(),
		title: "",
		body: "",
		mood: 6,
		tags: "",
	});

	const load = useCallback(() => {
		setLoading(true);
		Promise.all([
			apiGet<{ entries: JournalEntry[] }>(API.life.logs),
			apiGet<{ streak: number }>(API.life.logsStreak),
			apiGet<{ entries: JournalEntry[] }>(API.life.logsOnThisDay),
		])
			.then(([e, s, o]) => {
				setEntries(e.entries || []);
				setStreak(s.streak ?? 0);
				setOnThisDay(o.entries || []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const addEntry = useCallback(async () => {
		if (!form.title && !form.body.trim()) return;
		const r = await apiPost<{ entry: JournalEntry }>(API.life.logs, {
			date: form.date,
			time: form.time,
			title: form.title,
			body: form.body,
			mood: form.mood,
			tags: form.tags,
		});
		setEntries((p) => [r.entry, ...p]);
		setForm({
			date: todayIso(),
			time: nowTime(),
			title: "",
			body: "",
			mood: 6,
			tags: "",
		});
		setSaved("Entry logged");
		setTimeout(() => setSaved(""), 2500);
		load();
	}, [form, load]);

	const deleteEntry = useCallback(async (id: number) => {
		await apiDelete(`${API.life.logs}/${id}`);
		setEntries((p) => p.filter((e) => e.id !== id));
	}, []);

	const exportToOneNote = useCallback(async (id: number) => {
		try {
			const r = await apiPost<{ message?: string }>(API.notes.exportJournal, {
				entry_id: id,
			});
			setSaved(r.message ?? "Exported to OneNote");
		} catch {
			setSaved("Export failed — is onenote-mcp running and authenticated?");
		}
		setTimeout(() => setSaved(""), 3500);
	}, []);

	const runSearch = useCallback(async (q: string) => {
		setSearchQuery(q);
		if (!q.trim()) {
			setSearching(false);
			return;
		}
		setSearching(true);
		try {
			const r = await apiGet<{ entries: JournalEntry[] }>(
				API.life.logsSearch(q),
			);
			setEntries(r.entries || []);
		} catch {
			setSearching(false);
		}
	}, []);

	const clearSearch = useCallback(() => {
		setSearchQuery("");
		setSearching(false);
		load();
	}, [load]);

	return (
		<div className="space-y-8 page-enter" data-testid="journal-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Journal
					</h1>
					<p className="text-slate-300 mt-2 text-sm">
						Your personal log — mood, tags, streak, and what happened on this
						day
					</p>
				</div>
				<div className="flex items-center gap-4">
					{streak > 0 && (
						<div
							className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30"
							data-testid="journal-streak"
						>
							<Flame className="w-4 h-4 text-amber-400" />
							<span className="text-sm font-black text-amber-400 uppercase tracking-widest">
								{streak}-day streak
							</span>
						</div>
					)}
					<button
						type="button"
						onClick={load}
						className="p-2 rounded-xl text-slate-300 hover:text-white transition-colors"
						title="Refresh"
					>
						<RefreshCw className="w-4 h-4" />
					</button>
				</div>
			</div>

			{saved && (
				<p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
					{saved}
				</p>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Compose + on this day */}
				<div className="space-y-6">
					<div className="glass-card p-6">
						<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
							<Plus className="w-4 h-4 text-cosmos-400" /> Log today
						</h2>
						<div className="space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<input
									data-testid="journal-date"
									type="date"
									value={form.date}
									onChange={(e) => setForm({ ...form, date: e.target.value })}
									className="input-dark"
								/>
								<input
									data-testid="journal-time"
									type="time"
									value={form.time}
									onChange={(e) => setForm({ ...form, time: e.target.value })}
									className="input-dark"
								/>
							</div>
							<input
								data-testid="journal-title"
								placeholder="Title"
								value={form.title}
								onChange={(e) => setForm({ ...form, title: e.target.value })}
								className="input-dark"
							/>
							<textarea
								data-testid="journal-body"
								placeholder="What happened today?"
								rows={4}
								value={form.body}
								onChange={(e) => setForm({ ...form, body: e.target.value })}
								className="input-dark resize-none"
							/>
							<input
								data-testid="journal-tags"
								placeholder="Tags (comma separated): benny,work,culture"
								value={form.tags}
								onChange={(e) => setForm({ ...form, tags: e.target.value })}
								className="input-dark"
							/>
							<div className="flex items-center gap-3">
								<span className="text-xs font-black text-slate-300 uppercase tracking-widest">
									Mood
								</span>
								<input
									data-testid="journal-mood"
									type="range"
									min={1}
									max={10}
									value={form.mood}
									onChange={(e) => setForm({ ...form, mood: +e.target.value })}
									className="flex-1 accent-violet-500"
								/>
								<span
									className={`text-sm font-black tabular-nums ${moodColor(form.mood)}`}
								>
									{form.mood} {moodLabel(form.mood)}
								</span>
							</div>
							<button
								data-testid="journal-add"
								type="button"
								onClick={addEntry}
								disabled={!form.title && !form.body.trim()}
								className="w-full py-2.5 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 disabled:opacity-40 text-white text-xs font-black uppercase tracking-widest transition-colors"
							>
								Log entry
							</button>
						</div>
					</div>

					{onThisDay.length > 0 && (
						<div className="glass-card p-6 border-amber-500/20">
							<h2 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
								<History className="w-4 h-4" /> On this day
							</h2>
							<div className="space-y-4">
								{onThisDay.map((e) => (
									<div key={e.id}>
										<p className="text-sm text-slate-300 font-bold uppercase tracking-widest">
											{e.date}
										</p>
										<p className="text-sm text-slate-300 mt-1 font-bold">
											{e.title || "Untitled"}
										</p>
										{e.body && (
											<p className="text-sm text-slate-300 mt-1 line-clamp-3">
												{e.body}
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Timeline + search */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
							<input
								data-testid="journal-search"
								placeholder="Search your log…"
								value={searchQuery}
								onChange={(e) => runSearch(e.target.value)}
								className="input-dark w-full pl-12"
							/>
						</div>
						{searching && (
							<button
								type="button"
								onClick={clearSearch}
								className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
							>
								Clear
							</button>
						)}
					</div>

					{loading ? (
						<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
					) : (
						<div className="space-y-3">
							{entries.map((e) => (
								<div key={e.id} className="glass-card p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="min-w-0">
											<p className="text-sm font-black text-white uppercase tracking-tight truncate">
												{e.title || "Untitled entry"}
											</p>
											<p className="text-sm text-slate-300 font-bold uppercase tracking-widest mt-1">
												{e.date} · {e.time}
											</p>
										</div>
										<div className="flex items-center gap-3 shrink-0">
											<span
												className={`text-sm font-black tabular-nums ${moodColor(e.mood)}`}
											>
												{e.mood}
											</span>
											<button
												type="button"
												onClick={() => exportToOneNote(e.id)}
												className="text-slate-300 hover:text-cosmos-400 transition-colors"
												title="Export to OneNote"
												data-testid={`journal-export-${e.id}`}
											>
												<BookMarked className="w-3.5 h-3.5" />
											</button>
											<button
												type="button"
												onClick={() => deleteEntry(e.id)}
												className="text-slate-300 hover:text-red-400 transition-colors"
												title="Delete entry"
												data-testid={`journal-delete-${e.id}`}
											>
												<Trash2 className="w-3.5 h-3.5" />
											</button>
										</div>
									</div>
									{e.body && (
										<p className="text-sm text-slate-300 mt-3 leading-relaxed whitespace-pre-wrap">
											{e.body}
										</p>
									)}
									{e.tags && (
										<div className="flex flex-wrap gap-2 mt-3">
											{e.tags
												.split(",")
												.map((t) => t.trim())
												.filter(Boolean)
												.map((t) => (
													<span
														key={t}
														className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest bg-cosmos-500/10 border border-cosmos-500/20 text-cosmos-400"
													>
														{t}
													</span>
												))}
										</div>
									)}
								</div>
							))}
							{entries.length === 0 && (
								<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8">
									{searching
										? "No matching entries"
										: "Nothing logged yet — start today"}
								</p>
							)}
						</div>
					)}
				</div>
			</div>

			<p className="text-sm text-slate-300 uppercase tracking-widest flex items-center gap-2">
				<NotebookPen className="w-3.5 h-3.5" />
				MCP: vienna_log(operation=entries|add|streak|on_this_day|search) · REST
				/api/life/logs
			</p>
		</div>
	);
}
