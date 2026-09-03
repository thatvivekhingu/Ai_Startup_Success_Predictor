import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles, UserRound, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = async (values) => {
    setLoading(true);
    try {
      await registerUser(values);
      navigate("/dashboard");
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: e.response?.data?.detail || "Could not complete account creation",
        background: "#0e1118",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#08090d] text-white lg:grid-cols-[1.1fr_.9fr]">
      {/* Left Branding Hero */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0c0f18] via-[#101424] to-[#08090d] p-12 text-white border-r border-white/5 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />

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
              Setup Your Venture Digital Twin
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Join the new standard of <br />
              <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-emerald bg-clip-text text-transparent">
                Venture Decision Intelligence.
              </span>
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Create an account to track your startup health score, simulate hiring and burn decisions, and leverage agentic AI copilot advisory.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-dark-muted">
          <ShieldCheck size={16} className="text-accent-emerald" />
          Enterprise JWT Authentication & Multi-Tenant Workspace Isolation
        </div>
      </section>

      {/* Right Sign-up Form */}
      <section className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8 glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-400">Get Started</div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">Create founder account</h2>
            <p className="text-xs text-dark-muted mt-1.5">Start simulating your venture trajectory with Foundr.AI 2.0.</p>
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

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-dark-muted" size={16} />
                <input
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder-dark-muted outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-accent-rose">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3.5 text-dark-muted" size={16} />
                <input
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder-dark-muted outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  type="password"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-accent-rose">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-glow-brand transition hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 pt-2"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-dark-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
