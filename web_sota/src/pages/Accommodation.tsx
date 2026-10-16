import { BedDouble, ExternalLink, Landmark, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface PaeanChapter {
	title: string;
	body: string;
}

interface Stay {
	name: string;
	address: string;
	notes?: string;
	url?: string;
	tags?: string[];
	source?: string;
	verify?: boolean;
}

interface AccommodationResponse {
	paean: PaeanChapter[];
	stays: Stay[];
	fetched_on: string;
	sources: Record<string, string>;
}

export default function Accommodation() {
	const [data, setData] = useState<AccommodationResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/vienna/accommodation")
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
		return <div className="p-8 text-white">Opening the doors...</div>;
	if (!data)
		return <div className="p-8 text-white">No accommodation data.</div>;

	return (
		<div
			data-testid="accommodation-page"
			className="space-y-8 page-enter animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<div>
				<h1
					data-testid="accommodation-title"
					className="text-4xl font-black gradient-text tracking-tighter uppercase italic"
				>
					Wien Wohnen
				</h1>
				<p className="text-slate-300 mt-2 font-medium tracking-tight">
					Ein Lobgesang auf den Gemeindebau — recherchiert {data.fetched_on}.
					Quellen: {Object.values(data.sources).join(" · ")}
				</p>
			</div>

			{/* Paean */}
			<div className="space-y-6">
				{data.paean.map((ch) => (
					<article key={ch.title} className="glass-card p-8">
						<div className="flex items-center gap-2 mb-2">
							<Landmark className="w-4 h-4 text-rose-400" />
							<h2 className="text-2xl font-black text-white uppercase tracking-tight">
								{ch.title}
							</h2>
						</div>
						<p className="text-slate-200 leading-relaxed">{ch.body}</p>
					</article>
				))}
			</div>

			{/* Stays */}
			<div>
				<h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
					Adressen & Fakten ({data.stays.length})
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{data.stays.map((s) => (
						<div key={s.name} className="glass-card p-6">
							<div className="p-3 rounded-2xl bg-white/[0.03] text-slate-200 w-fit mb-3">
								<BedDouble className="w-5 h-5" />
							</div>
							<h3 className="text-xl font-bold text-white uppercase tracking-tight">
								{s.name}
							</h3>
							<p className="text-sm text-slate-300 mt-2 flex items-center gap-1.5">
								<MapPin className="w-3.5 h-3.5 shrink-0" />
								{s.address}
								{s.verify && <span className="italic">(verify)</span>}
							</p>
							{s.notes && (
								<p className="text-sm text-slate-200 mt-3 leading-relaxed">
									{s.notes}
								</p>
							)}
							{s.url && (
								<a
									href={s.url}
									target="_blank"
									rel="noreferrer"
									className="text-sm mt-2 inline-flex items-center gap-1 text-sky-300 underline underline-offset-4"
								>
									<ExternalLink className="w-3.5 h-3.5" />
									Web
								</a>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
