import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Download,
  Info,
  Lightbulb,
  Target,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const scoreColor = (score) =>
  score >= 70 ? "#38c976" : score >= 45 ? "#f2b84b" : "#f06b62";

export function ScoreGauge({ score, label = "Success Index", size = 188 }) {
  const color = scoreColor(score);
  return (
    <div
      className="relative grid shrink-0 place-items-center rounded-full p-[10px] shadow-[0_0_36px_rgba(56,201,118,.12)]"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${score}%, rgba(128,140,132,.16) ${score}% 100%)`,
      }}
      aria-label={`${label}: ${score} out of 100`}
    >
      <div className="grid h-full w-full place-items-center rounded-full bg-surface text-center">
        <div>
          <motion.p
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-semibold"
          >
            {score}
          </motion.p>
          <p className="mt-1 text-[11px] font-semibold uppercase text-muted">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DimensionScores({ dimensions }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {dimensions.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="border-l-2 border-line pl-4 dark:border-white/10"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{item.name}</p>
            <span className="text-sm font-semibold">{item.score}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.score}%` }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: scoreColor(item.score) }}
            />
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function RiskHeatmap({ risks }) {
  const colors = {
    Low: "border-[#38c976]/30 bg-[#38c976]/10 text-[#38c976]",
    Moderate:
      "border-[#f2b84b]/30 bg-[#f2b84b]/10 text-[#c98a18] dark:text-[#f2b84b]",
    High: "border-[#f06b62]/30 bg-[#f06b62]/10 text-[#d84d45] dark:text-[#f06b62]",
  };
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-2 2xl:grid-cols-5">
      {risks.map((item) => (
        <div
          key={item.name}
          className={`min-h-24 border p-3 ${colors[item.status]}`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-ink dark:text-white">
              {item.name}
            </p>
            <span className="text-xs font-bold">{item.risk}</span>
          </div>
          <p className="mt-7 text-[10px] font-semibold uppercase">
            {item.status} risk
          </p>
        </div>
      ))}
    </div>
  );
}

export function ExplanationChart({ explanations }) {
  const data = explanations.slice(0, 7).map((item) => ({
    ...item,
    short:
      item.feature.length > 19
        ? `${item.feature.slice(0, 18)}...`
        : item.feature,
  }));
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 22, right: 16 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="#354039"
            strokeOpacity={0.18}
          />
          <XAxis
            type="number"
            domain={[-20, 20]}
            tick={{ fontSize: 10, fill: "#7d8981" }}
            tickFormatter={(value) => `${value > 0 ? "+" : ""}${value}`}
          />
          <YAxis
            type="category"
            dataKey="short"
            width={115}
            tick={{ fontSize: 10, fill: "#7d8981" }}
          />
          <ReferenceLine x={0} stroke="#7d8981" />
          <Tooltip
            formatter={(value) => [`${value > 0 ? "+" : ""}${value}`, "Impact"]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.detail || ""}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="impact" radius={[0, 3, 3, 0]}>
            {data.map((item) => (
              <Cell
                key={item.feature}
                fill={item.impact >= 0 ? "#38c976" : "#f06b62"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function IntelligenceWorkspace({
  startup,
  analysis,
  onReport,
  compact = false,
}) {
  if (!analysis) return null;
  const interval = analysis.confidence_interval;
  return (
    <div className="space-y-5">
      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-line px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-success">
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_12px_currentColor]" />
              Foundr.AI intelligence
            </div>
            <h3 className="mt-2 text-lg font-semibold">
              {startup?.startup_name || "Startup assessment"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold ${analysis.badge.tone === "strong" ? "bg-success/10 text-success" : analysis.badge.tone === "risk" ? "bg-coral/10 text-coral" : "bg-[#f2b84b]/10 text-[#b4770d] dark:text-[#f2b84b]"}`}
            >
              <Award size={15} />
              {analysis.badge.name}
            </span>
            {onReport && (
              <button
                onClick={onReport}
                className="btn-secondary"
                title="Download investor report"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Investor report</span>
              </button>
            )}
          </div>
        </div>
        <div className="grid gap-7 p-5 sm:p-7 xl:grid-cols-[220px_1fr] xl:items-center">
          <div className="mx-auto">
            <ScoreGauge
              score={analysis.success_index}
              size={compact ? 164 : 188}
            />
          </div>
          <div>
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <SummaryMetric
                icon={Target}
                label="Model probability"
                value={`${interval.estimate}%`}
                note={`${interval.lower}-${interval.upper}% range`}
              />
              <SummaryMetric
                icon={BarChart3}
                label="Peer benchmark"
                value={`Top ${analysis.benchmark.top_percent}%`}
                note={analysis.benchmark.scope}
              />
              <SummaryMetric
                icon={Award}
                label="Runway"
                value={`${analysis.derived_metrics.runway_months} mo`}
                note={`${analysis.derived_metrics.burn_multiple}x burn multiple`}
              />
            </div>
            <DimensionScores dimensions={analysis.dimensions} />
          </div>
        </div>
      </section>

      {!compact && (
        <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <section className="panel p-5 sm:p-6">
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 size={17} className="text-success" />
              <h3 className="font-semibold">Why this score</h3>
            </div>
            <p className="text-xs text-muted">
              Local operating-signal impact. Positive values lift the
              assessment; negative values reduce it.
            </p>
            <ExplanationChart explanations={analysis.explanations} />
          </section>
          <section className="panel p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <CircleAlert size={17} className="text-coral" />
              <div>
                <h3 className="font-semibold">Risk heatmap</h3>
                <p className="mt-1 text-xs text-muted">
                  Higher values need earlier attention.
                </p>
              </div>
            </div>
            <RiskHeatmap risks={analysis.risk_heatmap} />
            <div className="mt-6 border-t border-line pt-5 dark:border-white/10">
              <div className="flex items-start gap-3">
                <Info size={16} className="mt-0.5 shrink-0 text-muted" />
                <p className="text-xs leading-5 text-muted">
                  {interval.label}: {interval.estimate}% +/- {interval.margin}%.{" "}
                  {analysis.method}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {!compact && (
        <section className="panel p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Lightbulb size={17} className="text-[#f2b84b]" />
            <div>
              <h3 className="font-semibold">Priority actions</h3>
              <p className="mt-1 text-xs text-muted">
                Highest-leverage improvements based on the weakest current
                signals.
              </p>
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {analysis.recommendations.map((item, index) => (
              <div
                key={item}
                className="flex gap-3 border-t border-line pt-4 dark:border-white/10"
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-success"
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase text-muted">
                    Action {index + 1}
                  </p>
                  <p className="mt-1 text-sm leading-6">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryMetric({ icon: Icon, label, value, note }) {
  return (
    <div className="min-w-0 border-t border-line pt-3 dark:border-white/10">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="mt-1 truncate text-[11px] text-muted" title={note}>
        {note}
      </p>
    </div>
  );
}
