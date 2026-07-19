import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Clock3,
  History,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
  UsersRound,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "AI assessment", path: "/predict", icon: Sparkles },
  { label: "History", path: "/history", icon: History },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Activity logs", path: "/logs", icon: Clock3 },
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
    <div className="min-h-screen bg-canvas text-ink dark:bg-night dark:text-white">
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#161b18] text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center bg-mint text-[#162019]">
              <Activity size={19} />
            </span>
            <div>
              <div className="text-sm font-semibold">Foundr.AI</div>
              <div className="text-[11px] text-white/45">
                Intelligence workspace
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
        <nav className="mt-5 space-y-1 px-3">
          {visibleLinks.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group flex h-11 items-center gap-3 border-l-2 px-4 text-sm transition ${isActive ? "border-mint bg-white/10 text-white" : "border-transparent text-white/55 hover:bg-white/5 hover:text-white"}`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <ChevronRight
                size={15}
                className="opacity-0 group-hover:opacity-70"
              />
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-xs font-bold text-white">
              {user?.username?.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.username}</p>
              <p className="truncate text-[11px] text-white/45">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={doLogout}
            className="flex h-10 w-full items-center gap-3 px-3 text-sm text-white/55 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b border-line bg-canvas/90 px-5 backdrop-blur dark:border-white/10 dark:bg-night/90 sm:px-8">
          <button
            className="icon-btn mr-3 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase text-muted">
              Workspace
            </p>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="icon-btn"
              onClick={() => setDark(!dark)}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
