import React from "react";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  SearchCode, 
  Cpu, 
  MessageSquare, 
  User, 
  Power, 
  Database,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Globe,
  Award,
  Server,
  Settings
} from "lucide-react";
import { UserSession, UserRole } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserSession | null;
  onLogout: () => void;
  onRoleSwitch: (role: UserRole) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout, 
  onRoleSwitch, 
  isCollapsed, 
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose
}: SidebarProps) {
  const roles: UserRole[] = ["Admin", "Researcher", "Analyst", "Guest"];

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  const tabs = [
    { id: "dashboard", label: "SOC Dashboard", icon: LayoutDashboard, desc: "Operational SOC feeds & analytics", category: "core" },
    { id: "analyzer", label: "Interactive Analyzer", icon: SearchCode, desc: "Punycode & Typosquatting engine", category: "core" },
    { id: "ml_diagnostics", label: "ML Pipelines & SHAP", icon: Cpu, desc: "Random Forest & tree models", category: "core" },
    { id: "threat_intel", label: "Threat Intelligence", icon: Database, desc: "Malicious feeds & MITRE mappings", category: "core" },
    { id: "ai_chat", label: "Copilot Chat Assistant", icon: MessageSquare, desc: "LLM contextual SOC threat intelligence", category: "core" },
    
    { id: "footprint_scanner", label: "Footprint Scanner", icon: Globe, desc: "AI public digital exposure & OSINT", category: "enterprise" },
    { id: "deepfake_detector", label: "Deepfake Detector", icon: ShieldAlert, desc: "Identify GAN face & voice cloning", category: "enterprise" },
    { id: "data_leak_analyzer", label: "Leak Impact Analyzer", icon: Server, desc: "Credentials breaches & scenarios", category: "enterprise" },
    { id: "security_coach", label: "AI Security Coach", icon: Award, desc: "Interactive tactical scenarios quiz", category: "enterprise" }
  ];


  return (
    <>
      {/* Mobile Sidebar backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
          onClick={onMobileClose}
        />
      )}
      <aside 
        id="sec-sidebar" 
        className={`${isCollapsed ? "w-20" : "w-80"} h-full border-r border-slate-800 bg-slate-950 lg:bg-transparent flex flex-col justify-between text-slate-300 font-sans select-none overflow-hidden flex-shrink-0 transition-all duration-300
          fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0
          ${mobileOpen ? "translate-x-0 shadow-[0_0_50px_rgba(6,182,212,0.3)]" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Animated Background Image - fully visible, no dimming or dark overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          <div 
            className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
            style={{ 
              backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(5).jpeg")',
              opacity: 1.0
            }}
          />
        </div>

        {/* Background Matrix/Radar grid lines */}
        <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none z-0"></div>

        {/* Header Info */}
        <div className="p-5 pb-3 border-b border-slate-800/60 relative z-10 flex-shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-cyan-500/40 bg-slate-950/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex-shrink-0">
                  <ShieldAlert className="w-7 h-7 text-cyan-400 cyber-glow-cyan" />
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-lg font-extrabold tracking-wider text-white font-sans uppercase truncate" style={textShadowStyle}>
                    Cyber<span className="text-cyan-400 italic">Kavach</span>
                  </h1>
                  <p className="text-[9px] uppercase font-mono tracking-widest text-cyan-300 font-bold truncate" style={textShadowStyle}>
                    CONSOLE MENU SYSTEM
                  </p>
                </div>
              </div>
              
              {/* Close/Toggle Buttons */}
              {onMobileClose && (
                <button
                  onClick={onMobileClose}
                  title="Close Menu"
                  className="p-1.5 rounded border border-slate-700 hover:border-rose-400 bg-slate-950/90 text-slate-300 hover:text-rose-400 transition-all cursor-pointer flex-shrink-0 shadow-lg lg:hidden block"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onToggleCollapse}
                title="Collapse Menu"
                className="p-1.5 rounded border border-slate-700 hover:border-cyan-400 bg-slate-950/90 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer flex-shrink-0 shadow-lg lg:block hidden"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="p-2 rounded-lg border border-cyan-500/40 bg-slate-950/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <ShieldAlert className="w-7 h-7 text-cyan-400 cyber-glow-cyan" />
              </div>
              <button
                onClick={onToggleCollapse}
                title="Expand Menu"
                className="p-1.5 rounded border border-slate-700 hover:border-cyan-400 bg-slate-950/90 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      {/* Navigation tabs */}
      <nav className={`flex-1 flex flex-col gap-2.5 relative z-10 overflow-y-auto min-h-0 ${isCollapsed ? "px-2 py-4" : "px-3 py-4"}`}>
        
        <div className="flex flex-col gap-1.5">
          {!isCollapsed && (
            <span className="px-3 py-1 text-[9px] font-mono text-slate-400 uppercase tracking-widest font-extrabold" style={textShadowStyle}>
              Core SOC Operations
            </span>
          )}
          {tabs.filter(t => t.category === "core").map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                title={isCollapsed ? tab.label : undefined}
                className={`w-full flex items-start rounded border text-left transition-all duration-200 font-sans group cursor-pointer ${
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
                } ${
                  isActive 
                    ? "bg-cyan-950/85 border-cyan-400/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-sm" 
                    : "bg-slate-950/75 border-slate-800/80 text-slate-200 hover:bg-slate-900/90 hover:text-white hover:border-cyan-500/30 backdrop-blur-sm"
                }`}
              >
                <div className={`p-1.5 rounded border transition-all flex-shrink-0 ${
                  isActive 
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400" 
                    : "bg-slate-900/60 border-slate-800 text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/30"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold flex items-center justify-between" style={textShadowStyle}>
                      <span className="truncate text-[11px]">{tab.label}</span>
                      {isActive && (
                        <span className="text-[6px] bg-cyan-500/30 text-cyan-300 px-1 py-0.5 rounded font-mono font-extrabold uppercase tracking-wider">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal mt-0.5 group-hover:text-slate-100 font-mono truncate" style={textShadowStyle}>
                      {tab.desc}
                    </p>
                  </div>
                )}
              </button>
            );
          })}

          {!isCollapsed && (
            <span className="px-3 py-1 text-[9px] font-mono text-slate-400 uppercase tracking-widest font-extrabold mt-3 border-t border-slate-800/40 pt-3" style={textShadowStyle}>
              Enterprise Modules
            </span>
          )}
          {tabs.filter(t => t.category === "enterprise").map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                title={isCollapsed ? tab.label : undefined}
                className={`w-full flex items-start rounded border text-left transition-all duration-200 font-sans group cursor-pointer ${
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
                } ${
                  isActive 
                    ? "bg-cyan-950/85 border-cyan-400/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-sm" 
                    : "bg-slate-950/75 border-slate-800/80 text-slate-200 hover:bg-slate-900/90 hover:text-white hover:border-cyan-500/30 backdrop-blur-sm"
                }`}
              >
                <div className={`p-1.5 rounded border transition-all flex-shrink-0 ${
                  isActive 
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400" 
                    : "bg-slate-900/60 border-slate-800 text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/30"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold flex items-center justify-between" style={textShadowStyle}>
                      <span className="truncate text-[11px]">{tab.label}</span>
                      {isActive && (
                        <span className="text-[6px] bg-cyan-500/30 text-cyan-300 px-1 py-0.5 rounded font-mono font-extrabold uppercase tracking-wider">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal mt-0.5 group-hover:text-slate-100 font-mono truncate" style={textShadowStyle}>
                      {tab.desc}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Credential Session card placed directly below tab list */}
        {!isCollapsed ? (
          <div className="mt-4 pt-4 border-t border-slate-800/60 font-mono flex-shrink-0">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-2 font-bold" style={textShadowStyle}>
              Active Credential Session
            </span>
            <div className="p-3 rounded bg-slate-950/85 border border-slate-800/80 flex flex-col gap-2 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-white text-xs font-extrabold truncate" style={textShadowStyle}>
                    {user?.username || "Sec_Guest_Alpha"}
                  </div>
                  <div className="text-[10px] text-slate-300 truncate font-semibold" style={textShadowStyle}>
                    {user?.email || "guest@cyberkavach.in"}
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-300 uppercase font-semibold" style={textShadowStyle}>Role level:</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    user?.role === "Admin" ? "bg-red-950/90 text-rose-300 border border-red-850" :
                    user?.role === "Researcher" ? "bg-amber-950/90 text-amber-300 border border-amber-850" :
                    user?.role === "Analyst" ? "bg-cyan-950/90 text-cyan-300 border border-cyan-850" :
                    "bg-slate-900/90 text-slate-300 border border-slate-800"
                  }`}>
                    {user?.role || "Guest"}
                  </span>
                </div>

                {/* Micro role-switcher widget for enterprise testing of access bounds */}
                <div className="mt-1">
                  <div className="text-[8px] text-slate-300 flex items-center gap-1 mb-1 font-bold" style={textShadowStyle}>
                    <RefreshCw className="w-2.5 h-2.5 animate-spin-slow text-cyan-400" />
                    <span>HOT-SWITCH PRIVILEGES:</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[8px] text-center">
                    {roles.map(r => (
                      <button
                        key={r}
                        id={`roleswitch-${r}`}
                        onClick={() => {
                          if (onRoleSwitch) onRoleSwitch(r);
                        }}
                        className={`px-1 py-0.5 rounded border transition-all cursor-pointer ${
                          user?.role === r 
                            ? "bg-cyan-950/90 border-cyan-400 text-cyan-300 font-bold" 
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        {r.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col items-center gap-2 flex-shrink-0">
            <div 
              title={`Active: ${user?.username || "Sec_Guest"} (${user?.role || "Guest"})`}
              className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-center relative cursor-help hover:border-cyan-500/40 shadow-lg"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950"></span>
            </div>
          </div>
        )}
      </nav>

      {/* Footer Analyst Session Card containing Terminal Exit */}
      <div className={`border-t border-slate-800 bg-slate-950/45 relative z-10 font-mono flex-shrink-0 ${isCollapsed ? "p-3" : "p-4"}`}>
        <button
          onClick={onLogout}
          title={isCollapsed ? "TERMINATE TERMINAL" : undefined}
          className={`w-full bg-rose-950/85 hover:bg-rose-900/95 border border-rose-800/60 text-rose-300 hover:text-rose-100 rounded flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isCollapsed ? "p-2.5" : "py-2 px-3 text-[11px] font-bold"
          }`}
          style={isCollapsed ? {} : textShadowStyle}
        >
          <Power className="w-3.5 h-3.5 text-rose-400" />
          {!isCollapsed && <span>TERMINATE TERMINAL</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
