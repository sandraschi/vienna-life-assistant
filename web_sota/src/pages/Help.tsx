import { BookOpen } from 'lucide-react';

export default function Help() {
    return (
        <div className="space-y-8 page-enter max-w-3xl">
            <div>
                <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">Help</h1>
                <p className="text-slate-500 mt-2 text-sm">ViLife — Vienna Life Assistant (human carrier)</p>
            </div>
            <div className="glass-card p-8 space-y-6 text-sm text-slate-400 leading-relaxed">
                <section className="flex gap-4">
                    <BookOpen className="w-6 h-6 text-cosmos-400 shrink-0" />
                    <div>
                        <h2 className="text-white font-black uppercase tracking-widest text-xs mb-2">Naming</h2>
                        <p>
                            <strong className="text-slate-200">ViLife</strong> = this app ({' '}
                            <code className="text-cosmos-400">vienna-life-assistant</code>).{' '}
                            <strong className="text-slate-200">vla-robotics</strong> = separate repo{' '}
                            <code className="text-cosmos-400">vla-mcp</code> (X Square robots). Never confuse bare &quot;VLA&quot;.
                        </p>
                    </div>
                </section>
                <section>
                    <h2 className="text-white font-black uppercase tracking-widest text-xs mb-2">Ports</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Frontend (Vite): <code>10988</code></li>
                        <li>Backend + MCP HTTP: <code>10922</code> — tool <code>vienna_life</code> at <code>/mcp</code></li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-white font-black uppercase tracking-widest text-xs mb-2">Deprecated</h2>
                    <p>
                        <code>vienna-live-mcp</code> is quarantined — duplicated ViLife. Use this webapp +{' '}
                        <code>fleet_call(server=&quot;vienna-life&quot;)</code> instead.
                    </p>
                </section>
                <section>
                    <h2 className="text-white font-black uppercase tracking-widest text-xs mb-2">Start</h2>
                    <p><code>powershell -File D:\Dev\repos\vienna-life-assistant\web_sota\start.ps1</code></p>
                </section>
            </div>
        </div>
    );
}
