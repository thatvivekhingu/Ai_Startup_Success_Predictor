import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  SlidersHorizontal, Sparkles, TrendingUp, DollarSign, 
  ShieldCheck, AlertTriangle, Play, RefreshCw, BarChart2, Layers
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SimulationLab() {
  const [variables, setVariables] = useState({
    revenue_growth_delta_pct: 0,
    burn_reduction_pct: 15,
    headcount_delta: 0,
    pricing_change_pct: 0,
    funding_injection: 0
  });

  const [simResult, setSimResult] = useState(null);
  const [monteCarlo, setMonteCarlo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState("bootstrap");

  useEffect(() => {
    runSimulation();
    runMonteCarlo();
  }, []);

  const runSimulation = async (customVars = null) => {
    try {
      setLoading(true);
      const varsToUse = customVars || variables;
      const res = await api.post("/api/simulation", { variables: varsToUse });
      setSimResult(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runMonteCarlo = async () => {
    try {
      const res = await api.post("/api/simulation/monte-carlo");
      setMonteCarlo(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const applyPreset = (type) => {
    setActivePreset(type);
    let newVars = { ...variables };
    if (type === "aggressive") {
      newVars = { revenue_growth_delta_pct: 35, burn_reduction_pct: -20, headcount_delta: 4, pricing_change_pct: 0, funding_injection: 0 };
    } else if (type === "bootstrap") {
      newVars = { revenue_growth_delta_pct: -5, burn_reduction_pct: 25, headcount_delta: 0, pricing_change_pct: 5, funding_injection: 0 };
    } else if (type === "funded") {
      newVars = { revenue_growth_delta_pct: 40, burn_reduction_pct: -30, headcount_delta: 6, pricing_change_pct: 0, funding_injection: 15000000 };
    } else if (type === "cost_cut") {
      newVars = { revenue_growth_delta_pct: -10, burn_reduction_pct: 35, headcount_delta: -1, pricing_change_pct: 0, funding_injection: 0 };
    }
    setVariables(newVars);
    runSimulation(newVars);
  };

  const handleSliderChange = (key, value) => {
    const updated = { ...variables, [key]: Number(value) };
    setVariables(updated);
    runSimulation(updated);
  };

  // Build Monte Carlo chart data
  const mcChartData = monteCarlo ? monteCarlo.timeline_labels.map((label, idx) => ({
    month: label,
    p10: monteCarlo.fan_chart.worst_case_p10[idx],
    p50: monteCarlo.fan_chart.expected_p50[idx],
    p90: monteCarlo.fan_chart.best_case_p90[idx]
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Foundr Simulation Engine</div>
          <h1 className="text-2xl font-bold text-white">What-If Simulation Lab & Monte Carlo Risk</h1>
          <p className="text-sm text-gray-400">Simulate operating decisions deterministically with mathematical model grounding.</p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 mr-2">Strategy Presets:</span>
        <button
          onClick={() => applyPreset("bootstrap")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${activePreset === "bootstrap" ? "bg-emerald-500 text-black font-bold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        >
          🛡️ Bootstrap / Runway Preservation
        </button>
        <button
          onClick={() => applyPreset("aggressive")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${activePreset === "aggressive" ? "bg-emerald-500 text-black font-bold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        >
          🚀 Aggressive Growth (+35%)
        </button>
        <button
          onClick={() => applyPreset("funded")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${activePreset === "funded" ? "bg-emerald-500 text-black font-bold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        >
          💰 Series-A Expansion (₹1.5 Cr)
        </button>
        <button
          onClick={() => applyPreset("cost_cut")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${activePreset === "cost_cut" ? "bg-emerald-500 text-black font-bold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        >
          ✂️ Immediate Cost Trim (-35%)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sliders Control Panel */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-5 lg:col-span-5 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-emerald-400" /> Scenario Variables
          </h2>

          {/* Revenue Growth Delta */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Revenue Growth Adjustment</span>
              <span className="font-bold text-emerald-400">{variables.revenue_growth_delta_pct > 0 ? `+${variables.revenue_growth_delta_pct}` : variables.revenue_growth_delta_pct}%</span>
            </div>
            <input 
              type="range" min="-50" max="100" step="5"
              value={variables.revenue_growth_delta_pct}
              onChange={(e) => handleSliderChange("revenue_growth_delta_pct", e.target.value)}
              className="mt-2 w-full accent-emerald-500"
            />
          </div>

          {/* Burn Reduction Delta */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Burn Reduction / Trim</span>
              <span className="font-bold text-emerald-400">{variables.burn_reduction_pct}%</span>
            </div>
            <input 
              type="range" min="-50" max="60" step="5"
              value={variables.burn_reduction_pct}
              onChange={(e) => handleSliderChange("burn_reduction_pct", e.target.value)}
              className="mt-2 w-full accent-emerald-500"
            />
            <div className="text-[10px] text-gray-500 mt-1">Positive = Cost savings | Negative = Accelerated expenditure</div>
          </div>

          {/* Headcount Delta */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Headcount Delta (Team Hires)</span>
              <span className="font-bold text-emerald-400">{variables.headcount_delta > 0 ? `+${variables.headcount_delta}` : variables.headcount_delta} Team</span>
            </div>
            <input 
              type="range" min="-5" max="15" step="1"
              value={variables.headcount_delta}
              onChange={(e) => handleSliderChange("headcount_delta", e.target.value)}
              className="mt-2 w-full accent-emerald-500"
            />
          </div>

          {/* Pricing Change Delta */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Pricing / ARPU Increase</span>
              <span className="font-bold text-emerald-400">{variables.pricing_change_pct}%</span>
            </div>
            <input 
              type="range" min="-20" max="50" step="5"
              value={variables.pricing_change_pct}
              onChange={(e) => handleSliderChange("pricing_change_pct", e.target.value)}
              className="mt-2 w-full accent-emerald-500"
            />
          </div>

          {/* Funding Injection */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Funding Injection Check</span>
              <span className="font-bold text-emerald-400">₹{(variables.funding_injection / 100000).toFixed(0)} Lakhs</span>
            </div>
            <input 
              type="range" min="0" max="50000000" step="2500000"
              value={variables.funding_injection}
              onChange={(e) => handleSliderChange("funding_injection", e.target.value)}
              className="mt-2 w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Real-time Simulated Outcomes */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-5 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Simulated Outcome Matrix</h2>
            {simResult && (
              <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${simResult.deltas.risk_color === "emerald" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                {simResult.deltas.risk_impact}
              </span>
            )}
          </div>

          {simResult && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-black/40 p-3">
                <div className="text-[10px] text-gray-400">Simulated Runway</div>
                <div className="text-lg font-black text-white">{simResult.simulated.runway_months} Mo</div>
                <div className="text-[10px] text-emerald-400">{simResult.deltas.runway_delta_months >= 0 ? `+${simResult.deltas.runway_delta_months}m` : `${simResult.deltas.runway_delta_months}m`} shift</div>
              </div>

              <div className="rounded-lg bg-black/40 p-3">
                <div className="text-[10px] text-gray-400">Simulated Health</div>
                <div className="text-lg font-black text-white">{simResult.simulated.health_score} / 100</div>
                <div className="text-[10px] text-emerald-400">{simResult.deltas.health_score_delta >= 0 ? `+${simResult.deltas.health_score_delta}` : `${simResult.deltas.health_score_delta}`} pts</div>
              </div>

              <div className="rounded-lg bg-black/40 p-3">
                <div className="text-[10px] text-gray-400">Simulated Revenue</div>
                <div className="text-lg font-black text-white">₹{(simResult.simulated.revenue / 100000).toFixed(1)}L</div>
                <div className="text-[10px] text-gray-400">{simResult.deltas.revenue_delta_pct}% YoY</div>
              </div>

              <div className="rounded-lg bg-black/40 p-3">
                <div className="text-[10px] text-gray-400">Simulated Burn</div>
                <div className="text-lg font-black text-white">₹{(simResult.simulated.burn / 100000).toFixed(1)}L</div>
                <div className="text-[10px] text-gray-400">{simResult.simulated.team_size} Team</div>
              </div>
            </div>
          )}

          {/* Monte Carlo Fan Chart */}
          <div className="rounded-xl border border-gray-800/80 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">12-Month Monte Carlo Survival Distribution</div>
                <div className="text-[10px] text-gray-400">1,500 stochastic trials across revenue volatility & burn drift</div>
              </div>
              {monteCarlo && (
                <div className="text-right">
                  <div className="text-xs text-gray-400">Survival Probability</div>
                  <div className="text-sm font-black text-emerald-400">{monteCarlo.survival_probability_pct}%</div>
                </div>
              )}
            </div>

            <div className="mt-4 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mcChartData}>
                  <defs>
                    <linearGradient id="p90Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", borderRadius: 8, fontSize: 11 }}
                    formatter={(val) => [`₹${(val).toLocaleString()}`, ""]}
                  />
                  <Area type="monotone" dataKey="p90" name="Best Case (P90)" stroke="#10b981" fill="url(#p90Grad)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="p50" name="Expected Median (P50)" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} />
                  <Area type="monotone" dataKey="p10" name="Worst Case (P10)" stroke="#ef4444" fillOpacity={0} strokeWidth={1.5} strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
