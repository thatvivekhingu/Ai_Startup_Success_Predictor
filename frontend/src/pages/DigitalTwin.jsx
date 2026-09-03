import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Building2, DollarSign, Users, TrendingUp, AlertTriangle, 
  ShieldCheck, Cpu, ArrowUpRight, CheckCircle2, Clock, Globe
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DigitalTwin() {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePillar, setActivePillar] = useState("financial");

  useEffect(() => {
    fetchTwin();
  }, []);

  const fetchTwin = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/startup/twin");
      setTwin(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !twin) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-3 text-sm text-gray-400">Syncing Startup Digital Twin...</p>
        </div>
      </div>
    );
  }

  const { startup, health_score, health_status, health_summary, runway_months, current_financials, current_customers, current_team, historical_financials } = twin;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900 via-[#131d16] to-gray-900 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Digital Twin Active State • {startup.is_demo ? "Demo Environment" : "Live Stream"}
            </div>
            <h1 className="mt-1 text-2xl font-bold text-white">{startup.name}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {startup.state_city} • {startup.sector} ({startup.industry}) • Stage: <span className="text-white font-medium">{startup.stage}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 px-5 py-3 text-center">
              <div className="text-xs font-medium text-emerald-400">Health Index</div>
              <div className="text-2xl font-black text-white">{health_score} <span className="text-xs text-gray-400">/100</span></div>
              <div className="text-[10px] font-semibold text-emerald-300 uppercase">{health_status}</div>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 px-5 py-3 text-center">
              <div className="text-xs font-medium text-blue-400">Funded Runway</div>
              <div className="text-2xl font-black text-white">{runway_months} <span className="text-xs text-gray-400">Mo</span></div>
              <div className="text-[10px] font-semibold text-blue-300 uppercase">Resilience Buffer</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Financial */}
        <div 
          onClick={() => setActivePillar("financial")}
          className={`cursor-pointer rounded-xl border p-5 transition ${activePillar === "financial" ? "border-emerald-500 bg-emerald-950/20" : "border-gray-800 bg-gray-900/60 hover:border-gray-700"}`}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400"><DollarSign size={20} /></div>
            <span className="text-xs font-medium text-emerald-400">Runway {runway_months}m</span>
          </div>
          <div className="mt-4 text-xs text-gray-400">Monthly Revenue</div>
          <div className="text-xl font-bold text-white">₹{(current_financials.revenue / 100000).toFixed(1)} Lakhs</div>
          <div className="mt-1 text-xs text-gray-400">Burn: ₹{(current_financials.burn / 100000).toFixed(1)}L/mo</div>
        </div>

        {/* Customers */}
        <div 
          onClick={() => setActivePillar("customers")}
          className={`cursor-pointer rounded-xl border p-5 transition ${activePillar === "customers" ? "border-blue-500 bg-blue-950/20" : "border-gray-800 bg-gray-900/60 hover:border-gray-700"}`}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400"><Users size={20} /></div>
            <span className="text-xs font-medium text-blue-400">Retention {current_customers.retention_rate}%</span>
          </div>
          <div className="mt-4 text-xs text-gray-400">Active Accounts</div>
          <div className="text-xl font-bold text-white">{current_customers.count} Customers</div>
          <div className="mt-1 text-xs text-gray-400">Monthly Churn: {current_customers.churn_rate}%</div>
        </div>

        {/* Team */}
        <div 
          onClick={() => setActivePillar("team")}
          className={`cursor-pointer rounded-xl border p-5 transition ${activePillar === "team" ? "border-purple-500 bg-purple-950/20" : "border-gray-800 bg-gray-900/60 hover:border-gray-700"}`}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400"><Cpu size={20} /></div>
            <span className="text-xs font-medium text-purple-400">{current_team.engineers} Engineers</span>
          </div>
          <div className="mt-4 text-xs text-gray-400">Headcount</div>
          <div className="text-xl font-bold text-white">{current_team.headcount} Team Members</div>
          <div className="mt-1 text-xs text-gray-400">Sales: {current_team.sales} Reps</div>
        </div>

        {/* Market */}
        <div 
          onClick={() => setActivePillar("market")}
          className={`cursor-pointer rounded-xl border p-5 transition ${activePillar === "market" ? "border-amber-500 bg-amber-950/20" : "border-gray-800 bg-gray-900/60 hover:border-gray-700"}`}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400"><Globe size={20} /></div>
            <span className="text-xs font-medium text-amber-400">Seed Stage</span>
          </div>
          <div className="mt-4 text-xs text-gray-400">Market Domain</div>
          <div className="text-xl font-bold text-white">{startup.sector}</div>
          <div className="mt-1 text-xs text-gray-400">Model: {startup.business_model}</div>
        </div>
      </div>

      {/* Historical Longitudinal Trajectory */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">12-Month Financial Velocity & Burn Trajectory</h2>
            <p className="text-xs text-gray-400">Historical performance captured across digital twin monthly checkpoints.</p>
          </div>
        </div>

        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historical_financials}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", borderRadius: 8, fontSize: 12 }}
                formatter={(val) => [`₹${(val).toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              <Area type="monotone" dataKey="burn" name="Operating Burn" stroke="#ef4444" fillOpacity={1} fill="url(#colorBurn)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
