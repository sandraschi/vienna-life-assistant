import {
	CheckCircle2,
	Circle,
	FileText,
	Loader2,
	MapPin,
	Plane,
	Plus,
	RefreshCw,
	Train,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost, apiPut } from "../lib/api";

type Trip = {
	id: number;
	title: string;
	start_date: string;
	end_date: string;
	destination: string;
	mode: string;
	carrier: string;
	origin: string;
	ref: string;
	status: string;
	notes: string;
};
type PackItem = { id: number; trip_id: number; item: string; done: boolean };
type TravelDoc = {
	id: number;
	name: string;
	number: string;
	expiry_date: string;
	notes: string;
};

const todayIso = () => new Date().toISOString().slice(0, 10);
const daysUntil = (d: string) =>
	Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

const statusColor: Record<string, string> = {
	booked: "text-emerald-400",
	planned: "text-amber-400",
	watchlist: "text-slate-300",
};

export default function Travel() {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [packing, setPacking] = useState<PackItem[]>([]);
	const [docs, setDocs] = useState<TravelDoc[]>([]);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState("");
	const [tripForm, setTripForm] = useState({
		title: "",
		start_date: todayIso(),
		end_date: "",
		destination: "",
		mode: "train",
		carrier: "ÖBB",
		status: "planned",
	});

	const load = useCallback(() => {
		setLoading(true);
		Promise.all([
			apiGet<{ trips: Trip[] }>(API.life.travelUpcoming),
			apiGet<{ items: PackItem[] }>(API.life.packing),
			apiGet<{ items: TravelDoc[] }>(API.life.documents),
		])
			.then(([t, p, d]) => {
				setTrips(t.trips || []);
				setPacking(p.items || []);
				setDocs(d.items || []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	useEffect(load, [load]);

	const addTrip = useCallback(async () => {
		if (!tripForm.title || !tripForm.start_date) return;
		const r = await apiPost<{ item: Trip }>(API.life.trips, tripForm);
		setTrips((p) =>
			[...p, r.item].sort((a, b) => a.start_date.localeCompare(b.start_date)),
		);
		setTripForm({
			title: "",
			start_date: todayIso(),
			end_date: "",
			destination: "",
			mode: "train",
			carrier: "ÖBB",
			status: "planned",
		});
		setSaved("Trip added");
		setTimeout(() => setSaved(""), 2500);
	}, [tripForm]);

	const addPackItem = useCallback(async (tripId: number) => {
		const item = prompt("Packing item:");
		if (!item) return;
		const r = await apiPost<{ item: PackItem }>(API.life.packing, {
			trip_id: tripId,
			item,
		});
		setPacking((p) => [...p, r.item]);
	}, []);

	const togglePack = useCallback(async (item: PackItem) => {
		const r = await apiPut<{ item: PackItem }>(
			`${API.life.packing}/${item.id}`,
			{ done: !item.done },
		);
		setPacking((p) => p.map((x) => (x.id === item.id ? r.item : x)));
	}, []);

	const docWarn = (d: string) => {
		const days = daysUntil(d);
		return days <= 60 ? "text-red-400" : "text-amber-400";
	};

	if (loading) {
		return <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />;
	}

	return (
		<div className="space-y-8 page-enter" data-testid="travel-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Travel
					</h1>
					<p className="text-slate-300 mt-2 text-sm">
						ÖBB, flights, packing, documents — from Vienna Hbf
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

			{saved && (
				<p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
					{saved}
				</p>
			)}

			<div className="glass-card p-6">
				<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
					<Plus className="w-4 h-4 text-cosmos-400" /> Plan a trip
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-6 gap-3">
					<input
						data-testid="trip-title"
						placeholder="Title"
						value={tripForm.title}
						onChange={(e) =>
							setTripForm({ ...tripForm, title: e.target.value })
						}
						className="input-dark md:col-span-2"
					/>
					<input
						data-testid="trip-start"
						type="date"
						value={tripForm.start_date}
						onChange={(e) =>
							setTripForm({ ...tripForm, start_date: e.target.value })
						}
						className="input-dark"
					/>
					<input
						data-testid="trip-end"
						type="date"
						value={tripForm.end_date}
						onChange={(e) =>
							setTripForm({ ...tripForm, end_date: e.target.value })
						}
						className="input-dark"
					/>
					<input
						data-testid="trip-destination"
						placeholder="Destination"
						value={tripForm.destination}
						onChange={(e) =>
							setTripForm({ ...tripForm, destination: e.target.value })
						}
						className="input-dark"
					/>
					<select
						data-testid="trip-mode"
						value={tripForm.mode}
						onChange={(e) => setTripForm({ ...tripForm, mode: e.target.value })}
						className="input-dark"
					>
						<option value="train">Train</option>
						<option value="flight">Flight</option>
						<option value="car">Car</option>
					</select>
					<button
						type="button"
						data-testid="trip-add"
						onClick={addTrip}
						className="px-4 py-2 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 text-white text-xs font-black uppercase tracking-widest justify-self-start"
					>
						Plan
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-4">
					{trips.map((trip) => {
						const days = daysUntil(trip.start_date);
						return (
							<div
								key={trip.id}
								className="glass-card p-8 flex gap-6 items-start"
							>
								<div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
									{trip.mode === "flight" ? (
										<Plane className="w-6 h-6 text-cosmos-400" />
									) : (
										<Train className="w-6 h-6 text-emerald-400" />
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="text-lg font-black text-white uppercase tracking-tight">
												{trip.title}
											</p>
											<p className="text-sm text-slate-300 mt-2 uppercase font-bold">
												{trip.start_date} → {trip.end_date || "TBA"}
											</p>
										</div>
										<div className="text-right">
											<span
												className={`text-xs font-black uppercase tracking-widest ${statusColor[trip.status] || "text-slate-300"}`}
											>
												{trip.status}
											</span>
											<p
												className={`text-xs font-black uppercase tracking-widest mt-1 ${days < 0 ? "text-slate-300" : days <= 3 ? "text-red-400" : "text-amber-400"}`}
											>
												{days < 0 ? "started" : `T-${days}`}
											</p>
										</div>
									</div>
									<p className="text-sm text-slate-300 mt-4 flex items-center gap-2">
										<MapPin className="w-3.5 h-3.5" />
										{trip.carrier || trip.mode}: {trip.origin || "Wien Hbf"} →{" "}
										{trip.destination || trip.title}
									</p>
									{trip.ref && (
										<p className="text-sm text-cosmos-400 mt-2 font-mono">
											Ref {trip.ref}
										</p>
									)}
									<div className="mt-4 flex flex-wrap gap-2">
										{packing
											.filter((p) => p.trip_id === trip.id)
											.map((item) => (
												<button
													type="button"
													key={item.id}
													onClick={() => togglePack(item)}
													className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${
														item.done
															? "text-slate-300 border-slate-700 bg-slate-900/40 line-through"
															: "text-slate-300 border-white/[0.08] hover:border-emerald-500/40 hover:text-emerald-400"
													}`}
												>
													{item.done ? (
														<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
													) : (
														<Circle className="w-3.5 h-3.5" />
													)}
													{item.item}
												</button>
											))}
										<button
											type="button"
											onClick={() => addPackItem(trip.id)}
											className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-dashed border-white/[0.15] text-slate-300 hover:text-white transition-colors"
										>
											<Plus className="w-3 h-3" /> item
										</button>
									</div>
								</div>
							</div>
						);
					})}
					{trips.length === 0 && (
						<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8">
							No upcoming trips
						</p>
					)}
				</div>

				<div className="space-y-6">
					<div className="glass-card p-8 space-y-4 h-fit">
						<h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
							<FileText className="w-4 h-4 text-cosmos-400" /> Documents
						</h2>
						{docs.map((d) => (
							<div
								key={d.id}
								className="flex items-center justify-between gap-3 text-sm"
							>
								<div>
									<p className="text-slate-300 font-bold uppercase tracking-tight text-sm">
										{d.name}
									</p>
									{d.number && (
										<p className="text-sm text-slate-300 font-mono">
											{d.number}
										</p>
									)}
								</div>
								<span
									className={`text-xs font-black uppercase tracking-widest ${docWarn(d.expiry_date)}`}
								>
									{daysUntil(d.expiry_date)}d
								</span>
							</div>
						))}
						{docs.length === 0 && (
							<p className="text-sm text-slate-300 uppercase tracking-widest">
								No documents tracked
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
