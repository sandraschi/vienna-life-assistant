import { Plug } from "lucide-react";
import { useEffect, useState } from "react";

interface Bridge {
	name: string;
	purpose: string;
	port: number;
	frontend: number | null;
	feeds: string;
	status: string;
}

interface CrossconnectsResponse {
	bridges: Bridge[];
}

export default function Crossconnects() {
	const [data, setData] = useState<CrossconnectsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [msg, setMsg] = useState<Record<string, string>>({});

	const load = () => {
		fetch("/api/vienna/crossconnects")
			.then((res) => res.json())
			.then((json) => {
				setData(json);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	};

	useEffect(load, []);

	const start = async (name: string) => {
		setMsg((m) => ({ ...m, [name]: "Startet …" }));
		try {
			const r = await fetch("/api/fleet/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			setMsg((m) => ({
				...m,
				[name]: r.ok
					? "Startet — in ~1 Minute Seite neu laden."
					: "Start fehlgeschlagen.",
			}));
		} catch {
			setMsg((m) => ({ ...m, [name]: "Start fehlgeschlagen." }));
		}
	};

	if (loading)
		return <div className="p-8 text-white">Prüfe Anbindungen...</div>;
	if (!data) return <div className="p-8 text-white">Keine Daten.</div>;

	return (
		<div
			data-testid="crossconnects-page"
			className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<div>
				<h1
					data-testid="crossconnects-title"
					className="text-4xl font-black gradient-text tracking-tighter uppercase italic"
				>
					Anbindungen ({data.bridges.length})
				</h1>
				<p className="text-slate-300 mt-2 font-medium tracking-tight">
					Fleet-Bridges: was ViLife füttert — grün lebt, grau starten.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{data.bridges.map((b) => (
					<div key={b.name} className="glass-card p-6">
						<div className="flex items-start justify-between mb-3">
							<div className="p-3 rounded-2xl bg-white/[0.03] text-slate-200">
								<Plug className="w-5 h-5" />
							</div>
							<span
								className={`text-sm font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
									b.status === "live"
										? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
										: "bg-slate-500/10 text-slate-400 border-white/[0.08]"
								}`}
							>
								{b.status}
							</span>
						</div>
						<h3 className="text-xl font-bold text-white tracking-tight">
							{b.name}
						</h3>
						<p className="text-sm text-slate-200 mt-2 leading-relaxed">
							{b.purpose}
						</p>
						<p className="text-sm text-slate-400 mt-1">
							Port {b.port}
							{b.frontend ? ` · Webapp :${b.frontend}` : ""} · speist {b.feeds}
						</p>
						<div className="flex items-center gap-3 mt-4">
							{b.frontend && b.status === "live" && (
								<a
									href={`http://127.0.0.1:${b.frontend}`}
									target="_blank"
									rel="noreferrer"
									className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black uppercase tracking-widest transition-colors"
								>
									Öffnen
								</a>
							)}
							{b.status !== "live" && (
								<button
									type="button"
									onClick={() => start(b.name)}
									className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-black uppercase tracking-widest transition-colors"
								>
									Starten
								</button>
							)}
							{msg[b.name] && (
								<span className="text-sm text-slate-300 italic">
									{msg[b.name]}
								</span>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
