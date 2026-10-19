import {
	Clock,
	ExternalLink,
	MapPin,
	Phone,
	Star,
	UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";

interface WeeklyDay {
	day: string;
	menu1: string;
	menu2: string;
}

interface Restaurant {
	name: string;
	address: string;
	phone?: string;
	cuisine?: string;
	hours?: string;
	lunch_hours?: string;
	is_favorite?: boolean;
	notes?: string;
	url?: string;
	details?: string;
	district?: string;
	tags?: string[];
	source?: string;
	verify?: boolean;
	weekly_menu?: {
		week: string;
		lunch_hours: string;
		soup_daily: string;
		note: string;
		days: WeeklyDay[];
	};
	karte?: {
		fetched: string;
		source: string;
		sections: string[];
		regulars: { dish: string; number: string }[];
		takeout: string;
	};
}

interface RestaurantsResponse {
	restaurants: Restaurant[];
	lunch_menus: unknown;
	fetched_on: string;
	sources: Record<string, string>;
}

const SECTIONS: {
	title: string;
	match: (r: Restaurant) => boolean;
	groupBy?: "district";
}[] = [
	{
		title: "Servitenviertel Mains",
		match: (r) =>
			(r.tags ?? []).some((t) =>
				["servitenviertel", "nepalese", "greek", "bib-gourmand"].includes(t),
			) &&
			!(r.tags ?? []).includes("fine-dining") &&
			!(r.tags ?? []).includes("ayce") &&
			!(r.tags ?? []).includes("spezialfall"),
	},
	{
		title: "Fine Dining (Falstaff 2026 + Michelin)",
		match: (r) => (r.tags ?? []).includes("fine-dining"),
	},
	{
		title: "Luxushotel-Restaurants & Rooftop",
		match: (r) =>
			((r.tags ?? []).includes("hotel") ||
				(r.tags ?? []).includes("rooftop")) &&
			!(r.tags ?? []).includes("fine-dining"),
	},
	{
		title: "Plachutta (Tafelspitz)",
		match: (r) => (r.tags ?? []).includes("kette-plachutta"),
	},
	{
		title: "AYCE & Wien Mitte",
		match: (r) =>
			(r.tags ?? []).some((t) => ["ayce", "wien-mitte", "hotpot"].includes(t)),
	},
	{
		title: "Kebap-Invasion (Tuerkis = die gute Kette)",
		match: (r) =>
			(r.tags ?? []).some((t) => ["kebap", "kette-tuerkis"].includes(t)),
	},
	{
		title: "Wiener Ketten (Broetchen, Pepi, Kaisers, Max & Benito)",
		match: (r) =>
			(r.tags ?? []).some((t) =>
				[
					"broetchen",
					"kette-trzesniewski",
					"kette-tauber",
					"leberkaese",
					"kette-pepi",
					"suess",
					"kette-kaisers",
					"kette-maxbenito",
					"mexican",
					"institution",
					"imbiss",
				].includes(t),
			),
	},
	{
		title: "American Chains",
		match: (r) =>
			(r.tags ?? []).some((t) =>
				["us-chain", "coffee", "burger", "chicken"].includes(t),
			),
	},
	{
		title: "Asian-Welle",
		match: (r) =>
			(r.tags ?? []).includes("asian") || (r.tags ?? []).includes("japanese"),
	},
	{
		title: "Italiener & Pizzerias",
		match: (r) =>
			(r.tags ?? []).some((t) => ["italian", "pizza"].includes(t)) &&
			!(r.tags ?? []).includes("fine-dining") &&
			!(r.tags ?? []).includes("hotel"),
	},
	{
		title: "Kult-Imbiss (Schachtel, Bosna, Curry)",
		match: (r) =>
			(r.tags ?? []).some((t) =>
				["kult-imbiss", "schachtel", "bosna", "currywurst", "offen"].includes(
					t,
				),
			),
	},
	{
		title: "Wuerstelstand-Kultur",
		match: (r) => (r.tags ?? []).includes("wuerstelstand"),
	},
	{
		title: "Geheimtipps (Locals)",
		match: (r) => (r.tags ?? []).includes("geheimtipp"),
	},
	{
		title: "Cafes & Konditorei",
		match: (r) =>
			(r.tags ?? []).some((t) => ["cafe", "konditorei"].includes(t)),
		groupBy: "district",
	},
	{
		title: "Bars & Cocktail",
		match: (r) =>
			(r.tags ?? []).some((t) =>
				["bar", "cocktail", "pub", "klassiker"].includes(t),
			) &&
			!(r.tags ?? []).includes("cafe") &&
			!(r.tags ?? []).includes("hotel") &&
			!(r.tags ?? []).includes("rooftop"),
	},
	{
		title: "Touristenfallen-Kontext + faire Alternative",
		match: (r) =>
			(r.tags ?? []).some((t) =>
				["touristenfalle-kontext", "fair", "torte", "stelze"].includes(t),
			) && !(r.tags ?? []).includes("prater"),
	},
	{
		title: "Maerkte & Food-Hubs",
		match: (r) =>
			(r.tags ?? []).some((t) => ["markt", "food-hub", "graetzl"].includes(t)),
	},
	{
		title: "Spezialfaelle (Deewan, Lutz, Mensa & Co.)",
		match: (r) => (r.tags ?? []).includes("spezialfall"),
	},
	{
		title: "Prater",
		match: (r) => (r.tags ?? []).includes("prater"),
	},
	{
		title: "Heurigen & Kellerlokale",
		match: (r) =>
			(r.tags ?? []).some((t) => ["heuriger", "keller"].includes(t)),
	},
];

function Card({ r }: { r: Restaurant }) {
	return (
		<div key={r.name} className="glass-card p-6">
			<div className="flex items-start justify-between mb-3">
				<div className="p-3 rounded-2xl bg-white/[0.03] text-slate-200">
					<UtensilsCrossed className="w-5 h-5" />
				</div>
				{r.is_favorite && (
					<span className="text-sm font-black uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
						Favorite
					</span>
				)}
			</div>
			<h3 className="text-xl font-bold text-white uppercase tracking-tight">
				{r.name}
			</h3>
			{r.cuisine && (
				<p className="text-sm text-slate-300 uppercase italic">{r.cuisine}</p>
			)}
			<p className="text-sm text-slate-300 mt-2 flex items-center gap-1.5">
				<MapPin className="w-3.5 h-3.5 shrink-0" />
				{r.address}
				{r.verify && <span className="italic">(verify)</span>}
			</p>
			{r.phone && (
				<p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5">
					<Phone className="w-3.5 h-3.5 shrink-0" />
					{r.phone}
				</p>
			)}
			{(r.hours ?? r.lunch_hours) && (
				<p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5">
					<Clock className="w-3.5 h-3.5 shrink-0" />
					{r.hours ?? r.lunch_hours}
				</p>
			)}
			{r.notes && (
				<p className="text-sm text-slate-200 mt-3 leading-relaxed">{r.notes}</p>
			)}
			{r.url && (
				<a
					href={r.url}
					target="_blank"
					rel="noreferrer"
					className="text-sm mt-2 inline-flex items-center gap-1 text-sky-300 underline underline-offset-4"
				>
					<ExternalLink className="w-3.5 h-3.5" />
					Web
				</a>
			)}
			{r.karte && (
				<div className="mt-3 text-sm text-slate-300">
					<p className="font-black uppercase tracking-widest text-slate-200 mb-1">
						Regulars (Karte {r.karte.fetched})
					</p>
					<ul className="list-disc ml-5 space-y-0.5">
						{r.karte.regulars.map((g) => (
							<li key={g.dish}>
								{g.dish} {g.number !== "kids" && `(${g.number})`}
							</li>
						))}
					</ul>
					<p className="italic mt-1">{r.karte.takeout}</p>
				</div>
			)}
			{r.details && (
				<details className="mt-3 text-sm text-slate-200">
					<summary className="cursor-pointer uppercase tracking-widest font-black text-slate-300">
						Details
					</summary>
					<p className="mt-1 leading-relaxed">{r.details}</p>
				</details>
			)}
		</div>
	);
}

export default function Restaurants() {
	const [data, setData] = useState<RestaurantsResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/vienna/restaurants")
			.then((res) => res.json())
			.then((json) => {
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, []);

	if (loading)
		return <div className="p-8 text-white">Setting the tables...</div>;
	if (!data) return <div className="p-8 text-white">No restaurant data.</div>;

	const orlik = data.restaurants.find((r) => r.name === "Gasthaus Orlik");
	const rembetiko = data.restaurants.find((r) => r.name === "Rembetiko");
	const shortlist = data.restaurants.filter(
		(r) =>
			(r.tags ?? []).includes("shortlist") &&
			!(r.tags ?? []).includes("asian") &&
			!(r.tags ?? []).includes("bar") &&
			!(r.tags ?? []).includes("japanese") &&
			!(r.tags ?? []).includes("italian"),
	);

	return (
		<div
			data-testid="restaurants-page"
			className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<div>
				<h1
					data-testid="restaurants-title"
					className="text-4xl font-black gradient-text tracking-tighter uppercase italic"
				>
					Wien Essen & Trinken ({data.restaurants.length})
				</h1>
				<p className="text-slate-300 mt-2 font-medium tracking-tight">
					Top-100++ Wien, verifiziert {data.fetched_on}. Quellen:{" "}
					{Object.values(data.sources).join(" · ")}
				</p>
			</div>

			{/* Orlik weekly lunch table */}
			{orlik?.weekly_menu && (
				<div className="glass-card p-8">
					<div className="flex items-center gap-2 mb-1">
						<Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
						<span className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">
							Sandra's favorite · Week {orlik.weekly_menu.week}
						</span>
					</div>
					<h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
						{orlik.name}
					</h2>
					<p className="text-sm text-slate-300 mb-4 flex flex-wrap gap-x-4 gap-y-1">
						<span className="inline-flex items-center gap-1">
							<MapPin className="w-3.5 h-3.5" />
							{orlik.address}
						</span>
						{orlik.phone && (
							<span className="inline-flex items-center gap-1">
								<Phone className="w-3.5 h-3.5" />
								{orlik.phone}
							</span>
						)}
						<span className="inline-flex items-center gap-1">
							<Clock className="w-3.5 h-3.5" />
							{orlik.weekly_menu.lunch_hours}
						</span>
					</p>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left text-slate-300 uppercase tracking-widest">
									<th className="py-2 pr-4">Day</th>
									<th className="py-2 pr-4">Menu 1</th>
									<th className="py-2">Menu 2</th>
								</tr>
							</thead>
							<tbody>
								{orlik.weekly_menu.days.map((d) => (
									<tr
										key={d.day}
										className="border-t border-white/[0.06] text-slate-200"
									>
										<td className="py-2 pr-4 font-black text-white">{d.day}</td>
										<td className="py-2 pr-4">{d.menu1}</td>
										<td className="py-2">{d.menu2}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="text-sm text-slate-300 mt-3 italic">
						Daily {orlik.weekly_menu.soup_daily} · {orlik.weekly_menu.note}
					</p>
				</div>
			)}

			{/* Sections */}
			{SECTIONS.map((sec) => {
				const items = data.restaurants.filter(
					(r) => sec.match(r) && r.name !== "Gasthaus Orlik",
				);
				if (items.length === 0) return null;
				const groups: { key: string; items: typeof items }[] = sec.groupBy
					? Object.entries(
							items.reduce<Record<string, typeof items>>((acc, r) => {
								const k = r.district || "?";
								if (!acc[k]) acc[k] = [];
								acc[k].push(r);
								return acc;
							}, {}),
						)
							.sort(([a], [b]) => a.localeCompare(b))
							.map(([key, groupItems]) => ({ key, items: groupItems }))
					: [{ key: "", items }];
				return (
					<div key={sec.title}>
						<h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
							{sec.title} ({items.length})
						</h2>
						{groups.map((g) => (
							<div key={g.key || sec.title} className="mb-6 last:mb-0">
								{g.key && (
									<h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
										{g.key === "cityweit" ? "Cityweit" : `${g.key} Wien`}
									</h3>
								)}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{g.items.map((r) => (
										<Card key={r.name} r={r} />
									))}
								</div>
							</div>
						))}
					</div>
				);
			})}

			{/* Rembetiko note */}
			{rembetiko && (
				<p className="text-sm text-slate-400 italic">
					Full Rembetiko Karte fetched {rembetiko.karte?.fetched} (
					{rembetiko.karte?.sections.join(" → ")}) — numbered dishes, see
					rembetiko.at/speisen--wein-1090 for the complete list.
				</p>
			)}

			{/* Shortlist remainder */}
			{shortlist.length > 0 && (
				<div>
					<h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
						Servitenviertel-Shortlist ({shortlist.length})
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{shortlist.map((r) => (
							<div
								key={r.name}
								className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4"
							>
								<p className="font-bold text-white uppercase text-sm">
									{r.name}
								</p>
								<p className="text-sm text-slate-400 mt-1">{r.address}</p>
								{r.notes && (
									<p className="text-sm text-slate-300 italic mt-1">
										{r.notes}
									</p>
								)}
							</div>
						))}
					</div>
					<p className="text-sm text-slate-400 italic mt-2">
						Luxor Bar = base camp. Sentepe & Riva noch offen — Hinweis
						willkommen.
					</p>
				</div>
			)}
		</div>
	);
}
