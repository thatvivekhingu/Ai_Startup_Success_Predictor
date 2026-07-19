import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Download,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api";
import { Badge, Empty, PageIntro, Spinner, pct } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import IntelligenceWorkspace from "../components/Intelligence";

const COLORS = ["#237a45", "#ef6a56"];
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const load = () =>
    api
      .get("/dashboard")
      .then((response) => {
        setData(response.data);
        setError("");
      })
      .catch(() => setError("The dashboard could not be loaded."));
  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);
  if (error) return <Empty title="Could not load dashboard" copy={error} />;
  if (!data) return <Spinner />;
  const { stats, recent, industries } = data;
  const pie = [
    { name: "Likely to succeed", value: stats.success_rate },
    { name: "High risk", value: stats.failure_rate },
  ];
  const trend = recent
    .slice()
    .reverse()
    .map((item, index) => ({
      name: `P${index + 1}`,
      confidence: Math.round(item.probability * 100),
    }));
  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    const margin = 18;
    pdf.setFillColor(22, 27, 24);
    pdf.rect(0, 0, 210, 42, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text("Foundr.AI", margin, 19);
    pdf.setFontSize(10);
    pdf.setTextColor(167, 232, 189);
    pdf.text("PORTFOLIO INTELLIGENCE REPORT", margin, 28);
    pdf.setTextColor(24, 32, 27);
    pdf.setFontSize(11);
    pdf.text(`Generated ${new Date().toLocaleString()}`, margin, 53);
    const metrics = [
      ["Total predictions", stats.total_predictions],
      ["Success rate", `${stats.success_rate}%`],
      ["High risk", `${stats.failure_rate}%`],
      ["Average confidence", `${stats.average_confidence}%`],
      ["Model accuracy", `${stats.average_accuracy || 0}%`],
    ];
    let y = 68;
    pdf.setFontSize(16);
    pdf.text("Portfolio summary", margin, y);
    y += 10;
    pdf.setFontSize(11);
    metrics.forEach(([label, value]) => {
      pdf.setTextColor(101, 112, 105);
      pdf.text(label, margin, y);
      pdf.setTextColor(24, 32, 27);
      pdf.text(String(value), 100, y);
      y += 8;
    });
    y += 7;
    pdf.setFontSize(16);
    pdf.text("Recent predictions", margin, y);
    y += 10;
    pdf.setFontSize(9);
    pdf.setTextColor(101, 112, 105);
    pdf.text("Startup", margin, y);
    pdf.text("Industry", 75, y);
    pdf.text("Outcome", 115, y);
    pdf.text("Confidence", 175, y);
    y += 6;
    pdf.setDrawColor(223, 227, 223);
    pdf.line(margin, y, 192, y);
    y += 7;
    recent.forEach((item) => {
      pdf.setTextColor(24, 32, 27);
      pdf.text(item.startup_name.slice(0, 28), margin, y);
      pdf.text(item.industry.slice(0, 16), 75, y);
      pdf.text(
        item.prediction === "Likely to succeed"
          ? "Likely succeed"
          : "High risk",
        115,
        y,
      );
      pdf.text(pct(item.probability), 175, y);
      y += 8;
    });
    pdf.setFontSize(8);
    pdf.setTextColor(101, 112, 105);
    pdf.text(
      "Decision support only. Validate model output with current market evidence.",
      margin,
      282,
    );
    pdf.save(
      `foundr-ai-dashboard-${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  };
  return (
    <>
      <PageIntro
        eyebrow="Overview"
        title={`Good morning, ${user?.username || "there"}`}
        description="A concise view of your startup portfolio and the signals shaping your next decision."
        action={
          <div className="flex gap-2">
            <button onClick={exportPdf} className="btn-secondary">
              <Download size={17} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <Link to="/predict" className="btn-primary">
              <Plus size={17} />
              New prediction
            </Link>
          </div>
        }
      />
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          icon={Target}
          label="Total predictions"
          value={stats.total_predictions}
          note="All time"
        />
        <Metric
          icon={TrendingUp}
          label="Success rate"
          value={`${stats.success_rate}%`}
          note="Portfolio signal"
          accent
        />
        <Metric
          icon={TrendingDown}
          label="High risk"
          value={`${stats.failure_rate}%`}
          note="Needs attention"
          danger
        />
        <Metric
          icon={Zap}
          label="Today"
          value={stats.today_predictions}
          note="New predictions"
        />
        <Metric
          icon={Users}
          label="Avg. accuracy"
          value={`${stats.average_accuracy || 0}%`}
          note="Deployed model"
        />
      </div>
      {data.latest_analysis && (
        <div className="mb-5">
          <IntelligenceWorkspace
            startup={data.latest_analysis.startup}
            analysis={data.latest_analysis.analysis}
            compact
          />
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[1.45fr_.8fr]">
        <section className="panel p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="font-semibold">Confidence trend</h3>
              <p className="mt-1 text-xs text-muted">
                Latest prediction confidence
              </p>
            </div>
            <span className="text-xs text-success">Live / 30s</span>
          </div>
          <div className="h-64">
            {trend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="mintFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#a7e8bd"
                        stopOpacity={0.45}
                      />
                      <stop offset="95%" stopColor="#a7e8bd" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#dfe3df"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#657069" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#657069" }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Confidence"]} />
                  <Area
                    type="monotone"
                    dataKey="confidence"
                    stroke="#237a45"
                    strokeWidth={2}
                    fill="url(#mintFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                title="No trend yet"
                copy="Create a prediction to start your trend."
              />
            )}
          </div>
        </section>
        <section className="panel p-5 sm:p-6">
          <div>
            <h3 className="font-semibold">Outcome mix</h3>
            <p className="mt-1 text-xs text-muted">Portfolio health</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pie}
                  innerRadius={55}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {pie.map((item, index) => (
              <div
                className="flex items-center justify-between text-sm"
                key={item.name}
              >
                <span className="flex items-center gap-2 text-muted">
                  <i
                    className="h-2 w-2 rounded-full"
                    style={{ background: COLORS[index] }}
                  />
                  {item.name}
                </span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_.85fr]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 dark:border-white/10">
            <div>
              <h3 className="font-semibold">Recent predictions</h3>
              <p className="mt-1 text-xs text-muted">
                Most recent portfolio activity
              </p>
            </div>
            <Link
              to="/history"
              className="flex items-center gap-1 text-xs font-semibold text-success"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>
          {recent.length ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Startup</th>
                    <th>Industry</th>
                    <th>Signal</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <p className="font-medium">{item.startup_name}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {item.country}
                        </p>
                      </td>
                      <td className="text-muted">{item.industry}</td>
                      <td>
                        <Badge
                          success={item.prediction === "Likely to succeed"}
                        >
                          {item.prediction}
                        </Badge>
                      </td>
                      <td className="font-semibold">{pct(item.probability)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="No predictions yet"
              copy="Your latest predictions will appear here."
            />
          )}
        </section>
        <section className="panel p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="font-semibold">Top industries</h3>
            <p className="mt-1 text-xs text-muted">
              Where your portfolio is concentrated
            </p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industries}
                layout="vertical"
                margin={{ left: 12, right: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#dfe3df"
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#657069" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#657069" }}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#237a45"
                  radius={[0, 3, 3, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}
function Metric({ icon: Icon, label, value, note, accent, danger }) {
  return (
    <div
      className={`metric ${accent ? "border-success" : danger ? "border-coral" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <Icon
          size={17}
          className={
            accent ? "text-success" : danger ? "text-coral" : "text-muted"
          }
        />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </div>
  );
}
