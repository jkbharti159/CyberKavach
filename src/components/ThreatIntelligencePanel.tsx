import React, { useState } from "react";
import { 
  Database, 
  Search, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert, 
  Globe, 
  AlertTriangle, 
  Layers,
  ArrowRight
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from "recharts";
import SafeResponsiveContainer from "./SafeResponsiveContainer";

export default function ThreatIntelligencePanel() {
  const [searchTerm, setSearchTerm] = useState("");

  const activeThreatFeeds = [
    { target: "paypal-update-security.com", source: "OpenPhish", rating: "Critical", detected: "3 mins ago", type: "Credential Harvesting" },
    { target: "185.112.146.5", source: "AbuseIPDB", rating: "High", detected: "12 mins ago", type: "IP-based Redirect" },
    { target: "bankofamerica-login-portal.site", source: "PhishTank", rating: "Critical", detected: "1 hour ago", type: "Credential Harvesting" },
    { target: "g00g1e-account-verification.cc", source: "Google Safe Browsing", rating: "Critical", detected: "2 hours ago", type: "Unicode spoofing" },
    { target: "netflix-verification-support.info", source: "PhishTank", rating: "Critical", detected: "3 hours ago", type: "Fake Login Portals" },
    { target: "invoice-pdf-download-malicious.xyz", source: "URLHaus", rating: "High", detected: "5 hours ago", type: "Malicious payload download" },
    { target: "update-windows-defender-kb45.in", source: "URLHaus", rating: "High", detected: "6 hours ago", type: "Trojan Trojan Delivery" },
    { target: "chase-alert-identity.org", source: "PhishTank", rating: "High", detected: "8 hours ago", type: "Account Lockout Phishing" }
  ];

  const tldStatistics = [
    { name: ".com (Safe/Neut)", value: 55 },
    { name: ".xyz (Suspicious)", value: 18 },
    { name: ".net (Safe/Neut)", value: 12 },
    { name: ".info (Suspicious)", value: 8 },
    { name: ".cc (Suspicious)", value: 7 }
  ];

  const categoryStatistics = [
    { type: "Credential Harvest", count: 48 },
    { type: "Brand Typosquatting", count: 35 },
    { type: "Unicode Spoofing", count: 18 },
    { type: "Payload/DGA", count: 12 },
    { type: "Homograph attacks", count: 14 }
  ];

  const TLD_COLORS = ["#06b6d4", "#f43f5e", "#0ea5e9", "#e11d48", "#be123c"];

  const filteredFeeds = activeThreatFeeds.filter(feed => 
    feed.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  return (
    <div className="flex-1 relative min-h-0 min-w-0 bg-transparent overflow-y-auto text-slate-200">
      <div className="relative min-h-full p-8 w-full z-10 flex flex-col">
        {/* Animated Background Image - fully visible and moves when scrolling */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <div 
            className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
            style={{ 
              backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/%D0%91%D1%83%D0%B4%D1%83%D1%89%D0%B5%D0%B5%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B5%D0%B9_%20%D0%9A%D0%B0%D0%BA%20AI%20%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D1%82%20%D0%BC%D0%B8%D1%80%20%D1%81%20%D0%BD%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D0%BC%D0%B8%20%D0%BE%D0%B3%D0%BD%D1%8F%D0%BC%D0%B8%20%D0%B8%20%D0%B3%D0%BE%D0%BB%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D0%BC%D0%B8.jpeg")',
              opacity: 1.0
            }}
          />
        </div>
      
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h2 id="threatintel-title" className="text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <Database className="w-6 h-6 text-cyan-400" />
              THREAT INTELLIGENCE SYNDICATE
            </h2>
            <p className="text-xs text-slate-200 font-mono font-bold" style={textShadowStyle}>
              Synchronized integrations lookups matching IOC databases (VirusTotal, OpenPhish, PhishTank, URLHaus, AbuseIPDB, Google Safe Browsing).
            </p>
          </div>
        </div>

        {/* SEARCH AND INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="glass-panel bg-slate-950/40 backdrop-blur-sm p-5 rounded md:col-span-1 text-xs font-mono">
            <h4 className="text-xs text-cyan-400 uppercase tracking-wider mb-3.5 border-b border-slate-800 pb-1.5 flex items-center gap-2" style={textShadowStyle}>
              <BookOpen className="w-4 h-4" />
              SYNCHRONIZED DATABASES
            </h4>
            <div className="space-y-3 font-sans text-slate-200 font-bold">
              <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-800/80 rounded shadow-md">
                <span className="font-mono text-[10px] text-white" style={textShadowStyle}>VirusTotal Lookup</span>
                <span className="text-[10px] uppercase font-bold text-cyan-400 px-1 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20" style={textShadowStyle}>COMMUNITY SAFE</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-800/80 rounded shadow-md">
                <span className="font-mono text-[10px] text-white" style={textShadowStyle}>OpenPhish Integrations</span>
                <span className="text-[10px] uppercase font-bold text-cyan-400 px-1 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20" style={textShadowStyle}>LIVE DEPLOYED</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-800/80 rounded shadow-md">
                <span className="font-mono text-[10px] text-white" style={textShadowStyle}>PhishTank database</span>
                <span className="text-[10px] uppercase font-bold text-cyan-400 px-1 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20" style={textShadowStyle}>LIVE DEPLOYED</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-800/80 rounded shadow-md">
                <span className="font-mono text-[10px] text-white" style={textShadowStyle}>AbuseIPDB lookup</span>
                <span className="text-[10px] uppercase font-bold text-cyan-400 px-1 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20" style={textShadowStyle}>LIVE DEPLOYED</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-800/80 rounded shadow-md">
                <span className="font-mono text-[10px] text-white" style={textShadowStyle}>Google Safe Browsing</span>
                <span className="text-[10px] uppercase font-bold text-cyan-400 px-1 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20" style={textShadowStyle}>API CONFLICT SAFE</span>
              </div>
            </div>
          </div>

          {/* TLD Pie Analysis Chart */}
          <div className="glass-panel bg-slate-950/40 backdrop-blur-sm p-5 rounded md:col-span-1 flex flex-col justify-between">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1.5 border-b border-slate-800 pb-1.5" style={textShadowStyle}>
              TLD PHISHING SPECTRUM
            </h4>
            <div className="h-40">
              <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={tldStatistics}
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {tldStatistics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TLD_COLORS[index % TLD_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                    itemStyle={{ color: "#fff", fontSize: "10px", fontFamily: "monospace" }}
                  />
                </PieChart>
              </SafeResponsiveContainer>
            </div>
            <p className="text-[10px] font-mono text-slate-300 text-center font-bold" style={textShadowStyle}>
              Higher ratio in untrusted TLD classes (.xyz, .info)
            </p>
          </div>

          {/* Category distribution bar */}
          <div className="glass-panel bg-slate-950/40 backdrop-blur-sm p-5 rounded md:col-span-1">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1.5" style={textShadowStyle}>
              ATTACK METHOD RATIO
            </h4>
            <div className="h-40">
              <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={categoryStatistics} margin={{ left: -30, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.05)" />
                  <XAxis dataKey="type" stroke="#06b6d4" fontSize={8} tickLine={false} style={{ fontFamily: "monospace" }} />
                  <YAxis stroke="#06b6d4" fontSize={8} style={{ fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                    itemStyle={{ color: "#fff", fontSize: "10px", fontFamily: "monospace" }}
                  />
                  <Bar dataKey="count" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </SafeResponsiveContainer>
            </div>
          </div>

        </div>

        {/* FILTER SEARCH FIELD */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-350">
              <Search className="w-4.5 h-4.5 text-slate-350" />
            </span>
            <input
              type="text"
              id="threat-intel-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search matching IOCs, payload signatures, or feed origins..."
              className="w-full bg-slate-950/50 border border-slate-700/50 focus:border-cyan-500 text-white py-2.5 pl-10 pr-4 rounded font-mono text-xs outline-none transition-all shadow-lg"
            />
          </div>
        </div>

        {/* REAL-TIME BLACKLIST DATA */}
        <div className="glass-panel bg-slate-950/40 backdrop-blur-sm p-6 rounded relative overflow-hidden">
          <div className="scanline"></div>
          <h3 className="text-xs font-mono text-cyan-400 mb-4 uppercase tracking-widest border-b border-slate-800/80 pb-2" style={textShadowStyle}>
            REAL-TIME SYNCHRONIZED BLACKLIST FEED
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 text-cyan-400">
                  <th className="py-2.5 pl-4" style={textShadowStyle}>INDICATOR ORIGIN (SOURCE)</th>
                  <th className="py-2.5" style={textShadowStyle}>SEVERITY</th>
                  <th className="py-2.5" style={textShadowStyle}>MALICIOUS VECTOR VALUE</th>
                  <th className="py-2.5" style={textShadowStyle}>INTERCEPTED ACTION</th>
                  <th className="py-2.5 pr-4 text-center" style={textShadowStyle}>TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/55">
                {filteredFeeds.map((feed, index) => (
                  <tr key={index} className="hover:bg-slate-950/40 transition-all">
                    <td className="py-3.5 pl-4 flex items-center gap-2">
                      <span className="text-slate-400 font-bold" style={textShadowStyle}>{index + 1}.</span>
                      <span className="px-2 py-0.5 rounded border border-slate-700/50 bg-slate-950/60 text-white font-bold" style={textShadowStyle}>{feed.source}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                        feed.rating === 'Critical' 
                          ? 'bg-rose-950/80 border-rose-800/60 text-rose-450' 
                          : 'bg-amber-950/80 border-amber-800/60 text-amber-400'
                      }`} style={textShadowStyle}>
                        {feed.rating.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 font-sans font-bold text-white max-w-sm truncate" title={feed.target} style={textShadowStyle}>
                      {feed.target}
                    </td>
                    <td className="py-3.5 text-slate-200 font-bold" style={textShadowStyle}>{feed.type}</td>
                    <td className="py-3.5 pr-4 text-center text-slate-350 text-[10px] font-bold" style={textShadowStyle}>{feed.detected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
