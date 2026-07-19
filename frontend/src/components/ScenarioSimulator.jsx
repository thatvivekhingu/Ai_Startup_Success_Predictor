import { useEffect, useMemo, useState } from "react";
import {
  FlaskConical,
  LoaderCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import api from "../services/api";
import { money } from "./UI";
import { ScoreGauge } from "./Intelligence";

const controls = [
  {
    key: "funding",
    label: "Funding",
    format: money,
    min: 0,
    multiplier: 3,
    floor: 1_000_000,
    step: 25000,
  },
  {
    key: "revenue",
    label: "Annual revenue",
    format: money,
    min: 0,
    multiplier: 4,
    floor: 1_000_000,
    step: 25000,
  },
  {
    key: "burn_rate",
    label: "Monthly burn",
    format: money,
    min: 0,
    multiplier: 2.5,
    floor: 150000,
    step: 5000,
  },
  {
    key: "team_size",
    label: "Team size",
    format: (value) => `${value} people`,
    min: 1,
    multiplier: 2.5,
    floor: 60,
    step: 1,
  },
  {
    key: "growth_rate",
    label: "Annual growth",
    format: (value) => `${value}%`,
    min: -50,
    max: 250,
    step: 1,
  },
];

export default function ScenarioSimulator({ result }) {
  const base = result.inputs;
  const [draft, setDraft] = useState(base);
  const [simulation, setSimulation] = useState(result);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(base);
    setSimulation(result);
    setError("");
  }, [result, base]);

  useEffect(() => {
    if (!draft || draft === base) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.post("/simulate", draft, {
          signal: controller.signal,
        });
        setSimulation(data);
        setError("");
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError(
            err.response?.data?.detail || "Scenario could not be calculated.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 450);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [draft, base]);

  const delta = useMemo(
    () =>
      (simulation?.analysis?.success_index || 0) -
      result.analysis.success_index,
    [simulation, result],
  );

  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: Number(value) }));
  };

  const reset = () => {
    setDraft(base);
    setSimulation(result);
    setError("");
  };

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-success/10 text-success">
            <FlaskConical size={18} />
          </span>
          <div>
            <h3 className="font-semibold">What-if simulator</h3>
            <p className="mt-1 text-xs text-muted">
              Test operating changes without saving a new prediction.
            </p>
          </div>
        </div>
        <button onClick={reset} className="btn-secondary">
          <RefreshCw size={16} />
          Reset scenario
        </button>
      </div>
      <div className="grid gap-8 p-5 sm:p-7 xl:grid-cols-[1fr_260px] xl:items-center">
        <div className="space-y-6">
          {controls.map((control) => {
            const baseValue = Number(base[control.key]);
            const maximum =
              control.max ||
              Math.max(
                control.floor,
                Math.ceil(baseValue * control.multiplier),
              );
            return (
              <div key={control.key}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <label
                    htmlFor={`scenario-${control.key}`}
                    className="font-medium"
                  >
                    {control.label}
                  </label>
                  <span className="min-w-24 text-right font-semibold">
                    {control.format(draft[control.key])}
                  </span>
                </div>
                <input
                  id={`scenario-${control.key}`}
                  type="range"
                  min={control.min}
                  max={maximum}
                  step={control.step}
                  value={draft[control.key]}
                  onChange={(event) => update(control.key, event.target.value)}
                  className="scenario-range w-full"
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted">
                  <span>{control.format(control.min)}</span>
                  <span>Baseline {control.format(baseValue)}</span>
                  <span>{control.format(maximum)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-line pt-7 text-center dark:border-white/10 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
          <div className="relative mx-auto w-fit">
            <ScoreGauge
              score={simulation.analysis.success_index}
              label="Scenario Index"
              size={170}
            />
            {loading && (
              <div className="absolute inset-0 grid place-items-center rounded-full bg-surface/80 backdrop-blur-sm">
                <LoaderCircle className="animate-spin text-success" size={25} />
              </div>
            )}
          </div>
          <div
            className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${delta > 0 ? "bg-success/10 text-success" : delta < 0 ? "bg-coral/10 text-coral" : "bg-black/5 text-muted dark:bg-white/5"}`}
          >
            <TrendingUp size={16} />
            {delta > 0 ? "+" : ""}
            {delta} points vs baseline
          </div>
          <p className="mt-3 text-xs text-muted">
            {simulation.analysis.badge.name}
          </p>
          {error && <p className="mt-3 text-xs text-coral">{error}</p>}
        </div>
      </div>
    </section>
  );
}
