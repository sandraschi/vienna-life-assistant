import { useEffect, useRef, useState } from 'react';
import { Bot, Cpu, Loader2, Send, User, Sparkles } from 'lucide-react';
import { API, apiGet } from '../lib/api';
import { type LlmConfig, chatRequestBody, loadLlmLocal, DEFAULT_LLM_CONFIG } from '../lib/llm-settings';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

type LlmStatus = {
    provider: string;
    ok: boolean;
    model: string | null;
    local_llm?: boolean;
    cloud_llm?: boolean;
    error?: string | null;
};

type Preprompt = { id: string; label: string; message: string };

type LlmSettings = {
    provider: string;
    ollama_url: string;
    ollama_model: string;
    lmstudio_url: string;
    lmstudio_model: string;
    openai_base_url: string;
    openai_model: string;
};

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content:
                'Servus, Sandra. ViLife chat is online — Alsergrund grid ready. Pick a Vienna preprompt or ask about calendar, transit, Kaffeehaus, or shopping.',
        },
    ]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [llmStatus, setLlmStatus] = useState<LlmStatus | null>(null);
    const [llmCfg, setLlmCfg] = useState<LlmConfig>(DEFAULT_LLM_CONFIG);
    const [preprompts, setPreprompts] = useState<Preprompt[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const local = loadLlmLocal();
        apiGet<LlmSettings>(API.settings)
            .then((s) => {
                setLlmCfg({
                    provider: (local.provider || s.provider || 'ollama') as LlmConfig['provider'],
                    ollama_url: s.ollama_url || DEFAULT_LLM_CONFIG.ollama_url,
                    ollama_model: s.ollama_model || local.ollama_model || '',
                    lmstudio_url: s.lmstudio_url || DEFAULT_LLM_CONFIG.lmstudio_url,
                    lmstudio_model: s.lmstudio_model || '',
                    openai_base_url: s.openai_base_url || DEFAULT_LLM_CONFIG.openai_base_url,
                    openai_model: s.openai_model || DEFAULT_LLM_CONFIG.openai_model,
                    openai_api_key: local.openai_api_key || '',
                });
            })
            .catch(() => setLlmCfg({ ...DEFAULT_LLM_CONFIG, ...local }));
        apiGet<LlmStatus>(API.llmStatus).then(setLlmStatus).catch(() => setLlmStatus(null));
        apiGet<{ preprompts: Preprompt[] }>(API.llmPreprompts)
            .then((d) => setPreprompts(d.preprompts || []))
            .catch(() => setPreprompts([]));
        const t = setInterval(() => {
            apiGet<LlmStatus>(API.llmStatus).then(setLlmStatus).catch(() => {});
        }, 30000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, sending]);

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;

        const history = messages.slice(-10);
        setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
        setSending(true);

        try {
            const res = await fetch(API.llmChat, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatRequestBody(llmCfg, trimmed, history)),
            });
            const data = await res.json();
            if (data.ok) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                const hint =
                    llmCfg.provider === 'openai'
                        ? 'Check Settings — OpenAI API key and model'
                        : llmCfg.provider === 'lmstudio'
                          ? 'Check Settings — LM Studio on 1234'
                          : 'Check Settings — Ollama on 11434';
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: `Error: ${data.error || 'LLM request failed'}. ${hint}` },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Connection error: ${err instanceof Error ? err.message : 'unknown'}`,
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] page-enter space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Chat</h1>
                    <p className="text-slate-500 mt-2 text-sm">Vienna-aware LLM · Ollama · LM Studio · OpenAI</p>
                </div>
                {llmStatus && (
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                        <Cpu className={`w-4 h-4 ${llmStatus.ok ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <span className={llmStatus.ok ? 'text-emerald-400' : 'text-amber-400'}>
                            {llmStatus.ok
                                ? `${llmStatus.provider} · ${llmStatus.model || 'model'}`
                                : `LLM offline — ${llmCfg.provider}`}
                        </span>
                    </div>
                )}
            </div>

            {preprompts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {preprompts.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => sendMessage(p.message)}
                            disabled={sending}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-cosmos-500/30 text-cosmos-400 bg-cosmos-500/10 hover:bg-cosmos-500/20 transition-colors"
                        >
                            <Sparkles className="w-3 h-3" />
                            {p.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="glass-card flex-1 flex flex-col overflow-hidden min-h-0">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                    {messages.map((msg, i) => (
                        <div key={i} className="flex gap-3">
                            <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                    msg.role === 'user'
                                        ? 'bg-white/[0.05] border-white/10'
                                        : 'bg-cosmos-500/10 border-cosmos-500/30'
                                }`}
                            >
                                {msg.role === 'user' ? (
                                    <User className="w-4 h-4 text-slate-400" />
                                ) : (
                                    <Bot className="w-4 h-4 text-cosmos-400" />
                                )}
                            </div>
                            <div className="text-sm text-slate-300 whitespace-pre-wrap max-w-[85%] leading-relaxed">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {sending && (
                        <div className="flex gap-3 text-slate-500 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-cosmos-400" />
                            Thinking…
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-white/[0.06] flex gap-2">
                    <input
                        className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cosmos-500/40"
                        placeholder={llmStatus?.ok ? 'Fragen Sie ViLife…' : 'Configure LLM in Settings'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage(input);
                                setInput('');
                            }
                        }}
                        disabled={sending}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            sendMessage(input);
                            setInput('');
                        }}
                        disabled={sending || !input.trim()}
                        className="px-4 py-3 rounded-2xl bg-cosmos-500 hover:bg-cosmos-600 disabled:opacity-40 text-white transition-colors"
                        aria-label="Send"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
