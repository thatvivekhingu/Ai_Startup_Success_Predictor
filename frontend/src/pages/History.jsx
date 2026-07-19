import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import api from "../services/api";
import { Badge, Empty, PageIntro, Spinner, money, pct } from "../components/UI";
import Swal from "sweetalert2";

export default function History() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [outcome, setOutcome] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .get("/history", {
          params: {
            search: search || undefined,
            outcome: outcome || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            page,
            page_size: 10,
          },
        })
        .then((response) => {
          setData(response.data);
          setError("");
        })
        .catch(() => setError("Prediction history could not be loaded."));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, outcome, startDate, endDate, page]);

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };
  const download = async () => {
    try {
      const response = await api.get("/download-csv", { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "foundr-ai-predictions.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Export failed",
        text: "The CSV could not be generated.",
        confirmButtonColor: "#1d2921",
      });
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="Audit trail"
        title="Prediction history"
        description="Search, date-filter, paginate, and export every model assessment in your workspace."
        action={
          <button
            onClick={download}
            disabled={!data?.total}
            className="btn-secondary"
          >
            <Download size={17} />
            Download CSV
          </button>
        }
      />
      {error ? (
        <Empty title="Could not load history" copy={error} />
      ) : (
        <div className="panel">
          <div className="grid gap-3 border-b border-line p-4 dark:border-white/10 md:grid-cols-2 xl:grid-cols-[1fr_190px_170px_170px]">
            <div className="relative">
              <Search
                className="absolute left-3.5 top-3 text-muted"
                size={17}
              />
              <input
                value={search}
                onChange={changeFilter(setSearch)}
                className="field pl-10"
                placeholder="Search startup name"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal
                className="absolute left-3.5 top-3 text-muted"
                size={16}
              />
              <select
                value={outcome}
                onChange={changeFilter(setOutcome)}
                className="field pl-10"
              >
                <option value="">All outcomes</option>
                <option>Likely to succeed</option>
                <option>High risk</option>
              </select>
            </div>
            <div>
              <label className="sr-only" htmlFor="start-date">
                Start date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={changeFilter(setStartDate)}
                className="field"
                title="Start date"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="end-date">
                End date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={changeFilter(setEndDate)}
                className="field"
                title="End date"
              />
            </div>
          </div>
          {data === null ? (
            <Spinner />
          ) : data.items.length ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Startup</th>
                    <th>User</th>
                    <th>Funding</th>
                    <th>Outcome</th>
                    <th>Confidence</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <p className="font-medium">{item.startup_name}</p>
                        <p className="mt-1 text-xs text-muted">
                          {item.industry} / {item.country}
                        </p>
                      </td>
                      <td className="text-muted">{item.username}</td>
                      <td>{money(item.funding)}</td>
                      <td>
                        <Badge
                          success={item.prediction === "Likely to succeed"}
                        >
                          {item.prediction}
                        </Badge>
                      </td>
                      <td className="font-semibold">{pct(item.probability)}</td>
                      <td className="text-muted">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="No matching predictions"
              copy="Change your filters or create a new assessment."
            />
          )}
          {data && data.total > 0 && (
            <div className="flex flex-col justify-between gap-3 border-t border-line px-5 py-4 text-xs text-muted dark:border-white/10 sm:flex-row sm:items-center">
              <span>
                Showing {(data.page - 1) * data.page_size + 1}-
                {Math.min(data.page * data.page_size, data.total)} of{" "}
                {data.total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="icon-btn border border-line dark:border-white/10"
                  disabled={data.page <= 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>
                <span className="min-w-20 text-center">
                  Page {data.page} of {data.pages}
                </span>
                <button
                  className="icon-btn border border-line dark:border-white/10"
                  disabled={data.page >= data.pages}
                  onClick={() => setPage(page + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
