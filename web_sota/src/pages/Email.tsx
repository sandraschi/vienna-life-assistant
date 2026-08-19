import {
	AlertTriangle,
	CheckCircle2,
	Loader2,
	Mail,
	MailOpen,
	MailQuestion,
	RefreshCw,
	Search,
	Send,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../lib/api";

type EmailStatus = { reachable: boolean; error?: string; payload?: unknown };

type Email = {
	id: string;
	subject: string;
	from: string;
	date: string;
	read?: boolean;
};

type EmailStats = { unread?: number; total?: number; emails?: unknown };

const fmtDate = (d: string) => {
	if (!d) return "";
	const cleaned = d.replace(" (CEST)", "").replace(" (CET)", "");
	const parsed = new Date(cleaned);
	if (Number.isNaN(parsed.getTime())) return d.slice(0, 16);
	return parsed.toLocaleString("de-AT", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export default function Email() {
	const [status, setStatus] = useState<EmailStatus | null>(null);
	const [stats, setStats] = useState<EmailStats | null>(null);
	const [emails, setEmails] = useState<Email[]>([]);
	const [selected, setSelected] = useState<Record<string, unknown> | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState("");
	const [query, setQuery] = useState("");
	const [searching, setSearching] = useState(false);
	const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
	const [sending, setSending] = useState(false);

	const load = useCallback(async (unreadOnly = false) => {
		setLoading(true);
		Promise.all([
			apiGet<EmailStatus>(API.email.status),
			apiGet<EmailStats>(API.email.stats).catch(() => null),
			apiGet<{ emails: Email[] }>(API.email.inbox({ limit: 25, unreadOnly })),
		])
			.then(([s, st, i]) => {
				setStatus(s);
				setStats(st);
				setEmails(i.emails || []);
			})
			.catch(() => {
				setStatus({ reachable: false, error: "email service unreachable" });
				setEmails([]);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const openEmail = useCallback(async (id: string) => {
		try {
			const r = await apiGet<Record<string, unknown>>(API.email.message(id));
			setSelected(r);
			if (r.read === false) {
				apiPost(API.email.markRead(id)).catch(() => {});
			}
		} catch {
			setSelected(null);
		}
	}, []);

	const runSearch = useCallback(
		async (q: string) => {
			setQuery(q);
			if (!q.trim()) {
				setSearching(false);
				load();
				return;
			}
			setSearching(true);
			try {
				const r = await apiGet<{ emails: Email[] }>(API.email.search(q));
				setEmails(r.emails || []);
			} catch {
				setEmails([]);
			}
		},
		[load],
	);

	const sendEmail = useCallback(async () => {
		if (!compose.to || !compose.subject || !compose.body) return;
		setSending(true);
		try {
			await apiPost(API.email.send, compose);
			setSaved(`Sent to ${compose.to}`);
			setCompose({ to: "", subject: "", body: "" });
			setTimeout(() => setSaved(""), 3500);
		} catch {
			setSaved("Send failed — is email-mcp running and configured?");
			setTimeout(() => setSaved(""), 3500);
		} finally {
			setSending(false);
		}
	}, [compose]);

	const online = status?.reachable;

	return (
		<div className="space-y-8 page-enter" data-testid="email-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Email
					</h1>
					<p className="text-slate-300 mt-2 text-sm">
						Inbox, search, and send — via the fleet email-mcp gateway
					</p>
				</div>
				<div className="flex items-center gap-4">
					{status && (
						<div
							className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
								online
									? "bg-emerald-500/10 border-emerald-500/30"
									: "bg-amber-500/10 border-amber-500/30"
							}`}
							data-testid="email-status"
						>
							{online ? (
								<CheckCircle2 className="w-4 h-4 text-emerald-400" />
							) : (
								<AlertTriangle className="w-4 h-4 text-amber-400" />
							)}
							<span
								className={`text-xs font-black uppercase tracking-widest ${online ? "text-emerald-400" : "text-amber-400"}`}
							>
								{online ? "email-mcp connected" : "email-mcp offline"}
							</span>
						</div>
					)}
					<button
						type="button"
						onClick={() => load()}
						className="p-2 rounded-xl text-slate-300 hover:text-white transition-colors"
						title="Refresh"
					>
						<RefreshCw className="w-4 h-4" />
					</button>
				</div>
			</div>

			{status?.error && (
				<p
					className="text-sm text-slate-300 uppercase tracking-widest"
					data-testid="email-error"
				>
					{status.error}
				</p>
			)}

			{saved && (
				<p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
					{saved}
				</p>
			)}

			{stats && (stats.unread !== undefined || stats.total !== undefined) && (
				<div className="flex gap-4">
					{stats.unread !== undefined && (
						<div
							className="glass-card px-5 py-3"
							data-testid="kpi-email-unread"
						>
							<p className="text-sm font-black text-slate-300 uppercase tracking-widest">
								Unread
							</p>
							<p className="text-2xl font-black text-cosmos-400">
								{stats.unread}
							</p>
						</div>
					)}
					{stats.total !== undefined && (
						<div className="glass-card px-5 py-3" data-testid="kpi-email-total">
							<p className="text-sm font-black text-slate-300 uppercase tracking-widest">
								Total
							</p>
							<p className="text-2xl font-black text-emerald-400">
								{stats.total}
							</p>
						</div>
					)}
				</div>
			)}

			{loading ? (
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			) : (
				<>
					{/* Compose + status KPIs */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="glass-card p-6">
							<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
								<Send className="w-4 h-4 text-emerald-400" /> Compose
							</h2>
							<div className="space-y-3">
								<input
									data-testid="email-to"
									placeholder="To"
									value={compose.to}
									onChange={(e) =>
										setCompose({ ...compose, to: e.target.value })
									}
									className="input-dark"
								/>
								<input
									data-testid="email-subject"
									placeholder="Subject"
									value={compose.subject}
									onChange={(e) =>
										setCompose({ ...compose, subject: e.target.value })
									}
									className="input-dark"
								/>
								<textarea
									data-testid="email-body"
									placeholder="Body…"
									rows={6}
									value={compose.body}
									onChange={(e) =>
										setCompose({ ...compose, body: e.target.value })
									}
									className="input-dark resize-none"
								/>
								<button
									data-testid="email-send"
									type="button"
									onClick={sendEmail}
									disabled={
										sending ||
										!online ||
										!compose.to ||
										!compose.subject ||
										!compose.body
									}
									className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-black uppercase tracking-widest transition-colors"
								>
									{sending ? "Sending…" : "Send"}
								</button>
							</div>
						</div>

						<div className="lg:col-span-2 space-y-4">
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
								<input
									data-testid="email-search"
									placeholder="Search mail…"
									value={query}
									onChange={(e) => runSearch(e.target.value)}
									className="input-dark w-full pl-12 py-3"
								/>
							</div>

							{selected ? (
								<div className="glass-card p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="min-w-0">
											<p className="text-sm font-black text-white uppercase tracking-tight">
												{String(selected.subject ?? "Untitled")}
											</p>
											<p className="text-sm text-slate-300 mt-1">
												{String(selected.from ?? "")} ·{" "}
												{fmtDate(String(selected.date ?? ""))}
											</p>
										</div>
										<button
											type="button"
											onClick={() => setSelected(null)}
											className="text-xs font-black uppercase tracking-widest text-cosmos-400 shrink-0"
										>
											Close
										</button>
									</div>
									<p className="text-sm text-slate-300 mt-4 whitespace-pre-wrap leading-relaxed">
										{String(selected.body ?? selected.snippet ?? "(no body)")}
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{emails.map((e) => (
										<button
											key={e.id}
											type="button"
											onClick={() => openEmail(e.id)}
											className="glass-card w-full px-5 py-4 text-left hover:border-white/20 transition-colors"
											data-testid={`email-row-${e.id}`}
										>
											<div className="flex items-center justify-between gap-4">
												<p
													className={`text-sm truncate ${e.read ? "text-slate-300" : "font-black text-white"}`}
												>
													{e.read ? (
														<MailOpen className="w-3.5 h-3.5 inline mr-2 text-slate-300" />
													) : (
														<Mail className="w-3.5 h-3.5 inline mr-2 text-cosmos-400" />
													)}
													{e.subject || "(no subject)"}
												</p>
												<span className="text-xs text-slate-300 font-bold uppercase tracking-widest shrink-0">
													{fmtDate(e.date)}
												</span>
											</div>
											<p className="text-sm text-slate-300 mt-1 truncate">
												{e.from}
											</p>
										</button>
									))}
									{emails.length === 0 && (
										<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8">
											{searching ? "No mail found" : "Inbox empty"}
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</>
			)}

			<p className="text-sm text-slate-300 uppercase tracking-widest flex items-center gap-2">
				<MailQuestion className="w-3.5 h-3.5" />
				Gateway: email-mcp :10813 (credentials + Graph token stay there) · MCP:
				vienna_email(operation=status|inbox|search|send|mark_read)
			</p>
		</div>
	);
}
