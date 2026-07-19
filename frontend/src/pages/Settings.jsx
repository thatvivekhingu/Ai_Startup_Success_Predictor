import { useEffect, useState } from "react";
import {
  Check,
  Database,
  KeyRound,
  MonitorCog,
  Save,
  UserRound,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PageIntro } from "../components/UI";

const toast = (title) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    timer: 1800,
    showConfirmButton: false,
    icon: "success",
    title,
  });

const requestError = (error, fallback) =>
  Swal.fire({
    icon: "error",
    title: "Changes not saved",
    text: error.response?.data?.detail || fallback,
    confirmButtonColor: "#1d2921",
  });

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ss_theme") || "light",
  );
  const [saving, setSaving] = useState("");

  useEffect(() => {
    setProfile({ username: user?.username || "", email: user?.email || "" });
  }, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving("profile");
    try {
      const { data } = await api.patch("/me", profile);
      updateUser(data);
      toast("Profile updated");
    } catch (error) {
      requestError(error, "Review your username and email address.");
    } finally {
      setSaving("");
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (passwords.new_password.length < 8) {
      requestError({}, "The new password must contain at least 8 characters.");
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      requestError({}, "The new passwords do not match.");
      return;
    }
    setSaving("password");
    try {
      await api.post("/me/password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      toast("Password changed");
    } catch (error) {
      requestError(error, "The password could not be changed.");
    } finally {
      setSaving("");
    }
  };

  const saveAppearance = () => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("ss_theme", theme);
    window.dispatchEvent(new CustomEvent("ss-theme-change", { detail: theme }));
    toast("Preferences saved");
  };

  return (
    <>
      <PageIntro
        eyebrow="Workspace"
        title="Settings"
        description="Manage your account, security, and local interface preferences."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_.7fr]">
        <section className="panel">
          <form onSubmit={saveProfile}>
            <Row
              icon={UserRound}
              title="Profile"
              copy="Identity used for predictions and exports"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="settings-username">
                    Username
                  </label>
                  <input
                    id="settings-username"
                    className="field"
                    value={profile.username}
                    minLength={3}
                    maxLength={80}
                    pattern="[A-Za-z0-9._-]+"
                    required
                    onChange={(event) =>
                      setProfile((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label" htmlFor="settings-email">
                    Email
                  </label>
                  <input
                    id="settings-email"
                    className="field"
                    type="email"
                    value={profile.email}
                    required
                    onChange={(event) =>
                      setProfile((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button disabled={saving === "profile"} className="btn-primary">
                  <Save size={16} />
                  {saving === "profile" ? "Saving..." : "Save profile"}
                </button>
              </div>
            </Row>
          </form>

          <form onSubmit={changePassword}>
            <Row
              icon={KeyRound}
              title="Password"
              copy="Replace the password used to access this account"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="current-password">
                    Current password
                  </label>
                  <input
                    id="current-password"
                    className="field"
                    type="password"
                    autoComplete="current-password"
                    value={passwords.current_password}
                    required
                    onChange={(event) =>
                      setPasswords((current) => ({
                        ...current,
                        current_password: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label" htmlFor="new-password">
                    New password
                  </label>
                  <input
                    id="new-password"
                    className="field"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={passwords.new_password}
                    required
                    onChange={(event) =>
                      setPasswords((current) => ({
                        ...current,
                        new_password: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label" htmlFor="confirm-password">
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    className="field"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={passwords.confirm_password}
                    required
                    onChange={(event) =>
                      setPasswords((current) => ({
                        ...current,
                        confirm_password: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button disabled={saving === "password"} className="btn-primary">
                  <KeyRound size={16} />
                  {saving === "password" ? "Changing..." : "Change password"}
                </button>
              </div>
            </Row>
          </form>

          <Row
            icon={MonitorCog}
            title="Appearance"
            copy="Choose how this workspace is rendered"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`btn-secondary flex-1 ${theme === "light" ? "border-success ring-1 ring-success" : ""}`}
              >
                {theme === "light" && <Check size={16} />} Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`btn-secondary flex-1 ${theme === "dark" ? "border-success ring-1 ring-success" : ""}`}
              >
                {theme === "dark" && <Check size={16} />} Dark
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={saveAppearance} className="btn-primary">
                <Save size={16} /> Save appearance
              </button>
            </div>
          </Row>
        </section>

        <aside className="space-y-5">
          <section className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <Database size={18} className="text-success" />
              <h3 className="font-semibold">Environment</h3>
            </div>
            <dl className="space-y-3 text-sm">
              <Item k="Database" v="SQLite / PostgreSQL" />
              <Item k="Model" v="Trained ML pipeline" />
              <Item k="API" v="FastAPI" />
              <Item k="Role" v={user?.role || "analyst"} />
            </dl>
          </section>
          <section className="panel p-5">
            <div className="mb-3 flex items-center gap-3">
              <KeyRound size={18} className="text-coral" />
              <h3 className="font-semibold">Security</h3>
            </div>
            <p className="text-sm leading-6 text-muted">
              Sessions use signed JWT access tokens. Production deployments must
              set a unique secret and use HTTPS.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

function Row({ icon: Icon, title, copy, children }) {
  return (
    <div className="grid gap-5 border-b border-line p-5 last:border-b-0 dark:border-white/10 sm:p-6 md:grid-cols-[180px_1fr]">
      <div>
        <Icon size={19} className="mb-3 text-success" />
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-muted">{copy}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Item({ k, v }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="font-medium capitalize">{v}</dd>
    </div>
  );
}
