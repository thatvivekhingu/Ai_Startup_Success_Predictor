import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
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
        text: e.response?.data?.detail || "Check your credentials",
        confirmButtonColor: "#1d2921",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      <section className="relative hidden overflow-hidden bg-[#161b18] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-mint text-[#162019]">
              <Sparkles size={20} />
            </span>
            <span className="font-semibold">Foundr.AI</span>
          </div>
          <div className="mt-28 max-w-lg">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-mint">
              Decision intelligence for founders
            </p>
            <h1 className="text-5xl font-semibold leading-[1.08]">
              Turn startup signals into a clearer next move.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/60">
              A focused workspace for testing assumptions, comparing risk, and
              keeping every prediction auditable.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck size={15} /> Your workspace is protected with JWT
          authentication
        </div>
      </section>
      <section className="flex items-center justify-center bg-canvas p-6 dark:bg-night sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-mint text-[#162019]">
                <Sparkles size={19} />
              </span>
              <span className="font-semibold">Foundr.AI</span>
            </div>
          </div>
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase text-coral">
              Welcome back
            </p>
            <h2 className="text-3xl font-semibold">
              Sign in to your workspace
            </h2>
            <p className="mt-2 text-sm text-muted">
              Use the demo account or your team credentials.
            </p>
          </div>
          <form onSubmit={handleSubmit(submit)} className="space-y-5">
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <UserRound
                  className="absolute left-3.5 top-3 text-muted"
                  size={17}
                />
                <input
                  className="field pl-10"
                  autoComplete="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-coral">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <LockKeyhole
                  className="absolute left-3.5 top-3 text-muted"
                  size={17}
                />
                <input
                  className="field pl-10 pr-10"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1.5 grid h-8 w-8 place-items-center text-muted hover:text-ink"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-coral">
                  {errors.password.message}
                </p>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#237a45]"
                {...register("remember_me")}
              />
              Remember this device
            </label>
            <button disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Continue to workspace"}
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="mt-8 border-t border-line pt-5 text-center text-xs text-muted dark:border-white/10">
            <p>
              Demo access:{" "}
              <span className="font-semibold text-ink dark:text-white">
                demo
              </span>{" "}
              /{" "}
              <span className="font-semibold text-ink dark:text-white">
                demo1234
              </span>
            </p>
            <p className="mt-3">
              New to Foundr.AI?{" "}
              <Link
                to="/register"
                className="font-semibold text-success hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
