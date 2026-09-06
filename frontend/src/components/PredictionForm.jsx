import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  Layers, 
  Globe2, 
  Calendar, 
  Users, 
  Award, 
  FileCheck, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { predictionAPI } from '../api';
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

const DEFAULT_FORM = {
  startup_name: 'Zerodha Broking (Bootstrapped FinTech)',
  primary_category: 'Finance',
  country_code: 'IND',
  funding_total_usd: 100000,
  funding_rounds: 1,
  founded_year: 2010,
  first_funding_year: 2011,
  last_funding_year: 2011,
  team_size: 120,
  has_accelerator: false,
  patent_count: 2,
  is_gujarat_based: false,
  gujarat_district: 'Ahmedabad'
};

const GUJARAT_DISTRICTS = [
  'Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Kutch', 'Other'
];

const CATEGORIES = [
  'Finance', 'E-Commerce', 'Software', 'Clean Technology', 'Biotechnology', 
  'Mobile', 'Enterprise', 'Curated Web', 'Health Care', 'Games', 'Advertising', 'Analytics', 
  'Hardware', 'Education', 'Social Media', 'Semiconductors', 'Security', 'Manufacturing', 
  'Hospitality', 'Real Estate', 'Other'
];

const COUNTRIES = [
  { code: 'IND', label: 'India (IND) 🇮🇳' },
  { code: 'USA', label: 'United States (USA)' },
  { code: 'GBR', label: 'United Kingdom (GBR)' },
  { code: 'CAN', label: 'Canada (CAN)' },
  { code: 'DEU', label: 'Germany (DEU)' },
  { code: 'FRA', label: 'France (FRA)' },
  { code: 'ISR', label: 'Israel (ISR)' },
  { code: 'CHN', label: 'China (CHN)' },
  { code: 'ESP', label: 'Spain (ESP)' },
  { code: 'AUS', label: 'Australia (AUS)' },
  { code: 'Other', label: 'Other Regions' }
];

const FUNDING_SHORTCUTS = [
  { label: '₹2.5L / $30K (SSIP Student Grant)', val: 30000 },
  { label: '₹2 Cr / $250K (Pre-Seed)', val: 250000 },
  { label: '₹12 Cr / $1.5M (Seed)', val: 1500000 },
  { label: '₹50 Cr / $6M (Series A)', val: 6000000 },
  { label: '₹165 Cr / $20M (Series B)', val: 20000000 },
  { label: '₹500 Cr+ / $60M+ (Growth/Unicorn)', val: 60000000 }
];

const PredictionForm = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState('zerodha-bootstrapped');

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const res = await predictionAPI.getPresets();
        setPresets(res.data);
      } catch (err) {
        console.error('Failed to load presets:', err);
      }
    };
    fetchPresets();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setActivePreset(null);
  };

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setFormData({
      startup_name: preset.name.split(' – ')[0],
      primary_category: preset.primary_category,
      country_code: preset.country_code,
      funding_total_usd: preset.funding_total_usd,
      funding_rounds: preset.funding_rounds,
      founded_year: preset.founded_year,
      first_funding_year: preset.first_funding_year,
      last_funding_year: preset.last_funding_year,
      team_size: preset.team_size,
      has_accelerator: preset.has_accelerator,
      patent_count: preset.patent_count,
      is_gujarat_based: Boolean(preset.is_gujarat_based),
      gujarat_district: preset.gujarat_district || 'Ahmedabad'
    });
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM);
    setActivePreset(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  const renderStartupMiniLogo = (id) => {
    switch (id) {
      case 'zerodha-bootstrapped':
        return <ZerodhaLogo className="h-4" />;
      case 'zepto-quickcommerce':
        return <ZeptoLogo className="h-4" />;
      case 'razorpay-payments':
        return <RazorpayLogo className="h-4" />;
      case 'zomato-foodtech':
        return <ZomatoLogo className="h-4" />;
      case 'lenskart-omnichannel':
        return <LenskartLogo className="h-4" />;
      case 'postman-saas':
        return <PostmanLogo className="h-4" />;
      case 'matter-motor-works':
        return <MatterEVLogo className="h-4" />;
      case 'petpooja-saas':
        return <PetpoojaLogo className="h-4" />;
      case 'beardo-d2c':
        return <BeardoLogo className="h-4" />;
      default:
        return null;
    }
  };

  return (
    <div id="prediction-form-section" className="space-y-6">
      
      {/* Archetype Presets Bar: Real Indian Startup Success Cases */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center space-x-1.5">
              <span>🇮🇳 Real Indian Startup Success Benchmarks</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Live Data</span>
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Click any verified Indian Unicorn / Gujarat success to auto-populate metrics
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                activePreset === p.id
                  ? 'bg-blue-50/90 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500'
                  : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="h-6 flex items-center">
                  {renderStartupMiniLogo(p.id) || (
                    <span className="text-xs font-bold truncate text-slate-950">{p.name.split(' – ')[0]}</span>
                  )}
                </div>
                {p.is_gujarat_based ? (
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold shrink-0">Gujarat</span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold shrink-0">Unicorn</span>
                )}
              </div>
              <div>
                <div className="text-[11px] text-blue-700 font-bold truncate">
                  {p.valuation || (p.funding_total_usd > 1e6 ? `$${(p.funding_total_usd/1e6).toFixed(0)}M Funded` : `$${p.funding_total_usd.toLocaleString()} Funded`)}
                </div>
                {p.founder && (
                  <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                    Founder: {p.founder}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Card in Professional Corporate Theme */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
        
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
              Quantitative Evaluation Engine
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Startup Evaluation Parameters
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Startup Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Startup / Venture Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.startup_name}
                onChange={(e) => handleChange('startup_name', e.target.value)}
                placeholder="e.g. Acme AI Systems"
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Industry Vertical */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Primary Industry Vertical
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={formData.primary_category}
                onChange={(e) => handleChange('primary_category', e.target.value)}
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold focus:bg-white transition-all"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Country / Market */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Headquarters / Primary Market
            </label>
            <div className="relative">
              <Globe2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={formData.country_code}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange('country_code', val);
                  if (val !== 'IND') {
                    handleChange('is_gujarat_based', false);
                  }
                }}
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold focus:bg-white transition-all"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Gujarat Innovation Track Toggle Card */}
          <div className="md:col-span-2 p-4 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-blue-50/40 to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
                    Gujarat Startup Innovation Track
                  </span>
                  <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                    STI Policy 2026–31
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Activate district-level incubator matchmaking (iCreate, GUSEC, PDEU) & ₹1,000 Cr State Innovation Fund evaluation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextState = !formData.is_gujarat_based;
                handleChange('is_gujarat_based', nextState);
                if (nextState) {
                  handleChange('country_code', 'IND');
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 shrink-0 ${
                formData.is_gujarat_based
                  ? 'bg-indigo-600 text-white shadow-indigo-200'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{formData.is_gujarat_based ? '✓ Gujarat Track Active' : 'Activate Gujarat Track'}</span>
            </button>
          </div>

          {/* Conditional District Dropdown if Gujarat Track is Active */}
          {formData.is_gujarat_based && (
            <div className="md:col-span-2 p-4 rounded-xl bg-indigo-50/40 border border-indigo-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1.5 uppercase tracking-wider">
                  Gujarat District Innovation Hub
                </label>
                <select
                  value={formData.gujarat_district}
                  onChange={(e) => handleChange('gujarat_district', e.target.value)}
                  className="w-full bg-white border border-indigo-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500"
                >
                  {GUJARAT_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist} District Hub</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-center text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-indigo-100">
                <span className="font-bold text-indigo-700">Matched Policy Schemes:</span>
                <span>• Gujarat STI Policy 2026–31 (₹1,000 Cr DeepTech Fund)</span>
                <span>• SSIP 2.0 / i-Hub Incubation Support / Dholera Semicon Corridor</span>
              </div>
            </div>
          )}

          {/* Total Funding Raised */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Total Capital Raised (USD)
              </label>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                ${Number(formData.funding_total_usd).toLocaleString()} USD
              </span>
            </div>
            
            <div className="relative mb-2.5">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="0"
                step="50000"
                required
                value={formData.funding_total_usd}
                onChange={(e) => handleChange('funding_total_usd', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-mono font-bold focus:bg-white transition-all"
              />
            </div>

            {/* Funding Shortcuts */}
            <div className="flex flex-wrap gap-1.5">
              {FUNDING_SHORTCUTS.map(sc => (
                <button
                  key={sc.label}
                  type="button"
                  onClick={() => handleChange('funding_total_usd', sc.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    formData.funding_total_usd === sc.val
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Funding Rounds */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Funding Rounds
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {formData.funding_rounds} Round{formData.funding_rounds > 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.funding_rounds}
              onChange={(e) => handleChange('funding_rounds', parseInt(e.target.value))}
              className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>1 (Seed)</span>
              <span>3 (Series B)</span>
              <span>5+ (Late)</span>
            </div>
          </div>

          {/* Team Size */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Core Team Size
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {formData.team_size} Members
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="150"
              value={formData.team_size}
              onChange={(e) => handleChange('team_size', parseInt(e.target.value))}
              className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>1-2 Founders</span>
              <span>15 Core</span>
              <span>100+ Scale</span>
            </div>
          </div>

          {/* Founded Year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Founded Year
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="2000"
                max="2026"
                value={formData.founded_year}
                onChange={(e) => handleChange('founded_year', parseInt(e.target.value))}
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold focus:bg-white"
              />
            </div>
          </div>

          {/* First & Last Funding Years */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                First Funding
              </label>
              <input
                type="number"
                min="2000"
                max="2026"
                value={formData.first_funding_year}
                onChange={(e) => handleChange('first_funding_year', parseInt(e.target.value))}
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Latest Funding
              </label>
              <input
                type="number"
                min="2000"
                max="2026"
                value={formData.last_funding_year}
                onChange={(e) => handleChange('last_funding_year', parseInt(e.target.value))}
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold focus:bg-white"
              />
            </div>
          </div>

          {/* Auxiliary Qualifiers */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            
            {/* Accelerator Toggle */}
            <div 
              onClick={() => handleChange('has_accelerator', !formData.has_accelerator)}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                formData.has_accelerator 
                  ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Award className={`w-5 h-5 ${formData.has_accelerator ? 'text-blue-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Top Accelerator Backing</div>
                  <div className="text-[11px] text-slate-500">YC, Techstars, 500 Global</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${formData.has_accelerator ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                {formData.has_accelerator && <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" />}
              </div>
            </div>

            {/* Patent / IP Moat */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileCheck className="w-5 h-5 text-slate-700" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Patents / IP Moat</div>
                  <div className="text-[11px] text-slate-500">Filed or granted patents</div>
                </div>
              </div>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.patent_count}
                onChange={(e) => handleChange('patent_count', parseInt(e.target.value) || 0)}
                className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

          </div>

        </div>

        {/* Corporate Navy / Blue Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Valuation & Trajectory...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Evaluate Startup Trajectory & Risk Profile</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default PredictionForm;
