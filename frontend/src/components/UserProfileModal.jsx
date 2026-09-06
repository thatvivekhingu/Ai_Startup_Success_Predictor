import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  FileText, 
  Sparkles, 
  Check, 
  Award, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfileModal = ({ isOpen, onClose, onNavigateTab }) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Student Innovator');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    updateProfile({ role: newRole });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getProviderBadge = () => {
    if (user.provider === 'google') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
          <svg className="w-3 h-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Google Verified</span>
        </span>
      );
    }
    if (user.provider === 'microsoft') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
          <div className="grid grid-cols-2 gap-0.5 w-2.5 h-2.5">
            <div className="bg-[#F25022]"></div>
            <div className="bg-[#7FBA00]"></div>
            <div className="bg-[#00A4EF]"></div>
            <div className="bg-[#FFB900]"></div>
          </div>
          <span>Microsoft Verified</span>
        </span>
      );
    }
    if (user.provider === 'github') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-bold">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span>GitHub Developer</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
        <span>Email Verified</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header with gradient banner */}
        <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 p-4 flex items-start justify-between">
          <div className="flex items-center space-x-2 text-white/90 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>StartupPulse Verified Member Profile</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-8 pb-8 -mt-12 space-y-6">
          
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name || user.username}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg bg-slate-100"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-slate-950 font-display">
                    {user.name || user.username}
                  </h3>
                  {getProviderBadge()}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* User Institution / Affiliation Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center space-x-3 text-xs text-slate-700">
            <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-slate-900">Institution & Ecosystem</div>
              <div className="text-[11px] text-slate-500">{user.institution || 'Gujarat Technological University (GTU)'}</div>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
              SSIP 2.0 Eligible
            </span>
          </div>

          {/* 3 Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-xs text-slate-400 font-bold uppercase">Evaluations</div>
              <div className="text-xl font-black text-slate-950 font-display mt-0.5">
                {user.evaluationsCount || 12}
              </div>
              <div className="text-[10px] text-slate-500">Runway checks</div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 text-center">
              <div className="text-xs text-indigo-500 font-bold uppercase">SSIP Proposals</div>
              <div className="text-xl font-black text-indigo-950 font-display mt-0.5">
                {user.grantsCount || 2}
              </div>
              <div className="text-[10px] text-indigo-600">Drafts created</div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-center">
              <div className="text-xs text-emerald-600 font-bold uppercase">Tech Readiness</div>
              <div className="text-xl font-black text-emerald-950 font-display mt-0.5">
                TRL 5
              </div>
              <div className="text-[10px] text-emerald-700">Component validated</div>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Persona / Role
              </label>
              {isSaved && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Student Innovator', label: '🎓 Student Innovator', sub: 'SSIP 2.0 Grants' },
                { id: 'Startup Founder', label: '🚀 Startup Founder', sub: 'Valuation & Pitch' },
                { id: 'Angel / VC Investor', label: '💼 Venture Investor', sub: 'Due Diligence' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedRole === r.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] text-slate-400">{r.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Indian Founder Avatar Selector */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>🇮🇳 Benchmark Founder Avatar</span>
              <span className="text-[10px] text-blue-600 font-medium">Click to select photo</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { name: 'Harshil Mathur', company: 'Razorpay', img: '/harshil_mathur.jpg' },
                { name: 'Nithin Kamath', company: 'Zerodha', img: '/nithin_kamath.jpg' },
                { name: 'Deepinder Goyal', company: 'Zomato', img: '/deepinder_goyal.jpg' },
                { name: 'Aadit Palicha', company: 'Zepto', img: '/aadit_palicha.jpg' },
                { name: 'Peyush Bansal', company: 'Lenskart', img: '/peyush_bansal.jpg' },
                { name: 'Kunal Shah', company: 'CRED', img: '/kunal_shah.jpg' },
                { name: 'Ritesh Agarwal', company: 'OYO', img: '/ritesh_agarwal.jpg' },
              ].map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => {
                    updateProfile({ avatar: f.img });
                    setIsSaved(true);
                    setTimeout(() => setIsSaved(false), 2000);
                  }}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border shrink-0 text-left transition-all ${
                    user.avatar === f.img 
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img 
                    src={f.img} 
                    alt={f.name} 
                    className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                  />
                  <div className="text-[10px]">
                    <div className="font-bold text-slate-900 leading-tight">{f.name.split(' ')[0]}</div>
                    <div className="text-slate-400 text-[9px]">{f.company}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigateTab('student-hub');
                onClose();
              }}
              className="w-full p-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl border border-indigo-200/80 flex items-center justify-between text-xs font-bold text-indigo-950 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-base">🎓</span>
                <span>Open Student Innovator PRO Studio (SSIP 2.0 & TRL Meter)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-500" />
            </button>

            <button
              onClick={() => {
                onNavigateTab('predict');
                onClose();
              }}
              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-base">⚡</span>
                <span>Run New Startup Valuation & Success Forecast</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;
