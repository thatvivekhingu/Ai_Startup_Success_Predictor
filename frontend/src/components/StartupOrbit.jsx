import React from 'react';
import { 
  Rocket, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  Award, 
  Sparkles, 
  BarChart2, 
  Zap,
  Target
} from 'lucide-react';

const StartupOrbit = () => {
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center select-none overflow-visible font-samsung">
      
      {/* Background Glows */}
      <div className="absolute inset-0 rounded-full bg-radial from-blue-500/10 via-indigo-500/5 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

      {/* SVG Concentric Orbit Guides */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 560 560">
        {/* Orbit Ring 1 (Inner) */}
        <circle 
          cx="280" 
          cy="280" 
          r="135" 
          fill="none" 
          stroke="#CBD5E1" 
          strokeWidth="1.5" 
          strokeDasharray="4 6" 
          className="opacity-70"
        />
        {/* Orbit Ring 2 (Middle) */}
        <circle 
          cx="280" 
          cy="280" 
          r="190" 
          fill="none" 
          stroke="#94A3B8" 
          strokeWidth="1.5" 
          strokeDasharray="6 8" 
          className="opacity-60"
        />
        {/* Orbit Ring 3 (Outer) */}
        <circle 
          cx="280" 
          cy="280" 
          r="245" 
          fill="none" 
          stroke="#CBD5E1" 
          strokeWidth="1.5" 
          strokeDasharray="8 10" 
          className="opacity-50"
        />
      </svg>

      {/* ======================================================== */}
      {/* Orbit 3 (Outer Ring - 490px diameter) */}
      {/* ======================================================== */}
      <div className="absolute w-[490px] h-[490px] rounded-full animate-orbit-outer pointer-events-none">
        
        {/* Node A (Top) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="animate-counter-rotate-outer">
            <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-md hover:border-blue-500 hover:scale-105 transition-all cursor-default group">
              <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <Award className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-slate-800 font-samsung tracking-tight">YC / Tier-1 VC</span>
            </div>
          </div>
        </div>

        {/* Node B (Bottom Right) */}
        <div className="absolute bottom-16 right-6 pointer-events-auto">
          <div className="animate-counter-rotate-outer">
            <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-md hover:border-emerald-500 hover:scale-105 transition-all cursor-default">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-emerald-800 font-samsung tracking-tight">+24% MoM Velocity</span>
            </div>
          </div>
        </div>

        {/* Node C (Bottom Left) */}
        <div className="absolute bottom-16 left-6 pointer-events-auto">
          <div className="animate-counter-rotate-outer">
            <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-md hover:border-blue-500 hover:scale-105 transition-all cursor-default">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-slate-800 font-samsung tracking-tight">Runway • 24 Mo</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* Orbit 2 (Middle Ring - 380px diameter) */}
      {/* ======================================================== */}
      <div className="absolute w-[380px] h-[380px] rounded-full animate-orbit-reverse pointer-events-none">
        
        {/* Node D (Right) */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="animate-counter-rotate-reverse">
            <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-md hover:border-emerald-500 hover:scale-105 transition-all cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-emerald-700 font-samsung tracking-tight">91.4% Exit Prob</span>
            </div>
          </div>
        </div>

        {/* Node E (Left) */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="animate-counter-rotate-reverse">
            <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-md hover:border-blue-500 hover:scale-105 transition-all cursor-default">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <DollarSign className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-slate-800 font-samsung tracking-tight">MRR • $420K</span>
            </div>
          </div>
        </div>

        {/* Node F (Top Center-Left) */}
        <div className="absolute top-4 left-1/4 pointer-events-auto">
          <div className="animate-counter-rotate-reverse">
            <div className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/90 shadow-sm hover:border-slate-400 hover:scale-105 transition-all cursor-default">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-700 font-samsung tracking-tight">IP Moat Protected</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* Orbit 1 (Inner Ring - 270px diameter) */}
      {/* ======================================================== */}
      <div className="absolute w-[270px] h-[270px] rounded-full animate-orbit-slow pointer-events-none">
        
        {/* Node G (Top) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="animate-counter-rotate">
            <div className="flex items-center space-x-1.5 bg-blue-50/95 border border-blue-200 px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-900 font-samsung tracking-tight">Series A • $15M</span>
            </div>
          </div>
        </div>

        {/* Node H (Bottom) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto">
          <div className="animate-counter-rotate">
            <div className="flex items-center space-x-1.5 bg-emerald-50/95 border border-emerald-200 px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-emerald-900 font-samsung tracking-tight">Retention • 88%</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* Central Core: StartupPulse AI Valuation Core (Command Center) */}
      {/* ======================================================== */}
      <div className="relative z-10 w-52 h-52 sm:w-56 sm:h-56 rounded-full p-1 bg-gradient-to-br from-blue-400/30 via-white to-blue-600/40 shadow-[0_15px_45px_rgba(37,99,235,0.30)] border-4 border-white ring-4 ring-blue-500/20 group cursor-pointer hover:scale-105 transition-all duration-300">
        <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-slate-950">
          <img 
            src="/orbit-center.png" 
            alt="StartupPulse AI Valuation Core" 
            className="w-full h-full object-cover rounded-full select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle glossy overlay */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* Floating Glassmorphic Stat Cards (Corners - Samsung Style) */}
      {/* ======================================================== */}

      {/* Floating Card Top-Right: Growth Probability */}
      <div className="absolute -top-3 right-0 z-20 animate-float-card hidden sm:block">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 p-3.5 rounded-2xl shadow-xl max-w-[210px]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider font-samsung">
                Top Quartile
              </div>
              <div className="text-xs font-black text-slate-900 font-samsung tracking-tight">
                91.4% Probability
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card Bottom-Left: Valuation Range */}
      <div className="absolute -bottom-4 left-0 z-20 animate-float-delayed hidden sm:block">
        <div className="bg-slate-950 text-white p-3.5 rounded-2xl shadow-2xl max-w-[220px] border border-slate-800">
          <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-samsung">
            Valuation Forecast Range
          </div>
          <div className="text-base font-black text-blue-400 font-samsung tracking-tight mt-0.5">
            $25.0M – $78.2M
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1.5 font-samsung font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Series A Target Benchmark</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StartupOrbit;
