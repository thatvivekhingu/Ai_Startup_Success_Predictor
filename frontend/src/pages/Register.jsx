import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const submit = async (values) => {
    setLoading(true);
    try {
      const { confirm_password, ...payload } = values;
      await registerUser(payload);
      navigate("/home");
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Account not created",
        text: e.response?.data?.detail || "Please review your details.",
        confirmButtonColor: "#1d2921",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-canvas p-5 dark:bg-night">
      <div className="w-full max-w-lg">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
        <div className="panel p-6 sm:p-9">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-mint text-[#162019]">
              <Sparkles size={20} />
            </span>
            <div>
              <h1 className="text-xl font-semibold">
                Create your workspace account
              </h1>
              <p className="mt-1 text-xs text-muted">
                Start tracking startup decisions in one place.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <Field
              icon={UserRound}
              label="Username"
              error={errors.username?.message}
            >
              <input
                className="field pl-10"
                autoComplete="username"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Use at least 3 characters" },
                  pattern: {
                    value: /^[A-Za-z0-9._-]+$/,
                    message: "Use letters, numbers, dots, dashes, or underscores",
                  },
                })}
              />
            </Field>
            <Field icon={Mail} label="Email" error={errors.email?.message}>
              <input
                className="field pl-10"
                type="email"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
              />
            </Field>
            <Field
              icon={LockKeyhole}
              label="Password"
              error={errors.password?.message}
            >
              <input
                className="field pl-10"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Use at least 8 characters" },
                })}
              />
            </Field>
            <Field
              icon={LockKeyhole}
              label="Confirm password"
              error={errors.confirm_password?.message}
            >
              <input
                className="field pl-10"
                type="password"
                autoComplete="new-password"
                {...register("confirm_password", {
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
            </Field>
            <button disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? "Creating account..." : "Create account"}
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
function Field({ icon: Icon, label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-3 text-muted" size={17} />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-coral">{error}</p>}
    </div>
  );
}
