import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  BarChart, 
  ArrowLeft
} from 'lucide-react';

const PredictionResult = ({ result, onNewPrediction }) => {
  if (!result) return null;

  const {
    startup_name,
    primary_category,
    country_code,
    funding_total_usd,
    funding_rounds,
    success_probability,
    confidence_score,
    status_tier,
    strengths,
    risk_factors,
    recommendations,
    feature_contributions
  } = result;

  useEffect(() => {
    if (success_probability >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [success_probability]);

  const isHigh = success_probability >= 70;
  const isMedium = success_probability >= 45 && success_probability < 70;
  
  const scoreBadge = isHigh 
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
    : isMedium 
      ? 'text-amber-700 bg-amber-50 border-amber-200' 
      : 'text-rose-700 bg-rose-50 border-rose-200';

  const strokeColor = isHigh ? '#10B981' : isMedium ? '#F59E0B' : '#EF4444';

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (success_probability / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Info */}
          <div className="text-center lg:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {primary_category}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {country_code} Market
              </span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold border ${scoreBadge}`}>
                {status_tier}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              {startup_name}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Capital Evaluated: <span className="font-bold text-slate-800">${Number(funding_total_usd).toLocaleString()} USD</span> across <span className="font-bold text-slate-800">{funding_rounds} round{funding_rounds > 1 ? 's' : ''}</span>
            </p>
          </div>

          {/* Radial Score Gauge */}
          <div className="flex items-center space-x-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke={strokeColor}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 font-display">{success_probability}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Success</span>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Confidence Score</div>
                <div className="text-base font-extrabold text-blue-700 font-mono">{confidence_score}%</div>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Algorithm</div>
                <div className="text-xs font-bold text-slate-800">GradientBoosting ML</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Feature Contributions */}
      {feature_contributions && feature_contributions.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
            <BarChart className="w-4 h-4 text-blue-600" />
            <span>Valuation Driver Breakdown</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {feature_contributions.map((fc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium truncate">{fc.name}</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5 truncate">{fc.value}</div>
                <div className="mt-1 flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${fc.impact === 'Positive' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span className="text-[10px] text-slate-600 font-bold">{fc.impact} Driver</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider">Competitive Strengths</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-800">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider">Identified Risk Factors</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {risk_factors.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-rose-50/60 p-3 rounded-lg border border-rose-100">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-blue-900">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider">Strategic Recommendations for Founders</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-800 flex items-start space-x-3">
              <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                {idx + 1}
              </span>
              <span className="font-medium leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Back CTA */}
      <div className="pt-2 flex justify-between items-center">
        <button
          onClick={onNewPrediction}
          className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Evaluate Another Venture</span>
        </button>
        <span className="text-xs text-slate-400">
          Evaluation saved to portfolio ledger
        </span>
      </div>

    </div>
  );
};

export default PredictionResult;
