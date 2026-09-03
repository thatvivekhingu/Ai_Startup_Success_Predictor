import { useState, useEffect } from "react";
import { 
  Sparkles, ArrowUpRight, ArrowDownRight, AlertTriangle, 
  CheckCircle2, X, Search, Bell, Command, ChevronRight, Layers,
  Activity, SlidersHorizontal, Bot, ShieldAlert, Radio, FileText, Inbox
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Formatters
export function money(val, currency = "USD") {
  if (val === null || val === undefined || isNaN(val)) return "$0";
  const num = Number(val);
  if (Math.abs(num) >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `$${(num / 1_000).toFixed(0)}K`;
  }
  return `$${num.toLocaleString()}`;
}

export function pct(val) {
  if (val === null || val === undefined || isNaN(val)) return "0%";
  const num = Number(val);
  const normalized = num <= 1 && num > 0 ? num * 100 : num;
  return `${normalized.toFixed(1)}%`;
}

// 2. PageIntro
export function PageIntro({ kicker, title, description, actions }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-6">
      <div>
        {kicker && (
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-1">
            {kicker}
          </div>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">{title}</h1>
        {description && <p className="text-sm text-dark-muted mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// 3. Empty State
export function Empty({ title = "No data found", description = "There are no records to display at this time.", icon: Icon = Inbox, action }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-8 text-center bg-white/[0.01]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-dark-muted mb-3">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-dark-muted mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// 4. MetricCard
export function MetricCard({ title, value, subtitle, delta, deltaType = "positive", icon: Icon, glowColor = "brand", onClick }) {
  const isPos = deltaType === "positive";
  const isNeg = deltaType === "negative";

  const glowClasses = {
    brand: "hover:border-brand-500/40 hover:shadow-glow-brand",
    emerald: "hover:border-accent-emerald/40 hover:shadow-glow-emerald",
    amber: "hover:border-accent-amber/40 hover:shadow-glow-amber",
    rose: "hover:border-accent-rose/40 hover:shadow-glow-rose",
    cyan: "hover:border-accent-cyan/40",
  }[glowColor] || "hover:border-brand-500/40";

  return (
    <div 
      onClick={onClick}
      className={`glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-5 transition cursor-pointer ${glowClasses}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-dark-muted">{title}</span>
        {Icon && (
          <div className="rounded-xl border border-white/5 bg-white/5 p-2 text-dark-muted transition group-hover:text-white group-hover:scale-110">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-black tracking-tight text-white">{value}</div>
        {delta && (
          <span className={`flex items-center text-xs font-semibold ${isPos ? "text-accent-emerald" : isNeg ? "text-accent-rose" : "text-accent-amber"}`}>
            {isPos ? <ArrowUpRight size={14} /> : isNeg ? <ArrowDownRight size={14} /> : null}
            {delta}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-1.5 text-xs text-dark-muted font-normal">{subtitle}</div>
      )}
    </div>
  );
}

// 5. Badge
export function Badge({ children, variant = "default", dot = true, size = "md" }) {
  const variants = {
    default: "border-white/10 bg-white/5 text-gray-300",
    emerald: "border-accent-emerald/20 bg-accent-emerald/10 text-accent-emerald",
    amber: "border-accent-amber/20 bg-accent-amber/10 text-accent-amber",
    rose: "border-accent-rose/20 bg-accent-rose/10 text-accent-rose",
    brand: "border-brand-500/20 bg-brand-500/10 text-brand-400",
    cyan: "border-accent-cyan/20 bg-accent-cyan/10 text-accent-cyan",
  }[variant] || "border-white/10 bg-white/5 text-gray-300";

  const dotColors = {
    default: "bg-gray-400",
    emerald: "bg-accent-emerald",
    amber: "bg-accent-amber",
    rose: "bg-accent-rose",
    brand: "bg-brand-500",
    cyan: "bg-accent-cyan",
  }[variant] || "bg-gray-400";

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider ${variants} ${sizeClass}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors} animate-pulse`} />}
      {children}
    </span>
  );
}

// 6. Button
export function Button({ children, variant = "primary", size = "md", icon: Icon, loading = false, className = "", ...props }) {
  const base = "inline-flex items-center justify-center font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 shadow-glow-brand rounded-xl",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl",
    emerald: "bg-accent-emerald text-black hover:bg-emerald-400 font-bold shadow-glow-emerald rounded-xl",
    danger: "bg-accent-rose/20 text-accent-rose hover:bg-accent-rose/30 border border-accent-rose/30 rounded-xl",
    ghost: "text-dark-muted hover:text-white hover:bg-white/5 rounded-lg",
  }[variant] || "bg-brand-600 text-white rounded-xl";

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  }[size] || "h-10 px-4 text-sm gap-2";

  return (
    <button className={`${base} ${variants} ${sizes} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : Icon ? (
        <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
      ) : null}
      {children}
    </button>
  );
}

// 7. Card
export function Card({ title, subtitle, action, children, className = "", noPadding = false }) {
  return (
    <div className={`glass-card rounded-2xl ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div>
            {title && <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-dark-muted">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </div>
  );
}

// 8. Skeleton
export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
  );
}

// 9. Spinner
export function Spinner({ label = "Loading Foundr.AI workspace..." }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-r-transparent" />
      <span className="text-xs font-medium text-dark-muted tracking-wide">{label}</span>
    </div>
  );
}

// 10. Global Search Modal (Cmd+K)
export function GlobalSearchModal({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const commands = [
    { title: "Command Dashboard", path: "/dashboard", icon: Activity, category: "Navigation" },
    { title: "Startup Digital Twin", path: "/twin", icon: Layers, category: "Core State" },
    { title: "Decision Center & Alerts", path: "/decision-center", icon: AlertTriangle, category: "Intelligence" },
    { title: "What-If Simulation Lab", path: "/simulation", icon: SlidersHorizontal, category: "Simulations" },
    { title: "Strategic Scenarios Matrix", path: "/scenarios", icon: Sparkles, category: "Scenarios" },
    { title: "12-Month Forecast", path: "/forecast", icon: TrendingUp, category: "Forecasting" },
    { title: "Foundr AI Copilot", path: "/copilot", icon: Bot, category: "Agentic AI" },
    { title: "Risk Explorer & SHAP", path: "/risk-explorer", icon: ShieldAlert, category: "Explainability" },
    { title: "Market Signals & Timeline", path: "/signals", icon: Radio, category: "Ecosystem" },
    { title: "Executive Intelligence Report", path: "/reports", icon: FileText, category: "Reports" },
  ];

  const filtered = commands.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md pt-24 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e1118] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search size={18} className="text-dark-muted" />
          <input
            type="text"
            placeholder="Search screens, actions, simulations, or ask AI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-dark-muted outline-none"
          />
          <button onClick={onClose} className="rounded-lg p-1 text-dark-muted hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className="text-brand-400" />
                <span className="font-medium">{item.title}</span>
              </div>
              <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-dark-muted">{item.category}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-dark-muted">No commands found matching "{search}"</div>
          )}
        </div>
      </div>
    </div>
  );
}

// 11. Notification Drawer
export function NotificationDrawer({ isOpen, onClose, warnings = [] }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md border-l border-white/10 bg-[#0e1118] p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-bold text-white">
              <Bell size={18} className="text-brand-400" />
              <span>Early Warnings & Alerts ({warnings.length})</span>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-dark-muted hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 space-y-3 overflow-y-auto max-h-[70vh]">
            {warnings.map((w, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`font-bold uppercase ${w.severity === 'critical' ? 'text-accent-rose' : w.severity === 'opportunity' ? 'text-accent-emerald' : 'text-accent-amber'}`}>
                    {w.severity} • {w.category}
                  </span>
                  <span className="text-dark-muted font-mono">{w.metric_affected}</span>
                </div>
                <div className="text-xs font-bold text-white">{w.title}</div>
                <div className="text-[11px] text-gray-400">{w.description}</div>
              </div>
            ))}
            {warnings.length === 0 && (
              <div className="py-12 text-center text-xs text-dark-muted">No active critical alerts. Digital Twin operating in healthy state.</div>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            navigate("/decision-center");
            onClose();
          }}
          className="w-full rounded-xl bg-brand-600 py-3 text-xs font-semibold text-white transition hover:bg-brand-500"
        >
          Open Decision Center
        </button>
      </div>
    </div>
  );
}
