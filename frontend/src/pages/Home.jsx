import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CircleDollarSign,
  Gauge,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import api from "../services/api";
import { Badge, Empty, Spinner, pct } from "../components/UI";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/dashboard")
      .then((r) => setData(r.data))
      .catch(() => setError("The workspace could not be loaded."));
  }, []);
  if (error) return <Empty title="Could not load workspace" copy={error} />;
  if (!data) return <Spinner />;
  const trend = data.recent
    .slice()
    .reverse()
    .map((row, index) => ({
      name: index,
      confidence: Math.round(row.probability * 100),
    }));
  return (
    <div>
      <section className="relative min-h-[340px] overflow-hidden bg-[#161b18] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="relative z-10 grid h-full items-end gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <div className="mb-12 flex items-center gap-2 text-xs font-semibold uppercase text-mint">
              <span className="h-2 w-2 rounded-full bg-mint" />
              Model online
            </div>
            <p className="text-sm text-white/50">
              Welcome back, {user?.username}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
              What startup signal do you want to test today?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
              Bring current operating numbers. Foundr.AI turns them into an
              explainable Success Index, preserves the decision, and updates
              your portfolio intelligence.
            </p>
            <Link
              to="/predict"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-md bg-mint px-5 text-sm font-semibold text-[#172019] hover:bg-[#b8efc9]"
            >
              Evaluate startup
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="mb-3 flex justify-between text-xs text-white/50">
              <span>Latest confidence signals</span>
              <span>{data.recent.length} recent</span>
            </div>
            <div className="h-40 border-b border-l border-white/10">
              {trend.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="homeArea" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0"
                          stopColor="#a7e8bd"
                          stopOpacity=".45"
                        />
                        <stop offset="1" stopColor="#a7e8bd" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      formatter={(v) => [`${v}%`, "Confidence"]}
                      contentStyle={{
                        background: "#202722",
                        border: "1px solid #344039",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stroke="#a7e8bd"
                      strokeWidth={2}
                      fill="url(#homeArea)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid h-full place-items-center text-xs text-white/35">
                  Your first signal will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="grid border-x border-b border-line bg-surface dark:border-white/10 sm:grid-cols-2 xl:grid-cols-4">
        <Signal
          icon={BrainCircuit}
          label="Predictions"
          value={data.stats.total_predictions}
        />
        <Signal
          icon={TrendingUp}
          label="Success signals"
          value={`${data.stats.success_rate}%`}
        />
        <Signal
          icon={Gauge}
          label="Avg. confidence"
          value={`${data.stats.average_confidence}%`}
        />
        <Signal
          icon={CircleDollarSign}
          label="Model accuracy"
          value={`${data.stats.average_accuracy || 0}%`}
        />
      </section>
      <section className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 dark:border-white/10">
            <div>
              <h3 className="font-semibold">Recent decisions</h3>
              <p className="mt-1 text-xs text-muted">
                Your latest evaluated startups
              </p>
            </div>
            <Link to="/history" className="text-xs font-semibold text-success">
              Open history
            </Link>
          </div>
          {data.recent.length ? (
            <div className="divide-y divide-line dark:divide-white/10">
              {data.recent.slice(0, 5).map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-medium">{row.startup_name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {row.industry} / {row.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge success={row.prediction === "Likely to succeed"}>
                      {row.prediction}
                    </Badge>
                    <span className="w-10 text-right text-sm font-semibold">
                      {pct(row.probability)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No decisions yet"
              copy="Evaluate a startup to create your first record."
            />
          )}
        </div>
        <aside className="panel p-6">
          <span className="grid h-10 w-10 place-items-center bg-coral/10 text-coral">
            <Sparkles size={19} />
          </span>
          <h3 className="mt-5 font-semibold">
            A better prediction starts with current inputs.
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Update revenue, burn, and growth before each decision. Confidence is
            only useful when the operating data is honest.
          </p>
          <Link
            to="/predict"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-success"
          >
            Open model workspace
            <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
    </div>
  );
}
function Signal({ icon: Icon, label, value }) {
  return (
    <div className="flex min-h-28 items-center gap-4 border-line p-5 sm:border-r dark:border-white/10">
      <span className="grid h-10 w-10 place-items-center bg-black/[.04] text-success dark:bg-white/5">
        <Icon size={19} />
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
