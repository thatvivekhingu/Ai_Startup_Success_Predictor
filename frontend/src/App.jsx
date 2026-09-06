import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FigmaLandingSections from './components/FigmaLandingSections';
import FigmaFooter from './components/FigmaFooter';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Dashboard from './components/Dashboard';
import ModelInsights from './components/ModelInsights';
import StudentProHub from './components/StudentProHub';
import FundingDealsPage from './components/FundingDealsPage';
import LoginPage from './components/LoginPage';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import { predictionAPI } from './api';

function App() {
  const [currentTab, setCurrentTab] = useState('predict');
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await predictionAPI.getPresets();
        setServerStatus(true);
      } catch (err) {
        console.warn('Backend check warning:', err);
        setServerStatus(false);
      }
    };
    checkServer();
  }, []);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictionAPI.predict(formData);
      setPredictionResult(res.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Prediction failed:', err);
      setError(err.response?.data?.detail || 'Prediction failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistorical = async (id) => {
    try {
      const res = await predictionAPI.getById(id);
      setPredictionResult({
        ...res.data,
        feature_contributions: [
          { name: "Funding Capital (USD)", value: `$${Number(res.data.funding_total_usd).toLocaleString()}`, impact: res.data.funding_total_usd > 1500000 ? "Positive" : "Neutral" },
          { name: "Funding Rounds", value: String(res.data.funding_rounds), impact: res.data.funding_rounds >= 2 ? "Positive" : "Neutral" },
          { name: "Sector Dynamics", value: res.data.primary_category, impact: "Moderate" },
          { name: "Geographic Market", value: res.data.country_code, impact: "Positive" },
          { name: "Outcome Classification", value: res.data.status_tier.split(' ')[0], impact: "Positive" }
        ]
      });
      setCurrentTab('predict');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load historical record:', err);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('prediction-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar matching Figma specs */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'predict') setPredictionResult(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        serverStatus={serverStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-16">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex justify-between items-center shadow-xs">
            <span className="font-semibold">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-bold underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Views */}
        {currentTab === 'predict' && (
          <div className="space-y-16">
            
            {predictionResult ? (
              <PredictionResult
                result={predictionResult}
                onNewPrediction={() => setPredictionResult(null)}
              />
            ) : (
              <>
                {/* 1. Hero Section with Live Interactive Floating Dashboard */}
                <HeroSection 
                  onStartClick={scrollToForm} 
                  onWatchDemo={scrollToForm} 
                />

                {/* 2. Figma Landing Sections (Metrics Strip, Logos, Mid-Section, Steps, Use Cases, Testimonials, Bottom CTA) */}
                <FigmaLandingSections
                  onEvaluateClick={scrollToForm}
                  onExploreClick={scrollToForm}
                  onStudentHubClick={() => {
                    setCurrentTab('student-hub');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* 3. Predictor Studio Live Form Section */}
                <div id="prediction-form-section" className="pt-8 space-y-8">
                  <div className="text-center max-w-3xl mx-auto space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-700">
                      Interactive Venture Evaluation Studio
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                      Benchmark your venture. <br />
                      <span className="text-blue-600">
                        Discover funding readiness & risk factors.
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
                      Select a startup benchmark archetype (e.g. Zepto, Zerodha, Early-Stage AI) or customize metrics to generate instant success probability, valuation readiness, and risk analysis.
                    </p>
                  </div>

                  {/* Figma Student Pro Hub Callout Banner */}
                  <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5 text-center sm:text-left">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 text-xl">
                        🎓
                      </div>
                      <div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-xs font-black uppercase tracking-wider text-white">
                            Student Innovator PRO Studio
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[9px] font-bold text-indigo-200 uppercase tracking-widest">
                            SSIP 2.0 • TRL 1-9 • DPIIT
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          1-Click ₹2.5 Lakhs SSIP 2.0 grant drafter, Campus-to-Market TRL calculator, and Startup India 80-IAC tax exemption benefits.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab('student-hub');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-indigo-50 font-bold text-xs shrink-0 transition-all shadow-md active:scale-95 flex items-center space-x-1"
                    >
                      <span>Launch Student Hub</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Interactive Prediction Form */}
                  <PredictionForm
                    onPredict={handlePredict}
                    loading={loading}
                  />
                </div>
              </>
            )}

          </div>
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            onSelectPrediction={handleSelectHistorical}
          />
        )}

        {currentTab === 'insights' && (
          <ModelInsights />
        )}

        {currentTab === 'student-hub' && (
          <StudentProHub />
        )}

        {currentTab === 'funding' && (
          <FundingDealsPage
            onSelectStartupForPrediction={() => {
              setCurrentTab('predict');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onNavigateHome={() => setCurrentTab('predict')}
          />
        )}

      </main>

      {/* Exact Figma 4-Column Footer */}
      <FigmaFooter
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export default App;
