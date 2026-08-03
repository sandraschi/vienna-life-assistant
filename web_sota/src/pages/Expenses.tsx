import { CreditCard, Loader2, Store, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { API, apiGet } from "../lib/api";

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

	if (loading) {
		return <Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />;
	}

	const pctOfBudget = summary
		? Math.round((summary.total_eur / summary.budget_eur) * 100)
		: 0;

	return (
		<div className="space-y-8 page-enter">
			<div>
				<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
					Expenses
				</h1>
				<p className="text-slate-300 mt-2 text-sm">
					Month tracking — Euro, Billa & Spar heavy
				</p>
			</div>

			{summary && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="glass-card p-8">
						<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
							This month
						</p>
						<p className="text-4xl font-black text-white mt-2 tabular-nums">
							€{summary.total_eur.toFixed(0)}
						</p>
						<p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
							<TrendingDown className="w-3.5 h-3.5" />
							{summary.change_pct}% vs last month
						</p>
					</div>
					<div className="glass-card p-8">
						<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
							Budget used
						</p>
						<p className="text-4xl font-black text-white mt-2 tabular-nums">
							{pctOfBudget}%
						</p>
						<p className="text-sm text-slate-300 mt-2">
							of €{summary.budget_eur.toFixed(0)}
						</p>
					</div>
					<div className="glass-card p-8">
						<p className="text-xs font-black text-slate-300 uppercase tracking-widest">
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
									<p className="text-xs text-slate-300 mt-1">
										{e.note} · {e.date}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-black text-white tabular-nums">
										€{e.amount_eur.toFixed(2)}
									</p>
									<p className="text-xs text-slate-300 uppercase">
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
