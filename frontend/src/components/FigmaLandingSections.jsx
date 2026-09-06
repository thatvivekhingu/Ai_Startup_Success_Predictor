import React from 'react';
import { 
  BarChart3, 
  Layers, 
  GitFork, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Check, 
  User, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Cpu, 
  Target,
  Quote
} from 'lucide-react';
import { 
  RazorpayLogo, 
  ZerodhaLogo, 
  ZomatoLogo, 
  ZeptoLogo, 
  LenskartLogo, 
  PostmanLogo, 
  MatterEVLogo, 
  PetpoojaLogo,
  BeardoLogo 
} from './StartupLogos';

const FigmaLandingSections = ({ onEvaluateClick, onExploreClick, onStudentHubClick }) => {
  return (
    <div className="space-y-16 sm:space-y-24 font-sans">
      
      {/* 1. Four-Card Metrics Counter Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Benchmark Companies */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center space-x-4 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-black text-slate-950 font-display tracking-tight">
              66,368+
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Benchmark Companies
            </div>
          </div>
        </div>

        {/* Card 2: Model ROC-AUC */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center space-x-4 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-black text-slate-950 font-display tracking-tight">
              83.1%
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Model ROC-AUC
            </div>
          </div>
        </div>

        {/* Card 3: M&A & IPO Exits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center space-x-4 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-black text-slate-950 font-display tracking-tight">
              7,096+
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              M&A & IPO Exits
            </div>
          </div>
        </div>

        {/* Card 4: Active Startups Tracked */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center space-x-4 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-black text-slate-950 font-display tracking-tight">
              53,034
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Active Startups Tracked
            </div>
          </div>
        </div>

      </section>

      {/* 2. Real Indian Unicorns & Startups Ecosystem Strip */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 flex items-center space-x-1.5">
              <span>🇮🇳 PROUDLY BENCHMARKING INDIA'S TOP UNICORNS & STARTUPS</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 font-display tracking-tight mt-0.5">
              Real Market Intelligence From India's Most Iconic Founders
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            118+ Indian Unicorns Indexed
          </span>
        </div>

        {/* Real Brand Logos Showcase */}
        <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 pt-2">
          <RazorpayLogo className="hover:scale-105 transition-transform" />
          <ZerodhaLogo className="hover:scale-105 transition-transform" />
          <ZomatoLogo className="hover:scale-105 transition-transform" />
          <ZeptoLogo className="hover:scale-105 transition-transform" />
          <LenskartLogo className="hover:scale-105 transition-transform" />
          <PostmanLogo className="hover:scale-105 transition-transform" />
          <MatterEVLogo className="hover:scale-105 transition-transform" />
          <PetpoojaLogo className="hover:scale-105 transition-transform" />
        </div>
      </section>

      {/* 3. Global VC Investors Row */}
      <section className="py-5 border-y border-slate-200/80 bg-slate-50/60 rounded-2xl px-6">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left mb-3">
          INSTITUTIONAL VENTURE PORTFOLIO DATA FROM
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 lg:gap-8">
          
          <div className="flex items-center space-x-1.5 font-black text-base tracking-tight text-orange-600">
            <span className="w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded flex items-center justify-center">Y</span>
            <span className="text-slate-900 font-sans font-bold">Combinator</span>
          </div>

          <div className="text-sm font-extrabold tracking-widest text-slate-800 uppercase font-serif">
            SEQUOIA ⎸⎹
          </div>

          <div className="text-lg font-black tracking-tight text-slate-900 font-mono">
            a16z
          </div>

          <div className="text-base font-extrabold tracking-tight text-slate-800">
            techstars<span className="text-blue-600">_</span>
          </div>

          <div className="text-sm font-black tracking-widest text-slate-900">
            ACCEL
          </div>

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-l-2 border-slate-300 pl-4 py-0.5 hidden xl:block">
            Trained on 66,000+ Global & Indian Startup Exits
          </div>

        </div>
      </section>

      {/* 3. Mid Section: Actionable Intelligence for every stage */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="text-[11px] font-bold tracking-widest text-blue-700 uppercase">
            TURN DATA INTO CLARITY
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-950 tracking-tight leading-[1.12] font-display">
            Actionable intelligence <br />
            for every stage of your <br />
            <span className="text-blue-600">startup journey.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
            Whether you're a founder, investor, or academic researcher, StartupPulse helps you validate ideas, benchmark performance, and make confident decisions—powered by real market data and advanced AI models.
          </p>

          <div>
            <button
              onClick={onExploreClick || onEvaluateClick}
              className="px-6 py-3.5 bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center space-x-2 shadow-md active:scale-95 transition-all group"
            >
              <span>Explore the Platform</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Realistic Laptop / Preview Mockup */}
        <div className="lg:col-span-6 relative">
          <div className="relative mx-auto bg-slate-900 rounded-t-2xl p-2.5 pb-0 shadow-2xl border-4 border-slate-800 max-w-lg">
            {/* Screen Notch/Camera */}
            <div className="w-2 h-2 rounded-full bg-slate-700 mx-auto mb-2"></div>
            
            {/* Screen Inner Glass */}
            <div className="bg-slate-950 rounded-t-lg overflow-hidden border border-slate-700 p-3 text-white space-y-2.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-blue-400">StartupPulse Core Studio</span>
                <span className="text-emerald-400 font-mono">Live Sync Active</span>
              </div>
              
              {/* Mini dashboard graph simulation inside laptop */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[9px]">Success Rate</div>
                  <div className="text-emerald-400 font-bold text-sm font-mono">83.1%</div>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[9px]">Est. Valuation</div>
                  <div className="text-purple-400 font-bold text-sm font-mono">$32.5M</div>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[9px]">Risk Level</div>
                  <div className="text-amber-400 font-bold text-sm font-mono">Moderate</div>
                </div>
              </div>

              {/* Mini Bar Chart */}
              <div className="h-20 bg-slate-900/60 rounded-lg p-2 flex items-end justify-between space-x-1 border border-slate-800/80">
                <div className="w-full bg-blue-500/40 rounded-t-xs h-8"></div>
                <div className="w-full bg-blue-500/60 rounded-t-xs h-12"></div>
                <div className="w-full bg-blue-500/70 rounded-t-xs h-10"></div>
                <div className="w-full bg-blue-500/80 rounded-t-xs h-14"></div>
                <div className="w-full bg-blue-400 rounded-t-xs h-16"></div>
              </div>
            </div>
            
            {/* Laptop Base */}
            <div className="h-3 bg-slate-700 rounded-b-xl -mx-4 shadow-lg flex items-center justify-center">
              <div className="w-16 h-1 bg-slate-500 rounded-full"></div>
            </div>
          </div>

          {/* Cursive Annotations */}
          <div className="absolute -top-4 -right-2 sm:right-2 text-right hidden sm:block">
            <span className="font-serif italic text-sm text-slate-700 font-semibold bg-white/90 px-3 py-1 rounded-full shadow-xs border border-slate-200">
              Ideas validated. Futures accelerated.
            </span>
          </div>

          <div className="absolute -bottom-6 -left-2 text-left hidden sm:block">
            <span className="font-serif italic text-xs text-slate-600 bg-white/90 px-3 py-1 rounded-full shadow-xs border border-slate-200">
              Better Startups. Brighter Tomorrow.
            </span>
          </div>

        </div>

      </section>

      {/* 4. How StartupPulse works (4-step stepper) */}
      <section className="space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-[11px] font-bold tracking-widest text-blue-700 uppercase">
            SIMPLE. POWERFUL. EFFECTIVE.
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
            How StartupPulse works
          </h2>
          <p className="text-sm text-slate-500">
            From data to decision in just a few steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-base font-bold text-slate-950">
              1. Input
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter a startup, idea, or browse from our global database.
            </p>
            {/* Arrow on desktop */}
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors z-10">
              →
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-base font-bold text-slate-950">
              2. Analyze
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our AI models evaluate 100+ financial, team, market and risk signals.
            </p>
            {/* Arrow on desktop */}
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors z-10">
              →
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-base font-bold text-slate-950">
              3. Discover
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get valuation estimates, success probability, and key insights.
            </p>
            {/* Arrow on desktop */}
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors z-10">
              →
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-base font-bold text-slate-950">
              4. Take Action
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Make informed decisions or export reports to share with your team.
            </p>
          </div>

        </div>

      </section>

      {/* 5. Use Cases (3 Cards) */}
      <section className="space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-[11px] font-bold tracking-widest text-blue-700 uppercase">
            BUILT FOR A WIDE RANGE OF USERS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
            Use cases
          </h2>
          <p className="text-sm text-slate-500">
            One platform, multiple possibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* For Founders */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="text-lg font-bold text-slate-950">
                For Founders
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Validate your idea</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Check funding readiness</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Benchmark with competitors</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={onEvaluateClick}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center space-x-1 pt-2 self-start"
            >
              <span>Learn more</span>
              <span>→</span>
            </button>
          </div>

          {/* For Investors */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-lg font-bold text-slate-950">
                For Investors
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Identify high-potential startups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Assess risk & market fit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Access real-time market trends</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={onExploreClick || onEvaluateClick}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1 pt-2 self-start"
            >
              <span>Learn more</span>
              <span>→</span>
            </button>
          </div>

          {/* For Educational Institutions & Students */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-lg font-bold text-slate-950">
                For Educational Institutions
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Analyze startup ecosystems</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Support research & policy making</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Empower student innovators</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={onStudentHubClick || onEvaluateClick}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 pt-2 self-start"
            >
              <span>Learn more</span>
              <span>→</span>
            </button>
          </div>

        </div>

      </section>

      {/* 6. Real Indian Startup Innovator Testimonials */}
      <section className="space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-[11px] font-bold tracking-widest text-blue-700 uppercase">
            LEARNING FROM INDIA'S TOP FOUNDERS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
            Built on insights from India's iconic founders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            Real original benchmarks, leadership principles, and architectural unit economics from founders who built India's multi-billion dollar enterprises.
          </p>
        </div>

        {/* Row 1: Top 4 Unicorn Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Founder 1: Nithin Kamath (Zerodha) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Focusing on real unit economics, zero debt, and positive operating cash flow from Day 1 is what created India's most profitable bootstrapped unicorn."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/nithin_kamath.jpg" 
                  alt="Nithin Kamath - Founder Zerodha" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Nithin Kamath</div>
                  <div className="text-[10px] text-slate-500">Founder & CEO, Zerodha</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                $2B+ Bootstrapped
              </span>
            </div>
          </div>

          {/* Founder 2: Harshil Mathur (Razorpay) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Building frictionless financial infrastructure for Indian founders requires obsessing over 99.99% payment success rates and deep compliance."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/harshil_mathur.jpg" 
                  alt="Harshil Mathur - CEO Razorpay" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#0284C7] shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Harshil Mathur</div>
                  <div className="text-[10px] text-slate-500">CEO & Co-founder, Razorpay</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold border border-blue-200">
                $7.5B Decacorn
              </span>
            </div>
          </div>

          {/* Founder 3: Deepinder Goyal (Zomato) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-red-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "High-velocity execution, micro-market data analytics, and customer repeat order frequency turned food delivery into a $22B+ public market leader."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/deepinder_goyal.jpg" 
                  alt="Deepinder Goyal - Founder Zomato" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Deepinder Goyal</div>
                  <div className="text-[10px] text-slate-500">Founder & CEO, Zomato</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-bold border border-red-200">
                NSE/BSE Listed
              </span>
            </div>
          </div>

          {/* Founder 4: Aadit Palicha (Zepto) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Dark store density modeling, supply chain algorithms, and tracking contribution margins per delivery order powered our rapid path to unicorn scale."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/aadit_palicha.jpg" 
                  alt="Aadit Palicha - CEO Zepto" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Aadit Palicha</div>
                  <div className="text-[10px] text-slate-500">Co-Founder & CEO, Zepto</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[9px] font-bold border border-purple-200">
                $5.0B Unicorn
              </span>
            </div>
          </div>

        </div>

        {/* Row 2: Additional Iconic Founders (Peyush Bansal, Kunal Shah, Ritesh Agarwal, Shashank Kumar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Founder 5: Peyush Bansal (Lenskart) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Full vertical integration—from automated manufacturing robotics to omnichannel retail—turned an unorganized optical sector into a $5B global brand."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/peyush_bansal.jpg" 
                  alt="Peyush Bansal - Founder Lenskart" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Peyush Bansal</div>
                  <div className="text-[10px] text-slate-500">Founder & CEO, Lenskart</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-200">
                $5.0B Omnichannel
              </span>
            </div>
          </div>

          {/* Founder 6: Kunal Shah (CRED) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Creating high-trust walled gardens for India's most creditworthy consumers unlocks exponential monetization across fintech, lending, and luxury commerce."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/kunal_shah.jpg" 
                  alt="Kunal Shah - Founder CRED" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-800 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Kunal Shah</div>
                  <div className="text-[10px] text-slate-500">Founder, CRED & FreeCharge</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[9px] font-bold border border-slate-300">
                $6.4B Ecosystem
              </span>
            </div>
          </div>

          {/* Founder 7: Ritesh Agarwal (OYO) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-red-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Standardizing budget hospitality using proprietary revenue management tech gave millions of travelers predictability while ensuring asset partner profitability."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/ritesh_agarwal.jpg" 
                  alt="Ritesh Agarwal - Founder OYO" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Ritesh Agarwal</div>
                  <div className="text-[10px] text-slate-500">Founder & CEO, OYO Rooms</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-bold border border-red-200">
                Global Network
              </span>
            </div>
          </div>

          {/* Founder 8: Shashank Kumar (Razorpay) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-md transition-all group">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Engineering robust developer APIs with zero downtime transforms complex banking rails into simple code lines that power India's digital economy."
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/shashank_kumar.jpg" 
                  alt="Shashank Kumar - MD Razorpay" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Shashank Kumar</div>
                  <div className="text-[10px] text-slate-500">Co-Founder & MD, Razorpay</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold border border-blue-200">
                Fintech Pioneer
              </span>
            </div>
          </div>

        </div>

        {/* Real Indian Startup Headquarters & Innovation Hubs Showcase */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>ON-THE-GROUND ECOSYSTEM REALITY</span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-950 font-display tracking-tight mt-0.5">
                Real Headquarters, Engineering Hubs & National Startup Ecosystem
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Verified Original Imagery • India Tech Ecosystem
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Hub 1: Razorpay Bengaluru Engineering Lab */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs group hover:shadow-md hover:border-blue-400 transition-all">
              <div className="h-44 overflow-hidden relative">
                <img 
                  src="/razorpay_office.jpg" 
                  alt="Razorpay Bengaluru Office & Engineering Team" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                  Razorpay • Bengaluru Hub
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">Razorpay R&D & Engineering Hub</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Inside Razorpay's Adugodi Bengaluru facility, where teams engineer payment gateway APIs, automated reconciliation, and neobanking infrastructure.
                </div>
              </div>
            </div>

            {/* Hub 2: Zomato & Blinkit Global Headquarters */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs group hover:shadow-md hover:border-red-400 transition-all">
              <div className="h-44 overflow-hidden relative">
                <img 
                  src="/zomato_headquarters.jpg" 
                  alt="Zomato & Blinkit Eternal Headquarters Gurugram" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                  Zomato / Blinkit • Gurugram
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">Eternal Headquarters (Zomato / Blinkit)</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  The central headquarters powering 300,000+ daily restaurant orders and hyper-local dark store dispatch across 800+ Indian cities.
                </div>
              </div>
            </div>

            {/* Hub 3: National Startup Day & DPIIT Recognition */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs group hover:shadow-md hover:border-emerald-400 transition-all">
              <div className="h-44 overflow-hidden relative">
                <img 
                  src="/national_startup_day.jpg" 
                  alt="National Startup Day & Indian Unicorn Founders" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                  National Startup Day • Startup India
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">National Startup Day with Unicorn Leaders</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Indian founders including Ritesh Agarwal (OYO) and Aman Gupta (boAt) celebrating the 10-year milestone of Startup India and DPIIT initiatives.
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 7. Bottom CTA Mesh Banner: Evaluate a startup today */}
      <section className="relative overflow-hidden rounded-3xl bg-[#070E1E] text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        
        {/* Subtle mesh wave lines */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            THE NEXT BIG IDEA COULD BE YOURS
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display">
            Evaluate a startup today.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Get AI-powered insights, benchmark against real market data, and take the next step with confidence.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={onEvaluateClick}
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center space-x-2 shadow-lg active:scale-95 transition-all group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onStudentHubClick}
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center space-x-2 border border-slate-700 active:scale-95 transition-all"
            >
              <span>Explore Student Hub</span>
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};

export default FigmaLandingSections;
