export type LlmProvider = "ollama" | "lmstudio" | "openai";

export type LlmConfig = {
	provider: LlmProvider;
	ollama_url: string;
	ollama_model: string;
	lmstudio_url: string;
	lmstudio_model: string;
	openai_base_url: string;
	openai_model: string;
	openai_api_key: string;
};

export const DEFAULT_LLM_CONFIG: LlmConfig = {
	provider: "ollama",
	ollama_url: "http://127.0.0.1:11434",
	ollama_model: "",
	lmstudio_url: "http://127.0.0.1:1234/v1",
	lmstudio_model: "",
	openai_base_url: "https://api.openai.com/v1",
	openai_model: "gpt-4o-mini",
	openai_api_key: "",
};

export const LLM_STORAGE = {
	provider: "vilife-llm-provider",
	model: "vilife-llm-model",
	openaiKey: "vilife-openai-key",
} as const;

export function activeModel(cfg: LlmConfig): string {
	if (cfg.provider === "ollama") return cfg.ollama_model;
	if (cfg.provider === "lmstudio") return cfg.lmstudio_model;
	return cfg.openai_model;
}

export function loadLlmLocal(): Partial<LlmConfig> {
	return {
		provider:
			(localStorage.getItem(LLM_STORAGE.provider) as LlmProvider) || "ollama",
		openai_api_key: localStorage.getItem(LLM_STORAGE.openaiKey) || "",
		ollama_model: localStorage.getItem(LLM_STORAGE.model) || "",
	};
}

export function saveLlmLocal(cfg: LlmConfig): void {
	localStorage.setItem(LLM_STORAGE.provider, cfg.provider);
	localStorage.setItem(LLM_STORAGE.model, activeModel(cfg));
	if (cfg.openai_api_key) {
		localStorage.setItem(LLM_STORAGE.openaiKey, cfg.openai_api_key);
	}
}

export function chatRequestBody(
	cfg: LlmConfig,
	message: string,
	history: { role: string; content: string }[],
) {
	return {
		message,
		history,
		provider: cfg.provider,
		model: activeModel(cfg),
		ollama_url: cfg.ollama_url,
		lmstudio_url: cfg.lmstudio_url,
		openai_base_url: cfg.openai_base_url,
		openai_api_key: cfg.openai_api_key,
	};
}

export function settingsSaveBody(cfg: LlmConfig) {
	return {
		provider: cfg.provider,
		ollama_url: cfg.ollama_url,
		ollama_model: cfg.ollama_model,
		lmstudio_url: cfg.lmstudio_url,
		lmstudio_model: cfg.lmstudio_model,
		openai_base_url: cfg.openai_base_url,
		openai_model: cfg.openai_model,
		openai_api_key: cfg.openai_api_key || undefined,
	};
}
