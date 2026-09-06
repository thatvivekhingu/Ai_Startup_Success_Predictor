import React from 'react';
import { ArrowRight, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';
import StartupOrbit from './StartupOrbit';

const HeroSection = ({ onStartClick }) => {
  return (
    <div className="space-y-12">
      
      {/* Main Hero Section with Startup Orbit */}
      <div className="relative pt-4 pb-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold tracking-wider">
              <Shield className="w-3.5 h-3.5 text-blue-600 fill-blue-600/20" />
              <span className="uppercase">INSTITUTIONAL VENTURE INTELLIGENCE & ML</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-950 tracking-tight leading-[1.12] font-display">
              Venture evaluation <br />
              <span className="text-blue-600">
                powered by market <br />data
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed font-normal">
              Forecast startup success probability, valuation readiness, and capital runway across 66,000+ benchmarked technology companies before presenting to institutional VCs.
            </p>

            {/* Action CTA Button */}
            <div className="pt-1">
              <button
                onClick={onStartClick}
                className="px-7 py-3.5 bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xl flex items-center space-x-2.5 shadow-md active:scale-95 group"
              >
                <span>RUN VALUATION PREDICTOR</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Bottom Metrics */}
            <div className="pt-6 flex items-start space-x-10 border-t border-slate-200/90">
              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  TOTAL BENCHMARKS
                </div>
                <div className="text-3xl font-black text-slate-950 font-display mt-0.5">
                  66 368
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Global venture records
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  VALIDATION METRIC
                </div>
                <div className="text-3xl font-black text-slate-950 font-display mt-0.5 flex items-baseline space-x-1">
                  <span className="text-blue-600 font-mono">83.1%</span>
                  <span className="text-xs font-bold text-slate-400 font-sans ml-1">ROC-AUC</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Cross-validated accuracy
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Animated Startup Orbit (No laptop image!) */}
          <div className="lg:col-span-6 relative flex items-center justify-center p-2">
            <StartupOrbit />
          </div>

        </div>
      </div>

      {/* VC Partners Row */}
      <div className="py-6 border-y border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-6 opacity-85 hover:opacity-100 transition-all">
          <div className="flex items-center space-x-1 font-black text-lg tracking-tight text-orange-600">
            <span className="w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded flex items-center justify-center">Y</span>
            <span className="text-slate-900 ml-1">Combinator</span>
          </div>
          <span className="text-base font-extrabold tracking-widest text-slate-800 uppercase font-serif">SEQUOIA ⎸⎹</span>
          <span className="text-base font-black tracking-tight text-slate-900 font-mono">a16z</span>
          <div className="text-base font-extrabold tracking-tight text-slate-800">
            techstars<span className="text-blue-600">_</span>
          </div>
          <span className="text-base font-black tracking-widest text-slate-900">ACCEL</span>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider border-l-2 border-slate-300 pl-4">
            Trained on Venture Data From <br />Top Institutional Portfolios
          </div>
        </div>
      </div>

      {/* Corporate Boardroom Showcase Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
            <img 
              src="/startup-team.jpg" 
              alt="Founders Reviewing Valuation in Corporate Boardroom" 
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Full-Stack Venture Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Actionable predictive modeling for founders and institutional syndicates
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Eliminate guesswork before term-sheet negotiations. Our Gradient Boosting algorithm analyzes 7 fundamental signals—including time between financing rounds, capital intensity, founder team capacity, and patent defensibility—to benchmark your startup trajectory against thousands of realized exits.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500">Benchmark Exits</div>
                <div className="text-lg font-black text-slate-900 font-display mt-0.5">7,096+</div>
                <div className="text-[10px] text-slate-500 font-medium">M&A & IPO events</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500">Active Startups</div>
                <div className="text-lg font-black text-slate-900 font-display mt-0.5">53,034</div>
                <div className="text-[10px] text-slate-500 font-medium">Companies tracked</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500">Runway Target</div>
                <div className="text-lg font-black text-emerald-700 font-display mt-0.5">18-24 Mo</div>
                <div className="text-[10px] text-slate-500 font-medium">Median runway</div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default HeroSection;
