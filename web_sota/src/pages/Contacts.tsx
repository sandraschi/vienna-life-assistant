import {
	Cake,
	Heart,
	Loader2,
	Mail,
	Phone,
	Plus,
	RefreshCw,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../lib/api";

type Contact = {
	id: number;
	name: string;
	phone: string;
	email: string;
	birthday: string;
	relationship: string;
	address: string;
	notes: string;
	favorite: boolean;
};
type Birthday = Contact & { days_until: number; age_turning: number };

export default function Contacts() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [birthdays, setBirthdays] = useState<Birthday[]>([]);
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState("");
	const [form, setForm] = useState({
		name: "",
		phone: "",
		email: "",
		birthday: "",
		relationship: "",
		favorite: false,
	});

	const load = useCallback(() => {
		setLoading(true);
		Promise.all([
			apiGet<{ items: Contact[] }>(API.life.contacts),
			apiGet<{ items: Birthday[] }>(`${API.life.contacts}/birthdays`).catch(
				() => ({ items: [] as Birthday[] }),
			),
		])
			.then(([c, b]) => {
				setContacts(c.items || []);
				setBirthdays(b.items || []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	useEffect(load, [load]);

	const addContact = useCallback(async () => {
		if (!form.name) return;
		const r = await apiPost<{ item: Contact }>(API.life.contacts, form);
		setContacts((p) => [...p, r.item]);
		setForm({
			name: "",
			phone: "",
			email: "",
			birthday: "",
			relationship: "",
			favorite: false,
		});
		setSaved("Contact added");
		setTimeout(() => setSaved(""), 2500);
	}, [form]);

	return (
		<div className="space-y-8 page-enter" data-testid="contacts-page">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Contacts
					</h1>
					<p className="text-slate-300 mt-2 text-sm">
						People, birthdays, and relationships — never miss a birthday again
					</p>
				</div>
				<button
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
					<Plus className="w-4 h-4 text-cosmos-400" /> Add contact
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
					<input
						data-testid="contact-name"
						placeholder="Name *"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						className="input-dark md:col-span-2"
					/>
					<input
						data-testid="contact-phone"
						placeholder="Phone"
						value={form.phone}
						onChange={(e) => setForm({ ...form, phone: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="contact-birthday"
						type="date"
						title="Birthday"
						value={form.birthday}
						onChange={(e) => setForm({ ...form, birthday: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="contact-relationship"
						placeholder="Relationship (family/friend/doctor…)"
						value={form.relationship}
						onChange={(e) => setForm({ ...form, relationship: e.target.value })}
						className="input-dark"
					/>
					<input
						data-testid="contact-email"
						placeholder="Email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						className="input-dark md:col-span-4"
					/>
					<button
						data-testid="contact-add"
						onClick={addContact}
						className="px-4 py-2 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 text-white text-xs font-black uppercase tracking-widest"
					>
						Add
					</button>
				</div>
			</div>

			{birthdays.length > 0 && (
				<div className="glass-card p-6 border-amber-500/30">
					<h2 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
						<Cake className="w-4 h-4" /> Birthdays in the next 30 days
					</h2>
					<div className="flex flex-wrap gap-3">
						{birthdays.map((b) => (
							<div
								key={b.id}
								className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm"
							>
								<span className="font-black text-white uppercase tracking-tight">
									{b.name}
								</span>
								<span className="text-amber-400 ml-2 font-bold">
									turns {b.age_turning} in {b.days_until}d
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{loading ? (
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{contacts.map((c) => (
						<div key={c.id} className="glass-card p-6">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cosmos-500/30 to-indigo-600/30 border border-white/[0.08] flex items-center justify-center shrink-0">
									<Users className="w-4 h-4 text-cosmos-400" />
								</div>
								<div className="min-w-0">
									<p className="text-sm font-black text-white uppercase tracking-tight truncate">
										{c.name}
									</p>
									<p className="text-xs text-slate-300 uppercase tracking-widest">
										{c.relationship || "—"}
										{c.favorite && (
											<Heart className="w-3 h-3 inline ml-1 text-pink-400 fill-pink-400" />
										)}
									</p>
								</div>
							</div>
							<div className="mt-4 space-y-2 text-sm">
								{c.phone && (
									<p className="flex items-center gap-2 text-slate-300">
										<Phone className="w-3.5 h-3.5 text-slate-300" />
										{c.phone}
									</p>
								)}
								{c.email && (
									<p className="flex items-center gap-2 text-slate-300 truncate">
										<Mail className="w-3.5 h-3.5 text-slate-300" />
										{c.email}
									</p>
								)}
								{c.birthday && (
									<p className="flex items-center gap-2 text-slate-300">
										<Cake className="w-3.5 h-3.5 text-slate-300" />
										{c.birthday}
									</p>
								)}
							</div>
						</div>
					))}
					{contacts.length === 0 && (
						<p className="text-sm text-slate-300 uppercase tracking-widest text-center py-8 col-span-full">
							No contacts yet
						</p>
					)}
				</div>
			)}
		</div>
	);
}
