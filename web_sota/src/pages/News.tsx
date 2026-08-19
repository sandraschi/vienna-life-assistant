import {
	AlertTriangle,
	ArrowUpRight,
	Flame,
	Loader2,
	Newspaper,
	RefreshCw,
	Search,
	TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet } from "../lib/api";

type NewsItem = {
	id: number;
	title: string;
	url: string | null;
	summary: string;
	distilled_summary: string;
	urgency_score: number;
	relevance_score: number;
	tags: string;
	published_at: string;
	source?: string;
};

type Trend = { tag: string; count: number };

type Overview = {
	ok: boolean;
	upstream_ok: boolean;
	stats_payload: {
		active_feeds: number;
		total_items: number;
		items_last_24h: number;
		critical_items: number;
		degraded_feeds: number;
	};
	top: NewsItem[];
	trends: Trend[];
	morning: NewsItem[];
};

const fmtTime = (iso: string) => {
	try {
		return new Date(iso).toLocaleString("de-AT", {
			day: "2-digit",
			month: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return iso;
	}
};

const tagList = (tags: string) =>
	(tags || "")
		.replace(/[[\]"']/g, "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 4);

const urgencyColor = (s: number) =>
	s >= 8 ? "text-red-400" : s >= 5 ? "text-amber-400" : "text-slate-300";

export default function News() {
	const [data, setData] = useState<Overview | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<NewsItem[] | null>(null);

	const load = useCallback(() => {
		setLoading(true);
		setError("");
		apiGet<Overview>(API.news.overview)
			.then((d) => {
				if (!d.upstream_ok) {
					setError("aiwatcher is offline — news will return when it's back.");
				}
				setData(d);
			})
			.catch(() => setError("News service unreachable."))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const runSearch = useCallback(async (q: string) => {
		setQuery(q);
		if (!q.trim()) {
			setResults(null);
			return;
		}
		try {
			const r = await apiGet<{ items: NewsItem[] }>(API.news.search(q));
			setResults(r.items || []);
		} catch {
			setResults([]);
		}
	}, []);

	const stories = results ?? data?.top ?? [];

	return (
		<div className="space-y-8 page-enter" data-testid="news-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						News
					</h1>
					<p className="text-slate-300 mt-2 text-sm">
						Your personal news site — scored and distilled by the fleet
						aiwatcher engine
					</p>
				</div>
				<button
					type="button"
					onClick={load}
					className="p-2 rounded-xl text-slate-300 hover:text-white transition-colors"
					title="Refresh"
				>
					<RefreshCw className="w-4 h-4" />
				</button>
			</div>

			{error && (
				<div
					className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-300"
					data-testid="news-offline"
				>
					<AlertTriangle className="w-4 h-4 shrink-0" />
					{error}
				</div>
			)}

			{!error && data?.stats_payload && (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="glass-card p-5">
						<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-1">
							Last 24h
						</p>
						<p
							className="text-3xl font-black text-cosmos-400"
							data-testid="kpi-news-24h"
						>
							{data.stats_payload.items_last_24h ?? 0}
						</p>
						<p className="text-sm text-slate-300 mt-1">stories ingested</p>
					</div>
					<div className="glass-card p-5">
						<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-1">
							Feeds
						</p>
						<p
							className="text-3xl font-black text-emerald-400"
							data-testid="kpi-news-feeds"
						>
							{data.stats_payload.active_feeds ?? 0}
						</p>
						<p className="text-sm text-slate-300 mt-1">
							{data.stats_payload.degraded_feeds
								? `${data.stats_payload.degraded_feeds} degraded`
								: "all healthy"}
						</p>
					</div>
					<div className="glass-card p-5">
						<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-1">
							Critical
						</p>
						<p
							className="text-3xl font-black text-red-400"
							data-testid="kpi-news-critical"
						>
							{data.stats_payload.critical_items ?? 0}
						</p>
						<p className="text-sm text-slate-300 mt-1">high-urgency items</p>
					</div>
					<div className="glass-card p-5">
						<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-1">
							Archive
						</p>
						<p
							className="text-3xl font-black text-amber-400"
							data-testid="kpi-news-archive"
						>
							{data.stats_payload.total_items ?? 0}
						</p>
						<p className="text-sm text-slate-300 mt-1">items indexed</p>
					</div>
				</div>
			)}

			{data?.trends && data.trends.length > 0 && !results && (
				<div className="glass-card p-6">
					<h2 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
						<TrendingUp className="w-4 h-4 text-emerald-400" /> Trending this
						week
					</h2>
					<div className="flex flex-wrap gap-2">
						{data.trends.slice(0, 20).map((t) => (
							<button
								key={t.tag}
								type="button"
								onClick={() => runSearch(t.tag)}
								className="px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-cosmos-400 hover:border-cosmos-500/40 transition-colors"
								data-testid={`trend-${t.tag}`}
							>
								{t.tag} <span className="text-slate-300 ml-1">{t.count}</span>
							</button>
						))}
					</div>
				</div>
			)}

			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
				<input
					data-testid="news-search"
					placeholder="Search all 12,000+ indexed stories…"
					value={query}
					onChange={(e) => runSearch(e.target.value)}
					className="input-dark w-full pl-12 py-3"
				/>
			</div>

			{loading ? (
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-3">
						<h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
							<Flame className="w-4 h-4 text-amber-400" />
							{results ? `Search: ${query}` : "Top stories"}
						</h2>
						{stories.map((item) => (
							<a
								key={item.id}
								href={item.url ?? "#"}
								target={item.url ? "_blank" : undefined}
								rel={item.url ? "noopener noreferrer" : undefined}
								className={`block glass-card p-5 hover:border-white/20 transition-colors ${item.url ? "" : "cursor-default"}`}
							>
								<div className="flex items-start justify-between gap-3">
									<p className="text-sm font-bold text-white leading-relaxed">
										{item.title}
									</p>
									<span
										className={`text-sm font-black uppercase tracking-widest shrink-0 ${urgencyColor(item.urgency_score ?? 0)}`}
									>
										{(item.urgency_score ?? 0).toFixed(1)}
									</span>
								</div>
								<p className="text-sm text-slate-300 mt-2 line-clamp-2">
									{item.distilled_summary || item.summary}
								</p>
								<div className="flex items-center justify-between mt-3">
									<div className="flex flex-wrap gap-1.5">
										{tagList(item.tags).map((t) => (
											<span
												key={t}
												className="px-2 py-0.5 rounded-full text-sm font-bold uppercase tracking-widest bg-cosmos-500/10 border border-cosmos-500/20 text-cosmos-400"
											>
												{t}
											</span>
										))}
									</div>
									<span className="text-sm text-slate-300 font-bold uppercase tracking-widest shrink-0 ml-2">
										{fmtTime(item.published_at)}
									</span>
								</div>
								{item.url && (
									<span className="flex items-center gap-1 text-sm text-cosmos-400 uppercase tracking-widest mt-2">
										Open <ArrowUpRight className="w-3 h-3" />
									</span>
								)}
							</a>
						))}
						{stories.length === 0 && (
							<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8">
								No stories found
							</p>
						)}
					</div>

					{data?.morning && data.morning.length > 0 && !results && (
						<div className="space-y-3">
							<h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
								<Newspaper className="w-4 h-4 text-cosmos-400" /> Morning digest
							</h2>
							{data.morning.slice(0, 10).map((item) => (
								<div key={item.id} className="glass-card p-4">
									<p className="text-sm font-bold text-slate-200 leading-relaxed">
										{item.title}
									</p>
									{item.distilled_summary && (
										<p className="text-sm text-slate-300 mt-1 line-clamp-2">
											{item.distilled_summary}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<p className="text-sm text-slate-300 uppercase tracking-widest flex items-center gap-2">
				<Newspaper className="w-3.5 h-3.5" />
				Upstream: aiwatcher-mcp :10946 · MCP:
				vienna_news(operation=top|trends|search|morning) · REST /api/news/*
			</p>
		</div>
	);
}
