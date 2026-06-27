import React, { useState } from "react";
import { 
  ShieldAlert, Mail, Phone, Globe, User, Search, History, Download, 
  CheckSquare, Activity, AlertTriangle, ArrowRight, Server, ShieldCheck, ChevronRight, Trash
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import SafeResponsiveContainer from "./SafeResponsiveContainer";
import { motion } from "motion/react";
import { DataLeakResult } from "../types";

interface DataLeakAnalyzerProps {
  onAddHistory: (item: any) => void;
  onAddNotification: (notif: any) => void;
  scanHistory: DataLeakResult[];
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onAddScan: (item: DataLeakResult) => void;
}

const SAMPLE_LEAKS: DataLeakResult[] = [
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

export default function DataLeakAnalyzer({ onAddHistory, onAddNotification, scanHistory, onDeleteScan, onClearHistory, onAddScan }: DataLeakAnalyzerProps) {
  const [query, setQuery] = useState("");
  const [activeScan, setActiveScan] = useState<DataLeakResult | null>(() => {
    return scanHistory.length > 0 ? scanHistory[0] : null;
  });
  const [isSearching, setIsSearching] = useState(false);
  const [activeChainStep, setActiveChainStep] = useState(0);

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  const handleBreachSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setActiveChainStep(0);

    // Simulate database querying delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const finalRisk = 30 + (query.length % 7) * 10;
    const level: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical' = 
      finalRisk >= 80 ? 'Critical' : (finalRisk >= 60 ? 'High' : (finalRisk >= 40 ? 'Medium' : (finalRisk >= 20 ? 'Low' : 'Safe')));

    const newResult: DataLeakResult = {
      id: "lk-" + Date.now(),
      query,
      timestamp: new Date().toISOString(),
      breachCount: finalRisk > 40 ? Math.floor(finalRisk / 15) : 0,
      overallThreatLevel: level,
      overallRiskScore: finalRisk,
      riskScores: {
        identityRisk: Math.min(finalRisk + 10, 100),
        financialRisk: Math.max(finalRisk - 15, 0),
        privacyRisk: Math.min(finalRisk + 15, 100),
        professionalRisk: Math.max(finalRisk - 5, 0)
      },
      scenarios: [
        {
          name: "Automatic Brute-Forcing (Stuffing)",
          description: "Attackers script bots to inject leaked password hashes across top 500 corporate portals, banking sites, and social platforms.",
          severity: finalRisk > 60 ? "Critical" : "Medium",
          impactText: "Unauthorized logins on non-MFA portals."
        },
        {
          name: "Spearphishing Lure campaigns",
          description: "Malicious elements craft customized phish lures leveraging exact leak indicators to trick targets into approving recovery requests.",
          severity: "High",
          impactText: "Triggering of corporate ransomware downloads."
        }
      ],
      breaches: finalRisk > 40 ? [
        {
          source: "Simulated Cyber Leak Repository",
          date: "2025-08-10",
          compromisedData: ["Email", "IP addresses", "Username"],
          description: "Compromised credential dump compiled from multiple darknet paste dumps.",
          verified: true
        }
      ] : [],
      recommendations: [
        "Change credentials across sensitive portals.",
        "Enable FIDO2 hardware security keys if supported.",
        "Add alert parameters on monitoring networks."
      ]
    };

    onAddHistory({
      id: newResult.id,
      module: "Data Leak impact Analyzer",
      summary: `Credential query '${query}' audited. Risk Score: ${finalRisk}%`,
      timestamp: newResult.timestamp,
      score: finalRisk
    });

    onAddNotification({
      id: "notif-" + Date.now(),
      title: "Leak Impact Audited",
      message: `Checked leaks for '${query}'. Overall threat: ${level}`,
      type: "breach",
      timestamp: new Date().toISOString(),
      read: false
    });

    onAddScan(newResult);
    setActiveScan(newResult);
    setIsSearching(false);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical": return "text-red-500 border-red-500/30 bg-red-500/10";
      case "High": return "text-rose-400 border-rose-400/30 bg-rose-400/10";
      case "Medium": return "text-amber-400 border-amber-400/30 bg-amber-400/10";
      case "Low": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      default: return "text-slate-400 border-slate-700 bg-slate-800/50";
    }
  };

  const downloadImpactReport = (scan: DataLeakResult) => {
    const textReport = `=========================================
CYBERKAVACH LEAK IMPACT ANALYSIS REPORT
=========================================
Audit Timestamp: ${new Date(scan.timestamp).toLocaleString()}
Target Query: ${scan.query}
Found In: ${scan.breachCount} Known Public Breaches
Overall Threat Index: ${scan.overallRiskScore}/100 [${scan.overallThreatLevel.toUpperCase()}]

CRITICAL IMPACT SCENARIOS ANALYSIS:
${scan.scenarios.map(sc => `- [${sc.name}] (Severity: ${sc.severity})
  Impact: ${sc.impactText}
  Description: ${sc.description}`).join("\n\n")}

ACTIONABLE CONTAINMENT CHECKLIST:
${scan.recommendations.map((rec, i) => `[ ] ${i + 1}. ${rec}`).join("\n")}

=========================================
Disclaimer: Relies on compiled open intelligence data. Change keys immediately.`;

    const blob = new Blob([textReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CyberKavach_Leak_Impact_Report_${scan.query.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const allScans = scanHistory;

  // Attack chain steps definition
  const attackChainSteps = [
    { title: "Public Breach Leak", desc: "Attackers aggregate historical dumped credentials.", icon: Server, color: "border-slate-800 text-slate-400" },
    { title: "Credential Stuffing", desc: "Automated scripts test password hashes across SaaS networks.", icon: Search, color: "border-cyan-500/40 text-cyan-400" },
    { title: "Privileged Ingress", desc: "Insecure secondary profiles are breached.", icon: ShieldAlert, color: "border-amber-500/40 text-amber-400" },
    { title: "Target Hijack", desc: "Ransomware trigger, data exfiltration or phishing lure launches.", icon: AlertTriangle, color: "border-rose-500/40 text-rose-500 animate-pulse" }
  ];

  return (
    <div className="flex-1 relative min-h-0 min-w-0 bg-transparent overflow-y-auto text-slate-200">
      <div className="relative min-h-full p-4 sm:p-6 md:p-8 w-full z-10 flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <motion.img 
            initial={{ opacity: 0, scale: 1.15, filter: "blur(6px)" }}
            animate={{ opacity: 1.0, scale: 1.0, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            src="https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(13).jpeg"
            alt="Leak Analyzer Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover animate-bg-pan-zoom"
          />
        </div>

        {/* HUD Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <Server className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              AI DATA LEAK IMPACT ANALYZER
            </h2>
            <p className="text-xs text-slate-300 font-mono font-medium" style={textShadowStyle}>
              Track compromised credentials, estimate automated attack scenarios, and trace impact vectors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl relative" style={textShadowStyle}>
              <div className="scanline"></div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 font-mono">Breach Intelligence Lookup</h3>
              
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-slate-300 block mb-1.5 uppercase font-bold">Credential Target Identifier</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter Email, Username, Phone, Domain..."
                      className="w-full bg-transparent border border-cyan-500/30 focus:border-cyan-400 px-3 py-2.5 rounded text-white font-bold placeholder-slate-400 focus:outline-none transition-all pr-10 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleBreachSearch();
                      }}
                      style={textShadowStyle}
                    />
                    <Search className="w-4 h-4 text-slate-300 absolute right-3 top-3" />
                  </div>
                </div>

                <button
                  onClick={handleBreachSearch}
                  disabled={isSearching || !query.trim()}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                  style={textShadowStyle}
                >
                  <Activity className={`w-4 h-4 ${isSearching ? "animate-spin" : ""}`} />
                  <span>{isSearching ? "INTELLIGENCE SYNCING..." : "SEARCH DUMPS"}</span>
                </button>
              </div>
            </div>

            {/* List of audited queries */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  Audited Queries History
                </h3>
                <div className="flex items-center gap-3">
                  {allScans.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to permanently clear all audit history logs?")) {
                          onClearHistory();
                          setActiveScan(null);
                        }
                      }}
                      className="text-[9px] text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500 bg-transparent px-2 py-1 rounded font-mono transition-all uppercase cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <span className="text-[10px] bg-transparent px-2 py-0.5 rounded border border-cyan-500/30 font-mono text-slate-300">
                    {allScans.length} Audits
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {allScans.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-mono border border-dashed border-cyan-500/20 rounded">
                    NO RECORDED AUDIT HISTORIES
                  </div>
                ) : (
                  allScans.map((scan) => (
                    <div
                      key={scan.id}
                      onClick={() => setActiveScan(scan)}
                      className={`p-3 border rounded flex justify-between items-center cursor-pointer transition-all ${
                        activeScan?.id === scan.id 
                          ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg" 
                          : "bg-transparent border-slate-800 text-slate-300 hover:bg-cyan-950/20"
                      }`}
                    >
                      <div className="font-mono text-xs overflow-hidden pr-2 flex-1">
                        <p className="font-bold truncate">{scan.query}</p>
                        <p className="text-[9px] text-slate-400 uppercase mt-0.5">{scan.breachCount} Breaches found</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getSeverityStyle(scan.overallThreatLevel)}`}>
                          {scan.overallRiskScore}%
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteScan(scan.id);
                            if (activeScan?.id === scan.id) {
                              setActiveScan(null);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-cyan-950/20 transition-all cursor-pointer"
                          title="Delete Audit Record"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Details Output */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {activeScan ? (
              <div className="flex flex-col gap-6">
                
                {/* Visual scorecard banner */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between" style={textShadowStyle}>
                  <div className="flex items-center gap-6">
                    {/* Score gauge circle */}
                    <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                        <circle cx="50" cy="50" r="40" stroke="#f43f5e" strokeWidth="6" fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - activeScan.overallRiskScore / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center" style={textShadowStyle}>
                        <span className="text-2xl font-extrabold text-white font-mono">{activeScan.overallRiskScore}%</span>
                        <span className="text-[8px] text-slate-300 uppercase tracking-widest font-bold">Threat level</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                        <span className="text-slate-300 uppercase font-bold">Exposed Data:</span>
                        <span className={`font-bold px-2 py-0.5 rounded border ${getSeverityStyle(activeScan.overallThreatLevel)}`}>
                          {activeScan.breachCount > 0 ? `${activeScan.breachCount} PUBLIC BREACHES` : "CLEAR SECURE RECORD"}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white font-mono uppercase">{activeScan.query}</h4>
                      <p className="text-xs text-slate-300 mt-1 font-mono">Checked on {new Date(activeScan.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadImpactReport(activeScan)}
                    className="px-4 py-2 bg-transparent border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-400 text-white font-mono text-xs font-bold rounded transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                    style={textShadowStyle}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD COMPROMISE REPORT</span>
                  </button>
                </div>

                {/* Risk Subsections breakdown chart */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col justify-between" style={textShadowStyle}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">Risk Dimensions Breakdown</h4>
                  
                  <div className="h-48 w-full">
                    <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={[
                        { name: "Identity Risk", score: activeScan.riskScores.identityRisk },
                        { name: "Financial Risk", score: activeScan.riskScores.financialRisk },
                        { name: "Privacy Risk", score: activeScan.riskScores.privacyRisk },
                        { name: "Professional Risk", score: activeScan.riskScores.professionalRisk }
                      ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                        <YAxis stroke="#64748b" domain={[0, 100]} style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#06b6d4', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                        />
                        <Bar dataKey="score" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </SafeResponsiveContainer>
                  </div>
                </div>

                {/* Interactive Attack Chain Diagram */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">Cyber Threat Attack Chain Scenario</h4>
                    <p className="text-[9px] text-slate-300 uppercase font-mono">Interactive vulnerability progression roadmap</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                    {attackChainSteps.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isActive = activeChainStep === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveChainStep(idx)}
                          className={`p-4 border rounded cursor-pointer transition-all flex flex-col gap-2 relative ${
                            isActive 
                              ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg" 
                              : "bg-transparent border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-cyan-950/20"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] font-bold">STAGE 0{idx + 1}</span>
                            <StepIcon className="w-4 h-4 text-cyan-400" />
                          </div>
                          <h5 className="font-mono font-bold text-xs mt-1 text-slate-200">{step.title}</h5>
                          <p className="text-[10px] text-slate-300 leading-normal">{step.desc}</p>
                          {idx < 3 && (
                            <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
                              <ArrowRight className="w-4 h-4 text-cyan-500" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specific compromise reports list */}
                {activeScan.breaches.length > 0 && (
                  <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Breach Intelligence Matches</h4>
                    <div className="flex flex-col gap-4">
                      {activeScan.breaches.map((breach, i) => (
                        <div key={i} className="p-4 border border-slate-800/80 bg-transparent rounded flex flex-col gap-2 font-sans text-xs" style={textShadowStyle}>
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-white">{breach.source}</span>
                            <span className="text-[10px] text-rose-400 font-mono">Date: {breach.date}</span>
                          </div>
                          <p className="text-slate-300">{breach.description}</p>
                          <div className="flex gap-1.5 flex-wrap mt-1">
                            {breach.compromisedData.map((data, idx) => (
                              <span key={idx} className="text-[9px] bg-transparent text-slate-300 px-2 py-0.5 rounded border border-cyan-500/30 font-mono">
                                {data}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scenarios severity overview */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">High Probability Attack Scenarios</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeScan.scenarios.map((sc, i) => (
                      <div key={i} className="p-4 bg-transparent border border-slate-800/80 rounded font-sans text-xs flex flex-col gap-2 justify-between" style={textShadowStyle}>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-white">{sc.name}</span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${getSeverityStyle(sc.severity)}`}>
                              {sc.severity}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-2 leading-relaxed">{sc.description}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px]">
                          <span className="text-rose-400 font-bold block mb-0.5">ESTIMATED IMPACT:</span>
                          <span className="text-slate-400">{sc.impactText}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Containment Checklist */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    AI Actionable Recommendations Checklist
                  </h4>
                  <div className="flex flex-col gap-3 font-sans text-xs text-slate-200">
                    {activeScan.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 items-start border-l-2 border-cyan-500/40 pl-3 py-1 bg-transparent">
                        <span className="font-mono text-cyan-400 font-bold">{i + 1}.</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 rounded border border-cyan-500/20 bg-transparent text-center text-slate-300 font-mono" style={textShadowStyle}>
                <ShieldAlert className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
                <p className="uppercase text-sm tracking-widest font-bold">No Compromise Scans Audited</p>
                <p className="text-xs text-slate-400 mt-2">Enter credentials above to sync public breach dumps and map impact vectors.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
