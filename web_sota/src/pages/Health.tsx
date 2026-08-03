import {
	Activity,
	HeartPulse,
	Loader2,
	Pill,
	Plus,
	RefreshCw,
	Stethoscope,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../lib/api";

type Visit = {
	id: number;
	date: string;
	doctor: string;
	specialty: string;
	reason: string;
	diagnosis: string;
	notes: string;
	follow_up_date: string;
	done: boolean;
};
type Medication = {
	id: number;
	name: string;
	dose: string;
	unit: string;
	frequency: string;
	times: string;
	with_food: boolean;
	start_date: string;
	end_date: string;
	refill_date: string;
	active: boolean;
	notes: string;
};
type Vitals = {
	id: number;
	date: string;
	time: string;
	systolic: number;
	diastolic: number;
	pulse: number;
	weight_kg: number;
	notes: string;
};
type Condition = {
	id: number;
	name: string;
	status: string;
	since: string;
	notes: string;
};

const today = () => new Date().toISOString().slice(0, 10);

export default function Health() {
	const [tab, setTab] = useState<"visits" | "meds" | "vitals">("visits");
	const [visits, setVisits] = useState<Visit[]>([]);
	const [meds, setMeds] = useState<Medication[]>([]);
	const [vitals, setVitals] = useState<Vitals[]>([]);
	const [conditions, setConditions] = useState<Condition[]>([]);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState("");

	const [visitForm, setVisitForm] = useState({
		date: today(),
		doctor: "",
		specialty: "",
		reason: "",
		follow_up_date: "",
	});
	const [medForm, setMedForm] = useState({
		name: "",
		dose: "",
		unit: "",
		frequency: "",
		times: "",
		refill_date: "",
		active: true,
	});
	const [vitalsForm, setVitalsForm] = useState({
		systolic: 120,
		diastolic: 80,
		pulse: 70,
		weight_kg: 0,
	});

	const load = useCallback(() => {
		setLoading(true);
		Promise.all([
			apiGet<{ items: Visit[] }>(API.life.visits),
			apiGet<{ items: Medication[] }>(API.life.medications),
			apiGet<{ items: Vitals[] }>(API.life.vitals),
			apiGet<{ items: Condition[] }>(API.life.conditions),
		])
			.then(([v, m, vt, c]) => {
				setVisits(v.items || []);
				setMeds(m.items || []);
				setVitals(vt.items || []);
				setConditions(c.items || []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	useEffect(load, [load]);

	const addVisit = useCallback(async () => {
		if (!visitForm.doctor || !visitForm.date) return;
		const r = await apiPost<{ item: Visit }>(API.life.visits, visitForm);
		setVisits((p) => [r.item, ...p]);
		setVisitForm({
			date: today(),
			doctor: "",
			specialty: "",
			reason: "",
			follow_up_date: "",
		});
		setSaved("Visit logged");
		setTimeout(() => setSaved(""), 2500);
	}, [visitForm]);

	const addMed = useCallback(async () => {
		if (!medForm.name) return;
		const r = await apiPost<{ item: Medication }>(
			API.life.medications,
			medForm,
		);
		setMeds((p) => [...p, r.item]);
		setMedForm({
			name: "",
			dose: "",
			unit: "",
			frequency: "",
			times: "",
			refill_date: "",
			active: true,
		});
		setSaved("Medication added");
		setTimeout(() => setSaved(""), 2500);
	}, [medForm]);

	const addVitals = useCallback(async () => {
		const r = await apiPost<{ item: Vitals }>(API.life.vitals, {
			date: today(),
			...vitalsForm,
		});
		setVitals((p) => [r.item, ...p]);
		setSaved("Vitals recorded");
		setTimeout(() => setSaved(""), 2500);
	}, [vitalsForm]);

	const activeMeds = meds.filter((m) => m.active);

	return (
		<div className="space-y-8 page-enter" data-testid="health-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Health
					</h1>
					<p className="text-slate-400 mt-2 text-sm">
						Doctor visits, medications, vitals — your medical status, one
						surface
					</p>
				</div>
				<div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
					{(
						[
							["visits", "Visits", Stethoscope],
							["meds", "Medications", Pill],
							["vitals", "Vitals", Activity],
						] as const
					).map(([key, label, Icon]) => (
						<button
							key={key}
							type="button"
							data-testid={`health-tab-${key}`}
							onClick={() => setTab(key)}
							className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${
								tab === key
									? "bg-cosmos-500 text-white"
									: "text-slate-400 hover:text-white"
							}`}
						>
							<Icon className="w-4 h-4" /> {label}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="glass-card p-5">
					<p className="text-xs font-black text-white uppercase tracking-widest mb-1">
						Active medications
					</p>
					<p
						className="text-3xl font-black text-emerald-400"
						data-testid="kpi-active-meds"
					>
						{activeMeds.length}
					</p>
					<p className="text-xs text-slate-400 mt-1">
						{activeMeds.map((m) => m.name).join(", ") || "None"}
					</p>
				</div>
				<div className="glass-card p-5">
					<p className="text-xs font-black text-white uppercase tracking-widest mb-1">
						Next follow-up
					</p>
					<p
						className="text-3xl font-black text-cosmos-400"
						data-testid="kpi-next-visit"
					>
						{visits
							.filter((v) => v.follow_up_date && !v.done)
							.sort((a, b) =>
								a.follow_up_date.localeCompare(b.follow_up_date),
							)[0]?.follow_up_date ?? "—"}
					</p>
					<p className="text-xs text-slate-400 mt-1">
						Conditions:{" "}
						{conditions.map((c) => c.name).join(" · ") || "None tracked"}
					</p>
				</div>
				<div className="glass-card p-5">
					<p className="text-xs font-black text-white uppercase tracking-widest mb-1">
						Latest vitals
					</p>
					<p
						className="text-3xl font-black text-amber-400"
						data-testid="kpi-latest-vitals"
					>
						{vitals[0] ? `${vitals[0].systolic}/${vitals[0].diastolic}` : "—"}
					</p>
					<p className="text-xs text-slate-400 mt-1">
						{vitals[0]
							? `pulse ${vitals[0].pulse} · ${vitals[0].weight_kg ? `${vitals[0].weight_kg} kg` : "no weight"} · ${vitals[0].date}`
							: "No readings yet"}
					</p>
				</div>
			</div>

			{saved && (
				<p
					className="text-sm text-emerald-400 font-bold uppercase tracking-widest"
					data-testid="health-saved"
				>
					{saved}
				</p>
			)}

			{loading ? (
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			) : (
				<div className="space-y-6">
					{tab === "visits" && (
						<>
							<div className="glass-card p-6">
								<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
									<Plus className="w-4 h-4 text-cosmos-400" /> Log a doctor
									visit
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
									<input
										data-testid="visit-date"
										type="date"
										value={visitForm.date}
										onChange={(e) =>
											setVisitForm({ ...visitForm, date: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="visit-doctor"
										placeholder="Doctor"
										value={visitForm.doctor}
										onChange={(e) =>
											setVisitForm({ ...visitForm, doctor: e.target.value })
										}
										className="input-dark md:col-span-2"
									/>
									<input
										data-testid="visit-specialty"
										placeholder="Specialty"
										value={visitForm.specialty}
										onChange={(e) =>
											setVisitForm({ ...visitForm, specialty: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="visit-followup"
										type="date"
										title="Follow-up date"
										value={visitForm.follow_up_date}
										onChange={(e) =>
											setVisitForm({
												...visitForm,
												follow_up_date: e.target.value,
											})
										}
										className="input-dark"
									/>
									<input
										data-testid="visit-reason"
										placeholder="Reason"
										value={visitForm.reason}
										onChange={(e) =>
											setVisitForm({ ...visitForm, reason: e.target.value })
										}
										className="input-dark md:col-span-4"
									/>
									<button
										data-testid="visit-add"
										onClick={addVisit}
										className="px-4 py-2 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 text-white text-xs font-black uppercase tracking-widest"
									>
										Log visit
									</button>
								</div>
							</div>
							<div className="space-y-3">
								{visits.map((v) => (
									<div
										key={v.id}
										className="glass-card p-6 flex flex-col md:flex-row md:items-start gap-4"
									>
										<div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
											<Stethoscope className="w-5 h-5 text-cosmos-400" />
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between gap-4">
												<p className="text-sm font-black text-white uppercase tracking-tight">
													{v.doctor}
												</p>
												<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
													{v.date}
												</span>
											</div>
											<p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
												{v.specialty}
												{v.reason ? ` · ${v.reason}` : ""}
											</p>
											{v.diagnosis && (
												<p className="text-sm text-slate-300 mt-2">
													{v.diagnosis}
												</p>
											)}
											{v.follow_up_date && (
												<p className="text-xs text-amber-400 mt-2 font-bold uppercase tracking-widest">
													Follow-up: {v.follow_up_date}
												</p>
											)}
										</div>
									</div>
								))}
								{visits.length === 0 && (
									<p className="text-sm text-slate-500 uppercase tracking-widest text-center py-8">
										No visits logged
									</p>
								)}
							</div>
						</>
					)}

					{tab === "meds" && (
						<>
							<div className="glass-card p-6">
								<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
									<Plus className="w-4 h-4 text-emerald-400" /> Add medication
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-6 gap-3">
									<input
										data-testid="med-name"
										placeholder="Name"
										value={medForm.name}
										onChange={(e) =>
											setMedForm({ ...medForm, name: e.target.value })
										}
										className="input-dark md:col-span-2"
									/>
									<input
										data-testid="med-dose"
										placeholder="Dose (e.g. 10)"
										value={medForm.dose}
										onChange={(e) =>
											setMedForm({ ...medForm, dose: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="med-unit"
										placeholder="Unit (mg)"
										value={medForm.unit}
										onChange={(e) =>
											setMedForm({ ...medForm, unit: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="med-frequency"
										placeholder="Frequency (1x daily)"
										value={medForm.frequency}
										onChange={(e) =>
											setMedForm({ ...medForm, frequency: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="med-times"
										placeholder="Times (08:00,20:00)"
										value={medForm.times}
										onChange={(e) =>
											setMedForm({ ...medForm, times: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="med-refill"
										type="date"
										title="Refill date"
										value={medForm.refill_date}
										onChange={(e) =>
											setMedForm({ ...medForm, refill_date: e.target.value })
										}
										className="input-dark"
									/>
									<button
										data-testid="med-add"
										onClick={addMed}
										className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest md:col-span-6 justify-self-start"
									>
										Add medication
									</button>
								</div>
							</div>
							<div className="space-y-3">
								{meds.map((m) => (
									<div
										key={m.id}
										className={`glass-card p-6 flex items-start gap-4 ${m.active ? "" : "opacity-50"}`}
									>
										<div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
											<Pill
												className={`w-5 h-5 ${m.active ? "text-emerald-400" : "text-slate-500"}`}
											/>
										</div>
										<div className="flex-1">
											<p className="text-sm font-black text-white uppercase tracking-tight">
												{m.name}{" "}
												{m.dose && (
													<span className="text-emerald-400">
														{m.dose}
														{m.unit ? ` ${m.unit}` : ""}
													</span>
												)}
											</p>
											<p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
												{m.frequency || "as needed"}
												{m.times ? ` · ${m.times}` : ""}
												{m.with_food ? " · with food" : ""}
											</p>
											{m.refill_date && (
												<p className="text-xs text-amber-400 mt-1 font-bold uppercase tracking-widest">
													Refill: {m.refill_date}
												</p>
											)}
										</div>
										<span
											className={`text-xs font-black uppercase tracking-widest ${m.active ? "text-emerald-400" : "text-slate-500"}`}
										>
											{m.active ? "Active" : "Stopped"}
										</span>
									</div>
								))}
								{meds.length === 0 && (
									<p className="text-sm text-slate-500 uppercase tracking-widest text-center py-8">
										No medications tracked
									</p>
								)}
							</div>
						</>
					)}

					{tab === "vitals" && (
						<>
							<div className="glass-card p-6">
								<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
									<Plus className="w-4 h-4 text-amber-400" /> Record vitals
								</h2>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									<label className="flex flex-col gap-1">
										<span className="text-xs text-slate-400 uppercase tracking-widest">
											Systolic
										</span>
										<input
											data-testid="vitals-sys"
											type="number"
											value={vitalsForm.systolic}
											onChange={(e) =>
												setVitalsForm({
													...vitalsForm,
													systolic: +e.target.value,
												})
											}
											className="input-dark"
										/>
									</label>
									<label className="flex flex-col gap-1">
										<span className="text-xs text-slate-400 uppercase tracking-widest">
											Diastolic
										</span>
										<input
											data-testid="vitals-dia"
											type="number"
											value={vitalsForm.diastolic}
											onChange={(e) =>
												setVitalsForm({
													...vitalsForm,
													diastolic: +e.target.value,
												})
											}
											className="input-dark"
										/>
									</label>
									<label className="flex flex-col gap-1">
										<span className="text-xs text-slate-400 uppercase tracking-widest">
											Pulse
										</span>
										<input
											data-testid="vitals-pulse"
											type="number"
											value={vitalsForm.pulse}
											onChange={(e) =>
												setVitalsForm({ ...vitalsForm, pulse: +e.target.value })
											}
											className="input-dark"
										/>
									</label>
									<label className="flex flex-col gap-1">
										<span className="text-xs text-slate-400 uppercase tracking-widest">
											Weight (kg)
										</span>
										<input
											data-testid="vitals-weight"
											type="number"
											step="0.1"
											value={vitalsForm.weight_kg || ""}
											onChange={(e) =>
												setVitalsForm({
													...vitalsForm,
													weight_kg: +e.target.value,
												})
											}
											className="input-dark"
										/>
									</label>
									<button
										data-testid="vitals-add"
										onClick={addVitals}
										className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-widest col-span-2 md:col-span-4 justify-self-start"
									>
										Record
									</button>
								</div>
							</div>
							<div className="space-y-2">
								{vitals.map((v) => (
									<div
										key={v.id}
										className="glass-card px-6 py-4 flex items-center gap-6"
									>
										<Activity className="w-5 h-5 text-amber-400" />
										<p className="text-sm font-black text-white tabular-nums">
											{v.systolic}/{v.diastolic}
											<span className="text-slate-400 font-normal ml-2">
												mmHg
											</span>
										</p>
										<p className="text-sm text-slate-300 tabular-nums">
											♥ {v.pulse}
										</p>
										{v.weight_kg > 0 && (
											<p className="text-sm text-slate-300 tabular-nums">
												{v.weight_kg} kg
											</p>
										)}
										<span className="ml-auto text-xs text-slate-400 uppercase tracking-widest">
											{v.date} {v.time}
										</span>
									</div>
								))}
								{vitals.length === 0 && (
									<p className="text-sm text-slate-500 uppercase tracking-widest text-center py-8">
										No readings yet
									</p>
								)}
							</div>
						</>
					)}
				</div>
			)}

			<div className="flex items-center justify-between">
				<p className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
					<HeartPulse className="w-3.5 h-3.5" /> MCP:
					vienna_health(operation=visits|meds|vitals) · REST /api/life/health/*
				</p>
				<button
					onClick={load}
					className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
					title="Refresh"
					data-testid="health-refresh"
				>
					<RefreshCw className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
