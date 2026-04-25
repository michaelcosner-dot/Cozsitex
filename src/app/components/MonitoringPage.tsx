import { useState, useMemo } from "react";
import {
  Calendar, Clock, AlertTriangle, CheckCircle, User, Building2,
  MapPin, Phone, Mail, Plus, Eye, Edit2, FileText, Filter,
  Search, ChevronDown, ExternalLink,
} from "lucide-react";

const PRIMARY = "#5C4EE5";
const PAGE_BG = "#F2EDE6";
const CARD_BG = "#FFFCF7";
const BORDER = "#EDE5DA";
const BORDER_2 = "#E3D8CC";
const TEXT_DARK = "#2D1F12";
const TEXT_MID = "#3D3028";
const TEXT_SOFT = "#4D3F34";

// ── Types ──────────────────────────────────────────────────────────────────
type VisitType = "On-Site" | "Remote" | "Hybrid";
type PrepStatus = "Ready" | "In Progress" | "Not Started";
type ReportStatus = "Submitted" | "Draft" | "Overdue";
type ActiveTab = "upcoming" | "recent" | "directory";

interface UpcomingVisit {
  id: string;
  studyProtocol: string;
  studyNickname: string;
  monitorName: string;
  monitorOrg: string;
  visitType: VisitType;
  scheduledDate: string;   // YYYY-MM-DD
  daysUntil: number;
  assignedCrc: string;
  prepStatus: PrepStatus;
  prepPct: number;         // 0-100
  lastVisitDate: string;
}

interface RecentVisit {
  id: string;
  studyProtocol: string;
  studyNickname: string;
  monitorName: string;
  monitorOrg: string;
  visitDate: string;
  visitType: VisitType;
  duration: string;        // "4h 30m"
  findingsCritical: number;
  findingsMajor: number;
  findingsMinor: number;
  followUpItems: number;
  followUpDue: string;
  reportStatus: ReportStatus;
}

interface MonitorContact {
  id: string;
  name: string;
  organization: string;
  studiesCount: number;
  nextVisit: string;
  phone: string;
  email: string;
  location: string;
}

// ── Sample data ────────────────────────────────────────────────────────────
const UPCOMING_VISITS: UpcomingVisit[] = [
  { id: "u1",  studyProtocol: "AFIBSTUDY1",    studyNickname: "JAVAHEART",   monitorName: "Rachel Kim",      monitorOrg: "ICON plc",        visitType: "On-Site",  scheduledDate: "2026-04-25", daysUntil: 4,  assignedCrc: "Sarah Chen",   prepStatus: "Ready",       prepPct: 100 , lastVisitDate: "2026-02-28" },
  { id: "u2",  studyProtocol: "PROTO-2024-032", studyNickname: "ONCOVAULT",   monitorName: "James Whitfield", monitorOrg: "Covance",          visitType: "On-Site",  scheduledDate: "2026-04-28", daysUntil: 7,  assignedCrc: "Amy Park",     prepStatus: "In Progress", prepPct: 68,   lastVisitDate: "2026-01-15" },
  { id: "u3",  studyProtocol: "PROTO-2024-048", studyNickname: "NEUROPILOT",  monitorName: "Maria Santos",    monitorOrg: "PRA Health",       visitType: "Hybrid",   scheduledDate: "2026-05-02", daysUntil: 11, assignedCrc: "Michael Torres",prepStatus: "In Progress", prepPct: 45,   lastVisitDate: "2026-02-10" },
  { id: "u4",  studyProtocol: "PROTO-2024-015", studyNickname: "DIABSOLVE",   monitorName: "Tom Eriksson",    monitorOrg: "EndoResearch",     visitType: "Remote",   scheduledDate: "2026-05-05", daysUntil: 14, assignedCrc: "Diana Ross",   prepStatus: "Ready",       prepPct: 100,  lastVisitDate: "2026-03-01" },
  { id: "u5",  studyProtocol: "PROTO-2024-061", studyNickname: "RHEUMPATH",   monitorName: "Priya Mehta",     monitorOrg: "Syneos Health",    visitType: "On-Site",  scheduledDate: "2026-05-09", daysUntil: 18, assignedCrc: "James Liu",    prepStatus: "Not Started", prepPct: 0,    lastVisitDate: "2026-01-22" },
  { id: "u6",  studyProtocol: "PROTO-2024-048", studyNickname: "NEUROPILOT",  monitorName: "David Park",      monitorOrg: "PRA Health",       visitType: "Remote",   scheduledDate: "2026-05-14", daysUntil: 23, assignedCrc: "Michael Torres",prepStatus: "Not Started", prepPct: 0,    lastVisitDate: "2026-03-10" },
  { id: "u7",  studyProtocol: "AFIBSTUDY1",    studyNickname: "JAVAHEART",   monitorName: "Rachel Kim",      monitorOrg: "ICON plc",         visitType: "On-Site",  scheduledDate: "2026-05-20", daysUntil: 29, assignedCrc: "Sarah Chen",   prepStatus: "Not Started", prepPct: 0,    lastVisitDate: "2026-04-25" },
  { id: "u8",  studyProtocol: "PROTO-2024-074", studyNickname: "BRIOWAVE",    monitorName: "Lydia Osei",      monitorOrg: "IQVIA",            visitType: "On-Site",  scheduledDate: "2026-05-28", daysUntil: 37, assignedCrc: "Amy Park",     prepStatus: "Not Started", prepPct: 0,    lastVisitDate: "" },
];

const RECENT_VISITS: RecentVisit[] = [
  { id: "r1",  studyProtocol: "PROTO-2024-032", studyNickname: "ONCOVAULT",  monitorName: "James Whitfield", monitorOrg: "Covance",       visitDate: "2026-04-10", visitType: "On-Site",  duration: "6h 0m",  findingsCritical: 0, findingsMajor: 2, findingsMinor: 3, followUpItems: 4, followUpDue: "2026-04-24", reportStatus: "Submitted" },
  { id: "r2",  studyProtocol: "AFIBSTUDY1",    studyNickname: "JAVAHEART",  monitorName: "Rachel Kim",      monitorOrg: "ICON plc",      visitDate: "2026-04-03", visitType: "On-Site",  duration: "5h 30m", findingsCritical: 1, findingsMajor: 1, findingsMinor: 2, followUpItems: 6, followUpDue: "2026-04-17", reportStatus: "Submitted" },
  { id: "r3",  studyProtocol: "PROTO-2024-048", studyNickname: "NEUROPILOT", monitorName: "Maria Santos",    monitorOrg: "PRA Health",    visitDate: "2026-03-28", visitType: "Hybrid",   duration: "4h 0m",  findingsCritical: 0, findingsMajor: 0, findingsMinor: 1, followUpItems: 1, followUpDue: "2026-04-11", reportStatus: "Submitted" },
  { id: "r4",  studyProtocol: "PROTO-2024-015", studyNickname: "DIABSOLVE",  monitorName: "Tom Eriksson",    monitorOrg: "EndoResearch",  visitDate: "2026-03-20", visitType: "Remote",   duration: "3h 0m",  findingsCritical: 0, findingsMajor: 1, findingsMinor: 0, followUpItems: 2, followUpDue: "2026-04-03", reportStatus: "Overdue"   },
  { id: "r5",  studyProtocol: "PROTO-2024-061", studyNickname: "RHEUMPATH",  monitorName: "Priya Mehta",     monitorOrg: "Syneos Health", visitDate: "2026-03-14", visitType: "On-Site",  duration: "7h 0m",  findingsCritical: 0, findingsMajor: 3, findingsMinor: 4, followUpItems: 5, followUpDue: "2026-03-28", reportStatus: "Submitted" },
  { id: "r6",  studyProtocol: "PROTO-2024-048", studyNickname: "NEUROPILOT", monitorName: "David Park",      monitorOrg: "PRA Health",    visitDate: "2026-03-10", visitType: "Remote",   duration: "2h 30m", findingsCritical: 0, findingsMajor: 0, findingsMinor: 0, followUpItems: 0, followUpDue: "",           reportStatus: "Draft"     },
  { id: "r7",  studyProtocol: "AFIBSTUDY1",    studyNickname: "JAVAHEART",  monitorName: "Rachel Kim",      monitorOrg: "ICON plc",      visitDate: "2026-03-05", visitType: "On-Site",  duration: "5h 0m",  findingsCritical: 0, findingsMajor: 1, findingsMinor: 2, followUpItems: 3, followUpDue: "2026-03-19", reportStatus: "Submitted" },
  { id: "r8",  studyProtocol: "PROTO-2024-032", studyNickname: "ONCOVAULT",  monitorName: "James Whitfield", monitorOrg: "Covance",       visitDate: "2026-02-26", visitType: "On-Site",  duration: "6h 30m", findingsCritical: 2, findingsMajor: 2, findingsMinor: 3, followUpItems: 8, followUpDue: "2026-03-12", reportStatus: "Submitted" },
  { id: "r9",  studyProtocol: "PROTO-2024-015", studyNickname: "DIABSOLVE",  monitorName: "Tom Eriksson",    monitorOrg: "EndoResearch",  visitDate: "2026-02-18", visitType: "Remote",   duration: "3h 30m", findingsCritical: 0, findingsMajor: 0, findingsMinor: 1, followUpItems: 1, followUpDue: "2026-03-04", reportStatus: "Submitted" },
  { id: "r10", studyProtocol: "PROTO-2024-061", studyNickname: "RHEUMPATH",  monitorName: "Priya Mehta",     monitorOrg: "Syneos Health", visitDate: "2026-02-10", visitType: "On-Site",  duration: "5h 30m", findingsCritical: 0, findingsMajor: 2, findingsMinor: 1, followUpItems: 3, followUpDue: "2026-02-24", reportStatus: "Submitted" },
];

const MONITOR_DIRECTORY: MonitorContact[] = [
  { id: "m1", name: "Rachel Kim",      organization: "ICON plc",       studiesCount: 2, nextVisit: "Apr 25, 2026", phone: "+1 617-555-0142", email: "r.kim@iconplc.com",      location: "Boston, MA" },
  { id: "m2", name: "James Whitfield", organization: "Covance",         studiesCount: 1, nextVisit: "Apr 28, 2026", phone: "+1 312-555-0183", email: "j.whitfield@covance.com", location: "Chicago, IL" },
  { id: "m3", name: "Maria Santos",    organization: "PRA Health",      studiesCount: 1, nextVisit: "May 2, 2026",  phone: "+1 919-555-0217", email: "m.santos@prahs.com",      location: "Raleigh, NC" },
  { id: "m4", name: "Tom Eriksson",    organization: "EndoResearch",    studiesCount: 1, nextVisit: "May 5, 2026",  phone: "+1 408-555-0294", email: "t.eriksson@endoresearch.com", location: "San Jose, CA" },
  { id: "m5", name: "Priya Mehta",     organization: "Syneos Health",   studiesCount: 1, nextVisit: "May 9, 2026",  phone: "+1 973-555-0156", email: "p.mehta@syneoshealth.com",location: "Morrisville, NJ" },
  { id: "m6", name: "David Park",      organization: "PRA Health",      studiesCount: 1, nextVisit: "May 14, 2026", phone: "+1 858-555-0231", email: "d.park@prahs.com",        location: "San Diego, CA" },
  { id: "m7", name: "Lydia Osei",      organization: "IQVIA",           studiesCount: 1, nextVisit: "May 28, 2026", phone: "+1 202-555-0178", email: "l.osei@iqvia.com",        location: "Washington, DC" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtDate = (d: string) => {
  if (!d) return "—";
  const [, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[+m - 1]} ${+day}`;
};

const fmtDateFull = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[+m - 1]} ${+day}, ${y}`;
};

// ── Badge components ───────────────────────────────────────────────────────
function VisitTypeBadge({ type }: { type: VisitType }) {
  const styles: Record<VisitType, { bg: string; text: string }> = {
    "On-Site": { bg: "#EEF0FF", text: PRIMARY },
    "Remote":  { bg: "#F0FDF4", text: "#15803D" },
    "Hybrid":  { bg: "#FFF7ED", text: "#9A3412" },
  };
  const s = styles[type];
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={s}>
      {type}
    </span>
  );
}

function PrepBadge({ status, pct }: { status: PrepStatus; pct: number }) {
  const styles: Record<PrepStatus, { bg: string; text: string; bar: string }> = {
    "Ready":       { bg: "#D4F4E0", text: "#02512B", bar: "#038748" },
    "In Progress": { bg: "#FFF3CC", text: "#A55A00", bar: "#D97706" },
    "Not Started": { bg: "#F3F4F6", text: "#6B7280", bar: "#D1D5DB" },
  };
  const s = styles[status];
  return (
    <div className="flex flex-col gap-1">
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap w-fit" style={{ background: s.bg, color: s.text }}>
        {status}
      </span>
      {status !== "Not Started" && (
        <div className="w-20 h-1 rounded-full" style={{ background: "#E5E7EB" }}>
          <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: s.bar }} />
        </div>
      )}
    </div>
  );
}

function ReportBadge({ status }: { status: ReportStatus }) {
  const styles: Record<ReportStatus, { bg: string; text: string }> = {
    "Submitted": { bg: "#D4F4E0", text: "#02512B" },
    "Draft":     { bg: "#FFF3CC", text: "#A55A00" },
    "Overdue":   { bg: "#FFECEC", text: "#D30000" },
  };
  const s = styles[status];
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={s}>
      {status}
    </span>
  );
}

function FindingsBadge({ critical, major, minor }: { critical: number; major: number; minor: number }) {
  if (critical === 0 && major === 0 && minor === 0) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#038748" }}>
        <CheckCircle className="w-3.5 h-3.5" /> None
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {critical > 0 && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#FFECEC", color: "#D30000" }}>
          {critical}C
        </span>
      )}
      {major > 0 && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#FFF3CC", color: "#A55A00" }}>
          {major}M
        </span>
      )}
      {minor > 0 && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#F3F4F6", color: "#6B7280" }}>
          {minor}m
        </span>
      )}
    </div>
  );
}

// ── KPI strip ─────────────────────────────────────────────────────────────
const KPI_CARDS = [
  {
    label: "Visits This Month",
    value: "12",
    sub: "Apr 2026",
    icon: Calendar,
    iconBg: "#EEF0FF",
    iconColor: PRIMARY,
    accent: PRIMARY,
  },
  {
    label: "Upcoming (30 days)",
    value: "8",
    sub: "Next visit in 4 days",
    icon: Clock,
    iconBg: "#FFF3CC",
    iconColor: "#A55A00",
    accent: "#D97706",
  },
  {
    label: "Overdue",
    value: "3",
    sub: "Requires attention",
    icon: AlertTriangle,
    iconBg: "#FFECEC",
    iconColor: "#D30000",
    accent: "#D30000",
  },
  {
    label: "Avg Days Since Last Visit",
    value: "47",
    sub: "Across active studies",
    icon: CheckCircle,
    iconBg: "#D4F4E0",
    iconColor: "#02512B",
    accent: "#038748",
  },
];

// ── Tab button ─────────────────────────────────────────────────────────────
function TabBtn({ label, active, count, onClick }: { label: string; active: boolean; count?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
      style={active
        ? { borderColor: PRIMARY, color: PRIMARY }
        : { borderColor: "transparent", color: "#9CA3AF" }
      }
    >
      {label}
      {count !== undefined && (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none"
          style={active
            ? { background: "#EEF0FF", color: PRIMARY }
            : { background: "#F3F4F6", color: "#9CA3AF" }
          }
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── Action button ──────────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors hover:bg-gray-50"
      style={{ borderColor: BORDER_2, color: TEXT_SOFT }}
      title={label}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

// ── Table header ───────────────────────────────────────────────────────────
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left whitespace-nowrap ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
        {children}
      </span>
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 align-middle text-sm ${className}`}>
      {children}
    </td>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function MonitoringPage() {
  const [activeTab, setActiveTab]         = useState<ActiveTab>("upcoming");
  const [search, setSearch]               = useState("");
  const [filterVisitType, setFilterVisitType] = useState<VisitType | "">("");
  const [filterCrc, setFilterCrc]         = useState("");
  const [dateRange, setDateRange]         = useState("90d");
  const [selectedUpcoming, setSelectedUpcoming] = useState<Set<string>>(new Set());
  const [allUpcomingSelected, setAllUpcomingSelected] = useState(false);
  const [hoveredUpcoming, setHoveredUpcoming] = useState<string | null>(null);
  const [selectedRecent, setSelectedRecent] = useState<Set<string>>(new Set());
  const [allRecentSelected, setAllRecentSelected] = useState(false);
  const [hoveredRecent, setHoveredRecent] = useState<string | null>(null);

  // Unique CRCs from upcoming list
  const allCrcs = useMemo(() =>
    [...new Set(UPCOMING_VISITS.map(v => v.assignedCrc))].sort(),
    []
  );

  const filteredUpcoming = useMemo(() => {
    let rows = [...UPCOMING_VISITS];
    if (search)           rows = rows.filter(r =>
      r.studyNickname.toLowerCase().includes(search.toLowerCase()) ||
      r.studyProtocol.toLowerCase().includes(search.toLowerCase()) ||
      r.monitorName.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVisitType)  rows = rows.filter(r => r.visitType === filterVisitType);
    if (filterCrc)        rows = rows.filter(r => r.assignedCrc === filterCrc);
    return rows;
  }, [search, filterVisitType, filterCrc]);

  const filteredRecent = useMemo(() => {
    let rows = [...RECENT_VISITS];
    if (search)           rows = rows.filter(r =>
      r.studyNickname.toLowerCase().includes(search.toLowerCase()) ||
      r.studyProtocol.toLowerCase().includes(search.toLowerCase()) ||
      r.monitorName.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVisitType)  rows = rows.filter(r => r.visitType === filterVisitType);
    return rows;
  }, [search, filterVisitType]);

  return (
    <div
      className="flex flex-col min-h-full -m-6"
      style={{ background: PAGE_BG }}
    >
      {/* ── Page header ── */}
      <div
        className="px-6 pt-5 pb-4 border-b flex items-start justify-between gap-4 flex-shrink-0"
        style={{ background: CARD_BG, borderColor: BORDER }}
      >
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: TEXT_DARK }}>
            Monitoring
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            Site-level IMV management — all studies
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-2 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: PRIMARY }}
        >
          <Plus className="w-3.5 h-3.5" /> Schedule Visit
        </button>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-4 gap-3 px-6 pt-5 pb-2">
        {KPI_CARDS.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 border"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: kpi.iconBg }}>
                <Icon className="w-4.5 h-4.5" style={{ color: kpi.iconColor }} />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-bold leading-none tracking-tight" style={{ color: kpi.accent }}>
                  {kpi.value}
                </div>
                <div className="text-[11px] font-semibold mt-0.5 truncate" style={{ color: TEXT_MID }}>
                  {kpi.label}
                </div>
                <div className="text-[10px] mt-0.5 truncate" style={{ color: "#9CA3AF" }}>
                  {kpi.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main card ── */}
      <div
        className="mx-6 mb-6 mt-3 rounded-xl border flex flex-col overflow-hidden"
        style={{ background: CARD_BG, borderColor: BORDER }}
      >
        {/* Tab bar */}
        <div className="flex items-center border-b px-1" style={{ borderColor: BORDER }}>
          <TabBtn label="Upcoming Visits" active={activeTab === "upcoming"} count={UPCOMING_VISITS.length} onClick={() => setActiveTab("upcoming")} />
          <TabBtn label="Recent Visits"   active={activeTab === "recent"}   count={RECENT_VISITS.length}   onClick={() => setActiveTab("recent")} />
          <TabBtn label="Monitor Directory" active={activeTab === "directory"} count={MONITOR_DIRECTORY.length} onClick={() => setActiveTab("directory")} />
        </div>

        {/* Filter bar */}
        {activeTab !== "directory" && (
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b flex-wrap"
            style={{ background: "#FAF7F2", borderColor: BORDER }}
          >
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search study, monitor…"
                className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-lg focus:outline-none"
                style={{ borderColor: BORDER_2, background: "white", color: TEXT_DARK }}
              />
            </div>

            {/* Visit type filter */}
            <div className="relative">
              <select
                value={filterVisitType}
                onChange={e => setFilterVisitType(e.target.value as VisitType | "")}
                className="appearance-none text-xs border rounded-lg pl-2.5 pr-6 py-1.5 focus:outline-none cursor-pointer"
                style={{
                  borderColor: filterVisitType ? PRIMARY : BORDER_2,
                  color: filterVisitType ? PRIMARY : "#6B7280",
                  background: filterVisitType ? "#F0EEFF" : "white",
                }}
              >
                <option value="">Visit Type</option>
                <option value="On-Site">On-Site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* CRC filter (upcoming only) */}
            {activeTab === "upcoming" && (
              <div className="relative">
                <select
                  value={filterCrc}
                  onChange={e => setFilterCrc(e.target.value)}
                  className="appearance-none text-xs border rounded-lg pl-2.5 pr-6 py-1.5 focus:outline-none cursor-pointer"
                  style={{
                    borderColor: filterCrc ? PRIMARY : BORDER_2,
                    color: filterCrc ? PRIMARY : "#6B7280",
                    background: filterCrc ? "#F0EEFF" : "white",
                  }}
                >
                  <option value="">CRC</option>
                  {allCrcs.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}

            {/* Date range filter (recent only) */}
            {activeTab === "recent" && (
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="appearance-none text-xs border rounded-lg pl-2.5 pr-6 py-1.5 focus:outline-none cursor-pointer"
                  style={{ borderColor: BORDER_2, color: "#6B7280", background: "white" }}
                >
                  <option value="30d">Last 30 days</option>
                  <option value="60d">Last 60 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}

            {(search || filterVisitType || filterCrc) && (
              <button
                onClick={() => { setSearch(""); setFilterVisitType(""); setFilterCrc(""); }}
                className="text-xs font-medium hover:underline"
                style={{ color: PRIMARY }}
              >
                Clear
              </button>
            )}

            <span className="ml-auto text-[11px]" style={{ color: "#9CA3AF" }}>
              {activeTab === "upcoming" ? filteredUpcoming.length : filteredRecent.length} records
            </span>
          </div>
        )}

        {/* ── Upcoming Visits table ── */}
        {activeTab === "upcoming" && (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr style={{ background: "#FFFCF7", borderBottom: "2px solid #EDE5DA" }}>
                  <th className="px-4 py-3 text-center" style={{ width: 42 }}>
                    <input type="checkbox" checked={allUpcomingSelected} onChange={() => {
                      if (allUpcomingSelected) { setSelectedUpcoming(new Set()); setAllUpcomingSelected(false); }
                      else { setSelectedUpcoming(new Set(filteredUpcoming.map(v => v.id))); setAllUpcomingSelected(true); }
                    }} style={{ cursor: "pointer" }} />
                  </th>
                  <Th>Study</Th>
                  <Th>Monitor</Th>
                  <Th>Visit Type</Th>
                  <Th>Scheduled Date</Th>
                  <Th>Assigned CRC</Th>
                  <Th>Prep Status</Th>
                  <Th>Last Visit</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredUpcoming.map(v => {
                  const isUrgent = v.daysUntil <= 7 && v.prepStatus !== "Ready";
                  const isSelected = selectedUpcoming.has(v.id);
                  const isHovered = hoveredUpcoming === v.id;
                  const rowBg = isSelected ? "#F5EDDE" : isHovered ? "#FAF6F0" : isUrgent ? "#FFF8F8" : "#FFFCF7";
                  return (
                    <tr
                      key={v.id}
                      className="transition-colors"
                      style={{ borderBottom: "1px solid #EDE5DA", background: rowBg }}
                      onMouseEnter={() => setHoveredUpcoming(v.id)}
                      onMouseLeave={() => setHoveredUpcoming(null)}
                    >
                      <td className="px-4 py-3 text-center align-middle" style={{ width: 42 }} onClick={() => {
                        setSelectedUpcoming(prev => { const next = new Set(prev); next.has(v.id) ? next.delete(v.id) : next.add(v.id); return next; });
                      }}>
                        <input type="checkbox" checked={isSelected} onChange={() => {}} style={{ cursor: "pointer" }} />
                      </td>
                      <Td>
                        <div className="font-semibold text-xs" style={{ color: TEXT_DARK }}>{v.studyNickname}</div>
                        <div className="font-mono text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{v.studyProtocol}</div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: PRIMARY }}>
                            {v.monitorName.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-xs font-medium" style={{ color: TEXT_MID }}>{v.monitorName}</div>
                            <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{v.monitorOrg}</div>
                          </div>
                        </div>
                      </Td>
                      <Td><VisitTypeBadge type={v.visitType} /></Td>
                      <Td>
                        <div className="text-xs font-semibold" style={{ color: v.daysUntil <= 7 ? "#D97706" : TEXT_MID }}>{fmtDateFull(v.scheduledDate)}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: v.daysUntil <= 7 ? "#D97706" : "#9CA3AF" }}>in {v.daysUntil} days</div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1 text-xs" style={{ color: TEXT_SOFT }}>
                          <User className="w-3 h-3 text-gray-400 flex-shrink-0" />{v.assignedCrc}
                        </div>
                      </Td>
                      <Td><PrepBadge status={v.prepStatus} pct={v.prepPct} /></Td>
                      <Td>
                        <div className="text-xs" style={{ color: v.lastVisitDate ? TEXT_SOFT : "#9CA3AF" }}>
                          {v.lastVisitDate ? fmtDateFull(v.lastVisitDate) : "No prior visit"}
                        </div>
                      </Td>
                      <Td>
                        <div className={`flex items-center gap-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
                          <ActionBtn icon={Eye}      label="View" />
                          <ActionBtn icon={Edit2}    label="Reschedule" />
                          <ActionBtn icon={FileText} label="Notes" />
                        </div>
                      </Td>
                    </tr>
                  );
                })}
                {filteredUpcoming.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-14 text-center text-sm" style={{ color: "#9CA3AF" }}>
                      No upcoming visits match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Status bar */}
            <div style={{ background: "#FAF7F3", borderTop: "1px solid #EDE5DA", padding: "4px 16px", display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "#9CA3AF" }}>
              <span>Total Rows: {filteredUpcoming.length}</span>
              <span>|</span>
              <span>Selected: {selectedUpcoming.size}</span>
            </div>
          </div>
        )}

        {/* ── Recent Visits table ── */}
        {activeTab === "recent" && (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead style={{ position: "sticky", top: 0, zIndex: 1, background: "#FFFCF7" }}>
                <tr style={{ borderBottom: "2px solid #EDE5DA" }}>
                  <Th>Study</Th>
                  <Th>Monitor</Th>
                  <Th>Visit Date</Th>
                  <Th>Type</Th>
                  <Th>Duration</Th>
                  <Th>Findings</Th>
                  <Th>Follow-up</Th>
                  <Th>Report</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredRecent.map(v => {
                  const followUpOverdue = v.followUpDue && v.followUpDue < "2026-04-21" && v.followUpItems > 0;
                  return (
                    <tr
                      key={v.id}
                      className="border-b transition-colors group/row"
                      style={{ borderColor: "#EDE5DA", background: "#FFFCF7" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#FAF6F0")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#FFFCF7")}
                    >
                      <Td>
                        <div className="font-semibold text-xs" style={{ color: TEXT_DARK }}>
                          {v.studyNickname}
                        </div>
                        <div className="font-mono text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>
                          {v.studyProtocol}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: "#6B7280" }}>
                            {v.monitorName.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-xs font-medium" style={{ color: TEXT_MID }}>{v.monitorName}</div>
                            <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{v.monitorOrg}</div>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <div className="text-xs font-medium" style={{ color: TEXT_SOFT }}>
                          {fmtDateFull(v.visitDate)}
                        </div>
                      </Td>
                      <Td><VisitTypeBadge type={v.visitType} /></Td>
                      <Td>
                        <div className="flex items-center gap-1 text-xs" style={{ color: TEXT_SOFT }}>
                          <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          {v.duration}
                        </div>
                      </Td>
                      <Td>
                        <FindingsBadge
                          critical={v.findingsCritical}
                          major={v.findingsMajor}
                          minor={v.findingsMinor}
                        />
                      </Td>
                      <Td>
                        {v.followUpItems > 0 ? (
                          <div>
                            <div className="text-xs font-semibold" style={{ color: followUpOverdue ? "#D30000" : TEXT_SOFT }}>
                              {v.followUpItems} item{v.followUpItems !== 1 ? "s" : ""}
                            </div>
                            <div className="text-[10px] mt-0.5" style={{ color: followUpOverdue ? "#D30000" : "#9CA3AF" }}>
                              Due {fmtDate(v.followUpDue)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: "#9CA3AF" }}>—</span>
                        )}
                      </Td>
                      <Td><ReportBadge status={v.reportStatus} /></Td>
                      <Td>
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <ActionBtn icon={FileText}    label="View Report" />
                          <ActionBtn icon={ExternalLink} label="Follow-up" />
                        </div>
                      </Td>
                    </tr>
                  );
                })}
                {filteredRecent.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-14 text-center text-sm" style={{ color: "#9CA3AF" }}>
                      No recent visits match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Monitor Directory ── */}
        {activeTab === "directory" && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>
                  Assigned Monitors
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                  {MONITOR_DIRECTORY.length} monitors currently assigned to this site
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  placeholder="Search monitors…"
                  className="pl-8 pr-3 py-1.5 text-xs border rounded-lg focus:outline-none"
                  style={{ borderColor: BORDER_2, background: "white", color: TEXT_DARK, width: 200 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {MONITOR_DIRECTORY.map(m => (
                <div
                  key={m.id}
                  className="border rounded-xl p-4 transition-shadow hover:shadow-sm group/card"
                  style={{ borderColor: BORDER_2, background: "#FFFEFB" }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: PRIMARY }}
                    >
                      {m.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate" style={{ color: TEXT_DARK }}>
                        {m.name}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] mt-0.5 truncate" style={{ color: "#9CA3AF" }}>
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        {m.organization}
                      </div>
                    </div>
                    <span
                      className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#EEF0FF", color: PRIMARY }}
                    >
                      {m.studiesCount} {m.studiesCount === 1 ? "study" : "studies"}
                    </span>
                  </div>

                  {/* Details */}
                  <div
                    className="space-y-1.5 pt-3 border-t"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: TEXT_SOFT }}>
                      <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-400">Next visit:</span>
                      <span className="font-semibold" style={{ color: PRIMARY }}>{m.nextVisit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: TEXT_SOFT }}>
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      {m.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: TEXT_SOFT }}>
                      <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      {m.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: TEXT_SOFT }}>
                      <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-2.5 border-t opacity-0 group-hover/card:opacity-100 transition-opacity" style={{ borderColor: BORDER }}>
                    <button
                      className="flex-1 text-[11px] font-medium py-1 rounded border text-center transition-colors hover:bg-gray-50"
                      style={{ borderColor: BORDER_2, color: TEXT_SOFT }}
                    >
                      View Profile
                    </button>
                    <button
                      className="flex-1 text-[11px] font-medium py-1 rounded border text-center transition-colors hover:bg-[#EEF0FF]"
                      style={{ borderColor: PRIMARY, color: PRIMARY }}
                    >
                      Schedule Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
