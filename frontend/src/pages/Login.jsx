import { useState } from "react";
import { 
  ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, 
  Sparkles, UserRound, Activity, Bot 
} from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "demo",
      password: "demo1234",
      remember_me: true,
    },
  });

  const submit = async (values) => {
    setLoading(true);
    try {
      await login(values);
      navigate("/dashboard");
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Unable to sign in",
        text: e.response?.data?.detail || "Invalid credentials. Try using username 'demo' and password 'demo1234'",
        background: "#0e1118",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  const setDemoCreds = () => {
    setValue("username", "demo");
    setValue("password", "demo1234");
  };

  return (
    <div className="grid min-h-screen bg-[#08090d] text-white lg:grid-cols-[1.1fr_.9fr]">
      {/* Left Branding Hero */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0c0f18] via-[#101424] to-[#08090d] p-12 text-white border-r border-white/5 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-accent-emerald/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-700 text-white font-black shadow-glow-brand">
              <Activity size={22} />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">Foundr.AI <span className="text-xs font-mono text-brand-400">2.0</span></span>
              <div className="text-[10px] text-dark-muted font-medium">Digital Twin Decision OS</div>
            </div>
          </div>

          <div className="mt-28 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
              <Sparkles size={13} />
              AI Digital Twin & Decision Intelligence
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Don't just predict success. <br />
              <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-emerald bg-clip-text text-transparent">
                Simulate your startup's future.
              </span>
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              A high-precision operating workspace combining XGBoost & PyTorch ML benchmarks, SHAP explainable risk drivers, What-If simulation labs, and Google Gemini AI copilot.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-dark-muted">
          <ShieldCheck size={16} className="text-accent-emerald" />
          Enterprise JWT Authentication & Decision Audit Logs
        </div>
      </section>

      {/* Right Sign-in Form */}
      <section className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8 glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-white font-bold">
              <Activity size={18} />
            </div>
            <span className="text-base font-bold text-white">Foundr.AI 2.0</span>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-400">Workspace Access</div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">Sign in to your account</h2>
            <p className="text-xs text-dark-muted mt-1.5">Enter your credentials or click below for instant demo access.</p>
          </div>

          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Username</label>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-3.5 text-dark-muted" size={16} />
                <input
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder-dark-muted outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Enter username"
                  autoComplete="username"
                  {...register("username", { required: "Username is required" })}
                />
              </div>
              {errors.username && (
                <p className="text-[11px] font-semibold text-accent-rose">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3.5 text-dark-muted" size={16} />
                <input
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-10 text-sm text-white placeholder-dark-muted outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-dark-muted hover:text-white"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-accent-rose">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-brand-600 focus:ring-brand-500 accent-brand-500"
                  {...register("remember_me")}
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={setDemoCreds}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Fill Demo Credentials
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-glow-brand transition hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              ) : (
                <>
                  <span>Continue to Workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span>Demo Account Credentials:</span>
              <button 
                type="button" 
                onClick={setDemoCreds}
                className="rounded-md bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-300 hover:bg-brand-500/30"
              >
                Auto-Fill
              </button>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-gray-300">User: <strong className="text-white">demo</strong></span>
              <span className="text-gray-300">Pass: <strong className="text-white">demo1234</strong></span>
            </div>
          </div>

          <div className="text-center text-xs text-dark-muted">
            New to Foundr.AI?{" "}
            <Link to="/register" className="font-semibold text-brand-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
