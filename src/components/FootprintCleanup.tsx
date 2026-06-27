import React, { useState, useEffect } from "react";
import { 
  Shield, ShieldAlert, Globe, Lock, Unlock, Mail, ExternalLink, 
  Clock, Download, CheckSquare, Trash, Search, Filter, Calendar, 
  Bell, FileText, CheckCircle, ArrowRight, AlertTriangle, Info, Copy, Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FootprintScanResult } from "../types";

interface FootprintCleanupProps {
  activeScan: FootprintScanResult;
  onAddNotification: (notif: any) => void;
  onClose: () => void;
}

interface CleanupItem {
  id: string;
  website: string;
  category: 'Social Media' | 'Professional Networks' | 'Forums' | 'Blogs' | 'Data Broker Websites' | 'Cached Search Results' | 'Old Accounts';
  visibility: 'Public' | 'Private' | 'Limited';
  risk: 'Low' | 'Medium' | 'High';
  priority: 'High' | 'Medium' | 'Low';
  actionLabel: string;
  actionType: 'deletion' | 'deactivation' | 'privacy' | 'search_removal' | 'manual_request';
  actionUrl: string;
  description: string;
  status: 'Pending' | 'Completed' | 'In Progress';
  actionTaken?: 'Removed' | 'Made Private';
  contactEmail?: string;
  emailSubject?: string;
  emailBody?: string;
}

export default function FootprintCleanup({ activeScan, onAddNotification, onClose }: FootprintCleanupProps) {
  // Try loading saved state from localStorage first
  const storageKey = `footprint-cleanup-state-${activeScan.id}`;
  
  const [items, setItems] = useState<CleanupItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved cleanup state:", e);
      }
    }
    
    // Default fallback list of items personalized using the scan query
    const userQuery = activeScan.query;
    const username = userQuery.split("@")[0] || userQuery;
    
    return [
      {
        id: "cl-1",
        website: "BeenVerified (Data Broker)",
        category: "Data Broker Websites",
        visibility: "Public",
        risk: "High",
        priority: "High",
        actionLabel: "Opt-Out of BeenVerified",
        actionType: "deletion",
        actionUrl: "https://www.beenverified.com/f/optout/search",
        description: `This aggregator indexes your public ${activeScan.type === 'email' ? 'email' : 'credentials'} and associates them with background reports. Removing this listings reduces direct exposure to telemarketers & hackers.`,
        status: "Pending"
      },
      {
        id: "cl-2",
        website: "Spokeo (Data Broker)",
        category: "Data Broker Websites",
        visibility: "Public",
        risk: "High",
        priority: "High",
        actionLabel: "Opt-Out of Spokeo",
        actionType: "deletion",
        actionUrl: "https://www.spokeo.com/optout",
        description: `Spokeo actively compiles data records linking ${activeScan.type === 'phone' ? 'your phone' : 'your info'} to geographical records and old profiles. Opting out will suppress search results.`,
        status: "Pending"
      },
      {
        id: "cl-3",
        website: "Whitepages (Data Broker)",
        category: "Data Broker Websites",
        visibility: "Public",
        risk: "High",
        priority: "High",
        actionLabel: "Opt-Out of Whitepages",
        actionType: "deletion",
        actionUrl: "https://www.whitepages.com/suppress-profile",
        description: "Contains searchable contact cards. Deleting Whitepages listings prevents automated scraping and social engineering attempts.",
        status: "Pending"
      },
      {
        id: "cl-4",
        website: "Google Search Outdated Cache",
        category: "Cached Search Results",
        visibility: "Public",
        risk: "High",
        priority: "High",
        actionLabel: "Submit Removal Request",
        actionType: "search_removal",
        actionUrl: "https://search.google.com/search-console/remove-outdated-content",
        description: `Your ${activeScan.type} is cached in old search snippets even after the page is modified. This tool requests Google to purge obsolete indices.`,
        status: "Pending"
      },
      {
        id: "cl-5",
        website: "Legacy PHPBB Developer Forum",
        category: "Forums",
        visibility: "Public",
        risk: "High",
        priority: "High",
        actionLabel: "Generate Removal Email",
        actionType: "manual_request",
        actionUrl: "#",
        contactEmail: "admin@legacydevforum.org",
        emailSubject: `Data Removal Request under GDPR/CCPA - Account associated with ${userQuery}`,
        emailBody: `Dear Forum Support Team,

I am writing to formally request the permanent deletion of my old user account and all personal details (including email addresses, profile descriptions, and IP history) linked to my identifier "${username}".

According to my right to be forgotten (GDPR Art. 17 / CCPA), please process this erasure and confirm once complete.

Sincerely,
${username}`,
        description: "An outdated developer forum containing plaintext security discussions and exposed email headers from 2018. Requires a manual deletion request.",
        status: "Pending"
      },
      {
        id: "cl-6",
        website: "Personal WordPress Blog (Archive)",
        category: "Blogs",
        visibility: "Public",
        risk: "High",
        priority: "High",
        actionLabel: "Generate Deletion Email",
        actionType: "manual_request",
        actionUrl: "#",
        contactEmail: "contact@blogarchive-hosting.net",
        emailSubject: `Request to remove public exposure: ${userQuery}`,
        emailBody: `Dear Blog Archive Host,

I noticed a public page on your archived blog platform containing my cleartext email address and personal portfolio info at the URL containing "${username}". 

Please take down or anonymize this specific page to protect my privacy. 

Best regards,
${username}`,
        description: "An archived blog containing personal contact information and older resumes. No self-service deletion option is available.",
        status: "Pending"
      },
      {
        id: "cl-7",
        website: "Facebook Profile",
        category: "Social Media",
        visibility: "Public",
        risk: "Medium",
        priority: "Medium",
        actionLabel: "Manage Privacy Settings",
        actionType: "privacy",
        actionUrl: "https://www.facebook.com/settings?tab=privacy",
        description: "Your social connections and photos are visible to the public. Changing search engine visibility stops Facebook profiles from appearing on Google.",
        status: "Pending"
      },
      {
        id: "cl-8",
        website: "Reddit Account",
        category: "Forums",
        visibility: "Public",
        risk: "Medium",
        priority: "Medium",
        actionLabel: "Open Account Deactivation",
        actionType: "deactivation",
        actionUrl: "https://www.reddit.com/settings/deactivate",
        description: `Old Reddit posts link your username '${username}' to technical topics and geographical locations, exposing personal trends. Deactivation removes the link.`,
        status: "Pending"
      },
      {
        id: "cl-9",
        website: "GitHub Public Commits",
        category: "Professional Networks",
        visibility: "Public",
        risk: "Medium",
        priority: "Medium",
        actionLabel: "Open Email Settings",
        actionType: "privacy",
        actionUrl: "https://github.com/settings/emails",
        description: "Exposes metadata about your system clock, git email configurations, and coding times. Toggle 'Keep my email addresses private' inside your settings.",
        status: "Pending"
      },
      {
        id: "cl-10",
        website: "LinkedIn Directory",
        category: "Professional Networks",
        visibility: "Public",
        risk: "Low",
        priority: "Low",
        actionLabel: "Open Profile Settings",
        actionType: "privacy",
        actionUrl: "https://www.linkedin.com/psettings/privacy",
        description: "Your professional profile is indexed by search engines. Restricting off-platform visibility keeps your resume secure from spam cold-callers.",
        status: "Pending"
      },
      {
        id: "cl-11",
        website: "Medium Blog",
        category: "Blogs",
        visibility: "Public",
        risk: "Low",
        priority: "Low",
        actionLabel: "Open Profile Settings",
        actionType: "privacy",
        actionUrl: "https://medium.com/me/settings",
        description: "Legacy articles indexable by web crawlers. Making posts private or updating handles mitigates footprint tracking.",
        status: "Pending"
      },
      {
        id: "cl-12",
        website: "Verified Company Profile",
        category: "Professional Networks",
        visibility: "Public",
        risk: "Low",
        priority: "Low",
        actionLabel: "Request Directory Update",
        actionType: "privacy",
        actionUrl: "#",
        description: "Official company listings indicating active corporate association. Highly secure but serves as public verification of employment.",
        status: "Pending"
      }
    ];
  });

  // Scheduling States
  const [scheduleEnabled, setScheduleEnabled] = useState(() => {
    return localStorage.getItem(`footprint-schedule-${activeScan.id}`) === "true";
  });
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem(`footprint-reminders-${activeScan.id}`) === "true";
  });

  // UI States
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activePriority, setActivePriority] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItemForEmail, setSelectedItemForEmail] = useState<CleanupItem | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  useEffect(() => {
    localStorage.setItem(`footprint-schedule-${activeScan.id}`, String(scheduleEnabled));
  }, [scheduleEnabled, activeScan.id]);

  useEffect(() => {
    localStorage.setItem(`footprint-reminders-${activeScan.id}`, String(remindersEnabled));
  }, [remindersEnabled, activeScan.id]);

  const handleActionClick = (item: CleanupItem) => {
    if (item.actionType === "manual_request") {
      setSelectedItemForEmail(item);
    } else if (item.actionUrl && item.actionUrl !== "#") {
      window.open(item.actionUrl, "_blank");
      onAddNotification({
        id: "cleanup-click-" + Date.now(),
        title: "Redirecting to Opt-out",
        message: `Securely opened the opt-out or removal page for ${item.website}.`,
        type: "tip",
        timestamp: new Date().toISOString(),
        read: false
      });
      // Mark as In Progress automatically
      if (item.status === "Pending") {
        updateItemStatus(item.id, "In Progress");
      }
    }
  };

  const updateItemStatus = (id: string, status: 'Pending' | 'Completed' | 'In Progress', actionTaken?: 'Removed' | 'Made Private') => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status, 
          actionTaken: actionTaken || (status === 'Completed' ? 'Removed' : undefined) 
        };
      }
      return item;
    }));
  };

  const handleBulkOpen = () => {
    const urlsToOpen = items
      .filter(item => item.status !== "Completed" && item.actionUrl && item.actionUrl !== "#")
      .map(item => item.actionUrl);
    
    if (urlsToOpen.length === 0) {
      alert("No pending automated cleanup URLs found.");
      return;
    }

    if (confirm(`This will open ${urlsToOpen.length} cleanup and opt-out tabs in your browser. Would you like to proceed?`)) {
      urlsToOpen.forEach(url => window.open(url, "_blank"));
      onAddNotification({
        id: "bulk-cleanup-" + Date.now(),
        title: "Bulk Opt-Out Opened",
        message: `Opened ${urlsToOpen.length} security removal pages in separate tabs.`,
        type: "coach",
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate downloadable plain text checklist
  const handleDownloadReport = () => {
    const totalFound = items.length;
    const completed = items.filter(i => i.status === "Completed").length;
    const remaining = totalFound - completed;
    const currentScore = calculateScore();

    let reportText = `========================================================================
CYBERKAVACH ENTERPRISE PRIVACY CLEANUP STRATEGY REPORT
========================================================================
Target Entity: ${activeScan.query}
Timestamp: ${new Date().toLocaleString()}
Privacy Protection Score: ${currentScore}/100

CLEANUP PROGRESS SUMMARY:
- Profiles Discovered: ${totalFound}
- High-Risk Profiles: ${items.filter(i => i.priority === "High").length}
- Completed & Cleared: ${completed}
- Remaining Threat Points: ${remaining}

------------------------------------------------------------------------
ACTIONABLE REMOVAL DIRECTORY & MANUAL INSTRUCTIONS
------------------------------------------------------------------------

`;

    items.forEach((item, index) => {
      reportText += `${index + 1}. [${item.priority.toUpperCase()} PRIORITY] ${item.website}
   - Category: ${item.category}
   - Visibility: ${item.visibility}
   - Cleanup Action: ${item.actionLabel}
   - Status: ${item.status.toUpperCase()} ${item.actionTaken ? `(${item.actionTaken})` : ""}
   - Description: ${item.description}
   ${item.actionUrl && item.actionUrl !== "#" ? `- Direct Link: ${item.actionUrl}` : ""}
   ${item.actionType === "manual_request" ? `- Support Contact: ${item.contactEmail}\n   - Email Subject: ${item.emailSubject}\n   - Request Body:\n     "${item.emailBody}"` : ""}
\n------------------------------------------------------------------------\n`;
    });

    reportText += `\nDisclaimer: CyberKavach does not delete third-party accounts directly. Instead, it securely directs you to official deletion, settings, or opt-out pages and guides you through the process.\n`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CyberKavach_Privacy_Cleanup_Guide_${activeScan.query.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onAddNotification({
      id: "cleanup-report-download-" + Date.now(),
      title: "Cleanup Guide Downloaded",
      message: "The offline cleanup guide and action list has been successfully downloaded.",
      type: "achievement",
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const calculateScore = () => {
    const total = items.length;
    if (total === 0) return 100;
    
    // Base formula: start with 60, increase dynamically as items are completed
    // High Priority counts for more
    const totalWeight = items.reduce((acc, item) => acc + (item.priority === 'High' ? 3 : item.priority === 'Medium' ? 2 : 1), 0);
    const completedWeight = items.reduce((acc, item) => {
      if (item.status === 'Completed') {
        return acc + (item.priority === 'High' ? 3 : item.priority === 'Medium' ? 2 : 1);
      }
      return acc;
    }, 0);

    const percentDone = completedWeight / totalWeight;
    // Map remaining vulnerability to a beautiful dynamic score
    return Math.min(100, Math.round(55 + percentDone * 45));
  };

  const filteredItems = items.filter(item => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const matchPriority = activePriority === "All" || item.priority === activePriority;
    const matchSearch = item.website.toLowerCase().includes(searchFilter.toLowerCase()) || 
                        item.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCategory && matchPriority && matchSearch;
  });

  const categories = ["All", "Social Media", "Professional Networks", "Forums", "Blogs", "Data Broker Websites", "Cached Search Results"];
  const priorities = ["All", "High", "Medium", "Low"];

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  return (
    <div className="flex flex-col gap-6" style={textShadowStyle}>
      {/* Back Header & Overview Banner */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <button 
            onClick={onClose}
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-widest cursor-pointer mb-2"
          >
            ← BACK TO SCANS
          </button>
          <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Footprint Cleanup Dashboard
          </h3>
          <p className="text-[11px] text-slate-300 font-sans mt-0.5">
            Step-by-step assistant directing you to official privacy pages and de-indexing requests.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadReport}
            className="px-3 py-1.5 bg-transparent border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-white font-mono text-[10px] font-bold rounded transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT GUIDE</span>
          </button>
          
          <button
            onClick={handleBulkOpen}
            className="px-3 py-1.5 bg-cyan-950/40 border border-cyan-400 hover:bg-cyan-500 hover:text-white text-cyan-400 font-mono text-[10px] font-bold rounded transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>BULK OPEN PAGES</span>
          </button>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded border border-cyan-500/20 bg-transparent text-center">
          <span className="text-[9px] text-slate-400 block mb-0.5 uppercase font-mono">PROFILES DISCOVERED</span>
          <span className="text-xl font-extrabold text-white font-mono">{items.length}</span>
        </div>
        <div className="p-4 rounded border border-cyan-500/20 bg-transparent text-center">
          <span className="text-[9px] text-slate-400 block mb-0.5 uppercase font-mono">HIGH-RISK EXPOSURES</span>
          <span className="text-xl font-extrabold text-rose-400 font-mono">
            {items.filter(i => i.priority === "High" && i.status !== "Completed").length}
          </span>
        </div>
        <div className="p-4 rounded border border-cyan-500/20 bg-transparent text-center">
          <span className="text-[9px] text-slate-400 block mb-0.5 uppercase font-mono">REMOVED / CLEANED</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono">
            {items.filter(i => i.status === "Completed" && i.actionTaken === "Removed").length}
          </span>
        </div>
        <div className="p-4 rounded border border-cyan-500/20 bg-transparent text-center">
          <span className="text-[9px] text-slate-400 block mb-0.5 uppercase font-mono">MADE PRIVATE</span>
          <span className="text-xl font-extrabold text-cyan-400 font-mono">
            {items.filter(i => i.status === "Completed" && i.actionTaken === "Made Private").length}
          </span>
        </div>
        <div className="p-4 rounded border border-cyan-500/20 bg-transparent text-center relative flex flex-col justify-center items-center">
          <span className="text-[9px] text-slate-400 block mb-0.5 uppercase font-mono">PRIVACY SCORE</span>
          <span className="text-xl font-extrabold text-white font-mono">{calculateScore()}/100</span>
          {/* Subtle Mini Progress Bar */}
          <div className="w-16 bg-cyan-950 h-1 rounded overflow-hidden mt-1.5">
            <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${calculateScore()}%` }}></div>
          </div>
        </div>
      </div>

      {/* Scheduler & Alerts Configuration Row */}
      <div className="p-4 rounded border border-cyan-500/20 bg-transparent flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 rounded border border-cyan-500/20">
            <Bell className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase">FOOTPRINT MONITORING SYSTEM</h4>
            <p className="text-[10px] text-slate-300 font-sans mt-0.5">Automate OSINT scraping checks and receive continuous removal notifications.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 font-mono text-[10px] font-bold">
          {/* Toggle 1: Schedule */}
          <button
            onClick={() => {
              const newVal = !scheduleEnabled;
              setScheduleEnabled(newVal);
              onAddNotification({
                id: "cleanup-sched-" + Date.now(),
                title: newVal ? "Scraping Schedule Enabled" : "Scraping Schedule Disabled",
                message: newVal 
                  ? "CyberKavach will run background scans of your public profiles every 30 days." 
                  : "Automatic background scans have been paused.",
                type: "tip",
                timestamp: new Date().toISOString(),
                read: false
              });
            }}
            className={`px-3 py-1.5 border rounded cursor-pointer transition-all uppercase flex items-center gap-2 ${
              scheduleEnabled 
                ? "bg-cyan-950/60 text-cyan-400 border-cyan-500" 
                : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Scans: {scheduleEnabled ? "MONTHLY (ACTIVE)" : "OFF"}</span>
          </button>

          {/* Toggle 2: Reminders */}
          <button
            onClick={() => {
              const newVal = !remindersEnabled;
              setRemindersEnabled(newVal);
              onAddNotification({
                id: "cleanup-remind-" + Date.now(),
                title: newVal ? "Reminders Configured" : "Reminders Suppressed",
                message: newVal 
                  ? "Browser prompts will trigger alert cues for unfinished footprint removal actions." 
                  : "Privacy removal alerts turned off.",
                type: "alert",
                timestamp: new Date().toISOString(),
                read: false
              });
            }}
            className={`px-3 py-1.5 border rounded cursor-pointer transition-all uppercase flex items-center gap-2 ${
              remindersEnabled 
                ? "bg-amber-950/40 text-amber-400 border-amber-500/40" 
                : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Task Reminders: {remindersEnabled ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Disclaimers & Info */}
      <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded font-sans text-[11px] leading-relaxed text-slate-300 flex gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase font-mono block mb-0.5">Important Compliance Notice</span>
          CyberKavach <span className="text-white font-semibold">does not directly edit or delete accounts on third-party services</span>. Rather, it securely directs you to authentic deletion panels, privacy toggles, opt-out registries, and provides customizable removal requests templates, fully preserving your legal and technical safety.
        </div>
      </div>

      {/* Directory Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="relative w-full md:w-64 font-mono text-xs">
          <input
            type="text"
            placeholder="Search exposure directories..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-transparent border border-cyan-500/20 focus:border-cyan-400 px-3 py-2 rounded text-white placeholder-slate-400 focus:outline-none transition-all pl-8 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[9px] font-bold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-1 px-2 border rounded transition-all uppercase cursor-pointer ${
                activeCategory === cat 
                  ? "bg-cyan-950/60 text-cyan-400 border-cyan-400" 
                  : "bg-transparent border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Removal Directory Directory Listings Table/List */}
      <div className="border border-cyan-500/10 rounded overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-cyan-950/40 p-3 text-[10px] font-mono font-bold text-slate-300 border-b border-cyan-500/20 uppercase">
          <div className="col-span-4">Website Directory</div>
          <div className="col-span-2 text-center">Visibility</div>
          <div className="col-span-2 text-center">Exposure Priority</div>
          <div className="col-span-4 text-right">Privacy Action</div>
        </div>

        {/* Directory Body */}
        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 uppercase font-mono bg-transparent">
              No matching profiles found in this selection.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isCompleted = item.status === "Completed";
              const priorityColor = item.priority === "High" ? "text-rose-400" : item.priority === "Medium" ? "text-amber-400" : "text-emerald-400";
              
              return (
                <div key={item.id} className={`p-4 transition-all ${isCompleted ? "opacity-50 bg-slate-950/20" : "bg-transparent hover:bg-cyan-950/10"}`}>
                  <div className="grid grid-cols-12 items-center gap-3">
                    {/* Website Column */}
                    <div className="col-span-12 md:col-span-4">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className={`w-4 h-4 shrink-0 ${item.priority === 'High' ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
                        )}
                        <div>
                          <p className="font-bold text-white text-xs">{item.website}</p>
                          <p className="text-[9px] text-slate-400 uppercase mt-0.5">{item.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Visibility */}
                    <div className="col-span-6 md:col-span-2 text-left md:text-center mt-2 md:mt-0">
                      <span className="text-[10px] text-slate-400 md:hidden block uppercase font-bold mb-0.5">Visibility</span>
                      <span className="text-[10px] border border-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-300 bg-cyan-950/10 uppercase">
                        {item.visibility}
                      </span>
                    </div>

                    {/* Exposure Priority */}
                    <div className="col-span-6 md:col-span-2 text-left md:text-center mt-2 md:mt-0">
                      <span className="text-[10px] text-slate-400 md:hidden block uppercase font-bold mb-0.5">Priority</span>
                      <span className={`text-[10px] font-bold ${priorityColor}`}>
                        {item.priority === 'High' ? '🔴 HIGH' : item.priority === 'Medium' ? '🟡 MEDIUM' : '🟢 LOW'}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="col-span-12 md:col-span-4 flex items-center justify-end gap-2 mt-4 md:mt-0">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded">
                          <Check className="w-3.5 h-3.5" />
                          <span>SECURED ({item.actionTaken?.toUpperCase() || "CLEANED"})</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleActionClick(item)}
                            className="px-2.5 py-1 text-[10px] text-cyan-400 hover:text-white hover:bg-cyan-500/20 border border-cyan-500/30 rounded font-bold cursor-pointer transition-all flex items-center gap-1"
                          >
                            <span>{item.actionLabel}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>

                          {/* Action Mark Toggles */}
                          <div className="flex gap-1 border border-slate-800 rounded p-0.5 bg-slate-900/40">
                            <button
                              onClick={() => updateItemStatus(item.id, "Completed", "Removed")}
                              title="Mark as Account Deleted"
                              className="px-1.5 py-0.5 text-[8px] hover:text-white hover:bg-rose-500/20 rounded text-rose-400 transition-all font-bold uppercase cursor-pointer"
                            >
                              Deleted
                            </button>
                            <button
                              onClick={() => updateItemStatus(item.id, "Completed", "Made Private")}
                              title="Mark as Settings Switched to Private"
                              className="px-1.5 py-0.5 text-[8px] hover:text-white hover:bg-emerald-500/20 rounded text-emerald-400 transition-all font-bold uppercase cursor-pointer"
                            >
                              Private
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expandable Assistant Analysis */}
                  <div className="mt-3 pt-3 border-t border-slate-800/40 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="col-span-12 font-sans text-slate-300 text-[11px] leading-relaxed flex gap-2 items-start">
                      <div className="bg-cyan-950/50 p-1 border border-cyan-500/20 rounded text-cyan-400 shrink-0">
                        <Shield className="w-3 h-3" />
                      </div>
                      <p>
                        <span className="font-mono text-[9px] font-bold text-cyan-400 uppercase block mb-0.5">AI Privacy Assistant Assessment</span>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Manual Request Email Templater Modal */}
      <AnimatePresence>
        {selectedItemForEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-lg p-6 flex flex-col gap-4 shadow-2xl font-mono text-xs text-slate-300"
              style={textShadowStyle}
            >
              <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  GENERATE DATA REMOVAL EMAIL
                </h4>
                <button 
                  onClick={() => setSelectedItemForEmail(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded font-sans text-[11px] text-slate-300">
                Some legacy platforms do not support self-service account deletion. Send the pre-configured removal template below to their support channel. Copy the prefilled content to your clipboard.
              </div>

              <div className="flex flex-col gap-2.5">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Support Contact Email:</p>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800 mt-1">
                    <span className="text-white select-all">{selectedItemForEmail.contactEmail}</span>
                    <button
                      onClick={() => copyToClipboard(selectedItemForEmail.contactEmail || "", "email-contact")}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === "email-contact" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === "email-contact" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Subject Line:</p>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800 mt-1">
                    <span className="text-white select-all">{selectedItemForEmail.emailSubject}</span>
                    <button
                      onClick={() => copyToClipboard(selectedItemForEmail.emailSubject || "", "email-subject")}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === "email-subject" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === "email-subject" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Email Body Content:</p>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800 mt-1 relative max-h-48 overflow-y-auto">
                    <pre className="text-white text-[10px] font-mono leading-relaxed whitespace-pre-wrap">{selectedItemForEmail.emailBody}</pre>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => copyToClipboard(selectedItemForEmail.emailBody || "", "email-body")}
                      className="px-3 py-1 bg-cyan-950 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded border border-cyan-500/30 transition-all font-bold text-[10px] flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === "email-body" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === "email-body" ? "COPY REMOVAL BODY" : "COPY EMAIL BODY"}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateItemStatus(selectedItemForEmail.id, "Completed", "Removed");
                      setSelectedItemForEmail(null);
                      onAddNotification({
                        id: "cleanup-completed-" + Date.now(),
                        title: "Flagged as Completed",
                        message: `Manually marked removal request for ${selectedItemForEmail.website} as processed.`,
                        type: "tip",
                        timestamp: new Date().toISOString(),
                        read: false
                      });
                    }}
                    className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-bold rounded cursor-pointer transition-all"
                  >
                    Mark Deletion Email Sent
                  </button>
                </div>
                <button
                  onClick={() => setSelectedItemForEmail(null)}
                  className="px-4 py-2 bg-transparent text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
