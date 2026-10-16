import { ChevronDown, ExternalLink, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export interface DetailRelated {
	name: string;
	address: string;
}

export interface DetailCardProps {
	title: string;
	address: string;
	phone?: string;
	notes?: string;
	tags?: string[];
	source?: string;
	url?: string;
	verify?: boolean;
	/** Long text for deep passes; rendered when the card is expanded. */
	details?: string;
	related?: DetailRelated[];
}

/**
 * Generelles Detail-Pattern: kompakte Karte, aufklappbar zu Tags, Quelle,
 * Link und verwandten Einträgen. Heute in Kultur im Einsatz, morgen überall.
 */
export default function DetailCard({
	title,
	address,
	phone,
	notes,
	tags,
	source,
	url,
	verify,
	details,
	related,
}: DetailCardProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="glass-card p-6">
			<h3 className="text-xl font-bold text-white uppercase tracking-tight">
				{title}
			</h3>
			<p className="text-sm text-slate-300 mt-2 flex items-center gap-1.5">
				<MapPin className="w-3.5 h-3.5 shrink-0" />
				{address}
				{verify && <span className="italic">(verify)</span>}
			</p>
			{phone && (
				<p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5">
					<Phone className="w-3.5 h-3.5 shrink-0" />
					{phone}
				</p>
			)}
			{notes && (
				<p className="text-sm text-slate-200 mt-3 leading-relaxed">{notes}</p>
			)}
			<div className="flex items-center gap-4 mt-3">
				{url && (
					<a
						href={url}
						target="_blank"
						rel="noreferrer"
						className="text-sm inline-flex items-center gap-1 text-sky-300 underline underline-offset-4"
					>
						<ExternalLink className="w-3.5 h-3.5" />
						Web
					</a>
				)}
				<button
					type="button"
					onClick={() => setOpen(!open)}
					className="text-sm inline-flex items-center gap-1 text-slate-300 hover:text-white uppercase tracking-widest font-black"
				>
					<ChevronDown
						className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
					/>
					{open ? "Weniger" : "Details"}
				</button>
			</div>
			{open && (
				<div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2">
					{details ? (
						<p className="text-sm text-slate-200 leading-relaxed">{details}</p>
					) : (
						<p className="text-sm text-slate-400 italic">
							Tiefe folgt im nächsten Pass.
						</p>
					)}
					{(tags ?? []).length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{(tags ?? []).map((t) => (
								<span
									key={t}
									className="px-2 py-0.5 rounded-full text-sm font-bold bg-white/[0.04] border border-white/[0.08] text-slate-300"
								>
									{t}
								</span>
							))}
						</div>
					)}
					{source && (
						<p className="text-sm text-slate-400 italic">Quelle: {source}</p>
					)}
					{(related ?? []).length > 0 && (
						<div>
							<p className="text-sm font-black text-slate-200 uppercase tracking-widest mb-1">
								Verwandt
							</p>
							<ul className="list-disc ml-5 text-sm text-slate-300">
								{related?.map((r) => (
									<li key={r.name}>
										{r.name} — {r.address}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
