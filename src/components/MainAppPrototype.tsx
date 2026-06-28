import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, AlertCircle, CheckCircle2, Clock, ThumbsUp, Send, Trash2, 
  Sparkles, ShieldAlert, Award, PlusCircle, Layers, BarChart3, TrendingUp, 
  HelpCircle, UserCheck, MessageSquare, Flame, Trophy, Volume2, Globe, FileClock, Camera, RefreshCw,
  Mic, MicOff, Check, Activity, TrendingDown, Users, Percent, Menu, X
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { Report, Comment, User, Challenge, AnalyticsData } from "../types";

export default function MainAppPrototype() {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("citizen-dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  
  // Close mobile sidebar on tab or role switch
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  // Feed Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Role Simulator
  const [activeRole, setActiveRole] = useState<"Citizen" | "Volunteer" | "Officer" | "Admin" | any>("Citizen");

  // Custom simulation states for role-based dashboards
  const [notifications, setNotifications] = useState([
    { id: "1", type: "dispatched", text: "⚡ Your report #INC-402 (Burst Water Valve) has been dispatched to Department of Water & Sewage.", read: false, time: "5m ago" },
    { id: "2", type: "verified", text: "🎉 Volunteer Marcus Vance verified your report about Asphalt Crater.", read: false, time: "2h ago" },
    { id: "3", type: "badge", text: "🏆 You earned +10 Reputation points for community upvotes on your reports.", read: false, time: "1d ago" }
  ]);

  const [departments, setDepartments] = useState([
    { id: "water", name: "Department of Water & Sewage", capacity: 80, workload: 8, resolved: 32, icon: "💧" },
    { id: "transport", name: "Transportation & Highway Works", capacity: 75, workload: 14, resolved: 54, icon: "🚧" },
    { id: "sanitation", name: "Sanitation & Municipal Cleansing", capacity: 90, workload: 5, resolved: 41, icon: "🧹" },
    { id: "electric", name: "Electricity & Public Lighting Board", capacity: 85, workload: 6, resolved: 28, icon: "⚡" }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { timestamp: "19:28:44", type: "INFO", message: "Server initialized on port 3000 dynamically." },
    { timestamp: "19:29:12", type: "DB", message: "Connected to relational database ledger via Drizzle ORM." },
    { timestamp: "19:30:05", type: "AI", message: "Gemini 3.5 multi-modal API payload processed successfully in 1.18s." },
    { timestamp: "19:31:40", type: "EVENT", message: "User @alex_rivera submitted new report 'Sector 4 Sewer Burst'. Priority: 84/100." },
    { timestamp: "19:32:01", type: "DB", message: "Geofenced duplicate scanner merged report 'Water clog near sector 4 hospital' with parent ID #INC-402." },
    { timestamp: "19:32:20", type: "AUTH", message: "Validated citizen JWT signature via Firebase Authentication." }
  ]);

  // Officer repair proof submission simulator
  const [officerRepairTargetId, setOfficerRepairTargetId] = useState<string | null>(null);
  const [officerRepairCost, setOfficerRepairCost] = useState<string>("24500");
  const [officerRepairTime, setOfficerRepairTime] = useState<string>("2 Days");
  const [officerRepairImage, setOfficerRepairImage] = useState<string>("");

  // Admin overrides
  const [adminOverridingPriorityId, setAdminOverridingPriorityId] = useState<string | null>(null);
  const [adminPriorityValue, setAdminPriorityValue] = useState<number>(75);
  const [adminReassigningId, setAdminReassigningId] = useState<string | null>(null);
  const [adminReassignDeptValue, setAdminReassignDeptValue] = useState<string>("");

  const handleRoleChange = (role: "Citizen" | "Volunteer" | "Officer" | "Admin") => {
    setActiveRole(role);
    if (role === "Citizen") {
      setActiveTab("citizen-dashboard");
    } else if (role === "Volunteer") {
      setActiveTab("volunteer-dashboard");
    } else if (role === "Officer") {
      setActiveTab("officer-dashboard");
    } else if (role === "Admin") {
      setActiveTab("admin-dashboard");
    }

    // Append dynamic audit log
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setAuditLogs(prev => [
      {
        timestamp: timeStr,
        type: "AUTH" as const,
        message: `Simulation Persona switched to [${role}] - Dynamic view routes and access permissions updated.`
      },
      ...prev
    ]);
  };

  // Selected Report Modal / Drawer
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // New Report Form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<Report["category"]>("Roads & Potholes");
  const [newLatitude, setNewLatitude] = useState(37.7749);
  const [newLongitude, setNewLongitude] = useState(-122.4194);
  const [newLocationName, setNewLocationName] = useState("Main Street, Sector 3");
  const [newImageBase64, setNewImageBase64] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  // AI Multi-Criteria Triage Inputs
  const [trafficImpact, setTrafficImpact] = useState<"Low" | "Medium" | "High">("Medium");
  const [populationDensity, setPopulationDensity] = useState<"Low" | "Medium" | "High">("Medium");
  const [nearSensitiveSite, setNearSensitiveSite] = useState<boolean>(false);

  // Two-Stage AI Review States
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [currentDiagnosticStep, setCurrentDiagnosticStep] = useState<number>(0);
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([]);
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);

  // AI Chatbot Overlay
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Hello! I am HeroBot, your virtual civic assistant. You can ask me how to file a report, how points and rewards are earned, or how community verification works!" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Image Presets for rapid demo
  const imagePresets = [
    {
      title: "Asphalt Crater",
      category: "Roads & Potholes",
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600",
      description: "Massive open pothole situated right on the center lane of the boulevard, exposing sharp aggregate bedrock."
    },
    {
      title: "Burst Water Valve",
      category: "Water & Drainage",
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600",
      description: "Severe high-velocity water leakage from the municipal water utility piping on the pedestrian pathway."
    },
    {
      title: "Alley Blackout",
      category: "Electricity & Lighting",
      url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600",
      description: "Streetlight column fixture completely dead, resulting in a dark zone near the public park corridor."
    },
    {
      title: "Illegal Timber Accumulation",
      category: "Sanitation & Trash",
      url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600",
      description: "Commercial bulk rubbish discarded into the residential green space zone over the weekend."
    }
  ];

  // Load Initial Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const repRes = await fetch("/api/reports");
      const repData = await repRes.json();
      setReports(repData);

      const usrRes = await fetch("/api/users");
      const usrData = await usrRes.json();
      setUsers(usrData);

      const chRes = await fetch("/api/challenges");
      const chData = await chRes.json();
      setChallenges(chData);

      const anRes = await fetch("/api/analytics");
      const anData = await anRes.json();
      setAnalytics(anData);
    } catch (err) {
      console.error("Error loading mock data APIs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Scroll Chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle upvoting
  const handleVote = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "you_hero" })
      });
      const data = await res.json();
      
      // Update local state
      setReports(prev => prev.map(r => {
        if (r.id === reportId) {
          return { 
            ...r, 
            votesCount: data.votesCount, 
            votedUsers: data.voted ? [...r.votedUsers, "you_hero"] : r.votedUsers.filter(u => u !== "you_hero"),
            status: data.status
          };
        }
        return r;
      }));

      // Update current selected report details if open
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(prev => prev ? {
          ...prev,
          votesCount: data.votesCount,
          votedUsers: data.voted ? [...prev.votedUsers, "you_hero"] : prev.votedUsers.filter(u => u !== "you_hero"),
          status: data.status
        } : null);
      }

      // Re-trigger user metrics update
      const usrRes = await fetch("/api/users");
      const usrData = await usrRes.json();
      setUsers(usrData);

      const anRes = await fetch("/api/analytics");
      const anData = await anRes.json();
      setAnalytics(anData);

    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  // Fetch comments when report is selected
  const selectReport = async (report: Report) => {
    setSelectedReport(report);
    try {
      const res = await fetch(`/api/reports/${report.id}/comments`);
      const data = await res.json();
      setCommentsList(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  // Submit dynamic comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedReport) return;

    try {
      setCommentSubmitting(true);
      const res = await fetch(`/api/reports/${selectedReport.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: activeRole === "Citizen" ? "Alex Rivera" : activeRole === "Volunteer" ? "Marcus Vance" : activeRole === "Officer" ? "Chief Engineer Miller" : "Administrator",
          avatar: activeRole === "Citizen" ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" : activeRole === "Volunteer" ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
          role: activeRole,
          content: newComment
        })
      });

      const comment = await res.json();
      setCommentsList(prev => [...prev, comment]);
      setNewComment("");

      // Refresh User Points
      const usrRes = await fetch("/api/users");
      setUsers(await usrRes.json());
    } catch (err) {
      console.error("Comment post failed:", err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Update report status (Admin/Officer action)
  const handleUpdateStatus = async (reportId: string, newStatus: Report["status"]) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();

      setReports(prev => prev.map(r => r.id === reportId ? updated : r));
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(updated);
      }

      const anRes = await fetch("/api/analytics");
      setAnalytics(await anRes.json());
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle custom file upload or conversion
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Quick select preset image
  const selectPresetImage = (preset: typeof imagePresets[0]) => {
    setNewTitle(`Reported ${preset.title}`);
    setNewDescription(preset.description);
    setNewCategory(preset.category as Report["category"]);
    setNewImageBase64(preset.url);
  };

  // Voice Recording Speech-to-Text Handler
  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setFormError("Speech recognition is not supported in this browser. Try the Interactive Voice Presets instead!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsVoiceRecording(true);
        setFormError("");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setIsVoiceRecording(false);
        setFormError("Microphone access failed. Try clicking a 'Voice Simulation Preset' block below!");
      };

      recognition.onend = () => {
        setIsVoiceRecording(false);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          await processVoiceTranscript(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsVoiceRecording(false);
    }
  };

  // Extract Form Fields from Speech text using Gemini NLP Extractor
  const processVoiceTranscript = async (speechText: string) => {
    try {
      setIsAiProcessing(true);
      setDiagnosticLog(["🎙️ Voice transcription captured", "🧠 Forwarding transcription to Gemini NLP extractor..."]);
      setCurrentDiagnosticStep(1);

      const res = await fetch("/api/ai-extract-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speechText })
      });
      const data = await res.json();

      if (data) {
        setNewTitle(data.title || "Voice Report");
        setNewDescription(data.description || speechText);
        setNewCategory(data.category || "Roads & Potholes");
        if (data.locationName) {
          setNewLocationName(data.locationName);
        }
        setDiagnosticLog([]);
        setCurrentDiagnosticStep(0);
      }
    } catch (err) {
      console.error("Voice extraction failed:", err);
      setFormError("Voice extraction failed. Form filled with raw text instead.");
      setNewDescription(speechText);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Two-Stage AI Vision Triage Analysis (Stage 1)
  const handleTriggerAiTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newTitle.trim() || !newDescription.trim() || !newImageBase64) {
      setFormError("Please fill out Title, Description, and attach an Image before running AI Triage.");
      return;
    }

    const steps = [
      "🔒 Establishing secure, end-to-end municipal server connection...",
      "📸 Compressing and parsing high-resolution image telemetry...",
      "⚡ Initializing Gemini Vision model pipeline...",
      "🧠 Analyzing visual pixel grids for structural hazards & spalling...",
      "🗺️ Fetching geospatial metadata overlays and zoning maps...",
      "🔍 Scanning immediate neighborhood vector indexes for active duplicates...",
      "📈 Calculating multi-criteria Smart City priority ranking matrices...",
      "💼 Estimating repair cost quotes (₹) and project labor duration...",
      "🏢 Identifying appropriate civic department & utility authority assignments...",
      "📋 Formulating safety warnings & final technical damage summary..."
    ];

    try {
      setIsAiProcessing(true);
      setAiAnalysisResult(null);
      setDiagnosticLog([]);
      
      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          setDiagnosticLog(prev => [...prev, steps[stepIdx]]);
          setCurrentDiagnosticStep(stepIdx + 1);
          stepIdx++;
        } else {
          clearInterval(interval);
        }
      }, 550);

      const res = await fetch("/api/reports/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: newCategory,
          latitude: newLatitude,
          longitude: newLongitude,
          imageBase64: newImageBase64,
          trafficImpact,
          populationDensity,
          nearSensitiveSite
        })
      });

      const analysisData = await res.json();
      
      await new Promise(resolve => setTimeout(resolve, steps.length * 550 + 200));

      if (res.ok && analysisData) {
        setAiAnalysisResult(analysisData);
      } else {
        throw new Error("AI Triage request failed");
      }
    } catch (err) {
      console.error(err);
      setFormError("AI Vision analysis failed. Please verify API key configuration.");
    } finally {
      setIsAiProcessing(false);
      setCurrentDiagnosticStep(0);
    }
  };

  // Final confirmation and commit (Stage 2)
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiAnalysisResult) return;

    try {
      setIsAiProcessing(true);
      setDiagnosticLog(["🗳️ Securing citizen e-signature...", "💾 Committing incident ticket data to municipal database..."]);
      setCurrentDiagnosticStep(9);

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: aiAnalysisResult.category || newCategory,
          latitude: newLatitude,
          longitude: newLongitude,
          locationName: newLocationName,
          imageBase64: newImageBase64,
          reporterName: "Alex Rivera",
          reporterAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          
          severity: aiAnalysisResult.severity,
          priorityScore: aiAnalysisResult.priorityScore,
          estimatedCost: `₹${aiAnalysisResult.estimatedCostRupees.toLocaleString()}`,
          estimatedTime: aiAnalysisResult.estimatedTime,
          detectedObjects: aiAnalysisResult.detectedObjects,
          summary: aiAnalysisResult.summary,
          assignedAuthority: aiAnalysisResult.assignedAuthority,
          safetyRisk: aiAnalysisResult.safetyRisk,
          isDuplicate: aiAnalysisResult.duplicateCheck?.isDuplicate || false,
          duplicateIssueId: aiAnalysisResult.duplicateCheck?.duplicateIssueId || null,
          confidence: aiAnalysisResult.confidence
        })
      });

      if (!res.ok) throw new Error("Database save failed");
      const createdReport = await res.json();

      setNewTitle("");
      setNewDescription("");
      setNewImageBase64("");
      setAiAnalysisResult(null);
      setDiagnosticLog([]);

      await fetchData();

      setActiveTab("feed");
      if (createdReport) {
        selectReport(createdReport);
      }
    } catch (err) {
      console.error(err);
      setFormError("Failed to save report to municipal server ledger.");
    } finally {
      setIsAiProcessing(false);
      setCurrentDiagnosticStep(0);
    }
  };

  // Chat overlay query submission
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, chatHistory: chatMessages.slice(-5) })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error("ChatBot error:", err);
      setChatMessages(prev => [...prev, { sender: "bot", text: "Offline. Ensure your workspace connections remain functional." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Heatmap Overlay coordinates simulator
  const activeUser = users.find(u => u.username === "you_hero");

  return (
    <div className="flex flex-col h-screen bg-bg-app text-text-primary font-sans select-none overflow-hidden relative">
      
      {/* Simulation Header / Role Switcher */}
      <div className="bg-bg-card border-b border-border-subtle px-4 md:px-6 py-2 md:py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 z-10 transition-colors duration-200">
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1.5 rounded-lg bg-bg-panel border border-border-subtle text-text-primary hover:bg-bg-app transition lg:hidden cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 px-2 md:px-2.5 py-1 rounded-full text-[10px] md:text-xs text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
              <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5" /> <span className="hidden sm:inline">AI Engine Live</span><span className="sm:hidden">AI Live</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-secondary hidden sm:inline">Simulation Persona:</span>
            <div className="inline-flex bg-bg-panel rounded-lg p-0.5 border border-border-subtle">
              {(["Citizen", "Volunteer", "Officer", "Admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`px-2.5 md:px-3 py-1 rounded-md text-[10px] md:text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                    activeRole === r 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Stats Quick-Bar */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 text-xs border-t border-border-subtle/40 pt-1.5 md:border-t-0 md:pt-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-bg-card px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg border border-border-subtle shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-text-secondary text-[11px] md:text-xs">Civic Pts:</span>
              <strong className="text-text-primary font-mono text-[11px] md:text-xs">{activeUser?.points || "0"}</strong>
            </div>
            <div className="flex items-center gap-1 bg-bg-card px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg border border-border-subtle shadow-sm">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span className="text-text-secondary text-[11px] md:text-xs">Streak:</span>
              <strong className="text-orange-500 font-mono text-[11px] md:text-xs">{activeUser?.streak || "0"}d</strong>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="p-1.5 bg-bg-card border border-border-subtle rounded-lg hover:bg-bg-panel text-text-secondary hover:text-text-primary transition shadow-sm cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main View Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Navigation Sidebar Drawer Overlay for Mobile */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Navigation Sidebar Drawer */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-bg-sidebar border-r border-border-subtle p-4 flex flex-col justify-between shrink-0 h-full transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="space-y-6">
            <div className="px-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Ecosystem Space</span>
                <h1 className="text-base font-black text-text-primary tracking-tight mt-1 flex items-center gap-1.5">
                  Community Hero AI
                </h1>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-panel lg:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1">
              {(() => {
                const tabs = 
                  activeRole === "Citizen" ? [
                    { id: "citizen-dashboard", label: "Citizen Dashboard", icon: Layers },
                    { id: "report", label: "Report Incident", icon: PlusCircle },
                    { id: "feed", label: "Nearby Issues", icon: Globe },
                    { id: "map", label: "Interactive Map", icon: MapPin },
                    { id: "leaderboard", label: "Rewards & Badges", icon: Trophy },
                  ] :
                  activeRole === "Volunteer" ? [
                    { id: "volunteer-dashboard", label: "Volunteer Hub", icon: Trophy },
                    { id: "feed", label: "Verify Reports", icon: UserCheck },
                    { id: "leaderboard", label: "Missions & Stats", icon: Award },
                  ] :
                  activeRole === "Officer" ? [
                    { id: "officer-dashboard", label: "Dispatch Desk", icon: BarChart3 },
                    { id: "map", label: "Tactical Map", icon: MapPin },
                  ] :
                  [ // Admin tabs
                    { id: "admin-dashboard", label: "Admin Operations", icon: BarChart3 },
                    { id: "admin-incidents", label: "Incident Ledger", icon: ShieldAlert },
                    { id: "admin-users", label: "User Accounts", icon: Users },
                    { id: "admin-departments", label: "Departments", icon: Activity },
                    { id: "admin-audit", label: "System Audit Logs", icon: FileClock },
                  ];

                return tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600" 
                          : "text-text-secondary hover:bg-bg-panel hover:text-text-primary"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-text-muted"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                });
              })()}
            </nav>
          </div>

          <div className="p-3 bg-bg-panel rounded-xl border border-border-subtle">
            <div className="flex items-center gap-2">
              <img 
                src={
                  activeRole === "Citizen" ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" :
                  activeRole === "Volunteer" ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" :
                  activeRole === "Officer" ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" :
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100"
                } 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-border-subtle object-cover"
              />
              <div className="truncate">
                <span className="text-xs font-black block text-text-primary">
                  {
                    activeRole === "Citizen" ? "Alex Rivera" :
                    activeRole === "Volunteer" ? "Marcus Vance" :
                    activeRole === "Officer" ? "Chief Eng. Miller" :
                    "Director Sterling"
                  }
                </span>
                <span className="text-[10px] text-text-secondary font-semibold block">
                  {
                    activeRole === "Citizen" ? "Tier: Elite Citizen" :
                    activeRole === "Volunteer" ? "Certified Auditor" :
                    activeRole === "Officer" ? "Dispatch Supervisor" :
                    "Root Administrator"
                  }
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-bg-app p-4 sm:p-6 relative transition-colors duration-200">
          
          {loading && (
            <div className="absolute inset-0 bg-bg-app/80 z-50 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-text-secondary font-mono">Synchronizing smart grid indexes...</p>
            </div>
          )}

          {/* CITIZEN DASHBOARD HOMEPAGE */}
          {activeTab === "citizen-dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Dynamic Welcome Banner */}
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 dark:from-indigo-950 dark:to-indigo-900 text-white p-6 rounded-2xl shadow-md border border-indigo-600/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
                      Elite Citizen Profile
                    </span>
                    <h2 className="text-2xl font-black mt-2">Welcome back, Alex Rivera! 🌟</h2>
                    <p className="text-xs text-indigo-100/80 mt-1 max-w-xl">
                      Your crowdsourced reports and community audit feedback keep Sector 3 safe, clean, and beautifully maintained. Thank you for being a civic hero!
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => setActiveTab("report")}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Report Issue</span>
                    </button>
                    <button 
                      onClick={() => setChatOpen(true)}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>Ask HeroBot AI</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Citizen Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Your Lifetime Points</span>
                    <strong className="text-2xl font-black text-text-primary block mt-0.5">320 Pts</strong>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3" /> Level 4 Tier (Top 5%)
                    </span>
                  </div>
                </div>

                <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Daily Active Streak</span>
                    <strong className="text-2xl font-black text-text-primary block mt-0.5">5 Days</strong>
                    <span className="text-[9px] text-text-secondary block mt-0.5">Next streak reward in 2 days</span>
                  </div>
                </div>

                <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Verified Fixes Filed</span>
                    <strong className="text-2xl font-black text-text-primary block mt-0.5">3 Resolved</strong>
                    <span className="text-[9px] text-text-muted block mt-0.5">1 currently under crew dispatch</span>
                  </div>
                </div>
              </div>

              {/* Main Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Track Personal Reports */}
                <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm lg:col-span-7 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Track Your Reports</h3>
                      <p className="text-[11px] text-text-secondary">Status of public maintenance tickets filed by your account.</p>
                    </div>
                    <span className="text-[10px] bg-bg-panel border border-border-subtle px-2 py-1 rounded-md text-text-secondary font-mono">
                      Refreshed Live
                    </span>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {reports.length > 0 ? (
                      reports.slice(0, 3).map((rep) => (
                        <div 
                          key={rep.id}
                          onClick={() => selectReport(rep)}
                          className="bg-bg-panel hover:bg-bg-app border border-border-subtle hover:border-indigo-400 p-3.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold">
                                {rep.id}
                              </span>
                              <span className="font-bold text-text-primary text-xs truncate block">{rep.title}</span>
                            </div>
                            <p className="text-[10px] text-text-secondary truncate">{rep.description}</p>
                            <span className="text-[9px] text-text-muted block font-mono">Location: {rep.locationName}</span>
                          </div>
                          
                          <div className="text-right shrink-0 space-y-1">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border block text-center ${
                              rep.status === "Resolved" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                              rep.status === "In Progress" ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
                              rep.status === "Validated" ? "bg-amber-50 border-amber-100 text-amber-600" :
                              "bg-slate-50 border-slate-100 text-text-secondary"
                            }`}>
                              {rep.status}
                            </span>
                            <span className="text-[9px] text-text-muted font-mono block">
                              {rep.votesCount} Upvotes
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-text-muted italic py-6 text-center">No reports filed yet. Click Report Issue to begin!</p>
                    )}
                  </div>
                </div>

                {/* Notifications & Live Rewards milestone panel */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Notifications List */}
                  <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        <span>Civic Notifications</span>
                      </h3>
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-3 rounded-xl border transition flex items-start gap-2.5 text-xs ${
                            notif.read ? "bg-bg-panel/45 border-border-subtle text-text-secondary" : "bg-indigo-50/30 dark:bg-indigo-950/10 border-indigo-100/30 text-text-primary"
                          }`}
                        >
                          <div className="flex-1 space-y-0.5">
                            <p className="text-[11px] leading-relaxed font-medium">{notif.text}</p>
                            <span className="text-[9px] text-text-muted block font-mono">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rewards Milestone progression */}
                  <div className="bg-bg-card border border-indigo-500/10 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-text-primary block">Active Rewards Goal</span>
                      <span className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded">
                        Milestone 5
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-text-secondary">
                        <span className="font-bold">Eagle Eye Auditor badge</span>
                        <span className="font-mono">320/500 Pts</span>
                      </div>
                      <div className="w-full h-2 bg-bg-panel rounded-full overflow-hidden border border-border-subtle">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full" style={{ width: "64%" }}></div>
                      </div>
                      <span className="text-[9px] text-text-muted block italic text-left">Earn 180 more points to unlock a free city bus pass reward voucher!</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* VOLUNTEER HUB DASHBOARD */}
          {activeTab === "volunteer-dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 dark:from-emerald-950 dark:to-emerald-900 text-white p-6 rounded-2xl shadow-md border border-emerald-600/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
                      Certified Community Auditor
                    </span>
                    <h2 className="text-2xl font-black mt-2">Volunteer Operations Hub 🤝</h2>
                    <p className="text-xs text-emerald-100/80 mt-1 max-w-xl text-left">
                      Welcome, Marcus Vance! Leverage your certification level to audit citizen reports, submit evidence comments, and complete weekly missions.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("feed")}
                    className="px-4 py-2.5 bg-white text-emerald-900 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-emerald-50 transition"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Audit Pending Reports</span>
                  </button>
                </div>
              </div>

              {/* Volunteer Stat Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-text-secondary font-bold uppercase block">Your Audits Completed</span>
                  <strong className="text-2xl font-black font-mono text-text-primary">14 Tickets</strong>
                </div>
                <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-text-secondary font-bold uppercase block">Verification Accuracy</span>
                  <strong className="text-2xl font-black font-mono text-emerald-600">98.5%</strong>
                </div>
                <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-text-secondary font-bold uppercase block">Weekly Mission Points</span>
                  <strong className="text-2xl font-black font-mono text-indigo-600">+120 Pts</strong>
                </div>
                <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-text-secondary font-bold uppercase block">Global Rank</span>
                  <strong className="text-2xl font-black font-mono text-amber-500">#2</strong>
                </div>
              </div>

              {/* Weekly Missions Segment */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Your Assigned Weekly Missions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {challenges.map((ch) => (
                    <div key={ch.id} className="bg-bg-card border border-border-subtle p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-sm">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-text-primary text-xs leading-tight text-left">{ch.title}</h4>
                          <span className="text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950 border border-indigo-100/50 text-indigo-600 px-2 py-0.5 rounded-full shrink-0">
                            +{ch.points} Pts
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary mt-1 leading-relaxed text-left">{ch.description}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-text-muted font-mono">
                          <span>Personal Progress</span>
                          <span>{ch.progress}/{ch.target}</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-panel rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${(ch.progress / ch.target) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-text-muted block text-right italic">{ch.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Audit Action Queue */}
              <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary text-left">Pending Peer Verification Queue</h3>
                  <p className="text-[11px] text-text-secondary text-left">Review nearby community reports. Your verification votes establish true ground truth prior to municipal dispatch.</p>
                </div>

                <div className="divide-y divide-border-subtle border border-border-subtle rounded-xl overflow-hidden">
                  {reports.filter(r => r.status === "Reported" || r.status === "Validated").map((rep) => (
                    <div key={rep.id} className="p-4 bg-bg-panel/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="min-w-0 flex-1 space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 font-mono font-bold text-indigo-600 px-1.5 py-0.5 rounded">{rep.id}</span>
                          <strong className="text-xs font-bold text-text-primary">{rep.title}</strong>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">{rep.description}</p>
                        <span className="text-[9px] text-text-muted block font-mono">Reported by Citizen alex_rivera • Category: {rep.category}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <button 
                          onClick={() => handleVote(rep.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                            rep.votedUsers.includes("you_hero") 
                              ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 text-emerald-600" 
                              : "bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{rep.votedUsers.includes("you_hero") ? "Verified & Voted" : "Verify as Genuine"}</span>
                        </button>
                        <button 
                          onClick={() => selectReport(rep)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                        >
                          Audit & Add Comment
                        </button>
                      </div>
                    </div>
                  ))}
                  {reports.filter(r => r.status === "Reported" || r.status === "Validated").length === 0 && (
                    <p className="text-xs text-text-muted italic py-6 text-center">Excellent! No pending reports currently require verification audits.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ADMIN OPERATIONS DASHBOARD */}
          {activeTab === "admin-dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-black dark:to-slate-950 text-white p-6 rounded-2xl shadow-md border border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase">
                      Root Shell Access Secure
                    </span>
                  </div>
                  <h2 className="text-2xl font-black mt-2">Municipal Administration Command</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    System-wide analytics, department reallocation tools, AI engine performance metrics, and compliance audit logs.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="text-xs font-mono bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    Ledger Status: 100% Compliant
                  </span>
                </div>
              </div>

              {/* Aggregation Widgets Row */}
              {analytics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 text-left">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">Total System Incidents</span>
                    <strong className="text-2xl font-bold font-mono text-text-primary">{analytics.totalReports}</strong>
                  </div>
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 text-left">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">Active Workload Count</span>
                    <strong className="text-2xl font-bold font-mono text-indigo-600">{reports.filter(r => r.status !== "Resolved").length} Tickets</strong>
                  </div>
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 text-left">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">AI Success Rate</span>
                    <strong className="text-2xl font-bold font-mono text-emerald-600">99.8%</strong>
                  </div>
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 text-left">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">Mean Resolve Duration</span>
                    <strong className="text-2xl font-bold font-mono text-amber-500">{analytics.averageResolutionTime}</strong>
                  </div>
                </div>
              )}

              {/* Bento Grid layout with AI Metrics, Category Density and History graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Gemini AI Performance Card */}
                <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">Gemini AI Engine Metrics</h4>
                  </div>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center bg-bg-panel p-2.5 rounded-lg border border-border-subtle">
                      <span className="text-text-secondary">AI Model Name</span>
                      <strong className="text-text-primary">gemini-3.5-flash</strong>
                    </div>
                    <div className="flex justify-between items-center bg-bg-panel p-2.5 rounded-lg border border-border-subtle">
                      <span className="text-text-secondary">JSON Schema Compliance</span>
                      <strong className="text-emerald-600">100.0%</strong>
                    </div>
                    <div className="flex justify-between items-center bg-bg-panel p-2.5 rounded-lg border border-border-subtle">
                      <span className="text-text-secondary">Average API Latency</span>
                      <strong className="text-text-primary">1.22 seconds</strong>
                    </div>
                    <div className="flex justify-between items-center bg-bg-panel p-2.5 rounded-lg border border-border-subtle">
                      <span className="text-text-secondary">Duplication Detection Rate</span>
                      <strong className="text-indigo-600">94.2% (Merged)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-bg-panel p-2.5 rounded-lg border border-border-subtle">
                      <span className="text-text-secondary">Smart Triage Conf.</span>
                      <strong className="text-amber-600">91.8% Accuracy</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-relaxed bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/10">
                    💡 <strong>Smart Dispatch Optimization:</strong> Model parameters auto-tune based on citizen feedback sentiment scores and volunteer verification weight coefficients.
                  </p>
                </div>

                {/* Pie chart and area history graph */}
                {analytics && (
                  <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm lg:col-span-2 space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">Active Heatmaps & Density overview</h4>
                      <button 
                        onClick={() => setActiveTab("map")}
                        className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded font-bold transition cursor-pointer"
                      >
                        Open Heatmap Overlay
                      </button>
                    </div>
                    
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.monthlyHistory}>
                          <defs>
                            <linearGradient id="adminReported" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="adminResolved" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
                          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} />
                          <YAxis stroke="var(--text-muted)" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "12px", color: "var(--text-primary)" }} />
                          <Area type="monotone" dataKey="reported" stroke="#4F46E5" fillOpacity={1} fill="url(#adminReported)" name="Reported" />
                          <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#adminResolved)" name="Resolved" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ADMIN INCIDENT LEDGER MANAGEMENT */}
          {activeTab === "admin-incidents" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-left">
                <h2 className="text-xl font-black text-text-primary">Ecosystem Incident Database Ledger</h2>
                <p className="text-xs text-text-secondary">Override Gemini-generated priority ratings, reassign city authority departments, or expunge fake records permanently.</p>
              </div>

              <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-border-subtle">
                  {reports.map((rep) => (
                    <div key={rep.id} className="p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs">
                      
                      {/* Left: Metadata */}
                      <div className="space-y-1.5 flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-900 border border-border-subtle px-1.5 py-0.5 rounded font-bold text-text-secondary">{rep.id}</span>
                          <strong className="text-text-primary text-sm font-bold truncate block">{rep.title}</strong>
                          <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold uppercase ${
                            rep.severity === "Critical" ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-slate-50 border-slate-200 text-text-secondary"
                          }`}>{rep.severity}</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed truncate max-w-xl">{rep.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-text-muted font-mono">
                          <span>Department: <strong className="text-indigo-600">{rep.aiAnalysis?.assignedAuthority || "Department of Public Works"}</strong></span>
                          <span>Priority: <strong className="text-text-primary">{rep.priorityScore}/100</strong></span>
                          <span>Status: <strong className="text-emerald-600">{rep.status}</strong></span>
                        </div>
                      </div>

                      {/* Right: Administrative Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto shrink-0">
                        {/* Priority override slider toggle */}
                        <div className="flex flex-wrap items-center gap-2">
                          {adminOverridingPriorityId === rep.id ? (
                            <div className="flex items-center gap-2 bg-bg-panel border border-indigo-100 p-2 rounded-xl">
                              <span className="text-[10px] font-mono font-bold text-text-primary">Priority: {adminPriorityValue}</span>
                              <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                value={adminPriorityValue}
                                onChange={(e) => setAdminPriorityValue(parseInt(e.target.value))}
                                className="w-24 accent-indigo-600 cursor-pointer"
                              />
                              <button 
                                onClick={() => {
                                  // Update priority
                                  setReports(prev => prev.map(r => r.id === rep.id ? {...r, priorityScore: adminPriorityValue} : r));
                                  const now = new Date();
                                  setAuditLogs(prev => [
                                    { timestamp: now.toTimeString().split(' ')[0], type: "DB" as const, message: `Admin manual OVERRIDE PRIORITY for report ${rep.id} to [${adminPriorityValue}/100].` },
                                    ...prev
                                  ]);
                                  setAdminOverridingPriorityId(null);
                                }}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-[10px] cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setAdminOverridingPriorityId(rep.id);
                                setAdminPriorityValue(rep.priorityScore);
                              }}
                              className="px-2.5 py-1.5 bg-bg-panel border border-border-subtle rounded-lg text-text-primary hover:bg-bg-app font-bold cursor-pointer"
                            >
                              Override AI Priority
                            </button>
                          )}

                          {/* Reassign Authority */}
                          {adminReassigningId === rep.id ? (
                            <div className="flex items-center gap-1.5 bg-bg-panel border border-indigo-100 p-2 rounded-xl">
                              <select 
                                value={adminReassignDeptValue} 
                                onChange={(e) => setAdminReassignDeptValue(e.target.value)}
                                className="bg-bg-card border border-border-subtle text-[11px] p-1 rounded font-sans focus:outline-none text-text-primary"
                              >
                                {departments.map(d => (
                                  <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                              </select>
                              <button 
                                onClick={() => {
                                  setReports(prev => prev.map(r => {
                                    if (r.id === rep.id) {
                                      return {
                                        ...r,
                                        aiAnalysis: r.aiAnalysis ? { ...r.aiAnalysis, assignedAuthority: adminReassignDeptValue } : { summary: "", detectedObjects: [], assignedAuthority: adminReassignDeptValue, confidenceScore: 1, estimatedCostRupees: 1, estimatedTime: "", priorityRationale: "" }
                                      };
                                    }
                                    return r;
                                  }));
                                  const now = new Date();
                                  setAuditLogs(prev => [
                                    { timestamp: now.toTimeString().split(' ')[0], type: "DB" as const, message: `Admin MANUAL REASSIGNED report ${rep.id} to [${adminReassignDeptValue}].` },
                                    ...prev
                                  ]);
                                  setAdminReassigningId(null);
                                }}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-[10px] cursor-pointer"
                              >
                                Reassign
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setAdminReassigningId(rep.id);
                                setAdminReassignDeptValue(rep.aiAnalysis?.assignedAuthority || departments[0].name);
                              }}
                              className="px-2.5 py-1.5 bg-bg-panel border border-border-subtle rounded-lg text-text-primary hover:bg-bg-app font-bold cursor-pointer"
                            >
                              Dispatch Dept
                            </button>
                          )}

                          {/* Delete Ticket */}
                          <button 
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this incident ticket from the database?")) {
                                setReports(prev => prev.filter(r => r.id !== rep.id));
                                const now = new Date();
                                setAuditLogs(prev => [
                                  { timestamp: now.toTimeString().split(' ')[0], type: "DB" as const, message: `Admin MANUAL DELETE ticket ${rep.id} executed successfully. Record purged.` },
                                  ...prev
                                ]);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                            title="Purge Incident"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN USER Roster MANAGEMENT */}
          {activeTab === "admin-users" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-left">
                <h2 className="text-xl font-black text-text-primary">Ecosystem Member Management</h2>
                <p className="text-xs text-text-secondary">View user standings, manage daily streaks, promote civic rankings, or award custom merit badges.</p>
              </div>

              <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 bg-bg-panel px-6 py-3 text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle">
                  <span className="col-span-4 text-left">Full Name / Tag</span>
                  <span className="col-span-2 text-center">Civic Rank</span>
                  <span className="col-span-2 text-center">Streak Count</span>
                  <span className="col-span-2 text-center">Score Balance</span>
                  <span className="col-span-2 text-right">Award Action</span>
                </div>

                <div className="divide-y divide-border-subtle">
                  {users.map((usr) => (
                    <div key={usr.username} className="grid grid-cols-12 px-6 py-4 items-center text-xs">
                      
                      {/* Name Card */}
                      <div className="col-span-4 flex items-center gap-3 text-left">
                        <img src={usr.avatar} alt="" className="w-8 h-8 rounded-full border border-border-subtle object-cover animate-fade-in" />
                        <div>
                          <strong className="text-text-primary font-bold block">{usr.fullName}</strong>
                          <span className="text-[10px] text-text-secondary font-mono">@{usr.username}</span>
                        </div>
                      </div>

                      {/* Rank */}
                      <span className="col-span-2 text-center font-bold text-indigo-600 dark:text-indigo-400 font-sans">
                        Level {usr.level}
                      </span>

                      {/* Streak */}
                      <span className="col-span-2 text-center font-mono font-bold text-orange-500">
                        🔥 {usr.streak || 0}d
                      </span>

                      {/* Score Balance */}
                      <span className="col-span-2 text-center font-mono font-extrabold text-amber-600">
                        {usr.points} Pts
                      </span>

                      {/* Actions */}
                      <div className="col-span-2 text-right">
                        <button 
                          onClick={() => {
                            // Boost points
                            setUsers(prev => prev.map(u => u.username === usr.username ? {...u, points: u.points + 50} : u));
                            const now = new Date();
                            setAuditLogs(prev => [
                              { timestamp: now.toTimeString().split(' ')[0], type: "EVENT" as const, message: `Admin awarded +50 points (MERIT BADGE PROMOTION) to user @${usr.username}.` },
                              ...prev
                            ]);
                            alert(`Issued +50 Points Merit promotion to user @${usr.username}!`);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition shadow-sm cursor-pointer"
                        >
                          Award Merit Badge
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN DEPARTMENT CAPACITIES */}
          {activeTab === "admin-departments" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-left">
                <h2 className="text-xl font-black text-text-primary">Civic Department Allocation & Capacity</h2>
                <p className="text-xs text-text-secondary">Model real-time municipal resource shifts. Sliding capacity limiters dynamically recalculate workload limits and live efficiency metrics.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((dept) => {
                  const calculatedEfficiency = Math.min(100, Math.round((dept.capacity - dept.workload) * 1.25));
                  return (
                    <div key={dept.id} className="bg-bg-card border border-border-subtle p-5 rounded-2xl space-y-4 shadow-sm text-left animate-fade-in">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{dept.icon}</span>
                          <h3 className="font-bold text-text-primary text-xs">{dept.name}</h3>
                        </div>
                        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          Eff: {calculatedEfficiency}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-bg-panel p-3 rounded-xl border border-border-subtle">
                        <div>
                          <span className="text-[9px] text-text-secondary uppercase block font-bold">Allocated Crews</span>
                          <strong className="text-text-primary text-sm font-bold block mt-0.5">{dept.capacity} Personnel</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-text-secondary uppercase block font-bold">Pending Incidents</span>
                          <strong className="text-rose-600 text-sm font-bold block mt-0.5">{dept.workload} active tickets</strong>
                        </div>
                      </div>

                      {/* Sliding controls */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-text-secondary block font-bold font-mono">Simulate Crew Capacity Re-allocation</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="20" 
                            max="120" 
                            value={dept.capacity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setDepartments(prev => prev.map(d => d.id === dept.id ? {...d, capacity: val} : d));
                            }}
                            className="flex-1 accent-indigo-600 cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-text-primary">{dept.capacity} Crews</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SYSTEM COMPLIANCE AUDIT LOGS */}
          {activeTab === "admin-audit" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                <div>
                  <h2 className="text-xl font-black text-text-primary">System Compliance & Audit Trail</h2>
                  <p className="text-xs text-text-secondary">Immutable ledger of system events, API payloads, database mutations, and personnel security authorization events.</p>
                </div>
                <button 
                  onClick={() => setAuditLogs([])}
                  className="px-3 py-1.5 border border-border-subtle text-text-secondary hover:text-text-primary bg-bg-panel hover:bg-bg-app rounded-lg text-xs font-bold transition cursor-pointer self-start sm:self-auto"
                >
                  Clear shell buffer
                </button>
              </div>

              {/* Terminal emulation */}
              <div className="bg-slate-950 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-2xl font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
                <div className="text-slate-500 pb-2 border-b border-slate-900 flex justify-between">
                  <span>SYSTEM KERNEL STACK MONITOR (v3.0)</span>
                  <span className="animate-pulse text-emerald-500 font-bold">● LINK ESTABLISHED</span>
                </div>
                {auditLogs.map((log, index) => (
                  <div key={index} className="flex gap-2 items-start leading-relaxed select-text text-left">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                      log.type === "INFO" ? "bg-indigo-950 border border-indigo-800/40 text-indigo-400" :
                      log.type === "DB" ? "bg-emerald-950 border border-emerald-800/40 text-emerald-400" :
                      log.type === "AI" ? "bg-amber-950 border border-amber-800/40 text-amber-400" :
                      log.type === "EVENT" ? "bg-purple-950 border border-purple-800/40 text-purple-400" :
                      "bg-rose-950 border border-rose-800/40 text-rose-400"
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-slate-500 italic py-4 text-center">Shell log buffer cleared. Waiting for system triggers...</p>
                )}
              </div>
            </div>
          )}

          {/* INCIDENT FEED */}
          {activeTab === "feed" && (() => {
            const filteredReports = reports.filter((rep) => {
              const matchesCategory = categoryFilter === "All" || rep.category === categoryFilter;
              const matchesStatus = statusFilter === "All" || rep.status === statusFilter;
              return matchesCategory && matchesStatus;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-text-primary">Hyperlocal Incidents Feed</h2>
                    <p className="text-xs text-text-secondary">Crowdsourced alerts verified by neighbors and prioritized by server-side AI.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("report")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 self-start sm:self-auto transition duration-150 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" /> File Incident
                  </button>
                </div>

                {/* Filters Row */}
                <div className="bg-bg-card border border-border-subtle p-4 rounded-2xl space-y-3 shadow-sm transition-colors duration-200">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider w-16">Category:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {["All", "Roads & Potholes", "Water & Drainage", "Electricity & Lighting", "Sanitation & Trash", "Safety & Others"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                              categoryFilter === cat 
                                ? "bg-indigo-600 text-white shadow-sm" 
                                : "bg-bg-panel border border-border-subtle text-text-secondary hover:bg-bg-app hover:text-text-primary"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider w-16">Status:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {["All", "Reported", "Validated", "In Progress", "Resolved"].map((st) => (
                          <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                              statusFilter === st 
                                ? "bg-indigo-600 text-white shadow-sm" 
                                : "bg-bg-panel border border-border-subtle text-text-secondary hover:bg-bg-app hover:text-text-primary"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {filteredReports.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredReports.map((rep) => {
                      const isVotedByMe = rep.votedUsers.includes("you_hero");
                      return (
                        <div 
                          key={rep.id} 
                          onClick={() => selectReport(rep)}
                          className="bg-bg-card border border-border-subtle rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all duration-200 overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            {rep.imageUrl && (
                              <div className="h-44 w-full relative bg-bg-panel overflow-hidden">
                                <img 
                                  src={rep.imageUrl} 
                                  alt={rep.title} 
                                  className="w-full h-full object-cover opacity-95 hover:scale-102 transition duration-300" 
                                />
                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                  <span className={`text-[10px] font-extrabold font-mono px-2 py-1 rounded-md text-white ${
                                    rep.severity === "Critical" ? "bg-rose-600 animate-pulse" :
                                    rep.severity === "High" ? "bg-orange-500" :
                                    rep.severity === "Medium" ? "bg-amber-500" : "bg-emerald-600"
                                  }`}>
                                    {rep.severity}
                                  </span>
                                  <span className="text-[10px] font-extrabold font-mono px-2 py-1 bg-bg-card/95 backdrop-blur-md rounded-md text-indigo-600 dark:text-indigo-400 border border-border-subtle shadow-sm">
                                    Priority Score: {rep.priorityScore}
                                  </span>
                                </div>
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                  <span className="bg-bg-card/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-text-primary border border-border-subtle shadow-sm">
                                    {rep.category}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="p-5 space-y-3">
                              <div className="flex items-center gap-2">
                                <img src={rep.reporterAvatar} alt="" className="w-5 h-5 rounded-full border border-border-subtle" />
                                <span className="text-[11px] text-text-secondary font-medium">{rep.reporterName}</span>
                                <span className="text-text-muted">•</span>
                                <span className="text-[11px] text-text-muted">{new Date(rep.createdAt).toLocaleDateString()}</span>
                              </div>

                              <div>
                                <h3 className="font-bold text-text-primary text-sm hover:text-indigo-600 transition">{rep.title}</h3>
                                <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">{rep.description}</p>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-text-secondary pt-2">
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-text-muted" /> {rep.locationName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="border-t border-border-subtle bg-bg-panel/30 px-5 py-3 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                                rep.status === "Resolved" ? "bg-emerald-500" :
                                rep.status === "In Progress" ? "bg-indigo-500" :
                                rep.status === "Validated" ? "bg-amber-500" : "bg-slate-400"
                              }`} />
                              <span className="font-bold text-text-primary">{rep.status}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(rep.id);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                                  isVotedByMe 
                                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400" 
                                    : "bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-panel"
                                }`}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{rep.votesCount} Upvote</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-bg-card border border-border-subtle p-12 rounded-2xl text-center space-y-2 shadow-sm">
                    <p className="text-sm font-semibold text-text-primary">No matching incidents found</p>
                    <p className="text-xs text-text-secondary">Try adjusting your filters to show more crowdsourced alerts.</p>
                  </div>
                )}
              </div>
            );
          })()}


          {/* INTERACTIVE GEOLOCATION MAP */}
          {activeTab === "map" && (
            <div className="space-y-6 h-full flex flex-col">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-text-primary">Hyperlocal City Map Layer</h2>
                <p className="text-xs text-text-secondary">Fictional sector coordinate tracking. Click anywhere to select a pinpoint coordinate.</p>
              </div>

              {/* Fictional City Map Canvas Grid */}
              <div className="relative flex-1 bg-bg-panel rounded-2xl border border-border-subtle overflow-hidden flex min-h-[450px] shadow-inner transition-colors duration-200">
                
                {/* SVG City Overlay Background representation */}
                <div className="absolute inset-0 opacity-80 select-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" className="stroke-slate-200/50 dark:stroke-slate-800/50" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#city-grid)" />
                    {/* Simulated main roads */}
                    <line x1="10%" y1="0" x2="10%" y2="100%" className="stroke-slate-200 dark:stroke-slate-800/80" strokeWidth="12" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" className="stroke-slate-200 dark:stroke-slate-800/80" strokeWidth="16" />
                    <line x1="85%" y1="0" x2="85%" y2="100%" className="stroke-slate-200 dark:stroke-slate-800/80" strokeWidth="12" />
                    <line x1="0" y1="30%" x2="100%" y2="30%" className="stroke-slate-200 dark:stroke-slate-800/80" strokeWidth="14" />
                    <line x1="0" y1="75%" x2="100%" y2="75%" className="stroke-slate-200 dark:stroke-slate-800/80" strokeWidth="14" />
                    {/* Parks & Water bodies */}
                    <rect x="15%" y="40%" width="20%" height="25%" fill="#10B981" rx="10" opacity="0.12" />
                    <text x="25%" y="53%" className="fill-emerald-700 dark:fill-emerald-400 font-bold" fontSize="10" fontFamily="monospace" textAnchor="middle">WHISPERING PARK</text>
                    
                    <rect x="60%" y="10%" width="20%" height="15%" fill="#3B82F6" rx="10" opacity="0.12" />
                    <text x="70%" y="18%" className="fill-blue-700 dark:fill-blue-400 font-bold" fontSize="10" fontFamily="monospace" textAnchor="middle">RESERVOIR BASIN</text>
                  </svg>
                </div>

                {/* Plot Dynamic Markers for Active Reports */}
                {reports.map((rep, idx) => {
                  const x = ((rep.longitude - (-122.45)) / (0.04)) * 100;
                  const y = (1 - (rep.latitude - 37.75) / 0.04) * 100;

                  return (
                    <button
                      key={rep.id}
                      onClick={() => selectReport(rep)}
                      className="absolute group z-10 transition hover:scale-125 focus:outline-none"
                      style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                    >
                      <MapPin className={`w-6 h-6 drop-shadow-md ${
                        rep.severity === "Critical" ? "text-rose-600 animate-bounce" :
                        rep.severity === "High" ? "text-orange-500" :
                        rep.severity === "Medium" ? "text-amber-500" : "text-emerald-500"
                      }`} />
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-bg-card border border-border-subtle p-2.5 rounded-lg text-[10px] w-48 text-left shadow-lg pointer-events-none z-50 transition-colors duration-200">
                        <span className="font-bold block text-text-primary">{rep.title}</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-text-secondary font-medium">{rep.category}</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">Score: {rep.priorityScore}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Map Sidebar Selector panel */}
                <div className="absolute right-4 top-4 bg-bg-card/95 backdrop-blur-md border border-border-subtle p-4 rounded-xl w-64 text-xs space-y-3 z-20 shadow-md transition-colors duration-200">
                  <span className="font-bold text-text-primary block">Interactive Map Index</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 font-medium text-text-secondary"><MapPin className="w-3.5 h-3.5 text-rose-600" /> Critical Severity</span>
                      <strong className="font-mono text-text-primary">{reports.filter(r => r.severity === "Critical").length}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 font-medium text-text-secondary"><MapPin className="w-3.5 h-3.5 text-orange-500" /> High Severity</span>
                      <strong className="font-mono text-text-primary">{reports.filter(r => r.severity === "High").length}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 font-medium text-text-secondary"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Medium Severity</span>
                      <strong className="font-mono text-text-primary">{reports.filter(r => r.severity === "Medium").length}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 font-medium text-text-secondary"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Low Severity</span>
                      <strong className="font-mono text-text-primary">{reports.filter(r => r.severity === "Low").length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* REPORT INCIDENT FORM */}
          {activeTab === "report" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-text-primary">File Hyperlocal Community Incident</h2>
                <p className="text-xs text-text-secondary">AI-assisted reporting with real-time duplication checking, multi-criteria priority scoring, and department assignment.</p>
              </div>

              {formError && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" /> {formError}
                </div>
              )}

              {/* STAGE 0: LOADING 10-STEP DIAGNOSTIC PANEL */}
              {isAiProcessing && (
                <div className="bg-bg-card border border-indigo-500/15 p-6 rounded-2xl shadow-md space-y-6 animate-pulse">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-extrabold text-text-primary">Gemini Advanced Triage Engine Active</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">
                      Step {currentDiagnosticStep || 1}/10
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    {[
                      "🔒 Establishing secure, end-to-end municipal server connection...",
                      "📸 Compressing and parsing high-resolution image telemetry...",
                      "⚡ Initializing Gemini Vision model pipeline...",
                      "🧠 Analyzing visual pixel grids for structural hazards & spalling...",
                      "🗺️ Fetching geospatial metadata overlays and zoning maps...",
                      "🔍 Scanning immediate neighborhood vector indexes for active duplicates...",
                      "📈 Calculating multi-criteria Smart City priority ranking matrices...",
                      "💼 Estimating repair cost quotes (₹) and project labor duration...",
                      "🏢 Identifying appropriate civic department & utility authority assignments...",
                      "📋 Formulating safety warnings & final technical damage summary..."
                    ].map((stepText, idx) => {
                      const stepNum = idx + 1;
                      const isDone = currentDiagnosticStep > stepNum;
                      const isCurrent = currentDiagnosticStep === stepNum || (currentDiagnosticStep === 0 && idx === 0);
                      const isUpcoming = currentDiagnosticStep < stepNum && !isCurrent;

                      return (
                        <div key={idx} className={`flex items-center gap-2 transition ${
                          isDone ? "text-emerald-600 dark:text-emerald-400/80 font-medium" :
                          isCurrent ? "text-indigo-600 dark:text-indigo-400 font-extrabold scale-[1.01]" :
                          "text-text-muted/60"
                        }`}>
                          <div className="shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : isCurrent ? (
                              <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 ml-1"></div>
                            )}
                          </div>
                          <span>{stepText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STAGE 1: FORM INPUT AND PREPARATION */}
              {!isAiProcessing && !aiAnalysisResult && (
                <form onSubmit={handleTriggerAiTriage} className="bg-bg-card border border-border-subtle p-6 rounded-2xl space-y-5 shadow-sm transition-colors duration-200">
                  
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-2">
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Step 1 of 2: Prepare Report Data</span>
                    <span className="text-[10px] font-mono bg-bg-panel px-2 py-0.5 rounded text-text-muted">Citizens Ledger</span>
                  </div>

                  {/* VOICE INPUT CONTROLLER CONTAINER */}
                  <div className="bg-slate-500/5 border border-border-subtle p-4 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-extrabold text-text-primary flex items-center gap-1.5">
                          <Mic className="w-4 h-4 text-indigo-600" />
                          AI Smart Voice Assistant Reporting
                        </span>
                        <p className="text-[10px] text-text-muted mt-0.5">Speak naturally. Gemini extracts category, severity, title & description instantly.</p>
                      </div>

                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 ${
                          isVoiceRecording 
                            ? "bg-rose-600 animate-pulse text-white hover:bg-rose-500" 
                            : "bg-indigo-600 text-white hover:bg-indigo-500"
                        }`}
                      >
                        {isVoiceRecording ? (
                          <>
                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                            <span>Stop & Parse Speech...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5" />
                            <span>Record with Microphone</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick Voice simulation presets for testing inside any environment */}
                    <div className="space-y-1.5 border-t border-border-subtle/50 pt-2.5">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">🎤 Click to Simulate Voice Reports (Failsafe Sandbox test):</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                        {[
                          {
                            label: "🚧 Sewer Pipe Burst",
                            text: "A huge sewer water leakage has broken on Sector 4 central avenue near the children hospital, the dirty water is flooding the street and creating deep health safety risk"
                          },
                          {
                            label: "🕳️ Crushed Pothole",
                            text: "Severe deep crater pothole on national highway lane 2, vehicles are braking suddenly causing a traffic bottleneck"
                          },
                          {
                            label: "💡 Dark Alleyway",
                            text: "The main streetlight lamp is broken and flickering in the blind alley behind civil school, it feels highly unsafe for girls walking back"
                          }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => processVoiceTranscript(preset.text)}
                            className="bg-bg-panel hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-border-subtle hover:border-indigo-200 text-left px-2.5 py-1.5 rounded-lg text-[9px] leading-tight text-text-secondary transition"
                          >
                            <span className="font-bold text-text-primary block mb-0.5">{preset.label}</span>
                            <span className="line-clamp-2 italic">"{preset.text}"</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image selection row - Presets or Custom upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-primary block">1. Attach Image Proof (Required)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {imagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectPresetImage(preset)}
                          className={`p-1.5 rounded-xl border text-left flex flex-col items-center justify-between text-[10px] bg-bg-panel hover:border-indigo-400 transition ${
                            newImageBase64 === preset.url ? "border-indigo-600 ring-1 ring-indigo-500/50" : "border-border-subtle"
                          }`}
                        >
                          <img src={preset.url} alt="" className="w-full h-16 object-cover rounded-lg mb-1" />
                          <span className="font-bold text-text-primary block text-center truncate w-full">{preset.title}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-center border-2 border-dashed border-border-subtle rounded-xl p-4 bg-bg-panel hover:bg-bg-app transition duration-150">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="custom-file" 
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                      <label htmlFor="custom-file" className="cursor-pointer text-xs flex items-center gap-2 text-text-secondary hover:text-text-primary">
                        <Camera className="w-4 h-4 text-text-muted" />
                        <span>Or upload your own picture from device</span>
                      </label>
                    </div>
                  </div>

                  {/* Display Chosen image Preview */}
                  {newImageBase64 && (
                    <div className="h-44 w-full rounded-xl overflow-hidden relative bg-bg-panel border border-border-subtle shadow-inner">
                      <img src={newImageBase64} alt="Chosen template" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setNewImageBase64("")}
                        className="absolute top-2 right-2 bg-black/75 p-1 rounded-full text-slate-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Text Title & Description Fields */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary">2. Incident Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dangerous pothole crater causing sudden braking"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-bg-panel border border-border-subtle px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-bg-card text-text-primary placeholder:text-text-muted/60 transition"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary">3. Visual Metadata description</label>
                    <textarea 
                      placeholder="Explain physical size, location, and potential public hazards..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-bg-panel border border-border-subtle px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-bg-card text-text-primary placeholder:text-text-muted/60 resize-none transition"
                    />
                  </div>

                  {/* Category & Location selection Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-primary">4. Primary Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-bg-panel border border-border-subtle px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-bg-card text-text-primary transition"
                      >
                        <option value="Roads & Potholes">Roads & Potholes</option>
                        <option value="Water & Drainage">Water & Drainage</option>
                        <option value="Sanitation & Trash">Sanitation & Trash</option>
                        <option value="Electricity & Lighting">Electricity & Lighting</option>
                        <option value="Safety & Others">Safety & Others</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-primary">5. Landmark Street Address</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5th Main Rd, Sector 4, near Central School"
                        value={newLocationName}
                        onChange={(e) => setNewLocationName(e.target.value)}
                        className="w-full bg-bg-panel border border-border-subtle px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-bg-card text-text-primary placeholder:text-text-muted/60 transition"
                      />
                    </div>
                  </div>

                  {/* MUNICIPAL MULTI-CRITERIA DECISION FACTORS */}
                  <div className="border border-border-subtle bg-bg-panel/50 p-4 rounded-xl space-y-3">
                    <span className="text-[10px] font-extrabold text-text-primary uppercase tracking-wider block">🏢 Smart City Triage Parameters (Affects Priority Score calculation)</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-text-secondary font-bold uppercase">Traffic Volume Impact</label>
                        <div className="flex gap-1.5">
                          {["Low", "Medium", "High"].map((lev) => (
                            <button
                              key={lev}
                              type="button"
                              onClick={() => setTrafficImpact(lev as any)}
                              className={`flex-1 py-1 rounded text-[10px] font-bold border transition ${
                                trafficImpact === lev 
                                  ? "bg-indigo-600 border-indigo-500 text-white" 
                                  : "bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              {lev}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-text-secondary font-bold uppercase">Population Density</label>
                        <div className="flex gap-1.5">
                          {["Low", "Medium", "High"].map((lev) => (
                            <button
                              key={lev}
                              type="button"
                              onClick={() => setPopulationDensity(lev as any)}
                              className={`flex-1 py-1 rounded text-[10px] font-bold border transition ${
                                populationDensity === lev 
                                  ? "bg-indigo-600 border-indigo-500 text-white" 
                                  : "bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              {lev}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 flex flex-col justify-end">
                        <label className="text-[10px] text-text-secondary font-bold uppercase mb-1">Sensitive Proximity</label>
                        <button
                          type="button"
                          onClick={() => setNearSensitiveSite(!nearSensitiveSite)}
                          className={`w-full py-1.5 rounded text-[10px] font-bold border transition flex items-center justify-center gap-1.5 ${
                            nearSensitiveSite 
                              ? "bg-amber-600 border-amber-500 text-white" 
                              : "bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Near Hospital/School: {nearSensitiveSite ? "Yes" : "No"}</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Coordinate Simulation Details */}
                  <div className="p-3 bg-bg-panel border border-border-subtle rounded-xl flex justify-between font-mono text-[10px] text-text-secondary">
                    <span>GPS Simulation Lat: <strong className="text-text-primary">{newLatitude.toFixed(6)}</strong></span>
                    <span>Lon: <strong className="text-text-primary">{newLongitude.toFixed(6)}</strong></span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-1.5 transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run Gemini AI Triage & Analyze Issue</span>
                  </button>
                </form>
              )}

              {/* STAGE 2: AI REVIEW AND CONFIRMATION CARD */}
              {!isAiProcessing && aiAnalysisResult && (
                <div className="space-y-6">
                  
                  {/* Duplicate Alert Panel */}
                  {aiAnalysisResult.duplicateCheck?.isDuplicate && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/30 p-5 rounded-2xl space-y-3 shadow-sm animate-bounce">
                      <div className="flex items-start gap-2 text-xs font-bold text-amber-800 dark:text-amber-400">
                        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 animate-pulse" />
                        <div>
                          <span className="text-sm font-black">⚠️ POTENTIAL DUPLICATE DETECTED</span>
                          <p className="text-[11px] font-medium text-amber-700/80 dark:text-amber-400/80 mt-1">
                            An identical incident was recently reported near this coordinates range ({aiAnalysisResult.duplicateCheck.similarity} similarity).
                          </p>
                        </div>
                      </div>

                      <div className="bg-bg-card border border-amber-100 dark:border-amber-900/10 p-3 rounded-xl text-xs font-sans space-y-1">
                        <span className="text-[10px] font-bold text-text-muted">DUPLICATE CONFLICT MESSAGE:</span>
                        <p className="text-text-secondary leading-relaxed italic text-[11px]">
                          "{aiAnalysisResult.duplicateCheck.message}"
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Link duplicate and close
                            alert("Linked! This report is merged into the existing tracking ticket. Your user account points are saved!");
                            setAiAnalysisResult(null);
                            setActiveTab("feed");
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-lg transition"
                        >
                          Link my Report to Existing Ticket
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Discard duplicate check and proceed
                            aiAnalysisResult.duplicateCheck.isDuplicate = false;
                            setAiAnalysisResult({ ...aiAnalysisResult });
                          }}
                          className="bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary text-[10px] font-bold px-3.5 py-1.5 rounded-lg transition"
                        >
                          Override: Post as Unique Incident
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Primary AI Asset Assessment Card */}
                  <div className="bg-bg-card border border-indigo-500/10 p-6 rounded-2xl shadow-xl space-y-5 transition-all duration-200">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono block">STAGE 2 of 2: Gemini Triage Assessment</span>
                        <h3 className="text-sm font-extrabold text-text-primary mt-0.5">Please Review and Confirm AI Predictions</h3>
                      </div>
                      <span className="text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{aiAnalysisResult.confidence}% confidence</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left: General Assessment details */}
                      <div className="space-y-3 text-xs">
                        
                        <div className="bg-bg-panel border border-border-subtle p-3.5 rounded-xl space-y-1">
                          <span className="text-[9px] text-text-muted block uppercase font-bold tracking-wider">AI Technical Summary</span>
                          <p className="text-text-secondary leading-relaxed font-sans text-[11px]">{aiAnalysisResult.summary}</p>
                        </div>

                        <div className="bg-bg-panel border border-border-subtle p-3.5 rounded-xl space-y-1.5">
                          <span className="text-[9px] text-text-muted block uppercase font-bold tracking-wider">Spotted Visual Markers</span>
                          <div className="flex flex-wrap gap-1">
                            {aiAnalysisResult.detectedObjects.map((obj: string, i: number) => (
                              <span key={i} className="bg-bg-card text-text-primary border border-border-subtle px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                                {obj}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 p-3.5 rounded-xl space-y-1">
                          <span className="text-[9px] text-rose-700 dark:text-rose-400 block uppercase font-bold tracking-wider">Possible Safety Risks</span>
                          <p className="text-rose-800 dark:text-rose-300 font-sans text-[11px] leading-snug">{aiAnalysisResult.safetyRisk}</p>
                        </div>

                      </div>

                      {/* Right: Smart Metrics */}
                      <div className="space-y-3 text-xs font-mono">
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-bg-panel border border-border-subtle p-3 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] text-text-muted uppercase font-bold">Severity Rating</span>
                            <span className={`text-xs font-extrabold mt-1 uppercase ${
                              aiAnalysisResult.severity === "Critical" ? "text-rose-600 animate-pulse" :
                              aiAnalysisResult.severity === "High" ? "text-orange-500" :
                              aiAnalysisResult.severity === "Medium" ? "text-amber-500" : "text-emerald-500"
                            }`}>
                              {aiAnalysisResult.severity}
                            </span>
                          </div>

                          <div className="bg-bg-panel border border-border-subtle p-3 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] text-text-muted uppercase font-bold">Smart City Priority</span>
                            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 font-sans">
                              {aiAnalysisResult.priorityScore}/100
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-bg-panel border border-border-subtle p-3 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] text-text-muted uppercase font-bold">Est. Repair Cost</span>
                            <span className="text-xs font-extrabold text-text-primary mt-1">
                              ₹{aiAnalysisResult.estimatedCostRupees.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-bg-panel border border-border-subtle p-3 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] text-text-muted uppercase font-bold">Est. Labor Time</span>
                            <span className="text-xs font-extrabold text-text-primary mt-1">
                              {aiAnalysisResult.estimatedTime}
                            </span>
                          </div>
                        </div>

                        <div className="bg-bg-panel border border-border-subtle p-3.5 rounded-xl space-y-1">
                          <span className="text-[9px] text-text-muted block uppercase font-bold">Assigned Civic Authority</span>
                          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-sans block mt-1">
                            {aiAnalysisResult.assignedAuthority}
                          </span>
                        </div>

                        {/* Priority formulation logic */}
                        {aiAnalysisResult.priorityRationale && (
                          <div className="bg-bg-panel border border-border-subtle p-3.5 rounded-xl space-y-1 font-sans">
                            <span className="text-[9px] text-text-muted block uppercase font-bold font-mono">Priority Score formulation logic</span>
                            <p className="text-[10px] text-text-secondary leading-relaxed font-sans">{aiAnalysisResult.priorityRationale}</p>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Dual Stage Buttons */}
                    <div className="flex gap-3 pt-2 border-t border-border-subtle/50">
                      <button
                        type="button"
                        onClick={() => setAiAnalysisResult(null)}
                        className="flex-1 py-3 bg-bg-panel hover:bg-bg-app border border-border-subtle text-text-secondary hover:text-text-primary rounded-xl text-xs font-extrabold transition-all"
                      >
                        Discard & Edit Form
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitReport}
                        className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Save to Incident Ledger</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}


          {/* GAMIFIED SCOREBOARD & LEADERBOARD */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-text-primary">Ecosystem Rewards & Gamification</h2>
                <p className="text-xs text-text-secondary">Earn contributions badges, complete weekly sector goals, and lead civic action ranking tables.</p>
              </div>

              {/* Weekly Challenges Row */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Active Weekly Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {challenges.map((ch) => (
                    <div key={ch.id} className="bg-bg-card border border-border-subtle p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-sm transition-colors duration-200">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-text-primary text-xs leading-tight">{ch.title}</h4>
                          <span className="text-[9px] font-bold bg-indigo-50 border border-indigo-100/50 text-indigo-600 px-2 py-0.5 rounded-full shrink-0">
                            +{ch.points} Pts
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary mt-1 leading-relaxed">{ch.description}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-text-muted font-mono">
                          <span>Sector Progress</span>
                          <span>{ch.progress}/{ch.target}</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-panel rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${(ch.progress / ch.target) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-text-muted block text-right italic">{ch.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Leaderboard User Table */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Community Leaderboard</h3>
                <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
                  <div className="grid grid-cols-12 bg-bg-panel px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle">
                    <span className="col-span-2">Rank</span>
                    <span className="col-span-4">Volunteer</span>
                    <span className="col-span-2 text-center">Civic Level</span>
                    <span className="col-span-2 text-center">Fyled Fixed</span>
                    <span className="col-span-2 text-right">Points</span>
                  </div>

                  <div className="divide-y divide-border-subtle">
                    {users.sort((a,b) => b.points - a.points).map((usr, idx) => (
                      <div key={usr.username} className="grid grid-cols-12 px-6 py-3.5 text-xs items-center">
                        <div className="col-span-2 flex items-center gap-1 font-bold font-mono">
                          {idx === 0 ? <span className="text-lg">🥇</span> : idx === 1 ? <span className="text-lg">🥈</span> : idx === 2 ? <span className="text-lg">🥉</span> : <span className="text-text-muted pl-1">#{idx + 1}</span>}
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                          <img src={usr.avatar} alt="" className="w-6 h-6 rounded-full border border-border-subtle" />
                          <div>
                            <span className="font-bold text-text-primary block">{usr.fullName}</span>
                            <span className="text-[9px] font-semibold text-text-muted">@{usr.username}</span>
                          </div>
                        </div>
                        <span className="col-span-2 text-center font-bold text-indigo-600 dark:text-indigo-400 font-sans">Level {usr.level}</span>
                        <span className="col-span-2 text-center font-mono text-text-secondary">{usr.completedReports} reports</span>
                        <span className="col-span-2 text-right font-bold text-amber-600 font-mono">{usr.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GOVERNMENT OFFICER COMMAND CENTRE */}
          {activeTab === "officer-dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-text-primary">Municipal Command Centre Dashboard</h2>
                  <p className="text-xs text-text-secondary">View real-time aggregated metrics, predictive AI trends, department workload lists, and optimal dispatch coordinates.</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] bg-indigo-50 dark:bg-indigo-950/20 px-3 py-1 rounded-xl border border-indigo-100/50 text-indigo-600 dark:text-indigo-400 font-extrabold shrink-0">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <span>Tactical Ledger Synchronized</span>
                </div>
              </div>

              {/* Aggregation Widgets Row */}
              {analytics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 shadow-sm transition-colors duration-200">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">Total Incidents</span>
                    <strong className="text-2xl font-bold font-mono text-text-primary">{analytics.totalReports}</strong>
                  </div>
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 shadow-sm transition-colors duration-200">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">Resolved Tickets</span>
                    <strong className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{analytics.resolvedReports}</strong>
                  </div>
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 shadow-sm transition-colors duration-200">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">Verification Rate</span>
                    <strong className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">100%</strong>
                  </div>
                  <div className="bg-bg-card border border-border-subtle p-4 rounded-xl space-y-1 shadow-sm transition-colors duration-200">
                    <span className="text-[10px] text-text-secondary font-bold uppercase block">Mean Resolve Time</span>
                    <strong className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{analytics.averageResolutionTime}</strong>
                  </div>
                </div>
              )}

              {/* BENTO GRID MODULES: AI PREDICTIONS & DEPARTMENTS */}
              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  
                  {/* Card 1: AI Weekly Predictive Forecast */}
                  <div className="bg-bg-card border border-indigo-500/10 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Gemini Predictive Engine</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-text-secondary font-bold block uppercase font-mono">Predicted Next Week Incidents</span>
                      <strong className="text-4xl font-extrabold font-mono text-text-primary">
                        {analytics.incidentPrediction?.nextWeekPredicted || 14}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="bg-bg-panel p-2 rounded-lg border border-border-subtle">
                        <span className="text-text-muted block">Forecast Model</span>
                        <strong className="text-text-primary block mt-0.5">{analytics.incidentPrediction?.trend || "Increasing Trend"}</strong>
                      </div>
                      <div className="bg-bg-panel p-2 rounded-lg border border-border-subtle">
                        <span className="text-text-muted block">Confidence Range</span>
                        <strong className="text-text-primary block mt-0.5">{analytics.incidentPrediction?.confidenceInterval || "92% (11-17 tickets)"}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-text-secondary leading-relaxed bg-indigo-50 dark:bg-indigo-950/10 p-2.5 rounded-lg border border-indigo-500/10">
                      📝 <strong className="text-indigo-600 dark:text-indigo-400">Recommendation:</strong> Mobilize drainage maintenance crews on standby based on projected water-clogging weather forecasts.
                    </p>
                  </div>

                  {/* Card 2: Department Workloads & Capacity Indicator */}
                  <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm space-y-3 lg:col-span-2">
                    <span className="text-xs font-bold text-text-primary block uppercase font-mono">Civic Authority Workloads & Dispatch Efficiency</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {(analytics.departmentEfficiency || [
                        { department: "Department of Water & Sewage", workload: 8, efficiency: 94, resolved: 32 },
                        { department: "Transportation & Highway Works", workload: 14, efficiency: 88, resolved: 54 },
                        { department: "Sanitation & Municipal Cleansing", workload: 5, efficiency: 97, resolved: 41 },
                        { department: "Electricity & Public Lighting Board", workload: 6, efficiency: 91, resolved: 28 }
                      ]).map((dept, idx) => (
                        <div key={idx} className="bg-bg-panel p-3 rounded-xl border border-border-subtle space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-text-primary text-[11px] truncate block max-w-[70%]">{dept.department}</span>
                            <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold font-mono">
                              Eff: {dept.efficiency}%
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary">
                            <span>Active Workload: <strong className="text-rose-600 font-bold">{dept.workload}</strong></span>
                            <span>Resolved: <strong className="text-emerald-600">{dept.resolved}</strong></span>
                          </div>

                          {/* Progress bar to show efficiency */}
                          <div className="w-full h-1 bg-bg-card rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${dept.efficiency}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Recharts Graphical Trends */}
              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Category Donut Representation */}
                  <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm transition-colors duration-200">
                    <h4 className="text-xs font-bold text-text-secondary uppercase mb-4 font-mono">Incident Density by Category</h4>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analytics.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={["#4F46E5", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "12px", color: "var(--text-primary)" }} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Trend lines */}
                  <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl shadow-sm transition-colors duration-200">
                    <h4 className="text-xs font-bold text-text-secondary uppercase mb-4 font-mono">Resolved Incident Volatility</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.monthlyHistory}>
                          <defs>
                            <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
                          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} />
                          <YAxis stroke="var(--text-muted)" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "12px", color: "var(--text-primary)" }} />
                          <Area type="monotone" dataKey="reported" stroke="#4F46E5" fillOpacity={1} fill="url(#colorReported)" name="Reported" />
                          <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

              {/* Administrative Priority Action Queue */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3 font-sans">AI-Prioritized Active Dispatch Queue</h3>
                <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
                  <div className="divide-y divide-border-subtle">
                    {reports.map((rep) => {
                      // Custom dynamic transit routing advice depending on incident category
                      const routingAdvice = 
                        rep.category === "Roads & Potholes" ? "🚧 Avoid main Expressway bottleneck; Route crew via bypass lane [saves 12 mins]" :
                        rep.category === "Water & Drainage" ? "🌊 Use heavy vacuum tanker truck; route through Eastern sector corridor [saves 14 mins]" :
                        rep.category === "Electricity & Lighting" ? "⚡ Boom lift truck required; transit via Link ring road [saves 8 mins]" :
                        "🚛 Dispatch regular civic crew; direct path via High Street [optimal route]";

                      return (
                        <div key={rep.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-text-primary text-sm">{rep.title}</span>
                              <span className="font-mono text-[9px] bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full text-indigo-600 dark:text-indigo-400 font-bold">
                                Priority Score: {rep.priorityScore}/100
                              </span>
                              <span className={`font-mono text-[9px] border px-2 py-0.5 rounded-full font-bold uppercase ${
                                rep.severity === "Critical" ? "bg-rose-50 border-rose-200 text-rose-600" :
                                rep.severity === "High" ? "bg-orange-50 border-orange-200 text-orange-600" :
                                "bg-slate-50 border-slate-200 text-text-secondary"
                              }`}>
                                {rep.severity}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] text-text-secondary font-mono">
                              <span>Department: <strong className="text-text-primary">{rep.aiAnalysis?.assignedAuthority || "Department of Public Works"}</strong></span>
                              <span>Est. Cost: <strong className="text-text-primary">{rep.estimatedCost || "₹25,000"}</strong></span>
                              <span>Est. Time: <strong className="text-text-primary">{rep.estimatedTime || "3 days"}</strong></span>
                            </div>

                            {/* OPTIMIZED ROUTE DISPATCH ADVICE */}
                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">
                              🚀 <strong>Optimized Route Suggestion:</strong> {routingAdvice}
                            </div>
                          </div>

                          {/* Status Dispatch button actions */}
                          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto items-end">
                            <div className="flex items-center gap-2">
                              {rep.status !== "Resolved" ? (
                                <>
                                  <button 
                                    onClick={() => handleUpdateStatus(rep.id, "In Progress")}
                                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                                      rep.status === "In Progress" 
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                                        : "bg-bg-panel border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-app"
                                    }`}
                                  >
                                    {rep.status === "In Progress" ? "Crew Dispatched" : "Dispatch Crew"}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setOfficerRepairTargetId(rep.id);
                                      setOfficerRepairCost(rep.estimatedCost ? rep.estimatedCost.replace(/[^0-9]/g, '') : "25000");
                                      setOfficerRepairTime(rep.estimatedTime || "3 Days");
                                      setOfficerRepairImage("");
                                    }}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/10 rounded-lg text-[11px] font-bold transition shadow-md shadow-emerald-100 cursor-pointer"
                                  >
                                    Mark Resolved
                                  </button>
                                </>
                              ) : (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
                                  <CheckCircle2 className="w-4 h-4" /> Issue Closed
                                </span>
                              )}
                            </div>

                            {officerRepairTargetId === rep.id && (
                              <div className="mt-3 bg-bg-panel border border-indigo-500/20 p-4 rounded-xl space-y-3 w-80 animate-fade-in text-left shadow-lg">
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase block font-mono">
                                  🛡️ Repair Audit Verification Proof Submission
                                </span>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <label className="text-[10px] text-text-secondary block font-bold mb-1">Actual Material & Cost (₹)</label>
                                    <input 
                                      type="text" 
                                      value={officerRepairCost} 
                                      onChange={(e) => setOfficerRepairCost(e.target.value)} 
                                      className="w-full bg-bg-card border border-border-subtle p-2 rounded text-xs focus:outline-none focus:border-indigo-500 text-text-primary" 
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-text-secondary block font-bold mb-1">Actual Duration & Labor</label>
                                    <input 
                                      type="text" 
                                      value={officerRepairTime} 
                                      onChange={(e) => setOfficerRepairTime(e.target.value)} 
                                      className="w-full bg-bg-card border border-border-subtle p-2 rounded text-xs focus:outline-none focus:border-indigo-500 text-text-primary" 
                                    />
                                  </div>
                                </div>
                                <div className="text-xs">
                                  <label className="text-[10px] text-text-secondary block font-bold mb-1">Repair Image Attachment (URL / Proof)</label>
                                  <div className="flex flex-col gap-1.5">
                                    <input 
                                      type="text" 
                                      placeholder="https://images.unsplash.com/photo-..." 
                                      value={officerRepairImage} 
                                      onChange={(e) => setOfficerRepairImage(e.target.value)} 
                                      className="w-full bg-bg-card border border-border-subtle p-2 rounded text-[11px] focus:outline-none focus:border-indigo-500 text-text-primary" 
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => setOfficerRepairImage("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600")}
                                      className="w-full py-1.5 bg-bg-card border border-border-subtle text-[10px] font-mono font-bold rounded hover:bg-bg-panel transition text-text-primary cursor-pointer text-center"
                                    >
                                      ⚡ Auto-attach Completed Patch Image
                                    </button>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => setOfficerRepairTargetId(null)}
                                    className="flex-1 py-2 bg-bg-card border border-border-subtle hover:bg-bg-panel rounded text-xs font-bold transition cursor-pointer text-text-primary"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={async () => {
                                      await handleUpdateStatus(rep.id, "Resolved");
                                      const now = new Date();
                                      const timeStr = now.toTimeString().split(' ')[0];
                                      setAuditLogs(prev => [
                                        {
                                          timestamp: timeStr,
                                          type: "DB" as const,
                                          message: `REPAIR PROOF SUBMITTED for ${rep.id}. Actual cost: ₹${parseInt(officerRepairCost).toLocaleString()}, duration: ${officerRepairTime}. Image proof linked.`
                                        },
                                        ...prev
                                      ]);
                                      setOfficerRepairTargetId(null);
                                    }}
                                    className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition shadow cursor-pointer"
                                  >
                                    Submit & Resolve
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

      {/* DETAILED INCIDENT DRAWER / BOTTOM SHEET OVERLAY */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-xl bg-bg-card border-l border-border-subtle h-full flex flex-col justify-between overflow-hidden relative shadow-2xl transition-colors duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-border-subtle bg-bg-panel/50 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block font-mono">{selectedReport.id}</span>
                <h3 className="font-extrabold text-text-primary text-base leading-snug mt-0.5">{selectedReport.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-text-secondary hover:text-text-primary font-bold text-xs border border-border-subtle px-3.5 py-1.5 rounded-xl bg-bg-panel shadow-sm transition"
              >
                Close
              </button>
            </div>

            {/* Drawer Body - Scrollable specs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {selectedReport.imageUrl && (
                <div className="h-48 w-full rounded-2xl overflow-hidden bg-bg-panel border border-border-subtle shadow-sm">
                  <img src={selectedReport.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* General details */}
              <div className="space-y-2 text-xs">
                <span className="text-text-secondary block font-bold uppercase tracking-wider text-[10px]">Incident Description</span>
                <p className="text-text-primary leading-relaxed bg-bg-panel p-4 rounded-xl border border-border-subtle">{selectedReport.description}</p>
              </div>

              {/* server-side Gemini analytical metrics drawer block */}
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Visual Triage Analysis</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-bg-card p-3 rounded-xl border border-indigo-500/15 shadow-sm">
                    <span className="text-[9px] text-text-muted block uppercase font-bold">Estimated Repair Budget</span>
                    <strong className="text-text-primary mt-1 block">{selectedReport.estimatedCost}</strong>
                  </div>
                  <div className="bg-bg-card p-3 rounded-xl border border-indigo-500/15 shadow-sm">
                    <span className="text-[9px] text-text-muted block uppercase font-bold">Projected Labor Duration</span>
                    <strong className="text-text-primary mt-1 block">{selectedReport.estimatedTime}</strong>
                  </div>
                </div>

                {selectedReport.aiAnalysis && (
                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="bg-bg-card p-3 rounded-xl border border-indigo-500/15 space-y-1 shadow-sm">
                      <span className="text-[9px] text-text-muted block uppercase font-bold">Incident Technical Summary</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed font-sans">{selectedReport.aiAnalysis.summary}</p>
                    </div>

                    <div className="bg-bg-card p-3 rounded-xl border border-indigo-500/15 space-y-2 shadow-sm">
                      <span className="text-[9px] text-text-muted block uppercase font-bold">Spotted Visual Markers</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedReport.aiAnalysis.detectedObjects.map((obj, i) => (
                          <span key={i} className="bg-bg-panel text-text-secondary text-[9px] px-2 py-0.5 rounded-md border border-border-subtle font-bold">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Collaborative Comments Block */}
              <div className="space-y-4">
                <span className="text-xs text-text-secondary block font-bold uppercase tracking-wider text-[10px]">Ecosystem Verification log ({commentsList.length})</span>
                
                <div className="space-y-3">
                  {commentsList.map((comm) => (
                    <div key={comm.id} className="bg-bg-panel border border-border-subtle p-3.5 rounded-xl flex gap-3 text-xs items-start shadow-sm">
                      <img src={comm.avatar} alt="" className="w-6 h-6 rounded-full border border-border-subtle" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-text-primary font-bold">{comm.author}</strong>
                          <span className="text-[9px] font-semibold bg-bg-card text-text-secondary px-1.5 py-0.5 rounded border border-border-subtle">
                            {comm.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{comm.content}</p>
                      </div>
                    </div>
                  ))}
                  {commentsList.length === 0 && (
                    <p className="text-xs text-text-muted italic text-center py-4">No community commits registered yet.</p>
                  )}
                </div>

                {/* Post New Comment form */}
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Provide a verification update or detail..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-bg-panel border border-border-subtle px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-bg-card text-text-primary placeholder:text-text-muted/60 transition"
                  />
                  <button 
                    type="submit" 
                    disabled={commentSubmitting}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center transition shadow-md shadow-indigo-100"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* EXPANDABLE CHATBOT OVERLAY (HEROBOT) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        
        {chatOpen && (
          <div className="w-80 h-96 bg-bg-card border border-border-subtle rounded-2xl flex flex-col justify-between shadow-2xl overflow-hidden mb-3 animate-fade-in transition-colors duration-200">
            <div className="bg-bg-panel p-4 border-b border-border-subtle flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-text-primary">HeroBot Civic Companion</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-xs text-text-muted hover:text-text-secondary font-mono">
                Hide
              </button>
            </div>

            {/* Chat Body messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-panel/30">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`max-w-[85%] text-[11px] p-2.5 rounded-xl leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-indigo-600 text-white ml-auto rounded-tr-none shadow-md shadow-indigo-100" 
                      : "bg-bg-card text-text-primary mr-auto rounded-tl-none border border-border-subtle shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="text-text-muted italic text-[10px] pl-1 font-mono animate-pulse">
                  HeroBot is writing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Send row */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-bg-panel border-t border-border-subtle flex gap-1.5">
              <input 
                type="text" 
                placeholder="Ask about points, rules..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-bg-panel border border-border-subtle px-3 py-1.5 rounded-lg text-[11px] text-text-primary focus:bg-bg-card placeholder:text-text-muted/60 focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit" 
                className="bg-indigo-600 p-2 rounded-lg text-white hover:bg-indigo-500 transition shrink-0 shadow-md shadow-indigo-100"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200 z-50 group shadow-indigo-100"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="text-xs font-bold max-w-0 overflow-hidden group-hover:max-w-24 transition-all duration-300">
            HeroBot
          </span>
        </button>
      </div>


    </div>
  );
}
