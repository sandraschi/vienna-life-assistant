import { Landmark, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";

interface Chapter {
	title: string;
	body: string;
}

interface TimelineEntry {
	year: string;
	event: string;
	source?: string;
}

interface HistoryResponse {
	chapters: Chapter[];
	timeline: TimelineEntry[];
	fetched_on: string;
	sources: Record<string, string>;
}

export default function History() {
	const [data, setData] = useState<HistoryResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/vienna/history")
			.then((res) => res.json())
			.then((json) => {
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, []);

	if (loading)
		return <div className="p-8 text-white">Turning the pages...</div>;
	if (!data) return <div className="p-8 text-white">No history data.</div>;

	return (
		<div
			data-testid="history-page"
			className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<div>
				<h1
					data-testid="history-title"
					className="text-4xl font-black gradient-text tracking-tighter uppercase italic"
				>
					Wien Geschichte
				</h1>
				<p className="text-slate-300 mt-2 font-medium tracking-tight">
					Von Vindobona bis Kreisky — recherchiert {data.fetched_on}. Quellen:{" "}
					{Object.values(data.sources).join(" · ")}
				</p>
			</div>

			<div className="space-y-6">
				{data.chapters.map((ch) => (
					<article key={ch.title} className="glass-card p-8">
						<div className="flex items-center gap-2 mb-2">
							<Landmark className="w-4 h-4 text-amber-400" />
							<h2 className="text-2xl font-black text-white uppercase tracking-tight">
								{ch.title}
							</h2>
						</div>
						<p className="text-slate-200 leading-relaxed">{ch.body}</p>
					</article>
				))}
			</div>

			<div>
				<h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
					Timeline ({data.timeline.length})
				</h2>
				<div className="glass-card p-6">
					<table className="w-full text-sm">
						<tbody>
							{data.timeline.map((t) => (
								<tr
									key={t.year}
									className="border-t border-white/[0.06] text-slate-200 first:border-0"
								>
									<td className="py-2 pr-4 font-black text-white whitespace-nowrap">
										<span className="inline-flex items-center gap-1.5">
											<ScrollText className="w-3.5 h-3.5 text-slate-400" />
											{t.year}
										</span>
									</td>
									<td className="py-2">
										{t.event}
										{t.source && (
											<span className="text-slate-400 italic">
												{" "}
												({t.source})
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
