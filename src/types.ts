export interface Comment {
  id: string;
  reportId: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: "Roads & Potholes" | "Water & Drainage" | "Sanitation & Trash" | "Electricity & Lighting" | "Safety & Others";
  status: "Reported" | "Validated" | "In Progress" | "Resolved";
  severity: "Low" | "Medium" | "High" | "Critical";
  priorityScore: number;
  estimatedCost: string;
  estimatedTime: string;
  locationName: string;
  latitude: number;
  longitude: number;
  reporterName: string;
  reporterAvatar: string;
  imageUrl?: string;
  votesCount: number;
  votedUsers: string[];
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

export interface User {
  username: string;
  fullName: string;
  avatar: string;
  role: "Citizen" | "Volunteer" | "Officer" | "Admin";
  points: number;
  level: number;
  completedReports: number;
  streak: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt: string;
  }>;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  deadline: string;
}

export interface AnalyticsData {
  categoryData: Array<{ name: string; value: number }>;
  statusData: Array<{ name: string; value: number }>;
  monthlyHistory: Array<{ month: string; reported: number; resolved: number }>;
  severityData: Array<{ name: string; value: number }>;
  affectedLocations?: Array<{ name: string; count: number }>;
  departmentEfficiency?: Array<{ department: string; efficiency: number; workload: number; resolved: number }>;
  incidentPrediction?: {
    nextWeekPredicted: number;
    confidenceInterval: string;
    trend: string;
  };
  totalReports: number;
  resolvedReports: number;
  activeVolunteers: number;
  averageResolutionTime: string;
}
