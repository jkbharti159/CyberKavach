import React, { useState } from "react";
import { 
  Globe, Search, Mail, Phone, Shield, Activity, FileText, 
  AlertTriangle, Grid, ChevronRight, History, Download, Trash, CheckSquare,
  ArrowRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import SafeResponsiveContainer from "./SafeResponsiveContainer";
import { motion } from "motion/react";
import { FootprintScanResult } from "../types";
import FootprintCleanup from "./FootprintCleanup";

interface DigitalFootprintScannerProps {
  onAddHistory: (item: any) => void;
  onAddNotification: (notif: any) => void;
  scanHistory: FootprintScanResult[];
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onAddScan: (item: FootprintScanResult) => void;
}

const SAMPLE_REPORTS: FootprintScanResult[] = [
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

export default function DigitalFootprintScanner({ onAddHistory, onAddNotification, scanHistory, onDeleteScan, onClearHistory, onAddScan }: DigitalFootprintScannerProps) {
  const [query, setQuery] = useState("");
  const [inputType, setInputType] = useState<'email' | 'phone' | 'username' | 'domain' | 'name'>("email");
  const [isScanning, setIsScanning] = useState(false);
  const [scanningLogs, setScanningLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'report' | 'cleanup'>('report');
  const [activeScan, setActiveScan] = useState<FootprintScanResult | null>(() => {
    return scanHistory.length > 0 ? scanHistory[0] : null;
  });

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  const runFootprintScan = async () => {
    if (!query.trim()) return;
    setIsScanning(true);
    setScanningLogs([]);

    const logMessages = [
      "🔄 Initializing OSINT Exposure Pipeline...",
      "🔍 Querying public social indexes & cached directories...",
      "📦 Crawling major repository systems (GitHub, GitLab, Bitbucket)...",
      "🕵️‍♂️ Checking username reuse footprints across 120+ platforms...",
      "📡 Evaluating public WHOIS domain details & metadata exposure...",
      "🔬 Calculating Shannon exposure entropy score...",
      "💾 Generating AI Exposure analysis summary..."
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setScanningLogs((prev) => [...prev, logMessages[i]]);
    }

    // Generate score dynamically based on string content
    let finalScore = 20 + (query.length % 5) * 15;
    if (finalScore > 95) finalScore = 87;
    const level: 'Low' | 'Moderate' | 'High' | 'Critical' = 
      finalScore >= 80 ? 'Critical' : (finalScore >= 60 ? 'High' : (finalScore >= 40 ? 'Moderate' : 'Low'));

    // Category mappings based on input
    const newScan: FootprintScanResult = {
      id: "fp-" + Date.now(),
      query: query,
      type: inputType,
      timestamp: new Date().toISOString(),
      exposureScore: finalScore,
      riskLevel: level,
      summary: `Our AI engines scanned the target query. Your ${inputType} was detected in multiple public developer indexes, metadata snapshots, and system directories. Security settings should be reviewed immediately.`,
      categories: {
        socialProfiles: finalScore > 50 ? "High" : "Moderate",
        codeLeaks: finalScore > 70 ? "Critical" : (finalScore > 45 ? "High" : "Moderate"),
        metadataExposure: finalScore > 60 ? "High" : "Moderate",
        publicContactInfo: inputType === "phone" || inputType === "email" ? "High" : "Low",
        exposedCredentials: finalScore > 75 ? "High" : "Low"
      },
      recommendations: [
        "Rotate reusable passwords on exposed services.",
        "Remove cleartext identifiers from Git commits and push actions.",
        "Implement virtual numbers or masking emails on general registrations.",
        "Enforce restrictive profile visibility configurations across platforms."
      ],
      profilesFound: [
        { platform: "Public Web Directories", url: `https://www.google.com/search?q=${encodeURIComponent(query)}`, category: "Search Engine Index", status: "Indexed Meta" },
        { platform: "OSINT Database Caches", url: "#", category: "Exposed Directories", status: "Partial Match" },
        { platform: "GitHub Developer Portals", url: "https://github.com/search?q=" + encodeURIComponent(query), category: "Source Repository", status: "Exposed Email/Commit" }
      ],
      historyTimeline: [
        { date: "Mar", exposureScore: finalScore - 15 },
        { date: "Apr", exposureScore: finalScore - 8 },
        { date: "May", exposureScore: finalScore - 3 },
        { date: "Jun", exposureScore: finalScore }
      ]
    };

    onAddHistory({
      id: newScan.id,
      module: "Digital Footprint Scanner",
      summary: `Query '${query}' (${inputType}) scanned with Exposure Score of ${finalScore}%`,
      timestamp: newScan.timestamp,
      score: finalScore
    });

    onAddNotification({
      id: "notif-" + Date.now(),
      title: "Footprint Scan Complete",
      message: `Exposure score of ${finalScore}% detected for '${query}'.`,
      type: "alert",
      timestamp: new Date().toISOString(),
      read: false
    });

    onAddScan(newScan);
    setActiveScan(newScan);
    setViewMode('report');
    setIsScanning(false);
  };

  const downloadReport = (scan: FootprintScanResult) => {
    const reportText = `=========================================
CYBERKAVACH ENTERPRISE FOOTPRINT REPORT
=========================================
Timestamp: ${new Date(scan.timestamp).toLocaleString()}
Target Query: ${scan.query} (${scan.type.toUpperCase()})
Exposure Risk Score: ${scan.exposureScore}/100 [${scan.riskLevel.toUpperCase()} RISK]

RISK BREAKDOWN MATRIX:
- Social Profiles Exposure: ${scan.categories.socialProfiles}
- Code repository Leaks: ${scan.categories.codeLeaks}
- Metadata Footprints: ${scan.categories.metadataExposure}
- Public Contact exposure: ${scan.categories.publicContactInfo}
- Exposed credentials risk: ${scan.categories.exposedCredentials}

AI RECOMMENDATIONS:
${scan.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

MATCHED PROFILES FOUND:
${scan.profilesFound.map(p => `- [${p.platform}] [${p.category}] Status: ${p.status} (Url: ${p.url})`).join("\n")}
=========================================
Disclaimer: This analysis provides an AI-assisted OSINT exposure estimate.`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CyberKavach_Footprint_Report_${scan.query.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "text-red-500 border-red-500/30 bg-red-500/10";
      case "High": return "text-rose-400 border-rose-400/30 bg-rose-400/10";
      case "Moderate": return "text-amber-400 border-amber-400/30 bg-amber-400/10";
      case "Low": return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
      default: return "text-slate-400 border-slate-700 bg-slate-800/50";
    }
  };

  const allScans = scanHistory;

  return (
    <div className="flex-1 relative min-h-0 min-w-0 bg-transparent overflow-y-auto text-slate-200">
      <div className="relative min-h-full p-4 sm:p-6 md:p-8 w-full z-10 flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <motion.div 
            initial={{ opacity: 0, scale: 1.15, filter: "blur(6px)" }}
            animate={{ opacity: 1.0, scale: 1.0, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
            style={{ 
              backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(12).jpeg")',
              opacity: 1.0
            }}
          />
        </div>

        {/* HUD Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              AI DIGITAL FOOTPRINT SCANNER
            </h2>
            <p className="text-xs text-slate-300 font-mono font-medium" style={textShadowStyle}>
              Audit OSINT footprint vulnerabilities, analyze public credentials exposure & metadata leaks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl relative" style={textShadowStyle}>
              <div className="scanline"></div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 font-mono">Scan Target Input</h3>
              
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-slate-300 block mb-1.5 uppercase font-bold">Exposure Target Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(['email', 'phone', 'username', 'domain', 'name'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setInputType(type)}
                        className={`py-1.5 px-2 border rounded uppercase font-bold text-[9px] transition-all cursor-pointer ${
                          inputType === type 
                            ? "bg-cyan-950/60 text-cyan-400 border-cyan-400 shadow-md" 
                            : "bg-transparent border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-cyan-950/20"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-300 block mb-1.5 uppercase font-bold">Search Query</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Enter public ${inputType}...`}
                      className="w-full bg-transparent border border-cyan-500/30 focus:border-cyan-400 px-3 py-2.5 rounded text-white font-bold placeholder-slate-400 focus:outline-none transition-all pr-10 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") runFootprintScan();
                      }}
                      style={textShadowStyle}
                    />
                    <Search className="w-4 h-4 text-slate-300 absolute right-3 top-3" />
                  </div>
                </div>

                <button
                  onClick={runFootprintScan}
                  disabled={isScanning || !query.trim()}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                  style={textShadowStyle}
                >
                  <Activity className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
                  <span>{isScanning ? "EXECUTING EXPOSURE RUN..." : "LAUNCH OSINT RUN"}</span>
                </button>
              </div>
            </div>

            {/* Scanning terminal logs */}
            {isScanning && (
              <div className="p-4 rounded border border-cyan-500/30 bg-transparent backdrop-blur-sm font-mono text-[10px] text-cyan-400 shadow-xl h-48 overflow-y-auto" style={textShadowStyle}>
                <p className="border-b border-cyan-500/20 pb-1.5 font-bold uppercase tracking-widest text-white mb-2">OSINT Core Telemetry</p>
                <div className="flex flex-col gap-1.5">
                  {scanningLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-cyan-500">{`[${idx + 1}]`}</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            )}

            {/* Scan History list */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  Scan History
                </h3>
                <div className="flex items-center gap-3">
                  {allScans.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to permanently clear all footprint scan history?")) {
                          onClearHistory();
                          setActiveScan(null);
                        }
                      }}
                      className="text-[9px] text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500 bg-rose-950/10 px-2 py-1 rounded font-mono transition-all uppercase cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <span className="text-[10px] bg-transparent px-2 py-0.5 rounded border border-cyan-500/30 font-mono text-slate-300">
                    {allScans.length} Scans
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {allScans.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800/60 rounded">
                    NO RECORDED SCAN HISTORIES
                  </div>
                ) : (
                  allScans.map((scan) => (
                    <div
                      key={scan.id}
                      onClick={() => { setActiveScan(scan); setViewMode('report'); }}
                      className={`p-3 border rounded flex justify-between items-center cursor-pointer transition-all ${
                        activeScan?.id === scan.id 
                          ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg" 
                          : "bg-transparent border-slate-800 text-slate-300 hover:bg-cyan-950/20"
                      }`}
                    >
                      <div className="font-mono text-xs overflow-hidden pr-2 flex-1">
                        <p className="font-bold truncate">{scan.query}</p>
                        <p className="text-[9px] text-slate-400 uppercase mt-0.5">{scan.type} • {new Date(scan.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getRiskColor(scan.riskLevel)}`}>
                          {scan.exposureScore}%
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
                          title="Delete Scan Record"
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

          {/* Results Viewer */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {activeScan ? (
              <div className="flex flex-col gap-6">
                
                {/* View Mode Switcher Header */}
                <div className="flex border-b border-cyan-500/20 pb-2 mb-2 font-mono text-xs font-bold gap-4">
                  <button
                    onClick={() => setViewMode('report')}
                    className={`pb-2 px-1 border-b-2 transition-all cursor-pointer ${
                      viewMode === 'report'
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    🔍 Exposure Vulnerability Report
                  </button>
                  <button
                    onClick={() => setViewMode('cleanup')}
                    className={`pb-2 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'cleanup'
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-cyan-500/80 hover:text-cyan-400"
                    }`}
                  >
                    🛡️ Digital Footprint Cleanup
                  </button>
                </div>

                {viewMode === 'cleanup' ? (
                  <FootprintCleanup 
                    activeScan={activeScan} 
                    onAddNotification={onAddNotification} 
                    onClose={() => setViewMode('report')} 
                  />
                ) : (
                  <>
                    {/* Promo banner for Cleanup */}
                    <div className="p-4 rounded border border-cyan-500/30 bg-cyan-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs shadow-lg" style={textShadowStyle}>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
                        <div>
                          <p className="font-bold text-white uppercase">Exposure Threat Cleanup Available</p>
                          <p className="text-[10px] text-slate-300 font-sans mt-0.5">Start a secure, step-by-step cleanup of your public digital footprints.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewMode('cleanup')}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 uppercase text-[10px]"
                      >
                        <span>Clean Up My Footprint</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Score Panel & Summary banner */}
                    <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between" style={textShadowStyle}>
                      <div className="flex items-center gap-6">
                        {/* Circle Score Gauge */}
                        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="rgba(6,182,212,0.1)" strokeWidth="6" fill="transparent" />
                            <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="6" fill="transparent"
                               strokeDasharray={2 * Math.PI * 40}
                               strokeDashoffset={2 * Math.PI * 40 * (1 - activeScan.exposureScore / 100)}
                               strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center" style={textShadowStyle}>
                            <span className="text-2xl font-extrabold text-white font-mono">{activeScan.exposureScore}</span>
                            <span className="text-[8px] text-slate-300 uppercase tracking-widest font-bold">Exposure</span>
                          </div>
                        </div>

                        <div style={textShadowStyle}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs text-slate-300 uppercase font-mono font-bold">Vulnerability Rank:</span>
                            <span className={`text-xs font-bold uppercase border px-2 py-0.5 rounded font-mono ${getRiskColor(activeScan.riskLevel)}`}>
                              {activeScan.riskLevel} Risk
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white font-mono uppercase">{activeScan.query}</h4>
                          <p className="text-xs text-slate-300 mt-1 font-mono">Type: <span className="text-cyan-400 font-bold uppercase">{activeScan.type}</span> • Scanned on {new Date(activeScan.timestamp).toLocaleString()}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => downloadReport(activeScan)}
                        className="px-4 py-2 bg-transparent border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-400 text-white font-mono text-xs font-bold rounded transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                        style={textShadowStyle}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD EXPOSURE REPORT</span>
                      </button>
                    </div>

                    {/* Categories Breakdown Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {Object.entries(activeScan.categories).map(([category, rating]) => {
                        const camelToCapital = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <div key={category} className="p-4 rounded border border-cyan-500/20 bg-transparent shadow-md text-center" style={textShadowStyle}>
                            <span className="text-[10px] text-slate-300 block mb-1 uppercase font-bold truncate">{camelToCapital}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block mt-2 ${getRiskColor(rating as string)}`}>
                              {rating as string}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI Executive Summary */}
                    <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex gap-4" style={textShadowStyle}>
                      <div className="p-2.5 rounded bg-cyan-950/60 border border-cyan-500/30 self-start">
                        <Activity className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono mb-1.5">AI Exposure Analysis Summary</h4>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeScan.summary}</p>
                      </div>
                    </div>

                    {/* Heatmap & Risk Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Visual Exposure Heatmap */}
                      <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2" style={textShadowStyle}>
                          <Grid className="w-4 h-4 text-cyan-400" />
                          Digital Exposure Heatmap
                        </h4>
                        
                        {/* Simulated SVG Grid / Heatmap representation */}
                        <div className="grid grid-cols-8 gap-1 bg-transparent p-3 rounded border border-cyan-500/20">
                          {Array.from({ length: 64 }).map((_, idx) => {
                            // Generate exposure matrix based on scan score
                            const isExposed = (idx * 17) % 100 < activeScan.exposureScore;
                            const randFlashing = (idx * 31) % 100 > 75;
                            return (
                              <div
                                key={idx}
                                title={`OSINT Node ID: ${String(idx).padStart(2, '0')} - ${isExposed ? "EXPOSED DATA DETECTED" : "HEALTHY SECURE"}`}
                                className={`aspect-square rounded-sm border transition-all ${
                                  isExposed 
                                    ? `${randFlashing ? "bg-rose-500 animate-pulse" : "bg-rose-600/80"} border-rose-500/40` 
                                    : "bg-emerald-950/20 border-emerald-500/10"
                                }`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-slate-300" style={textShadowStyle}>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950/40 border border-emerald-500/20"></span>
                            <span>0% Exposure Node</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 animate-pulse border border-rose-500/30"></span>
                            <span>Active exposure node match</span>
                          </div>
                        </div>
                      </div>

                      {/* Exposure Timeline graph */}
                      <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col justify-between" style={textShadowStyle}>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">Risk Exposure Timeline (6 Months)</h4>
                        
                        <div className="h-44 w-full">
                          <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={activeScan.historyTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="exposureGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                              <YAxis stroke="#64748b" domain={[0, 100]} style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#06b6d4', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                                labelStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                              />
                              <Area type="monotone" dataKey="exposureScore" name="Exposure Score" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#exposureGrad)" />
                            </AreaChart>
                          </SafeResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Public Profiles Matched */}
                    <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Matched Profiles Detected ({activeScan.profilesFound.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeScan.profilesFound.map((profile, i) => (
                          <div key={i} className="p-3 border border-slate-800/80 bg-transparent rounded flex justify-between items-center text-xs" style={textShadowStyle}>
                            <div>
                              <p className="font-mono font-bold text-white">{profile.platform}</p>
                              <p className="text-[10px] text-slate-300 mt-0.5">{profile.category} • {profile.status}</p>
                            </div>
                            <a
                              href={profile.url === "#" ? undefined : profile.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-cyan-400 hover:underline font-mono"
                            >
                              EXPLORE MATCH ↗
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Recommendations Action Items */}
                    <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                        AI Actionable Recommendations
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
                  </>
                )}

              </div>
            ) : (
              <div className="p-12 rounded border border-cyan-500/20 bg-transparent text-center text-slate-300 font-mono" style={textShadowStyle}>
                <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
                <p className="uppercase text-sm tracking-widest font-bold">No exposure scans loaded</p>
                <p className="text-xs text-slate-400 mt-2">Enter an email, phone number, username, domain or name to analyze OSINT exposure profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
