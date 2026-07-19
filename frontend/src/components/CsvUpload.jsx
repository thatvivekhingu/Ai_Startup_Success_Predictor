import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  UploadCloud,
  X,
} from "lucide-react";
import api from "../services/api";
import { Badge, money } from "./UI";

const sampleHeaders = [
  "startup_name",
  "country",
  "industry",
  "funding",
  "team_size",
  "experience",
  "revenue",
  "burn_rate",
  "market_size",
  "product_stage",
  "investors",
  "competition",
  "growth_rate",
];
const sampleRow = [
  "Northstar Labs",
  "India",
  "SaaS",
  750000,
  12,
  6,
  220000,
  45000,
  80000000,
  "MVP",
  2,
  55,
  32,
];

export default function CsvUpload({ onCreated }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [validation, setValidation] = useState(null);
  const [batch, setBatch] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const validate = async (selected) => {
    if (!selected) return;
    setFile(selected);
    setValidation(null);
    setBatch(null);
    setError("");
    setBusy("validate");
    try {
      const body = new FormData();
      body.append("file", selected);
      const { data } = await api.post("/csv/validate", body);
      setValidation(data);
    } catch (err) {
      setError(err.response?.data?.detail || "The CSV could not be validated.");
    } finally {
      setBusy("");
    }
  };

  const runBatch = async () => {
    if (!file || !validation?.valid_count) return;
    setBusy("predict");
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await api.post("/csv/predict", body);
      setBatch(data);
      onCreated?.(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Batch prediction failed.");
    } finally {
      setBusy("");
    }
  };

  const clear = () => {
    setFile(null);
    setValidation(null);
    setBatch(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const blob = new Blob(
      [`${sampleHeaders.join(",")}\n${sampleRow.join(",")}\n`],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "foundr-ai-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const drop = (event) => {
    event.preventDefault();
    setDragging(false);
    validate(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-5">
      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">CSV intelligence</h3>
            <p className="mt-1 text-xs text-muted">
              Validate and assess up to 200 startups in one batch.
            </p>
          </div>
          <button onClick={downloadTemplate} className="btn-secondary">
            <Download size={16} />
            CSV template
          </button>
        </div>
        <div className="p-5 sm:p-7">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(event) => validate(event.target.files?.[0])}
          />
          {!file ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={drop}
              className={`grid min-h-64 w-full place-items-center border border-dashed p-8 text-center transition ${dragging ? "border-success bg-success/5" : "border-line hover:border-success dark:border-white/15"}`}
            >
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-success/10 text-success">
                  <UploadCloud size={23} />
                </span>
                <p className="mt-5 font-semibold">Drop a CSV file here</p>
                <p className="mt-2 text-sm text-muted">
                  or select a file from your computer
                </p>
                <p className="mt-6 text-xs text-muted">
                  UTF-8 / maximum 2 MB / 200 rows
                </p>
              </div>
            </button>
          ) : (
            <div>
              <div className="flex flex-col gap-4 border-b border-line pb-5 dark:border-white/10 sm:flex-row sm:items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-success/10 text-success">
                  <FileSpreadsheet size={21} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{file.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {Math.max(1, Math.round(file.size / 1024))} KB
                  </p>
                </div>
                <button
                  onClick={clear}
                  className="icon-btn"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              </div>

              {busy === "validate" && (
                <div className="grid min-h-52 place-items-center text-sm text-muted">
                  <div className="text-center">
                    <LoaderCircle
                      className="mx-auto mb-3 animate-spin text-success"
                      size={24}
                    />
                    Detecting columns and checking data quality
                  </div>
                </div>
              )}

              {validation && (
                <div className="pt-5">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <Stat
                      label="Quality score"
                      value={`${validation.quality_score}/100`}
                    />
                    <Stat label="Rows found" value={validation.row_count} />
                    <Stat
                      label="Valid"
                      value={validation.valid_count}
                      tone="good"
                    />
                    <Stat
                      label="Invalid"
                      value={validation.invalid_count}
                      tone={validation.invalid_count ? "risk" : "normal"}
                    />
                  </div>

                  <div className="mt-6 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
                    <div>
                      <h4 className="text-sm font-semibold">
                        Smart column mapping
                      </h4>
                      <div className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                        {Object.entries(validation.mapping).map(
                          ([target, source]) => (
                            <div
                              key={target}
                              className="flex min-w-0 items-center justify-between gap-2 border-b border-line py-2 text-xs dark:border-white/10"
                            >
                              <span className="truncate text-muted">
                                {target.replaceAll("_", " ")}
                              </span>
                              <span
                                className={
                                  source ? "truncate font-medium" : "text-coral"
                                }
                              >
                                {source || "Not found"}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">
                        Data quality findings
                      </h4>
                      <div className="mt-3 space-y-2">
                        {validation.issues.length ? (
                          validation.issues.map((issue) => (
                            <div
                              key={`${issue.type}-${issue.message}`}
                              className="flex gap-3 border border-line p-3 text-xs dark:border-white/10"
                            >
                              {issue.severity === "error" ? (
                                <AlertTriangle
                                  size={16}
                                  className="shrink-0 text-coral"
                                />
                              ) : (
                                <AlertTriangle
                                  size={16}
                                  className="shrink-0 text-[#f2b84b]"
                                />
                              )}
                              <p className="leading-5 text-muted">
                                {issue.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="flex gap-3 border border-success/20 bg-success/5 p-3 text-xs text-success">
                            <CheckCircle2 size={16} className="shrink-0" />
                            No blocking data-quality issues detected.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {validation.preview.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-semibold">
                        Live preview
                      </h4>
                      <div className="overflow-x-auto border border-line dark:border-white/10">
                        <table className="data-table min-w-[880px]">
                          <thead>
                            <tr>
                              <th>Startup</th>
                              <th>Industry</th>
                              <th>Stage</th>
                              <th>Funding</th>
                              <th>Revenue</th>
                              <th>Growth</th>
                            </tr>
                          </thead>
                          <tbody>
                            {validation.preview.map((row, index) => (
                              <tr key={`${row.startup_name}-${index}`}>
                                <td className="font-medium">
                                  {row.startup_name}
                                </td>
                                <td>{row.industry}</td>
                                <td>{row.product_stage}</td>
                                <td>{money(row.funding)}</td>
                                <td>{money(row.revenue)}</td>
                                <td>{row.growth_rate}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted">
                      Invalid rows are skipped and listed in the validation
                      result.
                    </p>
                    <button
                      onClick={runBatch}
                      disabled={!validation.valid_count || busy === "predict"}
                      className="btn-primary min-w-44"
                    >
                      {busy === "predict" ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <FileSpreadsheet size={17} />
                      )}
                      {busy === "predict"
                        ? "Running batch..."
                        : `Predict ${validation.valid_count} rows`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {error && (
            <p className="mt-4 border border-coral/20 bg-coral/5 p-3 text-sm text-coral">
              {error}
            </p>
          )}
        </div>
      </section>

      {batch && (
        <section className="panel overflow-hidden">
          <div className="border-b border-line px-5 py-4 dark:border-white/10">
            <h3 className="font-semibold">Batch results</h3>
            <p className="mt-1 text-xs text-muted">
              {batch.created} predictions saved / {batch.skipped} rows skipped
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Startup</th>
                  <th>Outcome</th>
                  <th>Success Index</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {batch.results.map((row) => (
                  <tr key={row.id}>
                    <td className="text-muted">{row.source_row}</td>
                    <td className="font-medium">{row.startup_name}</td>
                    <td>
                      <Badge success={row.prediction === "Likely to succeed"}>
                        {row.prediction}
                      </Badge>
                    </td>
                    <td className="font-semibold">{row.success_index}/100</td>
                    <td>{row.badge.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, tone = "normal" }) {
  return (
    <div
      className={`border-t-2 bg-black/[.02] p-4 dark:bg-white/[.03] ${tone === "good" ? "border-success" : tone === "risk" ? "border-coral" : "border-line"}`}
    >
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
