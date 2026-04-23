import { Link, useNavigate } from "react-router";
import {
  Plus, AlertCircle, Clock, LinkIcon, MessageSquare, CheckCircle2,
  User, List, LayoutGrid, FileWarning, Zap, MoreVertical,
  ChevronDown, ChevronRight, ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { MultiSelect } from "./MultiSelect";

const TODAY = "2026-04-18";
const PRIMARY = "#5C4EE5";

// ── Mock data ─────────────────────────────────────────────────────────────
const MY_STUDIES = [
  { id: "001", protocol: "PROTO-2024-001", name: "Cardiac Intervention Trial",  sponsor: "CardioMed Inc",  phase: "Phase III", pi: "Dr. Martinez", therapeuticArea: "Cardiology",    enrollment: 45, target: 60, openTasks: 8,  overdueTasks: 2, connectedProducts: ["eBinders","eConsent","Budget"],              expiredDocs: 1, urgentActions: 2 },
  { id: "015", protocol: "PROTO-2024-015", name: "Diabetes Study Phase II",     sponsor: "EndoResearch",   phase: "Phase II",  pi: "Dr. Chen",     therapeuticArea: "Endocrinology", enrollment: 23, target: 40, openTasks: 5,  overdueTasks: 0, connectedProducts: ["eBinders","eConsent"],                        expiredDocs: 0, urgentActions: 0 },
  { id: "032", protocol: "PROTO-2024-032", name: "Oncology Trial",              sponsor: "OncoGenomics",   phase: "Phase I",   pi: "Dr. Martinez", therapeuticArea: "Oncology",      enrollment: 12, target: 30, openTasks: 12, overdueTasks: 1, connectedProducts: ["eBinders","Monitoring"],                      expiredDocs: 2, urgentActions: 1 },
  { id: "048", protocol: "PROTO-2024-048", name: "Neurology Phase III",         sponsor: "NeuroAdvance",   phase: "Phase III", pi: "Dr. Patel",    therapeuticArea: "Neurology",     enrollment: 67, target: 80, openTasks: 6,  overdueTasks: 0, connectedProducts: ["eBinders","eConsent","Budget","Monitoring"],  expiredDocs: 0, urgentActions: 0 },
];

const ALL_STUDIES = [
  ...MY_STUDIES,
  { id: "053", protocol: "PROTO-2024-053", name: "Pediatric Asthma Study",      sponsor: "RespiraTech",    phase: "Phase II",  pi: "Dr. Kim",      therapeuticArea: "Pulmonology",   enrollment: 0,  target: 50, openTasks: 15, overdueTasks: 3, connectedProducts: ["eBinders"],                                   expiredDocs: 1, urgentActions: 3 },
];

const MOCK_TASKS = [
  { id: 1, title: "Complete IRB submission",              study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  category: "Regulatory", dueDate: "2026-04-15", assignee: "Sarah Chen",    status: "overdue" },
  { id: 6, title: "Submit SAE follow-up report",          study: "PROTO-2024-032", studyName: "Oncology Trial",              category: "Regulatory", dueDate: "2026-04-16", assignee: "You",           status: "overdue" },
  { id: 2, title: "Review consent forms — v2.1 Spanish",  study: "PROTO-2024-015", studyName: "Diabetes Study Phase II",     category: "Consent",    dueDate: "2026-04-18", assignee: "You",           status: "pending" },
  { id: 7, title: "Prepare visit log for site monitor",   study: "PROTO-2024-048", studyName: "Neurology Phase III",         category: "Monitoring", dueDate: "2026-04-18", assignee: "You",           status: "in-progress" },
  { id: 3, title: "Upload monitoring report",             study: "PROTO-2024-032", studyName: "Oncology Trial",              category: "Monitoring", dueDate: "2026-04-20", assignee: "You",           status: "in-progress" },
  { id: 4, title: "Budget revision approval",             study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  category: "Budget",     dueDate: "2026-04-22", assignee: "Michael Torres", status: "pending" },
  { id: 5, title: "Site activation checklist",            study: "PROTO-2024-048", studyName: "Neurology Phase III",         category: "General",    dueDate: "2026-04-25", assignee: "You",           status: "pending" },
];

const MOCK_QUERIES = [
  { id: 1, subject: "Sub-045", study: "PROTO-2024-032", studyName: "Oncology Trial",              field: "Adverse Event Date",                    daysOpen: 5 },
  { id: 2, subject: "Sub-012", study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  field: "Visit date discrepancy — Visit 4",       daysOpen: 3 },
  { id: 3, subject: "Sub-023", study: "PROTO-2024-015", studyName: "Diabetes Study Phase II",     field: "Concomitant medication dose",             daysOpen: 1 },
];

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: "IRB Deadline — Action Required",         category: "Regulatory",       priority: "urgent",        requiresAck: true,  time: "1 hour ago",  from: "Site Director" },
  { id: 2, title: "Protocol Amendment — PROTO-2024-015",    category: "Protocol Update",  priority: "important",     requiresAck: true,  time: "4 hours ago", from: "Dr. Chen" },
  { id: 3, title: "System Maintenance Window",              category: "System",           priority: "informational", requiresAck: false, time: "Yesterday",   from: "IT Operations" },
  { id: 4, title: "GCP Training Renewal Required",          category: "Training",         priority: "important",     requiresAck: false, time: "2 days ago",  from: "Compliance" },
];

// ── External link icon config ─────────────────────────────────────────────
const LINK_ICON: Record<string, { bg: string; abbr: string }> = {
  "IRB":           { bg: "#7C3AED", abbr: "IRB" },
  "EDC":           { bg: "#0369A1", abbr: "EDC" },
  "IRT":           { bg: "#0F766E", abbr: "IRT" },
  "CTMS":          { bg: "#C2410C", abbr: "CTM" },
  "IWRS":          { bg: "#6B7280", abbr: "IWR" },
  "Training":      { bg: "#D97706", abbr: "TRN" },
  "Budget Portal": { bg: "#059669", abbr: "$" },
};

// ── Study expansion data ──────────────────────────────────────────────────
const STUDY_LINKS: Record<string, { label: string }[]> = {
  "001": [{ label: "IRB" }, { label: "EDC" }, { label: "IRT" }, { label: "CTMS" }, { label: "IWRS" }],
  "015": [{ label: "IRB" }, { label: "EDC" }, { label: "CTMS" }],
  "032": [{ label: "IRB" }, { label: "EDC" }, { label: "IRT" }, { label: "Training" }],
  "048": [{ label: "IRB" }, { label: "EDC" }, { label: "IRT" }, { label: "CTMS" }, { label: "Budget Portal" }],
  "053": [{ label: "IRB" }, { label: "EDC" }],
};

const STUDY_CONTACTS: Record<string, { role: string; name: string }[]> = {
  "001": [
    { role: "Monitor",          name: "Jennifer Walsh" },
    { role: "Medical Director", name: "Dr. Robert Hayes" },
    { role: "HelpDesk",         name: "CardioMed Support" },
    { role: "Shipping",         name: "MedFreight Inc." },
  ],
  "015": [
    { role: "Monitor",          name: "Marcus Liu" },
    { role: "Medical Director", name: "Dr. Lisa Park" },
    { role: "HelpDesk",         name: "EndoResearch Support" },
  ],
  "032": [
    { role: "Monitor",          name: "Sarah Okonjo" },
    { role: "Medical Director", name: "Dr. James Wu" },
    { role: "HelpDesk",         name: "OncoGenomics Support" },
    { role: "Shipping",         name: "BioShip Co." },
  ],
  "048": [
    { role: "Monitor",          name: "Alex Torres" },
    { role: "Medical Director", name: "Dr. Priya Sharma" },
    { role: "HelpDesk",         name: "NeuroAdvance Support" },
  ],
  "053": [
    { role: "Monitor",          name: "Chris Fernandez" },
    { role: "Medical Director", name: "Dr. Amy Lee" },
    { role: "HelpDesk",         name: "RespiraTech Support" },
    { role: "Shipping",         name: "ColdChain Logistics" },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────
const phaseStyle = (phase: string): React.CSSProperties => {
  if (phase === "Phase I")   return { background: "#FFF3CC", color: "#A55A00" };
  if (phase === "Phase II")  return { background: "#FDF1EA", color: "#A85948" };
  if (phase === "Phase III") return { background: "#EEF0FF", color: PRIMARY };
  return { background: "#F3F4F6", color: "#6B7280" };
};

const PRODUCT_COLOR: Record<string, string> = {
  eBinders:   PRIMARY,
  eConsent:   "#038748",
  Budget:     "#FF991F",
  Monitoring: "#F18067",
};

const PRIORITY_DOT: Record<string, string> = {
  urgent:        "#D30000",
  important:     "#FF991F",
  informational: "#CBD5E1",
};

function getTaskGroup(t: typeof MOCK_TASKS[0]): "overdue" | "today" | "thisWeek" | "upcoming" {
  if (t.status === "overdue" || t.dueDate < TODAY) return "overdue";
  if (t.dueDate === TODAY) return "today";
  const diff = (new Date(t.dueDate).getTime() - new Date(TODAY).getTime()) / 86400000;
  return diff <= 7 ? "thisWeek" : "upcoming";
}

const TASK_GROUPS = [
  { key: "overdue"  as const, label: "Overdue",    dot: "#D30000", bg: "#FFECEC", text: "#AC0000" },
  { key: "today"    as const, label: "Due Today",  dot: "#FF991F", bg: "#FFF3CC", text: "#A55A00" },
  { key: "thisWeek" as const, label: "This Week",  dot: "#038748", bg: "white",   text: "#374151" },
  { key: "upcoming" as const, label: "Upcoming",   dot: "#9CA3AF", bg: "white",   text: "#374151" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  overdue:      { bg: "#FFECEC", text: "#D30000" },
  "in-progress":{ bg: "#D4F4E0", text: "#038748" },
  completed:    { bg: "#D4F4E0", text: "#02512B" },
  pending:      { bg: "#F3F4F6", text: "#6B7280" },
};

// ── Component ─────────────────────────────────────────────────────────────
export function CRCHomepage() {
  const navigate = useNavigate();
  const [acked,           setAcked]           = useState<number[]>([]);
  const [studyTab,        setStudyTab]        = useState<"mine" | "all">("mine");
  const [studyView,       setStudyView]       = useState<"list" | "block">("list");
  const [filterCategory,  setFilterCategory]  = useState<string[]>([]);
  const [filterStatus,    setFilterStatus]    = useState<string[]>([]);
  const [expandedStudies, setExpandedStudies] = useState<string[]>([]);
  const [stickyNotes,     setStickyNotes]     = useState<Record<string, string>>({});

  const toggleExpand = (id: string) =>
    setExpandedStudies(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const displayedStudies = studyTab === "mine" ? MY_STUDIES : ALL_STUDIES;

  const filteredTasks = MOCK_TASKS.filter(t => {
    if (filterCategory.length > 0 && !filterCategory.includes(t.category.toLowerCase())) return false;
    if (filterStatus.length > 0 && !filterStatus.includes(t.status)) return false;
    return true;
  });

  const grouped = {
    overdue:  filteredTasks.filter(t => getTaskGroup(t) === "overdue"),
    today:    filteredTasks.filter(t => getTaskGroup(t) === "today"),
    thisWeek: filteredTasks.filter(t => getTaskGroup(t) === "thisWeek"),
    upcoming: filteredTasks.filter(t => getTaskGroup(t) === "upcoming"),
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Welcome back, Sarah</h1>
          <p className="text-sm text-gray-500 mt-0.5">Clinical Research Coordinator · Friday, April 18</p>
        </div>
        <button
          className="px-4 py-2 text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ background: PRIMARY }}
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* ── Announcements — compact ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-sm">Announcements</span>
          <span className="text-xs text-gray-400">
            {MOCK_ANNOUNCEMENTS.filter(a => a.requiresAck && !acked.includes(a.id)).length} need acknowledgement
          </span>
        </div>
        {MOCK_ANNOUNCEMENTS.map(ann => {
          const isAcked = acked.includes(ann.id);
          const dot = PRIORITY_DOT[ann.priority];
          return (
            <div
              key={ann.id}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50 last:border-b-0"
              style={{ opacity: isAcked ? 0.55 : 1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
              <span className="text-sm font-medium text-gray-900 flex-1 truncate min-w-0">{ann.title}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0 hidden sm:inline">{ann.category}</span>
              <span className="text-xs text-gray-400 flex-shrink-0 w-24 text-right hidden md:block">{ann.time}</span>
              <div className="w-16 flex-shrink-0 flex justify-end">
                {ann.requiresAck && !isAcked && (
                  <button
                    onClick={() => setAcked(p => [...p, ann.id])}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ background: PRIMARY }}
                  >
                    Ack
                  </button>
                )}
                {isAcked && <span className="text-[11px] font-medium text-green-700">✓ Done</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── My Studies / All Studies ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Card header: tabs + view toggle */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background: "#F3F4F6" }}>
            {([
              { key: "mine", label: `My Studies (${MY_STUDIES.length})` },
              { key: "all",  label: `All Studies (${ALL_STUDIES.length})` },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setStudyTab(tab.key)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={studyTab === tab.key
                  ? { background: "white", color: PRIMARY, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                  : { background: "transparent", color: "#6B7280" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            {([
              { key: "list",  Icon: List,       label: "List" },
              { key: "block", Icon: LayoutGrid, label: "Block" },
            ] as const).map(({ key, Icon, label }) => (
              <button
                key={key}
                onClick={() => setStudyView(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
                style={studyView === key
                  ? { background: "#F3F4F6", color: "#1F2937" }
                  : { background: "white", color: "#9CA3AF" }
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* LIST VIEW */}
        {studyView === "list" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "#FAFAFA" }}>
                <tr className="border-b border-gray-100">
                  {["Study", "Disease Group", "PI", "Sponsor", "Phase", "Enrollment", "Flags"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedStudies.map(study => {
                  const pct = study.target > 0 ? Math.round((study.enrollment / study.target) * 100) : 0;
                  const isExpanded = expandedStudies.includes(study.id);
                  const links = STUDY_LINKS[study.id] ?? [];
                  const contacts = STUDY_CONTACTS[study.id] ?? [];
                  return (
                    <>
                      <tr
                        key={study.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleExpand(study.id)}
                              className="p-0.5 rounded hover:bg-gray-200 text-gray-400 flex-shrink-0 transition-colors"
                            >
                              {isExpanded
                                ? <ChevronDown className="w-3.5 h-3.5" />
                                : <ChevronRight className="w-3.5 h-3.5" />}
                            </button>
                            <div className="cursor-pointer" onClick={() => navigate(`/study/${study.id}`)}>
                              <div className="font-semibold text-sm text-gray-900 hover:text-[#5C4EE5] transition-colors">{study.name}</div>
                              <div className="font-mono text-[11px] text-gray-400 mt-0.5">{study.protocol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{study.therapeuticArea}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{study.pi}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{study.sponsor}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap" style={phaseStyle(study.phase)}>
                            {study.phase}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-gray-800">{study.enrollment}<span className="font-normal text-gray-400">/{study.target}</span></div>
                          <div className="w-16 bg-gray-100 rounded-full h-1 mt-1.5">
                            <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: "#038748" }} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {study.expiredDocs > 0 && (
                              <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#FF991F" }} title="Expired documents">
                                <FileWarning className="w-3.5 h-3.5" />{study.expiredDocs}
                              </span>
                            )}
                            {study.urgentActions > 0 && (
                              <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#D30000" }} title="Urgent actions">
                                <Zap className="w-3.5 h-3.5" />{study.urgentActions}
                              </span>
                            )}
                            {!study.expiredDocs && !study.urgentActions && (
                              <span className="text-gray-300 text-sm">—</span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${study.id}-expand`} className="bg-gray-50/60 border-b border-gray-100">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-3 gap-5">

                              {/* External Links */}
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">External Links</div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                                  {links.map(link => {
                                    const cfg = LINK_ICON[link.label] ?? { bg: "#9CA3AF", abbr: link.label.slice(0, 3).toUpperCase() };
                                    return (
                                      <a
                                        key={link.label}
                                        href="#"
                                        onClick={e => e.preventDefault()}
                                        className="flex items-center gap-2 group/link"
                                      >
                                        <span
                                          className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-white font-bold"
                                          style={{ background: cfg.bg, fontSize: 7 }}
                                        >
                                          {cfg.abbr}
                                        </span>
                                        <span className="text-xs font-medium truncate group-hover/link:text-[#5C4EE5] transition-colors" style={{ color: "#374151" }}>
                                          {link.label}
                                        </span>
                                      </a>
                                    );
                                  })}
                                  <button className="flex items-center gap-2 text-xs font-medium" style={{ color: "#9CA3AF" }}>
                                    <span className="w-5 h-5 rounded border border-dashed flex items-center justify-center text-sm flex-shrink-0" style={{ borderColor: "#D5C7B8", color: "#B8A898" }}>+</span>
                                    Add link
                                  </button>
                                </div>
                              </div>

                              {/* Study Contacts */}
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Contacts</div>
                                <div className="space-y-1.5">
                                  {contacts.map(c => (
                                    <div key={c.role} className="flex items-center justify-between gap-2">
                                      <span className="text-[11px] text-gray-400 w-28 flex-shrink-0">{c.role}</span>
                                      <span className="text-xs font-medium text-gray-700 truncate">{c.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Sticky Note */}
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Notes</div>
                                <textarea
                                  rows={4}
                                  placeholder="Add a note…"
                                  value={stickyNotes[study.id] ?? ""}
                                  onChange={e => setStickyNotes(p => ({ ...p, [study.id]: e.target.value }))}
                                  className="w-full text-xs rounded-lg border px-2.5 py-2 resize-none focus:outline-none focus:border-[#5C4EE5]/50"
                                  style={{ background: "#FFFDE7", borderColor: "#E8DDD2", color: "#3D3028" }}
                                />
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* BLOCK VIEW */}
        {studyView === "block" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {displayedStudies.map(study => {
              const pct = study.target > 0 ? Math.round((study.enrollment / study.target) * 100) : 0;
              const hasFlags = study.expiredDocs > 0 || study.urgentActions > 0;
              return (
                <Link
                  key={study.id}
                  to={`/study/${study.id}`}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#5C4EE5]/30 transition-all group block"
                  style={{ background: "white" }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-gray-400">{study.protocol}</div>
                      <div className="font-semibold text-sm text-gray-900 mt-0.5 group-hover:text-[#4A3DC9] transition-colors leading-snug">{study.name}</div>
                    </div>
                    {hasFlags && (
                      <div className="flex gap-1 flex-shrink-0 mt-0.5">
                        {study.expiredDocs > 0 && <FileWarning className="w-4 h-4" style={{ color: "#FF991F" }} />}
                        {study.urgentActions > 0 && <Zap className="w-4 h-4" style={{ color: "#D30000" }} />}
                      </div>
                    )}
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
                    {[
                      { label: "Disease Group", value: study.therapeuticArea },
                      { label: "PI",     value: study.pi },
                      { label: "Sponsor", value: study.sponsor },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-[10px] text-gray-400">{label}</div>
                        <div className="text-xs font-medium text-gray-700 truncate">{value}</div>
                      </div>
                    ))}
                    <div>
                      <div className="text-[10px] text-gray-400">Phase</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={phaseStyle(study.phase)}>
                        {study.phase}
                      </span>
                    </div>
                  </div>

                  {/* Enrollment */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Enrollment</span>
                      <span className="font-semibold text-gray-700">{study.enrollment}/{study.target} <span className="font-normal text-gray-400">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: "#038748" }} />
                    </div>
                  </div>

                  {/* Connected products */}
                  <div className="flex flex-wrap gap-1">
                    {study.connectedProducts.map(p => (
                      <span key={p} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: "#F3F4F6", color: "#6B7280" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PRODUCT_COLOR[p] ?? "#9CA3AF" }} />
                        {p}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Tasks + Recent Queries — side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Tasks */}
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
            <div>
              <h2 className="font-semibold text-sm">My Tasks</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {grouped.overdue.length > 0 && <span style={{ color: "#D30000" }}>{grouped.overdue.length} overdue · </span>}
                {grouped.today.length > 0 && <span style={{ color: "#A55A00" }}>{grouped.today.length} due today · </span>}
                {filteredTasks.length} total
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <MultiSelect
                options={[
                  { value: "regulatory", label: "Regulatory" },
                  { value: "consent",    label: "Consent" },
                  { value: "monitoring", label: "Monitoring" },
                  { value: "budget",     label: "Budget" },
                  { value: "general",    label: "General" },
                ]}
                selected={filterCategory}
                onChange={setFilterCategory}
                placeholder="Category"
                className="w-36"
              />
              <MultiSelect
                options={[
                  { value: "pending",     label: "Pending" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "overdue",     label: "Overdue" },
                ]}
                selected={filterStatus}
                onChange={setFilterStatus}
                placeholder="Status"
                className="w-32"
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 460 }}>
            {TASK_GROUPS.map(group => {
              const tasks = grouped[group.key];
              if (tasks.length === 0) return null;
              return (
                <div key={group.key}>
                  <div className="flex items-center gap-2 px-4 py-1.5 border-b border-gray-100" style={{ background: group.bg }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: group.dot }} />
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: group.text }}>{group.label}</span>
                    <span className="text-[11px] ml-auto" style={{ color: group.text }}>{tasks.length}</span>
                  </div>
                  {tasks.map(task => {
                    const ss = STATUS_STYLE[task.status] ?? STATUS_STYLE.pending;
                    return (
                      <div key={task.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-sm font-medium text-gray-900 truncate">{task.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0" style={ss}>{task.status}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-mono">{task.study}</span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{task.category}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-[11px] text-gray-400">Due</div>
                          <div className="text-xs font-medium" style={{ color: task.status === "overdue" ? "#D30000" : "#374151" }}>
                            {task.dueDate.slice(5)}
                          </div>
                        </div>
                        <button className="flex-shrink-0 px-2.5 py-1 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">
                          View
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {filteredTasks.length === 0 && (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: "#038748" }} />
                <p className="text-sm font-medium text-gray-600">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: "#FF991F" }} />
              <h2 className="font-semibold text-sm">Recent Queries</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#FFF3CC", color: "#A55A00" }}>
              {MOCK_QUERIES.length} open
            </span>
          </div>

          <div className="overflow-y-auto flex-1" style={{ maxHeight: 460 }}>
            {MOCK_QUERIES.map(q => (
              <div key={q.id} className="px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{q.field}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{q.subject} · {q.studyName}</div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={q.daysOpen >= 3
                      ? { background: "#FFECEC", color: "#D30000" }
                      : { background: "#FFF3CC", color: "#A55A00" }
                    }
                  >
                    {q.daysOpen}d open
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-mono text-[11px] text-gray-400">{q.study}</span>
                  <button className="text-xs font-semibold hover:underline ml-auto" style={{ color: "#038748" }}>
                    Resolve in EDC →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100 flex-shrink-0">
            <button className="text-xs font-medium hover:underline" style={{ color: "#038748" }}>
              View all queries
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
