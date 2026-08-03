import {
	BookOpen,
	Calendar,
	Cpu,
	Loader2,
	MapPin,
	MessageCircle,
	Plane,
	Receipt,
	Terminal,
	Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { API, apiGet } from "../lib/api";

type Capabilities = {
	server: { name: string; version: string; fastmcp?: string };
	features: Record<string, boolean>;
};

export default function Help() {
	const [caps, setCaps] = useState<Capabilities | null>(null);

	useEffect(() => {
		apiGet<Capabilities>(API.capabilities)
			.then(setCaps)
			.catch(() => setCaps(null));
	}, []);

	return (
		<div className="space-y-8 page-enter max-w-4xl">
			<div>
				<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
					Help
				</h1>
				<p className="text-slate-500 mt-2 text-sm">
					ViLife — Vienna Life Assistant (human carrier)
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<section className="glass-card p-8 space-y-4">
					<div className="flex gap-3 items-center">
						<BookOpen className="w-6 h-6 text-cosmos-400" />
						<h2 className="text-white font-black uppercase tracking-widest text-sm">
							Quick start
						</h2>
					</div>
					<ol className="text-sm text-slate-400 space-y-2 list-decimal pl-5">
						<li>
							<code className="text-cosmos-400">Set-Location web_sota</code>{" "}
							then <code className="text-cosmos-400">.\start.ps1</code>
						</li>
						<li>
							Open{" "}
							<strong className="text-slate-200">http://127.0.0.1:10988</strong>
						</li>
						<li>
							<strong className="text-slate-200">Settings</strong> — pick
							Ollama, LM Studio, or OpenAI + model
						</li>
						<li>
							<strong className="text-slate-200">Chat</strong> — Vienna
							preprompt chips or free text
						</li>
					</ol>
				</section>

				<section className="glass-card p-8 space-y-4">
					<div className="flex gap-3 items-center">
						<MapPin className="w-6 h-6 text-emerald-400" />
						<h2 className="text-white font-black uppercase tracking-widest text-sm">
							Ports & naming
						</h2>
					</div>
					<ul className="text-sm text-slate-400 space-y-2">
						<li>
							Frontend (Vite): <code className="text-cosmos-400">10988</code>
						</li>
						<li>
							Backend + MCP: <code className="text-cosmos-400">10922</code> —{" "}
							<code>/mcp</code>
						</li>
						<li>
							<strong className="text-slate-200">ViLife</strong> = this app (
							<code>vienna-life-assistant</code>)
						</li>
						<li>
							<strong className="text-slate-200">vla-mcp</strong> = robotics
							only — not this app
						</li>
						<li>
							<code>vienna-live-mcp</code> deprecated — use ViLife{" "}
							<code>web_sota</code>
						</li>
					</ul>
				</section>

				<section className="glass-card p-8 space-y-4 md:col-span-2">
					<div className="flex gap-3 items-center">
						<Wrench className="w-6 h-6 text-cosmos-400" />
						<h2 className="text-white font-black uppercase tracking-widest text-sm">
							Pages
						</h2>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[10px] font-bold uppercase tracking-widest">
						{[
							{ path: "/", label: "Dashboard" },
							{ path: "/chat", label: "Chat", icon: MessageCircle },
							{ path: "/calendar", label: "Calendar", icon: Calendar },
							{ path: "/expenses", label: "Expenses", icon: Receipt },
							{ path: "/travel", label: "Travel", icon: Plane },
							{ path: "/vienna/shopping", label: "Shopping" },
							{ path: "/vienna/coffee", label: "Coffee" },
							{ path: "/skills", label: "Skills" },
							{ path: "/tools", label: "Tools / capabilities" },
							{ path: "/settings", label: "LLM settings", icon: Cpu },
							{ path: "/fleet", label: "Fleet overview" },
						].map((p) => (
							<a
								key={p.path}
								href={p.path}
								className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-500 hover:text-white hover:border-cosmos-500/30 transition-colors"
							>
								{p.label}
							</a>
						))}
					</div>
				</section>

				<section className="glass-card p-8 space-y-4">
					<div className="flex gap-3 items-center">
						<Terminal className="w-6 h-6 text-emerald-400" />
						<h2 className="text-white font-black uppercase tracking-widest text-sm">
							REST API
						</h2>
					</div>
					<div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-2 border border-white/[0.06] overflow-x-auto">
						<p>
							<span className="text-emerald-400">GET</span>{" "}
							/api/life/calendar/today
						</p>
						<p>
							<span className="text-emerald-400">GET</span>{" "}
							/api/life/expenses/summary
						</p>
						<p>
							<span className="text-emerald-400">GET</span>{" "}
							/api/life/travel/upcoming
						</p>
						<p>
							<span className="text-emerald-400">GET</span>{" "}
							/api/vienna/transport
						</p>
						<p>
							<span className="text-emerald-400">GET</span> /api/llm/status
						</p>
						<p>
							<span className="text-emerald-400">POST</span> /api/llm/chat
						</p>
						<p>
							<span className="text-emerald-400">GET</span> /api/capabilities
						</p>
						<p>
							<span className="text-emerald-400">GET</span> /api/skills
						</p>
					</div>
				</section>

				<section className="glass-card p-8 space-y-4">
					<div className="flex gap-3 items-center">
						<Cpu className="w-6 h-6 text-indigo-400" />
						<h2 className="text-white font-black uppercase tracking-widest text-sm">
							MCP (agents)
						</h2>
					</div>
					<div className="text-sm text-slate-400 space-y-2">
						<p>
							Tool{" "}
							<code className="text-cosmos-400">
								vienna_life(operation=...)
							</code>
							:
						</p>
						<p className="text-[10px] font-mono text-slate-500">
							calendar_today · todo_list · expense_summary · shopping_list ·
							life_brief · fleet_overview · health · help
						</p>
						<p>
							Agentic:{" "}
							<code className="text-cosmos-400">
								vienna_life_agentic(goal=...)
							</code>
						</p>
						<p>
							Cursor:{" "}
							<code className="text-cosmos-400">
								fleet_call(server=&quot;vienna-life&quot;, ...)
							</code>
						</p>
					</div>
				</section>

				<section className="glass-card p-8 space-y-4 md:col-span-2">
					<h2 className="text-white font-black uppercase tracking-widest text-sm">
						Runtime
					</h2>
					{!caps ? (
						<Loader2 className="w-5 h-5 animate-spin text-cosmos-400" />
					) : (
						<div className="flex flex-wrap gap-3">
							<span className="text-sm text-slate-500">
								{caps.server.name} v{caps.server.version} ·{" "}
								{caps.server.fastmcp ?? "FastMCP"}
							</span>
							{Object.entries(caps.features).map(([k, v]) => (
								<span
									key={k}
									className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
										v
											? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
											: "border-white/10 text-slate-600"
									}`}
								>
									{k.replace(/_/g, " ")}
								</span>
							))}
						</div>
					)}
				</section>

				<section className="glass-card p-8 space-y-4 md:col-span-2">
					<h2 className="text-white font-black uppercase tracking-widest text-sm">
						Troubleshooting
					</h2>
					<ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
						<li>Blank UI — hard refresh; confirm Vite on 10988 (not 10990)</li>
						<li>
							LLM offline — Ollama 11434, LM Studio 1234, or OpenAI key in
							Settings
						</li>
						<li>
							Port squatters — re-run{" "}
							<code className="text-cosmos-400">start.ps1</code> (kills
							10988/10922)
						</li>
						<li>
							MCP from Cursor — backend must be up on 10922 before connecting
						</li>
					</ul>
				</section>
			</div>
		</div>
	);
}
