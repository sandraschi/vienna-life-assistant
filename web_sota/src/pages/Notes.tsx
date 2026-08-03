import {
	AlertTriangle,
	ArrowUpRight,
	CheckCircle2,
	Loader2,
	NotebookText,
	Plus,
	RefreshCw,
	Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../lib/api";

type NotesStatus = {
	reachable: boolean;
	authenticated: boolean;
	error?: string;
};

type Notebook = { id: string; display_name?: string; name?: string };

type Page = { id: string; title: string; content?: string };

export default function Notes() {
	const [status, setStatus] = useState<NotesStatus | null>(null);
	const [notebooks, setNotebooks] = useState<Notebook[]>([]);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Page[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [saved, setSaved] = useState("");
	const [form, setForm] = useState({ notebook_id: "", title: "", content: "" });

	const load = useCallback(() => {
		setLoading(true);
		Promise.all([
			apiGet<NotesStatus>(API.notes.status),
			apiGet<{ notebooks: Notebook[] }>(API.notes.notebooks),
		])
			.then(([s, n]) => {
				setStatus(s);
				setNotebooks(n.notebooks || []);
			})
			.catch(() => {
				setStatus({
					reachable: false,
					authenticated: false,
					error: "notes service unreachable",
				});
				setNotebooks([]);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	useEffect(() => {
		if (notebooks.length > 0 && !form.notebook_id) {
			setForm((f) => ({ ...f, notebook_id: notebooks[0].id }));
		}
	}, [notebooks, form.notebook_id]);

	const runSearch = useCallback(async (q: string) => {
		setQuery(q);
		if (!q.trim()) {
			setResults(null);
			return;
		}
		try {
			const r = await apiGet<{ pages: Page[] }>(API.notes.search(q));
			setResults(r.pages || []);
		} catch {
			setResults([]);
		}
	}, []);

	const createPage = useCallback(async () => {
		if (!form.notebook_id || !form.title) return;
		setCreating(true);
		try {
			await apiPost(API.notes.create, form);
			setSaved(
				`Page created in ${notebooks.find((n) => n.id === form.notebook_id)?.display_name ?? "notebook"}`,
			);
			setForm((f) => ({ ...f, title: "", content: "" }));
			setTimeout(() => setSaved(""), 3000);
		} catch {
			setSaved("Failed to create page — is onenote-mcp running?");
			setTimeout(() => setSaved(""), 3000);
		} finally {
			setCreating(false);
		}
	}, [form, notebooks]);

	const online = status?.reachable;

	return (
		<div className="space-y-8 page-enter" data-testid="notes-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Notes
					</h1>
					<p className="text-slate-400 mt-2 text-sm">
						OneNote via onenote-mcp — search, create, and journal export
					</p>
				</div>
				<div className="flex items-center gap-4">
					{status && (
						<div
							className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
								online && status.authenticated
									? "bg-emerald-500/10 border-emerald-500/30"
									: "bg-amber-500/10 border-amber-500/30"
							}`}
							data-testid="notes-status"
						>
							{online && status.authenticated ? (
								<CheckCircle2 className="w-4 h-4 text-emerald-400" />
							) : (
								<AlertTriangle className="w-4 h-4 text-amber-400" />
							)}
							<span
								className={`text-xs font-black uppercase tracking-widest ${
									online && status.authenticated
										? "text-emerald-400"
										: "text-amber-400"
								}`}
							>
								{!online
									? "onenote offline"
									: status.authenticated
										? "Graph connected"
										: "auth required"}
							</span>
						</div>
					)}
					<button
						type="button"
						onClick={load}
						className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
						title="Refresh"
					>
						<RefreshCw className="w-4 h-4" />
					</button>
				</div>
			</div>

			{status?.error && (
				<p
					className="text-sm text-slate-500 uppercase tracking-widest"
					data-testid="notes-error"
				>
					{status.error}
				</p>
			)}

			{saved && (
				<p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
					{saved}
				</p>
			)}

			{loading ? (
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			) : (
				<>
					{notebooks.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{notebooks.map((n) => (
								<span
									key={n.id}
									className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-cosmos-500/10 border border-cosmos-500/20 text-cosmos-400"
									data-testid={`notebook-${n.id}`}
								>
									{n.display_name ?? n.name ?? n.id}
								</span>
							))}
						</div>
					)}

					<div className="glass-card p-6">
						<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
							<Plus className="w-4 h-4 text-emerald-400" /> New page
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
							<select
								data-testid="notes-notebook-select"
								value={form.notebook_id}
								onChange={(e) =>
									setForm({ ...form, notebook_id: e.target.value })
								}
								className="input-dark"
							>
								{notebooks.map((n) => (
									<option key={n.id} value={n.id}>
										{n.display_name ?? n.name ?? n.id}
									</option>
								))}
							</select>
							<input
								data-testid="notes-title"
								placeholder="Page title"
								value={form.title}
								onChange={(e) => setForm({ ...form, title: e.target.value })}
								className="input-dark md:col-span-3"
							/>
							<textarea
								data-testid="notes-content"
								placeholder="Content…"
								rows={3}
								value={form.content}
								onChange={(e) => setForm({ ...form, content: e.target.value })}
								className="input-dark resize-none md:col-span-3"
							/>
							<button
								data-testid="notes-create"
								type="button"
								onClick={createPage}
								disabled={creating || !online || !form.title}
								className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-black uppercase tracking-widest h-fit"
							>
								{creating ? "Creating…" : "Create page"}
							</button>
						</div>
					</div>

					<div className="relative">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
						<input
							data-testid="notes-search"
							placeholder="Search OneNote…"
							value={query}
							onChange={(e) => runSearch(e.target.value)}
							className="input-dark w-full pl-12 py-3"
						/>
					</div>

					{results && (
						<div className="space-y-3">
							{results.map((p) => (
								<div key={p.id} className="glass-card p-5">
									<div className="flex items-center justify-between gap-4">
										<p className="text-sm font-bold text-white uppercase tracking-tight">
											{p.title || "Untitled page"}
										</p>
										<button
											type="button"
											onClick={() =>
												window.open(
													`http://127.0.0.1:10907/api/pages/${p.id}`,
													"_blank",
												)
											}
											className="flex items-center gap-1 text-[10px] text-cosmos-400 uppercase tracking-widest shrink-0"
										>
											Open <ArrowUpRight className="w-3 h-3" />
										</button>
									</div>
									{p.content && (
										<p className="text-xs text-slate-400 mt-2 line-clamp-3">
											{p.content}
										</p>
									)}
								</div>
							))}
							{results.length === 0 && (
								<p className="text-sm text-slate-500 uppercase tracking-widest text-center py-8">
									No pages match "{query}"
								</p>
							)}
						</div>
					)}
				</>
			)}

			<p className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
				<NotebookText className="w-3.5 h-3.5" />
				Gateway: onenote-mcp :10907 (token stays there) · MCP:
				vienna_notes(operation=notebooks|search|create|export_journal)
			</p>
		</div>
	);
}
