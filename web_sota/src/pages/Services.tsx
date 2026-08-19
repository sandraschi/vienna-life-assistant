import { RefreshCw, Server } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { API, apiGet } from "../lib/api";

type WinService = {
	name: string;
	display_name: string;
	state: string;
	start_mode: string;
	pid: number;
	nssm: boolean;
	path_name: string;
	app_name: string | null;
};

type ServicesPayload = {
	items: WinService[];
	nssm_count: number;
	naked_count: number;
	running_count: number;
	source_ok: boolean;
	error?: string;
};

const stateColor = (state: string) =>
	state.toLowerCase() === "running"
		? "bg-emerald-500"
		: state.toLowerCase() === "stopped"
			? "bg-red-500"
			: "bg-slate-600";

export default function Services() {
	const [data, setData] = useState<ServicesPayload | null>(null);
	const [loading, setLoading] = useState(true);
	const [stateFilter, setStateFilter] = useState<"all" | "running" | "stopped">(
		"all",
	);
	const [typeFilter, setTypeFilter] = useState<"all" | "nssm" | "naked">("all");

	const load = useCallback(async () => {
		setLoading(true);
		try {
			setData(await apiGet<ServicesPayload>(API.services));
		} catch {
			setData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	const rows = useMemo(() => {
		const items = data?.items ?? [];
		return items.filter((s) => {
			if (stateFilter === "running" && s.state.toLowerCase() !== "running")
				return false;
			if (stateFilter === "stopped" && s.state.toLowerCase() === "running")
				return false;
			if (typeFilter === "nssm" && !s.nssm) return false;
			if (typeFilter === "naked" && s.nssm) return false;
			return true;
		});
	}, [data, stateFilter, typeFilter]);

	const nssmRows = rows.filter((r) => r.nssm);

	return (
		<div data-testid="services-page" className="space-y-10 page-enter">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<Server className="w-8 h-8 text-cosmos-400" />
						<h1 className="text-4xl font-black gradient-text uppercase italic tracking-tighter">
							Services
						</h1>
					</div>
					<p className="text-slate-300 text-sm font-medium uppercase tracking-widest">
						Every Windows service - naked sc vs NSSM-managed (read-only)
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

			{data?.source_ok === false && (
				<p className="text-sm font-bold text-red-400 uppercase tracking-widest">
					{data.error ?? "Win32_Service probe failed"}
				</p>
			)}
			{loading && !data && (
				<p className="text-slate-300 text-sm uppercase tracking-widest font-bold">
					Enumerating services…
				</p>
			)}

			{data && (
				<>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<Stat label="Total" value={data.items.length} />
						<Stat
							label="Running"
							value={data.running_count}
							accent="text-emerald-400"
						/>
						<Stat
							label="NSSM"
							value={data.nssm_count}
							accent="text-amber-400"
						/>
						<Stat label="Naked" value={data.naked_count} />
					</div>

					<div className="flex flex-wrap gap-2 items-center">
						{(["all", "running", "stopped"] as const).map((f) => (
							<FilterChip
								key={f}
								active={stateFilter === f}
								onClick={() => setStateFilter(f)}
							>
								{f}
							</FilterChip>
						))}
						<span className="w-px h-5 bg-white/[0.08] mx-2" />
						{(["all", "nssm", "naked"] as const).map((f) => (
							<FilterChip
								key={f}
								active={typeFilter === f}
								onClick={() => setTypeFilter(f)}
							>
								{f}
							</FilterChip>
						))}
					</div>

					<div className="glass-card overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="border-b border-white/[0.06] text-xs font-black text-slate-300 uppercase tracking-widest">
									<th className="px-4 py-3">Service</th>
									<th className="px-4 py-3">State</th>
									<th className="px-4 py-3">Start</th>
									<th className="px-4 py-3">PID</th>
									<th className="px-4 py-3">Type</th>
									<th className="px-4 py-3">Path</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((s) => (
									<tr
										key={s.name}
										className="border-b border-white/[0.03] text-sm hover:bg-white/[0.02]"
									>
										<td className="px-4 py-2.5">
											<div className="font-bold text-white">{s.name}</div>
											{s.display_name !== s.name && (
												<div className="text-xs text-slate-500">
													{s.display_name}
												</div>
											)}
										</td>
										<td className="px-4 py-2.5">
											<div className="flex items-center gap-2">
												<span
													className={`w-2 h-2 rounded-full ${stateColor(s.state)}`}
												/>
												<span className="uppercase text-xs font-black text-slate-300">
													{s.state}
												</span>
											</div>
										</td>
										<td className="px-4 py-2.5 text-xs font-mono text-slate-400">
											{s.start_mode}
										</td>
										<td className="px-4 py-2.5 text-xs font-mono text-slate-400">
											{s.pid > 0 ? s.pid : "—"}
										</td>
										<td className="px-4 py-2.5">
											{s.nssm ? (
												<span
													data-testid="services-nssm-badge"
													className="rounded-lg bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-400"
												>
													NSSM
												</span>
											) : (
												<span className="text-xs text-slate-500 uppercase">
													sc
												</span>
											)}
										</td>
										<td className="px-4 py-2.5 font-mono text-[11px] text-slate-500 max-w-md truncate">
											{s.path_name || "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{rows.length === 0 && (
							<p className="p-6 text-sm text-slate-500">
								No services match the current filters.
							</p>
						)}
					</div>

					{nssmRows.length > 0 && (
						<div className="glass-card p-6">
							<h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-3">
								NSSM-managed services ({nssmRows.length})
							</h3>
							<p className="text-xs text-slate-400 leading-relaxed mb-3">
								NSSM wraps the service binary and restarts it on crash - restart
								via the service manager only (
								<code className="text-slate-300">sc.exe stop/start</code>),
								never by killing the child process. This page is read-only.
							</p>
							<ul className="space-y-1">
								{nssmRows.map((s) => (
									<li key={s.name} className="text-sm text-slate-300">
										<span className="text-amber-400">{s.name}</span>
										{s.app_name && (
											<span className="text-slate-500"> → {s.app_name}</span>
										)}
										<span className="text-slate-500"> · {s.state}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function Stat({
	label,
	value,
	accent = "text-white",
}: {
	label: string;
	value: number;
	accent?: string;
}) {
	return (
		<div className="glass-card p-6">
			<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
				{label}
			</p>
			<p className={`text-3xl font-black mt-2 ${accent}`}>{value}</p>
		</div>
	);
}

function FilterChip({
	children,
	active,
	onClick,
}: {
	children: React.ReactNode;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
				active
					? "bg-cosmos-500/20 border-cosmos-500/40 text-white"
					: "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:text-white"
			}`}
		>
			{children}
		</button>
	);
}
