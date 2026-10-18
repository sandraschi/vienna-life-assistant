import { Bus, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface Chapter {
	title: string;
	body: string;
}

interface Link {
	name: string;
	address: string;
	notes?: string;
	tags?: string[];
	source?: string;
	verify?: boolean;
	url?: string;
}

interface TransportResponse {
	chapters: Chapter[];
	links: Link[];
	fetched_on: string;
	sources: Record<string, string>;
}

export default function Transport() {
	const [data, setData] = useState<TransportResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [appMsg, setAppMsg] = useState("");

	const openWlApp = async () => {
		try {
			const r = await fetch("http://127.0.0.1:10896/health");
			if (r.ok) {
				window.open("http://127.0.0.1:10896", "_blank");
				return;
			}
			throw new Error("down");
		} catch {
			setAppMsg("Starte Wiener-Linien-App …");
			try {
				await fetch("/api/fleet/start", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: "mywienerlinien" }),
				});
				setAppMsg("Startet — in ~1 Minute erneut klicken.");
			} catch {
				setAppMsg("Start fehlgeschlagen.");
			}
		}
	};

	useEffect(() => {
		fetch("/api/vienna/verkehr")
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
		return <div className="p-8 text-white">Catching the connection...</div>;
	if (!data) return <div className="p-8 text-white">No transport data.</div>;

	return (
		<div
			data-testid="transport-page"
			className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<div>
				<h1
					data-testid="transport-title"
					className="text-4xl font-black gradient-text tracking-tighter uppercase italic"
				>
					Wien Verkehr ({data.links.length})
				</h1>
				<p className="text-slate-300 mt-2 font-medium tracking-tight">
					Verifiziert {data.fetched_on}. Quellen:{" "}
					{Object.values(data.sources).join(" · ")}
				</p>
				<div className="mt-4 flex items-center gap-3">
					<button
						type="button"
						onClick={openWlApp}
						className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black uppercase tracking-widest transition-colors"
					>
						Wiener-Linien-App öffnen
					</button>
					{appMsg && (
						<span className="text-sm text-slate-300 italic">{appMsg}</span>
					)}
				</div>
			</div>

			{data.chapters.map((ch) => (
				<article key={ch.title} className="glass-card p-8">
					<div className="flex items-center gap-2 mb-2">
						<Bus className="w-4 h-4 text-cyan-400" />
						<h2 className="text-2xl font-black text-white uppercase tracking-tight">
							{ch.title}
						</h2>
					</div>
					<p className="text-slate-200 leading-relaxed">{ch.body}</p>
				</article>
			))}

			<div>
				<h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
					Linien, Tickets, Asphalt ({data.links.length})
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{data.links.map((s) => (
						<div key={s.name} className="glass-card p-6">
							<h3 className="text-xl font-bold text-white uppercase tracking-tight">
								{s.name}
							</h3>
							<p className="text-sm text-slate-300 mt-2 flex items-center gap-1.5">
								<MapPin className="w-3.5 h-3.5 shrink-0" />
								{s.address}
								{s.verify && <span className="italic">(verify)</span>}
							</p>
							{s.notes && (
								<p className="text-sm text-slate-200 mt-3 leading-relaxed">
									{s.notes}
								</p>
							)}
							{s.url && (
								<a
									href={s.url}
									target="_blank"
									rel="noreferrer"
									className="text-sm mt-2 inline-flex items-center gap-1 text-sky-300 underline underline-offset-4"
								>
									Web
								</a>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
