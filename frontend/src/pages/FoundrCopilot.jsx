import { useState } from "react";
import api from "../services/api";
import { 
  Bot, Send, Sparkles, CheckCircle, Terminal, 
  HelpCircle, ChevronRight, Activity, Cpu, ShieldCheck 
} from "lucide-react";

export default function FoundrCopilot() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "agent",
      text: "👋 Hello Founder! I am your **Foundr Agentic Copilot**. I have access to your live **Startup Digital Twin**, **Monte Carlo Risk Engine**, **SHAP Explainers**, and **What-If Simulation Lab**. Ask me any strategic decision question or scenario!"
    }
  ]);
  const [activeTrace, setActiveTrace] = useState(null);

  const sampleQuestions = [
    "How can I survive the next 12 months?",
    "Should I hire 3 senior developers right now?",
    "What happens if our burn rate increases by 20%?",
    "Which operational risk should I fix first?",
    "Aapde next 6 mahina survive kari shakishu?"
  ];

  const handleAsk = async (questionToAsk = null) => {
    const textToSend = questionToAsk || query;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user", text: textToSend };
    setConversation(prev => [...prev, userMsg]);
    if (!questionToAsk) setQuery("");
    setLoading(true);
    setActiveTrace(null);

    try {
      const res = await api.post("/api/agent/run", { query: textToSend });
      setActiveTrace(res.data.tools_called);
      
      const agentMsg = {
        role: "agent",
        text: res.data.response_markdown,
        tools: res.data.tools_called,
        health: res.data.health_score,
        runway: res.data.runway_months
      };
      setConversation(prev => [...prev, agentMsg]);
    } catch (e) {
      console.error(e);
      setConversation(prev => [...prev, {
        role: "agent",
        text: "⚠️ Apologies, encountered a temporary issue connecting to the decision intelligence engine. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900 via-[#16201a] to-gray-900 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Foundr Agentic Copilot</h1>
            <p className="text-xs text-gray-400">Autonomous Decision Intelligence with Tool Execution Sandbox & Grounded Reasoning.</p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(q)}
            disabled={loading}
            className="rounded-lg border border-gray-800 bg-gray-900/60 px-3 py-1.5 text-xs text-gray-300 transition hover:border-emerald-500 hover:text-white disabled:opacity-50"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-5 space-y-4 min-h-[420px] max-h-[600px] overflow-y-auto">
        {conversation.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "agent" && (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Bot size={18} />
              </div>
            )}
            
            <div className={`max-w-2xl rounded-xl p-4 text-sm ${msg.role === "user" ? "bg-emerald-600 text-white font-medium" : "border border-gray-800 bg-black/40 text-gray-200"}`}>
              {/* Tool Execution Tags if Agent */}
              {msg.tools && (
                <div className="mb-3 rounded-lg border border-white/5 bg-white/5 p-2.5 text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Terminal size={12} /> Autonomous Tools Executed ({msg.tools.length})
                  </div>
                  {msg.tools.map((t, tidx) => (
                    <div key={tidx} className="flex items-center gap-2 text-gray-300 text-[11px]">
                      <CheckCircle size={12} className="text-emerald-400" />
                      <span className="font-mono text-emerald-300">{t.tool}():</span> {t.detail}
                    </div>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-emerald-400 animate-pulse">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10">
              <Bot size={18} />
            </div>
            <span>Foundr Agent inspecting Digital Twin, running Monte Carlo simulation & evaluating strategy...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask your startup anything... (e.g. 'Can I survive the next 12 months?')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          disabled={loading}
          className="flex-1 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
        >
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
}
