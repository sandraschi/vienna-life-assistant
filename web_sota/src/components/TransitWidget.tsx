import { AlertCircle, Clock, MapPin, Train, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface Departure {
	line: string;
	destination: string;
	time: string;
	type: string;
}

interface TransitData {
	ok?: boolean;
	mock?: boolean;
	offline?: boolean;
	source?: string;
	Friedensbrücke?: Departure[];
	"Julius-Tandler-Platz"?: Departure[];
}

const META_KEYS = ["ok", "mock", "offline", "source"];

export default function TransitWidget() {
	const [data, setData] = useState<TransitData | null>(null);
	const [activeTab, setActiveTab] = useState<string>("Friedensbrücke");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/vienna/transport");
				const result = await response.json();
				setData(result);
				setLoading(false);
			} catch {
				setLoading(false);
			}
		};

		fetchData();
		const interval = setInterval(fetchData, 30000); // 30s poll
		return () => clearInterval(interval);
	}, []);

	if (loading)
		return (
			<div className="glass-card p-6 h-full flex flex-col justify-center items-center">
				<Zap className="w-8 h-8 text-cosmos-500 animate-pulse" />
				<p className="text-sm uppercase tracking-widest mt-4 font-bold text-slate-300">
					Connecting Wiener Linien...
				</p>
			</div>
		);

	if (!data) return null;

	const stations = Object.keys(data).filter((k) => !META_KEYS.includes(k));
	const currentDepartures =
		(stations.includes(activeTab)
			? (data[activeTab as keyof TransitData] as unknown as
					| Departure[]
					| undefined)
			: undefined) ?? [];
	const live = !data.offline && !data.mock;

	return (
		<div className="glass-card overflow-hidden flex flex-col">
			<div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
						<MapPin className="w-4 h-4" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-bold text-sm tracking-widest uppercase mb-0.5">
								Transit Monitor
							</h3>
							<span
								className={`px-2 py-0.5 rounded-full text-sm font-black uppercase tracking-widest border ${
									live
										? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
										: "bg-amber-500/10 border-amber-500/30 text-amber-400"
								}`}
							>
								{live ? "Live" : "Offline"}
							</span>
						</div>
						<p className="text-sm text-slate-300 font-medium">
							Wien departures
						</p>
					</div>
				</div>
			</div>

			{/* Station Tabs */}
			<div className="flex border-b border-white/[0.04]">
				{stations.map((station) => (
					<button
						type="button"
						key={station}
						onClick={() => setActiveTab(station)}
						className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
							activeTab === station
								? "border-emerald-500 text-white bg-white/[0.02]"
								: "border-transparent text-slate-300 hover:text-slate-300"
						}`}
					>
						{station}
					</button>
				))}
			</div>

			<div className="divide-y divide-white/[0.04] flex-1">
				{currentDepartures.length === 0 && (
					<p className="px-6 py-6 text-sm text-slate-300 leading-relaxed">
						{data.offline
							? "Keine Live-Daten: mywienerlinien und gtfs-mcp sind offline. Start in D:\\Dev\\repos\\mywienerlinien\\start.ps1 — erfundene Zeiten gibt es hier keine."
							: "Keine Abfahrten gefunden."}
					</p>
				)}
				{currentDepartures.map((departure, idx) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: line+dest repeats; idx disambiguates
						key={`${departure.line}-${departure.destination}-${idx}`}
						className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors flex items-center gap-4 group"
					>
						<div
							className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm ${
								departure.line === "U4"
									? "bg-emerald-600"
									: departure.line === "D"
										? "bg-red-600"
										: departure.line === "5"
											? "bg-orange-600"
											: departure.line === "12"
												? "bg-indigo-600"
												: "bg-slate-700"
							}`}
						>
							{departure.line}
						</div>

						<div className="flex-1">
							<p className="text-sm font-semibold text-white uppercase truncate">
								{departure.destination}
							</p>
							<div className="flex items-center gap-1.5 mt-0.5">
								{departure.type === "u-bahn" ? (
									<Train className="w-3 h-3 text-emerald-500" />
								) : (
									<Zap className="w-3 h-3 text-orange-400" />
								)}
								<span className="text-sm text-slate-300 font-medium tracking-wide uppercase">
									{departure.type}
								</span>
							</div>
						</div>

						<div className="text-right">
							<div className="flex items-center gap-1.5 text-emerald-400">
								<span className="text-sm font-bold">{departure.time}</span>
								<Clock className="w-3 h-3" />
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="p-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-center gap-2">
				<AlertCircle className="w-3 h-3 text-amber-500" />
				<span className="text-sm font-bold text-slate-300 uppercase tracking-widest">
					{data.offline
						? "Bridges offline"
						: (data.source ?? "Normal operation on all lines")}
				</span>
			</div>
		</div>
	);
}
