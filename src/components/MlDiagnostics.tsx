import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, Cell
} from "recharts";
import SafeResponsiveContainer from "./SafeResponsiveContainer";
import { 
  Cpu, 
  Settings, 
  HelpCircle, 
  TrendingUp, 
  Sliders, 
  Info,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { ModelEvaluationDetail } from "../types";

export default function MlDiagnostics() {
  const [selectedModel, setSelectedModel] = useState<string>("XGBoost");
  const [diagnostics, setDiagnostics] = useState<ModelEvaluationDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  const modelsList = [
    "XGBoost",
    "Random Forest",
    "CatBoost",
    "LightGBM",
    "Support Vector Machine",
    "Logistic Regression"
  ];

  const fetchModelDiagnostics = async (modelName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/models/diagnostics/${encodeURIComponent(modelName)}`);
      const data = await response.json();
      setDiagnostics(data);
    } catch (err) {
      console.error("Failed to load model diagnostics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModelDiagnostics(selectedModel);
  }, [selectedModel]);

  return (
    <div className="flex-1 relative min-h-0 min-w-0 bg-transparent overflow-y-auto text-slate-200">
      <div className="relative min-h-full p-8 w-full z-10 flex flex-col">
        {/* Animated Background Image - fully visible and moves when scrolling */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <div 
            className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
            style={{ 
              backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(10).jpeg")',
              opacity: 1.0
            }}
          />
        </div>
      
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/85">
          <div>
            <h2 id="diagnostics-title" className="text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <Cpu className="w-6 h-6 text-cyan-400" />
              CLASSICAL ML PIPELINE EVALUATOR
            </h2>
            <p className="text-xs text-slate-200 font-mono font-bold" style={textShadowStyle}>
              Audit standard classifiers. Review confusion matrices, feature importances, ROC curves, Precision-Recall statistics, and SHAP directional forces.
            </p>
          </div>

          {/* Model pick pill list */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950/40 backdrop-blur-sm p-1 rounded border border-slate-700/50 max-w-lg">
            {modelsList.map((m) => (
              <button
                key={m}
                id={`model-select-${m.replace(/\s+/g, '')}`}
                onClick={() => setSelectedModel(m)}
                className={`px-3 py-1.5 rounded text-[10px] font-sans font-bold transition-all cursor-pointer ${
                  selectedModel === m 
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "text-slate-300 hover:text-white"
                }`}
                style={textShadowStyle}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {isLoading || !diagnostics ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-cyan-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-cyan-400" />
            <span className="uppercase text-xs tracking-widest text-cyan-400 animate-pulse" style={textShadowStyle}>Recalculating pipeline boundaries...</span>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Classification Performance Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              <div className="p-4 rounded text-center border border-slate-700/50 bg-transparent shadow-2xl">
                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest" style={textShadowStyle}>Global Accuracy</span>
                <strong id="diag-accuracy" className="text-2xl block font-mono text-cyan-400 mt-1" style={textShadowStyle}>{(diagnostics.metrics.accuracy * 100).toFixed(1)}%</strong>
              </div>

              <div className="p-4 rounded text-center border border-slate-700/50 bg-transparent shadow-2xl">
                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest" style={textShadowStyle}>Precision Coefficient</span>
                <strong id="diag-precision" className="text-2xl block font-mono text-cyan-400 mt-1" style={textShadowStyle}>{(diagnostics.metrics.precision * 100).toFixed(1)}%</strong>
              </div>

              <div className="p-4 rounded text-center border border-slate-700/50 bg-transparent shadow-2xl">
                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest" style={textShadowStyle}>Recall (Sensitivity)</span>
                <strong id="diag-recall" className="text-2xl block font-mono text-cyan-400 mt-1" style={textShadowStyle}>{(diagnostics.metrics.recall * 100).toFixed(1)}%</strong>
              </div>

              <div className="p-4 rounded text-center border border-slate-700/50 bg-transparent shadow-2xl">
                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest" style={textShadowStyle}>F1 Score Harmonic</span>
                <strong id="diag-f1" className="text-2xl block font-mono text-cyan-400 mt-1" style={textShadowStyle}>{(diagnostics.metrics.f1Score * 100).toFixed(1)}%</strong>
              </div>

              <div className="p-4 rounded text-center border border-slate-700/50 bg-transparent shadow-2xl">
                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest" style={textShadowStyle}>Area under ROC (AUC)</span>
                <strong id="diag-auc" className="text-2xl block font-mono text-cyan-400 mt-1" style={textShadowStyle}>{(diagnostics.metrics.rocAuc * 100).toFixed(1)}%</strong>
              </div>

            </div>

            {/* Feature Importance & Confusion Matrix grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Feature Importance Chart */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-2xl lg:col-span-2">
                <h3 className="text-xs font-mono text-cyan-400 mb-4 uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2" style={textShadowStyle}>
                  <Sliders className="w-4 h-4" />
                  GINI FEATURE IMPORTANCE DIAGRAMS
                </h3>
                
                <div className="h-72">
                  <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart
                      data={diagnostics.importance}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.05)" />
                      <XAxis type="number" stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                      <YAxis 
                        type="category" 
                        dataKey="featureName" 
                        stroke="#06b6d4" 
                        fontSize={9} 
                        style={{ fontFamily: "monospace" }} 
                        width={120} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                        itemStyle={{ color: "#fff", fontSize: "11px", fontFamily: "monospace" }}
                      />
                      <Bar dataKey="importance" fill="#06b6d4">
                        {diagnostics.importance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#06b6d4" : "#0891b2"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </SafeResponsiveContainer>
                </div>
              </div>

              {/* Confusion Matrix Card */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-2xl lg:col-span-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 mb-4 uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2" style={textShadowStyle}>
                    <GitBranch className="w-4 h-4" />
                    CONFUSION MATRIX GRID
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-center font-mono mt-4">
                    
                    {/* TRUE NEGATIVE */}
                    <div className="p-4 bg-cyan-950/40 border border-cyan-800/25 rounded">
                      <span className="text-[9px] text-cyan-400 block font-bold uppercase tracking-widest" style={textShadowStyle}>True Neg (Safe)</span>
                      <strong className="text-xl text-cyan-400 block mt-1" style={textShadowStyle}>{diagnostics.matrix.tn}</strong>
                      <span className="text-[8px] text-slate-300 font-mono font-bold" style={textShadowStyle}>Classifier predicts safe; actual safe.</span>
                    </div>

                    {/* FAL POSITIVE */}
                    <div className="p-4 bg-rose-950/40 border border-rose-800/25 rounded">
                      <span className="text-[9px] text-rose-450 block font-bold uppercase tracking-widest" style={textShadowStyle}>False Pos (Alarm)</span>
                      <strong className="text-xl text-rose-500 block mt-1" style={textShadowStyle}>{diagnostics.matrix.fp}</strong>
                      <span className="text-[8px] text-slate-300 font-mono font-bold" style={textShadowStyle}>Predicts threat; actual safe.</span>
                    </div>

                    {/* FAL NEGATIVE */}
                    <div className="p-4 bg-rose-950/40 border border-rose-850 rounded">
                      <span className="text-[9px] text-rose-450 block font-bold uppercase tracking-widest" style={textShadowStyle}>False Neg (Leakage)</span>
                      <strong className="text-xl text-rose-500 block mt-1" style={textShadowStyle}>{diagnostics.matrix.fn}</strong>
                      <span className="text-[8px] text-slate-300 font-mono font-bold" style={textShadowStyle}>Predicts safe; actual threat.</span>
                    </div>

                    {/* TRU POSITIVE */}
                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/25 rounded">
                      <span className="text-[9px] text-white block font-bold uppercase tracking-widest" style={textShadowStyle}>True Pos (Inter)</span>
                      <strong className="text-xl text-white block mt-1" style={textShadowStyle}>{diagnostics.matrix.tp}</strong>
                      <span className="text-[8px] text-slate-300 font-mono font-bold" style={textShadowStyle}>Predicts threat; actual threat.</span>
                    </div>

                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-950/40 backdrop-blur-md rounded border border-slate-700/50 text-[10px] font-mono text-slate-300 leading-relaxed flex items-start gap-1.5 shadow-inner">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span style={textShadowStyle} className="font-bold">
                    Confusion matrix calculated using a test cohort representing 3,577 credential harvesting URL signatures.
                  </span>
                </div>
              </div>

            </div>

            {/* Interactive curves (ROC and PR Curves) using Recharts LineChart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* ROC Curve */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-2xl">
                <h3 className="text-xs font-mono text-cyan-400 mb-4 uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-1.5" style={textShadowStyle}>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  ROC CURVE (TPR VS. FPR)
                </h3>
                
                <div className="h-60">
                  <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <LineChart data={diagnostics.rocCurve} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.05)" />
                      <XAxis dataKey="fpr" stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                      <YAxis stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                        itemStyle={{ color: "#fff", fontSize: "11px", fontFamily: "monospace" }}
                      />
                      <Line type="monotone" dataKey="tpr" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} name="Sensitivity (TPR)" />
                      <Line type="monotone" dataKey="fpr" stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 4" name="Baseline random guess" />
                    </LineChart>
                  </SafeResponsiveContainer>
                </div>
              </div>

              {/* Precision Recall Curve */}
              <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-2xl">
                <h3 className="text-xs font-mono text-cyan-400 mb-4 uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-1.5" style={textShadowStyle}>
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  PRECISION-RECALL CURVES (AUCPR)
                </h3>
                
                <div className="h-60">
                  <SafeResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <LineChart data={diagnostics.prCurve} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.05)" />
                      <XAxis dataKey="recall" stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                      <YAxis stroke="#06b6d4" fontSize={10} style={{ fontFamily: "monospace" }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#06b6d4", borderRadius: "4px" }}
                        itemStyle={{ color: "#fff", fontSize: "11px", fontFamily: "monospace" }}
                      />
                      <Line type="monotone" dataKey="precision" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Precision" />
                    </LineChart>
                  </SafeResponsiveContainer>
                </div>
              </div>

            </div>

            {/* SHAP FORCE EXPLANATION EXPLAINER */}
            <div className="p-6 rounded border border-slate-700/50 bg-transparent shadow-2xl">
              <h3 className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest border-b border-slate-800/80 pb-2" style={textShadowStyle}>
                SHAPLEY ADDITIVE EXPLANATIONS directional forces (LOCAL FORCE INFLUENCE)
              </h3>
              <p className="text-xs font-sans text-slate-300 leading-normal mb-4 font-bold" style={textShadowStyle}>
                SHAP (SHapley Additive exPlanations) values allocate credit to feature parameters based on game theory mathematically. Below illustrates the positive push (increasing probability of phishing classification) vs. negative push (proving legitimate baseline status) on modern URLs.
              </p>

              <div className="space-y-4 font-mono text-xs text-slate-200">
                {diagnostics.importance.map((feature, index) => {
                  const isMaliciousPush = feature.shapValue > 0;
                  return (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-slate-700/50 bg-slate-950/30 backdrop-blur-sm rounded">
                      <span className="text-white font-bold font-sans" style={textShadowStyle}>{feature.featureName}</span>
                      
                      <div className="flex items-center gap-4 mt-2 md:mt-0 font-mono text-[10px]">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isMaliciousPush ? "bg-rose-950/60 text-rose-400" : "bg-cyan-950/60 text-cyan-400"
                        }`} style={textShadowStyle}>
                          {isMaliciousPush ? "🡑 PUSHES TOWARDS MALICIOUS" : "🡓 PUSHES TOWARDS SAFE"}
                        </span>
                        <div className="w-32 bg-slate-950/60 rounded-sm h-2.5 overflow-hidden relative">
                          <div 
                            className={`h-full absolute rounded-sm ${isMaliciousPush ? "bg-rose-500 right-1/2 left-auto" : "bg-cyan-500 left-1/2 right-auto"}`}
                            style={{ 
                              width: `${Math.abs(feature.shapValue) * 100}%`,
                              transform: isMaliciousPush ? "translateX(0)" : "translateX(0)"
                            }}
                          />
                        </div>
                        <span className={`font-bold ${isMaliciousPush ? "text-rose-450" : "text-cyan-400"}`} style={textShadowStyle}>
                          {isMaliciousPush ? "+" : ""}{feature.shapValue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
