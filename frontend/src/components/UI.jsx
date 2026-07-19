import { LoaderCircle } from "lucide-react";
export function PageIntro({ eyebrow, title, description, action }) {
  let displayTitle = title;
  if (typeof title === "string" && title.includes("{user}")) {
    const stored =
      localStorage.getItem("ss_user") || sessionStorage.getItem("ss_user");
    displayTitle = title.replace(
      "{user}",
      stored ? JSON.parse(stored).username : "there",
    );
  }
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-coral">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl">{displayTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Spinner({ label = "Loading data" }) {
  return (
    <div className="grid min-h-64 place-items-center">
      <div className="text-center text-sm text-muted">
        <LoaderCircle className="mx-auto mb-3 animate-spin" size={24} />
        {label}
      </div>
    </div>
  );
}
export function Empty({ title, copy }) {
  return (
    <div className="grid min-h-48 place-items-center border border-dashed border-line p-8 text-center dark:border-white/10">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted">{copy}</p>
      </div>
    </div>
  );
}
export function Badge({ success, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${success ? "bg-mint/20 text-success dark:text-mint" : "bg-coral/10 text-coral"}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${success ? "bg-success" : "bg-coral"}`}
      />
      {children}
    </span>
  );
}
export const money = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v || 0);
export const pct = (v) => `${Math.round((v || 0) * 100)}%`;
