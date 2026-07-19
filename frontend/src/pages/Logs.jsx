import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LogIn,
} from "lucide-react";
import api from "../services/api";
import { Empty, PageIntro, Spinner } from "../components/UI";

const icons = { login: LogIn, prediction: Activity, auth_error: AlertTriangle };
export default function Logs() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/logs")
      .then((r) => setItems(r.data.items))
      .catch(() => setError("Activity logs could not be loaded."));
  }, []);
  if (error) return <Empty title="Could not load activity" copy={error} />;
  return (
    <>
      <PageIntro
        eyebrow="Observability"
        title="Activity logs"
        description="Authentication and prediction events captured by the API for operational traceability."
      />
      <div className="panel">
        {items === null ? (
          <Spinner />
        ) : items.length ? (
          <div>
            {items.map((item, i) => {
              const Icon = icons[item.event] || CheckCircle2;
              return (
                <div
                  key={item.id}
                  className={`flex gap-4 px-5 py-4 sm:px-6 ${i < items.length - 1 ? "border-b border-line dark:border-white/10" : ""}`}
                >
                  <span
                    className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center ${item.status_code < 400 ? "bg-mint/20 text-success" : "bg-coral/10 text-coral"}`}
                  >
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <p className="text-sm font-medium capitalize">
                        {item.event.replace("_", " ")}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock3 size={13} />
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">
                      <span className="font-semibold">{item.method}</span>{" "}
                      {item.path} / HTTP {item.status_code}
                      {item.detail ? ` / ${item.detail}` : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty
            title="No activity recorded"
            copy="Login and prediction events will appear here."
          />
        )}
      </div>
    </>
  );
}
