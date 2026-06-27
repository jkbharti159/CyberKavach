import React, { useState, useRef } from "react";
import { 
  Shield, 
  ShieldAlert, 
  Search, 
  FileText, 
  Download, 
  Copy, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Lock, 
  Unlock, 
  Binary, 
  Layers, 
  Cpu, 
  BookOpen, 
  UploadCloud, 
  Check, 
  RefreshCw,
  FolderSync
} from "lucide-react";
import { UrlAnalysisResult } from "../types";

interface InteractiveAnalyzerProps {
  onAnalyze: (url: string) => Promise<UrlAnalysisResult | null>;
  onAnalyzeBulk: (urls: string[]) => Promise<UrlAnalysisResult[]>;
  selectedAnalysis: UrlAnalysisResult | null;
  setSelectedAnalysis: (result: UrlAnalysisResult | null) => void;
  isLoading: boolean;
}

export default function InteractiveAnalyzer({ 
  onAnalyze, 
  onAnalyzeBulk,
  selectedAnalysis, 
  setSelectedAnalysis, 
  isLoading 
}: InteractiveAnalyzerProps) {
  const [urlInput, setUrlInput] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [bulkResults, setBulkResults] = useState<UrlAnalysisResult[]>([]);
  const [isCopying, setIsCopying] = useState(false);
  const [isCopiedJson, setIsCopiedJson] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const res = await onAnalyze(urlInput);
    if (res) {
      setSelectedAnalysis(res);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = bulkInput
      .split("\n")
      .map(u => u.trim())
      .filter(u => u.length > 0);
    if (urls.length === 0) return;
    const results = await onAnalyzeBulk(urls);
    setBulkResults(results);
    if (results.length > 0) {
      setSelectedAnalysis(results[0]);
    }
  };

  // Drag and Drop Handles
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setBulkInput(text);
        setBulkMode(true);
      }
    };
    reader.readAsText(file);
  };

  const handleCopyInput = () => {
    if (!selectedAnalysis) return;
    navigator.clipboard.writeText(selectedAnalysis.url);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleExportJson = () => {
    if (!selectedAnalysis) return;
    const blob = new Blob([JSON.stringify(selectedAnalysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyberkavach_threat_report_${selectedAnalysis.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  // Score styling
  const getRiskDetails = (score: number) => {
    if (score >= 80) return { color: "text-rose-500", border: "border-rose-500/30", bg: "bg-rose-500/10", label: "Critical Threat" };
    if (score >= 60) return { color: "text-rose-400", border: "border-rose-400/30", bg: "bg-rose-400/10", label: "High Threat" };
    if (score >= 40) return { color: "text-amber-500", border: "border-amber-500/30", bg: "bg-amber-500/10", label: "Medium Threat" };
    if (score >= 15) return { color: "text-cyan-400", border: "border-cyan-400/30", bg: "bg-cyan-400/10", label: "Low Threat" };
    return { color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/10", label: "Safe / Clear Record" };
  };

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
              backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(7).jpeg")',
              opacity: 1.0
            }}
          />
        </div>
      
        {/* HUD HEADER */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8 pb-4 border-b border-slate-800/80 print:hidden">
          <div>
            <h2 id="analyzer-title" className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              THREAT ANALYZER TERMINAL
            </h2>
            <p className="text-xs text-slate-200 font-mono font-bold" style={textShadowStyle}>
              Execute static heuristics, brand typosquatting distance verification, Punycode detection, and ensemble classical ML classification.
            </p>
          </div>

          <div className="flex bg-slate-950/40 backdrop-blur-sm p-1 rounded border border-cyan-500/30 w-full sm:w-auto">
            <button 
              id="singlescan-tab"
              onClick={() => setBulkMode(false)}
              className={`flex-1 sm:flex-initial text-center px-4 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${!bulkMode ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              SINGLE SCAN
            </button>
            <button 
              id="bulkscan-tab"
              onClick={() => setBulkMode(true)}
              className={`flex-1 sm:flex-initial text-center px-4 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${bulkMode ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              BULK CSV PARSER
            </button>
          </div>
        </div>

        {/* SEARCH/PORTAL FORMS */}
        <div className="mb-8 print:hidden">
          {!bulkMode ? (
            <form onSubmit={handleSingleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-cyan-400">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </span>
                <input
                  type="text"
                  id="url-analyzer-input"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Submit secure threat vector or URL sequence (e.g. paying-security-verification.com/login)..."
                  className="w-full bg-slate-950/30 backdrop-blur-sm border border-slate-700/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white py-3.5 pl-12 pr-4 rounded-lg font-mono text-sm tracking-wide shadow-inner outline-none transition-all placeholder:text-slate-400/80"
                  style={textShadowStyle}
                />
              </div>
              <button
                type="submit"
                id="start-analyze-btn"
                disabled={isLoading || !urlInput.trim()}
                className="w-full sm:w-auto px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 disabled:opacity-50 text-slate-950 font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ANALYZING RADAR...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>ENGAGE STATIC SCAN</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleBulkSubmit} className="flex flex-col gap-4">
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Enter multiple URL sequences to scan, one per line..."
                  rows={5}
                  className="w-full bg-slate-950/30 backdrop-blur-sm border border-slate-700/50 focus:border-cyan-500 text-white p-4 rounded-lg font-mono text-xs tracking-wide outline-none resize-none transition-all placeholder:text-slate-400/80"
                  style={textShadowStyle}
                />
                <button
                  type="submit"
                  id="bulk-analyze-submit"
                  disabled={isLoading || !bulkInput.trim()}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FolderSync className="w-4 h-4" />
                  )}
                  <span>SUBMIT BULK THREAT PROFILE ({bulkInput.split("\n").filter(Boolean).length} targets)</span>
                </button>
              </form>

              {/* DRAG AND DROP AREA */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg bg-slate-950/10 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  dragActive ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-slate-700/50 hover:border-cyan-500/40 text-slate-300"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept=".csv,.txt"
                />
                <UploadCloud className="w-12 h-12 text-cyan-400/60 mb-3 animate-pulse" />
                <p className="font-mono text-xs font-bold text-white mb-1" style={textShadowStyle}>
                  DRAG OR DROP TARGET CSV / TXT LOG FILE
                </p>
                <p className="text-[10px] text-slate-300 font-mono font-bold" style={textShadowStyle}>
                  Accepts lines delimited by newline returns. Max 15 entries for real-time safety.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BATCH RESULTS PREVIEW */}
        {bulkResults.length > 0 && bulkMode && (
          <div className="p-5 rounded-lg mb-8 border border-slate-700/50 bg-transparent shadow-xl print:hidden">
            <h3 className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest border-b border-slate-800 pb-2" style={textShadowStyle}>
              BATCH EXECUTION ANALYSIS RESULT SUMMARY
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {bulkResults.map((res) => {
                const rDetails = getRiskDetails(res.overallRiskScore);
                return (
                  <button
                    key={res.id}
                    onClick={() => setSelectedAnalysis(res)}
                    className={`p-3 rounded border text-left flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer ${
                      selectedAnalysis?.id === res.id ? "bg-cyan-950/40 border-cyan-500" : "bg-slate-950/30 border-slate-800"
                    }`}
                  >
                    <span className="text-[9px] text-slate-300 font-mono font-bold truncate block w-full" style={textShadowStyle}>{res.features.domain}</span>
                    <div className="flex justify-between items-center mt-2.5">
                      <span className={`text-xs font-bold font-mono ${rDetails.color}`} style={textShadowStyle}>{res.overallRiskScore}%</span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-slate-900/60 text-slate-300 font-mono">REPORT</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SYSTEM SCAN REPORT VIEWER */}
        {selectedAnalysis ? (
          <div id="threat-report-container" className="space-y-8 relative">
            
            {/* Action buttons bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-transparent p-4 rounded-lg border border-slate-700/50 print:hidden w-full">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[10px] bg-cyan-950/50 text-cyan-400 border border-cyan-800/40 px-2.5 py-1.5 rounded font-mono uppercase font-bold truncate max-w-[190px] xs:max-w-none" style={textShadowStyle}>
                  INCIDENT_RECON_ID: #{selectedAnalysis.id}
                </span>
                <button 
                  onClick={handleCopyInput}
                  className="p-1.5 text-slate-300 hover:text-white transition-colors bg-slate-950/20 border border-slate-750 rounded cursor-pointer shrink-0"
                  title="Copy URL"
                >
                  {isCopying ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={handleExportJson}
                  className="flex-1 sm:flex-initial px-3 py-2 border border-slate-700/50 hover:border-cyan-500/40 rounded bg-slate-950/20 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 text-slate-200 hover:text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EXPORT RAW JSON</span>
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-cyan-500 hover:bg-cyan-400 rounded text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 text-slate-950 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>GENERATE ENTERPRISE PDF</span>
                </button>
              </div>
            </div>

            {/* Primary HUD Dashboard View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Box: Risk score and Indicators */}
              <div className="p-6 rounded-lg border border-slate-700/50 bg-transparent shadow-xl lg:col-span-1 flex flex-col justify-between relative overflow-hidden">
                <div className="scanline"></div>
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-2" style={textShadowStyle}>
                    FORENSIC RISK ASSESSMENT
                  </h3>
                  
                  <div className="h-44 flex flex-col items-center justify-center relative">
                    {/* Gauge SVG */}
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        stroke="rgba(6, 182, 212, 0.05)" 
                        strokeWidth="8" 
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        stroke={selectedAnalysis.overallRiskScore >= 60 ? "#f43f5e" : selectedAnalysis.overallRiskScore >= 40 ? "#f59e0b" : "#06b6d4"} 
                        strokeWidth="8" 
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - selectedAnalysis.overallRiskScore / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-4xl font-bold text-white font-mono block" style={textShadowStyle}>
                        {selectedAnalysis.overallRiskScore}%
                      </span>
                      <span className="text-[10px] uppercase text-slate-300 font-mono font-bold" style={textShadowStyle}>
                        Calculated Risk
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className={`text-base font-bold uppercase tracking-wider ${getRiskDetails(selectedAnalysis.overallRiskScore).color}`} style={textShadowStyle}>
                      {selectedAnalysis.threatLevel.toUpperCase()} THREAT REGISTER
                    </span>
                  </div>
                </div>

                {/* Indicators Detect block */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-350 uppercase tracking-widest block mb-2" style={textShadowStyle}>Detected Threat Triggers</span>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {selectedAnalysis.aiExplanation.detectedIndicators.map((ind, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[9px] px-2 py-0.5 rounded-sm border ${
                          selectedAnalysis.overallRiskScore >= 40 
                            ? "bg-rose-950/60 border-rose-800/40 text-rose-400" 
                            : "bg-cyan-950/60 border-cyan-800/40 text-cyan-300"
                        }`}
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Box: Explainable AI Logic explanation */}
              <div className="p-6 rounded-lg border border-slate-700/50 bg-transparent shadow-xl lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-800/80 pb-2">
                    <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest" style={textShadowStyle}>
                      EXPLAINABLE AI (XAI) RECON REPORT
                    </h3>
                    <span className="text-[9px] text-cyan-400 font-mono animate-pulse uppercase" style={textShadowStyle}>
                      Gemini 2.5 Active Agent Execution
                    </span>
                  </div>

                  <div className="p-4 rounded border border-slate-700/50 bg-slate-950/50 backdrop-blur-md relative">
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span className="text-[9px] text-cyan-400" style={textShadowStyle}>DECISION INTEGRITY COEF</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed font-sans font-medium whitespace-pre-wrap mt-2" style={textShadowStyle}>
                      "{selectedAnalysis.aiExplanation.aiExplanationText}"
                    </p>
                  </div>
                </div>

                {/* Targets detail checklist */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-350 block uppercase text-[10px]" style={textShadowStyle}>Submitted Diagnostic Vector</span>
                    <p className="text-white truncate text-[11px] font-bold mt-1" title={selectedAnalysis.url} style={textShadowStyle}>{selectedAnalysis.url}</p>
                  </div>
                  <div>
                    <span className="text-slate-350 block uppercase text-[10px]" style={textShadowStyle}>Decoded Domain Destination</span>
                    <p className="text-white font-bold text-[11px] mt-1" style={textShadowStyle}>{selectedAnalysis.features.domain}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* static heuristics details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Static Features Block */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-xl text-xs font-mono">
                <h4 className="text-xs text-cyan-400 uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-1.5" style={textShadowStyle}>Static URL Metrics</h4>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>URL Total Length</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.urlLength} chars</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Domain Part Length</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.domainLength} chars</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Alphabetical Numeral Count</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.digitsCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Characters Count</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.specialCharsCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Subdomain Dot Count</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.dotsCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Channel SSL Encryption</span>
                    {selectedAnalysis.features.isHttps ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1" style={textShadowStyle}><Lock className="w-3 h-3" /> VERIFIED</span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1" style={textShadowStyle}><Unlock className="w-3 h-3 text-rose-500" /> PLAINTEXT</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Typosquatting / Advanced Heuristics Block */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-xl text-xs font-mono">
                <h4 className="text-xs text-cyan-400 uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-1.5" style={textShadowStyle}>Advanced Evasions</h4>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Shannon Entropy Value</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.entropy}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Brand Match</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.targetBrand}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Brand Similarity Match</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.brandSimilarityScore}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Levenshtein Distance</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.levenshteinDistanceToTarget === 999 ? "N/A" : selectedAnalysis.features.levenshteinDistanceToTarget}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Unicode Homograph Spoof</span>
                    <strong className={selectedAnalysis.features.unicodeSpoofing ? "text-rose-400 font-bold" : "text-white"} style={textShadowStyle}>
                      {selectedAnalysis.features.unicodeSpoofing ? "DETECTION" : "SAFE"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Percent encoded obfuscation</span>
                    <strong className={selectedAnalysis.features.encodingSpoofing ? "text-rose-400 font-bold" : "text-white"} style={textShadowStyle}>
                      {selectedAnalysis.features.encodingSpoofing ? "DETECTION" : "SAFE"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hex Keyword matching</span>
                    <strong className="text-white" style={textShadowStyle}>{selectedAnalysis.features.suspiciousKeywordsCount} matches</strong>
                  </div>
                </div>
              </div>

              {/* Classical ML ensemble confidence ratios */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-xl text-xs font-mono">
                <h4 className="text-xs text-cyan-400 uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-1.5" style={textShadowStyle}>Classifiers confidence</h4>
                <div className="space-y-2 text-slate-300 font-mono">
                  {Object.values(selectedAnalysis.modelEvaluations).map((model, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{model.modelName}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-950/80 rounded-sm h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${model.prediction === 'Malicious' ? 'bg-rose-500' : 'bg-cyan-500'}`}
                            style={{ width: `${model.probability * 100}%` }}
                          />
                        </div>
                        <strong className={model.prediction === 'Malicious' ? 'text-rose-400' : 'text-cyan-400'} style={textShadowStyle}>
                          {Math.round(model.probability * 100)}%
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Threat Intelligence Integrations & Mitre cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* threat intelligent feeds lookups */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-xl">
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-2 flex items-center gap-2" style={textShadowStyle}>
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  THREAT INTELLIGENCE FEED ALIGNMENTS
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  
                  <div className="p-3 rounded bg-transparent border border-slate-700/50">
                    <span className="text-slate-350 block uppercase text-[10px]" style={textShadowStyle}>VirusTotal Ratio</span>
                    <span className={`text-base font-bold flex items-center gap-1.5 mt-1 ${selectedAnalysis.threatIntel.virusTotal.detectionCount > 0 ? "text-rose-400" : "text-cyan-400"}`} style={textShadowStyle}>
                      {selectedAnalysis.threatIntel.virusTotal.detectionCount}/{selectedAnalysis.threatIntel.virusTotal.totalCount} detections
                    </span>
                  </div>

                  <div className="p-3 rounded bg-transparent border border-slate-700/50">
                    <span className="text-slate-350 block uppercase text-[10px]" style={textShadowStyle}>OpenPhish Feed blacklist</span>
                    <span className={`text-base font-bold flex items-center gap-1.5 mt-1 ${selectedAnalysis.threatIntel.openPhish.isPhishing ? "text-rose-400" : "text-cyan-400"}`} style={textShadowStyle}>
                      {selectedAnalysis.threatIntel.openPhish.isPhishing ? "FLAGGED BLACKLIST" : "CLEAR RECORD"}
                    </span>
                  </div>

                  <div className="p-3 rounded bg-transparent border border-slate-700/50">
                    <span className="text-slate-350 block uppercase text-[10px]" style={textShadowStyle}>PhishTank verification</span>
                    <span className={`text-base font-bold flex items-center gap-1.5 mt-1 ${selectedAnalysis.threatIntel.phishTank.isPhishing ? "text-rose-400" : "text-cyan-400"}`} style={textShadowStyle}>
                      {selectedAnalysis.threatIntel.phishTank.isPhishing ? "MATCH DETECTED" : "CLEAR RECORD"}
                    </span>
                  </div>

                  <div className="p-3 rounded bg-transparent border border-slate-700/50">
                    <span className="text-slate-350 block uppercase text-[10px]" style={textShadowStyle}>AbuseIPDB reputation</span>
                    <span className={`text-base font-bold flex items-center gap-1.5 mt-1 ${selectedAnalysis.threatIntel.abuseIpDb.reputationScore > 0 ? "text-rose-400" : "text-cyan-400"}`} style={textShadowStyle}>
                      {selectedAnalysis.threatIntel.abuseIpDb.reputationScore}% / {selectedAnalysis.threatIntel.abuseIpDb.reportCount} reports
                    </span>
                  </div>

                  <div className="p-3 rounded bg-transparent border border-slate-700/50 col-span-2">
                    <span className="text-slate-350 block uppercase text-[10px]" style={textShadowStyle}>Google Safe Browsing validation</span>
                    <span className={`text-base font-bold flex items-center gap-1.5 mt-1 ${selectedAnalysis.threatIntel.googleSafeBrowsing.isBlacklisted ? "text-rose-400" : "text-cyan-400"}`} style={textShadowStyle}>
                      {selectedAnalysis.threatIntel.googleSafeBrowsing.isBlacklisted ? "ACTIVE SOCIAL ENGINEERING PHISH" : "DOM_REGISTERS_CLEAR"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Mitre tactics block */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-xl">
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-2" style={textShadowStyle}>
                  MITRE ATT&CK MATRIX ALIGNMENTS
                </h4>
                
                <div className="space-y-4">
                  {selectedAnalysis.aiExplanation.mitreAttacks.map((mit, index) => (
                    <div key={index} className="p-3 border border-slate-700/50 bg-transparent rounded text-xs font-mono">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-rose-400 font-bold" style={textShadowStyle}>{mit.techniqueId} - {mit.techniqueName}</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-500 text-[9px] uppercase hover:bg-rose-900 transition-colors">Tactic: {mit.tactic}</span>
                      </div>
                      <p className="text-slate-200 text-[11px] font-sans font-medium leading-normal mt-1" style={textShadowStyle}>
                        {mit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Suggested SOC Actionable Checklist */}
            <div className="p-6 border border-amber-500/20 bg-transparent rounded-lg font-sans">
              <h4 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-4 border-b border-amber-500/15 pb-2 flex items-center gap-2" style={textShadowStyle}>
                <AlertTriangle className="w-4 h-4" />
                SOC ACTIONABLE MITIGATION STEPS
              </h4>
              <div className="space-y-2.5">
                {selectedAnalysis.aiExplanation.recommendedActions.map((act, index) => (
                  <div key={index} className="flex gap-2.5 items-start text-xs text-slate-250">
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <span style={textShadowStyle}>{act}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center border border-slate-700/50 rounded bg-transparent">
            <Shield className="w-16 h-16 text-cyan-400/20 mb-4" />
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider" style={textShadowStyle}>Awaiting Forensic Assessment</h3>
            <p className="text-xs text-slate-300 font-mono mt-2 text-center max-w-md" style={textShadowStyle}>
              Enter a single security destination link above or upload multiple logs using bulk parsing terminals to generate full compliance AI threat reports.
            </p>
          </div>
        )}

      </div>

      {/* Embedded print stylesheets for neat PDF templates */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #threat-report-container, #threat-report-container * {
            visibility: visible;
          }
          #threat-report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 20px;
          }
          .glass-panel, .glass-panel-amber, .glass-panel-red, .glass-panel-blue {
            border: 2px solid #000000 !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          h3, h4, h1, span, p, text, strong {
            color: #000000 !important;
          }
          .scanline, .scanline-red {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
