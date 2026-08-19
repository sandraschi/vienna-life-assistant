import {
	Cpu,
	Gauge,
	RefreshCw,
	Server,
	ShieldAlert,
	Ship,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API, apiGet, apiPost } from "../lib/api";

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

type Orphan = {
	pid: number;
	ppid: number;
	parent_alive: boolean;
	name: string;
	cmdline: string;
	started: string | null;
	age_seconds: number | null;
	established: number;
};

type OrphanScan = {
	source_ok: boolean;
	total_orphans: number | null;
	total_established: number | null;
	orphans: Orphan[];
	checked_at?: string;
	killed?: number[];
	error?: string;
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
	const [orphans, setOrphans] = useState<OrphanScan | null>(null);
	const [expandedPid, setExpandedPid] = useState<number | null>(null);
	const [busy, setBusy] = useState(false);
	const [orphanMsg, setOrphanMsg] = useState("");

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

	const loadOrphans = useCallback(async (fresh = 0) => {
		try {
			setOrphans(await apiGet<OrphanScan>(API.controlTowerOrphans(fresh)));
		} catch (e) {
			setOrphans({
				source_ok: false,
				total_orphans: null,
				total_established: null,
				orphans: [],
				error: e instanceof Error ? e.message : "orphan scan failed",
			});
		}
	}, []);

	const refreshAll = useCallback(() => {
		void load(1);
		void loadOrphans(1);
	}, [load, loadOrphans]);

	useEffect(() => {
		load(0);
		loadOrphans(0);
		const interval = setInterval(() => {
			load(0);
			loadOrphans(0);
		}, 30000);
		return () => clearInterval(interval);
	}, [load, loadOrphans]);

	const killOne = async (pid: number) => {
		if (!window.confirm(`Kill orphaned MCP server PID ${pid}?`)) return;
		setBusy(true);
		setOrphanMsg("");
		try {
			const res = await apiPost<OrphanScan>(
				API.controlTowerOrphanKill(pid),
				undefined,
				true,
			);
			setOrphans(res);
			setExpandedPid(null);
			setOrphanMsg(`Killed PID ${pid}`);
		} catch (e) {
			setOrphanMsg(
				`Kill failed: ${e instanceof Error ? e.message : String(e)}`,
			);
		} finally {
			setBusy(false);
		}
	};

	const reapAll = async () => {
		if (!window.confirm("Kill ALL orphaned MCP servers on Goliath?")) return;
		setBusy(true);
		setOrphanMsg("");
		try {
			const res = await apiPost<OrphanScan>(
				API.controlTowerOrphanReap,
				undefined,
				true,
			);
			setOrphans(res);
			setOrphanMsg(`Reap complete. ${res.killed?.length ?? 0} killed.`);
		} catch (e) {
			setOrphanMsg(
				`Reap failed: ${e instanceof Error ? e.message : String(e)}`,
			);
		} finally {
			setBusy(false);
		}
	};

	const svc = data?.services;
	const ws = data?.windows_services;
	const g = data?.goliath;
	const orphanList = orphans?.orphans ?? [];
	const orphanCount = orphans?.total_orphans ?? orphanList.length;

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
						<span className="text-sm font-mono text-slate-400">
							{new Date(data.generated_at).toLocaleTimeString()}
						</span>
					)}
					<button
						type="button"
						onClick={refreshAll}
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
							className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-300"
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
					{svc ? (
						<>
							<div className="grid grid-cols-3 gap-4">
								<div>
									<p className="text-xs font-bold text-slate-300 uppercase tracking-wide whitespace-nowrap">
										Registered
									</p>
									<p className="text-2xl font-black text-white">
										{svc.summary.total ?? "—"}
									</p>
								</div>
								<div>
									<p className="text-xs font-bold text-slate-300 uppercase tracking-wide whitespace-nowrap">
										Online
									</p>
									<p className="text-2xl font-black text-emerald-400">
										{svc.summary.online ?? "—"}
									</p>
								</div>
								<div>
									<p className="text-xs font-bold text-slate-300 uppercase tracking-wide whitespace-nowrap">
										Offline
									</p>
									<p className="text-2xl font-black text-red-400">
										{svc.summary.total && svc.summary.online != null
											? svc.summary.total - svc.summary.online
											: "—"}
									</p>
								</div>
							</div>
							<p className="text-sm text-slate-400">
								Fleet registry + live health. Full view:{" "}
								<span className="text-cosmos-400">Fleet Command</span> and{" "}
								<span className="text-cosmos-400">Services</span>.
							</p>
						</>
					) : (
						<p className="text-sm text-slate-400">
							Fleet registry unavailable — backend offline.
						</p>
					)}
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
						<div className="grid grid-cols-3 gap-4">
							<div>
								<p className="text-xs font-bold text-slate-300 uppercase tracking-wide whitespace-nowrap">
									Running
								</p>
								<p className="text-2xl font-black text-emerald-400">
									{ws.running_count}
								</p>
							</div>
							<div>
								<p className="text-xs font-bold text-slate-300 uppercase tracking-wide whitespace-nowrap">
									NSSM
								</p>
								<p className="text-2xl font-black text-amber-400">
									{ws.nssm_count}
								</p>
							</div>
							<div>
								<p className="text-xs font-bold text-slate-300 uppercase tracking-wide whitespace-nowrap">
									Naked
								</p>
								<p className="text-2xl font-black text-white">
									{ws.naked_count}
								</p>
							</div>
						</div>
					) : (
						<p className="text-sm text-red-400">Win32_Service probe offline</p>
					)}
					<p className="text-sm text-slate-400">
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
								<span className="text-sm font-mono text-slate-400">
									{g.ram.used_gb}/{g.ram.total_gb} GB ·{" "}
									{g.gpu
										? `${g.gpu.vram_used_gb}/${g.gpu.vram_total_gb} GB VRAM`
										: "no GPU"}
								</span>
								<span
									data-testid="ct-goliath-verdict"
									className={`rounded-xl border px-3 py-1 text-sm font-black uppercase tracking-widest ${verdictColor(g.verdict.label)}`}
								>
									{g.verdict.label}
								</span>
							</div>
							{g.top_processes[0] && (
								<p className="text-sm text-slate-400">
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

			{/* Orphaned MCP servers */}
			<div className="glass-card p-6" data-testid="ct-orphans">
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4 mb-4">
					<div className="flex items-center gap-3">
						<ShieldAlert className="w-6 h-6 text-amber-400" />
						<h3 className="text-sm font-black text-white uppercase tracking-tight">
							Orphaned MCP servers
						</h3>
						<span
							data-testid="ct-orphans-count"
							className={`rounded-xl border px-3 py-1 text-sm font-black uppercase tracking-widest ${
								orphanCount > 0
									? "text-amber-400 border-amber-500/40"
									: "text-emerald-400 border-emerald-500/40"
							}`}
						>
							{orphans ? `${orphanCount} orphan(s)` : "…"}
						</span>
						<span className="text-sm font-mono text-slate-400">
							{orphans ? `${orphans.total_established ?? 0} ESTABLISHED` : ""}
						</span>
					</div>
					<div className="flex items-center gap-3">
						{orphanMsg && (
							<span className="text-sm font-bold text-emerald-400">
								{orphanMsg}
							</span>
						)}
						<button
							type="button"
							onClick={() => void loadOrphans(1)}
							disabled={busy}
							className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-xs font-black uppercase tracking-widest hover:bg-white/[0.1] transition-all disabled:opacity-50"
						>
							<RefreshCw className={`w-3 h-3 ${busy ? "animate-spin" : ""}`} />
							Scan
						</button>
						<button
							type="button"
							onClick={() => void reapAll()}
							disabled={busy || orphanList.length === 0}
							className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-black uppercase tracking-widest text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-40"
						>
							<Trash2 className="w-3 h-3" />
							Reap all ({orphanList.length})
						</button>
					</div>
				</div>

				{orphans && !orphans.source_ok && (
					<p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">
						Scan error: {orphans.error}
					</p>
				)}

				{orphanList.length === 0 ? (
					<p className="text-sm text-emerald-400">
						{orphans ? "No orphaned MCP servers. Clean." : "Scanning…"}
					</p>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-xs text-slate-500 font-black uppercase tracking-widest border-b border-white/[0.06]">
								<th className="py-2 pr-2">PID</th>
								<th className="py-2 pr-2">Name</th>
								<th className="py-2 pr-2">Age</th>
								<th className="py-2 pr-2">Sockets</th>
								<th className="py-2 pr-2">Command</th>
								<th className="py-2">Kill</th>
							</tr>
						</thead>
						<tbody>
							{orphanList.map((o) => (
								<OrphanRow
									key={o.pid}
									orphan={o}
									expanded={expandedPid === o.pid}
									busy={busy}
									onToggle={() =>
										setExpandedPid(expandedPid === o.pid ? null : o.pid)
									}
									onKill={() => void killOne(o.pid)}
								/>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}

function fmtAge(secs: number | null): string {
	if (secs === null || secs === undefined) return "?";
	if (secs < 60) return `${Math.round(secs)}s`;
	if (secs < 3600) return `${Math.round(secs / 60)}m`;
	if (secs < 86400) return `${(secs / 3600).toFixed(1)}h`;
	return `${(secs / 86400).toFixed(1)}d`;
}

function OrphanRow({
	orphan,
	expanded,
	busy,
	onToggle,
	onKill,
}: {
	orphan: Orphan;
	expanded: boolean;
	busy: boolean;
	onToggle: () => void;
	onKill: () => void;
}) {
	const shortCmd =
		orphan.cmdline.length > 80
			? `${orphan.cmdline.slice(0, 80)}…`
			: orphan.cmdline;
	return (
		<>
			<tr
				onClick={onToggle}
				className="border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer"
			>
				<td className="py-2 pr-2 font-mono text-xs">{orphan.pid}</td>
				<td className="py-2 pr-2">{orphan.name}</td>
				<td className="py-2 pr-2">{fmtAge(orphan.age_seconds)}</td>
				<td className="py-2 pr-2">
					<span
						className={
							orphan.established > 500 ? "text-amber-400" : "text-slate-300"
						}
					>
						{orphan.established}
					</span>
				</td>
				<td className="py-2 pr-2 font-mono text-xs text-slate-400">
					{shortCmd}
				</td>
				<td className="py-2">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onKill();
						}}
						disabled={busy}
						className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-black uppercase tracking-widest text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-40"
					>
						<Trash2 className="w-3 h-3" />
						Kill
					</button>
				</td>
			</tr>
			{expanded && (
				<tr className="border-b border-white/[0.04] bg-black/30">
					<td colSpan={6} className="py-3 px-2">
						<dl className="grid gap-1 text-xs font-mono">
							<Detail label="Command" value={orphan.cmdline} />
							<Detail label="PID" value={String(orphan.pid)} />
							<Detail label="Parent PID" value={String(orphan.ppid)} />
							<Detail
								label="Parent alive"
								value={String(orphan.parent_alive)}
							/>
							<Detail label="Started" value={orphan.started ?? "unknown"} />
							<Detail label="Age" value={fmtAge(orphan.age_seconds)} />
							<Detail
								label="ESTABLISHED sockets"
								value={String(orphan.established)}
							/>
						</dl>
					</td>
				</tr>
			)}
		</>
	);
}

function Detail({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<span className="text-slate-500">{label}: </span>
			<span className="text-slate-300 break-all">{value}</span>
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
			<div className="flex justify-between text-sm font-black uppercase tracking-widest text-slate-300 mb-1">
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
