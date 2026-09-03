import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";
import { Spinner } from "./components/UI";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DigitalTwin = lazy(() => import("./pages/DigitalTwin"));
const DecisionCenter = lazy(() => import("./pages/DecisionCenter"));
const SimulationLab = lazy(() => import("./pages/SimulationLab"));
const Scenarios = lazy(() => import("./pages/Scenarios"));
const Forecast = lazy(() => import("./pages/Forecast"));
const FoundrCopilot = lazy(() => import("./pages/FoundrCopilot"));
const RiskExplorer = lazy(() => import("./pages/RiskExplorer"));
const SignalsTimeline = lazy(() => import("./pages/SignalsTimeline"));
const ExecutiveReport = lazy(() => import("./pages/ExecutiveReport"));
const Predict = lazy(() => import("./pages/Predict"));
const History = lazy(() => import("./pages/History"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Logs = lazy(() => import("./pages/Logs"));
const Settings = lazy(() => import("./pages/Settings"));
const Team = lazy(() => import("./pages/Team"));

function Protected() {
  const { user, ready } = useAuth();
  if (!ready) return <Spinner label="Restoring your session..." />;
  return user ? <AppLayout /> : <Navigate to="/login" replace />;
}

function AdminOnly() {
  const { user } = useAuth();
  return user?.role === "admin" ? (
    <Team />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export default function App() {
  return (
    <Suspense fallback={<Spinner label="Loading Foundr.AI 2.0 workspace..." />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Protected />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/twin" element={<DigitalTwin />} />
          <Route path="/decision-center" element={<DecisionCenter />} />
          <Route path="/simulation" element={<SimulationLab />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/copilot" element={<FoundrCopilot />} />
          <Route path="/risk-explorer" element={<RiskExplorer />} />
          <Route path="/signals" element={<SignalsTimeline />} />
          <Route path="/reports" element={<ExecutiveReport />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/team" element={<AdminOnly />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
