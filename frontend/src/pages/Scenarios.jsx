import { useEffect, useState } from "react";
import api from "../services/api";
import { GitCompare, SlidersHorizontal, ArrowRight, ShieldCheck, TrendingUp, DollarSign } from "lucide-react";
import { Card, Badge, Button, Spinner } from "../components/UI";
import { useNavigate } from "react-router-dom";

export default function Scenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const [scenRes, compRes] = await Promise.all([
        api.get("/api/scenarios"),
        api.post("/api/scenarios/compare")
      ]);
      setScenarios(scenRes.data || []);
      setComparison(compRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading saved strategic scenarios & matrix..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-400">Strategic Matrix</div>
          <h1 className="text-2xl font-bold text-white">Scenario Comparison Matrix</h1>
          <p className="text-sm text-dark-muted">Compare operating tradeoffs, runway resilience, and health score impacts across modeled strategies.</p>
        </div>
        <Button variant="primary" icon={SlidersHorizontal} onClick={() => navigate("/simulation")}>
          Open Simulation Lab
        </Button>
      </div>

      {/* Comparison Table Card */}
      <Card title="Side-by-Side Strategic Tradeoff Matrix" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-dark-muted">
              <tr>
                <th className="p-4">Strategic Scenario</th>
                <th className="p-4">Projected Revenue</th>
                <th className="p-4">Operating Burn</th>
                <th className="p-4">Runway (Months)</th>
                <th className="p-4">Health Index</th>
                <th className="p-4">Risk Direction</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                    {row.name}
                  </td>
                  <td className="p-4 font-mono">₹{(row.projected_revenue / 100000).toFixed(1)} Lakhs</td>
                  <td className="p-4 font-mono">₹{(row.projected_burn / 100000).toFixed(1)} Lakhs</td>
                  <td className="p-4 font-bold text-accent-cyan">{row.runway_months} Mo</td>
                  <td className="p-4 font-bold text-white">{row.health_score} / 100</td>
                  <td className="p-4">
                    <Badge variant={row.risk_color === "emerald" ? "emerald" : "amber"} size="sm">
                      {row.risk_impact}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/simulation")}>
                      Load in Lab →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
