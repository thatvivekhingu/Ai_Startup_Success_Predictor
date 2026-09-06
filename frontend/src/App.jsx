import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Dashboard from './components/Dashboard';
import ModelInsights from './components/ModelInsights';
import AuthModal from './components/AuthModal';
import { predictionAPI } from './api';

function App() {
  const [currentTab, setCurrentTab] = useState('predict');
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
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
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'predict') setPredictionResult(null);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        serverStatus={serverStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
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
          <div className="space-y-12">
            
            {predictionResult ? (
              <PredictionResult
                result={predictionResult}
                onNewPrediction={() => setPredictionResult(null)}
              />
            ) : (
              <>
                {/* Hero Section */}
                <HeroSection onStartClick={scrollToForm} />

                {/* Sub-headline Section */}
                <div className="text-center max-w-3xl mx-auto pt-4 space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-700">
                    Startup Valuation & Success Forecaster
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                    Benchmark your venture. <br />
                    <span className="text-blue-600">
                      Discover funding readiness & risk factors.
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
                    Select a startup benchmark archetype below or customize your financial and operational metrics to receive instant valuation readiness, runway health, and exit probability.
                  </p>
                </div>

                {/* Interactive Prediction Form */}
                <PredictionForm
                  onPredict={handlePredict}
                  loading={loading}
                />
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

      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 font-display text-sm">StartupPulse AI</span>
            <span className="text-slate-400 font-medium">| Institutional Venture Intelligence</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Trained on 66,000+ Venture Milestones • Powered by Scikit-learn & FastAPI
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default App;
