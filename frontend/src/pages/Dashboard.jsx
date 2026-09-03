import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Activity, DollarSign, TrendingUp, ShieldAlert, Sparkles, 
  ArrowUpRight, ArrowRight, Zap, Bot, SlidersHorizontal, 
  Calendar, Layers, CheckCircle2, AlertOctagon, HelpCircle
} from "lucide-react";
import { MetricCard, Card, Badge, Button, Spinner } from "../components/UI";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [twin, setTwin] = useState(null);
  const [health, setHealth] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [twinRes, healthRes, forecastRes, warnRes] = await Promise.all([
        api.get("/api/startup/twin"),
        api.get("/api/startup/health"),
        api.get("/api/forecast"),
        api.get("/api/early-warnings")
      ]);
      setTwin(twinRes.data);
      setHealth(healthRes.data);
      setForecast(forecastRes.data);
      setWarnings(warnRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !twin) {
    return <Spinner label="Calibrating Startup Digital Twin & Health Score..." />;
  }

  const { startup, current_financials, current_customers, current_team, historical_financials } = twin;
  const criticalWarnings = warnings.filter(w => w.severity === "critical");
  const topAction = warnings.length > 0 ? warnings[0] : null;

  // Combine forecast periods for chart
  const forecastChartData = forecast ? forecast.forecast_periods.map((period, idx) => ({
    period: period,
    revenue: forecast.revenue_forecast.base[idx],
    burn: forecast.burn_forecast[idx],
    cash: forecast.cash_trajectory.base[idx]
  })) : [];

  return (
    <div className="space-y-8">
      {/* 1. Hero Command Strip: "How is my startup doing?" */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d1017] via-[#101420] to-[#0a0d14] p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-accent-emerald/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="emerald">Live Digital Twin</Badge>
              <span className="text-xs text-dark-muted">• {startup.state_city} • {startup.sector} ({startup.stage} Stage)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              {startup.name}
            </h1>
            <p className="text-sm text-dark-muted max-w-xl">
              {health?.summary || "Operational health is stable with healthy runway and solid traction momentum."}
            </p>
          </div>

          {/* Health & Runway Dials */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center min-w-[130px] backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-dark-muted">Startup Health</div>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-white">{health?.overall_health || twin.health_score}</span>
                <span className="text-xs text-dark-muted">/100</span>
              </div>
              <div className="mt-1 text-[10px] font-bold text-accent-emerald uppercase tracking-wider">{health?.status || twin.health_status}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center min-w-[130px] backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-dark-muted">Funded Runway</div>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-accent-cyan">{twin.runway_months}</span>
                <span className="text-xs text-dark-muted">Months</span>
              </div>
              <div className="mt-1 text-[10px] font-bold text-accent-cyan uppercase tracking-wider">
                {twin.runway_months >= 12 ? "Safe Horizon" : "Action Needed"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Operational Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`₹${(current_financials.revenue / 100000).toFixed(1)} Lakhs`}
          subtitle="Annualized Run-rate: ₹2.2 Cr"
          delta="+18.4% MoM"
          deltaType="positive"
          icon={TrendingUp}
          glowColor="emerald"
          onClick={() => navigate("/twin")}
        />
        <MetricCard
          title="Monthly Operating Burn"
          value={`₹${(current_financials.burn / 100000).toFixed(1)} Lakhs`}
          subtitle={`Burn Multiple: ${twin.burn_multiple}x`}
          delta="+3.2% vs Q2"
          deltaType="negative"
          icon={DollarSign}
          glowColor="amber"
          onClick={() => navigate("/simulation")}
        />
        <MetricCard
          title="Customer Base & Retention"
          value={`${current_customers.count} Accounts`}
          subtitle={`Net Retention: ${current_customers.retention_rate}%`}
          delta="-0.4% Churn"
          deltaType="positive"
          icon={Activity}
          glowColor="cyan"
          onClick={() => navigate("/twin")}
        />
        <MetricCard
          title="Team Velocity & R&D"
          value={`${current_team.headcount} Members`}
          subtitle={`${current_team.engineers} Eng / ${current_team.sales} Sales`}
          delta="Stable"
          deltaType="neutral"
          icon={Layers}
          glowColor="brand"
          onClick={() => navigate("/twin")}
        />
      </div>

      {/* 3. Signature: "What Should I Do Now?" Priority Action Box */}
      {topAction && (
        <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-950/30 via-[#101426] to-[#0c0f1d] p-6 shadow-glow-brand">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-brand-500/10 p-3 text-brand-400 shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Signature Priority Decision</span>
                  <Badge variant={topAction.severity === "critical" ? "rose" : "amber"} size="sm">
                    {topAction.severity}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{topAction.title}</h2>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  <span className="font-semibold text-white">Recommended Strategy:</span> {topAction.recommended_action}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Button 
                variant="primary" 
                size="md" 
                icon={SlidersHorizontal} 
                onClick={() => navigate("/simulation")}
              >
                Simulate Strategy
              </Button>
              <Button 
                variant="secondary" 
                size="md" 
                icon={Bot} 
                onClick={() => navigate("/copilot")}
              >
                Ask Copilot
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 6-Pillar Health Score Breakdown & Forecast Trajectory */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 6-Pillar Health Breakdown */}
        <Card 
          title="6-Pillar Startup Health Matrix" 
          subtitle="Explainable mathematical diagnostic breakdown across core operations"
          className="lg:col-span-5"
          action={<Button variant="ghost" size="sm" onClick={() => navigate("/twin")}>Explore Twin →</Button>}
        >
          <div className="space-y-4">
            {health?.pillars?.map((p, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-dark-muted">{p.status}</span>
                    <span className="font-mono font-bold text-brand-400">{p.score}/100</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-emerald transition-all duration-500"
                    style={{ width: `${p.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-dark-muted">{p.detail}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 12-Month Forward Trajectory Forecast */}
        <Card 
          title="12-Month Forward Financial Trajectory" 
          subtitle="Projected monthly revenue expansion vs cash depletion curve"
          className="lg:col-span-7"
          action={<Button variant="ghost" size="sm" onClick={() => navigate("/forecast")}>View Forecast →</Button>}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastChartData}>
                <defs>
                  <linearGradient id="chartRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="chartCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={10} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0e1118", borderColor: "#1c2230", borderRadius: 12, fontSize: 11 }}
                  formatter={(val) => [`₹${(val).toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="revenue" name="Projected Revenue" stroke="#10b981" fill="url(#chartRev)" strokeWidth={2} />
                <Area type="monotone" dataKey="cash" name="Projected Cash Balance" stroke="#6366f1" fill="url(#chartCash)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-dark-muted">
            <span>Forecast Horizon: 12 Months Forward</span>
            <span className="text-accent-emerald font-semibold">Expected Cash Out: {forecast?.projected_cash_out_month}</span>
          </div>
        </Card>
      </div>

      {/* 5. Quick Strategy Simulation Launchers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div 
          onClick={() => navigate("/simulation")}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer border border-white/5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent-emerald uppercase tracking-wider">Strategy Lab</span>
            <ArrowRight size={16} className="text-dark-muted" />
          </div>
          <div className="text-sm font-bold text-white">Test Runway Scenarios</div>
          <p className="text-xs text-dark-muted">Simulate burn cuts, pricing shifts, or hiring additions in real-time.</p>
        </div>

        <div 
          onClick={() => navigate("/copilot")}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer border border-white/5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Agentic AI</span>
            <ArrowRight size={16} className="text-dark-muted" />
          </div>
          <div className="text-sm font-bold text-white">Ask Foundr Copilot</div>
          <p className="text-xs text-dark-muted">Autonomous strategic advisory grounded in your real operating numbers.</p>
        </div>

        <div 
          onClick={() => navigate("/reports")}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer border border-white/5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">Intelligence Report</span>
            <ArrowRight size={16} className="text-dark-muted" />
          </div>
          <div className="text-sm font-bold text-white">Generate VC Memo</div>
          <p className="text-xs text-dark-muted">Synthesize complete 13-section report for investors and committee review.</p>
        </div>
      </div>
    </div>
  );
}
