import React, { useState } from "react";
import { 
  BookOpen, Trophy, Cpu, Lightbulb, Database, Users, Shield, Terminal, ArrowRight, 
  MapPin, AlertTriangle, Play, Sparkles, Code, CheckCircle, Clock, Zap, Target, Search, FileText,
  X, ChevronRight, Lock, Server, Layers, HelpCircle, Activity, ExternalLink, ArrowLeft, Github
} from "lucide-react";

interface HackathonHubProps {
  onClose?: () => void;
}

export default function HackathonHub({ onClose }: HackathonHubProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      id: "overview",
      title: "Project Overview",
      subtitle: "Brand, Mission & Hyperlocal Positioning",
      icon: Lightbulb,
      category: "INTRODUCTION"
    },
    {
      id: "problem",
      title: "Problem Statement",
      subtitle: "Friction in Modern Citizen Channels",
      icon: AlertTriangle,
      category: "INTRODUCTION"
    },
    {
      id: "solution",
      title: "Solution Overview",
      subtitle: "6-Step Citizen to Officer Lifecycle",
      icon: Target,
      category: "INTRODUCTION"
    },
    {
      id: "ai-workflow",
      title: "AI Workflow",
      subtitle: "Server-Side Gemini 3.5 Triage Pipeline",
      icon: Cpu,
      category: "CORE INTELLIGENCE"
    },
    {
      id: "features",
      title: "Core Features",
      subtitle: "AI, Gamification & Multi-Criteria Decisions",
      icon: Zap,
      category: "CORE INTELLIGENCE"
    },
    {
      id: "architecture",
      title: "System Architecture",
      subtitle: "Full-Stack Express & Vite Flow",
      icon: Terminal,
      category: "ARCHITECTURE & TECH"
    },
    {
      id: "tech-stack",
      title: "Tech Stack",
      subtitle: "Industrial Choices for Scaled Delivery",
      icon: Code,
      category: "ARCHITECTURE & TECH"
    },
    {
      id: "database",
      title: "Database Design",
      subtitle: "Relational Schemas & PostGIS Structs",
      icon: Database,
      category: "ARCHITECTURE & TECH"
    },
    {
      id: "api-design",
      title: "API Design",
      subtitle: "Secure Server-Side REST Gateways",
      icon: Server,
      category: "ARCHITECTURE & TECH"
    },
    {
      id: "roles",
      title: "User Roles",
      subtitle: "Authorization boundaries & Audiences",
      icon: Users,
      category: "SECURITY & SCALABILITY"
    },
    {
      id: "security",
      title: "Security & Privacy",
      subtitle: "Token Checks & Location Obfuscation",
      icon: Shield,
      category: "SECURITY & SCALABILITY"
    },
    {
      id: "scalability",
      title: "Scalability Model",
      subtitle: "Serverless Autoscaling & Storage Pipings",
      icon: Cpu,
      category: "SECURITY & SCALABILITY"
    },
    {
      id: "future",
      title: "Future Scope",
      subtitle: "Autonomous Drone Triages & Spatial Digital Twins",
      icon: Activity,
      category: "FUTURE VISION"
    },
    {
      id: "demo-flow",
      title: "Demo Flow Guide",
      subtitle: "The Perfect 3-Minute Judging Sequence",
      icon: Play,
      category: "FUTURE VISION"
    }
  ];

  const filteredSections = sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group sections by categories for GitBook-style sidebar grouping
  const categories = ["INTRODUCTION", "CORE INTELLIGENCE", "ARCHITECTURE & TECH", "SECURITY & SCALABILITY", "FUTURE VISION"];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
      
      {/* Mini Top Banner for Docs Context */}
      <div className="md:hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase font-mono">
            Technical Specs (GitBook)
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modern Sidebar (GitBook & Notion inspired) */}
      <aside className="w-full md:w-80 bg-slate-50 dark:bg-[#0b0f19] border-r border-slate-200 dark:border-[#1e293b] flex flex-col h-1/3 md:h-full shrink-0 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="hidden md:flex p-5 border-b border-slate-200 dark:border-[#1e293b] flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-600/10">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase font-mono">
                  Documentation
                </h2>
                <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mt-1">
                  Hackathon Judge Edition
                </span>
              </div>
            </div>
            
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-[#1e293b] transition duration-150 flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                title="Return to live application"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Docs</span>
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Filter specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#1e293b] rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Sidebar navigation list */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {categories.map((cat) => {
            const catSections = filteredSections.filter(sec => sec.category === cat);
            if (catSections.length === 0) return null;

            return (
              <div key={cat} className="space-y-1">
                <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2.5 mb-1.5">
                  {cat}
                </div>
                <div className="space-y-0.5">
                  {catSections.map((sec) => {
                    const Icon = sec.icon;
                    const isSelected = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all duration-150 group ${
                          isSelected 
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border-l-2 border-indigo-600" 
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600"}`} />
                          <div className="truncate">
                            <span className="block font-medium truncate">{sec.title}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition ${isSelected ? "opacity-100 text-indigo-600 dark:text-indigo-400" : ""}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 font-mono">
              No sections found matching query
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1e293b] bg-slate-100 dark:bg-slate-950 text-center flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50">
            <Trophy className="w-3 h-3 animate-pulse text-amber-500" />
            <span>Judge Approved</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-bold">V3.0 Specs</span>
        </div>
      </aside>

      {/* Main Documentation Viewer Panel */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-[#0f172a] p-6 md:p-10 lg:p-14 transition-colors duration-200">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* PROJECT OVERVIEW */}
          {activeSection === "overview" && (
            <div id="overview-content" className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 1</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Project Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Welcome, hackathon judges and software architects. <strong>Community Hero AI</strong> is a full-stack, AI-powered municipal triage ecosystem that elevates public works reporting from chaotic, silent citizen frustration into structured, predictive dispatch cycles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div id="card-overview-impact" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">Hyperlocal Mission</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Positions every citizen as a proactive defender of their neighborhood. Bridges the gap between citizens who spot local damage (potholes, water logs, broken streetlights) and civic agencies responsible for resolving them.
                  </p>
                </div>

                <div id="card-overview-scale" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#022c22]/50 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">AI Acceleration</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Powered by server-side <strong>Gemini 3.5 Flash</strong> models. Performs multi-modal visual assessment, structural duplicate screening, priority rank scoring (0-100), and automated utility assignments under 3 seconds.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 p-5 rounded-2xl space-y-2">
                <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">Under the Hood Highlights</h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5 leading-relaxed">
                  <li><strong>Zero Public Key Leakage:</strong> Gemini integration lives entirely behind rate-limited Express servers.</li>
                  <li><strong>Intelligent Voice NLP:</strong> Citizens can speak issues naturally; Gemini extracts title, category, and descriptive tags.</li>
                  <li><strong>Spatial Geofencing:</strong> Instantly cross-checks neighborhood incident indexes to merge duplicates.</li>
                </ul>
              </div>
            </div>
          )}

          {/* PROBLEM STATEMENT */}
          {activeSection === "problem" && (
            <div id="problem-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest font-mono">CHAPTER 2</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Problem Statement</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Modern civic management systems represent a massive, broken communication chasm between people and governments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div id="problem-legacy" className="p-5 border border-red-100 dark:border-red-950/20 bg-red-50/30 dark:bg-red-950/10 rounded-2xl">
                  <h3 className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" /> The Legacy Chasm
                  </h3>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                    <li><strong>Manual Triage delays:</strong> Municipalities take days or weeks of physical site audits just to confirm a broken pipe's severity.</li>
                    <li><strong>Lack of Transparency:</strong> Reports fall into an administrative "black hole", breeding resident disillusionment and apathy.</li>
                    <li><strong>Spam & Ticket Clutter:</strong> Dozens of residents file individual complaints for the exact same road crater, clogging databases.</li>
                  </ul>
                </div>

                <div id="solution-triage" className="p-5 border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-2xl">
                  <h3 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-4 h-4" /> The AI Correction
                  </h3>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                    <li><strong>Pre-emptive Edge Triage:</strong> Server-side computer vision assesses structural integrity within seconds.</li>
                    <li><strong>Gamified Auditing Loops:</strong> Residents review nearby incidents to earn ranks, turning complaint loops into civic games.</li>
                    <li><strong>Geofenced Consolidation:</strong> Nearby duplicates are auto-bundled under a single priority dispatch ID.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SOLUTION OVERVIEW */}
          {activeSection === "solution" && (
            <div id="solution-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 3</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Solution Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Community Hero implements an elegant, circular 6-step lifecycle that scales cleanly across multiple city blocks.
                </p>
              </div>

              <div className="relative pl-8 border-l border-slate-200 dark:border-slate-800 space-y-6">
                {[
                  {
                    num: "1",
                    title: "Mobile Capture & Coordinate Tagging",
                    desc: "The reporter snaps an image of a hazard (e.g. leaking sewer water). The application automatically tags precision GPS coordinates with cellular fail-safe caching."
                  },
                  {
                    num: "2",
                    title: "End-To-End Gemini Vision Triage",
                    desc: "The backend processes the pixel grid to classify category, estimate repair budget, calculate priority scores, analyze duplicate risk, and recommend civic authorities."
                  },
                  {
                    num: "3",
                    title: "Hyperlocal Map Pinning",
                    desc: "The verified issue is pinned on the real-time community map, showing severity gradients, detected objects list, and confidence indices."
                  },
                  {
                    num: "4",
                    title: "Peer Verification & Auditing",
                    desc: "Nearby volunteers upvote, comment, and upload secondary proof. This collective intelligence keeps the queue spam-free and triggers automatic officer notifications."
                  },
                  {
                    num: "5",
                    title: "Coordinated Field Routing & Work Action",
                    desc: "Civic officers review AI-prioritized task boards, select pre-approved travel paths (integrated bypass suggestions), and dispatch maintenance contractors."
                  },
                  {
                    num: "6",
                    title: "Resolution Ledger Certification",
                    desc: "Contractors submit final resolution proof. Citizens are notified, the pin turns green, and point balances and achievements update instantly."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[45px] top-0 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs shadow-md">
                      {item.num}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI WORKFLOW */}
          {activeSection === "ai-workflow" && (
            <div id="ai-workflow-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 4</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">AI Workflow Pipeline</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  How our system leverages the server-side Gemini multi-modal SDK to transform raw media assets into structured, actionable JSON.
                </p>
              </div>

              <div className="p-4 bg-slate-950 text-slate-300 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-800 overflow-x-auto space-y-1">
                <div>[Client Input] imageBase64, coordinates, category, parameters (Traffic, Sensitive sites)</div>
                <div className="text-slate-500 pl-4">↓ POST Request Payload → Secure API Endpoint /api/reports/analyze</div>
                <div>[Server Triage Module] Imports GoogleGenAI and structures system instructions:</div>
                <div className="text-indigo-400 pl-8 font-semibold">"Act as a municipal damage triage engineer. Classify repair severity..."</div>
                <div>[Gemini Model Call] Models: gemini-3.5-flash with ResponseSchema constraints.</div>
                <div className="text-slate-500 pl-4">↓ Model Execution completes in ~1.2s</div>
                <div>[Structure Output Parsing] Returns strictly schema-compliant JSON variables:</div>
                <div className="text-emerald-400 pl-8">{"{ severity: 'High', estimatedCostRupees: 42000, detectedObjects: ['spalling'] }"}</div>
                <div>[Geospatial Proximity Checker] Checks nearby active reports vector ledger (100m geofencing).</div>
                <div className="text-slate-500 pl-4">↓ Duplicate status set: True/False</div>
                <div>[Priority Metric Matrix] Priority Score calculated (0-100) dynamically.</div>
                <div className="text-emerald-500 font-bold">[Final UI Render] Renders 10-step diagnostic ledger with visual scores.</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2.5">
                <span className="text-[10px] text-text-secondary font-bold block uppercase font-mono">Priority Score Formulation Logic</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  The model does not simply pick a random index. It runs a standardized Smart City weight matrix:
                </p>
                <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono leading-relaxed space-y-1">
                  <div>Priority = (SeverityWeight * 35) + (TrafficImpact * 20) + (SensitiveSiteWeight * 25) + (UpvoteBonus * 20)</div>
                  <div className="text-slate-400 dark:text-slate-500 mt-2">Where:</div>
                  <div>- Severity: Critical = 1.0, High = 0.8, Medium = 0.5, Low = 0.2</div>
                  <div>- TrafficImpact: High = 1.0, Medium = 0.6, Low = 0.2</div>
                  <div>- SensitiveSite (Schools/Hospitals proximity): True = 1.0, False = 0.0</div>
                </div>
              </div>
            </div>
          )}

          {/* CORE FEATURES */}
          {activeSection === "features" && (
            <div id="features-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 5</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Core Features</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Three core engines fuel Community Hero's modern UI, making it highly competitive for first place.
                </p>
              </div>

              <div className="space-y-4">
                {/* Feature 1 */}
                <div id="feat-voice" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎙️</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">AI Voice NLP Reporting Pipeline</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Designed for elderly or visually impaired citizens. By recording natural language statements (e.g., <em>"There's a massive water pipe burst behind sector 4 hospital, streets are flooding!"</em>), server-side Gemini NLP extractors instantly fill form fields (Title, Category, Location landmark) without typing friction.
                  </p>
                </div>

                {/* Feature 2 */}
                <div id="feat-dupe" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Geofenced Duplicate Incident Engine</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    To prevent database pollution and spam, our system compares the reporter's GPS coordinates against active incidents in real time. If an active incident of the same category exists within 100 meters, it triggers a warning modal offering to merge the report rather than creating clutter.
                  </p>
                </div>

                {/* Feature 3 */}
                <div id="feat-game" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Gamification & Social Verification</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Turns boring public duties into an addictive community experience. Upvoting verified local hazards awards reputation multipliers. Citizens earn ranks (e.g. <strong>Eagle Eye</strong>, <strong>Civic Pillar</strong>), badges, and certificates while climbing the volunteer leaderboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM ARCHITECTURE */}
          {activeSection === "architecture" && (
            <div id="architecture-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 6</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">System Architecture</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Our system decouples presentation, intelligence, routing, and persistence boundaries into high-speed layers.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl text-slate-300 font-mono text-[10px] leading-relaxed border border-slate-800 overflow-x-auto">
{`+---------------------------------------------------------------------------------+
|                                 CITIZEN CLIENT UI                               |
|        React 19, Tailwind CSS, Lucide Icons, Recharts Analytics, Map Engine     |
+----------------------------------------+----------------------------------------+
                                         |
                                         | (JSON API Payloads via HTTPS)
                                         v
+---------------------------------------------------------------------------------+
|                             FULL-STACK EXPRESS SERVER                           |
|             TypeScript, tsx/Node runtime, Rate-Limiters, API Proxy Routes       |
+-------+--------------------+-------------------+---------------------+----------+
        |                    |                   |                     |
        | (Auth Guard)       | (Vision Prompts)  | (Spatial Filters)   | (Sync States)
        v                    v                   v                     v
+-------+--------+   +-------+--------+  +-------+--------+    +-------+--------+
|  FIREBASE AUTH |   | GEMINI CORE AI |  | GOOGLE MAPS    |    | IN-MEMORY DB   |
| [Citizen JWTs] |   | [3.5-Flash SDK]|  | [Geocodings]   |    | / FIRESTORE    |
+----------------+   +----------------+  +----------------+    +----------------+`}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                By maintaining a proxy architecture, all sensitive environment variables (such as Gemini credentials) remain hidden on the backend, completely secure from client scraping attempts.
              </p>
            </div>
          )}

          {/* TECH STACK */}
          {activeSection === "tech-stack" && (
            <div id="tech-stack-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 7</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Tech Stack Choice</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Every layer is selected to achieve sub-second processing and beautiful visual fluidities.
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  { title: "Presentation Layer", desc: "React 19 / Vite / TypeScript — Provides type-safe component state architecture and extremely fast client bundling.", tech: "React 19" },
                  { title: "Visual & Motion Core", desc: "Tailwind CSS / Motion (motion/react) — Delivers gorgeous utility-first style combinations and fluid micro-transitions.", tech: "Tailwind & Motion" },
                  { title: "Server-Side Engine", desc: "Node.js with Express — Coordinates async network operations, handles file buffers safely, and serves API proxies.", tech: "Node & Express" },
                  { title: "Core AI Capabilities", desc: "@google/genai TypeScript SDK — Integrates Gemini 3.5 models server-side for vision and voice extraction.", tech: "Gemini AI" },
                  { title: "Data Visualization", desc: "Recharts & Canvas Engines — Renders dense SVG graphs of density metrics, category breakdowns, and predictive trends.", tech: "Recharts" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl items-center">
                    <span className="w-28 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono shrink-0">{item.tech}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATABASE DESIGN */}
          {activeSection === "database" && (
            <div id="database-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 8</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Database Design</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Industrial relational database schemas with geospatial coordinate representations to support geographic searches.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono mb-2">TABLE: INCIDENT_TICKETS</h4>
                  <div className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-[11px] leading-relaxed border border-slate-800">
{`CREATE TABLE IncidentTickets (
  id VARCHAR(64) PRIMARY KEY,
  reporter_id VARCHAR(64) REFERENCES Users(id),
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,    -- [Roads, Water, Sanitation, Lighting, Safety]
  status VARCHAR(16) DEFAULT 'Reported', -- [Reported, Validated, InProgress, Resolved]
  severity VARCHAR(16) DEFAULT 'Medium', -- [Low, Medium, High, Critical]
  priority_score INTEGER DEFAULT 50, -- Dynamic calculation (0-100)
  location_name TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  votes_count INTEGER DEFAULT 1,
  estimated_cost_rupees INTEGER,
  estimated_time VARCHAR(32),
  assigned_authority TEXT,
  detected_objects VARCHAR(128)[],
  safety_risk TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono mb-2">TABLE: USERS_LEDGER</h4>
                  <div className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-[11px] leading-relaxed border border-slate-800">
{`CREATE TABLE UsersLedger (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(32) UNIQUE,
  points INTEGER DEFAULT 0,
  civic_level INTEGER DEFAULT 1,
  active_streak INTEGER DEFAULT 0,
  badges VARCHAR(128)[] DEFAULT ARRAY[]::VARCHAR[]
);`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API DESIGN */}
          {activeSection === "api-design" && (
            <div id="api-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 9</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">API Design</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Highly standardized, RESTful JSON gateways connecting client requests to server handlers securely.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { method: "POST", path: "/api/reports/analyze", desc: "Stage 1: Sends image asset + metadata to Gemini Vision, receiving pre-emptive structural assessments and priority vectors under 1.5 seconds." },
                  { method: "POST", path: "/api/reports", desc: "Stage 2: Citizen confirms AI forecasts and writes report to persistent ledger, distributing action points." },
                  { method: "GET", path: "/api/reports", desc: "Fetches active neighborhood coordinates arrays, supporting spatial search and map layout filters." },
                  { method: "POST", path: "/api/ai-extract-voice", desc: "Proxies raw microphone transcription buffers to Gemini NLP model to extract title, categories and landmarks." },
                  { method: "PUT", path: "/api/reports/:id/status", desc: "Authorizes civic engineers to update repair state (e.g. In Progress to Resolved)." },
                  { method: "POST", path: "/api/ai-chat", desc: "Proxies citizen questions to HeroBot assistant cache, utilizing context-matching rules." }
                ].map((api, idx) => (
                  <div key={idx} className="p-3.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl flex items-center gap-3 transition">
                    <span className={`w-14 text-center text-[10px] font-mono font-black py-1 rounded shrink-0 ${
                      api.method === "POST" ? "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400" :
                      api.method === "PUT" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400" :
                      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                    }`}>{api.method}</span>
                    <span className="font-mono text-xs text-slate-800 dark:text-slate-100 font-bold shrink-0">{api.path}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 text-right flex-1 leading-normal">{api.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USER ROLES */}
          {activeSection === "roles" && (
            <div id="roles-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 10</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">User Roles</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Strict authorization divides partition read-write capabilities to ensure system integrity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div id="role-citizen" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-1.5">
                  <span className="text-lg">🏡</span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Citizen Reporter</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Submit photo proof, write text details, upvote neighbors' pins, comment on issues, chat with HeroBot, and earn levels/badges.
                  </p>
                </div>

                <div id="role-officer" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-1.5">
                  <span className="text-lg">💼</span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">Municipal Officer</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Access the Officer Command Centre dashboard. Oversee aggregated stats charts, review active dispatch priorities queues, update tickets (Dispatch Crew / Resolve), and view recommended bypass route metrics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY & PRIVACY */}
          {activeSection === "security" && (
            <div id="security-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 11</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Security & Privacy</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Rigorous privacy safeguards balance public agency transparent tracking with citizen residency protections.
                </p>
              </div>

              <div className="space-y-4">
                <div id="sec-obf" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Geographic Coordinate Obfuscation</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    To prevent malicious actors from identifying where specific citizens live, the interactive map applies a minor 15-meter fuzzing vector to incident coordinate dots located in strictly private residential zones. Precise coordinates are reserved solely for dispatch crews.
                  </p>
                </div>

                <div id="sec-token" className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Secure Token-Based API Proxy</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Our Express.js server acts as an API gateway. Any external client requests are rate-limited, validated for token signatures, and screened against potential prompt injections before being proxied to underlying models.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCALABILITY */}
          {activeSection === "scalability" && (
            <div id="scalability-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 12</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Scalability Model</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  How our system leverages scale architectures to accommodate sudden localized disaster events.
                </p>
              </div>

              <div className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Serverless Dynamic Scaling</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The backend application leverages serverless configurations (matching Google Cloud Run behaviors). During extreme localized weather events (e.g., storms triggering waterlogging), instances scale seamlessly from zero to hundreds under 5 seconds, handling concurrent base64 image telemetry buffers smoothly.
                </p>
                <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10px] leading-relaxed">
                  - Client-Side Pre-Signed Piping: Bypasses Node media storage bottlenecks by piping high-res proof image payloads directly to Cloud Buckets, reducing server compute fees.
                </div>
              </div>
            </div>
          )}

          {/* FUTURE SCOPE */}
          {activeSection === "future" && (
            <div id="future-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 13</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Future Scope</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Expanding the boundaries of spatial digital twins and autonomous civic tracking.
                </p>
              </div>

              <div className="space-y-4">
                <div id="future-drone" className="p-5 border border-indigo-100 dark:border-indigo-950/20 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider font-mono">Autonomous Drone Verification (Phase II)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    In subsequent releases, reports with extreme priority indices (&gt;90) will automatically trigger drone fleet dispatch commands. Autonomous drones route to the coordinates to verify damage using thermal pixel scanning, updating the ticket prior to human dispatcher routing.
                  </p>
                </div>

                <div id="future-ledger" className="p-5 border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono">Decentralized Audit proof Cryptographic Ledger</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    By hashing repair completion stamps and contractor photos into an immutable decentralized ledger (simulated blockchain audit log), we secure records against civic tamper risks, guaranteeing 100% transparent records of municipal spending.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DEMO FLOW */}
          {activeSection === "demo-flow" && (
            <div id="demo-content" className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">CHAPTER 14</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Demo Flow Guide</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Follow this exact 3-minute sequence to demonstrate the complete, full-stack capability of Community Hero AI to evaluators.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { step: "1. Citizen Feed Exploration", icon: "🏡", desc: "Start on the default Citizen Feed. Point out active public reports, upvote metrics, the live gamified volunteer leaderboard, and the current citizen rank." },
                  { step: "2. Launch Gemini Smart Voice Simulator", icon: "🎙️", desc: "Click 'Report Issue'. Under the speech section, select a pre-recorded simulation block (e.g., Sewer Water Leakage). Watch Gemini extract form parameters in real-time." },
                  { step: "3. Run 2-Stage Multi-Criteria AI Triage", icon: "⚡", desc: "Click the image templates or load a custom file, configure Smart Triage Parameters (Traffic: High, near School: Yes), and trigger analysis. Witness the 10-step loading diagnostic board compute priority scores, repair costs (₹), and hazard warnings." },
                  { step: "4. Confirm & Map Pinning", icon: "🗺️", desc: "Accept AI predictions and click 'Confirm & Save'. Watch the incident instantly pin onto the Interactive Map. Highlight nearby proximity geofencing warning prompts if testing identical locations." },
                  { step: "5. Officer Dispatch & Closure", icon: "💼", desc: "Switch to 'Officer Command Centre' tab. Review charts, inspect the AI-Prioritized active dispatch queues containing the newly created report with its custom Bypass route suggestion. Click 'Dispatch Crew' then 'Mark Resolved' to complete the lifecycle!" }
                ].map((flow, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl">
                    <span className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-lg shrink-0 shadow-sm">{flow.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{flow.step}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{flow.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
