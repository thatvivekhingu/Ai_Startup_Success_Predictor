import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleGauge,
  FileSpreadsheet,
  PenLine,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../services/api";
import { PageIntro, money, pct } from "../components/UI";
import CsvUpload from "../components/CsvUpload";
import IntelligenceWorkspace from "../components/Intelligence";
import ScenarioSimulator from "../components/ScenarioSimulator";
import { downloadInvestorReport } from "../utils/investorReport";

const defaults = {
  startup_name: "",
  country: "India",
  industry: "SaaS",
  funding: 750000,
  team_size: 12,
  experience: 6,
  revenue: 220000,
  burn_rate: 45000,
  market_size: 80000000,
  product_stage: "MVP",
  investors: 2,
  competition: 55,
  growth_rate: 32,
};
const fields = [
  ["startup_name", "Startup name", "text", "e.g. Northstar Labs"],
  [
    "country",
    "Country",
    "select",
    [
      "India",
      "United States",
      "United Kingdom",
      "Singapore",
      "Germany",
      "Canada",
      "Other",
    ],
  ],
  [
    "industry",
    "Industry",
    "select",
    [
      "SaaS",
      "Fintech",
      "Healthtech",
      "Edtech",
      "E-commerce",
      "Climate tech",
      "AI / ML",
      "Consumer",
    ],
  ],
  ["funding", "Funding raised (USD)", "number", "750000"],
  ["team_size", "Team size", "number", "12"],
  ["experience", "Founder experience (years)", "number", "6"],
  ["revenue", "Annual revenue (USD)", "number", "220000"],
  ["burn_rate", "Monthly burn rate (USD)", "number", "45000"],
  ["market_size", "Addressable market (USD)", "number", "80000000"],
  [
    "product_stage",
    "Product stage",
    "select",
    ["Idea", "MVP", "Early Revenue", "Growth", "Scale"],
  ],
  ["investors", "Active investors", "number", "2"],
  ["competition", "Competition index (0-100)", "number", "55"],
  ["growth_rate", "Annual growth rate (%)", "number", "32"],
];
export default function Predict() {
  const [mode, setMode] = useState("manual");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaults });
  const submit = async (values) => {
    setLoading(true);
    try {
      const numeric = [
        "funding",
        "team_size",
        "experience",
        "revenue",
        "burn_rate",
        "market_size",
        "investors",
        "competition",
        "growth_rate",
      ];
      numeric.forEach((k) => (values[k] = Number(values[k])));
      const { data } = await api.post("/predict", values);
      setResult(data);
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 2200,
        showConfirmButton: false,
        icon: "success",
        title: "Prediction saved",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Prediction failed",
        text: e.response?.data?.detail || "The API is unavailable.",
        confirmButtonColor: "#1d2921",
      });
    } finally {
      setLoading(false);
    }
  };
  const clear = () => {
    reset(defaults);
    setResult(null);
  };
  return (
    <>
      <PageIntro
        eyebrow="Foundr.AI model workspace"
        title="Evaluate startup potential"
        description="Run a single assessment or validate a CSV batch. Every saved prediction updates history, analytics, and portfolio intelligence."
      />
      <div
        className="mb-5 inline-flex rounded-md border border-line bg-surface p-1 dark:border-white/10"
        role="tablist"
        aria-label="Prediction mode"
      >
        <button
          onClick={() => setMode("manual")}
          className={`inline-flex h-9 items-center gap-2 rounded px-4 text-sm font-medium transition ${mode === "manual" ? "bg-[#1d2921] text-white dark:bg-mint dark:text-[#172019]" : "text-muted hover:text-ink dark:hover:text-white"}`}
          role="tab"
          aria-selected={mode === "manual"}
        >
          <PenLine size={15} />
          Manual
        </button>
        <button
          onClick={() => setMode("csv")}
          className={`inline-flex h-9 items-center gap-2 rounded px-4 text-sm font-medium transition ${mode === "csv" ? "bg-[#1d2921] text-white dark:bg-mint dark:text-[#172019]" : "text-muted hover:text-ink dark:hover:text-white"}`}
          role="tab"
          aria-selected={mode === "csv"}
        >
          <FileSpreadsheet size={15} />
          CSV batch
        </button>
      </div>
      {mode === "csv" ? (
        <CsvUpload
          onCreated={(data) =>
            Swal.fire({
              toast: true,
              position: "top-end",
              timer: 2400,
              showConfirmButton: false,
              icon: "success",
              title: `${data.created} predictions saved`,
            })
          }
        />
      ) : (
        <>
          <div className="grid items-start gap-6 xl:grid-cols-[1.35fr_.65fr]">
            <form onSubmit={handleSubmit(submit)} className="panel">
              <div className="border-b border-line px-5 py-5 dark:border-white/10 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center bg-mint/30 text-success">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <h3 className="font-semibold">Startup signals</h3>
                    <p className="text-xs text-muted">
                      All financial values should be entered in USD.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                {fields.map(([name, label, type, options]) => (
                  <div
                    key={name}
                    className={
                      name === "startup_name"
                        ? "sm:col-span-2 lg:col-span-1"
                        : ""
                    }
                  >
                    <label className="label" htmlFor={name}>
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        id={name}
                        className="field"
                        {...register(name, { required: true })}
                      >
                        {options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={name}
                        className="field"
                        type={type}
                        placeholder={options}
                        step="any"
                        {...register(name, {
                          required: `${label} is required`,
                          min: name === "growth_rate" ? -100 : 0,
                        })}
                      />
                    )}{" "}
                    {errors[name] && (
                      <p className="mt-1 text-xs text-coral">
                        {errors[name].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-5 dark:border-white/10 sm:flex-row sm:justify-end sm:px-7">
                <button type="button" onClick={clear} className="btn-secondary">
                  <RefreshCw size={16} />
                  Reset
                </button>
                <button disabled={loading} className="btn-primary min-w-40">
                  {loading ? "Evaluating..." : "Run prediction"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
            <aside className="xl:sticky xl:top-28">
              {result ? (
                <Result data={result} />
              ) : (
                <div className="panel p-6">
                  <div className="mb-5 grid h-11 w-11 place-items-center bg-black/5 text-muted dark:bg-white/5">
                    <CircleGauge size={22} />
                  </div>
                  <h3 className="font-semibold">Result preview</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Your prediction, confidence score, and model context will
                    appear here after evaluation.
                  </p>
                  <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs text-muted dark:border-white/10">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-success" />
                      Saved to prediction history
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-success" />
                      Included in analytics
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-success" />
                      Available in CSV export
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </div>
          {result?.analysis && (
            <div className="mt-6 space-y-5">
              <IntelligenceWorkspace
                startup={result.inputs}
                analysis={result.analysis}
                onReport={() => downloadInvestorReport(result)}
              />
              <ScenarioSimulator result={result} />
            </div>
          )}
        </>
      )}
    </>
  );
}
function Result({ data }) {
  const success = data.prediction === "Likely to succeed";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel overflow-hidden"
    >
      <div className={`h-1.5 ${success ? "bg-success" : "bg-coral"}`} />
      <div className="p-6">
        <div
          className={`mb-5 grid h-11 w-11 place-items-center ${success ? "bg-mint/30 text-success" : "bg-coral/10 text-coral"}`}
        >
          {success ? <CheckCircle2 size={22} /> : <ShieldAlert size={22} />}
        </div>
        <p className="text-xs font-semibold uppercase text-muted">
          Model assessment / Foundr.AI
        </p>
        <h3 className="mt-2 text-xl font-semibold">{data.prediction}</h3>
        <p className="mt-1 text-sm text-muted">{data.startup_name}</p>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-muted">Success probability</span>
            <span className="font-semibold">{pct(data.probability)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div
              className={`h-full rounded-full ${success ? "bg-success" : "bg-coral"}`}
              style={{ width: pct(data.probability) }}
            />
          </div>
        </div>
        {data.analysis && (
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 dark:border-white/10">
            <span className="text-xs text-muted">Success Index</span>
            <span className="text-lg font-semibold">
              {data.analysis.success_index}/100
            </span>
          </div>
        )}
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 dark:border-white/10">
          <div>
            <dt className="text-xs text-muted">Model accuracy</dt>
            <dd className="mt-1 font-semibold">{pct(data.model_accuracy)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Funding</dt>
            <dd className="mt-1 font-semibold">{money(data.funding)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Industry</dt>
            <dd className="mt-1 font-semibold">{data.industry}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Reference</dt>
            <dd className="mt-1 font-semibold">
              #{String(data.id).padStart(4, "0")}
            </dd>
          </div>
        </dl>
        <p className="mt-6 bg-black/[.03] p-3 text-xs leading-5 text-muted dark:bg-white/5">
          This is decision support, not financial advice. Validate the result
          against current market and customer evidence.
        </p>
      </div>
    </motion.div>
  );
}
