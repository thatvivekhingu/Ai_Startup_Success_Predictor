import React, { useState, useEffect } from 'react';
import { 
  Building, 
  TrendingUp, 
  Sparkles, 
  Search, 
  Trash2, 
  DollarSign, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Wifi, 
  Battery, 
  Signal, 
  ChevronRight, 
  ArrowUpRight, 
  Plus, 
  Zap, 
  Award, 
  Clock, 
  BarChart2,
  PieChart as PieIcon,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Globe2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Cell
} from 'recharts';
import { predictionAPI, analyticsAPI } from '../api';

const valuationHistoryData = [
  { label: 'Seed', value: 3.5 },
  { label: 'Q1', value: 6.2 },
  { label: 'Q2', value: 12.0 },
  { label: 'Pre-A', value: 18.5 },
  { label: 'Series A', value: 29.0 },
  { label: 'Q3', value: 38.4 },
  { label: 'Current', value: 48.6 }
];

const sectorSuccessData = [
  { sector: 'Biotech', rate: 74, count: '1.2K', color: '#10B981' },
  { sector: 'Software', rate: 68, count: '3.8K', color: '#3B82F6' },
  { sector: 'Enterprise', rate: 71, count: '2.1K', color: '#6366F1' },
  { sector: 'Mobile', rate: 52, count: '1.9K', color: '#F59E0B' },
  { sector: 'E-Commerce', rate: 42, count: '2.4K', color: '#EC4899' },
];

const Dashboard = ({ onSelectPrediction }) => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ 
    total_predictions: 0, 
    average_success_probability: 0, 
    high_potential_startups: 0 
  });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // UI States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [islandExpanded1, setIslandExpanded1] = useState(false);
  const [islandExpanded2, setIslandExpanded2] = useState(false);
  const [islandExpanded3, setIslandExpanded3] = useState(false);
  const [timeRange, setTimeRange] = useState('1Y');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [histRes, sumRes] = await Promise.all([
        predictionAPI.getHistory(),
        analyticsAPI.getSummary()
      ]);
      setHistory(histRes.data || []);
      setSummary(sumRes.data || { total_predictions: 0, average_success_probability: 0, high_potential_startups: 0 });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this evaluation from portfolio?')) {
      try {
        await predictionAPI.deletePrediction(id);
        setHistory(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.startup_name.toLowerCase().includes(search.toLowerCase()) ||
                          item.primary_category.toLowerCase().includes(search.toLowerCase()) ||
                          item.country_code.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.primary_category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', ...new Set(history.map(h => h.primary_category))];
  const avgProb = summary.average_success_probability || (history.length ? Math.round(history.reduce((a, b) => a + b.success_probability, 0) / history.length) : 83);
  const totalCount = summary.total_predictions || history.length || 12;
  const highTierCount = summary.high_potential_startups || history.filter(h => h.success_probability >= 70).length || 8;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded-xl text-[11px] font-bold shadow-lg border ${isDarkMode ? 'bg-slate-900/95 text-white border-slate-700' : 'bg-white/95 text-slate-900 border-slate-200'}`}>
          <div>Valuation: <span className="text-emerald-500">${payload[0].value}M</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      
      {/* ======================================================== */}
      {/* Header Bar: Executive Suite Title & Controls */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600">
              TRIPLE SCREEN TELEMETRY
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-bold text-slate-400">INSTITUTIONAL PORTFOLIO SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display tracking-tight mt-1">
            Venture Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mt-0.5">
            Three synchronized mobile surfaces delivering full-spectrum financial run-rates, live evaluated venture scoring, and cross-sector risk intelligence.
          </p>
        </div>

        {/* Global Theme Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-all shadow-xs"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Frost Light View</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>OLED Dark View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3 Mobile Devices Side-by-Side Grid (100% Identical Sizing) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 justify-items-center items-start max-w-[1360px] mx-auto">
        
        {/* ======================================================== */}
        {/* SCREEN 1: FINANCIAL RUN-RATE & VALUATION */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center w-full">
          
          {/* Surface Label Badge */}
          <div className="mb-3 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
              DEVICE 01 • CAPITAL & VALUATION
            </span>
          </div>

          {/* Device Chassis (100% Identical Dimensions: 360px x 770px) */}
          <div className="w-[360px] max-w-[92vw] h-[770px] rounded-[52px] p-3.5 bg-gradient-to-b from-[#424447] via-[#242528] to-[#151618] shadow-[0_22px_65px_rgba(0,0,0,0.45)] border border-slate-700/60 relative flex flex-col shrink-0">
            
            {/* Realistic Side Buttons */}
            <div className="absolute -left-[3px] top-24 w-[3px] h-6 bg-slate-600 rounded-l-xs" />
            <div className="absolute -left-[3px] top-34 w-[3px] h-10 bg-slate-600 rounded-l-xs" />
            <div className="absolute -left-[3px] top-48 w-[3px] h-10 bg-slate-600 rounded-l-xs" />
            <div className="absolute -right-[3px] top-36 w-[3px] h-14 bg-slate-600 rounded-r-xs" />

            {/* Inner Glass Display */}
            <div className={`w-full h-full rounded-[44px] border-[4px] border-black overflow-hidden flex flex-col relative transition-colors duration-300 ${
              isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-slate-900'
            }`}>

              {/* Status Bar */}
              <div className="pt-3 px-6 pb-2 flex items-center justify-between select-none">
                <span className="text-[12px] font-bold">9:41</span>
                
                {/* Dynamic Island */}
                <div 
                  onClick={() => setIslandExpanded1(!islandExpanded1)}
                  className={`bg-black text-white rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center border border-white/10 shadow-sm ${
                    islandExpanded1 ? 'w-[190px] h-[34px] px-3 space-x-1.5' : 'w-[100px] h-[25px] px-2.5 space-x-1.5'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {islandExpanded1 ? (
                    <span className="text-[10px] font-bold text-emerald-400">ARR: $14.2M Live</span>
                  ) : (
                    <span className="text-[9px] font-bold tracking-wider uppercase text-slate-300">Run-Rate</span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-xs">
                  <Signal className="w-3 h-3" />
                  <span className="text-[9px] font-extrabold">5G</span>
                  <Battery className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-16">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-blue-500">
                      FINANCIAL TELEMETRY
                    </div>
                    <div className="text-xl font-black font-display tracking-tight mt-0.5">
                      Valuation Curve
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-white border-slate-200 text-blue-600'}`}>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>

                {/* Valuation Chart Card */}
                <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Run-Rate</span>
                      <div className="flex items-baseline space-x-1.5 mt-0.5">
                        <span className="text-2xl font-black font-display">$48.6M</span>
                        <span className="text-[11px] font-bold text-emerald-500 flex items-center">
                          <ArrowUpRight className="w-3 h-3" /> +24.8%
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center p-0.5 rounded-lg text-[9px] font-bold ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      {['1M', '1Y', 'ALL'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setTimeRange(r)}
                          className={`px-1.5 py-0.5 rounded ${timeRange === r ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 shadow-xs') : ''}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-28 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={valuationHistoryData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="valGrad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.45}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.2} fillOpacity={1} fill="url(#valGrad1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2x2 Bento Tiles: Capital Health */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[9px] font-bold uppercase text-slate-400">Total Capital</div>
                    <div className="text-base font-black font-display text-blue-400 mt-0.5">$34.5M</div>
                    <div className="text-[9px] text-slate-400 mt-1 font-medium">3 Funding Rounds</div>
                  </div>

                  <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[9px] font-bold uppercase text-slate-400">Safe Runway</div>
                    <div className="text-base font-black font-display text-emerald-400 mt-0.5">24.2 Mo</div>
                    <div className="text-[9px] text-slate-400 mt-1 font-medium">Safe Zero Cash Date</div>
                  </div>

                  <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[9px] font-bold uppercase text-slate-400">Net Burn Rate</div>
                    <div className="text-base font-black font-display text-amber-400 mt-0.5">$340K/Mo</div>
                    <div className="text-[9px] text-slate-400 mt-1 font-medium">-8% Optimized MoM</div>
                  </div>

                  <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="text-[9px] font-bold uppercase text-slate-400">Capital Multiple</div>
                    <div className="text-base font-black font-display text-indigo-400 mt-0.5">2.8x ARR</div>
                    <div className="text-[9px] text-slate-400 mt-1 font-medium">Top Tier Multiple</div>
                  </div>
                </div>

                {/* Capital Rounds Timeline */}
                <div className={`p-3.5 rounded-2xl border space-y-2.5 ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Funding Tranche Milestones
                  </div>

                  {[
                    { round: 'Series A', amount: '$15.0M', date: 'Oct 2024', status: 'Closed', color: 'text-emerald-400' },
                    { round: 'Seed Round', amount: '$3.5M', date: 'Jan 2023', status: 'Closed', color: 'text-blue-400' },
                    { round: 'Angel Round', amount: '$850K', date: 'Mar 2022', status: 'Closed', color: 'text-slate-400' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-none">
                      <div>
                        <div className="font-bold">{m.round}</div>
                        <div className="text-[10px] text-slate-400">{m.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold ${m.color}`}>{m.amount}</div>
                        <div className="text-[9px] text-slate-400">{m.status}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Dock */}
              <div className="absolute bottom-0 left-0 right-0 z-20 pb-3 pt-1 px-6 flex flex-col items-center bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-md">
                <div className="flex items-center justify-around w-full text-[9px] font-bold text-slate-400 py-1">
                  <span className="text-blue-400 flex items-center space-x-1">
                    <BarChart2 className="w-3.5 h-3.5" /> <span>Capital</span>
                  </span>
                  <span>Ledger</span>
                  <span>Telemetry</span>
                </div>
                <div className="w-28 h-1 bg-white/40 rounded-full mt-1.5" />
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* SCREEN 2: VENTURE PREDICTOR & PORTFOLIO LEDGER (HERO) */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center w-full">
          
          {/* Surface Label Badge */}
          <div className="mb-3 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
              DEVICE 02 • VENTURE INTELLIGENCE
            </span>
          </div>

          {/* Device Chassis (100% Identical Dimensions: 360px x 770px) */}
          <div className="w-[360px] max-w-[92vw] h-[770px] rounded-[52px] p-3.5 bg-gradient-to-b from-[#424447] via-[#242528] to-[#151618] shadow-[0_22px_65px_rgba(0,0,0,0.45)] border border-slate-700/60 relative flex flex-col shrink-0">
            
            {/* Realistic Side Buttons */}
            <div className="absolute -left-[3px] top-24 w-[3px] h-6 bg-slate-600 rounded-l-xs" />
            <div className="absolute -left-[3px] top-34 w-[3px] h-10 bg-slate-600 rounded-l-xs" />
            <div className="absolute -left-[3px] top-48 w-[3px] h-10 bg-slate-600 rounded-l-xs" />
            <div className="absolute -right-[3px] top-36 w-[3px] h-14 bg-slate-600 rounded-r-xs" />

            {/* Inner Glass Display */}
            <div className={`w-full h-full rounded-[44px] border-[4px] border-black overflow-hidden flex flex-col relative transition-colors duration-300 ${
              isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-slate-900'
            }`}>

              {/* Status Bar */}
              <div className="pt-3 px-6 pb-2 flex items-center justify-between select-none">
                <span className="text-[12px] font-bold">9:41</span>
                
                {/* Dynamic Island */}
                <div 
                  onClick={() => setIslandExpanded2(!islandExpanded2)}
                  className={`bg-black text-white rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center border border-white/10 shadow-sm ${
                    islandExpanded2 ? 'w-[190px] h-[34px] px-3 space-x-1.5' : 'w-[100px] h-[25px] px-2.5 space-x-1.5'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {islandExpanded2 ? (
                    <span className="text-[10px] font-bold text-emerald-400">AI Core: 83.1% AUC</span>
                  ) : (
                    <span className="text-[9px] font-bold tracking-wider uppercase text-slate-300">Pulse AI</span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-xs">
                  <Signal className="w-3 h-3" />
                  <span className="text-[9px] font-extrabold">5G</span>
                  <Battery className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-16">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-blue-500">
                      LIVE BENCHMARKS
                    </div>
                    <div className="text-xl font-black font-display tracking-tight mt-0.5">
                      Portfolio Ledger
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-white border-slate-200 text-emerald-600'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {/* Circular Activity Gauge Card */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className={isDarkMode ? 'text-slate-800' : 'text-slate-100'} fill="transparent" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        stroke="#10B981" 
                        strokeWidth="6" 
                        strokeDasharray={201} 
                        strokeDashoffset={201 * (1 - avgProb / 100)} 
                        strokeLinecap="round" 
                        fill="transparent" 
                      />
                    </svg>
                    <span className="absolute text-base font-black font-display">{avgProb}%</span>
                  </div>

                  <div className="pl-3 flex-1">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 inline-block mb-1">
                      Unicorn Tier
                    </span>
                    <div className="text-xs font-black leading-tight">Average Exit Potential</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {highTierCount} of {totalCount} ventures qualify for Tier-1 VC syndicate backing.
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'Predict', icon: Plus, color: 'bg-blue-600 text-white' },
                    { label: 'Fast Scan', icon: Zap, color: isDarkMode ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'bg-amber-50 text-amber-600' },
                    { label: 'Tier-1 VC', icon: Award, color: isDarkMode ? 'bg-slate-900 text-emerald-400 border border-slate-800' : 'bg-emerald-50 text-emerald-600' },
                    { label: 'Horizon', icon: Clock, color: isDarkMode ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'bg-indigo-50 text-indigo-600' },
                  ].map((btn, i) => (
                    <button key={i} className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[9px] font-bold ${btn.color} active:scale-95 transition-transform`}>
                      <btn.icon className="w-3.5 h-3.5 mb-1 stroke-[2.2]" />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search & Sector Filters */}
                <div className="space-y-1.5">
                  <div className={`flex items-center px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}>
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="text"
                      placeholder="Filter by startup, sector, country..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent text-[11px] font-medium focus:outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 no-scrollbar">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategoryFilter(c)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                          categoryFilter === c 
                            ? 'bg-blue-600 text-white' 
                            : isDarkMode ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evaluated Startups Cards List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>Evaluated Ventures ({filteredHistory.length})</span>
                    <span className="text-blue-400 lowercase font-medium">tap to inspect</span>
                  </div>

                  {loading ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading portfolio...
                    </div>
                  ) : filteredHistory.length === 0 ? (
                    <div className={`py-6 text-center rounded-2xl border text-xs text-slate-400 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                      No evaluations match query.
                    </div>
                  ) : (
                    filteredHistory.slice(0, 5).map((item) => {
                      const isHigh = item.success_probability >= 70;
                      const isMed = item.success_probability >= 45 && item.success_probability < 70;

                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectPrediction && onSelectPrediction(item.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group active:scale-98 ${
                            isDarkMode ? 'bg-slate-950/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60' : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                              isHigh ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : isMed ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            }`}>
                              {item.startup_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs truncate group-hover:text-blue-400 transition-colors">
                                {item.startup_name}
                              </div>
                              <div className="flex items-center space-x-1 text-[9px] text-slate-400">
                                <span className="truncate">{item.primary_category}</span>
                                <span>•</span>
                                <span className="font-mono font-bold">{item.country_code}</span>
                                <span>•</span>
                                <span>${(item.funding_total_usd / 1000000).toFixed(1)}M</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <div className="text-right">
                              <div className={`text-xs font-black font-display ${isHigh ? 'text-emerald-400' : isMed ? 'text-amber-400' : 'text-rose-400'}`}>
                                {item.success_probability}%
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              title="Delete"
                              className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

              {/* Bottom Dock */}
              <div className="absolute bottom-0 left-0 right-0 z-20 pb-3 pt-1 px-6 flex flex-col items-center bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-md">
                <div className="flex items-center justify-around w-full text-[9px] font-bold text-slate-400 py-1">
                  <span>Holdings</span>
                  <span className="text-blue-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" /> <span>Ledger</span>
                  </span>
                  <span>Predict</span>
                </div>
                <div className="w-28 h-1 bg-white/40 rounded-full mt-1.5" />
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* SCREEN 3: RISK ANALYTICS & SECTOR RADAR */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center w-full">
          
          {/* Surface Label Badge */}
          <div className="mb-3 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
              DEVICE 03 • RISK & SECTOR RADAR
            </span>
          </div>

          {/* Device Chassis (100% Identical Dimensions: 360px x 770px) */}
          <div className="w-[360px] max-w-[92vw] h-[770px] rounded-[52px] p-3.5 bg-gradient-to-b from-[#424447] via-[#242528] to-[#151618] shadow-[0_22px_65px_rgba(0,0,0,0.45)] border border-slate-700/60 relative flex flex-col shrink-0">
            
            {/* Realistic Side Buttons */}
            <div className="absolute -left-[3px] top-24 w-[3px] h-6 bg-slate-600 rounded-l-xs" />
            <div className="absolute -left-[3px] top-34 w-[3px] h-10 bg-slate-600 rounded-l-xs" />
            <div className="absolute -left-[3px] top-48 w-[3px] h-10 bg-slate-600 rounded-l-xs" />
            <div className="absolute -right-[3px] top-36 w-[3px] h-14 bg-slate-600 rounded-r-xs" />

            {/* Inner Glass Display */}
            <div className={`w-full h-full rounded-[44px] border-[4px] border-black overflow-hidden flex flex-col relative transition-colors duration-300 ${
              isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-slate-900'
            }`}>

              {/* Status Bar */}
              <div className="pt-3 px-6 pb-2 flex items-center justify-between select-none">
                <span className="text-[12px] font-bold">9:41</span>
                
                {/* Dynamic Island */}
                <div 
                  onClick={() => setIslandExpanded3(!islandExpanded3)}
                  className={`bg-black text-white rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center border border-white/10 shadow-sm ${
                    islandExpanded3 ? 'w-[190px] h-[34px] px-3 space-x-1.5' : 'w-[100px] h-[25px] px-2.5 space-x-1.5'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {islandExpanded3 ? (
                    <span className="text-[10px] font-bold text-emerald-400">Risk Radar: Safe</span>
                  ) : (
                    <span className="text-[9px] font-bold tracking-wider uppercase text-slate-300">Radar</span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-xs">
                  <Signal className="w-3 h-3" />
                  <span className="text-[9px] font-extrabold">5G</span>
                  <Battery className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-16">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500">
                      SECTOR INTELLIGENCE
                    </div>
                    <div className="text-xl font-black font-display tracking-tight mt-0.5">
                      Risk Radar & Moats
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-amber-600'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Sector Exit Success Rates Bar Chart */}
                <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Historical Exit Rate by Sector
                  </div>

                  <div className="space-y-2">
                    {sectorSuccessData.map((s) => (
                      <div key={s.sector} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-300">{s.sector}</span>
                          <span className="font-mono font-bold" style={{ color: s.color }}>{s.rate}%</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${s.rate}%`, backgroundColor: s.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Venture Risk Diagnostic Checklist */}
                <div className={`p-3.5 rounded-2xl border space-y-2 ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Venture Health Checks
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { title: 'Market Timing Fit', score: '92%', status: 'Optimal', ok: true },
                      { title: 'Syndicate Strength', score: 'Tier-1', status: 'Backing', ok: true },
                      { title: 'Runway Buffer', score: '24 Mo', status: 'Safe', ok: true },
                      { title: 'Moat Defensibility', score: 'Moderate', status: 'Watch', ok: false },
                    ].map((chk, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-none">
                        <div className="flex items-center space-x-1.5">
                          {chk.ok ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span className="font-medium text-slate-300">{chk.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          chk.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {chk.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Notification Card */}
                <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-gradient-to-r from-blue-950/40 to-slate-950 border-blue-900/40' : 'bg-blue-50/70 border-blue-200'}`}>
                  <div className="flex items-center space-x-2 text-[10px] font-extrabold uppercase text-blue-400 mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Syndicate Advisory</span>
                  </div>
                  <div className="text-xs font-bold leading-tight">
                    Series A Liquidity Window Open
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Software and Biotechnology portfolios display +18% higher exit multiples under current market conditions.
                  </div>
                </div>

              </div>

              {/* Bottom Dock */}
              <div className="absolute bottom-0 left-0 right-0 z-20 pb-3 pt-1 px-6 flex flex-col items-center bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-md">
                <div className="flex items-center justify-around w-full text-[9px] font-bold text-slate-400 py-1">
                  <span>Overview</span>
                  <span>Checklist</span>
                  <span className="text-amber-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> <span>Risk Radar</span>
                  </span>
                </div>
                <div className="w-28 h-1 bg-white/40 rounded-full mt-1.5" />
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
