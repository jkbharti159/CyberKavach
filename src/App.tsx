import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import InteractiveAnalyzer from "./components/InteractiveAnalyzer";
import MlDiagnostics from "./components/MlDiagnostics";
import ThreatIntelligencePanel from "./components/ThreatIntelligencePanel";
import SecurityCopilot from "./components/SecurityCopilot";
import AuthScreen from "./components/AuthScreen";
import UserProfile from "./components/UserProfile";
import VerificationRequired from "./components/VerificationRequired";
import { useAuth } from "./context/AuthContext";

import DigitalFootprintScanner from "./components/DigitalFootprintScanner";
import DeepfakeDetector from "./components/DeepfakeDetector";
import DataLeakAnalyzer from "./components/DataLeakAnalyzer";
import SecurityCoach from "./components/SecurityCoach";

import { 
  UserSession, DashboardStats, UrlAnalysisResult, UserRole,
  LearningProgress, FootprintScanResult, DeepfakeScanResult, DataLeakResult, NotificationItem
} from "./types";
import { Activity, ShieldAlert, Cpu, Menu, ChevronDown, LayoutDashboard, SearchCode, Database, MessageSquare, Globe, Award, Server, Settings, User, Linkedin } from "lucide-react";

const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage access blocked by iframe sandboxing limits. Grabbing from session memory.", e);
      return (window as any)[`__fallback_${key}`] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage modification blocked by iframe sandboxing limits. Storing in session memory.", e);
      (window as any)[`__fallback_${key}`] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage clearance blocked by iframe sandboxing limits. Removing session memory.", e);
      delete (window as any)[`__fallback_${key}`];
    }
  }
};

const safeAlert = (message: string) => {
  try {
    alert(message);
  } catch (e) {
    console.error("Alert blocked by browsing context:", message, e);
  }
};

export default function App() {
  const { session, user, profile, logout, switchRole, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<UrlAnalysisResult | null>(null);
  const [appIsLoading, setAppIsLoading] = useState<boolean>(() => {
    // If a cached session is present, we bypass the initial full-screen blank loader
    const cached = safeStorage.getItem("cyberkavach_session");
    return !cached;
  });
  const [statsIsLoading, setStatsIsLoading] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return safeStorage.getItem("cyberkavach_sidebar_collapsed") === "true";
  });

  // Auto-close responsive drawer on menu interactions
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  const [scanHistory, setScanHistory] = useState<FootprintScanResult[]>(() => {
    const cached = safeStorage.getItem("cyberkavach_footprint_history");
    const cleared = safeStorage.getItem("cyberkavach_footprint_cleared") === "true";
    if (cleared) return [];
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return [
      {
        id: "fp-1",
        query: "jkbharti159@gmail.com",
        type: "email",
        timestamp: "2026-06-25T14:30:00Z",
        exposureScore: 68,
        riskLevel: "High",
        summary: "Your email address appears in 3 public developer portals, including outdated forums and exposed metadata on public Git commits. Username reuse has been detected across multiple platforms, slightly increasing risk profile.",
        categories: {
          socialProfiles: "Moderate",
          codeLeaks: "High",
          metadataExposure: "High",
          publicContactInfo: "Moderate",
          exposedCredentials: "Low"
        },
        recommendations: [
          "Enable PGP-encrypted signatures for public commits and configure Git user.email to use GitHub private email aliases.",
          "Remove public WHOIS registrations containing this direct contact details.",
          "Engage email masking techniques for general public SaaS profile creations.",
          "Purge legacy archived developer profiles on stackexchange/sourceforge servers."
        ],
        profilesFound: [
          { platform: "GitHub Caches", url: "https://github.com/jkbharti159", category: "Code Repository", status: "Public Contributor" },
          { platform: "Dev.to Forums", url: "https://dev.to/jkbharti159", category: "Social Portfolio", status: "Public Profile" },
          { platform: "StackOverflow Archive", url: "https://stackoverflow.com/users/jkbharti159", category: "Developer Community", status: "Legacy Account" },
          { platform: "WHOIS Domain Registration", url: "https://whois.com/query?jkbharti159", category: "Registry Data", status: "Exposed Metadata" }
        ],
        historyTimeline: [
          { date: "Jan", exposureScore: 35 },
          { date: "Feb", exposureScore: 40 },
          { date: "Mar", exposureScore: 48 },
          { date: "Apr", exposureScore: 50 },
          { date: "May", exposureScore: 55 },
          { date: "Jun", exposureScore: 68 }
        ]
      }
    ];
  });
  const [deepfakeHistory, setDeepfakeHistory] = useState<DeepfakeScanResult[]>([]);
  const [leakHistory, setLeakHistory] = useState<DataLeakResult[]>(() => {
    const cached = safeStorage.getItem("cyberkavach_leak_history");
    const cleared = safeStorage.getItem("cyberkavach_leak_cleared") === "true";
    if (cleared) return [];
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return [
      {
        id: "lk-1",
        query: "jkbharti159@gmail.com",
        timestamp: "2026-06-25T11:00:00Z",
        breachCount: 4,
        overallThreatLevel: "High",
        overallRiskScore: 78,
        riskScores: {
          identityRisk: 85,
          financialRisk: 62,
          privacyRisk: 90,
          professionalRisk: 75
        },
        scenarios: [
          {
            name: "Credential Stuffing Cascade",
            description: "Attackers leverage password/email pairs across common SaaS platforms. If password reuse exists, automated bot nets gain ingress to associated personal systems.",
            severity: "Critical",
            impactText: "Potential compromised access to secondary streaming, e-commerce, and cloud backup systems."
          },
          {
            name: "Spearphishing Campaigns",
            description: "Breached profile details are packaged with domain spoofing to create highly-targeted social engineering emails pretending to be bank or security agencies.",
            severity: "High",
            impactText: "High risk of subsequent ransomware triggers, financial scams, or corporate network compromises."
          },
          {
            name: "Identity Swapping / Account Hijack",
            description: "Correlating leaked email meta with phone databases provides attackers sufficient telemetry to request recovery triggers or social engineering on support portals.",
            severity: "High",
            impactText: "Risk of SIM swapping attempts, financial profile takeover, or professional communications spoofing."
          }
        ],
        breaches: [
          {
            source: "Legacy Developer Database Leak",
            date: "2024-11-12",
            compromisedData: ["Email addresses", "Passwords (hashed)", "Usernames", "IP Addresses"],
            description: "A major coding forum database was publicly dumped containing 4.5M user records. Security algorithms noted plain MD5 password hashing.",
            verified: true
          },
          {
            source: "E-Commerce Customer Portal Leak",
            date: "2025-05-18",
            compromisedData: ["Email addresses", "Names", "Billing addresses", "Phone numbers"],
            description: "A misconfigured PostgreSQL server was indexed publicly. Customer transaction registers were cached in automated scraping repositories.",
            verified: true
          }
        ],
        recommendations: [
          "Immediately audit password reuse and deploy a cryptographically-secure password manager.",
          "Initiate multi-factor authentication (MFA) using app authenticators, purging SMS alternatives.",
          "Submit opt-out requests on common public data aggregation directories.",
          "Audit professional email routing rules for unknown forwarding hooks or filters."
        ]
      }
    ];
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [historyLogs, setHistoryLogs] = useState<{ id: string; module: string; summary: string; timestamp: string; score: number }[]>([]);

  // History action handlers
  const handleAddFootprintScan = (item: FootprintScanResult) => {
    setScanHistory((prev) => {
      const next = [item, ...prev];
      safeStorage.setItem("cyberkavach_footprint_history", JSON.stringify(next));
      safeStorage.removeItem("cyberkavach_footprint_cleared");
      return next;
    });
  };

  const handleClearFootprintScans = () => {
    setScanHistory([]);
    safeStorage.setItem("cyberkavach_footprint_cleared", "true");
    safeStorage.removeItem("cyberkavach_footprint_history");
  };

  const handleDeleteFootprintScan = (id: string) => {
    setScanHistory((prev) => {
      const next = prev.filter(s => s.id !== id);
      if (next.length === 0) {
        safeStorage.setItem("cyberkavach_footprint_cleared", "true");
        safeStorage.removeItem("cyberkavach_footprint_history");
      } else {
        safeStorage.setItem("cyberkavach_footprint_history", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleAddLeakScan = (item: DataLeakResult) => {
    setLeakHistory((prev) => {
      const next = [item, ...prev];
      safeStorage.setItem("cyberkavach_leak_history", JSON.stringify(next));
      safeStorage.removeItem("cyberkavach_leak_cleared");
      return next;
    });
  };

  const handleClearLeakScans = () => {
    setLeakHistory([]);
    safeStorage.setItem("cyberkavach_leak_cleared", "true");
    safeStorage.removeItem("cyberkavach_leak_history");
  };

  const handleDeleteLeakScan = (id: string) => {
    setLeakHistory((prev) => {
      const next = prev.filter(s => s.id !== id);
      if (next.length === 0) {
        safeStorage.setItem("cyberkavach_leak_cleared", "true");
        safeStorage.removeItem("cyberkavach_leak_history");
      } else {
        safeStorage.setItem("cyberkavach_leak_history", JSON.stringify(next));
      }
      return next;
    });
  };

  const [progress, setProgress] = useState<LearningProgress>(() => {
    const cached = safeStorage.getItem("cyberkavach_progress");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // use default below
      }
    }
    return {
      xp: 450,
      level: 2,
      streakDays: 4,
      quizAccuracy: 92,
      completedQuizzes: 3,
      topicsMastered: ["PASSWORD"],
      cyberRank: "Threat Hunter",
      achievements: [
        {
          id: "ac-first",
          title: "First Blood",
          description: "Completed first security training scenario successfully.",
          unlockedAt: "2026-06-24T10:00:00Z",
          icon: "Trophy",
          xpValue: 100
        }
      ],
      weeklyActivity: [
        { day: "Mon", xp: 120 },
        { day: "Tue", xp: 145 },
        { day: "Wed", xp: 190 },
        { day: "Thu", xp: 210 },
        { day: "Fri", xp: 240 }
      ]
    };
  });

  const handleAddHistoryLog = (item: any) => {
    setHistoryLogs((prev) => [item, ...prev]);
  };

  const handleAddNotification = (notif: any) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateProgress = (updated: LearningProgress) => {
    setProgress(updated);
    safeStorage.setItem("cyberkavach_progress", JSON.stringify(updated));
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      safeStorage.setItem("cyberkavach_sidebar_collapsed", String(next));
      return next;
    });
  };

  const consoleOptions = [
    { id: "dashboard", label: "SOC Dashboard", icon: LayoutDashboard, desc: "Operational SOC feeds & real-time analytics" },
    { id: "analyzer", label: "Interactive Analyzer", icon: SearchCode, desc: "Punycode & Typosquatting inspection engine" },
    { id: "ml_diagnostics", label: "ML Pipelines & SHAP", icon: Cpu, desc: "Random Forest & gradient boosted decision trees" },
    { id: "threat_intel", label: "Threat Intelligence", icon: Database, desc: "Active malicious feed feeds & MITRE alignments" },
    { id: "ai_chat", label: "Copilot Chat Assistant", icon: MessageSquare, desc: "LLM contextual SOC threat intelligence chat" },
    { id: "footprint_scanner", label: "Footprint Scanner", icon: Globe, desc: "AI public digital exposure & OSINT" },
    { id: "deepfake_detector", label: "Deepfake Detector", icon: ShieldAlert, desc: "Identify GAN face & voice cloning" },
    { id: "data_leak_analyzer", label: "Leak Impact Analyzer", icon: Server, desc: "Credentials breaches & scenarios" },
    { id: "security_coach", label: "AI Security Coach", icon: Award, desc: "Interactive tactical scenarios quiz" }
  ];

  // Authenticate Session check on initial load
  useEffect(() => {
    if (!authLoading) {
      setAppIsLoading(false);
      if (session) {
        fetchStatsFeed();
      }
    }
  }, [authLoading, session]);

  const fetchStatsFeed = async () => {
    setStatsIsLoading(true);
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        if (data.recentAnalyses && data.recentAnalyses.length > 0 && !selectedAnalysis) {
          setSelectedAnalysis(data.recentAnalyses[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load SOC feed metrics:", err);
    } finally {
      setStatsIsLoading(false);
    }
  };

  const handleAnalyzeUrl = async (url: string): Promise<UrlAnalysisResult | null> => {
    setStatsIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token || ""}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis collapsed.");
      }

      const result: UrlAnalysisResult = await response.json();
      setSelectedAnalysis(result);
      
      // Instantly renew dashboard metrics
      await fetchStatsFeed();
      
      // Auto switch tabs to visualizer
      setActiveTab("analyzer");
      return result;
    } catch (err) {
      console.error("Scan compilation crashed:", err);
      safeAlert(err instanceof Error ? err.message : "Threat signature inspection failed.");
      return null;
    } finally {
      setStatsIsLoading(false);
    }
  };

  const handleAnalyzeBulkUrls = async (urls: string[]): Promise<UrlAnalysisResult[]> => {
    setStatsIsLoading(true);
    try {
      const response = await fetch("/api/analyze-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token || ""}`
        },
        body: JSON.stringify({ urls })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Batch execution collapsed.");
      }

      const data = await response.json();
      await fetchStatsFeed();
      return data.data || [];
    } catch (err) {
      console.error("Batch scan collapsed:", err);
      safeAlert(err instanceof Error ? err.message : "Batch analysis execution failed.");
      return [];
    } finally {
      setStatsIsLoading(false);
    }
  };

  if (appIsLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-cyan-400 font-mono select-none relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
          <div 
            className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
            style={{ backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(5).jpeg")' }}
          />
        </div>
        <div className="scanline z-10 opacity-30"></div>
        <div className="z-10 flex flex-col items-center">
          <Activity className="w-12 h-12 text-cyan-400 animate-spin mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300 animate-pulse">
            CONNECTING TO CYBERKAVACH HUD...
          </span>
        </div>
      </div>
    );
  }

  // Engage Authentication Screen if no active session
  if (!session) {
    return <AuthScreen />;
  }

  // Enforce Email Verification Sentinel for protected modules
  if (user && !user.emailVerified && !user.isAnonymous) {
    return <VerificationRequired />;
  }

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-200 overflow-hidden font-sans relative">
      
      {/* Background Image / Cyber Backdrop */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <img
          src="https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/Exploring%20the%20Future%20of%20Technology_%20Trends%20to%20Watch.jpeg"
          alt="Cybernetic Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-10 scale-105 animate-bg-pan-zoom"
        />
        <div className="absolute inset-0 bg-slate-950/90"></div>
      </div>
      
      {/* HUD SIDEBAR NAVIGATION */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={session} 
        onLogout={logout}
        onRoleSwitch={switchRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* PRIMARY CONSOLE WINDOW */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-h-0 min-w-0">
        <div className="scanline"></div>

        {/* TOP STATUS BAR */}
        <header className="h-14 border-b border-slate-800 flex justify-between items-center px-4 sm:px-6 bg-slate-950/50 backdrop-blur-md flex-shrink-0 z-10 print:hidden font-mono">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 bg-slate-950/90 transition-all cursor-pointer shadow-md flex items-center justify-center"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)] hidden sm:inline-block"></span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 hidden md:inline-block">Active Node:</span>
            <span className="text-[11px] uppercase font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 sm:px-2.5 py-1 rounded truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
              {consoleOptions.find(o => o.id === activeTab)?.label || activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] uppercase font-bold hidden xs:inline">Privilege:</span>
              <span className="text-[10px] font-bold text-cyan-400">{session.role.toUpperCase()}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] uppercase font-bold">Accuracy:</span>
              <span className="text-[10px] text-cyan-400 font-bold">99.98%</span>
            </div>

            {/* Developer Section (GitHub Profile Picture, Portfolio, LinkedIn) */}
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4 sm:pl-6 h-8">
              <div className="w-7 h-7 rounded-full border border-cyan-500/30 p-0.5 overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.15)] flex-shrink-0">
                <img 
                  src="https://github.com/jkbharti159.png" 
                  alt="Developer Profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <a 
                href="https://portfolio-w61x.onrender.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 hover:text-cyan-400 transition-colors"
                title="Developer Portfolio"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Portfolio</span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/jkbharti159/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 hover:text-cyan-400 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">LinkedIn</span>
              </a>
            </div>
          </div>
        </header>

        {/* COMPONENT ROUTER VIEWPORTS */}
        <div className="flex-1 flex overflow-hidden min-h-0 min-w-0">
          {activeTab === "dashboard" && (
            <DashboardOverview 
              stats={stats} 
              onSelectUrl={(item) => {
                setSelectedAnalysis(item);
                setActiveTab("analyzer");
              }} 
              isLoading={statsIsLoading}
              onRefresh={fetchStatsFeed}
            />
          )}

          {activeTab === "analyzer" && (
            <InteractiveAnalyzer 
              onAnalyze={handleAnalyzeUrl}
              onAnalyzeBulk={handleAnalyzeBulkUrls}
              selectedAnalysis={selectedAnalysis} 
              setSelectedAnalysis={setSelectedAnalysis} 
              isLoading={statsIsLoading}
            />
          )}

          {activeTab === "ml_diagnostics" && (
            <MlDiagnostics />
          )}

          {activeTab === "threat_intel" && (
            <ThreatIntelligencePanel />
          )}

          {activeTab === "ai_chat" && (
            <SecurityCopilot urlAnalysisContext={selectedAnalysis} />
          )}

          {activeTab === "footprint_scanner" && (
            <DigitalFootprintScanner 
              scanHistory={scanHistory} 
              onAddHistory={handleAddHistoryLog}
              onAddNotification={handleAddNotification}
              onDeleteScan={handleDeleteFootprintScan}
              onClearHistory={handleClearFootprintScans}
              onAddScan={handleAddFootprintScan}
            />
          )}

          {activeTab === "deepfake_detector" && (
            <DeepfakeDetector 
              scanHistory={deepfakeHistory}
              onAddHistory={handleAddHistoryLog}
              onAddNotification={handleAddNotification}
              onDeleteScan={(id) => setDeepfakeHistory(prev => prev.filter(s => s.id !== id))}
            />
          )}

          {activeTab === "data_leak_analyzer" && (
            <DataLeakAnalyzer 
              scanHistory={leakHistory}
              onAddHistory={handleAddHistoryLog}
              onAddNotification={handleAddNotification}
              onDeleteScan={handleDeleteLeakScan}
              onClearHistory={handleClearLeakScans}
              onAddScan={handleAddLeakScan}
            />
          )}

          {activeTab === "security_coach" && (
            <SecurityCoach 
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onAddNotification={handleAddNotification}
            />
          )}
        </div>

      </main>
    </div>
  );
}
