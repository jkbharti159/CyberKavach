import React, { useState } from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Key, 
  Globe, 
  Edit3, 
  Save, 
  CheckCircle,
  RefreshCw,
  Award
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { user, profile, updateProfileInfo, sendVerificationEmail, loading } = useAuth();
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  if (!profile) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-cyan-400 font-mono">
        <RefreshCw className="w-10 h-10 animate-spin mb-4" />
        <span>FETCHING IDENTITY TELEMETRY...</span>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setUpdating(true);
    setFeedback(null);
    try {
      await updateProfileInfo(fullName);
      setIsEditing(false);
      setFeedback({ message: "Identity core updated successfully.", type: "success" });
    } catch (err) {
      setFeedback({ message: "Failed to sync identity updates.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleResendVerification = async () => {
    setUpdating(true);
    setFeedback(null);
    try {
      await sendVerificationEmail();
      setFeedback({ message: "Verification sequence transmitted to email directory.", type: "success" });
    } catch (err) {
      setFeedback({ message: "Transmission failed. Rate limits may apply.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";
    try {
      if (dateValue.seconds) {
        return new Date(dateValue.seconds * 1000).toLocaleString();
      }
      if (dateValue.toDate) {
        return dateValue.toDate().toLocaleString();
      }
      return new Date(dateValue).toLocaleString();
    } catch (e) {
      return String(dateValue);
    }
  };

  const getProviderLabel = (prov: string) => {
    switch (prov) {
      case "google":
      case "google.com":
        return "Google Federated Sign-In";
      case "anonymous":
        return "Autonomic Anonymous Session";
      default:
        return "Cryptographic Email & Pass";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8 space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-widest text-white uppercase font-mono">
            AGENT IDENTITY <span className="text-cyan-400 italic">CORE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono uppercase mt-1">
            Review security credentials and authorization telemetry
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500 uppercase">SYS_ID:</span>
          <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded font-bold">
            {profile.uid.substring(0, 12)}...
          </span>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div 
          className={`p-4 rounded border flex items-center gap-3 font-mono text-xs animate-slide-in ${
            feedback.type === "success" 
              ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-300" 
              : "bg-rose-950/60 border-rose-500/30 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: VISUAL PROFILE CARD */}
        <div className="lg:col-span-4 rounded-xl border border-slate-900 bg-slate-950/60 p-6 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none"></div>
          
          {/* Avatar frame */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-2 border-cyan-500/40 p-1 flex items-center justify-center bg-slate-950 relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              {profile.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt={profile.fullName} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-cyan-950/60 flex items-center justify-center">
                  <User className="w-12 h-12 text-cyan-400" />
                </div>
              )}
            </div>
            {/* Holographic accent rings */}
            <div className="absolute -inset-1 rounded-full border border-cyan-500/10 animate-ping opacity-70"></div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-wider">{profile.fullName}</h3>
            <div className="flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                {profile.role.toUpperCase()} ANALYST
              </span>
            </div>
          </div>

          {/* Quick Stats list */}
          <div className="w-full pt-4 border-t border-slate-900 space-y-2 text-left font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">PROVIDER:</span>
              <span className="text-slate-300 uppercase">{profile.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">STATUS:</span>
              <span className="text-emerald-400 font-bold uppercase">{profile.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">VERIFICATION:</span>
              <span className={profile.emailVerified || profile.provider === "anonymous" ? "text-emerald-400" : "text-amber-500"}>
                {profile.emailVerified || profile.provider === "anonymous" ? "VERIFIED" : "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL REGISTERS & FORMS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* USER SPECIFICATION CARD */}
          <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                CORE IDENTITY REGISTRIES
              </h4>
              {!isEditing && profile.provider !== "anonymous" && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 px-3 py-1 rounded hover:bg-cyan-500/10 transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDIT IDENTITY</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-cyan-400 block mb-1.5 uppercase font-bold tracking-wider">FULL NAME TOKEN</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cyan-500/70">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Agent Vikram"
                      required
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white py-2.5 pl-11 pr-4 rounded outline-none transition-all placeholder:text-slate-600 font-sans text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFullName(profile.fullName);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded text-slate-300 font-bold transition-all uppercase cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all flex items-center gap-1.5 cursor-pointer uppercase"
                  >
                    {updating ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>SAVE SYSTEM</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">FULL NAME REGISTER</span>
                  <p className="text-white text-sm font-semibold">{profile.fullName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">EMAIL LOCATION</span>
                  <p className="text-white text-sm font-semibold flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>{profile.email}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">SECURE HANDSHAKE GATEWAY</span>
                  <p className="text-white text-sm font-semibold flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span>{getProviderLabel(profile.provider)}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">AUTHORIZATION ACCESS LEVEL</span>
                  <p className="text-white text-sm font-semibold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>{profile.role.toUpperCase()} ANALYST</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* TELEMETRY SYSTEM TIMINGS */}
          <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-6 space-y-4">
            <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider border-b border-slate-900 pb-3">
              ACCESS TIMINGS & LOGS
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">NODE CREATED TIME</span>
                  <p className="text-slate-200 mt-1 font-semibold">{formatDate(profile.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">LAST INTRUSION/LOGIN LOG</span>
                  <p className="text-slate-200 mt-1 font-semibold">{formatDate(profile.lastLogin)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECURE GUARD VERIFICATION GATE */}
          {!profile.emailVerified && profile.provider === "password" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <h5 className="font-bold font-mono text-xs uppercase tracking-wider">EMAIL VERIFICATION STATUS: PENDING</h5>
                </div>
                <p className="text-[11px] text-slate-300 max-w-xl font-sans">
                  Your node verification state is incomplete. Some highly sensitive modules require a verified email destination. Please verify to upgrade your threat capabilities.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={updating}
                className="font-mono text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer flex-shrink-0 uppercase"
              >
                {updating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                <span>RESEND SEQUENCE</span>
              </button>
            </div>
          )}

          {profile.emailVerified && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0 animate-pulse" />
              <div>
                <h5 className="font-bold font-mono text-xs text-emerald-400 uppercase tracking-wider">SECURE SHIELD VERIFIED NODE</h5>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                  Your email destination is cryptographically verified. All military-grade neural pipelines and full SOC privileges are accessible on your node.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
