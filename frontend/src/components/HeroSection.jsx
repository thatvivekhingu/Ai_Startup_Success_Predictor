import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  Database, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  DollarSign, 
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const HeroSection = ({ onStartClick, onWatchDemo }) => {
  const [activeMetric, setActiveMetric] = useState('success');
  const [demoPlaying, setDemoPlaying] = useState(false);

  const handleDemoClick = () => {
    setDemoPlaying(true);
    if (onWatchDemo) onWatchDemo();
  };

  return (
    <div className="relative pt-2 pb-10 overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Grid: Left Copy & Right Live Interactive Dashboard Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center space-x-2">
            <span className="text-[11px] font-bold tracking-widest text-blue-700 uppercase bg-blue-50/80 px-3 py-1 rounded-md border border-blue-200/80">
              INSTITUTIONAL VENTURE INTELLIGENCE
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-950 tracking-tight leading-[1.08] font-display">
            Smarter decisions <br />
            for a brighter <br />
            <span className="text-blue-600">startup future.</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
            AI-powered venture intelligence to predict success, assess risk, and benchmark startups using real market data from <strong className="text-slate-900 font-semibold">66,000+ global companies</strong>.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartClick}
              id="hero-evaluate-btn"
              className="px-6 py-3.5 bg-slate-950 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center space-x-2.5 shadow-md hover:shadow-lg transition-all active:scale-95 group"
            >
              <span>Evaluate a Startup</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleDemoClick}
              className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl flex items-center space-x-2 border border-slate-200 shadow-xs hover:border-slate-300 transition-all active:scale-95"
            >
              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Play className="w-3 h-3 fill-blue-600" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* 3 Trust Indicators */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Data-Driven Insights</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Trusted by Institutions</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Built for Founders & Students</span>
            </div>
          </div>

        </div>

        {/* Right Column: Exact Figma Interactive Dashboard Mockup Card */}
        <div className="lg:col-span-6 relative">
          
          {/* Subtle glowing ambient behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl -z-10" />

          {/* Main Dashboard Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-5 space-y-4 relative">
            
            {/* Top Bar: Search & User */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="flex items-end space-x-1">
                  <div className="w-1.5 h-3 bg-blue-400 rounded-xs"></div>
                  <div className="w-1.5 h-4.5 bg-blue-600 rounded-xs"></div>
                  <div className="w-1.5 h-6 bg-blue-800 rounded-xs"></div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">StartupPulse</span>
              </div>

              <div className="flex-1 max-w-xs relative hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  readOnly 
                  value="Search any startup, sector, or keyword..." 
                  className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded-lg text-slate-400 focus:outline-none cursor-pointer"
                  onClick={onStartClick}
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  JD
                </div>
              </div>
            </div>

            {/* Inner Content: Left micro nav + Right analytics panel */}
            <div className="grid grid-cols-12 gap-3.5 items-start">
              
              {/* Micro Left Sidebar (Hidden on very small screens) */}
              <div className="hidden sm:block col-span-3 space-y-1 text-[11px] font-semibold text-slate-500 pr-2 border-r border-slate-100">
                <div className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  <span>Dashboard</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">Predictions</div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">Compare</div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">Market Data</div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">Reports</div>
                <div className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">Saved</div>

                <div className="pt-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] text-center font-bold shadow-xs">
                    ⚡ Pro Model
                  </div>
                </div>
              </div>

              {/* Main Analytics Panel */}
              <div className="col-span-12 sm:col-span-9 space-y-3.5">
                
                {/* Indian Startup Outlook Chart Header */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Indian Unicorn Benchmark Outlook</div>
                      <div className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className="text-emerald-600 font-extrabold">+28.4%</span>
                        <span className="text-slate-500 font-medium text-xs">Annual Growth in Indian Tech Exits</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      118+ Indian Unicorns
                    </span>
                  </div>

                  {/* Micro SVG Growth Wave Line Chart */}
                  <div className="h-14 w-full relative">
                    <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path 
                        d="M 0,48 Q 40,42 75,34 T 150,26 T 225,16 T 300,6 L 300,60 L 0,60 Z" 
                        fill="url(#heroGradient)" 
                      />
                      {/* Trend Line */}
                      <path 
                        d="M 0,48 Q 40,42 75,34 T 150,26 T 225,16 T 300,6" 
                        fill="none" 
                        stroke="#2563EB" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />
                      {/* Peak Point */}
                      <circle cx="300" cy="6" r="3.5" fill="#2563EB" className="animate-ping" opacity="0.75" />
                      <circle cx="300" cy="6" r="3.5" fill="#1D4ED8" />
                    </svg>

                    {/* Mini bar indicators on bottom right */}
                    <div className="absolute right-1 bottom-1 flex items-end space-x-1">
                      <div className="w-1.5 h-3 bg-blue-300 rounded-t-xs"></div>
                      <div className="w-1.5 h-5 bg-blue-400 rounded-t-xs"></div>
                      <div className="w-1.5 h-7 bg-blue-500 rounded-t-xs"></div>
                      <div className="w-1.5 h-9 bg-blue-600 rounded-t-xs"></div>
                    </div>
                  </div>
                </div>

                {/* 3 Metric Pills Row: Real Indian Benchmark Data */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  
                  {/* Success Probability: Zerodha / Bootstrapped Model */}
                  <div 
                    onClick={() => setActiveMetric('success')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${activeMetric === 'success' ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zerodha Model</span>
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1">91.4%</div>
                    <div className="text-[9px] text-emerald-700 font-semibold">Profitable from Day 1</div>
                  </div>

                  {/* Estimated Valuation: Zepto / Unicorn Scale */}
                  <div 
                    onClick={() => setActiveMetric('valuation')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${activeMetric === 'valuation' ? 'bg-purple-50/70 border-purple-300 shadow-xs' : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                      <span>Zepto Benchmark</span>
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1">$5.0B</div>
                    <div className="text-[9px] text-purple-700 font-semibold">Series E Hyper-Scale</div>
                  </div>

                  {/* Risk Assessment: Capital Efficient */}
                  <div 
                    onClick={() => setActiveMetric('risk')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${activeMetric === 'risk' ? 'bg-blue-50/70 border-blue-300 shadow-xs' : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>Runway Health</span>
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1">Ultra-Low Risk</div>
                    <div className="text-[9px] text-blue-700 font-semibold">Zero Vanity Debt</div>
                  </div>

                </div>

                {/* Bottom Row: Key Insights Checklist + 84% Radial Readiness Meter */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  
                  {/* Key Insights Checklist (Col 8) */}
                  <div className="sm:col-span-8 space-y-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-[11px]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Indian Unicorn Blueprint Insights</div>
                    
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">Positive unit economics & disciplined operating margin</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">100% DPIIT recognized & Section 80-IAC tax compliant</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">Gujarat STI ₹1,000Cr Fund & SSIP 2.0 institutional backing</span>
                    </div>
                  </div>

                  {/* 84% Funding Readiness Gauge (Col 4) */}
                  <div className="sm:col-span-4 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-600"
                          strokeDasharray="84, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-black text-slate-900 font-mono">84%</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-700 mt-1">Capital Readiness</div>
                  </div>

                </div>

              </div>
            </div>

            {/* Floating pill badge on bottom right */}
            <div className="absolute -bottom-4 right-6 sm:right-10 bg-slate-950 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full shadow-xl border border-slate-800 flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">🇮🇳</span>
              <span>Real Indian Unicorn Benchmark Data</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroSection;
