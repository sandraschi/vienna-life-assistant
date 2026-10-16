import { Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import DetailCard from "../components/DetailCard";

interface IntroChapter {
	title: string;
	body: string;
}

interface Venue {
	name: string;
	address: string;
	phone?: string;
	notes?: string;
	url?: string;
	details?: string;
	tags?: string[];
	source?: string;
	verify?: boolean;
}

interface CultureResponse {
	intro: IntroChapter[];
	venues: Venue[];
	fetched_on: string;
	sources: Record<string, string>;
}

const SECTIONS: { title: string; match: (v: Venue) => boolean }[] = [
	{
		title: "Musik (Goldener Saal bis Heurigen)",
		match: (v) =>
			(v.tags ?? []).includes("musik") && !(v.tags ?? []).includes("festival"),
	},
	{
		title: "Museen",
		match: (v) => (v.tags ?? []).includes("museum"),
	},
	{
		title: "Theater",
		match: (v) =>
			(v.tags ?? []).includes("theater") &&
			!(v.tags ?? []).includes("festival"),
	},
	{
		title: "Film (Hofrat Geiger bis Polizei-Komoedie)",
		match: (v) =>
			(v.tags ?? []).includes("film") &&
			!(v.tags ?? []).includes("kino") &&
			!(v.tags ?? []).includes("festival"),
	},
	{
		title: "Festivals",
		match: (v) =>
			(v.tags ?? []).includes("festival") &&
			!(v.tags ?? []).includes("weihnachtsmarkt"),
	},
	{
		title: "Galerien",
		match: (v) => (v.tags ?? []).includes("galerie"),
	},
	{
		title: "Gärten, Zoo & Parks",
		match: (v) =>
			(v.tags ?? []).some((t) => ["garten", "zoo", "park"].includes(t)),
	},
	{
		title: "Weihnachtsmaerkte",
		match: (v) => (v.tags ?? []).includes("weihnachtsmarkt"),
	},
	{
		title: "Kinos",
		match: (v) => (v.tags ?? []).includes("kino"),
	},
	{
		title: "Einkaufszentren",
		match: (v) => (v.tags ?? []).some((t) => ["ekz", "shopping"].includes(t)),
	},
	{
		title: "TV & Sender (Rex first)",
		match: (v) =>
			(v.tags ?? []).some((t) => ["tv", "sender", "privat"].includes(t)),
	},
	{
		title: "Zeitungen & Blaetter",
		match: (v) =>
			(v.tags ?? []).some((t) =>
				["zeitung", "stadtzeitung", "magazin"].includes(t),
			),
	},
];

export default function Culture() {
	const [data, setData] = useState<CultureResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/vienna/culture")
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
		return <div className="p-8 text-white">Raising the curtain...</div>;
	if (!data) return <div className="p-8 text-white">No culture data.</div>;

	return (
		<div
			data-testid="culture-page"
			className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<div>
				<h1
					data-testid="culture-title"
					className="text-4xl font-black gradient-text tracking-tighter uppercase italic"
				>
					Wien Kultur ({data.venues.length})
				</h1>
				<p className="text-slate-300 mt-2 font-medium tracking-tight">
					Verifiziert {data.fetched_on}. Quellen:{" "}
					{Object.values(data.sources).join(" · ")}
				</p>
			</div>

			{data.intro.map((ch) => (
				<article key={ch.title} className="glass-card p-8">
					<div className="flex items-center gap-2 mb-2">
						<Landmark className="w-4 h-4 text-violet-400" />
						<h2 className="text-2xl font-black text-white uppercase tracking-tight">
							{ch.title}
						</h2>
					</div>
					<p className="text-slate-200 leading-relaxed">{ch.body}</p>
				</article>
			))}

			{SECTIONS.map((sec) => {
				const items = data.venues.filter(sec.match);
				if (items.length === 0) return null;
				return (
					<div key={sec.title}>
						<h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
							{sec.title} ({items.length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{items.map((v) => (
								<DetailCard
									key={v.name}
									title={v.name}
									address={v.address}
									phone={v.phone}
									notes={v.notes}
									tags={v.tags}
									source={v.source}
									url={v.url}
									verify={v.verify}
									details={v.details}
									related={data.venues
										.filter(
											(o) =>
												o.name !== v.name &&
												(o.tags ?? [])[0] === (v.tags ?? [])[0] &&
												(o.tags ?? [])[0] !== undefined,
										)
										.slice(0, 4)
										.map((o) => ({ name: o.name, address: o.address }))}
								/>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
