import { AlertCircle, Loader2, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { API, apiGet } from "../lib/api";

type Capabilities = {
	status: string;
	server: { name: string; version: string; fastmcp?: string };
	tool_surface: {
		portmanteau_tools: string[];
		atomic_tools: string[];
		total: number;
	};
	features: Record<string, boolean>;
	inventory?: {
		prompt_names?: string[];
		resource_uris?: string[];
		skill_uris?: string[];
	};
	runtime?: { transport?: string; surface_mode?: string };
};

export default function Tools() {
	const [caps, setCaps] = useState<Capabilities | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiGet<Capabilities>(API.capabilities)
			.then(setCaps)
			.catch((e: Error) => setError(e.message))
			.finally(() => setLoading(false));
	}, []);

	const tools = caps
		? [
				...caps.tool_surface.portmanteau_tools,
				...caps.tool_surface.atomic_tools,
			]
		: [];

	return (
		<div className="space-y-8 page-enter">
			<div>
				<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
					MCP Tools
				</h1>
				<p className="text-slate-500 mt-2 text-sm">
					ViLife agent surface — mounted at{" "}
					<code className="text-cosmos-400">/mcp</code>
				</p>
			</div>

			{loading && (
				<div className="flex justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
				</div>
			)}
			{error && (
				<div className="glass-card p-6 flex items-center gap-3 text-amber-400">
					<AlertCircle className="w-5 h-5" />
					<span>{error}</span>
				</div>
			)}
			{caps && (
				<>
					<div className="glass-card p-6">
						<p className="text-sm text-slate-500 uppercase tracking-widest font-black mb-3">
							{caps.server.name} v{caps.server.version} ·{" "}
							{caps.server.fastmcp ?? "FastMCP"}
						</p>
						<div className="flex flex-wrap gap-2">
							{Object.entries(caps.features).map(([key, on]) => (
								<span
									key={key}
									className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
										on
											? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
											: "border-slate-700 text-slate-600"
									}`}
								>
									{key.replace(/_/g, " ")} {on ? "on" : "off"}
								</span>
							))}
						</div>
						{caps.runtime && (
							<p className="text-[10px] text-slate-600 mt-4 uppercase tracking-widest">
								Transport: {caps.runtime.transport} · Surface:{" "}
								{caps.runtime.surface_mode}
							</p>
						)}
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tools.map((name) => (
							<div key={name} className="glass-card p-6">
								<div className="flex items-center gap-3 mb-3">
									<Wrench className="w-5 h-5 text-cosmos-400" />
									<h3 className="font-black text-white text-sm uppercase tracking-widest">
										{name}
									</h3>
								</div>
								<p className="text-sm text-slate-500">
									{name === "vienna_life" &&
										"Life admin portmanteau (calendar, todos, brief)"}
									{name === "vienna_life_agentic" &&
										"Agentic workflow via MCP sampling"}
									{name === "vienna_tips" &&
										"Vienna culture tips (coffee, music, museums)"}
								</p>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}
