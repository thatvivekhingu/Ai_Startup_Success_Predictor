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

const DEFAULT_FORM = {
  startup_name: 'NexusAI Solutions',
  primary_category: 'Software',
  country_code: 'USA',
  funding_total_usd: 8500000,
  funding_rounds: 2,
  founded_year: 2022,
  first_funding_year: 2023,
  last_funding_year: 2024,
  team_size: 14,
  has_accelerator: true,
  patent_count: 1
};

const CATEGORIES = [
  'Software', 'Biotechnology', 'E-Commerce', 'Mobile', 'Enterprise', 
  'Curated Web', 'Health Care', 'Games', 'Advertising', 'Analytics', 
  'Hardware', 'Clean Technology', 'Finance', 'Education', 'Social Media',
  'Semiconductors', 'Security', 'Manufacturing', 'Hospitality', 'Real Estate', 'Other'
];

const COUNTRIES = [
  { code: 'USA', label: 'United States (USA)' },
  { code: 'GBR', label: 'United Kingdom (GBR)' },
  { code: 'CAN', label: 'Canada (CAN)' },
  { code: 'CHN', label: 'China (CHN)' },
  { code: 'IND', label: 'India (IND)' },
  { code: 'DEU', label: 'Germany (DEU)' },
  { code: 'FRA', label: 'France (FRA)' },
  { code: 'ISR', label: 'Israel (ISR)' },
  { code: 'ESP', label: 'Spain (ESP)' },
  { code: 'AUS', label: 'Australia (AUS)' },
  { code: 'Other', label: 'Other Regions' }
];

const FUNDING_SHORTCUTS = [
  { label: '$250K (Pre-Seed)', val: 250000 },
  { label: '$1.5M (Seed)', val: 1500000 },
  { label: '$6M (Series A)', val: 6000000 },
  { label: '$20M (Series B)', val: 20000000 },
  { label: '$60M+ (Growth)', val: 60000000 }
];

const PredictionForm = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState(null);

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
      startup_name: preset.name,
      primary_category: preset.primary_category,
      country_code: preset.country_code,
      funding_total_usd: preset.funding_total_usd,
      funding_rounds: preset.funding_rounds,
      founded_year: preset.founded_year,
      first_funding_year: preset.first_funding_year,
      last_funding_year: preset.last_funding_year,
      team_size: preset.team_size,
      has_accelerator: preset.has_accelerator,
      patent_count: preset.patent_count
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

  return (
    <div id="prediction-form-section" className="space-y-6">
      
      {/* Archetype Presets Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
              1-Click Benchmark Archetypes
            </span>
          </div>
          <span className="text-xs text-slate-500">Auto-fill startup operational metrics</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`text-left p-3 rounded-xl border transition-all ${
                activePreset === p.id
                  ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-white'
              }`}
            >
              <div className="text-xs font-bold truncate">{p.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono font-medium">
                ${(p.funding_total_usd / 1e6).toFixed(1)}M • {p.primary_category}
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
                onChange={(e) => handleChange('country_code', e.target.value)}
                className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold focus:bg-white transition-all"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

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
