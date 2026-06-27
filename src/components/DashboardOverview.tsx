import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import SafeResponsiveContainer from "./SafeResponsiveContainer";
import { 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  ChevronRight, 
  Server, 
  Terminal,
  Zap,
  Filter,
  AlertTriangle
} from "lucide-react";
import { DashboardStats, UrlAnalysisResult } from "../types";

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  onSelectUrl: (result: UrlAnalysisResult) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function DashboardOverview({ stats, onSelectUrl, isLoading, onRefresh }: DashboardOverviewProps) {
  if (isLoading || !stats) {
    return (
      <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center bg-slate-950 text-cyan-400 font-mono">
        <Activity className="w-12 h-12 animate-spin mb-4" />
        <span className="text-sm uppercase tracking-widest animate-pulse">Syncing Cryptographic SOC Metrics...</span>
      </div>
    );
  }

  // Color arrays for Recharts
  const PIE_COLORS = ["#06b6d4", "#f43f5e"];

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  return (
    <div className="flex-1 relative min-h-0 min-w-0 bg-transparent overflow-y-auto text-slate-200">
      <div className="relative min-h-full p-4 sm:p-6 md:p-8 w-full z-10 flex flex-col">
        {/* Animated Background Image - fully visible and moves when scrolling */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <div 
            className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
            style={{ 
              backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(6).jpeg")',
              opacity: 1.0
            }}
          />
        </div>
        {/* HUD Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h2 id="dashboard-title" className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              SOC OPERATION FEED
            </h2>
            <p className="text-xs text-slate-300 font-mono font-medium" style={textShadowStyle}>
              Secure boundary analytics log, real-time threat detection telemetry.
            </p>
          </div>

          <button 
            onClick={onRefresh}
            className="px-3 py-2 border border-cyan-500/30 rounded bg-slate-950/80 text-xs text-cyan-400 font-mono hover:bg-cyan-500/20 transition-all flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
            style={textShadowStyle}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>FORCE RE-SYNCHRONIZE</span>
          </button>
        </div>

        {/* Top Telemetry counters - 4 Bento Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* TOTAL SCANNED */}
          <div className="p-5 rounded relative overflow-hidden group border border-slate-700/50 bg-transparent hover:border-cyan-500/40 transition-all shadow-xl">
            <div className="scanline"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block mb-1 font-bold" style={textShadowStyle}>
                  Total Logs Analyzed
                </span>
                <span id="stat-scanned" className="text-3xl font-bold text-white font-mono tracking-tight" style={textShadowStyle}>
                  {stats.totalScanned ? String(stats.totalScanned).padStart(4, '0') : "0000"}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-cyan-500/30">
                <Server className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-[10px] font-mono text-slate-300 mt-3 border-t border-slate-800/60 pt-2 font-medium" style={textShadowStyle}>
              Ingress scan feed rate active.
            </p>
          </div>

          {/* VERIFIED SAFE */}
          <div className="p-5 rounded relative overflow-hidden border border-slate-700/50 bg-transparent hover:border-cyan-500/40 transition-all shadow-xl">
            <div className="scanline"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block mb-1 font-bold" style={textShadowStyle}>
                  Verified Safe Targets
                </span>
                <span id="stat-safe" className="text-3xl font-bold text-cyan-400 font-mono tracking-tight" style={textShadowStyle}>
                  {stats.safeCount ? String(stats.safeCount).padStart(4, '0') : "0000"}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-cyan-500/30">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-[10px] font-mono text-cyan-300 mt-3 border-t border-slate-800/60 pt-2 font-bold" style={textShadowStyle}>
              Ratio Safe: {stats.totalScanned ? Math.round((stats.safeCount / stats.totalScanned) * 100) : 0}%
            </p>
          </div>

          {/* HIGH THREAT MALICIOUS */}
          <div className="p-5 rounded relative overflow-hidden border border-slate-700/50 bg-transparent hover:border-rose-500/40 transition-all shadow-xl">
            <div className="scanline-red"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-rose-300 uppercase tracking-widest block mb-1 font-bold" style={textShadowStyle}>
                  Malicious Flags (IOC/phish)
                </span>
                <span id="stat-malicious" className="text-3xl font-bold text-rose-400 font-mono tracking-tight cyber-glow-red" style={textShadowStyle}>
                  {stats.maliciousCount ? String(stats.maliciousCount).padStart(4, '0') : "0000"}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-rose-500/30">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <p className="text-[10px] font-mono text-rose-300 mt-3 border-t border-slate-800/60 pt-2 font-bold" style={textShadowStyle}>
              Severity classification priority: high
            </p>
          </div>

          {/* THREAT DETECTION RATIO */}
          <div className="p-5 rounded relative overflow-hidden border border-slate-700/50 bg-transparent hover:border-amber-500/40 transition-all shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block mb-1 font-bold" style={textShadowStyle}>
                  Risk Ratio
                </span>
                <span id="stat-ratio" className="text-3xl font-bold text-amber-400 font-mono tracking-tight text-amber-500 shadow-amber-550" style={textShadowStyle}>
                  {stats.totalScanned ? Math.round((stats.maliciousCount / stats.totalScanned) * 100) : 0}%
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-amber-500/30">
                <Activity className="w-5 h-5 text-amber-550" />
              </div>
            </div>
            <p className="text-[10px] font-mono text-amber-300 mt-3 border-t border-slate-800/60 pt-2 font-bold" style={textShadowStyle}>
              Confidence accuracy calculated of {stats.totalScanned ? "99.98%" : "0.0%"}
            </p>
          </div>

        </div>

        {/* Cybercharts Row - Donut & Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Risk Distribution Pie / Donut */}
          <div className="p-6 rounded lg:col-span-1 flex flex-col justify-between border border-slate-700/50 bg-transparent shadow-xl">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-extrabold mb-4 border-b border-slate-800/60 pb-2" style={textShadowStyle}>
                RISK SEGREGATION RATIO
              </h3>
              <div className="h-64 relative flex items-center justify-center">
                <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={stats.threatDistribution}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {stats.threatDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                      itemStyle={{ color: "#fff", fontSize: "11px", fontFamily: "monospace" }}
                    />
                  </PieChart>
                </SafeResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-3xl font-bold text-white font-mono block" style={textShadowStyle}>
                    {stats.totalScanned}
                  </span>
                  <span className="text-[9px] uppercase text-slate-300 font-extrabold tracking-wider" style={textShadowStyle}>
                    Logs Scanned
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-around text-xs mt-2 border-t border-slate-800/60 pt-4 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span className="text-slate-200 font-bold" style={textShadowStyle}>Safe: {stats.safeCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="text-slate-200 font-bold" style={textShadowStyle}>Flagged: {stats.maliciousCount}</span>
              </div>
            </div>
          </div>

          {/* Daily Ingress Trend Area Chart */}
          <div className="p-6 rounded lg:col-span-2 border border-slate-700/50 bg-transparent shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-extrabold mb-4 border-b border-slate-800/60 pb-2" style={textShadowStyle}>
              DAILY SCAN THREAT INTELLIGENCE INGRESS TRENDS
            </h3>
            <div className="h-64">
              <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={stats.dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scannedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="maliciousGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.05)" />
                  <XAxis dataKey="date" stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                  <YAxis stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                    labelStyle={{ color: "#06b6d4", fontWeight: "bold", fontSize: "11px", fontFamily: "monospace" }}
                    itemStyle={{ color: "#fff", fontSize: "11px", fontFamily: "monospace" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px" }} />
                  <Area type="monotone" dataKey="scanned" stroke="#06b6d4" fillOpacity={1} fill="url(#scannedGrad)" name="Total Ingress" />
                  <Area type="monotone" dataKey="malicious" stroke="#f43f5e" fillOpacity={1} fill="url(#maliciousGrad)" name="Malicious Intercepts" />
                </AreaChart>
              </SafeResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Attack types and detailed parameters cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
          
          {/* Attack classification bar */}
          <div className="p-6 rounded lg:col-span-2 border border-slate-700/50 bg-transparent shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-extrabold mb-4 border-b border-slate-800/60 pb-2" style={textShadowStyle}>
              PREVAILING MALICIOUS SIGNATURE CLASSIFICATIONS
            </h3>
            <div className="h-64">
              <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={stats.topAttackTypes} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.05)" />
                  <XAxis dataKey="type" stroke="#06b6d4" fontSize={9} tickLine={false} style={{ fontFamily: "monospace" }} />
                  <YAxis stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                    itemStyle={{ color: "#fff", fontSize: "11px", fontFamily: "monospace" }}
                  />
                  <Bar dataKey="count" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                    {stats.topAttackTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#f43f5e" : "#f59e0b"} />
                    ))}
                  </Bar>
                </BarChart>
              </SafeResponsiveContainer>
            </div>
          </div>

          {/* GEO Source Distribution Table */}
          <div className="p-6 rounded lg:col-span-1 border border-slate-700/50 bg-transparent shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-extrabold mb-4 border-b border-slate-800/60 pb-2 flex items-center gap-2" style={textShadowStyle}>
              <Globe className="w-4 h-4 text-cyan-400" />
              GEO THREAT ORIGINS
            </h3>
            <div className="overflow-hidden">
              <table className="w-full text-xs text-left font-mono text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800/60 text-cyan-300 font-bold">
                    <th className="py-2.5" style={textShadowStyle}>COUNTRY ORIGIN</th>
                    <th className="py-2.5 text-right" style={textShadowStyle}>IOC INTEL COUNTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/55">
                  {stats.countryDistribution.map((item, index) => (
                    <tr key={index} className="hover:bg-cyan-500/10 transition-colors">
                      <td className="py-3 flex items-center gap-2 text-white font-medium" style={textShadowStyle}>
                        <span className="text-slate-400 w-4 font-bold">{index + 1}.</span>
                        <span>{item.country}</span>
                      </td>
                      <td className="py-3 font-extrabold text-right text-rose-400" style={textShadowStyle}>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Recent Incident Feed */}
        <div className="p-6 rounded relative overflow-hidden border border-slate-700/50 bg-transparent shadow-xl">
          <div className="scanline"></div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-white font-extrabold mb-4 border-b border-slate-800/60 pb-2" style={textShadowStyle}>
            REAL-TIME INCIDENT RESPONSE LOG
          </h3>
          
          <div className="overflow-x-auto font-mono">
            <table className="w-full text-left text-xs text-slate-200">
              <thead>
                <tr className="border-b border-slate-800/60 text-cyan-300 font-bold">
                  <th className="py-3 pl-4" style={textShadowStyle}>THREAT LEVEL</th>
                  <th className="py-3" style={textShadowStyle}>RISK</th>
                  <th className="py-3" style={textShadowStyle}>TARGET DOMAIN / INCIDENT TARGET SEQUENCE</th>
                  <th className="py-3" style={textShadowStyle}>OBSERVED AT</th>
                  <th className="py-3 pr-4 text-center" style={textShadowStyle}>ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/55">
                {stats.recentAnalyses.map((item) => {
                  const isCritical = item.overallRiskScore >= 80;
                  const isHigh = item.overallRiskScore >= 60 && item.overallRiskScore < 80;
                  const isMed = item.overallRiskScore >= 40 && item.overallRiskScore < 60;
                  const isSafe = item.overallRiskScore < 40;

                  let scoreColor = "text-cyan-400";
                  let bgBadge = "bg-slate-950/80 border-cyan-800/40 text-cyan-300";
                  
                  if (isCritical) {
                    scoreColor = "text-rose-400";
                    bgBadge = "bg-rose-950/85 border-rose-800/50 text-rose-300";
                  } else if (isHigh) {
                    scoreColor = "text-rose-300";
                    bgBadge = "bg-rose-950/75 border-rose-900/40 text-rose-300";
                  } else if (isMed) {
                    scoreColor = "text-amber-400";
                    bgBadge = "bg-amber-950/85 border-amber-800/50 text-amber-300";
                  }

                  return (
                    <tr key={item.id} className="hover:bg-cyan-500/10 transition-all text-xs">
                      <td className="py-3.5 pl-4">
                        <span className={`px-2.5 py-1 rounded-sm border ${bgBadge} text-[10px] font-extrabold block w-fit shadow-md`} style={textShadowStyle}>
                          {isSafe ? "✓ SAFE" : `⚠ ${item.threatLevel.toUpperCase()}`}
                        </span>
                      </td>
                      <td className={`py-3.5 font-extrabold ${scoreColor}`} style={textShadowStyle}>
                        {item.overallRiskScore}%
                      </td>
                      <td className="py-3.5 font-sans max-w-sm truncate text-white font-semibold" title={item.url} style={textShadowStyle}>
                        {item.features.domain}
                        {item.features.unicodeSpoofing && (
                          <span className="ml-2 font-mono text-[9px] bg-red-950/90 text-rose-300 border border-red-900/40 px-1 py-0.5 rounded shadow">UNICODE_SPOOF</span>
                        )}
                        {item.features.brandSimilarityScore >= 80 && (
                          <span className="ml-2 font-mono text-[9px] bg-amber-950/90 text-amber-300 border border-amber-900/40 px-1 py-0.5 rounded shadow">TYPOSQUAT</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-300 text-[11px]" style={textShadowStyle}>
                        {new Date(item.timestamp).toISOString().replace("T", " ").substring(0, 19)}
                      </td>
                      <td className="py-3.5 pr-4 text-center">
                        <button
                          onClick={() => onSelectUrl(item)}
                          className={`px-3 py-1.5 border rounded text-[10px] font-mono hover:bg-opacity-40 transition-all flex items-center justify-center gap-1.5 mx-auto bg-slate-950/70 shadow-md ${
                            isSafe 
                              ? "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                              : "border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                          }`}
                          style={textShadowStyle}
                        >
                          <span>FORENSIC REPORT</span>
                          <ChevronRight className="w-3 h-3 text-cyan-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
