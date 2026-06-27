import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Terminal, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  Cpu,
  RefreshCw,
  User,
  ShieldCheck
} from "lucide-react";
import { ChatMessage, UrlAnalysisResult } from "../types";

interface SecurityCopilotProps {
  urlAnalysisContext: UrlAnalysisResult | null;
}

export default function SecurityCopilot({ urlAnalysisContext }: SecurityCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>( [
    {
      id: "init",
      sender: "assistant",
      text: "SecOps Copilot active. Welcome, Analyst. Standard queries (typosquatting distance, Unicode Punycode homographs, MITRE alignment mappings, or quarantine mitigations) are synchronized. Submit a prompt or inspect the active URL contextual payload below.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  const predefinedQueries = [
    "Explain typosquatting attacks and how CyberKavach intercepts them.",
    "Show standard MITRE techniques that align with malicious credential harvesting URLs.",
    "Why is the active URL context labeled suspicious?",
    "Recommend immediate corporate mitigations to secure targets like this."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setInputText("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
          urlAnalysisContext: urlAnalysisContext ? {
            url: urlAnalysisContext.url,
            overallRiskScore: urlAnalysisContext.overallRiskScore,
            threatLevel: urlAnalysisContext.threatLevel,
            features: urlAnalysisContext.features
          } : null
        })
      });

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.text || "Diagnostic stream error. Restructuring security connection.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);

    } catch (err) {
      console.error("AI Assistant exchange failed:", err);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "Cryptographic link broken. Fallback server logic unavailable.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden text-slate-200 uppercase font-mono relative isolate">
      
      {/* Animated Background Image - fully visible and moves when scrolling */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        <div 
          className="w-full h-full bg-cover bg-center animate-bg-pan-zoom"
          style={{ 
            backgroundImage: 'url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%D0%98%D1%89%D0%B5%D1%82%D0%B5%20%D0%B8%D0%BD%D0%BD%D0%BE%D0%B2%D0%B0%D1%86%D0%B8%D0%B8%20%D0%B2%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B0%D1%85_%20%D0%9D%D0%B5%D0%B9%D1%80%D0%BE%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D0%B5%D1%86%20%E2%80%94%20%D0%B2%D0%B0%D1%88%20%D0%BA%D0%BB%D1%8E%D1%87%20%D0%BA%20%D1%83%D1%81%D0%BF%D0%B5%D1%85%D1%83!_.jpeg")',
            opacity: 1.0
          }}
        />
      </div>

      {/* CO-PILOT SUB HEADER */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-950/45 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/15 border border-cyan-500/35">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider" style={textShadowStyle}>
              CYBERKAVACH COPILOT (SEC_COPLT_v0.9)
            </h2>
            <p className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase font-bold" style={textShadowStyle}>
              Explainable Security AI • Powered by Gemini 2.5 Flash
            </p>
          </div>
        </div>

        {/* ACTIVE URL INSPECTED CONTEXT */}
        {urlAnalysisContext && (
          <div className="p-2.5 rounded border border-slate-800 bg-slate-950/40 backdrop-blur-sm text-[9px] max-w-sm hidden md:block">
            <span className="text-slate-350 block text-[8px] uppercase font-bold" style={textShadowStyle}>Active Context Tunnel</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-white font-sans">
              <span className={`w-1.5 h-1.5 rounded-full ${urlAnalysisContext.overallRiskScore >= 40 ? "bg-rose-500 animate-ping" : "bg-cyan-400"}`}></span>
              <span className="truncate font-bold text-[10px]" style={textShadowStyle}>{urlAnalysisContext.features.domain}</span>
              <span className="text-cyan-400 font-bold ml-1" style={textShadowStyle}>{urlAnalysisContext.overallRiskScore}%</span>
            </div>
          </div>
        )}
      </div>

      {/* CHAT CHUNK FEED */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        
        {messages.map((m) => {
          const isAssistant = m.sender === "assistant";
          return (
            <div 
              key={m.id} 
              id={`chat-msg-${m.id}`}
              className={`flex gap-3 max-w-3xl ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className={`p-2 h-fit rounded border shrink-0 ${isAssistant ? "bg-slate-950/60 border-cyan-500/35 text-cyan-400" : "bg-cyan-950/60 border-cyan-500/40 text-cyan-400"}`}>
                {isAssistant ? <Terminal className="w-4 h-4 text-cyan-400" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded border text-xs leading-relaxed font-sans normal-case ${
                isAssistant 
                  ? "bg-slate-950/50 backdrop-blur-md border-slate-700/50 text-slate-200" 
                  : "bg-cyan-950/30 backdrop-blur-md border-cyan-800/45 text-white"
              }`}>
                <span className="text-[9px] font-mono text-slate-350 uppercase tracking-widest block mb-1.5 font-bold select-none" style={textShadowStyle}>
                  {isAssistant ? "AI Defensive Agent • CyberKavach" : "SecOps Analyst"}
                </span>
                <p className="whitespace-pre-wrap font-bold" style={textShadowStyle}>{m.text}</p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 mr-auto items-center animate-pulse">
            <div className="p-2 rounded border bg-slate-950/60 border-cyan-500/20 text-cyan-400 animate-pulse">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
            <span className="text-[10px] text-slate-250 tracking-wider font-bold" style={textShadowStyle}>CYBER CONTEXT QUERY STREAMING...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTIONS CARDS */}
      <div className="p-4 bg-slate-950/50 backdrop-blur-md border-t border-slate-800/80 flex-shrink-0 print:hidden">
        <div className="flex items-center gap-1.5 text-[9px] text-cyan-400/85 mb-2 tracking-widest font-bold" style={textShadowStyle}>
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>SUGGESTED DISCOVERY QUERIES:</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 font-mono">
          {predefinedQueries.map((q, idx) => (
            <button
              key={idx}
              id={`quick-query-${idx}`}
              onClick={() => handleSendMessage(q)}
              className="text-[10px] whitespace-nowrap bg-slate-950/60 hover:bg-cyan-500/20 hover:text-white text-slate-200 border border-slate-700/50 hover:border-cyan-550/60 py-1.5 px-3 rounded text-left transition-all shrink-0 cursor-pointer font-bold shadow-md"
              style={textShadowStyle}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT INPUT AREA */}
      <div className="p-6 border-t border-slate-800/80 bg-slate-950/50 backdrop-blur-md flex-shrink-0 print:hidden">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-4"
        >
          <input
            type="text"
            id="copilot-input-box"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Query tactical forensics, Unicode Homographs, or mitigations..."
            className="flex-1 bg-slate-950/60 border border-slate-700/50 focus:border-cyan-550 text-white p-3.5 rounded font-mono text-xs outline-none transition-all shadow-inner"
            style={textShadowStyle}
          />
          <button
            type="submit"
            id="copilot-send-btn"
            disabled={isLoading || !inputText.trim()}
            className="px-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 rounded font-mono font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          >
            <Send className="w-3.5 h-3.5 text-slate-950" />
            <span>SEND</span>
          </button>
        </form>
      </div>

    </div>
  );
}
