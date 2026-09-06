import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const FigmaFooter = ({ onNavigateTab }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="border-t border-slate-200/90 bg-white pt-16 pb-12 font-sans text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Brand & Mission (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              {/* 3 Blue Vertical Bars Logo */}
              <div className="flex items-end space-x-1">
                <div className="w-1.5 h-3.5 bg-blue-400 rounded-xs"></div>
                <div className="w-1.5 h-5 bg-blue-600 rounded-xs"></div>
                <div className="w-1.5 h-7 bg-blue-800 rounded-xs"></div>
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-950 font-display tracking-tight leading-none block">
                  StartupPulse
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                  From Data to Decisions
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Empowering a more informed, innovative, and inclusive startup ecosystems through data and AI.
            </p>

            <div className="text-[11px] text-slate-400 font-medium pt-2">
              Trained on 66,000+ Venture Milestones • Powered by Scikit-learn & FastAPI
            </div>
          </div>

          {/* Links Column 1: Product (Col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('predict')} 
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Predictor Studio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('dashboard')} 
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Venture Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('insights')} 
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Model Metrics
                </button>
              </li>
              <li>
                <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  API Access (Docs)
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Solutions (Col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Solutions
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('predict')} 
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  For Founders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('dashboard')} 
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  For Investors
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('student-hub')} 
                  className="hover:text-blue-600 transition-colors text-left font-semibold text-blue-600 flex items-center space-x-1"
                >
                  <span>For Students (PRO)</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded">SSIP</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('insights')} 
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  For Institutions
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Resources (Col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Resources
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.startupindia.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Startup India Portal
                </a>
              </li>
              <li>
                <a href="https://www.nsws.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  NSWS Approvals
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('student-hub')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  SSIP 2.0 Grants Guide
                </button>
              </li>
              <li>
                <a href="https://www.digitalindia.gov.in/initiative/meitys-startup-hub/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  MeitY Hub
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box (Col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Stay updated
            </div>
            
            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>Subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full text-xs pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2 rounded-lg bg-slate-950 text-white hover:bg-blue-600 flex items-center justify-center transition-colors text-xs"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 text-slate-400">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors" aria-label="X">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-950 transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Tagline */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 StartupPulse. All rights reserved.
          </div>
          <div className="font-semibold text-slate-500">
            Better Data. Brighter Startups.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FigmaFooter;
