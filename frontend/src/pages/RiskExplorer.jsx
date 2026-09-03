import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  ShieldAlert, TrendingDown, TrendingUp, AlertTriangle, 
  CheckCircle, ArrowUpRight, BarChart2, Info 
} from "lucide-react";

export default function RiskExplorer() {
  const [importance, setImportance] = useState([]);
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featRes, twinRes] = await Promise.all([
        api.get("/feature-importance"),
        api.get("/api/startup/twin")
      ]);
      setImportance(featRes.data.items || []);
      setTwin(twinRes.data);
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
          <p className="mt-3 text-sm text-gray-400">Computing SHAP Feature Attributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Explainable AI Engine (SHAP XAI)</div>
        <h1 className="text-2xl font-bold text-white">Risk Explorer & Mathematical Drivers</h1>
        <p className="text-sm text-gray-400">Transparent breakdown explaining exactly which operational variables drive your startup risk score.</p>
      </div>

      {/* Hero Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <div className="text-xs text-gray-400">Primary Risk Driver</div>
          <div className="mt-1 text-lg font-bold text-rose-400">Monthly Burn Rate</div>
          <div className="mt-1 text-xs text-gray-400">High sensitivity on cash runway</div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <div className="text-xs text-gray-400">Top Growth Vector</div>
          <div className="mt-1 text-lg font-bold text-emerald-400">Total Funding Raised</div>
          <div className="mt-1 text-xs text-gray-400">+22.4% positive exit correlation</div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <div className="text-xs text-gray-400">Model Explainer Type</div>
          <div className="mt-1 text-lg font-bold text-blue-400">shap.TreeExplainer</div>
          <div className="mt-1 text-xs text-gray-400">Exact Shapley value attributions</div>
        </div>
      </div>

      {/* Feature Importance Bars */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Global Feature Importance Ranking</h2>
        <div className="space-y-4">
          {importance.map((item, idx) => {
            const isPos = item.importance > 0.12;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-200">{item.name}</span>
                  <span className="font-mono text-emerald-400">{(item.importance * 100).toFixed(1)}% weight</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${Math.min(item.importance * 300, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
