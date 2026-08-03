import {
	AlertTriangle,
	Anchor,
	Circle,
	ExternalLink,
	Filter,
	RefreshCw,
	Ship,
} from "lucide-react";
import { useEffect, useState } from "react";

import { API, apiGet } from "../lib/api";

type FleetShip = {
	id: string;
	name: string;
	description: string;
	ship_class: string;
	category: string;
	status: string;
	frontend_port: number;
	backend_port: number;
	health: string;
	url: string | null;
};

type FleetOverview = {
	summary: {
		total: number;
		online: number | null;
		quarantined: number;
		categories: Record<string, number>;
		probed?: boolean;
	};
	ships: FleetShip[];
	ops_root?: string;
};

const CLASS_LABELS: Record<string, string> = {
	carrier: "Carrier",
	destroyer: "Destroyer",
	frigate: "Frigate",
	submarine: "Submarine",
	minesweeper: "Minesweeper",
	tender: "Tender",
};

const healthColor = (health: string) => {
	if (health === "online") return "bg-emerald-500";
	if (health === "degraded") return "bg-amber-500";
	if (health === "offline") return "bg-red-500";
	return "bg-slate-600";
};

export default function Fleet() {
	const [data, setData] = useState<FleetOverview | null>(null);
	const [loading, setLoading] = useState(true);
	const [probe, setProbe] = useState(false);
	const [filter, setFilter] = useState<string>("all");

	const load = async (withProbe: boolean) => {
		setLoading(true);
		try {
			const json = await apiGet<FleetOverview>(
				API.fleetOverview(withProbe ? 1 : 0),
			);
			setData(json);
		} catch (e) {
			console.error("Fleet overview failed", e);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load(probe);
	}, [probe]);

	const ships = data?.ships ?? [];
	const filtered =
		filter === "all"
			? ships
			: ships.filter((s) => s.ship_class === filter || s.category === filter);

	return (
		<div className="space-y-10 page-enter">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<Anchor className="w-8 h-8 text-cosmos-400" />
						<h1 className="text-4xl font-black gradient-text uppercase italic tracking-tighter">
							Fleet Command
						</h1>
					</div>
					<p className="text-slate-300 text-sm font-medium uppercase tracking-widest">
						Meta dashboard — jump to any MCP webapp (L3 above L2 destroyers)
					</p>
				</div>
				<div className="flex items-center gap-3">
					<label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer">
						<input
							type="checkbox"
							checked={probe}
							onChange={(e) => setProbe(e.target.checked)}
							className="rounded border-white/20"
						/>
						Health probe
					</label>
					<button
						type="button"
						onClick={() => load(probe)}
						className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-sm font-black uppercase tracking-widest hover:bg-white/[0.1] transition-all"
					>
						<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
						Refresh
					</button>
				</div>
			</div>

			{data?.summary && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="glass-card p-6">
						<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
							Registered
						</p>
						<p className="text-3xl font-black text-white mt-2">
							{data.summary.total}
						</p>
					</div>
					<div className="glass-card p-6">
						<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
							Online
						</p>
						<p className="text-3xl font-black text-emerald-400 mt-2">
							{data.summary.probed ? (data.summary.online ?? 0) : "—"}
						</p>
					</div>
					<div className="glass-card p-6">
						<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
							Quarantined
						</p>
						<p className="text-3xl font-black text-amber-400 mt-2">
							{data.summary.quarantined}
						</p>
					</div>
					<div className="glass-card p-6">
						<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
							Categories
						</p>
						<p className="text-3xl font-black text-cosmos-400 mt-2">
							{Object.keys(data.summary.categories).length}
						</p>
					</div>
				</div>
			)}

			<div className="flex flex-wrap gap-2 items-center">
				<Filter className="w-4 h-4 text-slate-300" />
				{[
					"all",
					"carrier",
					"destroyer",
					"frigate",
					"Media",
					"Creative",
					"Robotics",
					"Infra",
				].map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
							filter === f
								? "bg-cosmos-500/20 border-cosmos-500/40 text-white"
								: "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:text-white"
						}`}
					>
						{f}
					</button>
				))}
			</div>

			{loading && !data && (
				<p className="text-slate-300 text-sm uppercase tracking-widest font-bold">
					Loading fleet registry…
				</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{filtered.map((ship) => {
					const quarantined =
						ship.status === "quarantined" || ship.status === "archived";
					return (
						<div
							key={ship.id}
							className={`glass-card p-6 flex flex-col gap-4 ${
								quarantined
									? "opacity-50 border-amber-500/20"
									: "hover:border-white/20"
							} transition-all`}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
										<Ship className="w-5 h-5 text-cosmos-400" />
									</div>
									<div>
										<h3 className="text-sm font-black text-white uppercase tracking-tight">
											{ship.name}
										</h3>
										<p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
											{CLASS_LABELS[ship.ship_class] ?? ship.ship_class} ·{" "}
											{ship.category}
										</p>
									</div>
								</div>
								{data?.summary.probed && (
									<div className="flex items-center gap-2" title={ship.health}>
										<Circle
											className={`w-2 h-2 fill-current ${healthColor(ship.health)}`}
										/>
									</div>
								)}
							</div>

							<p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
								{ship.description}
							</p>

							<div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.04]">
								<span className="text-xs font-mono text-slate-300">
									{ship.frontend_port > 0
										? `:${ship.frontend_port}`
										: ship.backend_port > 0
											? `api :${ship.backend_port}`
											: "no port"}
								</span>
								{quarantined ? (
									<span className="flex items-center gap-1 text-xs font-black text-amber-500 uppercase">
										<AlertTriangle className="w-3 h-3" />
										{ship.status}
									</span>
								) : ship.url ? (
									<a
										href={ship.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 text-xs font-black text-cosmos-400 uppercase tracking-widest hover:text-white transition-colors"
									>
										Open <ExternalLink className="w-3 h-3" />
									</a>
								) : (
									<span className="text-xs text-slate-300 uppercase">
										stdio only
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{data?.ops_root && (
				<p className="text-xs text-slate-700 font-mono">
					Registry: {data.ops_root}
				</p>
			)}
		</div>
	);
}
