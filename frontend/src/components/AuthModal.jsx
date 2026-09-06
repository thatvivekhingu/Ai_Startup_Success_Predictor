import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Building2,
  Cpu,
  Globe2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Student Innovator');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'microsoft' | 'github'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, register, socialLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccessMsg('Logged in successfully!');
      } else {
        await register(fullName || email.split('@')[0], email, password, role);
        setSuccessMsg('Account created successfully!');
      }
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 500);
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setError('');
    setSocialLoading(provider);
    try {
      await socialLogin(provider);
      setSuccessMsg(`Signed in with ${provider.toUpperCase()}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 600);
    } catch (err) {
      console.error('Social auth error:', err);
      setError(`Failed to sign in with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in font-sans">
      
      {/* Outer Modal Container with Split Screen */}
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-slate-100 rounded-full transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Data-backed insights & high-rise office artwork */}
        <div className="lg:col-span-6 relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          
          {/* Subtle dusk background lighting simulation */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Brand + Quote */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-end space-x-1">
                <div className="w-1.5 h-3.5 bg-blue-400 rounded-xs"></div>
                <div className="w-1.5 h-5 bg-blue-600 rounded-xs"></div>
                <div className="w-1.5 h-7 bg-blue-800 rounded-xs"></div>
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight leading-none block font-display">
                  StartupPulse
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                  From Data to Decisions
                </span>
              </div>
            </div>

            <span className="text-[11px] font-serif italic text-slate-300 border-l border-slate-700 pl-3">
              "Better data. Bigger tomorrows."
            </span>
          </div>

          {/* Center Content: Headline & Checklist */}
          <div className="relative z-10 py-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight font-display">
              Data-backed <br />
              insights for a <br />
              <span className="text-blue-400">brighter startup <br />ecosystem.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Join founders, investors, and institutions who use StartupPulse to make smarter, faster, and more confident decisions.
            </p>

            {/* 4 Feature Checklist Items with Icons */}
            <div className="space-y-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span>Real market data & trends</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span>AI-powered valuation models</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Globe2 className="w-3.5 h-3.5" />
                </div>
                <span>Track 66,000+ global startups</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Built for innovators like you</span>
              </div>
            </div>

            {/* 3 Stats Bar */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800">
              <div>
                <div className="text-lg font-black text-white font-display">66,368+</div>
                <div className="text-[10px] text-slate-400">Startups Tracked</div>
              </div>
              <div>
                <div className="text-lg font-black text-blue-400 font-display">83.1%</div>
                <div className="text-[10px] text-slate-400">Model ROC-AUC</div>
              </div>
              <div>
                <div className="text-lg font-black text-white font-display">500+</div>
                <div className="text-[10px] text-slate-400">Institutions Trust Us</div>
              </div>
            </div>

            {/* Simulated Desktop Preview Card (World Map + Metrics) */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/80 shadow-lg text-[10px] space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white">Global Startup Outlook</span>
                <span className="text-emerald-400 font-semibold">Success: 83.1%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/60 p-1.5 rounded">
                  <div className="text-slate-400 text-[9px]">Total Startups</div>
                  <div className="font-bold text-white">66,368</div>
                </div>
                <div className="bg-slate-800/60 p-1.5 rounded">
                  <div className="text-slate-400 text-[9px]">Active Investors</div>
                  <div className="font-bold text-white">7,096</div>
                </div>
                <div className="bg-slate-800/60 p-1.5 rounded">
                  <div className="text-slate-400 text-[9px]">Funding Tracked</div>
                  <div className="font-bold text-white">$320B+</div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Organizations Strip */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              TRUSTED BY LEADING ORGANIZATIONS
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="text-orange-500 font-black">Y Combinator</span>
              <span className="tracking-wider">SEQUOIA ⎸⎹</span>
              <span className="font-mono">a16z</span>
              <span>techstars_</span>
              <span>ACCEL</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Exact Figma Auth Form & Social Logins */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white">
          
          {/* Top Mode Switcher */}
          <div className="flex items-center justify-end text-xs text-slate-500">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
              }}
              className="ml-1.5 font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          {/* Form Header */}
          <div className="py-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-end space-x-1">
                <div className="w-1.5 h-3 bg-blue-400 rounded-xs"></div>
                <div className="w-1.5 h-4.5 bg-blue-600 rounded-xs"></div>
                <div className="w-1.5 h-6 bg-blue-800 rounded-xs"></div>
              </div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                StartupPulse
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-display tracking-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isLogin ? 'Log in to access your StartupPulse account' : 'Start your venture intelligence & grant journey today'}
            </p>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vivek Hingu"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    I am a
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="Student Innovator">Student Innovator (SSIP 2.0 / Campus)</option>
                    <option value="Startup Founder">Startup Founder (Early & Growth Stage)</option>
                    <option value="Angel / VC Investor">Angel / VC Investor</option>
                    <option value="Academic Mentor">Faculty / University Mentor</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={() => alert('Password reset instructions sent to your email.')}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="w-full py-3 bg-[#0F172A] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* OR CONTINUE WITH Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              OR CONTINUE WITH
            </span>
          </div>

          {/* 3 Interactive Working Social Buttons: Google, Microsoft, GitHub */}
          <div className="space-y-2.5">
            
            {/* 1. Continue with Google */}
            <button
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocialAuth('google')}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-3 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* 2. Continue with Microsoft */}
            <button
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocialAuth('microsoft')}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-3 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              {socialLoading === 'microsoft' ? (
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                  <div className="bg-[#F25022] w-1.5 h-1.5"></div>
                  <div className="bg-[#7FBA00] w-1.5 h-1.5"></div>
                  <div className="bg-[#00A4EF] w-1.5 h-1.5"></div>
                  <div className="bg-[#FFB900] w-1.5 h-1.5"></div>
                </div>
              )}
              <span>Continue with Microsoft</span>
            </button>

            {/* 3. Continue with GitHub */}
            <button
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocialAuth('github')}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-3 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              {socialLoading === 'github' ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              )}
              <span>Continue with GitHub</span>
            </button>

          </div>

          {/* Legal agreement */}
          <div className="text-[11px] text-center text-slate-400 pt-3">
            By logging in, you agree to our{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
          </div>

          {/* Bottom Security Card */}
          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-slate-600 leading-tight">
              <div className="font-bold text-slate-900">Secure. Reliable. Trusted.</div>
              <div>Your data is protected with industry-standard encryption and security measures.</div>
            </div>
          </div>

          {/* Bottom Quote Tagline */}
          <div className="text-center text-[10px] text-slate-400 italic pt-2">
            “Empowering a more informed, innovative, and inclusive startup ecosystem.” — StartupPulse
          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthModal;
