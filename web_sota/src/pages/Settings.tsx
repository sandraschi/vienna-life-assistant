import {
	Cpu,
	Loader2,
	RefreshCw,
	Save,
	Settings as SettingsIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet } from "../lib/api";
import {
	activeModel,
	DEFAULT_LLM_CONFIG,
	type LlmConfig,
	type LlmProvider,
	loadLlmLocal,
	saveLlmLocal,
	settingsSaveBody,
} from "../lib/llm-settings";

type Capabilities = {
	server: { name: string; version: string; fastmcp?: string };
	features: Record<string, boolean>;
	runtime: { transport: string; surface_mode: string };
};

type LlmSettings = {
	provider: LlmProvider;
	ollama_url: string;
	ollama_model: string;
	lmstudio_url: string;
	lmstudio_model: string;
	openai_base_url: string;
	openai_model: string;
	openai_api_key_configured?: boolean;
};

type LlmStatus = {
	ok: boolean;
	provider: string;
	model: string | null;
	local_llm?: boolean;
	cloud_llm?: boolean;
};

interface ProviderInfo {
	id: string;
	label: string;
	base_url: string;
	models: string[];
	needs_key: boolean;
}

export default function Settings() {
	const [caps, setCaps] = useState<Capabilities | null>(null);
	const [llm, setLlm] = useState<LlmConfig | null>(null);
	const [status, setStatus] = useState<LlmStatus | null>(null);
	const [providers, setProviders] = useState<ProviderInfo[]>([]);
	const [models, setModels] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);
	const [loadingModels, setLoadingModels] = useState(false);

	const refreshModels = useCallback(async (cfg: LlmConfig) => {
		setLoadingModels(true);
		try {
			const d = await apiGet<{ ok: boolean; models: string[] }>(
				API.llmModels({
					provider: cfg.provider,
					base_url:
						cfg.provider === "ollama"
							? cfg.ollama_url
							: cfg.provider === "lmstudio"
								? cfg.lmstudio_url
								: cfg.openai_base_url,
					api_key: cfg.provider === "openai" ? cfg.openai_api_key : undefined,
				}),
			);
			setModels(d.models || []);
		} catch {
			setModels([]);
		} finally {
			setLoadingModels(false);
		}
	}, []);

	useEffect(() => {
		apiGet<Capabilities>(API.capabilities)
			.then(setCaps)
			.catch(() => setCaps(null));
		apiGet<LlmSettings>(API.settings).then((s) => {
			const local = loadLlmLocal();
			setLlm({
				...DEFAULT_LLM_CONFIG,
				provider: (s.provider as LlmProvider) || local.provider || "ollama",
				ollama_url: s.ollama_url || DEFAULT_LLM_CONFIG.ollama_url,
				ollama_model: s.ollama_model || "",
				lmstudio_url: s.lmstudio_url || DEFAULT_LLM_CONFIG.lmstudio_url,
				lmstudio_model: s.lmstudio_model || "",
				openai_base_url:
					s.openai_base_url || DEFAULT_LLM_CONFIG.openai_base_url,
				openai_model: s.openai_model || DEFAULT_LLM_CONFIG.openai_model,
				openai_api_key: local.openai_api_key || "",
			});
		});
		apiGet<{ providers: ProviderInfo[] }>(API.llmProviders)
			.then((d) => setProviders(d.providers))
			.catch(() => setProviders([]));
		apiGet<LlmStatus>(API.llmStatus).then(setStatus);
	}, []);

	useEffect(() => {
		if (!llm) return;
		const disc = providers.find((p) => p.id === llm.provider);
		if (disc && disc.models.length > 0 && llm.provider !== "openai") {
			setModels(disc.models);
		} else {
			refreshModels(llm);
		}
	}, [
		llm?.provider,
		llm?.ollama_url,
		llm?.lmstudio_url,
		llm?.openai_base_url,
		refreshModels,
	]);

	const saveLlm = async () => {
		if (!llm) return;
		setSaving(true);
		try {
			await fetch(API.settingsLlm, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(settingsSaveBody(llm)),
			});
			saveLlmLocal(llm);
			const st = await apiGet<LlmStatus>(API.llmStatus);
			setStatus(st);
			await refreshModels(llm);
		} finally {
			setSaving(false);
		}
	};

	const statusHint = () => {
		if (!status) return null;
		if (status.ok)
			return <span className="text-emerald-400">Online · {status.model}</span>;
		if (llm?.provider === "openai") {
			return (
				<span className="text-amber-400">Set OpenAI API key and save</span>
			);
		}
		return (
			<span className="text-amber-400">
				Offline — start{" "}
				{llm?.provider === "lmstudio" ? "LM Studio (1234)" : "Ollama (11434)"}
			</span>
		);
	};

	return (
		<div data-testid="settings-page" className="space-y-8 page-enter max-w-2xl">
			<div>
				<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
					Settings
				</h1>
				<p className="text-slate-300 mt-2 text-sm">
					Switchable LLM · Ollama · LM Studio · OpenAI
				</p>
			</div>

			{!caps || !llm ? (
				<Loader2 className="w-8 h-8 animate-spin text-cosmos-400" />
			) : (
				<>
					<div className="glass-card p-8 space-y-6">
						<div className="flex items-center gap-3">
							<Cpu className="w-6 h-6 text-cosmos-400" />
							<div>
								<p className="font-black text-white uppercase tracking-widest text-sm">
									LLM provider
								</p>
								<p className="text-sm text-slate-300">{statusHint()}</p>
							</div>
						</div>

						<label
							htmlFor="llm-provider-select"
							className="block text-xs font-black text-slate-300 uppercase tracking-widest"
						>
							Provider
						</label>
						<select
							id="llm-provider-select"
							data-testid="llm-provider-select"
							className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white"
							value={llm.provider}
							onChange={(e) => {
								const p = providers.find((x) => x.id === e.target.value);
								if (p) {
									const url = p.base_url;
									setLlm({
										...llm,
										provider: e.target.value as LlmProvider,
										ollama_url:
											p.id === "ollama"
												? url.replace("/v1", "")
												: llm.ollama_url,
										lmstudio_url: p.id === "lmstudio" ? url : llm.lmstudio_url,
									});
								} else {
									setLlm({ ...llm, provider: e.target.value as LlmProvider });
								}
							}}
						>
							{providers.map((p) => (
								<option key={p.id} value={p.id}>
									{p.label} {p.models.length === 0 ? "(offline)" : ""}
								</option>
							))}
							<option value="openai">OpenAI</option>
						</select>

						{llm.provider === "ollama" && (
							<>
								<input
									className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white"
									placeholder="Ollama URL"
									value={llm.ollama_url}
									onChange={(e) =>
										setLlm({ ...llm, ollama_url: e.target.value })
									}
								/>
								<ModelSelect
									label="Ollama model"
									value={llm.ollama_model}
									models={models}
									loading={loadingModels}
									onChange={(v) => setLlm({ ...llm, ollama_model: v })}
									onRefresh={() => refreshModels(llm)}
								/>
							</>
						)}

						{llm.provider === "lmstudio" && (
							<>
								<input
									className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white"
									placeholder="LM Studio OpenAI-compatible URL"
									value={llm.lmstudio_url}
									onChange={(e) =>
										setLlm({ ...llm, lmstudio_url: e.target.value })
									}
								/>
								<ModelSelect
									label="LM Studio model"
									value={llm.lmstudio_model}
									models={models}
									loading={loadingModels}
									onChange={(v) => setLlm({ ...llm, lmstudio_model: v })}
									onRefresh={() => refreshModels(llm)}
								/>
							</>
						)}

						{llm.provider === "openai" && (
							<>
								<input
									type="password"
									className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white"
									placeholder="OpenAI API key (sk-…)"
									value={llm.openai_api_key}
									onChange={(e) =>
										setLlm({ ...llm, openai_api_key: e.target.value })
									}
								/>
								<input
									className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white"
									placeholder="API base URL"
									value={llm.openai_base_url}
									onChange={(e) =>
										setLlm({ ...llm, openai_base_url: e.target.value })
									}
								/>
								<ModelSelect
									label="OpenAI model"
									value={llm.openai_model}
									models={models}
									loading={loadingModels}
									onChange={(v) => setLlm({ ...llm, openai_model: v })}
									onRefresh={() => refreshModels(llm)}
								/>
							</>
						)}

						<button
							type="button"
							onClick={saveLlm}
							disabled={saving}
							className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 text-white text-sm font-black uppercase tracking-widest"
						>
							{saving ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							Save · {activeModel(llm) || "auto"}
						</button>
					</div>

					<div className="glass-card p-8 space-y-6">
						<div className="flex items-center gap-3">
							<SettingsIcon className="w-6 h-6 text-cosmos-400" />
							<div>
								<p className="font-black text-white uppercase tracking-widest text-sm">
									{caps.server.name}
								</p>
								<p className="text-sm text-slate-300">
									v{caps.server.version} · {caps.server.fastmcp ?? "FastMCP"}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4 text-sm">
							{Object.entries(caps.features).map(([k, v]) => (
								<div
									key={k}
									className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
								>
									<span className="text-slate-300 uppercase tracking-widest">
										{k.replace(/_/g, " ")}
									</span>
									<span className={v ? "text-emerald-400" : "text-slate-300"}>
										{v ? "on" : "off"}
									</span>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}

function ModelSelect({
	label,
	value,
	models,
	loading,
	onChange,
	onRefresh,
}: {
	label: string;
	value: string;
	models: string[];
	loading: boolean;
	onChange: (v: string) => void;
	onRefresh: () => void;
}) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label
					htmlFor="llm-model-select"
					className="text-xs font-black text-slate-300 uppercase tracking-widest"
				>
					{label}
				</label>
				<button
					type="button"
					onClick={onRefresh}
					className="flex items-center gap-1 text-xs text-cosmos-400 uppercase tracking-widest"
				>
					{loading ? (
						<Loader2 className="w-3 h-3 animate-spin" />
					) : (
						<RefreshCw className="w-3 h-3" />
					)}
					Refresh
				</button>
			</div>
			<select
				id="llm-model-select"
				data-testid="llm-model-select"
				className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="">Auto / first model</option>
				{models.map((m) => (
					<option key={m} value={m}>
						{m}
					</option>
				))}
			</select>
		</div>
	);
}
