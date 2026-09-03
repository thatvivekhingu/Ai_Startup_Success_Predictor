import { useEffect, useState } from "react";
import api from "../services/api";
import { FileText, Download, Copy, Check, Sparkles, ShieldCheck } from "lucide-react";

export default function ExecutiveReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/reports/generate");
      setReport(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report?.report_markdown) return;
    navigator.clipboard.writeText(report.report_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-3 text-sm text-gray-400">Synthesizing Executive Intelligence Report with Google Gemini AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Executive Briefing Document</div>
          <h1 className="text-2xl font-bold text-white">Startup Intelligence Report</h1>
          <p className="text-sm text-gray-400">Comprehensive 13-section diagnostic memo for founders, advisors, and investment committees.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy Markdown"}
          </button>
        </div>
      </div>

      {/* Report Markdown Container */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl">
        <div className="prose prose-invert max-w-none text-sm text-gray-200 leading-relaxed whitespace-pre-line">
          {report?.report_markdown}
        </div>
      </div>
    </div>
  );
}
