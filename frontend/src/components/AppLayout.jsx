import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Layers,
  ShieldAlert,
  SlidersHorizontal,
  Bot,
  Radio,
  FileText,
  Sparkles,
  LayoutDashboard,
  History,
  BarChart3,
  Clock3,
  Settings,
  UsersRound,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
  Search,
  Bell,
  ChevronDown,
  Building2,
  TrendingUp,
  GitCompare
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { GlobalSearchModal, NotificationDrawer } from "./UI";
import api from "../services/api";

const navigationGroups = [
  {
    title: "COMMAND",
    items: [
      { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
      { label: "Digital Twin", path: "/twin", icon: Layers, badge: "Live" },
      { label: "Decision Center", path: "/decision-center", icon: Activity, alert: true },
    ]
  },
  {
    title: "STRATEGY & LABS",
    items: [
      { label: "Simulation Lab", path: "/simulation", icon: SlidersHorizontal },
      { label: "Scenarios", path: "/scenarios", icon: GitCompare },
      { label: "Forecast", path: "/forecast", icon: TrendingUp },
    ]
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Foundr Copilot", path: "/copilot", icon: Bot, badge: "Agentic" },
      { label: "Risk Explorer", path: "/risk-explorer", icon: ShieldAlert },
      { label: "Signals & Timeline", path: "/signals", icon: Radio },
      { label: "Executive Reports", path: "/reports", icon: FileText },
    ]
  },
  {
    title: "DATA & OPERATIONS",
    items: [
      { label: "AI Predictor", path: "/predict", icon: Sparkles },
      { label: "Data Center", path: "/history", icon: History },
      { label: "Activity Logs", path: "/logs", icon: Clock3 },
      { label: "Team", path: "/team", icon: UsersRound, adminOnly: true },
      { label: "Settings", path: "/settings", icon: Settings },
    ]
  }
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [twin, setTwin] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    fetchWarnings();
  }, [location.pathname]);

  const fetchWarnings = async () => {
    try {
      const [warnRes, twinRes] = await Promise.all([
        api.get("/api/early-warnings"),
        api.get("/api/startup/twin")
      ]);
      setWarnings(warnRes.data || []);
      setTwin(twinRes.data || null);
    } catch (e) {
      console.error(e);
    }
  };

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  // Find active item title
  let currentTitle = "Workspace";
  navigationGroups.forEach(g => {
    const match = g.items.find(i => i.path === location.pathname);
    if (match) currentTitle = match.label;
  });

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 font-sans selection:bg-brand-500/30 selection:text-white">
      {/* Mobile backdrop */}
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} warnings={warnings} />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0a0c12]/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-700 text-white font-black shadow-glow-brand">
              <Activity size={18} />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Foundr.AI <span className="rounded-md bg-brand-500/20 px-1.5 py-0.2 text-[10px] font-mono text-brand-400 font-bold">2.0</span>
              </div>
              <div className="text-[10px] text-dark-muted">Startup Decision OS</div>
            </div>
          </div>
          <button
            className="rounded-lg p-1.5 text-dark-muted hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Startup Selector Pill */}
        <div className="p-3 border-b border-white/5">
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-2.5 hover:bg-white/[0.06] transition cursor-pointer">
            <div className="flex items-center gap-2.5 truncate">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-emerald/10 text-accent-emerald">
                <Building2 size={14} />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{twin?.startup?.name || "NovaAI Tech"}</div>
                <div className="text-[10px] text-accent-emerald flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
                  Health: {twin?.health_score || 78}/100
                </div>
              </div>
            </div>
            <ChevronDown size={14} className="text-dark-muted shrink-0" />
          </div>
        </div>

        {/* Nav Items with Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {navigationGroups.map((group, gidx) => {
            const visibleItems = group.items.filter(i => !i.adminOnly || user?.role === "admin");
            if (visibleItems.length === 0) return null;

            return (
              <div key={gidx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-dark-muted/70">
                  {group.title}
                </div>
                {visibleItems.map((item, iidx) => (
                  <NavLink
                    key={iidx}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex h-9 items-center justify-between rounded-xl px-3 text-xs font-medium transition ${
                        isActive
                          ? "bg-brand-500/15 text-white font-semibold border border-brand-500/30 shadow-glow-brand"
                          : "text-dark-muted hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon size={15} className="shrink-0 transition group-hover:text-white" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-brand-500/20 px-1.5 py-0.2 text-[9px] font-bold text-brand-300">
                        {item.badge}
                      </span>
                    )}
                    {item.alert && warnings.length > 0 && (
                      <span className="h-2 w-2 rounded-full bg-accent-rose animate-ping" />
                    )}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-2.5">
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{user?.username}</div>
              <div className="text-[10px] text-dark-muted capitalize">{user?.role}</div>
            </div>
            <button
              onClick={doLogout}
              className="rounded-lg p-1.5 text-dark-muted hover:text-accent-rose hover:bg-white/5 transition"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#08090d]/80 backdrop-blur-xl px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl border border-white/10 p-2 text-dark-muted hover:text-white lg:hidden"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-dark-muted">Workspace</span>
              <span className="text-dark-muted">/</span>
              <span className="font-bold text-white text-sm">{currentTitle}</span>
            </div>
          </div>

          {/* Quick Actions & Header Tools */}
          <div className="flex items-center gap-3">
            {/* Global Search Button (Cmd+K) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-dark-muted hover:border-white/20 hover:text-white transition"
            >
              <Search size={14} />
              <span>Quick Search...</span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-gray-300">⌘K</kbd>
            </button>

            {/* Early Warnings Bell */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2 text-dark-muted hover:text-white transition"
              title="Early Warnings & Anomalies"
            >
              <Bell size={16} />
              {warnings.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-rose text-[9px] font-black text-white">
                  {warnings.length}
                </span>
              )}
            </button>

            {/* AI Copilot shortcut button */}
            <button
              onClick={() => navigate("/copilot")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-glow-brand transition hover:from-brand-500 hover:to-indigo-500"
            >
              <Bot size={14} />
              <span className="hidden md:inline">Ask Copilot</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
