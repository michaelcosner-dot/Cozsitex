import { useState, useMemo } from "react";
import {
  FileText, Clock, AlertTriangle, Mail, Download, Search,
  CheckCircle, BarChart2, Users, TrendingUp, Shield, Activity,
  FileWarning, Archive,
} from "lucide-react";

const PRIMARY = "#5C4EE5";

// ── Types ─────────────────────────────────────────────────────────────────
type DocType   = "ICF" | "SOP" | "Regulatory" | "Training";
type DocStatus = "Expired" | "Expiring Soon" | "Pending Renewal";
type DocFilter = "All" | DocStatus;

interface ExpiredDoc {
  id: number;
  studyProtocol: string;
  studyNickname: string;
  documentName: string;
  type: DocType;
  contactName: string;
  contactRole: string;
  expirationDate: string;
  daysExpired: number; // negative = days until expiry
  status: DocStatus;
}

interface ReportCard {
  icon: React.ReactNode;
  name: string;
  description: string;
  lastRun: string;
  accent: string;
}

// ── Mock data: Expired docs ───────────────────────────────────────────────
const EXPIRED_DOCS: ExpiredDoc[] = [
  {
    id: 1, studyProtocol: "PROTO-2024-001", studyNickname: "JAVAHEART",
    documentName: "Informed Consent Form v2.1", type: "ICF",
    contactName: "Dr. Martinez", contactRole: "PI",
    expirationDate: "2026-02-14", daysExpired: 66, status: "Expired",
  },
  {
    id: 2, studyProtocol: "PROTO-2024-032", studyNickname: "ONCOVAULT",
    documentName: "GCP Training Certificate — S. Chen", type: "Training",
    contactName: "Sarah Chen", contactRole: "CRC Lead",
    expirationDate: "2026-03-01", daysExpired: 51, status: "Expired",
  },
  {
    id: 3, studyProtocol: "PROTO-2024-053", studyNickname: "ASTHMAPLUS",
    documentName: "Site Delegation Log v1.0", type: "Regulatory",
    contactName: "Dr. Kim", contactRole: "PI",
    expirationDate: "2026-03-20", daysExpired: 32, status: "Expired",
  },
  {
    id: 4, studyProtocol: "PROTO-2024-015", studyNickname: "DIABSOLVE",
    documentName: "Protocol Amendment SOP v3.4", type: "SOP",
    contactName: "Dr. Chen", contactRole: "PI",
    expirationDate: "2026-04-10", daysExpired: 11, status: "Expired",
  },
  {
    id: 5, studyProtocol: "PROTO-2024-048", studyNickname: "NEUROPILOT",
    documentName: "Pharmacy Procedures Manual", type: "SOP",
    contactName: "M. Torres", contactRole: "CRC",
    expirationDate: "2026-04-18", daysExpired: 3, status: "Expired",
  },
  {
    id: 6, studyProtocol: "PROTO-2024-061", studyNickname: "RHEUMPATH",
    documentName: "Investigational Product Handling SOP", type: "SOP",
    contactName: "Dr. Singh", contactRole: "PI",
    expirationDate: "2026-04-25", daysExpired: -4, status: "Expiring Soon",
  },
  {
    id: 7, studyProtocol: "PROTO-2024-001", studyNickname: "JAVAHEART",
    documentName: "Monitoring Visit Log Template v2", type: "Regulatory",
    contactName: "Amy Park", contactRole: "CRC",
    expirationDate: "2026-04-29", daysExpired: -8, status: "Expiring Soon",
  },
  {
    id: 8, studyProtocol: "PROTO-2024-074", studyNickname: "BRIOWAVE",
    documentName: "Financial Disclosure Form — Okafor", type: "Regulatory",
    contactName: "Dr. Okafor", contactRole: "PI",
    expirationDate: "2026-05-05", daysExpired: -14, status: "Expiring Soon",
  },
  {
    id: 9, studyProtocol: "PROTO-2024-032", studyNickname: "ONCOVAULT",
    documentName: "Radiation Safety Training — J. Liu", type: "Training",
    contactName: "James Liu", contactRole: "Sub-I",
    expirationDate: "2026-05-12", daysExpired: -21, status: "Expiring Soon",
  },
  {
    id: 10, studyProtocol: "PROTO-2023-088", studyNickname: "CARDIO-X9",
    documentName: "Consent Addendum — Spanish v1.3", type: "ICF",
    contactName: "Dr. Martinez", contactRole: "PI",
    expirationDate: "2026-05-18", daysExpired: -27, status: "Pending Renewal",
  },
  {
    id: 11, studyProtocol: "PROTO-2024-053", studyNickname: "ASTHMAPLUS",
    documentName: "Lab Reference Ranges v4.0", type: "Regulatory",
    contactName: "Diana Ross", contactRole: "CRC",
    expirationDate: "2026-05-22", daysExpired: -31, status: "Pending Renewal",
  },
  {
    id: 12, studyProtocol: "PROTO-2024-048", studyNickname: "NEUROPILOT",
    documentName: "Biospecimen Handling SOP v2.2", type: "SOP",
    contactName: "Dr. Patel", contactRole: "PI",
    expirationDate: "2026-06-01", daysExpired: -41, status: "Pending Renewal",
  },
];

// ── Report cards ──────────────────────────────────────────────────────────
const REPORT_CARDS: ReportCard[] = [
  {
    icon: <Users className="w-4 h-4" />,
    name: "Enrollment Status",
    description: "Current enrollment vs target across all active studies",
    lastRun: "Today, 8:02 AM",
    accent: PRIMARY,
  },
  {
    icon: <FileWarning className="w-4 h-4" />,
    name: "Document Expiration",
    description: "Studies with documents expiring in next 30/60/90 days",
    lastRun: "Today, 7:45 AM",
    accent: "#D97706",
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    name: "Protocol Deviations",
    description: "Open and closed deviations by study and severity",
    lastRun: "Yesterday, 4:30 PM",
    accent: "#D30000",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    name: "Staff Training Compliance",
    description: "Training completion rates by staff member and study",
    lastRun: "Apr 19, 2026",
    accent: "#038748",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    name: "Budget Burn Rate",
    description: "Actual vs projected spend per study",
    lastRun: "Apr 18, 2026",
    accent: "#7C3AED",
  },
  {
    icon: <BarChart2 className="w-4 h-4" />,
    name: "Monitoring Visit Log",
    description: "Scheduled, completed, and overdue IMV/remote visits",
    lastRun: "Apr 17, 2026",
    accent: "#0891B2",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    name: "Consent Version Compliance",
    description: "Subjects on outdated consent versions",
    lastRun: "Apr 16, 2026",
    accent: "#B45309",
  },
  {
    icon: <Activity className="w-4 h-4" />,
    name: "Adverse Event Summary",
    description: "SAE/AE counts by study and severity",
    lastRun: "Apr 15, 2026",
    accent: "#BE185D",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const TYPE_STYLE: Record<DocType, { bg: string; text: string }> = {
  ICF:        { bg: "#EEF0FF", text: PRIMARY },
  SOP:        { bg: "#FFF3CC", text: "#A55A00" },
  Regulatory: { bg: "#F0FDF4", text: "#15803D" },
  Training:   { bg: "#FDF4FF", text: "#7E22CE" },
};

const STATUS_STYLE: Record<DocStatus, { bg: string; text: string }> = {
  "Expired":        { bg: "#FFECEC", text: "#D30000" },
  "Expiring Soon":  { bg: "#FFF3CC", text: "#A55A00" },
  "Pending Renewal":{ bg: "#EEF0FF", text: PRIMARY },
};

function DaysExpiredCell({ days }: { days: number }) {
  if (days <= 0) {
    // upcoming
    const abs = Math.abs(days);
    const color = abs <= 7 ? "#D97706" : "#6B7280";
    return (
      <span className="text-xs font-medium" style={{ color }}>
        in {abs}d
      </span>
    );
  }
  const color = days > 30 ? "#D30000" : days >= 10 ? "#D97706" : "#CA8A04";
  return (
    <span className="text-xs font-semibold" style={{ color }}>
      +{days}d
    </span>
  );
}

function TypeBadge({ type }: { type: DocType }) {
  const s = TYPE_STYLE[type];
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap" style={s}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: DocStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap" style={s}>
      {status}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export function ReportsPage() {
  const [docFilter,    setDocFilter]    = useState<DocFilter>("All");
  const [search,       setSearch]       = useState("");
  const [toastIds,     setToastIds]     = useState<number[]>([]);
  const [runningCards, setRunningCards] = useState<number[]>([]);
  const [doneCards,    setDoneCards]    = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [allSelected,  setAllSelected]  = useState(false);
  const [hoveredRow,   setHoveredRow]   = useState<number | null>(null);

  // Filter + search expired docs
  const filteredDocs = useMemo(() => {
    let docs = [...EXPIRED_DOCS];
    if (docFilter !== "All") docs = docs.filter(d => d.status === docFilter);
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(d =>
        d.studyProtocol.toLowerCase().includes(q) ||
        d.studyNickname.toLowerCase().includes(q) ||
        d.documentName.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      );
    }
    return docs;
  }, [docFilter, search]);

  // Summary counts
  const counts = useMemo(() => ({
    expired:        EXPIRED_DOCS.filter(d => d.status === "Expired").length,
    expiringSoon:   EXPIRED_DOCS.filter(d => d.status === "Expiring Soon").length,
    pendingRenewal: EXPIRED_DOCS.filter(d => d.status === "Pending Renewal").length,
  }), []);

  const sendReminder = (id: number) => {
    setToastIds(p => [...p, id]);
    setTimeout(() => setToastIds(p => p.filter(x => x !== id)), 3000);
  };

  const runReport = (idx: number) => {
    setRunningCards(p => [...p, idx]);
    setTimeout(() => {
      setRunningCards(p => p.filter(x => x !== idx));
      setDoneCards(p => [...p, idx]);
      setTimeout(() => setDoneCards(p => p.filter(x => x !== idx)), 2500);
    }, 1400);
  };

  const handleExport = () => {
    const csv = [
      ["Study Protocol", "Nickname", "Document", "Type", "Contact", "Role", "Expiration Date", "Days Expired", "Status"],
      ...filteredDocs.map(d => [
        d.studyProtocol, d.studyNickname, d.documentName, d.type,
        d.contactName, d.contactRole, d.expirationDate,
        d.daysExpired > 0 ? `+${d.daysExpired}d` : `in ${Math.abs(d.daysExpired)}d`,
        d.status,
      ]),
    ].map(row => row.map(v => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expired-documents-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full" style={{ background: "#F2EDE6" }}>
      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#2D1F12" }}>Reports</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>
            Generate, schedule, and export compliance and operational reports
          </p>
        </div>

        {/* ── Section 1: Frequently Run Reports ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4" style={{ color: "#9CA3AF" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#3D3028" }}>Frequently Run Reports</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {REPORT_CARDS.map((card, idx) => {
              const running = runningCards.includes(idx);
              const done    = doneCards.includes(idx);
              return (
                <div
                  key={card.name}
                  className="rounded-xl border p-4 flex flex-col gap-3 hover:shadow-sm transition-all group/card"
                  style={{ background: "#FFFCF7", borderColor: "#EDE5DA" }}
                >
                  {/* Icon + name */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${card.accent}18`, color: card.accent }}
                    >
                      {card.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-snug" style={{ color: "#2D1F12" }}>
                        {card.name}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "#9CA3AF" }}>
                    {card.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#EDE5DA" }}>
                    <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
                      <span className="font-medium">Last:</span> {card.lastRun}
                    </div>
                    <button
                      onClick={() => runReport(idx)}
                      disabled={running}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all"
                      style={
                        done
                          ? { borderColor: "#038748", color: "#038748", background: "#D4F4E0" }
                          : running
                          ? { borderColor: "#E3D8CC", color: "#9CA3AF", background: "#F5F0EA", cursor: "not-allowed" }
                          : { borderColor: card.accent, color: card.accent, background: `${card.accent}10` }
                      }
                    >
                      {done ? (
                        <><CheckCircle className="w-3 h-3" /> Done</>
                      ) : running ? (
                        <><span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> Running…</>
                      ) : (
                        "Run Report"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Expired Documents Report ── */}
        <section>
          {/* Section header */}
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <FileWarning className="w-4 h-4" style={{ color: "#D97706" }} />
                <h2 className="text-sm font-semibold" style={{ color: "#3D3028" }}>Expired Documents</h2>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                Documents past expiration requiring immediate action
              </p>
            </div>

            {/* Summary chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#FFECEC", color: "#D30000" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {counts.expired} Expired
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#FFF3CC", color: "#A55A00" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {counts.expiringSoon} Expiring Soon
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#EEF0FF", color: PRIMARY }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {counts.pendingRenewal} Pending Renewal
              </span>
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#FFFCF7", border: "1px solid #EDE5DA" }}>

            {/* Filter bar */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b flex-wrap gap-y-2"
              style={{ background: "#FAF7F3", borderColor: "#EDE5DA" }}
            >
              {/* Status filters */}
              <div className="flex items-center gap-1">
                {(["All", "Expired", "Expiring Soon", "Pending Renewal"] as DocFilter[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setDocFilter(f)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
                    style={
                      docFilter === f
                        ? { background: PRIMARY, color: "white" }
                        : { background: "white", color: "#6B7280", border: "1px solid #E3D8CC" }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search protocol, document, contact…"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:border-[#5C4EE5]/50 transition-colors"
                  style={{ borderColor: "#E3D8CC", background: "white", color: "#2D1F12" }}
                />
              </div>

              {/* Export */}
              <button
                onClick={handleExport}
                className="ml-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border hover:bg-white transition-colors whitespace-nowrap"
                style={{ borderColor: "#E3D8CC", color: "#4D3F34" }}
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr style={{ background: "#FFFCF7", borderBottom: "2px solid #EDE5DA" }}>
                    <th className="px-4 py-3 text-center" style={{ width: 42 }}>
                      <input type="checkbox" checked={allSelected} onChange={() => {
                        if (allSelected) { setSelectedRows(new Set()); setAllSelected(false); }
                        else { setSelectedRows(new Set(filteredDocs.map(d => String(d.id)))); setAllSelected(true); }
                      }} style={{ cursor: "pointer" }} />
                    </th>
                    {["Study", "Document Name", "Type", "Key Contact", "Expiration Date", "Days", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
                        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(doc => {
                    const toastActive = toastIds.includes(doc.id);
                    const isSelected = selectedRows.has(String(doc.id));
                    const isHovered = hoveredRow === doc.id;
                    const rowBg = isSelected ? "#F5EDDE" : isHovered ? "#FAF6F0" : "#FFFCF7";
                    return (
                      <tr
                        key={doc.id}
                        className="transition-colors"
                        style={{ borderBottom: "1px solid #EDE5DA", background: rowBg }}
                        onMouseEnter={() => setHoveredRow(doc.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-4 py-3 text-center align-middle" style={{ width: 42 }} onClick={() => {
                          setSelectedRows(prev => { const next = new Set(prev); next.has(String(doc.id)) ? next.delete(String(doc.id)) : next.add(String(doc.id)); return next; });
                        }}>
                          <input type="checkbox" checked={isSelected} onChange={() => {}} style={{ cursor: "pointer" }} />
                        </td>
                        {/* Study */}
                        <td className="px-4 py-3 align-middle">
                          <div className="text-xs font-semibold" style={{ color: "#2D1F12" }}>{doc.studyNickname}</div>
                          <div className="font-mono text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{doc.studyProtocol}</div>
                        </td>
                        {/* Document Name */}
                        <td className="px-4 py-3 align-middle">
                          <div className="text-xs" style={{ color: "#3D3028" }}>{doc.documentName}</div>
                        </td>
                        {/* Type */}
                        <td className="px-4 py-3 align-middle">
                          <TypeBadge type={doc.type} />
                        </td>
                        {/* Key Contact */}
                        <td className="px-4 py-3 align-middle">
                          <div className="text-xs font-medium" style={{ color: "#3D3028" }}>{doc.contactName}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{doc.contactRole}</div>
                        </td>
                        {/* Expiration Date */}
                        <td className="px-4 py-3 align-middle">
                          <div className="text-xs" style={{ color: "#4D3F34" }}>
                            {new Date(doc.expirationDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </td>
                        {/* Days */}
                        <td className="px-4 py-3 align-middle">
                          <DaysExpiredCell days={doc.daysExpired} />
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3 align-middle">
                          <StatusBadge status={doc.status} />
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => sendReminder(doc.id)}
                              className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap"
                              style={toastActive ? { borderColor: "#038748", color: "#038748", background: "#D4F4E0" } : { borderColor: PRIMARY, color: PRIMARY, background: "#F0EEFF" }}
                            >
                              {toastActive ? <><CheckCircle className="w-3 h-3" /> Sent!</> : <><Mail className="w-3 h-3" /> Send Reminder</>}
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Archive document">
                              <Archive className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-14 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="w-8 h-8" style={{ color: "#D1D5DB" }} />
                          <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>No documents match the current filter.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Status bar */}
            <div style={{ background: "#FAF7F3", borderTop: "1px solid #EDE5DA", padding: "4px 16px", display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "#9CA3AF" }}>
              <span>Total Rows: {filteredDocs.length}</span>
              <span>|</span>
              <span>Selected: {selectedRows.size}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
