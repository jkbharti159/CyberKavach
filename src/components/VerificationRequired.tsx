import React, { useState } from "react";
import { 
  ShieldAlert, 
  Mail, 
  RefreshCw, 
  LogOut, 
  Send, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/config";

export default function VerificationRequired() {
  const { logout, sendVerificationEmail } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleCheckStatus = async () => {
    setChecking(true);
    setFeedback(null);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Force reload user authentication token to sync verified status
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setFeedback({ message: "Handshake verified! Redirecting to SOC Core...", type: "success" });
          // Force reload page or let AuthState update the session state automatically
          window.location.reload();
        } else {
          setFeedback({ message: "Verification state is still pending. Please verify your email first.", type: "error" });
        }
      }
    } catch (err: any) {
      console.error("Status check failed:", err);
      setFeedback({ message: "Handshake sync failed. Try again shortly.", type: "error" });
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setFeedback(null);
    try {
      await sendVerificationEmail();
      setFeedback({ message: "Secure verification link transmitted to your email directory.", type: "success" });
    } catch (err: any) {
      console.error("Resend error:", err);
      setFeedback({ message: "Could not transmit. Please wait a few moments before retrying.", type: "error" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 z-[9999] select-none font-sans text-slate-300">
      
      {/* Background Image / Cyber Backdrop */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <img
          src="https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/Exploring%20the%20Future%20of%20Technology_%20Trends%20to%20Watch.jpeg"
          alt="Cybernetic Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-20 scale-105 animate-bg-pan-zoom"
        />
        <div className="absolute inset-0 bg-slate-950/90"></div>
      </div>

      {/* Background Neon Elements */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      {/* Cyber Blocker Card */}
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] bg-slate-950 border border-amber-500/30 backdrop-blur-md">
        <div className="scanline"></div>
        
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Animated Alarm Icon */}
          <div className="inline-block p-4 rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] relative">
            <ShieldAlert className="w-12 h-12 text-amber-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping"></div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-widest text-white uppercase font-mono">
              SECURITY SHIELD ENFORCED
            </h2>
            <p className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">
              EMAIL VERIFICATION REQUISITE
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            To guard access against rogue bots and enforce cryptographic session integrity, you must verify your email destination first. A secure link was transmitted to your inbox.
          </p>

          {/* Verification Feedback Banner */}
          {feedback && (
            <div 
              className={`w-full p-3.5 rounded border text-left font-mono text-xs flex items-start gap-2.5 animate-slide-in ${
                feedback.type === "success" 
                  ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-300" 
                  : "bg-rose-950/60 border-rose-500/30 text-rose-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="w-full space-y-3 font-mono text-xs pt-2">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:text-amber-500 text-slate-950 font-black rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              {checking ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>CHECK VERIFICATION STATUS</span>
            </button>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex-1 py-2.5 border border-slate-800 hover:border-slate-700 rounded text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>RESEND EMAIL</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="flex-1 py-2.5 border border-rose-500/30 hover:bg-rose-500/10 rounded text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-900 flex justify-between text-[9px] text-slate-500 font-mono">
            <span>SEC_STATUS: BLOCKED</span>
            <span>CYBER_KAVACH v2.4</span>
          </div>

        </div>
      </div>
    </div>
  );
}
