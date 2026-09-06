import React from 'react';
import { 
  Rocket, 
  LogIn, 
  LogOut, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Matching Reference Mockup */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentTab('predict')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl tracking-tight text-slate-950 font-display">
                  StartupPulse
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  VENTURE AI
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                INSTITUTIONAL VENTURE INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Center Navigation Pills Matching Reference Mockup */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1.5 rounded-full border border-slate-200/90">
            <button
              onClick={() => setCurrentTab('predict')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentTab === 'predict'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Predictor Studio
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <span>Venture Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('insights')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentTab === 'insights'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Model Metrics
            </button>
          </div>

          {/* Right Section Matching Reference Mockup */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Benchmark Pill */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-slate-600">Benchmark ROC-AUC:</span>
              <span className="font-extrabold text-blue-600 font-mono text-[11px]">83.1%</span>
            </div>

            {/* Sign In Link */}
            {user ? (
              <div className="flex items-center space-x-2 bg-slate-100 p-1.5 pl-3 rounded-full border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-800">{user.username}</span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors px-2 py-1"
              >
                <LogIn className="w-4 h-4 text-slate-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Evaluate Venture Button Matching Reference Mockup */}
            <button
              onClick={() => {
                setCurrentTab('predict');
                const el = document.getElementById('prediction-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center space-x-1"
            >
              <span>EVALUATE VENTURE</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
