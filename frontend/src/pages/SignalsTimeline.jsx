import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Radio, Calendar, TrendingUp, AlertCircle, 
  CheckCircle2, Globe, Cpu, ArrowUpRight 
} from "lucide-react";

export default function SignalsTimeline() {
  const [signals, setSignals] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sigRes, timeRes] = await Promise.all([
        api.get("/api/signals"),
        api.get("/api/startup/timeline")
      ]);
      setSignals(sigRes.data || []);
      setTimeline(timeRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-3 text-sm text-gray-400">Loading Market Signals & Milestones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Ecosystem Intelligence Feed</div>
        <h1 className="text-2xl font-bold text-white">Signals & Operational Timeline</h1>
        <p className="text-sm text-gray-400">External market indicators combined with your chronological venture milestones.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Market Signals Feed */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Radio size={18} className="text-emerald-400" /> Active Market & Macro Signals
          </h2>

          <div className="space-y-3">
            {signals.map((sig, idx) => {
              const isPos = sig.impact >= 0;
              return (
                <div key={idx} className="rounded-xl border border-gray-800 bg-black/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                      {sig.type} • {sig.source}
                    </span>
                    <span className={`text-xs font-bold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPos ? `+${sig.impact}` : sig.impact} Impact
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{sig.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{sig.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chronological Timeline */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" /> Operational Milestones
          </h2>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-800">
            {timeline.map((evt, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-2 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-black"></div>
                <div className="flex-1 rounded-xl border border-gray-800 bg-black/40 p-3.5 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span className="font-semibold text-emerald-400 uppercase">{evt.type}</span>
                    <span>{evt.date}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{evt.title}</div>
                  <div className="text-xs text-gray-300">{evt.description}</div>
                  {evt.change && (
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">Impact: {evt.change}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
