import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Lock, 
  User, 
  Fingerprint, 
  Send, 
  AlertTriangle,
  RefreshCw,
  Mail,
  CheckCircle2,
  XCircle,
  X,
  UserCheck,
  Chrome
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen() {
  const { 
    loginWithEmail, 
    signUpWithEmail, 
    loginWithGoogle, 
    loginAsGuest, 
    resetPassword,
    error: authError,
    clearError,
    startSimulatedSession
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Cyber Notification Toast system
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // Clear global context error on mode change
  useEffect(() => {
    clearError();
    setNotification(null);
  }, [mode]);

  // Sync auth errors with local notification system
  useEffect(() => {
    if (authError) {
      showNotification(authError, "error");
    }
  }, [authError]);

  const showNotification = (message: string, type: "error" | "success" | "info") => {
    setNotification({ message, type });
    // Keep it up for security review, don't dismiss immediately if it's an error
  };

  // Password complexity checkers
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification("Email and password signatures are required.", "error");
      return;
    }
    setIsLoading(true);
    setNotification(null);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      // Handled by useEffect matching authError
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showNotification("Full name token required.", "error");
      return;
    }
    if (!isPasswordValid) {
      showNotification("Your cryptographic secure key is too weak.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showNotification("Passwords do not match.", "error");
      return;
    }

    setIsLoading(true);
    setNotification(null);
    try {
      await signUpWithEmail(fullName, email, password);
      showNotification("CyberKavach Account created! Verification email transmitted.", "success");
      setMode("login");
    } catch (err: any) {
      // Handled by context
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showNotification("Please provide target email for recovery.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      showNotification("Cryptographic recovery link transmitted to email.", "success");
      setMode("login");
    } catch (err: any) {
      // Handled by context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setNotification(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      // Handled by context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setNotification(null);
    try {
      await loginAsGuest();
    } catch (err: any) {
      // Handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-screen-root" className="fixed inset-0 w-full h-full bg-slate-950 overflow-y-auto z-[9999] select-none font-sans text-slate-300">
      
      {/* Background Image / Cyber Backdrop */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <img
          src="https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/Exploring%20the%20Future%20of%20Technology_%20Trends%20to%20Watch.jpeg"
          alt="Cybernetic Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover animate-cyber-bg"
        />
        <div className="absolute inset-0 bg-slate-950/20"></div>
      </div>

      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative z-10 box-border">
        {/* Neon Cyber Grids */}
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

        {/* Auth Box Container */}
        <div className="w-full max-w-4xl p-6 sm:p-8 md:p-10 rounded-2xl relative overflow-hidden z-10 shadow-[0_0_60px_rgba(6,182,212,0.35)] bg-transparent border-2 border-cyan-500/40">
          <div className="scanline"></div>

          {/* Interactive cyber error notification banner */}
          {notification && (
            <div 
              className={`p-4 rounded-lg border flex items-start gap-3 mb-6 transition-all duration-300 animate-slide-in font-mono text-xs shadow-lg ${
                notification.type === "error" 
                  ? "bg-rose-950/70 border-rose-500/40 text-rose-300" 
                  : notification.type === "success"
                  ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                  : "bg-cyan-950/70 border-cyan-500/40 text-cyan-300"
              }`}
            >
              {notification.type === "error" ? (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-bold tracking-wider uppercase block mb-0.5">
                  {notification.type === "error" ? "CRITICAL ALARM" : "TRANSMISSION SUCCESSFUL"}
                </span>
                <p>{notification.message}</p>
                {notification.type === "error" && (
                  notification.message.toLowerCase().includes("configuration") || 
                  notification.message.toLowerCase().includes("warning") || 
                  notification.message.toLowerCase().includes("allowed") ||
                  notification.message.toLowerCase().includes("unauthorized") ||
                  notification.message.toLowerCase().includes("domain")
                ) && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNotification(null);
                        startSimulatedSession("Simulated Analyst", "Enterprise");
                      }}
                      className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
                    >
                      <span>⚡ BYPASS & LAUNCH OFFLINE DEMO MODE</span>
                    </button>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white p-0.5 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Brand Identity */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-block p-3.5 rounded-lg border border-cyan-500/40 bg-cyan-500/15 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                  <ShieldAlert className="w-12 h-12 text-cyan-400 animate-pulse" />
                </div>
                <h1 className="text-3xl font-black tracking-widest text-white uppercase text-shadow-cyan">
                  CYBER<span className="text-cyan-400 italic">KAVACH</span>
                </h1>
                <p className="text-[10px] text-cyan-300 font-mono tracking-widest mt-1.5 uppercase font-bold text-shadow-cyan">
                  Enterprise SOC Threat Assessment Hub
                </p>
                <p className="text-xs text-slate-100 leading-relaxed mt-4 font-sans font-medium text-shadow-hard bg-slate-950/50 p-3 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                  Deploying autonomous neural filters and machine intelligence pipelines to inspect domain signatures, credentials leaks, and deepfakes instantly.
                </p>
              </div>

              {/* SSO / GUEST FLOW */}
              <div className="pt-6 border-t border-slate-800">
                <span className="text-[10px] text-cyan-300 block mb-3 uppercase tracking-widest font-mono font-extrabold text-shadow-cyan">
                  AUTONOMIC SSO & DEMO ACCESS
                </span>
                <div className="flex flex-col gap-2 font-mono">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-cyan-500/30 hover:border-cyan-400 bg-slate-950/85 rounded text-[11px] text-white flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition-all cursor-pointer font-bold text-shadow-hard shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  >
                    <Chrome className="w-4 h-4 text-cyan-400" />
                    <span>CONTINUE WITH GOOGLE</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-slate-700 hover:border-cyan-400/50 bg-slate-950/85 rounded text-[11px] text-slate-200 flex items-center justify-center gap-2 hover:bg-cyan-500/10 transition-all cursor-pointer font-bold text-shadow-hard shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  >
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>CONTINUE AS GUEST (DEMO)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startSimulatedSession("Simulated Analyst", "Enterprise")}
                    className="w-full px-4 py-3 border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/85 rounded text-[11px] text-cyan-400 flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition-all cursor-pointer font-black shadow-[0_0_15px_rgba(6,182,212,0.25)] text-shadow-cyan"
                  >
                    <Fingerprint className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>SIMULATE SESSION (OFFLINE BYPASS)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Visual Separator */}
            <div className="hidden md:block md:col-span-1 flex justify-center items-center">
              <div className="h-full w-px bg-slate-800"></div>
            </div>

            {/* Right Column: Interactive Login/Register Form */}
            <div className="md:col-span-6 flex flex-col justify-center">
              
              {/* MODE TABS */}
              <div className="flex gap-4 border-b border-slate-800 pb-3 mb-6 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`pb-2 px-1 tracking-wider uppercase font-extrabold transition-all relative text-shadow-hard ${
                    mode === "login" 
                      ? "text-cyan-400 border-b border-cyan-400 text-shadow-cyan" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  SYSTEM ACCESS
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`pb-2 px-1 tracking-wider uppercase font-extrabold transition-all relative text-shadow-hard ${
                    mode === "signup" 
                      ? "text-cyan-400 border-b border-cyan-400 text-shadow-cyan" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  NEW REGISTER
                </button>
              </div>

              {/* LOGIN MODE */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="text-[10px] text-cyan-300 block mb-1.5 uppercase font-extrabold tracking-wider text-shadow-cyan">EMAIL DIRECTORY</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@cyberkavach.in"
                        required
                        className="w-full bg-slate-950/95 border border-cyan-500/30 focus:border-cyan-400 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-[10px] text-cyan-300 uppercase font-extrabold tracking-wider text-shadow-cyan">SECURE SHIELD PASS</label>
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-[9px] text-cyan-400 hover:text-cyan-300 uppercase font-bold text-shadow-cyan"
                      >
                        LOST SECRET?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-950/95 border border-cyan-500/30 focus:border-cyan-400 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-800 disabled:text-cyan-500 text-slate-950 font-black rounded shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-shadow-slate"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Fingerprint className="w-4 h-4" />
                      )}
                      <span>ENGAGE SYSTEM CORE</span>
                    </button>
                  </div>
                </form>
              )}

              {/* SIGN UP MODE */}
              {mode === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="text-[10px] text-cyan-300 block mb-1.5 uppercase font-extrabold tracking-wider text-shadow-cyan">FULL NAME</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Agent Vikram"
                        required
                        className="w-full bg-slate-950/95 border border-cyan-500/30 focus:border-cyan-400 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 block mb-1.5 uppercase font-extrabold tracking-wider text-shadow-cyan">EMAIL DIRECTORY</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@cyberkavach.in"
                        required
                        className="w-full bg-slate-950/95 border border-cyan-500/30 focus:border-cyan-400 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 block mb-1.5 uppercase font-extrabold tracking-wider text-shadow-cyan">SECURE SHIELD PASS</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-950/95 border border-cyan-500/30 focus:border-cyan-400 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>

                    {/* PASSWORD REAL TIME CHECKLIST */}
                    <div className="mt-2.5 p-2 bg-slate-950/95 border border-cyan-500/20 rounded space-y-1 text-[9px] text-slate-300 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
                      <div className="text-[8px] uppercase font-black text-cyan-300 mb-1 text-shadow-cyan">Key Entropy Requirements:</div>
                      <div className="flex items-center gap-1.5 font-bold">
                        {checks.length ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                        <span className={checks.length ? "text-emerald-400" : "text-slate-400"}>At least 8 character sequence</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        {checks.uppercase ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                        <span className={checks.uppercase ? "text-emerald-400" : "text-slate-400"}>One uppercase character [A-Z]</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        {checks.lowercase ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                        <span className={checks.lowercase ? "text-emerald-400" : "text-slate-400"}>One lowercase character [a-z]</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        {checks.number ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                        <span className={checks.number ? "text-emerald-400" : "text-slate-400"}>One digit [0-9]</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold">
                        {checks.special ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                        <span className={checks.special ? "text-emerald-400" : "text-slate-400"}>One special symbol [!, @, #, $, %]</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 block mb-1.5 uppercase font-extrabold tracking-wider text-shadow-cyan">CONFIRM KEY</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-950/95 border border-cyan-500/30 focus:border-cyan-400 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !isPasswordValid}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 font-black rounded shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-shadow-slate"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>INITIALIZE ACCESS PORTAL</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FORGOT MODE */}
              {mode === "forgot" && (
                <form onSubmit={handleForgotPassword} className="space-y-4 font-mono text-xs">
                  <div className="p-3 bg-cyan-950/80 border border-cyan-500/30 rounded text-[11px] text-cyan-300 font-bold leading-relaxed shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    Indicate the authenticated node email to transmit the secure password recovery sequence.
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 block mb-1.5 uppercase font-extrabold tracking-wider text-shadow-cyan">EMAIL DIRECTORY</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="operator@cyberkavach.in"
                        required
                        className="w-full bg-slate-950/95 border border-cyan-500/30 focus:border-cyan-400 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="flex-1 py-3 border border-slate-700 hover:border-slate-500 bg-slate-950/85 rounded text-slate-200 hover:text-white uppercase font-bold tracking-wider cursor-pointer text-center text-shadow-hard shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                    >
                      GO BACK
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-shadow-slate"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>TRANSMIT RECOVERY</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
