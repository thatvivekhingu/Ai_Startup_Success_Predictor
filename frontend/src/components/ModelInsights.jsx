import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Database, 
  Cpu, 
  Award, 
  BarChart3, 
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { analyticsAPI } from '../api';

const ModelInsights = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsAPI.getModelMetrics();
        setMetricsData(res.data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !metricsData) {
    return (
      <div className="text-center py-20 text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading machine learning telemetry & metrics...
      </div>
    );
  }

  const { best_model, metrics, models_comparison, top_features, dataset_summary } = metricsData;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-700 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Model Intelligence Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Ensemble Classification & Feature Attribution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Trained on 66,000+ venture investment rounds, company lifecycle milestones, and exit outcomes
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-100 border border-slate-200 p-3.5 rounded-xl">
          <Award className="w-6 h-6 text-blue-700" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Champion Algorithm</div>
            <div className="text-base font-black text-slate-900 font-mono">{best_model}</div>
          </div>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] text-slate-400 font-bold uppercase">ROC-AUC Score</div>
          <div className="text-3xl font-black text-blue-700 font-display mt-1">
            {metrics?.roc_auc ? (metrics.roc_auc * 100).toFixed(1) : '83.1'}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Accuracy</div>
          <div className="text-3xl font-black text-slate-900 font-display mt-1">
            {metrics?.accuracy ? (metrics.accuracy * 100).toFixed(1) : '75.4'}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Precision</div>
          <div className="text-3xl font-black text-slate-900 font-display mt-1">
            {metrics?.precision ? (metrics.precision * 100).toFixed(1) : '77.3'}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Recall</div>
          <div className="text-3xl font-black text-slate-900 font-display mt-1">
            {metrics?.recall ? (metrics.recall * 100).toFixed(1) : '80.4'}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] text-slate-400 font-bold uppercase">F1-Score</div>
          <div className="text-3xl font-black text-slate-900 font-display mt-1">
            {metrics?.f1_score ? (metrics.f1_score * 100).toFixed(1) : '77.3'}%
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison & Dataset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Model Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-700" />
              <span>Multi-Algorithm Comparison</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Cross-Validated</span>
          </div>

          <div className="space-y-3.5">
            {models_comparison && Object.entries(models_comparison).map(([name, m]) => (
              <div key={name} className={`p-4 rounded-xl border transition-all ${name === best_model ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 font-mono">{name}</span>
                    {name === best_model && (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                        Champion
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700">
                    ROC-AUC: {(m.roc_auc * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${name === best_model ? 'bg-blue-600' : 'bg-slate-400'}`}
                    style={{ width: `${m.roc_auc * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono font-bold">
                  <span>Acc: {(m.accuracy * 100).toFixed(1)}%</span>
                  <span>Prec: {(m.precision * 100).toFixed(1)}%</span>
                  <span>Rec: {(m.recall * 100).toFixed(1)}%</span>
                  <span>F1: {(m.f1_score * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-700" />
              <span>Training Dataset Distribution</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-bold">
              {dataset_summary?.total_rows?.toLocaleString() || '66,368'} Total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Acquisitions</div>
              <div className="text-2xl font-black text-emerald-700 font-display mt-0.5">
                {dataset_summary?.acquired_count?.toLocaleString() || '5,549'}
              </div>
              <div className="text-[10px] text-emerald-700 mt-1 font-medium">Successful M&A exits</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="text-[10px] font-bold text-blue-800 uppercase">Public IPOs</div>
              <div className="text-2xl font-black text-blue-700 font-display mt-0.5">
                {dataset_summary?.ipo_count?.toLocaleString() || '1,547'}
              </div>
              <div className="text-[10px] text-blue-700 mt-1 font-medium">Public listing exits</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-600 uppercase">Active / Operating</div>
              <div className="text-2xl font-black text-slate-800 font-display mt-0.5">
                {dataset_summary?.operating_count?.toLocaleString() || '53,034'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">Ongoing operations</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
              <div className="text-[10px] font-bold text-rose-800 uppercase">Closed / Dissolved</div>
              <div className="text-2xl font-black text-rose-700 font-display mt-0.5">
                {dataset_summary?.closed_count?.toLocaleString() || '6,238'}
              </div>
              <div className="text-[10px] text-rose-700 mt-1 font-medium">Discontinued startups</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-slate-700" />
              <span>Full training source code in Jupyter:</span>
            </div>
            <code className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
              startup_model_training.ipynb
            </code>
          </div>
        </div>

      </div>

      {/* Feature Importance */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-700" />
            <span>Top Feature Importances (Weight in Decision Tree)</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">Gini Split Weight</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {top_features && top_features.slice(0, 10).map((feat, idx) => {
            const cleanName = feat.feature
              .replace('num__', '')
              .replace('cat__', '')
              .replace('_clean', '')
              .replace('_usd', ' ($USD)')
              .replace('_', ' ');

            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 capitalize truncate">{cleanName}</span>
                  <span className="font-mono text-blue-700 font-black">{(feat.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, feat.importance * 300)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ModelInsights;
