import React, { useState, useRef } from "react";
import { 
  FileAudio, FileVideo, FileImage, ShieldAlert, UploadCloud, Download, 
  Activity, Play, Pause, Eye, Volume2, ShieldAlert as AlertIcon, RefreshCw, Trash2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import SafeResponsiveContainer from "./SafeResponsiveContainer";
import { motion } from "motion/react";
import { DeepfakeScanResult } from "../types";

interface DeepfakeDetectorProps {
  onAddHistory: (item: any) => void;
  onAddNotification: (notif: any) => void;
  scanHistory: DeepfakeScanResult[];
  onDeleteScan: (id: string) => void;
}

const SAMPLE_DEEPFAKES: DeepfakeScanResult[] = [
  {
    id: "df-1",
    fileName: "president_executive_address_leak.mp4",
    fileSize: "24.5 MB",
    mediaType: "video",
    timestamp: "2026-06-25T16:15:00Z",
    authenticityScore: 28, // High manipulation
    manipulationProbability: 72,
    confidenceScore: 94,
    explanation: "This video exhibits temporal frame-by-frame inconsistencies, face blending blending artifacts along the chin-jawline boundary, and sub-millisecond lip-synchronization mismatches. Additionally, voice synthesis indicators show abnormal noise floor flattening.",
    indicators: [
      { name: "Temporal Continuity", value: 45, status: "Anomaly" },
      { name: "Lip-Sync Alignment", value: 30, status: "Critical" },
      { name: "Facial Boundary Swapping", value: 25, status: "Critical" },
      { name: "Lighting & Shadow Cohesion", value: 68, status: "Normal" },
      { name: "Voice Cloned Synthesis", value: 18, status: "Critical" }
    ],
    timeline: [
      { frame: 10, time: "00:01", score: 85 },
      { frame: 30, time: "00:03", score: 60 },
      { frame: 60, time: "00:06", score: 28 },
      { frame: 90, time: "00:09", score: 15 },
      { frame: 120, time: "00:12", score: 32 }
    ]
  },
  {
    id: "df-2",
    fileName: "ciso_audio_invoice_approval.wav",
    fileSize: "4.2 MB",
    mediaType: "audio",
    timestamp: "2026-06-24T09:40:00Z",
    authenticityScore: 12, // Critical manipulation
    manipulationProbability: 88,
    confidenceScore: 97,
    explanation: "High confidence voice-cloning synthesis signature detected. Spectrogram matching reveals uniform spectral density, lack of natural respiratory gasps, and synthetic audio-floor compression indicative of a trained generative neural model.",
    indicators: [
      { name: "Spectral Coherence", value: 15, status: "Critical" },
      { name: "Noise Floor Consistency", value: 22, status: "Critical" },
      { name: "Harmonic Formant Distribution", value: 10, status: "Critical" },
      { name: "Pitch Modulation Variance", value: 40, status: "Anomaly" }
    ],
    timeline: [
      { frame: 10, time: "00:01", score: 90 },
      { frame: 30, time: "00:03", score: 75 },
      { frame: 60, time: "00:05", score: 45 },
      { frame: 90, time: "00:07", score: 12 },
      { frame: 120, time: "00:10", score: 8 }
    ]
  }
];

export default function DeepfakeDetector({ onAddHistory, onAddNotification, scanHistory, onDeleteScan }: DeepfakeDetectorProps) {
  const [activeScan, setActiveScan] = useState<DeepfakeScanResult | null>(SAMPLE_DEEPFAKES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>("video");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processUploadedFile = async (name: string, size: string, type: 'image' | 'video' | 'audio') => {
    setIsProcessing(true);
    setProcessingProgress(10);

    const stages = [20, 45, 65, 85, 100];
    for (let i = 0; i < stages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProcessingProgress(stages[i]);
    }

    // Determine deterministic metrics based on length of name
    const randScore = 15 + (name.length % 7) * 11;
    const isFake = randScore < 50;
    const manipulationProb = 100 - randScore;
    const confidence = 85 + (name.length % 3) * 5;

    let explanationText = "";
    let indicatorsList: any[] = [];

    if (type === "video") {
      explanationText = isFake 
        ? `Video analysis flagged manipulation. Detected lip-sync alignment offset along key frames, face swapping boundary blur, and minor temporal artifacts across the face mask matrix.`
        : "Video authenticity score exceeds baseline bounds. Facial lighting vectors, ocular reflections, and biological blink modulation align perfectly with structural recording conditions.";
      indicatorsList = [
        { name: "Temporal Continuity", value: isFake ? 48 : 95, status: isFake ? "Anomaly" : "Normal" },
        { name: "Lip-Sync Alignment", value: isFake ? 35 : 98, status: isFake ? "Critical" : "Normal" },
        { name: "Facial Boundary Matching", value: isFake ? 22 : 96, status: isFake ? "Critical" : "Normal" },
        { name: "Lighting Cohesion", value: isFake ? 62 : 90, status: isFake ? "Normal" : "Normal" }
      ];
    } else if (type === "audio") {
      explanationText = isFake
        ? "Audio deepfake identified. Detected synthetic text-to-speech vocoder compression, high pitch precision, and lack of biological background frequency shifts."
        : "Speech file validates as natural. Harmonic structure, physiological speech rate, and respiratory pause profiles correspond to genuine speaker mechanics.";
      indicatorsList = [
        { name: "Spectral Coherence", value: isFake ? 20 : 92, status: isFake ? "Critical" : "Normal" },
        { name: "Respiratory Gaps", value: isFake ? 15 : 96, status: isFake ? "Critical" : "Normal" },
        { name: "Pitch Modulation Cohesion", value: isFake ? 42 : 88, status: isFake ? "Anomaly" : "Normal" }
      ];
    } else {
      explanationText = isFake
        ? "Image exhibits high probability of AI model generation. High frequency compression GAN markers found on backgrounds, and facial reflection symmetry mismatches."
        : "Static image appears authentic. No visible Generative Adversarial Network structural noise or shadow inconsistencies found.";
      indicatorsList = [
        { name: "Face Reflections Symmetry", value: isFake ? 35 : 91, status: isFake ? "Critical" : "Normal" },
        { name: "Lighting Artifact Maps", value: isFake ? 44 : 94, status: isFake ? "Anomaly" : "Normal" },
        { name: "High-Freq Noise Profile", value: isFake ? 28 : 97, status: isFake ? "Critical" : "Normal" }
      ];
    }

    const newReport: DeepfakeScanResult = {
      id: "df-" + Date.now(),
      fileName: name,
      fileSize: size,
      mediaType: type,
      timestamp: new Date().toISOString(),
      authenticityScore: randScore,
      manipulationProbability: manipulationProb,
      confidenceScore: confidence,
      explanation: explanationText,
      indicators: indicatorsList,
      timeline: [
        { frame: 10, time: "00:01", score: isFake ? 75 : 95 },
        { frame: 30, time: "00:03", score: isFake ? 55 : 98 },
        { frame: 60, time: "00:06", score: randScore },
        { frame: 90, time: "00:09", score: isFake ? randScore - 5 : 96 },
        { frame: 120, time: "00:12", score: isFake ? randScore + 10 : 97 }
      ]
    };

    onAddHistory({
      id: newReport.id,
      module: "Deepfake Detector",
      summary: `Media file '${name}' analyzed. Authenticity: ${randScore}%`,
      timestamp: newReport.timestamp,
      score: randScore
    });

    onAddNotification({
      id: "notif-" + Date.now(),
      title: "Deepfake Check Complete",
      message: `File '${name}' scored ${randScore}% authenticity.`,
      type: "alert",
      timestamp: new Date().toISOString(),
      read: false
    });

    setActiveScan(newReport);
    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const name = file.name;
      
      let type: 'image' | 'video' | 'audio' = "video";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("audio/")) type = "audio";
      
      processUploadedFile(name, sizeStr, type);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const name = file.name;
      
      let type: 'image' | 'video' | 'audio' = "video";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("audio/")) type = "audio";

      processUploadedFile(name, sizeStr, type);
    }
  };

  const downloadAnalysisText = (scan: DeepfakeScanResult) => {
    const textReport = `=========================================
CYBERKAVACH DEEPFAKE SCAN REPORT
=========================================
Scan Date: ${new Date(scan.timestamp).toLocaleString()}
Analyzed File: ${scan.fileName} (${scan.mediaType.toUpperCase()})
File Size: ${scan.fileSize}
-----------------------------------------
AUTHENTICITY RATIO: ${scan.authenticityScore}%
MANIPULATION RATIO: ${scan.manipulationProbability}%
AI DETECTION CONFIDENCE: ${scan.confidenceScore}%

AI DETECTORS SUMMARY:
${scan.explanation}

INDICATOR SIGNATURE BREAKDOWN:
${scan.indicators.map(ind => `- ${ind.name}: ${ind.value}% Quality Status: [${ind.status}]`).join("\n")}

-----------------------------------------
DISCLAIMER: This analysis provides an AI-assisted estimate and should not be considered definitive forensic evidence.
=========================================`;

    const blob = new Blob([textReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Deepfake_Analysis_${scan.fileName.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAuthenticityColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-red-500 border-red-500/30 bg-red-500/10";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical": return "text-red-500 border-red-500/20 bg-red-950/40";
      case "Anomaly": return "text-amber-400 border-amber-500/20 bg-amber-950/40";
      default: return "text-emerald-400 border-emerald-500/20 bg-emerald-950/40";
    }
  };

  const allScans = [...scanHistory, ...SAMPLE_DEEPFAKES];

  return (
    <div className="flex-1 relative min-h-0 min-w-0 bg-transparent overflow-y-auto text-slate-200">
      <div className="relative min-h-full p-8 w-full z-10 flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <motion.div 
            initial={{ opacity: 0, scale: 1.15, filter: "blur(6px)" }}
            animate={{ opacity: 1.0, scale: 1.0, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
            style={{ 
              backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/How%20do%20I%20hire%20a%20hacker%20_.jpeg")',
              opacity: 1.0
            }}
          />
        </div>

        {/* HUD Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
              AI DEEPFAKE DETECTOR
            </h2>
            <p className="text-xs text-slate-300 font-mono font-medium" style={textShadowStyle}>
              Identify deep learning video lip-sync swapping, voice synthesizers, and GAN graphic face anomalies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Upload Box */}
            <div
              className={`p-6 rounded border border-dashed text-center transition-all relative overflow-hidden bg-transparent ${
                dragActive ? "border-cyan-400 bg-cyan-950/20" : "border-cyan-500/20 hover:border-cyan-400/40"
              }`}
              style={textShadowStyle}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="scanline"></div>
              <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-bounce" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Drag and Drop Media File</h3>
              <p className="text-[10px] text-slate-300 font-mono mb-4">Accepts images, video, or audio up to 50MB</p>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*"
                onChange={handleManualUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-transparent border border-cyan-500/30 hover:border-cyan-400 text-white font-mono text-xs font-bold rounded cursor-pointer transition-all"
                style={textShadowStyle}
              >
                BROWSE FILES
              </button>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="p-6 rounded border border-cyan-500/30 bg-transparent shadow-xl flex flex-col gap-3 font-mono" style={textShadowStyle}>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white uppercase font-bold animate-pulse">Running GAN Forensics...</span>
                  <span className="text-cyan-400">{processingProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${processingProgress}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-400 uppercase">Consulting deep neural network layers...</p>
              </div>
            )}

            {/* Scan selection sidebar history */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                Detections History
              </h3>
              
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {allScans.map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => setActiveScan(scan)}
                    className={`p-3 border rounded flex items-center justify-between cursor-pointer transition-all ${
                      activeScan?.id === scan.id 
                        ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg" 
                        : "bg-transparent border-slate-800 text-slate-300 hover:bg-cyan-950/20"
                    }`}
                  >
                    <div className="font-mono text-xs overflow-hidden flex items-center gap-3">
                      {scan.mediaType === "video" && <FileVideo className="w-4 h-4 text-cyan-400" />}
                      {scan.mediaType === "audio" && <FileAudio className="w-4 h-4 text-amber-400" />}
                      {scan.mediaType === "image" && <FileImage className="w-4 h-4 text-emerald-400" />}
                      <div className="truncate max-w-[120px]">
                        <p className="font-bold truncate">{scan.fileName}</p>
                        <p className="text-[8px] text-slate-400 uppercase mt-0.5">{scan.fileSize} • {new Date(scan.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getAuthenticityColor(scan.authenticityScore)}`}>
                      {scan.authenticityScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Details Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {activeScan ? (
              <div className="flex flex-col gap-6">
                
                {/* Visual authenticity overview */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between" style={textShadowStyle}>
                  <div className="flex items-center gap-6">
                    {/* Gauge Circle */}
                    <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                        <circle cx="50" cy="50" r="40" stroke={activeScan.authenticityScore >= 50 ? "#10b981" : "#f43f5e"} strokeWidth="6" fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - activeScan.authenticityScore / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center" style={textShadowStyle}>
                        <span className="text-2xl font-extrabold text-white font-mono">{activeScan.authenticityScore}%</span>
                        <span className="text-[8px] text-slate-300 uppercase tracking-widest font-bold">Authentic</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                        <span className="text-slate-300 uppercase font-bold">GAN Confidence:</span>
                        <span className={`font-bold px-2 py-0.5 rounded border ${
                          activeScan.authenticityScore >= 50 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-rose-400 border-rose-500/20 bg-rose-500/10"
                        }`}>
                          {activeScan.authenticityScore >= 50 ? "CONFIRMED GENUINE" : "HIGH DEEPFAKE LIKELIHOOD"}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white font-mono truncate max-w-[320px]">{activeScan.fileName}</h4>
                      <p className="text-xs text-slate-300 mt-1 font-mono">Detection confidence rate: <span className="text-cyan-400 font-bold">{activeScan.confidenceScore}%</span> • Scanned on {new Date(activeScan.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadAnalysisText(activeScan)}
                    className="px-4 py-2 bg-transparent border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-400 text-white font-mono text-xs font-bold rounded transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                    style={textShadowStyle}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD ANALYSIS PDF</span>
                  </button>
                </div>

                {/* Forensics legal disclaimer */}
                <div className="p-4 rounded border border-amber-500/30 bg-transparent flex gap-3 text-amber-300 text-xs items-center" style={textShadowStyle}>
                  <AlertIcon className="w-5 h-5 flex-shrink-0" />
                  <p className="font-mono text-[10px] leading-relaxed uppercase tracking-wider font-semibold">
                    DISCLAIMER: This analysis provides an AI-assisted estimate and should not be considered definitive forensic evidence.
                  </p>
                </div>

                {/* AI Explanation Text */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex gap-4" style={textShadowStyle}>
                  <div className="p-2.5 rounded bg-cyan-950/60 border border-cyan-500/30 self-start">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono mb-1.5">AI Diagnostic Forensics</h4>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeScan.explanation}</p>
                  </div>
                </div>

                {/* Spectrogram & Waveform Visualizer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Spectrogram Simulator */}
                  <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col justify-between" style={textShadowStyle}>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">Spectral Spectrogram Matrix</h4>
                      <p className="text-[9px] text-slate-300 uppercase font-mono mb-4">Neural voice frequency analysis (2D distribution)</p>
                    </div>

                    {/* Animated Spectrogram Block bars */}
                    <div className="flex flex-col gap-1.5 bg-transparent p-4 rounded border border-cyan-500/20">
                      {Array.from({ length: 6 }).map((_, rIdx) => {
                        // Spectral frequency row
                        const freq = (12 - rIdx * 2);
                        return (
                          <div key={rIdx} className="flex gap-2 items-center">
                            <span className="w-8 font-mono text-[8px] text-slate-400 text-right">{freq}kHz</span>
                            <div className="flex-1 flex gap-1 h-3.5">
                              {Array.from({ length: 12 }).map((_, cIdx) => {
                                // Cell intensity level
                                const randIntensity = (rIdx * 7 + cIdx * 13) % 100;
                                const isCritical = activeScan.authenticityScore < 50 && randIntensity > 75;
                                return (
                                  <div
                                    key={cIdx}
                                    className={`flex-1 rounded-xs transition-all ${
                                      isCritical 
                                        ? "bg-rose-500 animate-pulse border border-rose-500/30" 
                                        : randIntensity > 50 
                                          ? "bg-cyan-500/60 border border-cyan-500/20" 
                                          : randIntensity > 20 
                                            ? "bg-cyan-950/40 border border-cyan-950/20" 
                                            : "bg-cyan-950/10"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Waveform timeline */}
                  <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col justify-between" style={textShadowStyle}>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">Authenticity Chronology</h4>
                      <p className="text-[9px] text-slate-300 uppercase font-mono mb-4">Temporal consistency timeline analysis</p>
                    </div>

                    <div className="h-44 w-full">
                      <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={activeScan.timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                          <YAxis stroke="#64748b" domain={[0, 100]} style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#06b6d4', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                          />
                          <Bar dataKey="score" name="Consistency Score" fill="#06b6d4">
                            {activeScan.timeline.map((entry, index) => (
                              <div key={`cell-${index}`} style={{ fill: entry.score < 50 ? '#f43f5e' : '#06b6d4' }} />
                            ))}
                          </Bar>
                        </BarChart>
                      </SafeResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Subsystem Indicators progress meters */}
                <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Forensics Neural Subsystem Indicators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeScan.indicators.map((ind, i) => (
                      <div key={i} className="p-3 bg-transparent border border-cyan-500/20 rounded font-mono text-xs flex flex-col gap-2" style={textShadowStyle}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-200">{ind.name}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${getStatusColor(ind.status)}`}>
                            {ind.status} ({ind.value}%)
                          </span>
                        </div>
                        <div className="w-full bg-cyan-950/40 h-1.5 rounded overflow-hidden">
                          <div className={`h-full ${
                            ind.status === "Critical" ? "bg-red-500" : ind.status === "Anomaly" ? "bg-amber-400" : "bg-emerald-500"
                          }`} style={{ width: `${ind.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 rounded border border-cyan-500/20 bg-transparent text-center text-slate-300 font-mono" style={textShadowStyle}>
                <FileVideo className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
                <p className="uppercase text-sm tracking-widest font-bold">No Deepfake Scan Active</p>
                <p className="text-xs text-slate-400 mt-2">Upload or drag a video, audio recording, or image snapshot to perform AI-driven GAN deepfake verification.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
