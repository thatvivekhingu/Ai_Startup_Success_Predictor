import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ArrowRight, 
  LogIn, 
  LogOut, 
  Sparkles,
  Rocket,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentTab, setCurrentTab, onOpenAuth, onOpenProfile }) => {
  const { user, logout } = useAuth();
  const [productsOpen, setProductsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Exact Figma Logo with 3 Vertical Blue Bars */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none"
            onClick={() => {
              setCurrentTab('predict');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* 3 Rounded Vertical Gradient Bars */}
            <div className="flex items-end space-x-1 h-8">
              <span className="w-2 h-5 rounded-full bg-blue-500 group-hover:h-6 transition-all duration-300" />
              <span className="w-2 h-8 rounded-full bg-blue-600 group-hover:h-7 transition-all duration-300" />
              <span className="w-2 h-6 rounded-full bg-indigo-600 group-hover:h-8 transition-all duration-300" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-display leading-none">
                StartupPulse
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-tight mt-0.5">
                From Data to Decisions
              </span>
            </div>
          </div>

          {/* Center Navigation Links Matching Figma Mockup */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold text-slate-700">
            
            {/* Products Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setProductsOpen(!productsOpen)}
                className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors py-2"
              >
                <span className={currentTab === 'predict' || currentTab === 'dashboard' ? 'text-blue-600 font-extrabold' : ''}>
                  Products
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 hidden group-hover:block animate-fade-in z-50">
                <button
                  onClick={() => setCurrentTab('predict')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start space-x-3"
                >
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">🎯</span>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Predictor Studio</div>
                    <div className="text-[11px] text-slate-400 font-normal">AI success probability & valuation</div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start space-x-3"
                >
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">📊</span>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Venture Dashboard</div>
                    <div className="text-[11px] text-slate-400 font-normal">Live ledger & Gujarat news pulse</div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentTab('insights')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start space-x-3"
                >
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">⚡</span>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Model Intelligence</div>
                    <div className="text-[11px] text-slate-400 font-normal">ROC-AUC & Top 10 Indian Unicorns</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Solutions Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors py-2"
              >
                <span>Solutions</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 hidden group-hover:block animate-fade-in z-50">
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setCurrentTab('predict')}>
                  <div className="font-bold text-slate-900 text-xs">For Founders</div>
                  <div className="text-[11px] text-slate-400 font-normal">Runway & funding readiness</div>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
                  <div className="font-bold text-slate-900 text-xs">For Investors</div>
                  <div className="text-[11px] text-slate-400 font-normal">Portfolio risk & thesis radar</div>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setCurrentTab('student-hub')}>
                  <div className="font-bold text-slate-900 text-xs">For Educational Institutions</div>
                  <div className="text-[11px] text-slate-400 font-normal">Ecosystem & policy research</div>
                </div>
              </div>
            </div>

            {/* Resources Link */}
            <button 
              onClick={() => setCurrentTab('insights')} 
              className={`hover:text-blue-600 transition-colors ${currentTab === 'insights' ? 'text-blue-600 font-extrabold' : ''}`}
            >
              Resources
            </button>

            {/* For Students Link with PRO Pill Badge */}
            <button
              onClick={() => {
                setCurrentTab('student-hub');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center space-x-1.5 transition-colors ${
                currentTab === 'student-hub' ? 'text-indigo-600 font-extrabold' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              <span>For Students</span>
              <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[9px] font-black uppercase tracking-wider">
                PRO
              </span>
            </button>

            {/* Pricing Link */}
            <button 
              onClick={() => {
                const el = document.getElementById('pricing-cta-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-700 hover:text-blue-600 transition-colors"
            >
              Pricing
            </button>
          </div>

          {/* Right Action Icons & Buttons Matching Figma Mockup */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            
            {/* Search Icon */}
            <button 
              onClick={() => {
                const el = document.getElementById('prediction-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Search Startups" 
              className="p-2 text-slate-400 hover:text-slate-700 transition-colors hidden sm:block"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Sign In Link / User Profile Chip */}
            {user ? (
              <div 
                onClick={onOpenProfile}
                className="flex items-center space-x-2.5 bg-slate-100/90 hover:bg-slate-200/80 py-1.5 px-3 rounded-full border border-slate-200 cursor-pointer transition-all active:scale-95 shadow-xs"
                title="View Profile & Grants"
              >
                <div className="relative">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.username)}`}
                    alt={user.name || user.username}
                    className="w-6 h-6 rounded-full object-cover border border-white"
                  />
                  {user.provider === 'google' && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white"></span>
                  )}
                  {user.provider === 'microsoft' && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
                  )}
                  {user.provider === 'github' && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-slate-900 rounded-full border border-white"></span>
                  )}
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-slate-900">{user.name || user.username}</span>
                  <span className="text-[9px] text-blue-600 font-semibold">{user.role || 'Member'}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors px-2 py-1"
              >
                Sign In
              </button>
            )}

            {/* Exact Figma Dark Pill Button: Get Started -> */}
            {user ? (
              <button
                onClick={() => {
                  setCurrentTab('student-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center space-x-1.5 shrink-0"
              >
                <span>Student Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center space-x-2 shrink-0 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
