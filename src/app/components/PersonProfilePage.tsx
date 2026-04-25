import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft, GraduationCap, CheckCircle, Clock, AlertTriangle,
  FileText, Download, Upload, ExternalLink, Plus, Activity,
  Mail, Phone, RefreshCw, Award, Building2, Shield,
  Play, ChevronDown, ChevronRight, Search, BookOpen,
  User, Layers, LogIn, Settings
} from "lucide-react";

const PRIMARY    = "#5C4EE5";
const PAGE_BG    = "#F2EDE6";
const CARD_BG    = "#FFFCF7";
const BORDER     = "#EDE5DA";
const BORDER2    = "#E3D8CC";
const TEXT_DARK  = "#2D1F12";
const TEXT_MID   = "#3D3028";
const TEXT_MUTED = "#9CA3AF";
const GREEN_BG   = "#ECFDF5"; const GREEN_TXT  = "#059669";
const AMBER_BG   = "#FFFBEB"; const AMBER_TXT  = "#D97706";
const RED_BG     = "#FEF2F2"; const RED_TXT    = "#DC2626";
const BLUE_BG    = "#EEF2FF"; const BLUE_TXT   = "#4F46E5";

type RoleBadge      = "PI" | "Sub-I" | "CRC" | "RN" | "Data Manager" | "Coordinator";
type TrainingStatus = "Current" | "Expiring" | "Expired";
type CourseStatus   = "Completed" | "In Progress" | "Not Started" | "Required";
type DocStatus      = "Current" | "Expiring" | "Expired";
type AuditCategory  = "Login" | "Document" | "Role" | "Training" | "Study" | "System";

const ROLE_COLORS: Record<RoleBadge, { bg: string; text: string }> = {
  "PI":           { bg: "#EDE9FF", text: "#5C4EE5" },
  "Sub-I":        { bg: "#E8F0FE", text: "#1D4ED8" },
  "CRC":          { bg: "#E6F7F3", text: "#0D7A5F" },
  "RN":           { bg: "#FEE8ED", text: "#9B2335" },
  "Data Manager": { bg: "#FFF0E6", text: "#B45309" },
  "Coordinator":  { bg: "#F3E8FF", text: "#7E22CE" },
};

interface FloAcademyCourse {
  id: string;
  name: string;
  category: string;
  status: CourseStatus;
  completedDate?: string;
  dueDate?: string;
  duration: string;
  certAvailable: boolean;
  progress?: number;
}

interface FloUniCourse {
  id: string;
  name: string;
  level: "Foundation" | "Advanced" | "Expert";
  status: CourseStatus;
  completedDate?: string;
  modules: number;
  modulesComplete: number;
}

interface StudyRoleEntry {
  studyId: string;
  studyName: string;
  protocol: string;
  sponsor: string;
  phase: string;
  role: RoleBadge;
  binderRole: string;
  accessLevel: "Full" | "Read-Only" | "Limited";
  status: "Active" | "Closed" | "On Hold";
  assignedDate: string;
}

interface PersonDocument {
  id: string;
  name: string;
  type: "CV" | "License" | "GCP Certificate" | "Training Certificate" | "Other";
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  expiresAt?: string;
  linkedStudies: string[];
  docStatus: DocStatus;
  isCV?: boolean;
}

interface AuditEntry {
  id: number;
  category: AuditCategory;
  action: string;
  detail: string;
  study?: string;
  timestamp: string;
}

interface ExtendedProfile {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  role: RoleBadge;
  department: string;
  email: string;
  phone: string;
  startDate: string;
  status: "Active" | "Inactive";
  gcpDate: string;
  gcpStatus: TrainingStatus;
  licenseState: string;
  licenseExpiry: string;
  lastActive: string;
  floAcademy: FloAcademyCourse[];
  floUniversity: FloUniCourse[];
  studyRoles: StudyRoleEntry[];
  documents: PersonDocument[];
  auditLog: AuditEntry[];
}

// ── Shared training pool ──────────────────────────────────────────────────
const ACADEMY_BASE: FloAcademyCourse[] = [
  { id: "ac1", name: "eBinders Fundamentals", category: "Platform", status: "Completed", completedDate: "Jan 2026", duration: "2h 30m", certAvailable: true },
  { id: "ac2", name: "eConsent Overview", category: "Consent", status: "Completed", completedDate: "Nov 2025", duration: "1h 15m", certAvailable: true },
  { id: "ac3", name: "Regulatory Document Management", category: "Regulatory", status: "In Progress", dueDate: "May 2026", duration: "3h 00m", certAvailable: false, progress: 62 },
  { id: "ac4", name: "GCP Refresher 2026", category: "Compliance", status: "Required", dueDate: "Jun 2026", duration: "4h 00m", certAvailable: true },
  { id: "ac5", name: "Monitoring Visit Prep", category: "Monitoring", status: "Completed", completedDate: "Oct 2025", duration: "2h 00m", certAvailable: true },
  { id: "ac6", name: "Site Feasibility Basics", category: "Feasibility", status: "Not Started", duration: "1h 45m", certAvailable: false },
];

const UNI_BASE: FloUniCourse[] = [
  { id: "uf1", name: "Clinical Research Coordination Certificate", level: "Foundation", status: "Completed", completedDate: "Sep 2025", modules: 8, modulesComplete: 8 },
  { id: "uf2", name: "ICH-GCP E6 R3 Deep Dive", level: "Advanced", status: "In Progress", modules: 6, modulesComplete: 3 },
  { id: "uf3", name: "Protocol Deviation Management", level: "Advanced", status: "Not Started", modules: 5, modulesComplete: 0 },
  { id: "uf4", name: "Principal Investigator Essentials", level: "Expert", status: "Not Started", modules: 10, modulesComplete: 0 },
];

const ACADEMY_PI: FloAcademyCourse[] = [
  { id: "ac1", name: "eBinders Fundamentals", category: "Platform", status: "Completed", completedDate: "Mar 2025", duration: "2h 30m", certAvailable: true },
  { id: "ac2", name: "eConsent Overview", category: "Consent", status: "Completed", completedDate: "Apr 2025", duration: "1h 15m", certAvailable: true },
  { id: "ac3", name: "Regulatory Document Management", category: "Regulatory", status: "Completed", completedDate: "May 2025", duration: "3h 00m", certAvailable: true, progress: 100 },
  { id: "ac4", name: "GCP Refresher 2026", category: "Compliance", status: "Completed", completedDate: "Feb 2026", duration: "4h 00m", certAvailable: true },
  { id: "ac5", name: "Monitoring Visit Prep", category: "Monitoring", status: "Completed", completedDate: "Oct 2025", duration: "2h 00m", certAvailable: true },
  { id: "ac6", name: "Site Feasibility Basics", category: "Feasibility", status: "In Progress", dueDate: "Jun 2026", duration: "1h 45m", certAvailable: false, progress: 40 },
];

const ACADEMY_EXPIRED: FloAcademyCourse[] = [
  { id: "ac1", name: "eBinders Fundamentals", category: "Platform", status: "Completed", completedDate: "Jan 2024", duration: "2h 30m", certAvailable: true },
  { id: "ac2", name: "eConsent Overview", category: "Consent", status: "Not Started", dueDate: "Overdue", duration: "1h 15m", certAvailable: false },
  { id: "ac3", name: "Regulatory Document Management", category: "Regulatory", status: "Not Started", dueDate: "Overdue", duration: "3h 00m", certAvailable: false },
  { id: "ac4", name: "GCP Refresher 2026", category: "Compliance", status: "Required", dueDate: "Overdue", duration: "4h 00m", certAvailable: true },
  { id: "ac5", name: "Monitoring Visit Prep", category: "Monitoring", status: "Not Started", duration: "2h 00m", certAvailable: false },
  { id: "ac6", name: "Site Feasibility Basics", category: "Feasibility", status: "Not Started", duration: "1h 45m", certAvailable: false },
];

// ── Extended profiles (all 12 staff) ─────────────────────────────────────
const PROFILES: ExtendedProfile[] = [
  {
    id: 1, name: "Dr. Amara Okafor", initials: "AO", avatarColor: "#5C4EE5", role: "PI", department: "Oncology",
    email: "a.okafor@sitex.org", phone: "+1 (312) 555-0187", startDate: "Mar 2019", status: "Active",
    gcpDate: "Mar 2026", gcpStatus: "Current", licenseState: "IL", licenseExpiry: "Nov 2027", lastActive: "Today",
    floAcademy: ACADEMY_PI,
    floUniversity: [
      { id: "uf1", name: "Clinical Research Coordination Certificate", level: "Foundation", status: "Completed", completedDate: "Jun 2024", modules: 8, modulesComplete: 8 },
      { id: "uf2", name: "ICH-GCP E6 R3 Deep Dive", level: "Advanced", status: "Completed", completedDate: "Sep 2025", modules: 6, modulesComplete: 6 },
      { id: "uf3", name: "Protocol Deviation Management", level: "Advanced", status: "Completed", completedDate: "Nov 2025", modules: 5, modulesComplete: 5 },
      { id: "uf4", name: "Principal Investigator Essentials", level: "Expert", status: "In Progress", modules: 10, modulesComplete: 7 },
    ],
    studyRoles: [
      { studyId: "1", studyName: "JAVAHEART", protocol: "JH-2024-031", sponsor: "Novartis", phase: "Phase III", role: "PI", binderRole: "Principal Investigator", accessLevel: "Full", status: "Active", assignedDate: "Mar 2024" },
      { studyId: "2", studyName: "ONCOVAULT", protocol: "OV-2023-018", sponsor: "Pfizer", phase: "Phase II", role: "PI", binderRole: "Principal Investigator", accessLevel: "Full", status: "Active", assignedDate: "Jul 2023" },
      { studyId: "3", studyName: "ASTHMAPLUS", protocol: "AP-2025-003", sponsor: "AstraZeneca", phase: "Phase III", role: "PI", binderRole: "Principal Investigator", accessLevel: "Full", status: "Active", assignedDate: "Jan 2025" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v4.0", uploadedAt: "Feb 20, 2026", uploadedBy: "Self", linkedStudies: ["JAVAHEART", "ONCOVAULT", "ASTHMAPLUS"], docStatus: "Current", isCV: true },
      { id: "d2", name: "IL Medical License", type: "License", version: "v1.0", uploadedAt: "Jan 10, 2025", uploadedBy: "Admin", expiresAt: "Nov 2027", linkedStudies: ["JAVAHEART", "ONCOVAULT", "ASTHMAPLUS"], docStatus: "Current" },
      { id: "d3", name: "GCP Training Certificate 2026", type: "GCP Certificate", version: "v3.0", uploadedAt: "Mar 5, 2026", uploadedBy: "Self", expiresAt: "Mar 2028", linkedStudies: ["JAVAHEART", "ONCOVAULT", "ASTHMAPLUS"], docStatus: "Current" },
      { id: "d4", name: "Flo Academy — eBinders Fundamentals", type: "Training Certificate", version: "v1.0", uploadedAt: "Mar 15, 2025", uploadedBy: "System", linkedStudies: [], docStatus: "Current" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Today, 7:52 AM" },
      { id: 2, category: "Document", action: "Document signed", detail: "Protocol Amendment 3 — JAVAHEART", study: "JAVAHEART", timestamp: "Today, 8:15 AM" },
      { id: 3, category: "Document", action: "CV updated", detail: "v3.0 → v4.0 · Propagated to 3 studies", study: "JAVAHEART, ONCOVAULT, ASTHMAPLUS", timestamp: "Feb 20, 2026, 2:30 PM" },
      { id: 4, category: "Training", action: "Course completed", detail: "Principal Investigator Essentials — Flo University (7/10 modules)", timestamp: "Jan 28, 2026, 4:00 PM" },
      { id: 5, category: "Study", action: "Role assigned", detail: "PI → ASTHMAPLUS", study: "ASTHMAPLUS", timestamp: "Jan 5, 2025, 10:00 AM" },
      { id: 6, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Yesterday, 8:01 AM" },
      { id: 7, category: "Document", action: "SAE report signed", detail: "Subject 045 adverse event — JAVAHEART", study: "JAVAHEART", timestamp: "Apr 18, 2026, 3:14 PM" },
      { id: 8, category: "Role", action: "Access level updated", detail: "ONCOVAULT: read-only observer added", study: "ONCOVAULT", timestamp: "Mar 10, 2026, 11:00 AM" },
      { id: 9, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Mar 1, 2019, 9:00 AM" },
    ],
  },
  {
    id: 2, name: "Dr. Sofia Martinez", initials: "SM", avatarColor: "#0D7A5F", role: "Sub-I", department: "Cardiology",
    email: "s.martinez@sitex.org", phone: "+1 (312) 555-0142", startDate: "Aug 2021", status: "Active",
    gcpDate: "Jan 2026", gcpStatus: "Current", licenseState: "IL", licenseExpiry: "Aug 2027", lastActive: "Today",
    floAcademy: ACADEMY_PI,
    floUniversity: [
      { ...UNI_BASE[0], status: "Completed", completedDate: "Feb 2025" },
      { ...UNI_BASE[1], status: "Completed", completedDate: "Oct 2025", modulesComplete: 6 },
      { ...UNI_BASE[2], status: "In Progress", modulesComplete: 2 },
      { ...UNI_BASE[3], status: "Not Started", modulesComplete: 0 },
    ],
    studyRoles: [
      { studyId: "4", studyName: "DIASOLVE", protocol: "DS-2024-007", sponsor: "BioMarin", phase: "Phase II", role: "Sub-I", binderRole: "Sub-Investigator", accessLevel: "Full", status: "Active", assignedDate: "Apr 2024" },
      { studyId: "5", studyName: "RHEUMATH", protocol: "RM-2023-012", sponsor: "BioMarin", phase: "Phase III", role: "Sub-I", binderRole: "Sub-Investigator", accessLevel: "Full", status: "Active", assignedDate: "Sep 2023" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v3.0", uploadedAt: "Jan 5, 2026", uploadedBy: "Self", linkedStudies: ["DIASOLVE", "RHEUMATH"], docStatus: "Current", isCV: true },
      { id: "d2", name: "IL Medical License", type: "License", version: "v1.0", uploadedAt: "Aug 1, 2024", uploadedBy: "Admin", expiresAt: "Aug 2027", linkedStudies: ["DIASOLVE", "RHEUMATH"], docStatus: "Current" },
      { id: "d3", name: "GCP Training Certificate 2026", type: "GCP Certificate", version: "v2.0", uploadedAt: "Jan 10, 2026", uploadedBy: "Self", expiresAt: "Jan 2028", linkedStudies: ["DIASOLVE", "RHEUMATH"], docStatus: "Current" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Safari · Chicago, IL", timestamp: "Today, 8:30 AM" },
      { id: 2, category: "Document", action: "Consent signed", detail: "ICF v2.4 — DIASOLVE", study: "DIASOLVE", timestamp: "Today, 9:00 AM" },
      { id: 3, category: "Document", action: "CV updated", detail: "v2.0 → v3.0 · Propagated to 2 studies", study: "DIASOLVE, RHEUMATH", timestamp: "Jan 5, 2026, 11:00 AM" },
      { id: 4, category: "Training", action: "Course completed", detail: "ICH-GCP E6 R3 Deep Dive — Flo University", timestamp: "Oct 15, 2025, 2:00 PM" },
      { id: 5, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Aug 15, 2021, 9:00 AM" },
    ],
  },
  {
    id: 3, name: "Dr. James Whitfield", initials: "JW", avatarColor: "#B45309", role: "Sub-I", department: "Neurology",
    email: "j.whitfield@sitex.org", phone: "+1 (312) 555-0198", startDate: "Feb 2020", status: "Active",
    gcpDate: "Jun 2025", gcpStatus: "Expiring", licenseState: "IL", licenseExpiry: "Jun 2026", lastActive: "Yesterday",
    floAcademy: [
      { ...ACADEMY_BASE[0], completedDate: "Mar 2024" },
      { ...ACADEMY_BASE[1], status: "Completed", completedDate: "Apr 2024" },
      { ...ACADEMY_BASE[2], status: "Not Started", dueDate: "Overdue" },
      { ...ACADEMY_BASE[3], status: "Required", dueDate: "Jun 2026" },
      { ...ACADEMY_BASE[4], status: "Completed", completedDate: "May 2024" },
      { ...ACADEMY_BASE[5], status: "Not Started" },
    ],
    floUniversity: [
      { ...UNI_BASE[0], status: "Completed", completedDate: "Jun 2024" },
      { ...UNI_BASE[1], status: "In Progress", modulesComplete: 1 },
      { ...UNI_BASE[2], status: "Not Started", modulesComplete: 0 },
      { ...UNI_BASE[3], status: "Not Started", modulesComplete: 0 },
    ],
    studyRoles: [
      { studyId: "6", studyName: "NEUROPILOT", protocol: "NP-2022-007", sponsor: "AstraZeneca", phase: "Phase II", role: "Sub-I", binderRole: "Sub-Investigator", accessLevel: "Full", status: "Active", assignedDate: "Feb 2022" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v2.0", uploadedAt: "Nov 10, 2024", uploadedBy: "Self", linkedStudies: ["NEUROPILOT"], docStatus: "Current", isCV: true },
      { id: "d2", name: "IL Medical License", type: "License", version: "v1.0", uploadedAt: "Jun 15, 2023", uploadedBy: "Admin", expiresAt: "Jun 2026", linkedStudies: ["NEUROPILOT"], docStatus: "Expiring" },
      { id: "d3", name: "GCP Training Certificate 2025", type: "GCP Certificate", version: "v1.0", uploadedAt: "Jun 5, 2025", uploadedBy: "Self", expiresAt: "Jun 2026", linkedStudies: ["NEUROPILOT"], docStatus: "Expiring" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Yesterday, 8:45 AM" },
      { id: 2, category: "Document", action: "License expiry warning", detail: "IL Medical License expires Jun 2026", timestamp: "Apr 1, 2026, 9:00 AM" },
      { id: 3, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Feb 10, 2020, 9:00 AM" },
    ],
  },
  {
    id: 4, name: "Rachel Huang", initials: "RH", avatarColor: "#0D7A5F", role: "CRC", department: "Oncology",
    email: "r.huang@sitex.org", phone: "+1 (312) 555-0163", startDate: "Sep 2022", status: "Active",
    gcpDate: "Feb 2026", gcpStatus: "Current", licenseState: "IL", licenseExpiry: "N/A", lastActive: "Today",
    floAcademy: ACADEMY_BASE,
    floUniversity: UNI_BASE,
    studyRoles: [
      { studyId: "1", studyName: "JAVAHEART", protocol: "JH-2024-031", sponsor: "Novartis", phase: "Phase III", role: "CRC", binderRole: "Regulatory Coordinator", accessLevel: "Full", status: "Active", assignedDate: "Mar 2024" },
      { studyId: "2", studyName: "ONCOVAULT", protocol: "OV-2023-018", sponsor: "Pfizer", phase: "Phase II", role: "CRC", binderRole: "Study Coordinator", accessLevel: "Full", status: "Active", assignedDate: "Sep 2022" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v3.0", uploadedAt: "Mar 15, 2026", uploadedBy: "Self", linkedStudies: ["JAVAHEART", "ONCOVAULT"], docStatus: "Current", isCV: true },
      { id: "d3", name: "GCP Training Certificate 2026", type: "GCP Certificate", version: "v2.0", uploadedAt: "Feb 10, 2026", uploadedBy: "Self", expiresAt: "Feb 2028", linkedStudies: ["JAVAHEART", "ONCOVAULT"], docStatus: "Current" },
      { id: "d4", name: "Flo Academy — eBinders Fundamentals", type: "Training Certificate", version: "v1.0", uploadedAt: "Jan 12, 2026", uploadedBy: "System", linkedStudies: [], docStatus: "Current" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Today, 8:47 AM" },
      { id: 2, category: "Document", action: "Document filed", detail: "Protocol Amendment 3 → JAVAHEART / Regulatory", study: "JAVAHEART", timestamp: "Today, 9:05 AM" },
      { id: 3, category: "Document", action: "CV updated", detail: "v2.0 → v3.0 · Propagated to 2 studies", study: "JAVAHEART, ONCOVAULT", timestamp: "Mar 15, 2026, 2:30 PM" },
      { id: 4, category: "Training", action: "Course completed", detail: "eBinders Fundamentals — Flo Academy", timestamp: "Jan 12, 2026, 4:00 PM" },
      { id: 5, category: "Training", action: "Course started", detail: "ICH-GCP E6 R3 Deep Dive — Flo University", timestamp: "Feb 10, 2026, 3:30 PM" },
      { id: 6, category: "Study", action: "Role assigned", detail: "CRC / Regulatory Coordinator → JAVAHEART", study: "JAVAHEART", timestamp: "Mar 5, 2024, 10:00 AM" },
      { id: 7, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Yesterday, 7:55 AM" },
      { id: 8, category: "Document", action: "Consent filed", detail: "ICF v2.4 → ONCOVAULT / Consent", study: "ONCOVAULT", timestamp: "Apr 18, 2026, 11:30 AM" },
      { id: 9, category: "Role", action: "Access level changed", detail: "ONCOVAULT: Observer → Study Coordinator", study: "ONCOVAULT", timestamp: "Jan 15, 2026, 2:00 PM" },
      { id: 10, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Sep 5, 2022, 9:00 AM" },
    ],
  },
  {
    id: 5, name: "Marcus Webb", initials: "MW", avatarColor: "#7E22CE", role: "CRC", department: "Cardiology",
    email: "m.webb@sitex.org", phone: "+1 (312) 555-0174", startDate: "Jun 2021", status: "Active",
    gcpDate: "Apr 2024", gcpStatus: "Expired", licenseState: "IL", licenseExpiry: "N/A", lastActive: "3 days ago",
    floAcademy: ACADEMY_EXPIRED,
    floUniversity: [
      { ...UNI_BASE[0], status: "In Progress", modulesComplete: 4 },
      { ...UNI_BASE[1], status: "Not Started", modulesComplete: 0 },
      { ...UNI_BASE[2], status: "Not Started", modulesComplete: 0 },
      { ...UNI_BASE[3], status: "Not Started", modulesComplete: 0 },
    ],
    studyRoles: [
      { studyId: "4", studyName: "DIASOLVE", protocol: "DS-2024-007", sponsor: "BioMarin", phase: "Phase II", role: "CRC", binderRole: "Observer", accessLevel: "Read-Only", status: "On Hold", assignedDate: "Jun 2024" },
    ],
    documents: [
      { id: "d3", name: "GCP Training Certificate 2024", type: "GCP Certificate", version: "v1.0", uploadedAt: "Apr 1, 2024", uploadedBy: "Self", expiresAt: "Apr 2025", linkedStudies: ["DIASOLVE"], docStatus: "Expired" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "3 days ago, 9:10 AM" },
      { id: 2, category: "Document", action: "GCP expiry alert", detail: "GCP certificate expired Apr 2025 — renewal required", timestamp: "Apr 1, 2025, 9:00 AM" },
      { id: 3, category: "Role", action: "Access suspended", detail: "DIASOLVE: active → read-only (GCP expired)", study: "DIASOLVE", timestamp: "Apr 2, 2025, 8:00 AM" },
      { id: 4, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Jun 15, 2021, 9:00 AM" },
    ],
  },
  {
    id: 6, name: "Priya Nair", initials: "PN", avatarColor: "#9B2335", role: "RN", department: "Infectious Disease",
    email: "p.nair@sitex.org", phone: "+1 (312) 555-0156", startDate: "Apr 2023", status: "Active",
    gcpDate: "Nov 2025", gcpStatus: "Expiring", licenseState: "IL", licenseExpiry: "Sep 2026", lastActive: "Today",
    floAcademy: ACADEMY_BASE,
    floUniversity: UNI_BASE,
    studyRoles: [
      { studyId: "7", studyName: "ASTHMAPLUS", protocol: "AP-2025-003", sponsor: "AstraZeneca", phase: "Phase III", role: "RN", binderRole: "Study Nurse", accessLevel: "Limited", status: "Active", assignedDate: "Jan 2025" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v2.0", uploadedAt: "Apr 10, 2025", uploadedBy: "Self", linkedStudies: ["ASTHMAPLUS"], docStatus: "Current", isCV: true },
      { id: "d2", name: "IL Nursing License", type: "License", version: "v1.0", uploadedAt: "Sep 15, 2023", uploadedBy: "Admin", expiresAt: "Sep 2026", linkedStudies: ["ASTHMAPLUS"], docStatus: "Expiring" },
      { id: "d3", name: "GCP Training Certificate 2025", type: "GCP Certificate", version: "v1.0", uploadedAt: "Nov 5, 2025", uploadedBy: "Self", expiresAt: "Nov 2026", linkedStudies: ["ASTHMAPLUS"], docStatus: "Expiring" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Safari · Chicago, IL", timestamp: "Today, 7:30 AM" },
      { id: 2, category: "Training", action: "Course in progress", detail: "Regulatory Document Management — Flo Academy (62%)", timestamp: "Apr 20, 2026, 2:00 PM" },
      { id: 3, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Apr 10, 2023, 9:00 AM" },
    ],
  },
  {
    id: 7, name: "Thomas Reyes", initials: "TR", avatarColor: "#1D4ED8", role: "RN", department: "Oncology",
    email: "t.reyes@sitex.org", phone: "+1 (312) 555-0131", startDate: "Jan 2024", status: "Active",
    gcpDate: "Jan 2026", gcpStatus: "Current", licenseState: "IL", licenseExpiry: "Jan 2028", lastActive: "Yesterday",
    floAcademy: ACADEMY_BASE,
    floUniversity: UNI_BASE,
    studyRoles: [
      { studyId: "2", studyName: "ONCOVAULT", protocol: "OV-2023-018", sponsor: "Pfizer", phase: "Phase II", role: "RN", binderRole: "Study Nurse", accessLevel: "Limited", status: "Active", assignedDate: "Jan 2024" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v2.0", uploadedAt: "Jan 20, 2026", uploadedBy: "Self", linkedStudies: ["ONCOVAULT"], docStatus: "Current", isCV: true },
      { id: "d2", name: "IL Nursing License", type: "License", version: "v1.0", uploadedAt: "Jan 5, 2024", uploadedBy: "Admin", expiresAt: "Jan 2028", linkedStudies: ["ONCOVAULT"], docStatus: "Current" },
      { id: "d3", name: "GCP Training Certificate 2026", type: "GCP Certificate", version: "v2.0", uploadedAt: "Jan 12, 2026", uploadedBy: "Self", expiresAt: "Jan 2028", linkedStudies: ["ONCOVAULT"], docStatus: "Current" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Yesterday, 8:00 AM" },
      { id: 2, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Jan 8, 2024, 9:00 AM" },
    ],
  },
  {
    id: 8, name: "Dana Fischer", initials: "DF", avatarColor: "#B45309", role: "Data Manager", department: "Clinical Ops",
    email: "d.fischer@sitex.org", phone: "+1 (312) 555-0149", startDate: "Nov 2020", status: "Active",
    gcpDate: "Mar 2025", gcpStatus: "Expiring", licenseState: "N/A", licenseExpiry: "N/A", lastActive: "Today",
    floAcademy: ACADEMY_BASE,
    floUniversity: UNI_BASE,
    studyRoles: [
      { studyId: "1", studyName: "JAVAHEART", protocol: "JH-2024-031", sponsor: "Novartis", phase: "Phase III", role: "Data Manager", binderRole: "Data Coordinator", accessLevel: "Limited", status: "Active", assignedDate: "Mar 2024" },
      { studyId: "6", studyName: "NEUROPILOT", protocol: "NP-2022-007", sponsor: "AstraZeneca", phase: "Phase II", role: "Data Manager", binderRole: "Data Coordinator", accessLevel: "Limited", status: "Active", assignedDate: "Mar 2022" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v3.0", uploadedAt: "Mar 1, 2026", uploadedBy: "Self", linkedStudies: ["JAVAHEART", "NEUROPILOT"], docStatus: "Current", isCV: true },
      { id: "d3", name: "GCP Training Certificate 2025", type: "GCP Certificate", version: "v1.0", uploadedAt: "Mar 5, 2025", uploadedBy: "Self", expiresAt: "Mar 2026", linkedStudies: ["JAVAHEART", "NEUROPILOT"], docStatus: "Expiring" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Today, 8:20 AM" },
      { id: 2, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Nov 2, 2020, 9:00 AM" },
    ],
  },
  {
    id: 9, name: "Kevin Lim", initials: "KL", avatarColor: "#7E22CE", role: "Data Manager", department: "Clinical Ops",
    email: "k.lim@sitex.org", phone: "+1 (312) 555-0122", startDate: "May 2023", status: "Active",
    gcpDate: "Feb 2026", gcpStatus: "Current", licenseState: "N/A", licenseExpiry: "N/A", lastActive: "2 days ago",
    floAcademy: ACADEMY_BASE,
    floUniversity: UNI_BASE,
    studyRoles: [
      { studyId: "5", studyName: "RHEUMATH", protocol: "RM-2023-012", sponsor: "BioMarin", phase: "Phase III", role: "Data Manager", binderRole: "Data Coordinator", accessLevel: "Limited", status: "Active", assignedDate: "May 2023" },
    ],
    documents: [
      { id: "d3", name: "GCP Training Certificate 2026", type: "GCP Certificate", version: "v2.0", uploadedAt: "Feb 5, 2026", uploadedBy: "Self", expiresAt: "Feb 2028", linkedStudies: ["RHEUMATH"], docStatus: "Current" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Firefox · Chicago, IL", timestamp: "2 days ago, 9:30 AM" },
      { id: 2, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "May 15, 2023, 9:00 AM" },
    ],
  },
  {
    id: 10, name: "Simone Brooks", initials: "SB", avatarColor: "#0D7A5F", role: "Coordinator", department: "Neurology",
    email: "s.brooks@sitex.org", phone: "+1 (312) 555-0188", startDate: "Mar 2018", status: "Active",
    gcpDate: "Aug 2023", gcpStatus: "Expired", licenseState: "N/A", licenseExpiry: "N/A", lastActive: "1 week ago",
    floAcademy: ACADEMY_EXPIRED,
    floUniversity: [
      { ...UNI_BASE[0], status: "Completed", completedDate: "Jan 2022" },
      { ...UNI_BASE[1], status: "Not Started", modulesComplete: 0 },
      { ...UNI_BASE[2], status: "Not Started", modulesComplete: 0 },
      { ...UNI_BASE[3], status: "Not Started", modulesComplete: 0 },
    ],
    studyRoles: [
      { studyId: "6", studyName: "NEUROPILOT", protocol: "NP-2022-007", sponsor: "AstraZeneca", phase: "Phase II", role: "Coordinator", binderRole: "Site Coordinator", accessLevel: "Read-Only", status: "Active", assignedDate: "Mar 2022" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v5.0", uploadedAt: "Jun 10, 2023", uploadedBy: "Self", linkedStudies: ["NEUROPILOT"], docStatus: "Current", isCV: true },
      { id: "d3", name: "GCP Training Certificate 2023", type: "GCP Certificate", version: "v1.0", uploadedAt: "Aug 10, 2023", uploadedBy: "Self", expiresAt: "Aug 2024", linkedStudies: ["NEUROPILOT"], docStatus: "Expired" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "1 week ago, 9:00 AM" },
      { id: 2, category: "Document", action: "GCP expiry alert", detail: "GCP certificate expired Aug 2024 — renewal required", timestamp: "Aug 1, 2024, 9:00 AM" },
      { id: 3, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Mar 1, 2018, 9:00 AM" },
    ],
  },
  {
    id: 11, name: "Omar Hassan", initials: "OH", avatarColor: "#5C4EE5", role: "Coordinator", department: "Cardiology",
    email: "o.hassan@sitex.org", phone: "+1 (312) 555-0115", startDate: "Jul 2024", status: "Active",
    gcpDate: "Apr 2026", gcpStatus: "Current", licenseState: "N/A", licenseExpiry: "N/A", lastActive: "Today",
    floAcademy: [
      { ...ACADEMY_BASE[0], status: "Completed", completedDate: "Aug 2024" },
      { ...ACADEMY_BASE[1], status: "Completed", completedDate: "Sep 2024" },
      { ...ACADEMY_BASE[2], status: "In Progress", dueDate: "Jun 2026", progress: 30 },
      { ...ACADEMY_BASE[3], status: "Completed", completedDate: "Apr 2026" },
      { ...ACADEMY_BASE[4], status: "Not Started" },
      { ...ACADEMY_BASE[5], status: "Not Started" },
    ],
    floUniversity: UNI_BASE,
    studyRoles: [
      { studyId: "4", studyName: "DIASOLVE", protocol: "DS-2024-007", sponsor: "BioMarin", phase: "Phase II", role: "Coordinator", binderRole: "Site Coordinator", accessLevel: "Limited", status: "Active", assignedDate: "Jul 2024" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v1.0", uploadedAt: "Jul 15, 2024", uploadedBy: "Self", linkedStudies: ["DIASOLVE"], docStatus: "Current", isCV: true },
      { id: "d3", name: "GCP Training Certificate 2026", type: "GCP Certificate", version: "v1.0", uploadedAt: "Apr 8, 2026", uploadedBy: "Self", expiresAt: "Apr 2028", linkedStudies: ["DIASOLVE"], docStatus: "Current" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Today, 9:00 AM" },
      { id: 2, category: "Training", action: "Course completed", detail: "GCP Refresher 2026 — Flo Academy", timestamp: "Apr 8, 2026, 3:00 PM" },
      { id: 3, category: "Study", action: "Role assigned", detail: "Coordinator / Site Coordinator → DIASOLVE", study: "DIASOLVE", timestamp: "Jul 20, 2024, 10:00 AM" },
      { id: 4, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Jul 15, 2024, 9:00 AM" },
    ],
  },
  {
    id: 12, name: "Laura Nguyen", initials: "LN", avatarColor: "#9B2335", role: "CRC", department: "Infectious Disease",
    email: "l.nguyen@sitex.org", phone: "+1 (312) 555-0177", startDate: "Dec 2022", status: "Active",
    gcpDate: "Dec 2025", gcpStatus: "Current", licenseState: "N/A", licenseExpiry: "N/A", lastActive: "Today",
    floAcademy: ACADEMY_BASE,
    floUniversity: UNI_BASE,
    studyRoles: [
      { studyId: "7", studyName: "ASTHMAPLUS", protocol: "AP-2025-003", sponsor: "AstraZeneca", phase: "Phase III", role: "CRC", binderRole: "Regulatory Coordinator", accessLevel: "Full", status: "Active", assignedDate: "Jan 2025" },
    ],
    documents: [
      { id: "d1", name: "Curriculum Vitae", type: "CV", version: "v2.0", uploadedAt: "Nov 5, 2025", uploadedBy: "Self", linkedStudies: ["ASTHMAPLUS"], docStatus: "Current", isCV: true },
      { id: "d3", name: "GCP Training Certificate 2025", type: "GCP Certificate", version: "v1.0", uploadedAt: "Dec 10, 2025", uploadedBy: "Self", expiresAt: "Dec 2027", linkedStudies: ["ASTHMAPLUS"], docStatus: "Current" },
      { id: "d4", name: "Flo Academy — eConsent Overview", type: "Training Certificate", version: "v1.0", uploadedAt: "Nov 20, 2025", uploadedBy: "System", linkedStudies: [], docStatus: "Current" },
    ],
    auditLog: [
      { id: 1, category: "Login", action: "Signed in", detail: "Chrome · Chicago, IL", timestamp: "Today, 8:55 AM" },
      { id: 2, category: "Document", action: "Document filed", detail: "ICF v2.4 → ASTHMAPLUS / Consent", study: "ASTHMAPLUS", timestamp: "Today, 9:30 AM" },
      { id: 3, category: "System", action: "Account created", detail: "Profile activated by Admin", timestamp: "Dec 5, 2022, 9:00 AM" },
    ],
  },
];

const PROFILE_MAP = Object.fromEntries(PROFILES.map(p => [p.id, p]));

// ── Helper components ─────────────────────────────────────────────────────
function RolePill({ role }: { role: RoleBadge }) {
  const c = ROLE_COLORS[role];
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.bg, color: c.text }}>
      {role}
    </span>
  );
}

function StatusDot({ status }: { status: TrainingStatus }) {
  const colors = { Current: "#10B981", Expiring: "#F59E0B", Expired: "#EF4444" };
  return <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ background: colors[status] }} />;
}

function CourseStatusBadge({ status }: { status: CourseStatus }) {
  const cfg = {
    Completed:     { bg: GREEN_BG,  text: GREEN_TXT,  label: "Completed" },
    "In Progress": { bg: AMBER_BG,  text: AMBER_TXT,  label: "In Progress" },
    "Not Started": { bg: BORDER,    text: TEXT_MID,   label: "Not Started" },
    Required:      { bg: RED_BG,    text: RED_TXT,    label: "Required" },
  }[status];
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
}

function DocStatusBadge({ status }: { status: DocStatus }) {
  const cfg = {
    Current:  { bg: GREEN_BG, text: GREEN_TXT },
    Expiring: { bg: AMBER_BG, text: AMBER_TXT },
    Expired:  { bg: RED_BG,   text: RED_TXT },
  }[status];
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
      {status}
    </span>
  );
}

const AUDIT_CATEGORY_COLORS: Record<AuditCategory, { bg: string; text: string; icon: React.ElementType }> = {
  Login:    { bg: BLUE_BG,  text: BLUE_TXT,  icon: LogIn },
  Document: { bg: "#F0F9FF", text: "#0369A1", icon: FileText },
  Role:     { bg: "#EDE9FF", text: "#5C4EE5", icon: Shield },
  Training: { bg: GREEN_BG,  text: GREEN_TXT, icon: GraduationCap },
  Study:    { bg: "#F3E8FF", text: "#7E22CE", icon: BookOpen },
  System:   { bg: BORDER,    text: TEXT_MID,  icon: Settings },
};

// ── Tab components ────────────────────────────────────────────────────────
function OverviewTab({ person }: { person: ExtendedProfile }) {
  const compliance = Math.round(
    (person.floAcademy.filter(c => c.status === "Completed").length / person.floAcademy.length) * 100
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left: contact + credentials */}
      <div className="col-span-2 flex flex-col gap-4">
        {/* Compliance warning (if applicable) */}
        {person.gcpStatus !== "Current" && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: person.gcpStatus === "Expired" ? RED_BG : AMBER_BG, border: `1px solid ${person.gcpStatus === "Expired" ? "#FECACA" : "#FDE68A"}` }}
          >
            <AlertTriangle size={16} style={{ color: person.gcpStatus === "Expired" ? RED_TXT : AMBER_TXT, flexShrink: 0 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: person.gcpStatus === "Expired" ? RED_TXT : AMBER_TXT }}>
                GCP Training {person.gcpStatus} — {person.gcpDate}
              </p>
              <p className="text-xs mt-0.5" style={{ color: TEXT_MID }}>
                Renewal is required to maintain study access. Assign GCP Refresher 2026 course in the Training tab.
              </p>
            </div>
          </div>
        )}

        {/* Contact info */}
        <div className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: TEXT_MUTED }}>Contact & Identity</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Mail,     label: "Email",        value: person.email },
              { icon: Phone,    label: "Phone",        value: person.phone },
              { icon: Building2,label: "Department",   value: person.department },
              { icon: User,     label: "Start Date",   value: person.startDate },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: BORDER }}>
                  <Icon size={14} style={{ color: TEXT_MID }} />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: TEXT_MUTED }}>{label}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: TEXT_DARK }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials summary */}
        <div className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: TEXT_MUTED }}>Credentials</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2">
                <Shield size={14} style={{ color: TEXT_MUTED }} />
                <span className="text-xs font-medium" style={{ color: TEXT_DARK }}>GCP Training</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status={person.gcpStatus} />
                <span className="text-xs" style={{ color: TEXT_MID }}>{person.gcpDate} · {person.gcpStatus}</span>
              </div>
            </div>
            {person.licenseState !== "N/A" && (
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2">
                  <Award size={14} style={{ color: TEXT_MUTED }} />
                  <span className="text-xs font-medium" style={{ color: TEXT_DARK }}>{person.licenseState} Medical License</span>
                </div>
                <span className="text-xs" style={{ color: TEXT_MID }}>Expires {person.licenseExpiry}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <GraduationCap size={14} style={{ color: TEXT_MUTED }} />
                <span className="text-xs font-medium" style={{ color: TEXT_DARK }}>Training Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                  <div className="h-full rounded-full" style={{ width: `${compliance}%`, background: compliance >= 80 ? GREEN_TXT : compliance >= 50 ? AMBER_TXT : RED_TXT }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: compliance >= 80 ? GREEN_TXT : compliance >= 50 ? AMBER_TXT : RED_TXT }}>{compliance}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: recent activity */}
      <div className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} style={{ color: TEXT_MUTED }} />
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: TEXT_MUTED }}>Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {person.auditLog.slice(0, 6).map(entry => {
            const cfg = AUDIT_CATEGORY_COLORS[entry.category];
            const Icon = cfg.icon;
            return (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: cfg.bg }}>
                  <Icon size={11} style={{ color: cfg.text }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: TEXT_DARK }}>{entry.action}</p>
                  <p className="text-[10px] truncate" style={{ color: TEXT_MUTED }}>{entry.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TrainingTab({ person }: { person: ExtendedProfile }) {
  const academyComplete = person.floAcademy.filter(c => c.status === "Completed").length;
  const uniComplete     = person.floUniversity.filter(c => c.status === "Completed").length;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Flo Academy ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
          <div className="flex items-center gap-2">
            <GraduationCap size={16} style={{ color: PRIMARY }} />
            <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Flo Academy</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: BORDER, color: TEXT_MID }}>
              {academyComplete}/{person.floAcademy.length} complete
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: PRIMARY, color: "white" }}>
            <Plus size={12} /> Assign Course
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {person.floAcademy.map(course => (
            <div key={course.id} className="px-5 py-3.5 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: course.status === "Completed" ? GREEN_BG : course.status === "Required" ? RED_BG : BORDER }}>
                {course.status === "Completed" ? <CheckCircle size={15} style={{ color: GREEN_TXT }} />
                  : course.status === "In Progress" ? <Play size={15} style={{ color: AMBER_TXT }} />
                  : course.status === "Required" ? <AlertTriangle size={15} style={{ color: RED_TXT }} />
                  : <BookOpen size={15} style={{ color: TEXT_MUTED }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{course.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: BORDER, color: TEXT_MID }}>{course.category}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px]" style={{ color: TEXT_MUTED }}>{course.duration}</span>
                  {course.completedDate && <span className="text-[11px]" style={{ color: TEXT_MUTED }}>Completed {course.completedDate}</span>}
                  {course.dueDate && <span className="text-[11px]" style={{ color: course.status === "Required" ? RED_TXT : AMBER_TXT }}>Due {course.dueDate}</span>}
                </div>
                {course.status === "In Progress" && course.progress !== undefined && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER, maxWidth: 120 }}>
                      <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: AMBER_TXT }} />
                    </div>
                    <span className="text-[10px]" style={{ color: AMBER_TXT }}>{course.progress}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CourseStatusBadge status={course.status} />
                {course.status === "Completed" && course.certAvailable && (
                  <button className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ color: PRIMARY, background: "#EDE9FF" }}>
                    <Download size={11} /> Cert
                  </button>
                )}
                {(course.status === "Not Started" || course.status === "Required") && (
                  <button className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ color: TEXT_MID, background: BORDER }}>
                    <ExternalLink size={11} /> Launch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Flo University ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
          <div className="flex items-center gap-2">
            <Award size={16} style={{ color: "#7E22CE" }} />
            <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Flo University</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: BORDER, color: TEXT_MID }}>
              {uniComplete}/{person.floUniversity.length} pathways complete
            </span>
          </div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {person.floUniversity.map(course => {
            const pct = course.modules > 0 ? Math.round((course.modulesComplete / course.modules) * 100) : 0;
            const levelColors: Record<string, { bg: string; text: string }> = {
              Foundation: { bg: "#E6F7F3", text: "#0D7A5F" },
              Advanced:   { bg: "#EEF2FF", text: "#4338CA" },
              Expert:     { bg: "#F3E8FF", text: "#7E22CE" },
            };
            const lc = levelColors[course.level];
            return (
              <div key={course.id} className="rounded-xl p-4" style={{ border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: lc.bg, color: lc.text }}>{course.level}</span>
                  <CourseStatusBadge status={course.status} />
                </div>
                <p className="text-xs font-semibold mt-2 leading-snug" style={{ color: TEXT_DARK }}>{course.name}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: TEXT_MUTED }}>{course.modulesComplete}/{course.modules} modules</span>
                    {course.completedDate && <span className="text-[10px]" style={{ color: GREEN_TXT }}>Done {course.completedDate}</span>}
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: course.status === "Completed" ? GREEN_TXT : AMBER_TXT }} />
                  </div>
                </div>
                {course.status !== "Completed" && (
                  <button className="mt-3 w-full text-[11px] font-medium py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}>
                    {course.status === "In Progress" ? "Continue" : "Start Pathway"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StudyRolesTab({ person }: { person: ExtendedProfile }) {
  const accessColors = { Full: { bg: GREEN_BG, text: GREEN_TXT }, "Read-Only": { bg: BORDER, text: TEXT_MID }, Limited: { bg: AMBER_BG, text: AMBER_TXT } };
  const studyStatusColors = { Active: { bg: GREEN_BG, text: GREEN_TXT }, Closed: { bg: BORDER, text: TEXT_MID }, "On Hold": { bg: AMBER_BG, text: AMBER_TXT } };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
          <div className="flex items-center gap-2">
            <Layers size={15} style={{ color: PRIMARY }} />
            <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Study Role Assignments</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: BORDER, color: TEXT_MID }}>
              {person.studyRoles.length} studies
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: PRIMARY, color: "white" }}>
            <Plus size={12} /> Assign to Study
          </button>
        </div>
        {person.studyRoles.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <BookOpen size={32} className="mx-auto mb-3" style={{ color: TEXT_MUTED }} />
            <p className="text-sm font-medium" style={{ color: TEXT_DARK }}>Not assigned to any studies</p>
            <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>Use "Assign to Study" to link this person to a study.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
                  {["Study", "Protocol", "Sponsor", "Phase", "My Role", "Binder Role", "Access", "Status", "Since", ""].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-medium whitespace-nowrap" style={{ color: TEXT_MUTED }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {person.studyRoles.map((sr, i) => {
                  const ac = accessColors[sr.accessLevel];
                  const sc = studyStatusColors[sr.status];
                  return (
                    <tr key={sr.studyId} className="hover:bg-[#FAF6F0] transition-colors" style={{ borderBottom: i < person.studyRoles.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: TEXT_DARK }}>{sr.studyName}</td>
                      <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>{sr.protocol}</td>
                      <td className="px-4 py-3" style={{ color: TEXT_MID }}>{sr.sponsor}</td>
                      <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>{sr.phase}</td>
                      <td className="px-4 py-3"><RolePill role={sr.role} /></td>
                      <td className="px-4 py-3" style={{ color: TEXT_MID }}>{sr.binderRole}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ac.bg, color: ac.text }}>{sr.accessLevel}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sr.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: TEXT_MUTED }}>{sr.assignedDate}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/study/${sr.studyId}`}
                          className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md"
                          style={{ color: PRIMARY, background: "#EDE9FF" }}
                        >
                          <ExternalLink size={10} /> View Study
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentsTab({ person }: { person: ExtendedProfile }) {
  const [cvPropagated, setCvPropagated] = useState(false);
  const [expandedDoc, setExpandedDoc]   = useState<string | null>(null);
  const cv = person.documents.find(d => d.isCV);

  const docTypeIcons: Record<string, React.ElementType> = {
    "CV":                   User,
    "License":              Award,
    "GCP Certificate":      Shield,
    "Training Certificate": GraduationCap,
    "Other":                FileText,
  };

  return (
    <div className="flex flex-col gap-4">
      {/* CV section — featured */}
      {cv && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${PRIMARY}22`, background: CARD_BG }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: "#F8F7FF", borderBottom: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EDE9FF" }}>
                <FileText size={15} style={{ color: PRIMARY }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Curriculum Vitae</p>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>{cv.version} · Uploaded {cv.uploadedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}>
                <Download size={12} /> Download
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}>
                <Upload size={12} /> Update CV
              </button>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: TEXT_DARK }}>
                Filed in {cv.linkedStudies.length} {cv.linkedStudies.length === 1 ? "study" : "studies"}
              </p>
              <button
                onClick={() => setCvPropagated(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={cvPropagated
                  ? { background: GREEN_BG, color: GREEN_TXT }
                  : { background: PRIMARY, color: "white" }}
              >
                {cvPropagated
                  ? <><CheckCircle size={12} /> Propagated to all studies</>
                  : <><RefreshCw size={12} /> Propagate CV to All Studies</>}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {cv.linkedStudies.map(study => (
                <div key={study} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
                  <CheckCircle size={12} style={{ color: cvPropagated ? GREEN_TXT : TEXT_MUTED }} />
                  <span className="text-xs font-medium" style={{ color: TEXT_DARK }}>{study}</span>
                  {cvPropagated && <span className="text-[10px] ml-auto" style={{ color: GREEN_TXT }}>Updated</span>}
                </div>
              ))}
            </div>
            {cv.linkedStudies.length === 0 && (
              <p className="text-xs" style={{ color: TEXT_MUTED }}>Not yet filed in any studies.</p>
            )}
          </div>
        </div>
      )}

      {/* Other documents */}
      <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
          <div className="flex items-center gap-2">
            <FileText size={15} style={{ color: PRIMARY }} />
            <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>All Documents</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: BORDER, color: TEXT_MID }}>
              {person.documents.length} files
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: PRIMARY, color: "white" }}>
            <Upload size={12} /> Upload Document
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {person.documents.map(doc => {
            const Icon = docTypeIcons[doc.type] ?? FileText;
            const isExpanded = expandedDoc === doc.id;
            return (
              <div key={doc.id}>
                <div
                  className="px-5 py-3.5 flex items-center gap-4 cursor-pointer hover:bg-[#FAF6F0] transition-colors"
                  onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: BORDER }}>
                    <Icon size={14} style={{ color: TEXT_MID }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{doc.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: BORDER, color: TEXT_MID }}>{doc.type}</span>
                      <span className="text-[10px]" style={{ color: TEXT_MUTED }}>{doc.version}</span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: TEXT_MUTED }}>
                      Uploaded {doc.uploadedAt} by {doc.uploadedBy}
                      {doc.expiresAt && ` · Expires ${doc.expiresAt}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <DocStatusBadge status={doc.docStatus} />
                    {isExpanded ? <ChevronDown size={14} style={{ color: TEXT_MUTED }} /> : <ChevronRight size={14} style={{ color: TEXT_MUTED }} />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-4 pt-1" style={{ background: "#FEFDFB" }}>
                    <div className="ml-12 space-y-2">
                      <p className="text-[11px] font-semibold" style={{ color: TEXT_MUTED }}>Filed in studies</p>
                      {doc.linkedStudies.length > 0
                        ? doc.linkedStudies.map(s => (
                          <div key={s} className="flex items-center gap-2">
                            <CheckCircle size={11} style={{ color: GREEN_TXT }} />
                            <span className="text-xs" style={{ color: TEXT_DARK }}>{s}</span>
                            {doc.isCV && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#EDE9FF", color: PRIMARY }}>
                                Investigator Files / PI CV
                              </span>
                            )}
                          </div>
                        ))
                        : <p className="text-xs" style={{ color: TEXT_MUTED }}>Not yet filed in any studies.</p>}
                      <div className="flex items-center gap-2 pt-2">
                        <button className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ color: PRIMARY, background: "#EDE9FF" }}>
                          <Download size={11} /> Download
                        </button>
                        <button className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md" style={{ color: TEXT_MID, background: BORDER }}>
                          <ExternalLink size={11} /> Open in eBinder
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {person.documents.length === 0 && (
            <div className="px-5 py-10 text-center">
              <FileText size={28} className="mx-auto mb-2" style={{ color: TEXT_MUTED }} />
              <p className="text-xs" style={{ color: TEXT_MUTED }}>No documents on file. Upload the first document above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AuditTab({ person }: { person: ExtendedProfile }) {
  const [filter, setFilter] = useState<AuditCategory | "All">("All");
  const [search, setSearch] = useState("");

  const categories: (AuditCategory | "All")[] = ["All", "Login", "Document", "Role", "Training", "Study", "System"];

  const filtered = person.auditLog.filter(e => {
    const matchCat = filter === "All" || e.category === filter;
    const matchSearch = search === "" ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.detail.toLowerCase().includes(search.toLowerCase()) ||
      (e.study ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
          <div className="flex items-center gap-2">
            <Activity size={15} style={{ color: PRIMARY }} />
            <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Access Log & Audit Trail</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: BORDER, color: TEXT_MID }}>
              {person.auditLog.length} events
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}>
            <Download size={12} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 flex items-center gap-3 flex-wrap" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: TEXT_MUTED }} />
            <input
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg"
              style={{ border: `1px solid ${BORDER}`, background: PAGE_BG, color: TEXT_DARK, width: 200 }}
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map(cat => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
                  style={isActive ? { background: PRIMARY, color: "white" } : { color: TEXT_MUTED, background: "transparent" }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Log entries */}
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs" style={{ color: TEXT_MUTED }}>No events match your filter.</p>
            </div>
          ) : filtered.map(entry => {
            const cfg = AUDIT_CATEGORY_COLORS[entry.category];
            const Icon = cfg.icon;
            return (
              <div key={entry.id} className="px-5 py-3 flex items-center gap-4">
                <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                  <Icon size={13} style={{ color: cfg.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{entry.action}</span>
                    {entry.study && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: "#EDE9FF", color: PRIMARY }}>
                        {entry.study}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: TEXT_MUTED }}>{entry.detail}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>{entry.category}</span>
                  <span className="text-[11px] whitespace-nowrap" style={{ color: TEXT_MUTED }}>{entry.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
type ProfileTab = "overview" | "training" | "study-roles" | "documents" | "audit";

export function PersonProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const person = PROFILE_MAP[Number(userId)];

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <User size={40} style={{ color: TEXT_MUTED }} />
        <p className="text-sm font-semibold" style={{ color: TEXT_DARK }}>User not found</p>
        <Link to="/users" className="text-xs font-medium" style={{ color: PRIMARY }}>← Back to Users</Link>
      </div>
    );
  }

  const TABS: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
    { id: "overview",     label: "Overview",     icon: User },
    { id: "training",     label: "Training",     icon: GraduationCap },
    { id: "study-roles",  label: "Study Roles",  icon: Layers },
    { id: "documents",    label: "Documents",    icon: FileText },
    { id: "audit",        label: "Audit Trail",  icon: Activity },
  ];

  const hasCompliance = person.gcpStatus !== "Current" || person.documents.some(d => d.docStatus === "Expired");
  const complianceDocs = person.documents.filter(d => d.docStatus !== "Current").length;

  return (
    <div className="flex flex-col min-h-full -m-6">
      {/* Back nav */}
      <div className="px-6 pt-5 pb-0" style={{ background: PAGE_BG }}>
        <Link to="/users" className="inline-flex items-center gap-1.5 text-xs font-medium mb-4" style={{ color: TEXT_MID }}>
          <ArrowLeft size={13} /> Back to Users
        </Link>
      </div>

      {/* Profile header */}
      <div className="px-6 pb-0" style={{ background: PAGE_BG }}>
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <div className="px-6 py-5 flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
              style={{ background: person.avatarColor }}
            >
              {person.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold" style={{ color: TEXT_DARK }}>{person.name}</h1>
                <RolePill role={person.role} />
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: person.status === "Active" ? GREEN_BG : RED_BG, color: person.status === "Active" ? GREEN_TXT : RED_TXT }}
                >
                  {person.status}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>{person.department} · {person.email}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="text-xs" style={{ color: TEXT_MUTED }}>
                  <StatusDot status={person.gcpStatus} />GCP: {person.gcpDate}
                </span>
                <span className="text-xs" style={{ color: TEXT_MUTED }}>Last active: {person.lastActive}</span>
                <span className="text-xs" style={{ color: TEXT_MUTED }}>Since {person.startDate}</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}>
                <Mail size={12} /> Message
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: PRIMARY, color: "white" }}>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 divide-x" style={{ borderTop: `1px solid ${BORDER}`, borderColor: BORDER }}>
            {[
              { label: "Active Studies",      value: person.studyRoles.filter(r => r.status === "Active").length,                                          sub: "assignments" },
              { label: "Training Complete",   value: `${Math.round((person.floAcademy.filter(c => c.status === "Completed").length / person.floAcademy.length) * 100)}%`, sub: "Flo Academy" },
              { label: "Documents on File",   value: person.documents.length,                                                                              sub: `${complianceDocs} need attention` },
              { label: "Days Since Login",    value: person.lastActive === "Today" ? "0" : person.lastActive === "Yesterday" ? "1" : person.lastActive.replace(/\D+(\d+).*/,"$1"), sub: person.lastActive },
            ].map(s => (
              <div key={s.label} className="px-5 py-3">
                <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: TEXT_MUTED }}>{s.label}</p>
                <p className="text-xl font-bold mt-0.5" style={{ color: hasCompliance && s.label === "Documents on File" && complianceDocs > 0 ? AMBER_TXT : TEXT_DARK }}>{s.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: TEXT_MUTED }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="px-6 pt-4 sticky top-0 z-10" style={{ background: PAGE_BG }}>
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: CARD_BG, border: `1px solid ${BORDER}`, width: "fit-content" }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={isActive ? { background: PRIMARY, color: "white" } : { color: TEXT_MID }}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-4 flex-1" style={{ background: PAGE_BG }}>
        {activeTab === "overview"    && <OverviewTab    person={person} />}
        {activeTab === "training"    && <TrainingTab    person={person} />}
        {activeTab === "study-roles" && <StudyRolesTab  person={person} />}
        {activeTab === "documents"   && <DocumentsTab   person={person} />}
        {activeTab === "audit"       && <AuditTab       person={person} />}
      </div>
    </div>
  );
}
