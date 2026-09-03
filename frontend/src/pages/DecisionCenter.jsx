import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  AlertOctagon, AlertTriangle, Sparkles, ArrowRight, 
  CheckCircle, Zap, TrendingUp, ShieldAlert, SlidersHorizontal 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DecisionCenter() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/early-warnings");
      setWarnings(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const critical = warnings.filter(w => w.severity === "critical");
  const warnList = warnings.filter(w => w.severity === "warning");
  const opportunities = warnings.filter(w => w.severity === "opportunity");

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-3 text-sm text-gray-400">Loading Founder Decision Radar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Founder Decision Center</h1>
          <p className="text-sm text-gray-400">Proactive anomaly detection, operational risks, and highest-leverage founder actions.</p>
        </div>
        <button 
          onClick={() => navigate("/simulation")}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          <SlidersHorizontal size={16} /> Open Simulation Lab
        </button>
      </div>

      {/* Triage Summary Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertOctagon size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Action Required</span>
          </div>
          <div className="mt-2 text-3xl font-black text-white">{critical.length}</div>
          <div className="mt-1 text-xs text-rose-300">Requires immediate intervention</div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Operational Warnings</span>
          </div>
          <div className="mt-2 text-3xl font-black text-white">{warnList.length}</div>
          <div className="mt-1 text-xs text-amber-300">Metrics showing negative drift</div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Strategic Opportunities</span>
          </div>
          <div className="mt-2 text-3xl font-black text-white">{opportunities.length}</div>
          <div className="mt-1 text-xs text-emerald-300">High-leverage growth vectors</div>
        </div>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-white">What Needs My Attention Today?</h2>

        {warnings.map((item, idx) => {
          const isCritical = item.severity === "critical";
          const isOpp = item.severity === "opportunity";
          const borderClass = isCritical ? "border-rose-500/40 bg-rose-950/10" : isOpp ? "border-emerald-500/40 bg-emerald-950/10" : "border-amber-500/40 bg-amber-950/10";
          const badgeClass = isCritical ? "bg-rose-500/20 text-rose-300" : isOpp ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300";
          
          return (
            <div key={idx} className={`rounded-xl border p-5 transition hover:border-gray-600 ${borderClass}`}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                      {item.severity} • {item.category}
                    </span>
                    <span className="text-xs text-gray-400">Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
                <div className="rounded-lg bg-black/40 px-3 py-2 text-right">
                  <div className="text-[10px] text-gray-400">Current vs Baseline</div>
                  <div className="text-sm font-semibold text-white">{item.current_value} <span className="text-xs text-gray-500">({item.previous_value})</span></div>
                </div>
              </div>

              {/* Action Remedy Box */}
              <div className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-white/5 bg-white/5 p-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-2">
                  <Zap size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  <div className="text-xs text-gray-200">
                    <span className="font-semibold text-emerald-400">Recommended Action:</span> {item.recommended_action}
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/simulation")}
                  className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Simulate Impact <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
