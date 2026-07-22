import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Cpu, Download, Eraser, Loader2, Send, Sparkles, User } from 'lucide-react';
import { API, apiGet } from '../lib/api';
import { type LlmConfig, chatRequestBody, loadLlmLocal, DEFAULT_LLM_CONFIG } from '../lib/llm-settings';

const LS_HISTORY = 'vilife-chat-history';
const LS_PERSONALITY = 'vilife-chat-personality';
const MAX_HISTORY = 100;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

type LlmStatus = { provider: string; ok: boolean; model: string | null; local_llm?: boolean; cloud_llm?: boolean; error?: string | null };

type Preprompt = { id: string; label: string; message: string };

type LlmSettings = { provider: string; ollama_url: string; ollama_model: string; lmstudio_url: string; lmstudio_model: string; openai_base_url: string; openai_model: string };

const PERSONALITIES = [
  { id: 'vienna-guide', label: 'Vienna Guide', prompt: 'You are a Vienna local guide. Help with local tips, transit, Kaffeehaus culture, and Wienerisch charm.' },
  { id: 'assistant', label: 'Personal Assistant', prompt: 'You are a personal assistant for Vienna life. Help with calendar, errands, and daily planning.' },
  { id: 'analyst', label: 'Urban Analyst', prompt: 'You are an urban lifestyle analyst. Provide insights on Vienna neighborhoods, transit patterns, and city living.' },
  { id: 'custom', label: 'Custom', prompt: '' },
];

const EXAMPLE_PROMPTS = [
  'What is happening in Alsergrund today?',
  'Plan a coffeehouse tour',
  'Check public transit connections',
  'Find a good Heuriger this weekend',
  'Remind me of my appointments',
  'What museums are open today?',
  'Suggest a walking route through the 1st district',
  'Translate this to Viennese dialect',
  'Where is the nearest Pharmacy?',
];

function loadHistory(): ChatMessage[] {
  try { const s = localStorage.getItem(LS_HISTORY); if (s) return JSON.parse(s); } catch { return []; }
  return [];
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadHistory();
    if (saved.length > 0) return saved;
    return [{ role: 'assistant', content: 'Servus, Sandra. ViLife chat is online \u2014 Alsergrund grid ready. Pick a Vienna preprompt or ask about calendar, transit, Kaffeehaus, or shopping.' }];
  });
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [llmStatus, setLlmStatus] = useState<LlmStatus | null>(null);
  const [llmCfg, setLlmCfg] = useState<LlmConfig>(DEFAULT_LLM_CONFIG);
  const [preprompts, setPreprompts] = useState<Preprompt[]>([]);
  const [personality, setPersonality] = useState(() => localStorage.getItem(LS_PERSONALITY) || 'vienna-guide');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { localStorage.setItem(LS_HISTORY, JSON.stringify(messages.slice(-MAX_HISTORY))); } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => { localStorage.setItem(LS_PERSONALITY, personality); }, [personality]);

  useEffect(() => {
    const local = loadLlmLocal();
    apiGet<LlmSettings>(API.settings).then((s) => {
      setLlmCfg({ provider: (local.provider || s.provider || 'ollama') as LlmConfig['provider'], ollama_url: s.ollama_url || DEFAULT_LLM_CONFIG.ollama_url, ollama_model: s.ollama_model || local.ollama_model || '', lmstudio_url: s.lmstudio_url || DEFAULT_LLM_CONFIG.lmstudio_url, lmstudio_model: s.lmstudio_model || '', openai_base_url: s.openai_base_url || DEFAULT_LLM_CONFIG.openai_base_url, openai_model: s.openai_model || DEFAULT_LLM_CONFIG.openai_model, openai_api_key: local.openai_api_key || '' });
    }).catch(() => setLlmCfg({ ...DEFAULT_LLM_CONFIG, ...local }));
    apiGet<LlmStatus>(API.llmStatus).then(setLlmStatus).catch(() => setLlmStatus(null));
    apiGet<{ preprompts: Preprompt[] }>(API.llmPreprompts).then((d) => setPreprompts(d.preprompts || [])).catch(() => setPreprompts([]));
    const t = setInterval(() => { apiGet<LlmStatus>(API.llmStatus).then(setLlmStatus).catch(() => {}); }, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, sending]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const history = messages.slice(-10);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setSending(true);

    try {
      const res = await fetch(API.llmChat, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(chatRequestBody(llmCfg, trimmed, history)) });
      const data = await res.json();
      if (data.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        const hint = llmCfg.provider === 'openai' ? 'Check Settings \u2014 OpenAI API key and model' : llmCfg.provider === 'lmstudio' ? 'Check Settings \u2014 LM Studio on 1234' : 'Check Settings \u2014 Ollama on 11434';
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error || 'LLM request failed'}. ${hint}` }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Connection error: ${err instanceof Error ? err.message : 'unknown'}` }]);
    } finally {
      setSending(false);
    }
  }, [sending, messages, llmCfg]);

  const handleClear = useCallback(() => {
    setMessages([]);
    try { localStorage.removeItem(LS_HISTORY); } catch { /* ignore */ }
  }, []);

  const handleExport = useCallback(() => {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `vilife-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click(); URL.revokeObjectURL(url);
  }, [messages]);

  return (
    <div data-testid="chat-page" className="flex flex-col h-[calc(100vh-10rem)] page-enter space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Chat</h1>
          <p className="text-slate-500 mt-2 text-sm">Vienna-aware LLM \u00B7 Ollama \u00B7 LM Studio \u00B7 OpenAI</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded">skill:vienna-guide</span>
          <select data-testid="personality-select" value={personality} onChange={(e) => setPersonality(e.target.value)} className="bg-slate-800 text-sm text-slate-300 border border-slate-700 rounded px-2 py-1">
            {PERSONALITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          {llmStatus && (
            <div className="flex items-center gap-1 text-sm font-black uppercase tracking-widest">
              <Cpu className={`w-4 h-4 ${llmStatus.ok ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className={llmStatus.ok ? 'text-emerald-400' : 'text-amber-400'}>{llmStatus.ok ? `${llmStatus.provider} · ${llmStatus.model || 'model'}` : `LLM offline \u2014 ${llmCfg.provider}`}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {preprompts.length > 0 && preprompts.map((p) => (
          <button key={p.id} type="button" onClick={() => sendMessage(p.message)} disabled={sending} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-cosmos-500/30 text-cosmos-400 bg-cosmos-500/10 hover:bg-cosmos-500/20 transition-colors">
            <Sparkles className="w-3 h-3" />{p.label}
          </button>
        ))}
        {EXAMPLE_PROMPTS.filter(() => preprompts.length === 0).map((p) => (
          <button key={p} onClick={() => setInput(p)} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] border border-cosmos-500/20 text-slate-400 hover:text-cosmos-400 hover:border-cosmos-500/40 transition-colors bg-slate-900/50">
            <Sparkles className="w-2.5 h-2.5" />{p}
          </button>
        ))}
      </div>

      <div data-testid="chat-messages" className="glass-card flex-1 flex flex-col overflow-hidden min-h-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-white/[0.05] border-white/10' : 'bg-cosmos-500/10 border-cosmos-500/30'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-400" /> : <Bot className="w-4 h-4 text-cosmos-400" />}
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-wrap max-w-[85%] leading-relaxed">{msg.content}</div>
            </div>
          ))}
          {sending && <div className="flex gap-3 text-slate-500 text-sm"><Loader2 className="w-4 h-4 animate-spin text-cosmos-400" /> Thinking\u2026</div>}
        </div>
        <div className="p-4 border-t border-white/[0.06] flex flex-col gap-2">
          <div className="flex gap-1">
            <button data-testid="chat-export" onClick={handleExport} disabled={messages.length === 0} className="p-1.5 rounded text-slate-500 hover:text-slate-300 disabled:opacity-30" title="Export"><Download className="w-3.5 h-3.5" /></button>
            <button data-testid="chat-clear" onClick={handleClear} disabled={messages.length === 0} className="p-1.5 rounded text-slate-500 hover:text-slate-300 disabled:opacity-30" title="Clear"><Eraser className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex gap-2">
            <input data-testid="chat-input" className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cosmos-500/40" placeholder={llmStatus?.ok ? 'Fragen Sie ViLife\u2026' : 'Configure LLM in Settings'} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); setInput(''); } }} disabled={sending} />
            <button data-testid="chat-send" type="button" onClick={() => { sendMessage(input); setInput(''); }} disabled={sending || !input.trim()} className="px-4 py-3 rounded-2xl bg-cosmos-500 hover:bg-cosmos-600 disabled:opacity-40 text-white transition-colors" aria-label="Send"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
