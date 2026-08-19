import { CreditCard, Loader2, Plus, Store, TrendingDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../lib/api";

type Category = { name: string; eur: number; pct: number };
type Summary = {
	total_eur: number;
	change_pct: number;
	top_store: string;
	budget_eur: number;
	categories: Category[];
};
type Expense = {
	id: string;
	date: string;
	store: string;
	amount_eur: number;
	category: string;
	note: string;
};

export default function Expenses() {
	const [summary, setSummary] = useState<Summary | null>(null);
	const [recent, setRecent] = useState<Expense[]>([]);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState("");
	const [form, setForm] = useState({
		date: new Date().toISOString().slice(0, 10),
		store: "",
		amount_eur: 0,
		category: "Other",
		note: "",
	});

	useEffect(() => {
		Promise.all([
			apiGet<Summary & { ok: boolean }>(API.life.expensesSummary),
			apiGet<{ expenses: Expense[] }>(API.life.expensesRecent),
		])
			.then(([s, r]) => {
				setSummary(s);
				setRecent(r.expenses || []);
			})
			.catch(() => {
				setSummary(null);
				setRecent([]);
			})
			.finally(() => setLoading(false));
	}, []);

	const addExpense = useCallback(async () => {
		if (!form.store || form.amount_eur <= 0) return;
		const r = await apiPost<{ item: Expense }>(API.life.expenses, form);
		setRecent((p) => [r.item, ...p]);
		setForm({
			date: new Date().toISOString().slice(0, 10),
			store: "",
			amount_eur: 0,
			category: "Other",
			note: "",
		});
		setSaved("Expense logged");
		setTimeout(() => setSaved(""), 2500);
	}, [form]);

	if (loading) {
		return <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />;
	}

	const pctOfBudget =
		summary && summary.budget_eur > 0
			? Math.round((summary.total_eur / summary.budget_eur) * 100)
			: 0;

	return (
		<div className="space-y-8 page-enter" data-testid="expenses-page">
			<div>
				<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
					Expenses
				</h1>
				<p className="text-slate-300 mt-2 text-sm">
					Month tracking — Euro, Billa & Spar heavy
				</p>
			</div>

			{saved && (
				<p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
					{saved}
				</p>
			)}

			<div className="glass-card p-6">
				<h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
					<Plus className="w-4 h-4 text-emerald-400" /> Log expense
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-6 gap-3">
					<input
						data-testid="expense-store"
						placeholder="Store"
						value={form.store}
						onChange={(e) => setForm({ ...form, store: e.target.value })}
						className="input-dark md:col-span-2"
					/>
					<input
						data-testid="expense-amount"
						type="number"
						min="0"
						step="0.01"
						placeholder="€"
						value={form.amount_eur || ""}
						onChange={(e) => setForm({ ...form, amount_eur: +e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="expense-category"
						placeholder="Category (Groceries/Dining/…)"
						value={form.category}
						onChange={(e) => setForm({ ...form, category: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="expense-date"
						type="date"
						value={form.date}
						onChange={(e) => setForm({ ...form, date: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="expense-note"
						placeholder="Note"
						value={form.note}
						onChange={(e) => setForm({ ...form, note: e.target.value })}
						className="input-dark md:col-span-4"
					/>
					<button
						data-testid="expense-add"
						type="button"
						onClick={addExpense}
						disabled={!form.store || form.amount_eur <= 0}
						className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-black uppercase tracking-widest justify-self-start"
					>
						Log expense
					</button>
				</div>
			</div>

			{summary && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="glass-card p-8">
						<p className="text-sm font-black text-slate-300 uppercase tracking-widest">
							This month
						</p>
						<p className="text-4xl font-black text-white mt-2 tabular-nums">
							€{summary.total_eur.toFixed(0)}
						</p>
						<p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
							<TrendingDown className="w-3.5 h-3.5" />
							{summary.change_pct ?? 0}% vs last month
						</p>
					</div>
					<div className="glass-card p-8">
						<p className="text-sm font-black text-slate-300 uppercase tracking-widest">
							Budget used
						</p>
						<p className="text-4xl font-black text-white mt-2 tabular-nums">
							{pctOfBudget}%
						</p>
						<p className="text-sm text-slate-300 mt-2">
							of €{(summary.budget_eur ?? 0).toFixed(0)}
						</p>
					</div>
					<div className="glass-card p-8">
						<p className="text-sm font-black text-slate-300 uppercase tracking-widest">
							Top store
						</p>
						<p className="text-4xl font-black text-white mt-2 uppercase italic">
							{summary.top_store}
						</p>
						<p className="text-sm text-slate-300 mt-2 flex items-center gap-1">
							<Store className="w-3.5 h-3.5" />
							Alsergrund runs
						</p>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="glass-card p-8 space-y-4">
					<h2 className="text-xs font-black text-white uppercase tracking-widest">
						By category
					</h2>
					{summary?.categories.map((c) => (
						<div key={c.name} className="space-y-1">
							<div className="flex justify-between text-sm">
								<span className="text-slate-300 uppercase font-bold">
									{c.name}
								</span>
								<span className="text-white font-black tabular-nums">
									€{c.eur.toFixed(0)}
								</span>
							</div>
							<div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
								<div
									className="h-full bg-cosmos-500 rounded-full"
									style={{ width: `${c.pct}%` }}
								/>
							</div>
						</div>
					))}
				</div>

				<div className="glass-card overflow-hidden">
					<div className="px-8 py-5 border-b border-white/[0.06] flex items-center gap-3">
						<CreditCard className="w-5 h-5 text-cosmos-400" />
						<span className="text-xs font-black uppercase tracking-widest text-white">
							Recent
						</span>
					</div>
					<div className="divide-y divide-white/[0.04]">
						{recent.map((e) => (
							<div
								key={e.id}
								className="px-8 py-4 flex justify-between items-center hover:bg-white/[0.02]"
							>
								<div>
									<p className="text-sm font-black text-white uppercase">
										{e.store}
									</p>
									<p className="text-sm text-slate-300 mt-1">
										{e.note} · {e.date}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-black text-white tabular-nums">
										€{e.amount_eur.toFixed(2)}
									</p>
									<p className="text-sm text-slate-300 uppercase">
										{e.category}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
