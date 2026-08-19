import {
	Circle,
	Dog,
	Home as HomeIcon,
	Loader2,
	Plus,
	Repeat,
	Wrench,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiDelete, apiGet, apiPost, apiPut } from "../lib/api";

type Subscription = {
	id: number;
	name: string;
	category: string;
	cost_monthly_eur: number;
	renewal_date: string;
	url: string;
	auto_renew: boolean;
	notes: string;
};
type HomeTask = {
	id: number;
	name: string;
	category: string;
	due_date: string;
	frequency_days: number;
	done: boolean;
	notes: string;
};
type PetEvent = {
	id: number;
	pet_name: string;
	event_type: string;
	date: string;
	notes: string;
	next_due: string;
};

const today = () => new Date().toISOString().slice(0, 10);

export default function Household() {
	const [tab, setTab] = useState<"subs" | "tasks" | "pet">("subs");
	const [subs, setSubs] = useState<Subscription[]>([]);
	const [tasks, setTasks] = useState<HomeTask[]>([]);
	const [pet, setPet] = useState<PetEvent[]>([]);
	const [monthlyTotal, setMonthlyTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState("");

	const [subForm, setSubForm] = useState({
		name: "",
		category: "Media",
		cost_monthly_eur: 0,
		renewal_date: "",
		auto_renew: true,
	});
	const [taskForm, setTaskForm] = useState({
		name: "",
		category: "Maintenance",
		due_date: today(),
		frequency_days: 0,
	});
	const [petForm, setPetForm] = useState({
		pet_name: "Benny",
		event_type: "vet",
		date: "",
		next_due: "",
	});

	const load = useCallback(() => {
		setLoading(true);
		Promise.all([
			apiGet<{ items: Subscription[]; monthly_total_eur?: number }>(
				API.life.subscriptions,
			),
			apiGet<{ items: HomeTask[] }>(API.life.homeTasks),
			apiGet<{ items: PetEvent[] }>(API.life.pet),
		])
			.then(([s, t, p]) => {
				setSubs(s.items || []);
				setMonthlyTotal(s.monthly_total_eur ?? 0);
				setTasks(t.items || []);
				setPet(p.items || []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	useEffect(load, [load]);

	const addSub = useCallback(async () => {
		if (!subForm.name) return;
		const r = await apiPost<{ item: Subscription }>(
			API.life.subscriptions,
			subForm,
		);
		setSubs((p) => [...p, r.item]);
		setSubForm({
			name: "",
			category: "Media",
			cost_monthly_eur: 0,
			renewal_date: "",
			auto_renew: true,
		});
		setSaved("Subscription added");
		setTimeout(() => setSaved(""), 2500);
	}, [subForm]);

	const addTask = useCallback(async () => {
		if (!taskForm.name) return;
		const r = await apiPost<{ item: HomeTask }>(API.life.homeTasks, taskForm);
		setTasks((p) => [...p, r.item]);
		setTaskForm({
			name: "",
			category: "Maintenance",
			due_date: today(),
			frequency_days: 0,
		});
		setSaved("Home task added");
		setTimeout(() => setSaved(""), 2500);
	}, [taskForm]);

	const addPet = useCallback(async () => {
		if (!petForm.event_type) return;
		const r = await apiPost<{ item: PetEvent }>(API.life.pet, petForm);
		setPet((p) => [...p, r.item]);
		setPetForm({
			pet_name: "Benny",
			event_type: "vet",
			date: "",
			next_due: "",
		});
		setSaved("Pet care event added");
		setTimeout(() => setSaved(""), 2500);
	}, [petForm]);

	const toggleTask = useCallback(async (t: HomeTask) => {
		const r = await apiPut<{ item: HomeTask }>(
			`${API.life.homeTasks}/${t.id}`,
			{ done: !t.done },
		);
		setTasks((p) => p.map((x) => (x.id === t.id ? r.item : x)));
	}, []);

	const deleteSub = useCallback(async (s: Subscription) => {
		await apiDelete(`${API.life.subscriptions}/${s.id}`);
		setSubs((p) => p.filter((x) => x.id !== s.id));
	}, []);

	const dueTasks = tasks
		.filter((t) => !t.done)
		.sort((a, b) => a.due_date.localeCompare(b.due_date));
	const petUpcoming = pet
		.filter((p) => p.next_due)
		.sort((a, b) => a.next_due.localeCompare(b.next_due));

	return (
		<div className="space-y-8 page-enter" data-testid="household-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Household
					</h1>
					<p className="text-slate-300 mt-2 text-sm">
						Subscriptions, home maintenance, and pet care — the silent costs of
						life
					</p>
				</div>
				<div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
					{(
						[
							["subs", "Subscriptions", Repeat],
							["tasks", "Home tasks", Wrench],
							["pet", "Pet care", Dog],
						] as const
					).map(([key, label, Icon]) => (
						<button
							key={key}
							type="button"
							onClick={() => setTab(key)}
							className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${
								tab === key
									? "bg-cosmos-500 text-white"
									: "text-slate-300 hover:text-white"
							}`}
						>
							<Icon className="w-4 h-4" /> {label}
						</button>
					))}
				</div>
			</div>

			{saved && (
				<p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
					{saved}
				</p>
			)}

			{loading ? (
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			) : (
				<div className="space-y-6">
					{tab === "subs" && (
						<>
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
								<div className="glass-card p-5">
									<p className="text-sm font-black text-white uppercase tracking-widest mb-1">
										Monthly total
									</p>
									<p
										className="text-3xl font-black text-emerald-400"
										data-testid="kpi-subscriptions-total"
									>
										€{monthlyTotal.toFixed(2)}
									</p>
								</div>
								<div className="glass-card p-5">
									<p className="text-sm font-black text-white uppercase tracking-widest mb-1">
										Subscriptions
									</p>
									<p
										className="text-3xl font-black text-cosmos-400"
										data-testid="kpi-subscriptions-count"
									>
										{subs.length}
									</p>
								</div>
								<div className="glass-card p-5">
									<p className="text-sm font-black text-white uppercase tracking-widest mb-1">
										Next renewal
									</p>
									<p className="text-3xl font-black text-amber-400">
										{subs
											.filter((s) => s.renewal_date)
											.sort((a, b) =>
												a.renewal_date.localeCompare(b.renewal_date),
											)[0]?.renewal_date ?? "—"}
									</p>
								</div>
							</div>
							<div className="glass-card p-6">
								<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
									<Plus className="w-4 h-4 text-emerald-400" /> Add subscription
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
									<input
										data-testid="sub-name"
										placeholder="Name"
										value={subForm.name}
										onChange={(e) =>
											setSubForm({ ...subForm, name: e.target.value })
										}
										className="input-dark md:col-span-2"
									/>
									<input
										data-testid="sub-category"
										placeholder="Category"
										value={subForm.category}
										onChange={(e) =>
											setSubForm({ ...subForm, category: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="sub-cost"
										type="number"
										step="0.01"
										placeholder="€/month"
										value={subForm.cost_monthly_eur || ""}
										onChange={(e) =>
											setSubForm({
												...subForm,
												cost_monthly_eur: +e.target.value,
											})
										}
										className="input-dark"
									/>
									<input
										data-testid="sub-renewal"
										type="date"
										title="Renewal date"
										value={subForm.renewal_date}
										onChange={(e) =>
											setSubForm({ ...subForm, renewal_date: e.target.value })
										}
										className="input-dark"
									/>
									<button
										type="button"
										data-testid="sub-add"
										onClick={addSub}
										className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest justify-self-start"
									>
										Add
									</button>
								</div>
							</div>
							<div className="space-y-3">
								{subs.map((s) => (
									<div
										key={s.id}
										className="glass-card px-6 py-4 flex items-center gap-4"
									>
										<div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
											<Repeat className="w-4 h-4 text-cosmos-400" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-black text-white uppercase tracking-tight">
												{s.name}
											</p>
											<p className="text-sm text-slate-300 uppercase tracking-widest">
												{s.category}
												{s.auto_renew ? " · auto-renew" : " · manual"}
											</p>
										</div>
										{s.renewal_date && (
											<span className="text-xs font-bold text-amber-400 uppercase tracking-widest hidden md:block">
												renews {s.renewal_date}
											</span>
										)}
										<span className="text-sm font-black text-emerald-400 tabular-nums">
											€{s.cost_monthly_eur.toFixed(2)}
										</span>
										<button
											onClick={() => deleteSub(s)}
											className="text-xs text-slate-300 hover:text-red-400 transition-colors uppercase tracking-widest"
											type="button"
											title="Delete"
										>
											×
										</button>
									</div>
								))}
								{subs.length === 0 && (
									<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8">
										No subscriptions tracked
									</p>
								)}
							</div>
						</>
					)}

					{tab === "tasks" && (
						<>
							<div className="glass-card p-6">
								<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
									<Plus className="w-4 h-4 text-amber-400" /> Add home task
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
									<input
										data-testid="task-name"
										placeholder="Task"
										value={taskForm.name}
										onChange={(e) =>
											setTaskForm({ ...taskForm, name: e.target.value })
										}
										className="input-dark md:col-span-2"
									/>
									<input
										data-testid="task-category"
										placeholder="Category (Safety/Kitchen…)"
										value={taskForm.category}
										onChange={(e) =>
											setTaskForm({ ...taskForm, category: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="task-due"
										type="date"
										value={taskForm.due_date}
										onChange={(e) =>
											setTaskForm({ ...taskForm, due_date: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="task-frequency"
										type="number"
										min="0"
										placeholder="Repeat every N days (0 = once)"
										value={taskForm.frequency_days || ""}
										onChange={(e) =>
											setTaskForm({
												...taskForm,
												frequency_days: +e.target.value,
											})
										}
										className="input-dark"
									/>
									<button
										type="button"
										data-testid="task-add"
										onClick={addTask}
										className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-widest justify-self-start"
									>
										Add
									</button>
								</div>
							</div>
							<div className="space-y-3">
								{dueTasks.map((t) => (
									<div
										key={t.id}
										className="glass-card px-6 py-4 flex items-center gap-4"
									>
										<button
											type="button"
											data-testid={`task-toggle-${t.id}`}
											onClick={() => toggleTask(t)}
											className="shrink-0"
										>
											<Circle className="w-5 h-5 text-slate-300 hover:text-emerald-400 transition-colors" />
										</button>
										<div className="flex-1">
											<p className="text-sm font-black text-white uppercase tracking-tight">
												{t.name}
											</p>
											<p className="text-sm text-slate-300 uppercase tracking-widest">
												{t.category}
												{t.frequency_days > 0
													? ` · every ${t.frequency_days}d`
													: " · one-off"}
											</p>
										</div>
										<span
											className={`text-xs font-bold uppercase tracking-widest ${t.due_date < today() ? "text-red-400" : "text-amber-400"}`}
										>
											{t.due_date < today() ? "OVERDUE" : t.due_date}
										</span>
									</div>
								))}
								{dueTasks.length === 0 && (
									<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8">
										All caught up
									</p>
								)}
							</div>
						</>
					)}

					{tab === "pet" && (
						<>
							<div className="glass-card p-6">
								<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
									<Plus className="w-4 h-4 text-emerald-400" /> Log pet care
									(Benny)
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
									<input
										data-testid="pet-type"
										placeholder="vet / vaccination / medication / grooming / walk"
										value={petForm.event_type}
										onChange={(e) =>
											setPetForm({ ...petForm, event_type: e.target.value })
										}
										className="input-dark md:col-span-2"
									/>
									<input
										data-testid="pet-date"
										type="date"
										title="Event date"
										value={petForm.date}
										onChange={(e) =>
											setPetForm({ ...petForm, date: e.target.value })
										}
										className="input-dark"
									/>
									<input
										data-testid="pet-next-due"
										type="date"
										title="Next due"
										value={petForm.next_due}
										onChange={(e) =>
											setPetForm({ ...petForm, next_due: e.target.value })
										}
										className="input-dark"
									/>
									<button
										type="button"
										data-testid="pet-add"
										onClick={addPet}
										className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest justify-self-start"
									>
										Log
									</button>
								</div>
							</div>
							<div className="space-y-3">
								{petUpcoming.map((p) => (
									<div
										key={p.id}
										className="glass-card px-6 py-4 flex items-center gap-4"
									>
										<div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
											<Dog className="w-4 h-4 text-emerald-400" />
										</div>
										<div className="flex-1">
											<p className="text-sm font-black text-white uppercase tracking-tight">
												{p.pet_name} — {p.event_type}
											</p>
											{p.notes && (
												<p className="text-sm text-slate-300 mt-1">{p.notes}</p>
											)}
										</div>
										<span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
											due {p.next_due}
										</span>
									</div>
								))}
								{petUpcoming.length === 0 && (
									<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8">
										No upcoming care events
									</p>
								)}
							</div>
						</>
					)}
				</div>
			)}

			<p className="text-sm text-slate-300 uppercase tracking-widest flex items-center gap-2">
				<HomeIcon className="w-3.5 h-3.5" /> MCP:
				vienna_household(operation=subscriptions|tasks|pet) · REST /api/life/*
			</p>
		</div>
	);
}
