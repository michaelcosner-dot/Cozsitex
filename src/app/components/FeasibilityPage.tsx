import { useState } from "react";
import {
  Sparkles, Brain, CheckCircle, Clock, AlertTriangle, FileText,
  Search, Plus, ChevronDown, ChevronRight, BarChart2, Users,
  Building2, Send, RefreshCw, Star, TrendingUp, History, X,
} from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PRIMARY   = "#5C4EE5";
const PAGE_BG   = "#F2EDE6";
const CARD_BG   = "#FFFCF7";
const BORDER    = "#EDE5DA";
const BORDER2   = "#E3D8CC";
const TEXT_DARK = "#2D1F12";
const TEXT_MID  = "#3D3028";
const TEXT_MUTED = "#9CA3AF";
const GREEN     = "#038748";
const RED       = "#DC2626";
const PURPLE_BG = "#EDE9FF";
const PURPLE_TEXT = "#5C4EE5";

type TabId = "requests" | "library" | "databank" | "history";

// ── Mock data ─────────────────────────────────────────────────────────────────

interface FeasibilityRequest {
  id: number;
  sponsor: string;
  sponsorInitials: string;
  sponsorColor: string;
  studyTitle: string;
  therapeuticArea: string;
  receivedDate: string;
  deadline: string;
  deadlineUrgent: boolean;
  questionCount: number;
  aiMatchRate: number;
  status: "New" | "In Progress" | "Under Review";
  answeredCount: number;
}

const REQUESTS: FeasibilityRequest[] = [
  {
    id: 1,
    sponsor: "Novartis",
    sponsorInitials: "NV",
    sponsorColor: "#E07B39",
    studyTitle: "Phase III Oncology — ALK+ NSCLC (2nd line)",
    therapeuticArea: "Oncology",
    receivedDate: "Apr 18, 2026",
    deadline: "Apr 25, 2026",
    deadlineUrgent: true,
    questionCount: 47,
    aiMatchRate: 81,
    status: "In Progress",
    answeredCount: 32,
  },
  {
    id: 2,
    sponsor: "Pfizer",
    sponsorInitials: "PF",
    sponsorColor: "#2563EB",
    studyTitle: "Phase II Rheumatoid Arthritis — JAK inhibitor",
    therapeuticArea: "Immunology",
    receivedDate: "Apr 20, 2026",
    deadline: "May 2, 2026",
    deadlineUrgent: false,
    questionCount: 39,
    aiMatchRate: 74,
    status: "New",
    answeredCount: 0,
  },
  {
    id: 3,
    sponsor: "AstraZeneca",
    sponsorInitials: "AZ",
    sponsorColor: "#7C3AED",
    studyTitle: "Phase II Heart Failure — SGLT2 inhibitor extension",
    therapeuticArea: "Cardiology",
    receivedDate: "Apr 21, 2026",
    deadline: "May 5, 2026",
    deadlineUrgent: false,
    questionCount: 52,
    aiMatchRate: 68,
    status: "New",
    answeredCount: 0,
  },
];

interface Section {
  id: string;
  title: string;
  questions: {
    id: string;
    text: string;
    aiAnswer: string;
    state: "suggested" | "accepted" | "overridden";
    overrideValue?: string;
  }[];
}

const SECTIONS: Section[] = [
  {
    id: "capabilities",
    title: "Site Capabilities",
    questions: [
      {
        id: "q1", text: "Does your site have dedicated oncology clinic space?",
        aiAnswer: "Yes — 3 dedicated oncology exam rooms plus a 12-chair infusion suite.",
        state: "suggested",
      },
      {
        id: "q2", text: "What is your annual patient volume in this therapeutic area?",
        aiAnswer: "Approximately 420 oncology patients per year (2025 data).",
        state: "accepted",
      },
      {
        id: "q3", text: "Do you have on-site CT and PET imaging capabilities?",
        aiAnswer: "Yes — 64-slice CT available 7 days/week; PET available Mon–Fri with 48h scheduling.",
        state: "suggested",
      },
    ],
  },
  {
    id: "experience",
    title: "Therapeutic Experience",
    questions: [
      {
        id: "q4", text: "How many oncology trials has your site completed in the past 3 years?",
        aiAnswer: "8 completed oncology trials (2023–2025), including 3 Phase III studies.",
        state: "suggested",
      },
      {
        id: "q5", text: "Have you previously enrolled patients in ALK+ NSCLC studies?",
        aiAnswer: "Yes — enrolled 14 patients in PROTO-2023-041 (ALK+ NSCLC Phase II).",
        state: "accepted",
      },
      {
        id: "q6", text: "List any relevant publications or abstracts from your site investigators.",
        aiAnswer: "Dr. Reyes: 3 peer-reviewed publications in JCO (2023–2025). Dr. Chen: 1 ASCO abstract (2024).",
        state: "suggested",
      },
    ],
  },
  {
    id: "staff",
    title: "Staff & Credentials",
    questions: [
      {
        id: "q7", text: "Who is the proposed Principal Investigator and their subspecialty?",
        aiAnswer: "Dr. Maria Reyes, MD — Board-certified Medical Oncologist, subspecialty: thoracic malignancies.",
        state: "accepted",
      },
      {
        id: "q8", text: "How many dedicated Clinical Research Coordinators does your site employ?",
        aiAnswer: "4 full-time CRCs; 2 are oncology-dedicated with CCRP certification.",
        state: "suggested",
      },
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    questions: [
      {
        id: "q9", text: "Does your site use an EDC system? If so, which platform?",
        aiAnswer: "Medidata Rave (current version). Site is a certified Medidata partner site.",
        state: "suggested",
      },
      {
        id: "q10", text: "What is your investigational pharmacy storage capacity (refrigerated/frozen)?",
        aiAnswer: "Refrigerated: 48 cu ft; Frozen (−20°C): 12 cu ft; Ultra-low (−80°C): 8 cu ft.",
        state: "suggested",
      },
    ],
  },
  {
    id: "regulatory",
    title: "Regulatory History",
    questions: [
      {
        id: "q11", text: "Has your site had any FDA 483 observations in the past 5 years?",
        aiAnswer: "No 483 observations. Last FDA audit: March 2024 — no findings.",
        state: "accepted",
      },
      {
        id: "q12", text: "What is your average IRB approval timeline?",
        aiAnswer: "Average 18 days from submission to approval (full board); 7 days for expedited review.",
        state: "suggested",
      },
    ],
  },
];

interface LibraryEntry {
  id: number;
  sponsor: string;
  indication: string;
  submittedDate: string;
  questions: number;
  score: number | null;
}

const LIBRARY: LibraryEntry[] = [
  { id: 1, sponsor: "Roche", indication: "NSCLC — PD-L1", submittedDate: "Jan 14, 2026", questions: 44, score: 92 },
  { id: 2, sponsor: "Merck", indication: "Melanoma Phase II", submittedDate: "Nov 28, 2025", questions: 38, score: 88 },
  { id: 3, sponsor: "BMS", indication: "Colorectal — MSI-H", submittedDate: "Oct 3, 2025", questions: 51, score: null },
  { id: 4, sponsor: "Lilly", indication: "Breast Cancer CDK4/6", submittedDate: "Sep 17, 2025", questions: 42, score: 85 },
  { id: 5, sponsor: "Amgen", indication: "Lung — KRAS G12C", submittedDate: "Jul 8, 2025", questions: 35, score: 79 },
  { id: 6, sponsor: "Sanofi", indication: "Atopic Dermatitis", submittedDate: "May 22, 2025", questions: 29, score: 91 },
  { id: 7, sponsor: "Pfizer", indication: "RA — Phase III", submittedDate: "Mar 11, 2025", questions: 48, score: 87 },
  { id: 8, sponsor: "AbbVie", indication: "IBD — Crohn's", submittedDate: "Jan 30, 2025", questions: 33, score: null },
];

interface DataCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  completeness: number;
  warning: boolean;
  dataPoints: { label: string; value: string; updatedAt: string }[];
}

const DATA_CATEGORIES: DataCategory[] = [
  {
    id: "capabilities",
    label: "Site Capabilities",
    icon: <Building2 size={14} />,
    completeness: 89,
    warning: false,
    dataPoints: [
      { label: "Oncology exam rooms", value: "3 dedicated rooms", updatedAt: "Feb 2026" },
      { label: "Infusion chairs", value: "12 chairs", updatedAt: "Feb 2026" },
      { label: "Annual patient volume", value: "~420 oncology/yr", updatedAt: "Jan 2026" },
      { label: "Imaging (CT/PET)", value: "On-site; CT 7d/wk, PET M–F", updatedAt: "Mar 2026" },
    ],
  },
  {
    id: "experience",
    label: "Therapeutic Area Experience",
    icon: <BarChart2 size={14} />,
    completeness: 74,
    warning: false,
    dataPoints: [
      { label: "Oncology trials (3yr)", value: "8 completed", updatedAt: "Dec 2025" },
      { label: "ALK+ NSCLC experience", value: "14 patients enrolled", updatedAt: "Dec 2025" },
      { label: "Active TAs", value: "Oncology, Immunology, Cardiology", updatedAt: "Apr 2026" },
      { label: "Publications", value: "4 peer-reviewed (2023–2025)", updatedAt: "Jan 2026" },
    ],
  },
  {
    id: "staff",
    label: "Staff & Credentials",
    icon: <Users size={14} />,
    completeness: 91,
    warning: false,
    dataPoints: [
      { label: "Principal Investigator", value: "Dr. Maria Reyes, MD", updatedAt: "Apr 2026" },
      { label: "Dedicated CRCs", value: "4 FTE (2 oncology-certified)", updatedAt: "Mar 2026" },
      { label: "Sub-investigators", value: "3 board-certified", updatedAt: "Feb 2026" },
      { label: "CCRP certifications", value: "2 active", updatedAt: "Mar 2026" },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: <Building2 size={14} />,
    completeness: 67,
    warning: true,
    dataPoints: [
      { label: "EDC platform", value: "Medidata Rave", updatedAt: "Jan 2026" },
      { label: "Pharmacy storage (−80°C)", value: "8 cu ft", updatedAt: "Nov 2025" },
      { label: "Network bandwidth", value: "Not on file", updatedAt: "—" },
      { label: "Lab certifications", value: "CAP accredited", updatedAt: "Jan 2026" },
    ],
  },
  {
    id: "regulatory",
    label: "Regulatory History",
    icon: <FileText size={14} />,
    completeness: 95,
    warning: false,
    dataPoints: [
      { label: "Last FDA inspection", value: "Mar 2024 — no findings", updatedAt: "Mar 2024" },
      { label: "IRB avg. approval time", value: "18 days (full board)", updatedAt: "Apr 2026" },
      { label: "483 observations (5yr)", value: "None", updatedAt: "Apr 2026" },
      { label: "GCP training current", value: "Yes — all staff", updatedAt: "Feb 2026" },
    ],
  },
  {
    id: "financial",
    label: "Financial & Budget",
    icon: <TrendingUp size={14} />,
    completeness: 58,
    warning: true,
    dataPoints: [
      { label: "Overhead rate", value: "28%", updatedAt: "Jan 2026" },
      { label: "Avg. per-patient cost (onco)", value: "Not on file", updatedAt: "—" },
      { label: "Budget contact", value: "Sarah Kim, Finance", updatedAt: "Dec 2025" },
      { label: "Payment terms preference", value: "Net 30", updatedAt: "Nov 2025" },
    ],
  },
];

interface HistoryEntry {
  id: number;
  date: string;
  event: string;
  sponsor: string;
  study: string;
  outcome: "Selected" | "Not Selected" | "Pending" | "Submitted" | "Feedback";
}

const HISTORY_ENTRIES: HistoryEntry[] = [
  { id: 1, date: "Apr 18, 2026", event: "Feasibility submitted", sponsor: "Novartis", study: "ALK+ NSCLC Phase III", outcome: "Pending" },
  { id: 2, date: "Mar 5, 2026", event: "Site selected", sponsor: "Roche", study: "NSCLC PD-L1 Phase II", outcome: "Selected" },
  { id: 3, date: "Feb 20, 2026", event: "Sponsor feedback received", sponsor: "BMS", study: "Colorectal MSI-H", outcome: "Feedback" },
  { id: 4, date: "Jan 14, 2026", event: "Feasibility submitted", sponsor: "Roche", study: "NSCLC PD-L1 Phase II", outcome: "Submitted" },
  { id: 5, date: "Dec 2, 2025", event: "Site not selected", sponsor: "AZ", study: "EGFR exon 20 Phase I", outcome: "Not Selected" },
  { id: 6, date: "Nov 28, 2025", event: "Feasibility submitted", sponsor: "Merck", study: "Melanoma Phase II", outcome: "Submitted" },
  { id: 7, date: "Oct 15, 2025", event: "Site selected", sponsor: "Merck", study: "Melanoma Phase II", outcome: "Selected" },
  { id: 8, date: "Sep 17, 2025", event: "Feasibility submitted", sponsor: "Lilly", study: "Breast CDK4/6", outcome: "Submitted" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; accent?: string;
}) {
  return (
    <div
      className="flex-1 min-w-0 rounded-xl p-4 flex flex-col gap-1"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: TEXT_MUTED }}>{label}</span>
        <span style={{ color: accent ?? PRIMARY }}>{icon}</span>
      </div>
      <span className="text-2xl font-semibold" style={{ color: TEXT_DARK }}>{value}</span>
      {sub && <span className="text-xs" style={{ color: TEXT_MUTED }}>{sub}</span>}
    </div>
  );
}

function StatusBadge({ status }: { status: FeasibilityRequest["status"] }) {
  const styles: Record<FeasibilityRequest["status"], { bg: string; text: string }> = {
    "New":          { bg: "#E0F2FE", text: "#0369A1" },
    "In Progress":  { bg: PURPLE_BG, text: PURPLE_TEXT },
    "Under Review": { bg: "#FFF7ED", text: "#C2410C" },
  };
  const s = styles[status];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.text }}>
      {status}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: HistoryEntry["outcome"] }) {
  const map: Record<HistoryEntry["outcome"], { bg: string; text: string }> = {
    Selected:     { bg: "#D1FAE5", text: GREEN },
    "Not Selected": { bg: "#FEE2E2", text: RED },
    Pending:      { bg: PURPLE_BG, text: PURPLE_TEXT },
    Submitted:    { bg: "#F0F9FF", text: "#0369A1" },
    Feedback:     { bg: "#FFF7ED", text: "#C2410C" },
  };
  const s = map[outcome];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.text }}>
      {outcome}
    </span>
  );
}

// ── Incoming Requests tab ──────────────────────────────────────────────────────

function QuestionRow({ q, onAccept, onOverride, onEdit }: {
  q: Section["questions"][0];
  onAccept: () => void;
  onOverride: (val: string) => void;
  onEdit: () => void;
}) {
  const [editVal, setEditVal] = useState(q.overrideValue ?? q.aiAnswer);

  return (
    <div className="rounded-lg p-3 flex flex-col gap-2" style={{ background: "#FAFAF8", border: `1px solid ${BORDER}` }}>
      <p className="text-xs font-medium" style={{ color: TEXT_DARK }}>{q.text}</p>

      {q.state !== "overridden" && (
        <div className="rounded-md p-2.5" style={{ background: PURPLE_BG, border: `1px solid #C9C2FF` }}>
          <div className="flex items-center gap-1 mb-1">
            <Sparkles size={11} style={{ color: PURPLE_TEXT }} />
            <span className="text-xs font-semibold" style={{ color: PURPLE_TEXT }}>AI suggested</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: TEXT_MID }}>{q.aiAnswer}</p>
        </div>
      )}

      {q.state === "overridden" && (
        <div className="flex flex-col gap-1">
          <textarea
            className="w-full rounded-md text-xs p-2 resize-none focus:outline-none"
            rows={2}
            style={{ border: `1px solid ${BORDER2}`, background: CARD_BG, color: TEXT_DARK }}
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        {q.state === "suggested" && (
          <>
            <button
              onClick={onAccept}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md"
              style={{ background: "#D1FAE5", color: GREEN }}
            >
              <CheckCircle size={11} /> Accept
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md"
              style={{ background: "#F3F4F6", color: TEXT_MID }}
            >
              Edit
            </button>
            <button
              onClick={() => onOverride("")}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md"
              style={{ background: "#FEF2F2", color: RED }}
            >
              Override
            </button>
          </>
        )}
        {q.state === "accepted" && (
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: GREEN }}>
            <CheckCircle size={11} /> Accepted
          </span>
        )}
        {q.state === "overridden" && (
          <button
            onClick={() => onOverride(editVal)}
            className="text-xs font-medium px-2.5 py-1 rounded-md"
            style={{ background: PRIMARY, color: "#fff" }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}

function ResponsePanel({ req, onClose }: { req: FeasibilityRequest; onClose: () => void }) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["capabilities"]));
  const [sections, setSections] = useState<Section[]>(SECTIONS);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const updateQuestion = (secId: string, qId: string, patch: Partial<Section["questions"][0]>) => {
    setSections(prev => prev.map(s =>
      s.id !== secId ? s : {
        ...s,
        questions: s.questions.map(q => q.id !== qId ? q : { ...q, ...patch }),
      }
    ));
  };

  const totalQ = sections.reduce((a, s) => a + s.questions.length, 0);
  const answeredQ = sections.reduce((a, s) => a + s.questions.filter(q => q.state !== "suggested").length, 0);
  const progress = Math.round((answeredQ / totalQ) * 100);

  return (
    <div
      className="flex flex-col h-full overflow-hidden rounded-xl"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      {/* Panel header */}
      <div className="flex items-start justify-between p-4 border-b" style={{ borderColor: BORDER }}>
        <div>
          <p className="text-xs font-semibold" style={{ color: PURPLE_TEXT }}>{req.sponsor}</p>
          <h3 className="text-sm font-semibold mt-0.5" style={{ color: TEXT_DARK }}>{req.studyTitle}</h3>
          <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>{req.therapeuticArea}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
          <X size={14} style={{ color: TEXT_MUTED }} />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: TEXT_MID }}>
            {answeredQ} of {totalQ} questions answered
          </span>
          <span className="text-xs font-semibold" style={{ color: PRIMARY }}>{progress}%</span>
        </div>
        <div className="w-full rounded-full h-1.5" style={{ background: "#EDE9FF" }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%`, background: PRIMARY }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {sections.map(section => {
          const isOpen = expandedSections.has(section.id);
          return (
            <div
              key={section.id}
              className="rounded-lg overflow-hidden"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50"
                style={{ background: isOpen ? "#F7F4FF" : CARD_BG }}
              >
                <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{section.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: TEXT_MUTED }}>
                    {section.questions.filter(q => q.state !== "suggested").length}/{section.questions.length}
                  </span>
                  {isOpen
                    ? <ChevronDown size={13} style={{ color: TEXT_MUTED }} />
                    : <ChevronRight size={13} style={{ color: TEXT_MUTED }} />}
                </div>
              </button>
              {isOpen && (
                <div className="p-3 flex flex-col gap-2" style={{ background: "#FDFCFA" }}>
                  {section.questions.map(q => (
                    <QuestionRow
                      key={q.id}
                      q={q}
                      onAccept={() => updateQuestion(section.id, q.id, { state: "accepted" })}
                      onOverride={(val) => updateQuestion(section.id, q.id, { state: "overridden", overrideValue: val })}
                      onEdit={() => updateQuestion(section.id, q.id, { state: "overridden", overrideValue: q.aiAnswer })}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: BORDER }}>
        <button
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg text-white"
          style={{ background: PRIMARY }}
        >
          <Send size={14} />
          Submit Response
        </button>
      </div>
    </div>
  );
}

function IncomingRequestsTab() {
  const [selectedId, setSelectedId] = useState<number | null>(REQUESTS[0].id);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const selectedReq = REQUESTS.find(r => r.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* AI Banner */}
      {!bannerDismissed && (
        <div
          className="flex items-start gap-3 rounded-xl p-3.5"
          style={{ background: PURPLE_BG, border: `1px solid #C9C2FF` }}
        >
          <Brain size={16} style={{ color: PRIMARY, flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed flex-1" style={{ color: TEXT_MID }}>
            <span className="font-semibold" style={{ color: PRIMARY }}>AI Data Mapping is active</span>
            {" "}— site data is automatically matched to sponsor questions, reducing manual entry by an average of{" "}
            <span className="font-semibold">73%</span>. Review AI suggestions before submitting.
          </p>
          <button onClick={() => setBannerDismissed(true)} className="p-0.5 rounded">
            <X size={13} style={{ color: TEXT_MUTED }} />
          </button>
        </div>
      )}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Request list */}
        <div className="flex flex-col gap-3 w-80 flex-shrink-0 overflow-y-auto">
          {REQUESTS.map(req => (
            <button
              key={req.id}
              onClick={() => setSelectedId(req.id)}
              className="text-left rounded-xl p-4 flex flex-col gap-3 transition-all"
              style={{
                background: CARD_BG,
                border: `1.5px solid ${selectedId === req.id ? PRIMARY : BORDER}`,
                boxShadow: selectedId === req.id ? `0 0 0 2px ${PURPLE_BG}` : undefined,
              }}
            >
              {/* Sponsor row */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: req.sponsorColor }}
                >
                  {req.sponsorInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: TEXT_DARK }}>{req.sponsor}</p>
                  <p className="text-xs truncate" style={{ color: TEXT_MUTED }}>{req.therapeuticArea}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <StatusBadge status={req.status} />
                </div>
              </div>

              {/* Study title */}
              <p className="text-xs font-medium leading-snug" style={{ color: TEXT_MID }}>{req.studyTitle}</p>

              {/* Meta row */}
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs" style={{ color: TEXT_MUTED }}>
                  <Clock size={11} /> {req.receivedDate}
                </span>
                <span
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: req.deadlineUrgent ? RED : TEXT_MUTED }}
                >
                  <AlertTriangle size={11} /> Due {req.deadline}
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: TEXT_MUTED }}>{req.questionCount} questions</span>
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: PURPLE_BG, color: PURPLE_TEXT }}
                >
                  <Sparkles size={10} /> AI can pre-fill {req.aiMatchRate}%
                </span>
              </div>

              {/* Action button */}
              <button
                className="w-full text-xs font-semibold py-1.5 rounded-lg text-white"
                style={{ background: PRIMARY }}
                onClick={e => { e.stopPropagation(); setSelectedId(req.id); }}
              >
                {req.status === "New" ? "Start Response" : "Continue"}
              </button>
            </button>
          ))}
        </div>

        {/* Response panel */}
        <div className="flex-1 min-w-0">
          {selectedReq ? (
            <ResponsePanel req={selectedReq} onClose={() => setSelectedId(null)} />
          ) : (
            <div
              className="h-full rounded-xl flex flex-col items-center justify-center gap-3"
              style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
            >
              <FileText size={32} style={{ color: BORDER2 }} />
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Select a request to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Response Library tab ───────────────────────────────────────────────────────

function ResponseLibraryTab() {
  const [search, setSearch] = useState("");
  const filtered = LIBRARY.filter(e =>
    e.sponsor.toLowerCase().includes(search.toLowerCase()) ||
    e.indication.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      {/* Search bar */}
      <div className="p-4 border-b" style={{ borderColor: BORDER }}>
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: PAGE_BG, border: `1px solid ${BORDER2}` }}
        >
          <Search size={13} style={{ color: TEXT_MUTED }} />
          <input
            className="flex-1 text-xs bg-transparent outline-none"
            placeholder="Search by sponsor or indication…"
            style={{ color: TEXT_DARK }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["Sponsor", "Study / Indication", "Submitted", "Questions", "Score", "Action"].map(h => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold px-4 py-2.5"
                  style={{ color: TEXT_MUTED, background: "#F7F4F0" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr
                key={entry.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : undefined,
                  background: i % 2 === 0 ? CARD_BG : "#FDFAF6",
                }}
              >
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{entry.sponsor}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: TEXT_MID }}>{entry.indication}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: TEXT_MUTED }}>{entry.submittedDate}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: TEXT_MID }}>{entry.questions}</span>
                </td>
                <td className="px-4 py-3">
                  {entry.score !== null ? (
                    <div className="flex items-center gap-1">
                      <Star size={11} style={{ color: "#F59E0B" }} />
                      <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{entry.score}</span>
                    </div>
                  ) : (
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                    style={{ background: PURPLE_BG, color: PURPLE_TEXT }}
                  >
                    <RefreshCw size={11} /> Reuse as Template
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Site Data Bank tab ─────────────────────────────────────────────────────────

function CompletenessBar({ pct, warning }: { pct: number; warning: boolean }) {
  const color = warning ? "#F59E0B" : GREEN;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full h-1.5" style={{ background: BORDER }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}

function DataBankTab() {
  const [expandedCat, setExpandedCat] = useState<string | null>("capabilities");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: TEXT_MUTED }}>
          Structured site data used by AI for auto-filling sponsor questionnaires.
        </p>
        <button
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
          style={{ background: PRIMARY }}
        >
          <RefreshCw size={12} /> Update Data Bank
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DATA_CATEGORIES.map(cat => {
          const isOpen = expandedCat === cat.id;
          return (
            <div
              key={cat.id}
              className="rounded-xl overflow-hidden"
              style={{ background: CARD_BG, border: `1px solid ${cat.warning ? "#FCD34D" : BORDER}` }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedCat(isOpen ? null : cat.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: cat.warning ? "#F59E0B" : PRIMARY }}>{cat.icon}</span>
                  <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{cat.label}</span>
                  {cat.warning && (
                    <AlertTriangle size={12} style={{ color: "#F59E0B" }} />
                  )}
                </div>
                {isOpen
                  ? <ChevronDown size={13} style={{ color: TEXT_MUTED }} />
                  : <ChevronRight size={13} style={{ color: TEXT_MUTED }} />}
              </button>

              {/* Completeness bar */}
              <div className="px-4 pb-3">
                <CompletenessBar pct={cat.completeness} warning={cat.warning} />
                {cat.warning && (
                  <p className="text-xs mt-1" style={{ color: "#B45309" }}>
                    Low completeness — update to improve AI match accuracy
                  </p>
                )}
              </div>

              {/* Data points */}
              {isOpen && (
                <div className="border-t px-4 py-3 flex flex-col gap-2" style={{ borderColor: BORDER }}>
                  {cat.dataPoints.map((dp, i) => (
                    <div key={i} className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-medium" style={{ color: TEXT_MID }}>{dp.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: dp.value === "Not on file" ? TEXT_MUTED : TEXT_DARK }}>
                          {dp.value}
                        </p>
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: TEXT_MUTED }}>
                        {dp.updatedAt !== "—" ? `Updated ${dp.updatedAt}` : "Not on file"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── History tab ────────────────────────────────────────────────────────────────

function HistoryTab() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: BORDER, background: "#F7F4F0" }}>
        <p className="text-xs font-semibold" style={{ color: TEXT_DARK }}>Feasibility Activity Timeline</p>
      </div>
      <div className="divide-y" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
        {HISTORY_ENTRIES.map((entry, i) => (
          <div
            key={entry.id}
            className="px-4 py-3 flex items-center gap-4"
            style={{ borderColor: BORDER, background: i % 2 === 0 ? CARD_BG : "#FDFAF6" }}
          >
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: PURPLE_BG }}
              >
                <History size={14} style={{ color: PURPLE_TEXT }} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{entry.event}</p>
              <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
                {entry.sponsor} · {entry.study}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <OutcomeBadge outcome={entry.outcome} />
              <span className="text-xs" style={{ color: TEXT_MUTED }}>{entry.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function FeasibilityPage() {
  const [activeTab, setActiveTab] = useState<TabId>("requests");

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "requests",  label: "Incoming Requests", icon: <FileText size={13} /> },
    { id: "library",   label: "Response Library",  icon: <BarChart2 size={13} /> },
    { id: "databank",  label: "Site Data Bank",     icon: <Brain size={13} /> },
    { id: "history",   label: "History",            icon: <History size={13} /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: PAGE_BG }}>
      <div className="flex flex-col gap-6 p-6 max-w-[1400px] w-full mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: TEXT_DARK }}>Feasibility</h1>
            <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
              Manage sponsor questionnaires · AI-assisted data mapping reduces redundancy
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: PRIMARY }}
          >
            <Plus size={15} />
            New Response
          </button>
        </div>

        {/* ── Stats row ── */}
        <div className="flex gap-4">
          <StatCard
            label="Active Requests"
            value="3"
            sub="2 with approaching deadlines"
            icon={<FileText size={16} />}
          />
          <StatCard
            label="Completed This Year"
            value="14"
            sub="Up 3 from last year"
            icon={<CheckCircle size={16} />}
            accent={GREEN}
          />
          <StatCard
            label="Avg Response Time"
            value="2.4 days"
            sub="Target: ≤3 days"
            icon={<Clock size={16} />}
          />
          <StatCard
            label="Auto-filled by AI"
            value="73%"
            sub="Questions pre-answered"
            icon={<Sparkles size={16} />}
            accent={PURPLE_TEXT}
          />
        </div>

        {/* ── Tab nav + content ── */}
        <div className="flex flex-col gap-4">
          {/* Tab bar */}
          <div className="flex items-center gap-1">
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: active ? CARD_BG : "transparent",
                    color: active ? PRIMARY : TEXT_MUTED,
                    border: active ? `1px solid ${BORDER}` : "1px solid transparent",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "requests" && <IncomingRequestsTab />}
          {activeTab === "library"  && <ResponseLibraryTab />}
          {activeTab === "databank" && <DataBankTab />}
          {activeTab === "history"  && <HistoryTab />}
        </div>
      </div>
    </div>
  );
}
