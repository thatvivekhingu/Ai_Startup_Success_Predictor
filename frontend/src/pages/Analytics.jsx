import { useEffect, useState } from "react";
import {
  Activity,
  BrainCircuit,
  Layers3,
  RefreshCw,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import api from "../services/api";
import { Empty, PageIntro, Spinner } from "../components/UI";

const tabs = ["Portfolio", "Model", "Activity", "Users"];
const tooltipStyle = {
  border: "1px solid #dfe3df",
  borderRadius: 4,
  fontSize: 12,
};
const axis = { fontSize: 10, fill: "#657069" };

export default function Analytics() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("Portfolio");
  const [loginRange, setLoginRange] = useState("Daily");
  const [updated, setUpdated] = useState(null);
  const [error, setError] = useState("");
  const load = () =>
    api
      .get("/analytics")
      .then((response) => {
        setData(response.data);
        setUpdated(new Date());
        setError("");
      })
      .catch(() => setError("Analytics could not be loaded."));
  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);
  if (error && !data)
    return <Empty title="Could not load analytics" copy={error} />;
  if (!data) return <Spinner />;
  const { stats, highlights } = data;
  return (
    <>
      <PageIntro
        eyebrow="Business intelligence"
        title="Portfolio analytics"
        description="Compare outcomes, operating signals, model behavior, and workspace activity."
        action={
          <button onClick={load} className="btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />
      <div className="mb-5 flex flex-col justify-between gap-3 border-b border-line dark:border-white/10 sm:flex-row sm:items-end">
        <div className="flex overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`h-11 min-w-24 border-b-2 px-4 text-sm font-medium ${tab === item ? "border-success text-success" : "border-transparent text-muted hover:text-ink dark:hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="pb-3 text-[11px] text-muted">
          Auto-refresh / {updated?.toLocaleTimeString()}
        </p>
      </div>
      {tab === "Portfolio" && <Portfolio data={data} />}{" "}
      {tab === "Model" && <Model data={data} />}{" "}
      {tab === "Activity" && (
        <ActivityView data={data} range={loginRange} setRange={setLoginRange} />
      )}{" "}
      {tab === "Users" && <UsersView data={data} />}
    </>
  );
}

function Portfolio({ data }) {
  const {
    stats,
    industries,
    countries,
    funding_distribution,
    confidence_histogram,
    scatter,
    highlights,
  } = data;
  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Mini
          icon={Activity}
          label="Prediction volume"
          value={stats.total_predictions}
        />
        <Mini
          icon={TrendingUp}
          label="Success signals"
          value={`${stats.success_rate}%`}
        />
        <Mini
          icon={Target}
          label="Average confidence"
          value={`${stats.average_confidence}%`}
        />
        <Mini
          icon={Layers3}
          label="Top industry"
          value={highlights.top_industry || "No data"}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart
          title="Industry-wise prediction"
          sub="Volume and average confidence by category"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={industries}>
              <Grid />
              <XAxis dataKey="name" tick={axis} />
              <YAxis yAxisId="left" tick={axis} />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={axis}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="count"
                name="Predictions"
                fill="#237a45"
              />
              <Line
                yAxisId="right"
                dataKey="confidence"
                name="Confidence %"
                stroke="#ef6a56"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Chart>
        <Chart
          title="Country-wise prediction"
          sub="Portfolio footprint by market"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countries} layout="vertical" margin={{ left: 20 }}>
              <Grid horizontal={false} />
              <XAxis type="number" tick={axis} />
              <YAxis type="category" dataKey="name" width={90} tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="count"
                name="Predictions"
                fill="#237a45"
                radius={[0, 3, 3, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Funding distribution" sub="Startup count by capital band">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funding_distribution}>
              <Grid />
              <XAxis dataKey="name" tick={axis} />
              <YAxis allowDecimals={false} tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#ef6a56" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart
          title="Confidence histogram"
          sub="Frequency across probability bands"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={confidence_histogram}>
              <Grid />
              <XAxis dataKey="name" tick={axis} />
              <YAxis allowDecimals={false} tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#91a59a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart
          title="Funding, growth, and probability"
          sub="Bubble size reflects growth rate"
          wide
        >
          {scatter.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <Grid />
                <XAxis
                  type="number"
                  dataKey="funding"
                  name="Funding"
                  tick={axis}
                  tickFormatter={(v) => `$${Math.round(v / 1000000)}M`}
                />
                <YAxis
                  type="number"
                  dataKey="probability"
                  name="Probability"
                  unit="%"
                  domain={[0, 100]}
                  tick={axis}
                />
                <ZAxis dataKey="growth" range={[80, 500]} name="Growth" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={tooltipStyle}
                />
                <Scatter data={scatter} fill="#237a45" />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <Empty
              title="No scatter data"
              copy="Predictions will populate this view."
            />
          )}
        </Chart>
      </div>
    </>
  );
}

function Model({ data }) {
  const models = Object.entries(data.model_metrics?.models || {}).map(
    ([name, m]) => ({
      name: name.replaceAll("_", " "),
      accuracy: Math.round(m.accuracy * 100),
      f1: Math.round(m.f1 * 100),
      auc: Math.round(m.roc_auc * 100),
    }),
  );
  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Mini
          icon={BrainCircuit}
          label="Selected model"
          value={(data.model_metrics?.best_model || "fallback").replaceAll(
            "_",
            " ",
          )}
        />
        <Mini
          icon={Target}
          label="Model accuracy"
          value={`${data.stats.average_accuracy || 0}%`}
        />
        <Mini
          icon={TrendingUp}
          label="Portfolio confidence"
          value={`${data.stats.average_confidence}%`}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart
          title="Model comparison"
          sub="Test-set accuracy, F1, and ROC AUC"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={models}>
              <Grid />
              <XAxis dataKey="name" tick={axis} />
              <YAxis domain={[0, 100]} unit="%" tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="accuracy" fill="#237a45" />
              <Bar dataKey="f1" fill="#ef6a56" />
              <Bar dataKey="auc" fill="#91a59a" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart
          title="Feature importance"
          sub="Strongest transformed model inputs"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.feature_importance}
              layout="vertical"
              margin={{ left: 35 }}
            >
              <Grid horizontal={false} />
              <XAxis type="number" unit="%" tick={axis} />
              <YAxis type="category" dataKey="name" width={130} tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="importance" fill="#237a45" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart
          title="Accuracy and confidence trend"
          sub="Daily confidence against the deployed model baseline"
          wide
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.daily.map((row) => ({
                ...row,
                accuracy: data.stats.average_accuracy || 0,
              }))}
            >
              <Grid />
              <XAxis dataKey="date" tick={axis} />
              <YAxis domain={[0, 100]} unit="%" tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#ef6a56"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#237a45"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </div>
      <p className="mt-4 text-xs text-muted">
        Metrics come from the bundled demonstration dataset. Retrain with a
        larger validated dataset before making external accuracy claims.
      </p>
    </>
  );
}

function ActivityView({ data, range, setRange }) {
  const loginData =
    range === "Daily"
      ? data.login_daily
      : range === "Weekly"
        ? data.login_weekly
        : data.login_monthly;
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Chart
        title="Daily prediction trend"
        sub="Prediction count and average confidence"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.daily}>
            <Grid />
            <XAxis dataKey="date" tick={axis} />
            <YAxis tick={axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#237a45"
              fill="#a7e8bd"
              fillOpacity={0.45}
            />
            <Area
              type="monotone"
              dataKey="confidence"
              stroke="#ef6a56"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Monthly prediction" sub="Longer-term workspace volume">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.monthly}>
            <Grid />
            <XAxis dataKey="date" tick={axis} />
            <YAxis allowDecimals={false} tick={axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#237a45" />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Login activity" sub="Successful authentication volume">
        <div className="mb-3 flex gap-1">
          {["Daily", "Weekly", "Monthly"].map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`h-8 px-3 text-xs font-medium ${range === item ? "bg-[#1d2921] text-white dark:bg-mint dark:text-[#172019]" : "text-muted hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="h-[calc(100%-44px)]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={loginData}>
              <Grid />
              <XAxis dataKey="date" tick={axis} />
              <YAxis allowDecimals={false} tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ef6a56"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Chart>
      <Chart
        title="Industry-country heatmap"
        sub="Darker cells indicate more predictions"
      >
        <Heatmap items={data.heatmap} />
      </Chart>
    </div>
  );
}

function UsersView({ data }) {
  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Mini
          icon={UsersRound}
          label="Users tracked"
          value={data.users.length}
        />
        <Mini
          icon={TrendingUp}
          label="Most active user"
          value={data.highlights.most_active_user || "No data"}
        />
        <Mini
          icon={Target}
          label="Highest accuracy user"
          value={data.highlights.highest_accuracy_user || "No data"}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <Chart
          title="User-wise accuracy"
          sub="Accuracy and confidence by account"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.users}>
              <Grid />
              <XAxis dataKey="name" tick={axis} />
              <YAxis domain={[0, 100]} unit="%" tick={axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="accuracy" fill="#237a45" />
              <Bar dataKey="confidence" fill="#ef6a56" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <section className="panel overflow-hidden">
          <div className="border-b border-line px-5 py-4 dark:border-white/10">
            <h3 className="font-semibold">User performance</h3>
            <p className="mt-1 text-xs text-muted">
              Volume and average quality signals
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table min-w-[520px]">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Predictions</th>
                  <th>Confidence</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.name}>
                    <td className="font-medium">{user.name}</td>
                    <td>{user.predictions}</td>
                    <td>{user.confidence}%</td>
                    <td>{user.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function Heatmap({ items }) {
  const industries = [...new Set(items.map((i) => i.industry))].slice(0, 6);
  const countries = [...new Set(items.map((i) => i.country))].slice(0, 6);
  const max = Math.max(1, ...items.map((i) => i.count));
  const value = (industry, country) =>
    items.find((i) => i.industry === industry && i.country === country)
      ?.count || 0;
  return items.length ? (
    <div className="h-full overflow-auto">
      <div
        className="grid min-w-[560px] gap-1"
        style={{
          gridTemplateColumns: `120px repeat(${countries.length},minmax(64px,1fr))`,
        }}
      >
        <span />
        {countries.map((country) => (
          <span
            key={country}
            className="truncate p-2 text-center text-[10px] text-muted"
            title={country}
          >
            {country}
          </span>
        ))}
        {industries.map((industry) => (
          <div className="contents" key={industry}>
            <span className="truncate p-2 text-xs text-muted" title={industry}>
              {industry}
            </span>
            {countries.map((country) => {
              const count = value(industry, country);
              return (
                <span
                  key={country}
                  className="grid h-10 place-items-center text-xs font-semibold"
                  style={{
                    background: `rgba(35,122,69,${count ? 0.15 + (count / max) * 0.75 : 0.04})`,
                    color: count / max > 0.55 ? "white" : "var(--muted)",
                  }}
                  title={`${industry} / ${country}: ${count}`}
                >
                  {count}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Empty
      title="No heatmap data"
      copy="Industry and country combinations will appear here."
    />
  );
}
function Mini({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <div className="mb-4 flex justify-between">
        <span className="text-xs text-muted">{label}</span>
        <Icon size={17} className="text-success" />
      </div>
      <p
        className="truncate text-xl font-semibold capitalize"
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
}
function Chart({ title, sub, wide, children }) {
  return (
    <section className={`panel p-5 sm:p-6 ${wide ? "xl:col-span-2" : ""}`}>
      <div className="mb-5">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-muted">{sub}</p>
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}
function Grid(props) {
  return (
    <CartesianGrid
      strokeDasharray="3 3"
      vertical={false}
      stroke="#dfe3df"
      {...props}
    />
  );
}
