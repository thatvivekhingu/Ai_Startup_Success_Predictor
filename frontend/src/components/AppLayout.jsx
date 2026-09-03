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
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Digital Twin", path: "/twin", icon: Layers },
  { label: "Decision Center", path: "/decision-center", icon: Activity },
  { label: "Simulation Lab", path: "/simulation", icon: SlidersHorizontal },
  { label: "Foundr Copilot", path: "/copilot", icon: Bot },
  { label: "Risk Explorer", path: "/risk-explorer", icon: ShieldAlert },
  { label: "Signals & Timeline", path: "/signals", icon: Radio },
  { label: "Executive Report", path: "/reports", icon: FileText },
  { label: "AI Predictor", path: "/predict", icon: Sparkles },
  { label: "History", path: "/history", icon: History },
  { label: "Activity Logs", path: "/logs", icon: Clock3 },
  { label: "Team", path: "/team", icon: UsersRound, adminOnly: true },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("ss_theme") !== "light",
  );
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("ss_theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const syncTheme = (event) => setDark(event.detail === "dark");
    window.addEventListener("ss-theme-change", syncTheme);
    return () => window.removeEventListener("ss-theme-change", syncTheme);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const visibleLinks = links.filter(
    (item) => !item.adminOnly || user?.role === "admin",
  );

  const title =
    links.find((item) => item.path === location.pathname)?.label || "Workspace";

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-canvas text-ink dark:bg-[#0c110e] dark:text-white">
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#121814] text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-black font-black">
              <Activity size={20} />
            </span>
            <div>
              <div className="text-sm font-bold tracking-tight">Foundr.AI <span className="text-xs font-mono text-emerald-400">2.0</span></div>
              <div className="text-[10px] text-white/45 uppercase tracking-wider">
                Digital Twin Decision OS
              </div>
            </div>
          </div>
          <button
            className="icon-btn text-white lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto space-y-1 px-3">
          {visibleLinks.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group flex h-10 items-center gap-3 rounded-lg border-l-2 px-3.5 text-xs font-medium transition ${isActive ? "border-emerald-400 bg-emerald-500/10 text-emerald-300 font-semibold" : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"}`
              }
            >
              <Icon size={16} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-semibold text-white">{user?.username}</div>
              <div className="text-[10px] text-emerald-400 capitalize">{user?.role}</div>
            </div>
            <button
              onClick={doLogout}
              className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-rose-400 transition"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-800 bg-[#0c110e]/90 backdrop-blur px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-white/70 hover:bg-white/5 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base font-bold text-white">{title}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="rounded-lg border border-gray-800 bg-gray-900 p-2 text-gray-300 hover:text-white transition"
              title="Toggle Theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
