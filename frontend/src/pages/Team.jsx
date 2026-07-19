import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, UsersRound } from "lucide-react";
import Swal from "sweetalert2";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Empty, PageIntro, Spinner } from "../components/UI";

export default function Team() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const { data } = await api.get("/users");
      setItems(data.items);
    } catch {
      setError("Team accounts could not be loaded.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (target, changes) => {
    setSavingId(target.id);
    try {
      const { data } = await api.patch(`/users/${target.id}`, changes);
      setItems((current) =>
        current.map((item) => (item.id === data.id ? data : item)),
      );
    } catch (requestError) {
      Swal.fire({
        icon: "error",
        title: "Account not updated",
        text: requestError.response?.data?.detail || "Try again in a moment.",
        confirmButtonColor: "#1d2921",
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="Administration"
        title="Team access"
        description="Control workspace roles and suspend access without deleting account history."
        action={
          <button onClick={load} className="btn-secondary">
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />
      <section className="panel overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4 dark:border-white/10">
          <UsersRound size={18} className="text-success" />
          <div>
            <h3 className="text-sm font-semibold">Workspace accounts</h3>
            <p className="mt-0.5 text-xs text-muted">
              {items ? `${items.length} registered users` : "Loading accounts"}
            </p>
          </div>
        </div>
        {items === null && !error ? (
          <Spinner />
        ) : error ? (
          <Empty title="Could not load team" copy={error} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isSelf = item.id === user.id;
                  const saving = savingId === item.id;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-mint/20 text-xs font-bold text-success">
                            {item.username.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-medium">
                              {item.username}
                              {isSelf ? " (you)" : ""}
                            </p>
                            <p className="text-xs text-muted">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <label className="sr-only" htmlFor={`role-${item.id}`}>
                          Role for {item.username}
                        </label>
                        <select
                          id={`role-${item.id}`}
                          className="field max-w-36"
                          value={item.role}
                          disabled={isSelf || saving}
                          onChange={(event) =>
                            update(item, { role: event.target.value })
                          }
                        >
                          <option value="analyst">Analyst</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#237a45]"
                            checked={item.is_active}
                            disabled={isSelf || saving}
                            onChange={(event) =>
                              update(item, { is_active: event.target.checked })
                            }
                          />
                          {item.is_active ? "Active" : "Suspended"}
                        </label>
                      </td>
                      <td className="text-muted">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-success" />
        Administrators can review all workspace predictions. Analysts only see
        their own data.
      </div>
    </>
  );
}
