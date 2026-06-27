export type UserRole = 'Admin' | 'Researcher' | 'Analyst' | 'Guest' | string;

export interface UserSession {
  username: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface ExtractedFeatures {
  url: string;
  urlLength: number;
  domain: string;
  domainLength: number;
  digitsCount: number;
  specialCharsCount: number;
  dotsCount: number;
  hyphensCount: number;
  underscoresCount: number;
  isHttps: boolean;
  hasIpAddress: boolean;
  tld: string;
  tldCategory: 'Safe' | 'Suspicious' | 'Neutral';
  queryLength: number;
  parameterCount: number;
  entropy: number;
  brandSimilarityScore: number; // 0 to 100
  levenshteinDistanceToTarget: number;
  targetBrand: string;
  unicodeSpoofing: boolean;
  encodingSpoofing: boolean;
  suspiciousKeywordsCount: number;
  suspiciousKeywordsList: string[];
  redirectsCount: number;
}

export interface ModelMetric {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface ModelPrediction {
  modelName: string;
  probability: number; // 0 to 1
  prediction: 'Malicious' | 'Safe';
  decisionTimeMs: number;
}

export interface ConfusionMatrix {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

export interface FeatureImportance {
  featureName: string;
  importance: number; // 0 to 1
  shapValue: number; // impact direction (-ive or +ive)
}

export interface ModelEvaluationDetail {
  metrics: ModelMetric;
  matrix: ConfusionMatrix;
  importance: FeatureImportance[];
  predictions?: ModelPrediction[];
  // coordinates for charts
  rocCurve: { fpr: number; tpr: number }[];
  prCurve: { recall: number; precision: number }[];
}

export interface ThreatIntelEnrichment {
  virusTotal: { detectionCount: number; totalCount: number; scanDate: string; rating: 'Clean' | 'Suspicious' | 'Malicious' };
  openPhish: { isPhishing: boolean; detectedFirstTime: string };
  phishTank: { isPhishing: boolean; detailsUrl?: string };
  urlHaus: { isPhishing: boolean; payloadType?: string };
  abuseIpDb: { reputationScore: number; reportCount: number };
  googleSafeBrowsing: { isBlacklisted: boolean; threatType?: string };
}

export interface MitreAttackMapping {
  techniqueId: string;
  techniqueName: string;
  tactic: string;
  description: string;
}

export interface AiExplanation {
  riskScore: number;
  threatLevel: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  detectedIndicators: string[];
  aiExplanationText: string;
  mitreAttacks: MitreAttackMapping[];
  recommendedActions: string[];
}

export interface UrlAnalysisResult {
  id: string; // unique ID
  url: string;
  timestamp: string;
  overallRiskScore: number; // 0 to 100
  threatLevel: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  features: ExtractedFeatures;
  modelEvaluations: { [key: string]: ModelPrediction }; // Random Forest, XGBoost etc.
  threatIntel: ThreatIntelEnrichment;
  aiExplanation: AiExplanation;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DashboardStats {
  totalScanned: number;
  safeCount: number;
  maliciousCount: number;
  threatDistribution: { name: string; value: number }[]; // Pie Chart
  dailyTrend: { date: string; scanned: number; malicious: number }[]; // Area Chart
  topAttackTypes: { type: string; count: number }[]; // Bar Chart
  recentAnalyses: UrlAnalysisResult[];
  countryDistribution: { country: string; count: number }[];
  tldAnalysis: { tld: string; count: number }[];
  entropyData: { range: string; count: number }[];
}

// --- ENTERPRISE SECURITY MODULES TYPES ---

export interface FootprintScanResult {
  id: string;
  query: string;
  type: 'email' | 'phone' | 'username' | 'domain' | 'name';
  timestamp: string;
  exposureScore: number; // 0 - 100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary: string;
  categories: {
    socialProfiles: 'Low' | 'Moderate' | 'High' | 'Critical';
    codeLeaks: 'Low' | 'Moderate' | 'High' | 'Critical';
    metadataExposure: 'Low' | 'Moderate' | 'High' | 'Critical';
    publicContactInfo: 'Low' | 'Moderate' | 'High' | 'Critical';
    exposedCredentials: 'Low' | 'Moderate' | 'High' | 'Critical';
  };
  recommendations: string[];
  profilesFound: { platform: string; url: string; category: string; status: string }[];
  historyTimeline: { date: string; exposureScore: number }[];
}

export interface DeepfakeScanResult {
  id: string;
  fileName: string;
  fileSize: string;
  mediaType: 'image' | 'video' | 'audio';
  timestamp: string;
  authenticityScore: number; // 0 - 100
  manipulationProbability: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  explanation: string;
  indicators: { name: string; value: number; status: 'Normal' | 'Anomaly' | 'Critical' }[];
  timeline: { frame: number; time: string; score: number }[]; // For video/audio waveforms
  spectrogramData?: { frequency: number; intensity: number }[];
}

export interface DataLeakResult {
  id: string;
  query: string;
  timestamp: string;
  breachCount: number;
  overallThreatLevel: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  overallRiskScore: number; // 0 - 100
  riskScores: {
    identityRisk: number;
    financialRisk: number;
    privacyRisk: number;
    professionalRisk: number;
  };
  scenarios: {
    name: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    impactText: string;
  }[];
  breaches: {
    source: string;
    date: string;
    compromisedData: string[];
    description: string;
    verified: boolean;
  }[];
  recommendations: string[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  type: 'phishing' | 'deepfake' | 'password' | 'social_engineering' | 'osint';
  scenario: string;
  content: string; // Detail / email code / URL / audio waveform info
  options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
  xpValue: number;
}

export interface LearningProgress {
  xp: number;
  level: number;
  streakDays: number;
  quizAccuracy: number; // percentage
  completedQuizzes: number;
  topicsMastered: string[];
  cyberRank: 'Cyber Rookie' | 'Threat Hunter' | 'Blue Team Analyst' | 'Security Expert' | 'Cyber Guardian';
  achievements: UserAchievement[];
  weeklyActivity: { day: string; xp: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'breach' | 'coach' | 'achievement' | 'tip' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuedTo: string;
  issuedAt: string;
  rankAwarded: string;
  verificationCode: string;
}

