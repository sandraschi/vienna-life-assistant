import { Cpu, MemoryStick, MonitorCog, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { API, apiGet } from "../lib/api";

type GoliathPayload = {
	cpu: {
		cores: number;
		threads: number;
		util: number;
		per_core: number[];
		load_1m: number | null;
		source_ok: boolean;
		error?: string;
	};
	ram: { used_gb: number; total_gb: number; pressure_pct: number };
	gpu: {
		name: string;
		util_pct: number;
		vram_used_gb: number;
		vram_total_gb: number;
		temp_c: number;
		power_w: number;
		apps: { pid: number; name: string; vram_gb: number }[];
	} | null;
	verdict: { label: string; reason: string };
	top_processes: {
		pid: number;
		name: string;
		cpu_percent: number;
		memory_percent: number;
	}[];
	gpu_apps: { pid: number; name: string; vram_gb: number }[];
	source_ok: boolean;
};

const verdictStyles: Record<string, string> = {
	choking: "text-red-400 border-red-500/40 bg-red-500/10",
	busy: "text-amber-400 border-amber-500/40 bg-amber-500/10",
	underutilized: "text-sky-400 border-sky-500/40 bg-sky-500/10",
	idle: "text-slate-300 border-slate-500/40 bg-slate-500/10",
};

const verdictHint: Record<string, string> = {
	choking:
		"Goliath is maxed out - CPU/GPU pinned and hot or RAM under pressure.",
	busy: "Goliath is working - decent utilization, headroom still available.",
	underutilized: "The 4090 is bored - far below capacity, plenty of headroom.",
	idle: "All quiet - nothing significant is running.",
};

export default function Goliath() {
	const [data, setData] = useState<GoliathPayload | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const load = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			setData(await apiGet<GoliathPayload>(API.goliath));
		} catch (e) {
			setError(e instanceof Error ? e.message : "goliath probe failed");
			setData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void load();
		const interval = setInterval(() => void load(), 15000);
		return () => clearInterval(interval);
	}, [load]);

	const cpu = data?.cpu;
	const gpu = data?.gpu;

	return (
		<div data-testid="goliath-page" className="space-y-10 page-enter">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<MonitorCog className="w-8 h-8 text-cosmos-400" />
						<h1 className="text-4xl font-black gradient-text uppercase italic tracking-tighter">
							Goliath PC
						</h1>
					</div>
					<p className="text-slate-300 text-sm font-medium uppercase tracking-widest">
						CPU · GPU · RAM - is it choking, busy, or bored?
					</p>
				</div>
				<button
					type="button"
					onClick={() => void load()}
					className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-sm font-black uppercase tracking-widest hover:bg-white/[0.1] transition-all"
				>
					<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
					Refresh
				</button>
			</div>

			{error && (
				<p className="text-sm font-bold text-red-400 uppercase tracking-widest">
					{error}
				</p>
			)}
			{loading && !data && (
				<p className="text-slate-300 text-sm uppercase tracking-widest font-bold">
					Reading the machine…
				</p>
			)}

			{data && (
				<>
					{/* Verdict */}
					<div
						data-testid="goliath-verdict"
						className={`rounded-2xl border p-6 ${verdictStyles[data.verdict.label] ?? verdictStyles.busy}`}
					>
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div>
								<p className="text-sm font-black uppercase tracking-widest opacity-80">
									Verdict
								</p>
								<p className="text-3xl font-black uppercase italic tracking-tighter">
									{data.verdict.label}
								</p>
								<p className="text-sm mt-1 opacity-90">
									{verdictHint[data.verdict.label] ?? data.verdict.reason}
								</p>
							</div>
							<p className="font-mono text-sm opacity-80">
								{data.verdict.reason}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* CPU */}
						<div data-testid="goliath-cpu" className="glass-card p-6 space-y-4">
							<div className="flex items-center gap-3">
								<Cpu className="w-5 h-5 text-cosmos-400" />
								<h3 className="text-sm font-black text-white uppercase tracking-tight">
									CPU
								</h3>
								<span className="ml-auto text-sm font-mono text-slate-400">
									{cpu?.cores} cores / {cpu?.threads} threads
								</span>
							</div>
							{cpu?.source_ok ? (
								<>
									<Gauge label="Utilization" value={cpu.util} />
									{cpu.load_1m != null && (
										<p className="text-sm text-slate-400">
											load 1m: {cpu.load_1m}
										</p>
									)}
									{cpu.per_core.length > 0 && (
										<div>
											<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2">
												Per core
											</p>
											<div className="grid grid-cols-4 gap-1.5">
												{cpu.per_core.map((c, i) => (
													<div
														// biome-ignore lint/suspicious/noArrayIndexKey: cores have no stable id
														key={i}
														className={`h-1.5 rounded-full ${c >= 85 ? "bg-red-500" : c >= 50 ? "bg-amber-500" : "bg-emerald-500/70"}`}
														title={`core ${i}: ${c}%`}
													/>
												))}
											</div>
										</div>
									)}
								</>
							) : (
								<p className="text-sm text-red-400">
									{cpu?.error ?? "CPU probe unavailable"}
								</p>
							)}
						</div>

						{/* RAM */}
						<div data-testid="goliath-ram" className="glass-card p-6 space-y-4">
							<div className="flex items-center gap-3">
								<MemoryStick className="w-5 h-5 text-cosmos-400" />
								<h3 className="text-sm font-black text-white uppercase tracking-tight">
									RAM
								</h3>
								<span className="ml-auto text-sm font-mono text-slate-400">
									{data.ram.used_gb}/{data.ram.total_gb} GB
								</span>
							</div>
							<Gauge
								label="Pressure"
								value={data.ram.pressure_pct}
								warn={data.ram.pressure_pct >= 85}
							/>
							{data.ram.pressure_pct >= 85 && (
								<p className="text-sm font-bold text-red-400 uppercase tracking-widest">
									High memory pressure - pagefile risk
								</p>
							)}
						</div>

						{/* GPU */}
						<div data-testid="goliath-gpu" className="glass-card p-6 space-y-4">
							<div className="flex items-center gap-3">
								<MonitorCog className="w-5 h-5 text-cosmos-400" />
								<h3 className="text-sm font-black text-white uppercase tracking-tight">
									GPU
								</h3>
								<span className="ml-auto text-sm font-mono text-slate-400">
									{gpu ? "RTX 4090" : "no GPU"}
								</span>
							</div>
							{gpu ? (
								<>
									<Gauge label="Utilization" value={gpu.util_pct} />
									<div className="grid grid-cols-3 gap-3 text-center">
										<MiniStat
											label="VRAM"
											value={`${gpu.vram_used_gb}/${gpu.vram_total_gb}GB`}
										/>
										<MiniStat label="Temp" value={`${gpu.temp_c}C`} />
										<MiniStat label="Power" value={`${gpu.power_w}W`} />
									</div>
									{gpu.apps.length > 0 && (
										<div>
											<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2">
												GPU processes
											</p>
											<ul className="space-y-0.5 text-sm text-slate-400">
												{gpu.apps.map((a) => (
													<li key={a.pid}>
														<span className="text-slate-300">{a.name}</span>{" "}
														(pid {a.pid}, {a.vram_gb} GB)
													</li>
												))}
											</ul>
										</div>
									)}
								</>
							) : (
								<p className="text-sm text-slate-400">
									nvidia-smi not detected (headless / driver missing).
								</p>
							)}
						</div>
					</div>

					{/* What is it doing right now */}
					<div className="glass-card p-6">
						<h3 className="text-sm font-black text-white uppercase tracking-tight mb-4">
							What is it doing right now?
						</h3>
						{data.top_processes.length === 0 && data.gpu_apps.length === 0 ? (
							<p className="text-sm text-slate-400">
								Nothing significant - the machine is idle.
							</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2">
										Top CPU
									</p>
									<ul className="space-y-1">
										{data.top_processes.slice(0, 6).map((p) => (
											<li
												key={p.pid}
												className="flex items-center justify-between text-sm"
											>
												<span className="text-slate-300">
													{p.name}{" "}
													<span className="text-slate-400">({p.pid})</span>
												</span>
												<span className="font-mono text-sm text-slate-400">
													{p.cpu_percent}%
												</span>
											</li>
										))}
									</ul>
								</div>
								{data.gpu_apps.length > 0 && (
									<div>
										<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2">
											On the GPU
										</p>
										<ul className="space-y-1">
											{data.gpu_apps.map((a) => (
												<li
													key={a.pid}
													className="flex items-center justify-between text-sm"
												>
													<span className="text-slate-300">
														{a.name}{" "}
														<span className="text-slate-400">({a.pid})</span>
													</span>
													<span className="font-mono text-sm text-slate-400">
														{a.vram_gb} GB VRAM
													</span>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

function Gauge({
	label,
	value,
	warn = false,
}: {
	label: string;
	value: number;
	warn?: boolean;
}) {
	const color =
		warn || value >= 85
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
			<div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
				<div
					className={`h-full rounded-full ${color} transition-all`}
					style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
				/>
			</div>
		</div>
	);
}

function MiniStat({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
			<p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
				{label}
			</p>
			<p className="text-sm font-bold text-white mt-1">{value}</p>
		</div>
	);
}
