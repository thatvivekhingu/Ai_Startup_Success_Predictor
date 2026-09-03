import { useEffect, useState } from "react";
import api from "../services/api";
import { TrendingUp, DollarSign, Users, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { Card, MetricCard, Badge, Button, Spinner } from "../components/UI";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Forecast() {
  const [forecast, setForecast] = useState(null);
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMetric, setViewMetric] = useState("revenue"); // revenue, cash, burn

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fRes, tRes] = await Promise.all([
        api.get("/api/forecast"),
        api.get("/api/startup/twin")
      ]);
      setForecast(fRes.data);
      setTwin(tRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !forecast) {
    return <Spinner label="Calculating 12-month forward statistical projections..." />;
  }

  const chartData = forecast.forecast_periods.map((p, idx) => ({
    period: p,
    base: viewMetric === "revenue" ? forecast.revenue_forecast.base[idx] : viewMetric === "cash" ? forecast.cash_trajectory.base[idx] : forecast.burn_forecast[idx],
    best: viewMetric === "revenue" ? forecast.revenue_forecast.best_case[idx] : viewMetric === "cash" ? forecast.cash_trajectory.best_case[idx] : forecast.burn_forecast[idx] * 0.9,
    worst: viewMetric === "revenue" ? forecast.revenue_forecast.worst_case[idx] : viewMetric === "cash" ? forecast.cash_trajectory.worst_case[idx] : forecast.burn_forecast[idx] * 1.15,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">Statistical Projection Engine</div>
        <h1 className="text-2xl font-bold text-white">12-Month Longitudinal Forecast</h1>
        <p className="text-sm text-dark-muted">Forward-looking projections decomposed with historical compounding growth and confidence intervals.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Historical Growth (MoM)"
          value={`${forecast.avg_historical_mom_growth}%`}
          subtitle="Compounded monthly velocity"
          delta="Trend: Accelerating"
          deltaType="positive"
          icon={TrendingUp}
          glowColor="emerald"
        />
        <MetricCard
          title="Current Cash Runway"
          value={`${forecast.current_runway_months} Mo`}
          subtitle="At current net operating burn"
          delta={forecast.current_runway_months >= 12 ? "Safe" : "Preservation Required"}
          deltaType={forecast.current_runway_months >= 12 ? "positive" : "negative"}
          icon={DollarSign}
          glowColor="cyan"
        />
        <MetricCard
          title="Expected Cash Out Horizon"
          value={forecast.projected_cash_out_month.length > 10 ? "Safe (Profitable)" : forecast.projected_cash_out_month}
          subtitle="Without additional capital infusions"
          delta="Baseline Path"
          deltaType="neutral"
          icon={ShieldCheck}
          glowColor="brand"
        />
      </div>

      {/* Chart Panel with Metric Selectors */}
      <Card
        title="Forward Trajectory & Confidence Interval Bands"
        subtitle="Upper band (Best Case +35%), Middle line (Expected Base), Lower band (Conservative -35%)"
        action={
          <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1 gap-1">
            <button
              onClick={() => setViewMetric("revenue")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${viewMetric === "revenue" ? "bg-brand-600 text-white" : "text-dark-muted hover:text-white"}`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewMetric("cash")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${viewMetric === "cash" ? "bg-brand-600 text-white" : "text-dark-muted hover:text-white"}`}
            >
              Cash Balance
            </button>
            <button
              onClick={() => setViewMetric("burn")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${viewMetric === "burn" ? "bg-brand-600 text-white" : "text-dark-muted hover:text-white"}`}
            >
              Operating Burn
            </button>
          </div>
        }
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="bestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0e1118", borderColor: "#1c2230", borderRadius: 12, fontSize: 11 }}
                formatter={(val) => [`₹${(val).toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="best" name="Best Case (+35%)" stroke="#10b981" fill="url(#bestGrad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="base" name="Expected Baseline" stroke="#6366f1" fillOpacity={0} strokeWidth={2.5} />
              <Area type="monotone" dataKey="worst" name="Conservative (-35%)" stroke="#ef4444" fillOpacity={0} strokeWidth={1.5} strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
