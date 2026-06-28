import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Error initializing Gemini API Client:", err);
  }
} else {
  console.log("Gemini API key not configured or using placeholder. Running in robust simulation mode.");
}

const app = express();
app.use(express.json({ limit: "15mb" })); // Support large base64 image uploads

// -----------------------------------------------------
// Mock Database / In-Memory Store
// -----------------------------------------------------

interface Comment {
  id: string;
  reportId: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  createdAt: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  category: "Roads & Potholes" | "Water & Drainage" | "Sanitation & Trash" | "Electricity & Lighting" | "Safety & Others";
  status: "Reported" | "Validated" | "In Progress" | "Resolved";
  severity: "Low" | "Medium" | "High" | "Critical";
  priorityScore: number; // 0-100 calculated by AI
  estimatedCost: string;
  estimatedTime: string;
  locationName: string;
  latitude: number;
  longitude: number;
  reporterName: string;
  reporterAvatar: string;
  imageUrl?: string;
  votesCount: number;
  votedUsers: string[]; // usernames of voters
  createdAt: string;
  resolvedAt?: string;
  aiAnalysis?: {
    summary: string;
    ocrText?: string;
    detectedObjects: string[];
    isDuplicate: boolean;
    assignedAuthority: string;
    confidence?: number;
    safetyRisk?: string;
    duplicateIssueId?: string | null;
  };
}

interface User {
  username: string;
  fullName: string;
  avatar: string;
  role: "Citizen" | "Volunteer" | "Officer" | "Admin";
  points: number;
  level: number;
  completedReports: number;
  streak: number;
  badges: Array<{ id: string; name: string; icon: string; description: string; unlockedAt: string }>;
}

// Seed Initial Data
let reports: Report[] = [
  {
    id: "rep-1",
    title: "Major road pothole causing traffic",
    description: "Huge pothole at the center of the intersection near Oak Lane. Multiple vehicles have damaged their tires trying to dodge it. It's about 1.5 meters wide and 15 cm deep.",
    category: "Roads & Potholes",
    status: "In Progress",
    severity: "High",
    priorityScore: 84,
    estimatedCost: "$350 - $500",
    estimatedTime: "2 days",
    locationName: "Intersection of Oak Lane and 5th Ave",
    latitude: 37.774929,
    longitude: -122.419416,
    reporterName: "Marcus Vance",
    reporterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600",
    votesCount: 34,
    votedUsers: ["user1", "user2"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    aiAnalysis: {
      summary: "Severe crater-like pothole located on a highly active primary road intersection, creating direct mechanical and accident hazard.",
      detectedObjects: ["Asphalt fissure", "Deep crater", "Exposed aggregate"],
      isDuplicate: false,
      assignedAuthority: "Department of Transportation (DOT)"
    }
  },
  {
    id: "rep-2",
    title: "Burst water main and minor flooding",
    description: "Water is continuously gushing from the sidewalk under the fire hydrant. The street is starting to flood and water is accumulating in the nearby driveways.",
    category: "Water & Drainage",
    status: "Validated",
    severity: "Critical",
    priorityScore: 92,
    estimatedCost: "$1,200 - $1,800",
    estimatedTime: "12 hours",
    locationName: "Outside 742 Evergreen Terrace",
    latitude: 37.7833,
    longitude: -122.4167,
    reporterName: "Sarah Chen",
    reporterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600",
    votesCount: 56,
    votedUsers: ["user1", "user3"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    aiAnalysis: {
      summary: "Active high-pressure water main rupture. Significant clean water loss and developing flash flooding risk for adjacent residential basements.",
      detectedObjects: ["Water plume", "Submerged concrete", "Hydrant valve"],
      isDuplicate: false,
      assignedAuthority: "Municipal Water and Sewer Authority"
    }
  },
  {
    id: "rep-3",
    title: "Broken streetlight makes alley pitch black",
    description: "The streetlight lamp post #84B is completely broken and flickering. The narrow alley connects the main bus stand to the residential sector, making it very unsafe for women and children at night.",
    category: "Electricity & Lighting",
    status: "Reported",
    severity: "Medium",
    priorityScore: 65,
    estimatedCost: "$150 - $220",
    estimatedTime: "3 days",
    locationName: "Alleyway behind Sector 4 Bus Stop",
    latitude: 37.7699,
    longitude: -122.4468,
    reporterName: "David Kim",
    reporterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600",
    votesCount: 12,
    votedUsers: ["user2"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    aiAnalysis: {
      summary: "Non-functional street luminaire in high-transit pedestrian alley. Elevated public security risk due to zero ambient illumination.",
      detectedObjects: ["Broken light bulb", "Dark spot", "Pedestrian route"],
      isDuplicate: false,
      assignedAuthority: "Public Works - Electrical Division"
    }
  },
  {
    id: "rep-4",
    title: "Illegal commercial waste dumping",
    description: "A truck dumped several commercial plastic drums, chemical containers, and broken furniture directly into the community park woodland edge last night.",
    category: "Sanitation & Trash",
    status: "Resolved",
    severity: "High",
    priorityScore: 78,
    estimatedCost: "$450 - $600",
    estimatedTime: "1 day",
    locationName: "North Entrance, Whispering Pines Park",
    latitude: 37.7599,
    longitude: -122.4368,
    reporterName: "Elena Rostova",
    reporterAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600",
    votesCount: 42,
    votedUsers: ["user1", "user2", "user3", "user4"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    aiAnalysis: {
      summary: "Commercial industrial refuse discarded in public park greenway. Potential soil and surface runoff contamination threat.",
      detectedObjects: ["Plastic drums", "Discarded timber", "Chemical barrels"],
      isDuplicate: false,
      assignedAuthority: "Environmental Protection & Waste Management"
    }
  }
];

let comments: Comment[] = [
  {
    id: "comm-1",
    reportId: "rep-1",
    author: "Chief Engineer Miller",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    role: "Officer",
    content: "DOT maintenance crew is dispatched. We have scheduled an asphalt patch treatment for tomorrow morning at 9:00 AM. Traffic control will divert vehicles locally.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comm-2",
    reportId: "rep-1",
    author: "Volunteer Jacob",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100",
    role: "Volunteer",
    content: "I put a temporary neon traffic cone next to the pothole this evening to help drivers spot it in the dark. Please drive slow!",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comm-3",
    reportId: "rep-2",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    role: "Citizen",
    content: "Confirmed water flow has increased in the last 2 hours. This is highly critical, please shut off the main valve immediately!",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  }
];

let users: User[] = [
  {
    username: "you_hero",
    fullName: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    role: "Citizen",
    points: 1250,
    level: 4,
    completedReports: 8,
    streak: 5,
    badges: [
      { id: "badge-1", name: "Eagle Eye", icon: "👁️", description: "Reported 5 validated community issues", unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "badge-2", name: "First Responder", icon: "🚨", description: "Reported an issue that was fixed within 24 hours", unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    username: "marcus_v",
    fullName: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    role: "Volunteer",
    points: 3420,
    level: 7,
    completedReports: 23,
    streak: 12,
    badges: [
      { id: "badge-1", name: "Eagle Eye", icon: "👁️", description: "Reported 5 validated community issues", unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "badge-3", name: "Civic Pillar", icon: "🏛️", description: "Acquired over 3,000 contribution points", unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "badge-4", name: "Vanguard", icon: "🛡️", description: "Successfully verified 20 pending complaints", unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    username: "sarah_c",
    fullName: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    role: "Volunteer",
    points: 2150,
    level: 5,
    completedReports: 14,
    streak: 7,
    badges: [
      { id: "badge-1", name: "Eagle Eye", icon: "👁️", description: "Reported 5 validated community issues", unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "badge-5", name: "Hydra Solver", icon: "💧", description: "Reported 3 major sewage/drainage alerts", unlockedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    username: "david_k",
    fullName: "David Kim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    role: "Citizen",
    points: 450,
    level: 2,
    completedReports: 3,
    streak: 2,
    badges: [
      { id: "badge-6", name: "New Recruit", icon: "🌱", description: "Registered and filed first community issue", unlockedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

// Weekly Challenges Seeding
const challenges = [
  { id: "ch-1", title: "Drainage Clear-up Vanguard", description: "Report or verify 3 clogged gutters or storm water drains before the seasonal rains.", points: 300, progress: 1, target: 3, deadline: "3 days left" },
  { id: "ch-2", title: "Pothole Patrol", description: "Help map 5 potholes in your residential sector to assist local road repair crews.", points: 250, progress: 4, target: 5, deadline: "5 days left" },
  { id: "ch-3", title: "Midnight Spark", description: "Report or update dark corners with missing or faulty electric lighting infrastructure.", points: 400, progress: 0, target: 2, deadline: "6 days left" }
];

// -----------------------------------------------------
// API ENDPOINTS
// -----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// GET /api/reports
app.get("/api/reports", (req, res) => {
  res.json(reports);
});

// POST /api/reports/analyze - Advanced Gemini Vision / Text Multi-Criteria Triage & Duplicate Checker
app.post("/api/reports/analyze", async (req, res) => {
  const { title, description, category, latitude, longitude, imageBase64, trafficImpact, populationDensity, nearSensitiveSite } = req.body;

  if (!description || !imageBase64) {
    return res.status(400).json({ error: "Description and Image are required for AI analysis." });
  }

  // Set default values
  let aiResponse = {
    category: category || "Roads & Potholes",
    severity: "Medium" as "Low" | "Medium" | "High" | "Critical",
    confidence: 85,
    estimatedCostRupees: 45000,
    estimatedTime: "3 days",
    assignedAuthority: "Municipal Administration",
    safetyRisk: "No immediate structural threat identified.",
    summary: "New report received. Processing visual indicators.",
    detectedObjects: ["Physical Damage"],
    priorityScore: 50,
    priorityExplanation: "Based on standard report parameters.",
    duplicateCheck: {
      isDuplicate: false,
      duplicateIssueId: null as string | null,
      similarity: "0%",
      message: ""
    }
  };

  // Perform Duplicate Check in existing reports (even if running in simulation)
  const isDuplicateSim = reports.find(r => {
    if (category && r.category !== category) return false;
    // Proximity check (approx ~250m)
    const latDiff = Math.abs(r.latitude - (latitude || 37.7749));
    const lngDiff = Math.abs(r.longitude - (longitude || -122.4194));
    return latDiff < 0.002 && lngDiff < 0.002;
  });

  if (isDuplicateSim) {
    aiResponse.duplicateCheck = {
      isDuplicate: true,
      duplicateIssueId: isDuplicateSim.id,
      similarity: "95%",
      message: `Duplicate detected: This issue is matching "${isDuplicateSim.title}" which has already been submitted in this immediate vicinity.`
    };
  }

  if (ai) {
    try {
      console.log("Analyzing image via real Gemini API...");
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `
        You are an expert Smart City Infrastructure AI inspector.
        Analyze the attached image and textual metadata for a civic issue report.
        
        Metadata:
        - Title: "${title || ""}"
        - Citizen Description: "${description}"
        - Claimed Category: "${category || ""}"
        - Coordinates: ${latitude || "unknown"}, ${longitude || "unknown"}
        - Traffic Impact Factor: "${trafficImpact || "Medium"}"
        - Population Density Factor: "${populationDensity || "Medium"}"
        - Near Sensitive Facilities (schools/hospitals): "${nearSensitiveSite ? "Yes" : "No"}"

        Your tasks:
        1. Classify the issue into one of these strict categories:
           "Roads & Potholes" | "Water & Drainage" | "Sanitation & Trash" | "Electricity & Lighting" | "Safety & Others"
        2. Assign severity level: "Low" | "Medium" | "High" | "Critical"
        3. Give a confidence score (percentage 0-100) on your vision analysis.
        4. Estimate repair budget in Indian Rupees (₹) as a raw number. Keep it realistic for municipal budgets.
        5. Estimate repair duration (e.g., "12 hours", "3 days").
        6. Nominate the appropriate government department to assign the repair.
        7. Evaluate safety risks (e.g., electrocution, traffic collision, toxic inhalation, water contamination).
        8. Synthesize a concise 1-2 sentence professional technical summary of the visual damage.
        9. Identify 3-4 visual markers seen in the image.
        10. Calculate a municipal Priority Score (1-100) using this formula:
            - Start with Base Severity: Critical=50, High=40, Medium=25, Low=10
            - Add +20 if near schools/hospitals (sensitive facilities)
            - Add +15 if traffic impact is High, +5 if Medium
            - Add +15 if population density is High, +5 if Medium
            - Cap the score between 1 and 100.
            Provide a 1-sentence logical justification for the priority score.
        11. Compare against existing database reports:
            ${JSON.stringify(reports.map(r => ({ id: r.id, title: r.title, description: r.description, category: r.category, lat: r.latitude, lng: r.longitude })))}
            Flag duplicates if this new report represents the same physical issue as any of the existing ones. (i.e. same category and located within 0.002 degrees latitude/longitude difference, or describing the exact same event).

        Respond ONLY with a valid JSON object matching this schema:
        {
          "category": "Roads & Potholes" | "Water & Drainage" | "Sanitation & Trash" | "Electricity & Lighting" | "Safety & Others",
          "severity": "Low" | "Medium" | "High" | "Critical",
          "confidence": number,
          "estimatedCostRupees": number,
          "estimatedTime": "string",
          "assignedAuthority": "string",
          "safetyRisk": "string",
          "summary": "string",
          "detectedObjects": ["string"],
          "priorityScore": number,
          "priorityExplanation": "string",
          "duplicateCheck": {
            "isDuplicate": boolean,
            "duplicateIssueId": "string" or null,
            "similarity": "string",
            "message": "string"
          }
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          { text: prompt }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text.trim());
      if (parsed) {
        aiResponse = { ...aiResponse, ...parsed };
      }
    } catch (err) {
      console.error("Gemini Vision analysis failed. Falling back to robust simulation.", err);
    }
  }

  // Fallback simulator to ensure it runs out of the box with highly realistic values
  if (!ai || aiResponse.summary === "New report received. Processing visual indicators.") {
    console.log("Running local high-fidelity simulation engine...");
    const descLower = description.toLowerCase();
    
    let finalCategory = category || "Roads & Potholes";
    let finalSeverity: "Low" | "Medium" | "High" | "Critical" = "Medium";
    let finalCost = 15000;
    let finalTime = "3 days";
    let finalAuthority = "Department of Public Works";
    let finalRisk = "No immediate danger, but warrants monitoring to prevent further degradation.";
    let finalSummary = "Local visual assessment indicates standard public right-of-way infrastructure failure.";
    let finalObjects = ["Surface abrasion"];

    if (descLower.includes("leak") || descLower.includes("water") || descLower.includes("drain") || descLower.includes("flood")) {
      finalCategory = "Water & Drainage";
      finalSeverity = descLower.includes("flood") || descLower.includes("burst") ? "Critical" : "High";
      finalCost = finalSeverity === "Critical" ? 120000 : 35000;
      finalTime = finalSeverity === "Critical" ? "8 hours" : "1.5 days";
      finalAuthority = "Municipal Water and Sewer Authority";
      finalRisk = finalSeverity === "Critical" 
        ? "Potential basement flooding in surrounding residences, soil washouts, and clean water wastage." 
        : "Minor moisture damage to surrounding pathways and aggregate leaching.";
      finalSummary = "Localized liquid flow breakout observed. Pressure main failure suspected requiring sub-grade utility repair.";
      finalObjects = ["Active water plume", "Soil erosion", "Emanating pooling"];
    } else if (descLower.includes("pothole") || descLower.includes("road") || descLower.includes("street") || descLower.includes("crack")) {
      finalCategory = "Roads & Potholes";
      finalSeverity = descLower.includes("crater") || descLower.includes("huge") || descLower.includes("major") ? "High" : "Medium";
      finalCost = finalSeverity === "High" ? 45000 : 18000;
      finalTime = "2 days";
      finalAuthority = "Department of Transportation (DOT)";
      finalRisk = "High risk of vehicle tire blowouts, vehicular alignment damage, and motorcycle stability threats.";
      finalSummary = "Severe structural delamination of the top asphalt course with aggregate scattering and sub-base exposure.";
      finalObjects = ["Asphalt spalling", "Exposed roadbed course", "Sub-base cavity"];
    } else if (descLower.includes("light") || descLower.includes("dark") || descLower.includes("wire") || descLower.includes("electric") || descLower.includes("bulb")) {
      finalCategory = "Electricity & Lighting";
      finalSeverity = descLower.includes("wire") || descLower.includes("shock") ? "Critical" : "Medium";
      finalCost = finalSeverity === "Critical" ? 85000 : 12000;
      finalTime = finalSeverity === "Critical" ? "12 hours" : "3 days";
      finalAuthority = "Public Works - Electrical Division";
      finalRisk = finalSeverity === "Critical" 
        ? "Imminent electrocution hazard due to exposed high-voltage wiring and severe grounding failure." 
        : "Elevated anti-social activity risk and pedestrian navigation accidents under zero illumination conditions.";
      finalSummary = "Electrical circuit interruption or luminaire structural failure leading to dark blind spots in public paths.";
      finalObjects = ["Flickering high-pressure ballast", "Exposed core copper wires", "Broken glass casing"];
    } else if (descLower.includes("garbage") || descLower.includes("trash") || descLower.includes("dump") || descLower.includes("waste")) {
      finalCategory = "Sanitation & Trash";
      finalSeverity = descLower.includes("chemical") || descLower.includes("toxic") ? "High" : "Medium";
      finalCost = 22000;
      finalTime = "24 hours";
      finalAuthority = "Environmental Protection & Waste Management";
      finalRisk = "Attraction of disease vectors (rodents, stray animals), bad odors, and toxic rain runoffs.";
      finalSummary = "Unregulated accumulation of solid/commercial refuse on public greenways creating immediate sanitation hazards.";
      finalObjects = ["Heavy refuse bags", "Emanating sludge", "Unlawful commercial dump bins"];
    }

    let priorityVal = finalSeverity === "Critical" ? 55 : finalSeverity === "High" ? 42 : finalSeverity === "Medium" ? 25 : 12;
    if (nearSensitiveSite) priorityVal += 20;
    if (trafficImpact === "High") priorityVal += 15;
    else if (trafficImpact === "Medium") priorityVal += 5;
    if (populationDensity === "High") priorityVal += 15;
    else if (populationDensity === "Medium") priorityVal += 5;

    priorityVal = Math.max(1, Math.min(100, priorityVal));
    let expl = `Determined a priority rating of ${priorityVal}/100. Severity evaluated as ${finalSeverity}. Adjusted for ${trafficImpact} traffic impact, ${populationDensity} population density, and ${nearSensitiveSite ? "sensitive facilities proximity" : "standard zoning"}.`;

    aiResponse.category = finalCategory;
    aiResponse.severity = finalSeverity;
    aiResponse.confidence = Math.floor(Math.random() * 10) + 85;
    aiResponse.estimatedCostRupees = finalCost;
    aiResponse.estimatedTime = finalTime;
    aiResponse.assignedAuthority = finalAuthority;
    aiResponse.safetyRisk = finalRisk;
    aiResponse.summary = finalSummary;
    aiResponse.detectedObjects = finalObjects;
    aiResponse.priorityScore = priorityVal;
    aiResponse.priorityExplanation = expl;
  }

  res.json(aiResponse);
});

// POST /api/ai-extract-voice - Extract Form Parameters from Verbal Speech input
app.post("/api/ai-extract-voice", async (req, res) => {
  const { speechText } = req.body;

  if (!speechText) {
    return res.status(400).json({ error: "Speech text is required for extraction." });
  }

  let extracted = {
    title: "Broken municipal infrastructure",
    description: speechText,
    category: "Roads & Potholes",
    locationName: "Nearby landmark",
    severity: "Medium"
  };

  if (ai) {
    try {
      console.log(`Extracting parameters from speech: "${speechText}"`);
      const prompt = `
        You are a smart city dispatch center agent. A citizen has reported a civic infrastructure issue verbally.
        Here is the transcribed text of what they said:
        "${speechText}"

        Your task is to extract structural parameters to populate a reporting form.
        Choose the most appropriate Category from:
        "Roads & Potholes" | "Water & Drainage" | "Sanitation & Trash" | "Electricity & Lighting" | "Safety & Others"

        Assign a logical Severity: "Low" | "Medium" | "High" | "Critical"

        Respond ONLY with a valid JSON object matching this schema:
        {
          "title": "A short, professional title, e.g. Clogged drain causing street flood",
          "description": "A refined, readable description of the problem",
          "category": "Roads & Potholes" | "Water & Drainage" | "Sanitation & Trash" | "Electricity & Lighting" | "Safety & Others",
          "locationName": "The landmark or location mentioned, or empty string",
          "severity": "Low" | "Medium" | "High" | "Critical"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text.trim());
      if (parsed) {
        extracted = { ...extracted, ...parsed };
      }
    } catch (err) {
      console.error("Gemini speech extraction failed. Reverting to local fallback.", err);
    }
  }

  // Local fallback heuristics if Gemini failed or is null
  if (!ai || extracted.title === "Broken municipal infrastructure") {
    const textLower = speechText.toLowerCase();
    let cat = "Roads & Potholes";
    let sev = "Medium";
    let loc = "";

    if (textLower.includes("water") || textLower.includes("leak") || textLower.includes("drain") || textLower.includes("pipe") || textLower.includes("flood")) {
      cat = "Water & Drainage";
      sev = textLower.includes("flood") || textLower.includes("gush") || textLower.includes("burst") ? "Critical" : "High";
    } else if (textLower.includes("light") || textLower.includes("streetlight") || textLower.includes("dark") || textLower.includes("wire")) {
      cat = "Electricity & Lighting";
      sev = textLower.includes("wire") || textLower.includes("shock") ? "Critical" : "Medium";
    } else if (textLower.includes("garbage") || textLower.includes("trash") || textLower.includes("dump") || textLower.includes("refuse")) {
      cat = "Sanitation & Trash";
      sev = "Medium";
    }

    const nearMatch = speechText.match(/near\s+([A-Za-z0-9\s]+?)(?=\s+|$|\.)/i);
    const atMatch = speechText.match(/at\s+([A-Za-z0-9\s]+?)(?=\s+|$|\.)/i);
    const onMatch = speechText.match(/on\s+([A-Za-z0-9\s]+?)(?=\s+|$|\.)/i);

    if (nearMatch) loc = "Near " + nearMatch[1].trim();
    else if (atMatch) loc = "At " + atMatch[1].trim();
    else if (onMatch) loc = "On " + onMatch[1].trim();
    else loc = "Identified via verbal cue";

    extracted = {
      title: speechText.length > 50 ? speechText.substring(0, 47) + "..." : speechText,
      description: speechText,
      category: cat as any,
      locationName: loc,
      severity: sev as any
    };
  }

  res.json(extracted);
});

// POST /api/reports - Add New Issue (supporting two-stage AI review)
app.post("/api/reports", async (req, res) => {
  const { 
    title, 
    description, 
    category, 
    latitude, 
    longitude, 
    locationName, 
    imageBase64, 
    reporterName, 
    reporterAvatar,
    severity,
    priorityScore,
    estimatedCost,
    estimatedTime,
    detectedObjects,
    summary,
    assignedAuthority,
    safetyRisk,
    isDuplicate,
    duplicateIssueId,
    confidence
  } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: "Title, description, and category are required." });
  }

  const reportId = `rep-${Date.now()}`;
  
  const finalSeverity = severity || "Medium";
  const finalPriorityScore = priorityScore !== undefined ? Number(priorityScore) : 55;
  const finalEstimatedCost = estimatedCost || "$300 - $600";
  const finalEstimatedTime = estimatedTime || "3 days";
  const finalDetectedObjects = detectedObjects || ["Visual structural anomalies"];
  const finalSummary = summary || "Citizen reported infrastructure damage requiring inspection.";
  const finalAssignedAuthority = assignedAuthority || "Public Works Department";
  const imageUrl = imageBase64 ? imageBase64 : "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600";

  const newReport: Report = {
    id: reportId,
    title,
    description,
    category,
    status: "Reported",
    severity: finalSeverity,
    priorityScore: finalPriorityScore,
    estimatedCost: finalEstimatedCost,
    estimatedTime: finalEstimatedTime,
    locationName: locationName || "Determining coordinates...",
    latitude: latitude || 37.774929 + (Math.random() - 0.5) * 0.02,
    longitude: longitude || -122.419416 + (Math.random() - 0.5) * 0.02,
    reporterName: reporterName || "Alex Rivera",
    reporterAvatar: reporterAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    imageUrl,
    votesCount: 1,
    votedUsers: [reporterName || "you_hero"],
    createdAt: new Date().toISOString(),
    aiAnalysis: {
      summary: finalSummary,
      detectedObjects: finalDetectedObjects,
      isDuplicate: isDuplicate || false,
      assignedAuthority: finalAssignedAuthority,
      confidence: confidence || 85,
      safetyRisk: safetyRisk || "Verify local zoning and physical parameters during triage.",
      duplicateIssueId: duplicateIssueId || null,
    }
  };

  reports.unshift(newReport);

  // Award points to the user who reported
  const user = users.find(u => u.username === "you_hero");
  if (user) {
    user.points += 150; // 100 points for reporting, 50 points for uploading photo
    user.completedReports += 1;
    user.streak += 1;
    // Unlock a badge if points threshold met
    if (user.points >= 1400 && !user.badges.some(b => b.id === "badge-3")) {
      user.badges.push({
        id: "badge-3",
        name: "Civic Pillar",
        icon: "🏛️",
        description: "Acquired over 1,400 contribution points",
        unlockedAt: new Date().toISOString()
      });
    }
  }

  res.status(201).json(newReport);
});

// POST /api/reports/:id/vote - Upvote issue for community verification
app.post("/api/reports/:id/vote", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  const report = reports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: "Report not found." });
  }

  const voterIndex = report.votedUsers.indexOf(username);
  let voted = false;

  if (voterIndex > -1) {
    // Remove vote
    report.votedUsers.splice(voterIndex, 1);
    report.votesCount = Math.max(0, report.votesCount - 1);
    voted = false;
  } else {
    // Add vote
    report.votedUsers.push(username);
    report.votesCount += 1;
    voted = true;

    // Award minor contribution points
    const user = users.find(u => u.username === "you_hero");
    if (user) {
      user.points += 15; // 15 points for validating
    }

    // Auto-escalate to Validated if votes exceed a threshold (e.g. 3 votes)
    if (report.votesCount >= 3 && report.status === "Reported") {
      report.status = "Validated";
    }
  }

  res.json({ votesCount: report.votesCount, voted, status: report.status });
});

// POST /api/reports/:id/comment - Collaborate / verify issue
app.post("/api/reports/:id/comment", (req, res) => {
  const { id } = req.params;
  const { author, avatar, role, content } = req.body;

  if (!content || !author) {
    return res.status(400).json({ error: "Author and content are required." });
  }

  const report = reports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: "Report not found." });
  }

  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    reportId: id,
    author,
    avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    role: role || "Citizen",
    content,
    createdAt: new Date().toISOString()
  };

  comments.push(newComment);

  // Award minor points for community collaboration
  const user = users.find(u => u.username === "you_hero");
  if (user) {
    user.points += 20;
  }

  res.status(201).json(newComment);
});

// GET /api/reports/:id/comments
app.get("/api/reports/:id/comments", (req, res) => {
  const { id } = req.params;
  const reportComments = comments.filter(c => c.reportId === id);
  res.json(reportComments);
});

// PUT /api/reports/:id/status - Update Status (Officer/Admin role simulated)
app.put("/api/reports/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, resolvedAt } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  const report = reports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: "Report not found." });
  }

  report.status = status;
  if (status === "Resolved") {
    report.resolvedAt = resolvedAt || new Date().toISOString();
  } else {
    report.resolvedAt = undefined;
  }

  res.json(report);
});

// GET /api/leaderboard - Top volunteers
app.get("/api/users", (req, res) => {
  res.json(users);
});

// GET /api/challenges
app.get("/api/challenges", (req, res) => {
  res.json(challenges);
});

// GET /api/analytics
app.get("/api/analytics", (req, res) => {
  // Aggregate report data dynamically for Recharts charts
  const categoryCounts = reports.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = reports.reduce((acc: Record<string, number>, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  // Most affected locations: list locations with highest report count
  const locationCounts = reports.reduce((acc: Record<string, number>, curr) => {
    if (curr.locationName) {
      acc[curr.locationName] = (acc[curr.locationName] || 0) + 1;
    }
    return acc;
  }, {});
  const affectedLocations = Object.entries(locationCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const monthlyHistory = [
    { month: "Jan", reported: 24, resolved: 18 },
    { month: "Feb", reported: 32, resolved: 22 },
    { month: "Mar", reported: 28, resolved: 26 },
    { month: "Apr", reported: 45, resolved: 31 },
    { month: "May", reported: 38, resolved: 35 },
    { month: "Jun", reported: reports.length + 42, resolved: 41 }
  ];

  // Calculate severity metrics
  const severityCounts = reports.reduce((acc: Record<string, number>, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});

  // Department efficiency metrics
  const departmentEfficiency = [
    { department: "Transportation (DOT)", efficiency: 88, workload: reports.filter(r => r.category === "Roads & Potholes" && r.status !== "Resolved").length, resolved: 14 },
    { department: "Water & Sewer Authority", efficiency: 94, workload: reports.filter(r => r.category === "Water & Drainage" && r.status !== "Resolved").length, resolved: 12 },
    { department: "Sanitation & Waste", efficiency: 82, workload: reports.filter(r => r.category === "Sanitation & Trash" && r.status !== "Resolved").length, resolved: 19 },
    { department: "Public Works (Electrical)", efficiency: 91, workload: reports.filter(r => r.category === "Electricity & Lighting" && r.status !== "Resolved").length, resolved: 8 },
    { department: "Safety & Public Space", efficiency: 85, workload: reports.filter(r => r.category === "Safety & Others" && r.status !== "Resolved").length, resolved: 5 }
  ];

  // AI-powered linear progression predictive formula for next week's reports
  const predictionCount = Math.round(reports.length * 1.15 + 3);

  res.json({
    categoryData: Object.entries(categoryCounts).map(([name, value]) => ({ name, value })),
    statusData: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
    monthlyHistory,
    severityData: Object.entries(severityCounts).map(([name, value]) => ({ name, value })),
    affectedLocations,
    departmentEfficiency,
    incidentPrediction: {
      nextWeekPredicted: predictionCount,
      confidenceInterval: "89%",
      trend: "Increasing due to seasonal monsoons/precipitation"
    },
    totalReports: reports.length,
    resolvedReports: reports.filter(r => r.status === "Resolved").length,
    activeVolunteers: users.length,
    averageResolutionTime: "31 hours"
  });
});

// POST /api/ai-chat - Help desk assistant endpoint using Gemini
app.post("/api/ai-chat", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  let aiReply = "";

  if (ai) {
    try {
      console.log(`Sending user chat to Gemini: "${message}"`);
      const systemPrompt = `
        You are 'HeroBot', the core AI community assistant for 'Community Hero' – a hyperlocal platform for reporting and resolving infrastructure and civic problems.
        You speak in a friendly, encouraging, and highly professional tone. You represent the smart city administration and civic volunteer groups.
        
        Answer questions about:
        1. How to report community issues (potholes, leakages, dark streetlights, waste).
        2. How the AI-powered severity prioritization engine calculates severity and repair costs.
        3. The community verification flow (requires 3 citizen upvotes/validations to auto-promote issues to authority queues).
        4. The gamification mechanics (Eagle Eye badge, Civic Pillar tier, weekly challenges, point values: 100 for filing reports, 50 for pictures, 15 for validating, 20 for comments).
        5. Roles: Citizen (reporters), Volunteer (auditors/verifiers), Government Officers (contractors/engineers), and Admins.
        
        Keep answers helpful, clear, and under 150 words. Do not use Markdown headings. Do not output JSON. Just output natural, supportive chat speech.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: systemPrompt },
          ...(chatHistory || []).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
          })),
          { text: message }
        ]
      });

      aiReply = response.text || "I apologize, but I couldn't process that query. Please ask me about community reporting or verification guidelines!";
    } catch (err) {
      console.error("Gemini chatbot call failed, using fallback:", err);
      aiReply = "I am currently running in local offline support mode. To file an issue, navigate to the 'Report Issue' tab, describe your problem, and upload an image if possible. Our AI model will automatically analyze it and dispatch the appropriate local department (such as DOT or Water Board).";
    }
  } else {
    // High-fidelity fallback simulated conversational assistant
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("how") && lowerMessage.includes("report")) {
      aiReply = "Reporting is extremely simple! Go to the 'Report Issue' tab, fill in the Title and Description, select a Category, click the map to place a pin, upload a photo, and hit submit. Our built-in Gemini Vision model will analyze the image to estimate repair severity, priority, and assign it to the responsible public authority.";
    } else if (lowerMessage.includes("point") || lowerMessage.includes("reward") || lowerMessage.includes("badge") || lowerMessage.includes("level")) {
      aiReply = "We reward civic contributions! You earn 100 points for reporting an issue, +50 points for attaching a photo, 15 points for validating other reports, and 20 points for helpful comments. Points unlock titles, badges (like 'Eagle Eye' or 'Hydra Solver'), and ranks on the community leaderboard!";
    } else if (lowerMessage.includes("verify") || lowerMessage.includes("validate") || lowerMessage.includes("vote")) {
      aiReply = "To prevent spam and false reporting, we use crowdsourced community validation. When a citizen reports an issue, volunteers and other citizens review it. Once an issue receives 3 validations (upvotes) from different users, its status automatically upgrades to 'Validated' and triggers an alert directly to the designated department's dashboard.";
    } else if (lowerMessage.includes("officer") || lowerMessage.includes("authority") || lowerMessage.includes("government")) {
      aiReply = "Government Officers have specialized access to our platform. They log in to a unified Dashboard to view AI-prioritized issue queues sorted by severity and density, update progress states (e.g., changing from 'Validated' to 'In Progress' or 'Resolved'), allocate budgets, and coordinate field contractors.";
    } else {
      aiReply = "Hello! I'm HeroBot, your civic companion. I can help explain our AI damage estimation, community validation rules, points/badge reward tiers, or how government contractors utilize the prioritizing dashboards. What can I clarify for you today?";
    }
  }

  res.json({ reply: aiReply });
});

// -----------------------------------------------------
// VITE AND STATIC CLIENT SERVING
// -----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
