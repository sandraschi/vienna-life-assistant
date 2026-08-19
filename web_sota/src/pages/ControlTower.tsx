import { Cpu, Gauge, RefreshCw, Server, Ship } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API, apiGet } from "../lib/api";

type FleetShip = {
	id: string;
	name: string;
	health: string;
	category: string;
	frontend_port: number;
	backend_port: number;
	url: string | null;
};

type WinService = {
	name: string;
	state: string;
	nssm: boolean;
	app_name: string | null;
};

type ControlTowerPayload = {
	generated_at: string;
	cached_for: number;
	services: {
		summary: { total: number; online: number | null; quarantined: number };
		ships: FleetShip[];
	};
	windows_services: {
		items: WinService[];
		nssm_count: number;
		naked_count: number;
		running_count: number;
		source_ok: boolean;
	};
	goliath: {
		cpu: { util: number; load_1m: number | null; source_ok: boolean };
		ram: { used_gb: number; total_gb: number; pressure_pct: number };
		gpu: {
			util_pct: number;
			vram_used_gb: number;
			vram_total_gb: number;
			temp_c: number;
		} | null;
		verdict: { label: string; reason: string };
		top_processes: { name: string; cpu_percent: number }[];
		source_ok: boolean;
	};
	source_health: Record<string, string>;
};

const sourceColor = (status: string) =>
	status === "ok"
		? "bg-emerald-500"
		: status === "offline"
			? "bg-red-500"
			: "bg-amber-500";

const verdictColor = (label: string) =>
	label === "choking"
		? "text-red-400 border-red-500/40"
		: label === "busy"
			? "text-amber-400 border-amber-500/40"
			: label === "idle"
				? "text-slate-300 border-slate-500/40"
				: "text-sky-400 border-sky-500/40";

export default function ControlTower() {
	const [data, setData] = useState<ControlTowerPayload | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const load = useCallback(async (force: number) => {
		setLoading(true);
		setError("");
		try {
			const json = await apiGet<ControlTowerPayload>(
				API.controlTower(1, force),
			);
			setData(json);
		} catch (e) {
			setError(e instanceof Error ? e.message : "control tower failed");
			setData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load(0);
		const interval = setInterval(() => load(0), 30000);
		return () => clearInterval(interval);
	}, [load]);

	const svc = data?.services;
	const ws = data?.windows_services;
	const g = data?.goliath;

	return (
		<div data-testid="control-tower" className="space-y-10 page-enter">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<Gauge className="w-8 h-8 text-cosmos-400" />
						<h1 className="text-4xl font-black gradient-text uppercase italic tracking-tighter">
							Control Tower
						</h1>
					</div>
					<p className="text-slate-300 text-sm font-medium uppercase tracking-widest">
						What is running, what my agent does, what Goliath is doing - one
						screen
					</p>
				</div>
				<div className="flex items-center gap-3">
					{data?.generated_at && (
						<span className="text-xs font-mono text-slate-500">
							{new Date(data.generated_at).toLocaleTimeString()}
						</span>
					)}
					<button
						type="button"
						onClick={() => void load(1)}
						className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-sm font-black uppercase tracking-widest hover:bg-white/[0.1] transition-all"
					>
						<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
						Refresh
					</button>
				</div>
			</div>

			{data?.source_health && (
				<div className="flex flex-wrap items-center gap-4">
					{Object.entries(data.source_health).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300"
							data-testid={`ct-source-${k}`}
						>
							<span className={`w-2 h-2 rounded-full ${sourceColor(v)}`} />
							{k}
						</div>
					))}
				</div>
			)}

			{error && (
				<p className="text-sm font-bold text-red-400 uppercase tracking-widest">
					{error}
				</p>
			)}
			{loading && !data && (
				<p className="text-slate-300 text-sm uppercase tracking-widest font-bold">
					Assembling the tower…
				</p>
			)}

			{data && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Services */}
					<Link
						to="/fleet"
						data-testid="ct-services"
						className="glass-card p-6 flex flex-col gap-4 hover:border-white/20 transition-all"
					>
						<div className="flex items-center gap-3">
							<Ship className="w-5 h-5 text-cosmos-400" />
							<h3 className="text-sm font-black text-white uppercase tracking-tight">
								Services
							</h3>
						</div>
						<div className="grid grid-cols-3 gap-3">
							<div>
								<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
									Registered
								</p>
								<p className="text-2xl font-black text-white">
									{svc?.summary.total ?? "—"}
								</p>
							</div>
							<div>
								<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
									Online
								</p>
								<p className="text-2xl font-black text-emerald-400">
									{svc?.summary.online ?? "—"}
								</p>
							</div>
							<div>
								<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
									Offline
								</p>
								<p className="text-2xl font-black text-red-400">
									{svc?.summary.total && svc?.summary.online != null
										? svc.summary.total - svc.summary.online
										: "—"}
								</p>
							</div>
						</div>
						<p className="text-xs text-slate-400">
							Fleet registry + live health. Full view:{" "}
							<span className="text-cosmos-400">Fleet Command</span> and{" "}
							<span className="text-cosmos-400">Services</span>.
						</p>
					</Link>

					{/* Windows services */}
					<Link
						to="/services"
						data-testid="ct-windows-services"
						className="glass-card p-6 flex flex-col gap-4 hover:border-white/20 transition-all"
					>
						<div className="flex items-center gap-3">
							<Server className="w-5 h-5 text-cosmos-400" />
							<h3 className="text-sm font-black text-white uppercase tracking-tight">
								Windows services
							</h3>
						</div>
						{ws?.source_ok ? (
							<div className="grid grid-cols-3 gap-3">
								<div>
									<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
										Running
									</p>
									<p className="text-2xl font-black text-emerald-400">
										{ws.running_count}
									</p>
								</div>
								<div>
									<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
										NSSM
									</p>
									<p className="text-2xl font-black text-amber-400">
										{ws.nssm_count}
									</p>
								</div>
								<div>
									<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
										Naked
									</p>
									<p className="text-2xl font-black text-white">
										{ws.naked_count}
									</p>
								</div>
							</div>
						) : (
							<p className="text-sm text-red-400">
								Win32_Service probe offline
							</p>
						)}
						<p className="text-xs text-slate-400">
							NSSM = service managed by the NSSM wrapper (restart-safe).
						</p>
					</Link>

					{/* Goliath PC */}
					<Link
						to="/goliath"
						data-testid="ct-goliath"
						className="glass-card p-6 flex flex-col gap-4 hover:border-white/20 transition-all"
					>
						<div className="flex items-center gap-3">
							<Cpu className="w-5 h-5 text-cosmos-400" />
							<h3 className="text-sm font-black text-white uppercase tracking-tight">
								Goliath PC
							</h3>
						</div>
						{g?.source_ok ? (
							<>
								<div className="space-y-2">
									<Bar label="CPU" value={g.cpu.util} />
									<Bar label="RAM" value={g.ram.pressure_pct} />
									{g.gpu && <Bar label="GPU" value={g.gpu.util_pct} />}
								</div>
								<div className="flex items-center justify-between">
									<span className="text-xs font-mono text-slate-400">
										{g.ram.used_gb}/{g.ram.total_gb} GB ·{" "}
										{g.gpu
											? `${g.gpu.vram_used_gb}/${g.gpu.vram_total_gb} GB VRAM`
											: "no GPU"}
									</span>
									<span
										data-testid="ct-goliath-verdict"
										className={`rounded-xl border px-3 py-1 text-xs font-black uppercase tracking-widest ${verdictColor(g.verdict.label)}`}
									>
										{g.verdict.label}
									</span>
								</div>
								{g.top_processes[0] && (
									<p className="text-xs text-slate-400">
										Top: {g.top_processes[0].name} (
										{g.top_processes[0].cpu_percent}%)
									</p>
								)}
							</>
						) : (
							<p className="text-sm text-red-400">Goliath probe offline</p>
						)}
					</Link>
				</div>
			)}
		</div>
	);
}

function Bar({ label, value }: { label: string; value: number }) {
	const color =
		value >= 85
			? "bg-red-500"
			: value >= 50
				? "bg-amber-500"
				: "bg-emerald-500";
	return (
		<div>
			<div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-300 mb-1">
				<span>{label}</span>
				<span>{Math.round(value)}%</span>
			</div>
			<div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
				<div
					className={`h-full rounded-full ${color} transition-all`}
					style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
				/>
			</div>
		</div>
	);
}
