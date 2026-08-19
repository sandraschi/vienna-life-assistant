import { BookMarked, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API, apiGet } from "../lib/api";

type SkillEntry = { name: string; uri: string };

type McpPrompt = { name: string; description: string };

export default function Skills() {
	const [skills, setSkills] = useState<SkillEntry[]>([]);
	const [prompts, setPrompts] = useState<McpPrompt[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			apiGet<{ skills: SkillEntry[] }>(API.skills),
			apiGet<{ prompts: McpPrompt[] }>(API.prompts),
		])
			.then(([s, p]) => {
				setSkills(s.skills || []);
				setPrompts(p.prompts || []);
				if (s.skills?.length) setSelected(s.skills[0].name);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!selected) return;
		apiGet<{ content: string }>(API.skill(selected))
			.then((d) => setContent(d.content))
			.catch(() => setContent("(failed to load skill)"));
	}, [selected]);

	if (loading) {
		return (
			<div
				data-testid="skills-page"
				className="flex justify-center py-20 page-enter"
			>
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			</div>
		);
	}

	return (
		<div data-testid="skills-page" className="space-y-8 page-enter">
			<div>
				<h1
					data-testid="skills-title"
					className="text-4xl font-black gradient-text tracking-tighter uppercase italic"
				>
					Skills
				</h1>
				<p className="text-slate-300 mt-2 text-sm">
					Vienna skill pack · MCP prompts
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="glass-card p-4 space-y-2">
					<p className="text-sm font-black text-slate-300 uppercase tracking-widest px-2 mb-2">
						Vienna skills
					</p>
					{skills.map((s) => (
						<button
							data-testid="skills-action"
							key={s.name}
							type="button"
							onClick={() => setSelected(s.name)}
							className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${
								selected === s.name
									? "bg-cosmos-500/20 text-white border border-cosmos-500/30"
									: "text-slate-300 hover:text-white hover:bg-white/[0.04]"
							}`}
						>
							<BookMarked className="w-4 h-4 inline mr-2 opacity-60" />
							{s.name}
						</button>
					))}
				</div>

				<div className="lg:col-span-2 glass-card p-6 overflow-auto max-h-[32rem]">
					<pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
						{content}
					</pre>
				</div>
			</div>

			{prompts.length > 0 && (
				<div className="glass-card p-6">
					<p className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">
						MCP preprompts
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{prompts.map((p) => (
							<div
								key={p.name}
								className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
							>
								<p className="font-black text-white text-sm uppercase tracking-widest">
									{p.name}
								</p>
								<p className="text-[11px] text-slate-300 mt-1">
									{p.description || "Vienna life template"}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
