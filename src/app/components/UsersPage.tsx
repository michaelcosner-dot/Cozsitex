import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users, AlertTriangle, Clock, FileText, CheckCircle, Search, Plus, Upload,
} from "lucide-react";
import { NewUserWizard } from "./NewUserWizard";

const PRIMARY    = "#5C4EE5";
const PAGE_BG    = "#F2EDE6";
const CARD_BG    = "#FFFCF7";
const BORDER     = "#EDE5DA";
const BORDER2    = "#E3D8CC";
const TEXT_DARK  = "#2D1F12";
const TEXT_MID   = "#3D3028";
const TEXT_MUTED = "#9CA3AF";

type RoleBadge      = "PI" | "Sub-I" | "CRC" | "RN" | "Data Manager" | "Coordinator";
type TrainingStatus = "Current" | "Expiring" | "Expired";

interface StaffMember {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  role: RoleBadge;
  department: string;
  gcpDate: string;
  gcpStatus: TrainingStatus;
  licenseState: string;
  licenseExpiry: string;
  cvOnFile: boolean;
  lastActive: string;
}

const ROLE_COLORS: Record<RoleBadge, { bg: string; text: string }> = {
  "PI":           { bg: "#EDE9FF", text: "#5C4EE5" },
  "Sub-I":        { bg: "#E8F0FE", text: "#1D4ED8" },
  "CRC":          { bg: "#E6F7F3", text: "#0D7A5F" },
  "RN":           { bg: "#FEE8ED", text: "#9B2335" },
  "Data Manager": { bg: "#FFF0E6", text: "#B45309" },
  "Coordinator":  { bg: "#F3E8FF", text: "#7E22CE" },
};

const TRAINING_COLORS: Record<TrainingStatus, { bg: string; text: string; dot: string }> = {
  "Current":  { bg: "#ECFDF5", text: "#059669", dot: "#10B981" },
  "Expiring": { bg: "#FFFBEB", text: "#D97706", dot: "#F59E0B" },
  "Expired":  { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
};

const STAFF: StaffMember[] = [
  { id: 1,  name: "Dr. Amara Okafor",    initials: "AO", avatarColor: "#5C4EE5", role: "PI",           department: "Oncology",           gcpDate: "Mar 2026", gcpStatus: "Current",  licenseState: "IL",  licenseExpiry: "Nov 2027", cvOnFile: true,  lastActive: "Today" },
  { id: 2,  name: "Dr. Sofia Martinez",  initials: "SM", avatarColor: "#0D7A5F", role: "Sub-I",        department: "Cardiology",         gcpDate: "Jan 2026", gcpStatus: "Current",  licenseState: "IL",  licenseExpiry: "Aug 2027", cvOnFile: true,  lastActive: "Today" },
  { id: 3,  name: "Dr. James Whitfield", initials: "JW", avatarColor: "#B45309", role: "Sub-I",        department: "Neurology",          gcpDate: "Jun 2025", gcpStatus: "Expiring", licenseState: "IL",  licenseExpiry: "Jun 2026", cvOnFile: true,  lastActive: "Yesterday" },
  { id: 4,  name: "Rachel Huang",        initials: "RH", avatarColor: "#0D7A5F", role: "CRC",          department: "Oncology",           gcpDate: "Feb 2026", gcpStatus: "Current",  licenseState: "IL",  licenseExpiry: "N/A",      cvOnFile: true,  lastActive: "Today" },
  { id: 5,  name: "Marcus Webb",         initials: "MW", avatarColor: "#7E22CE", role: "CRC",          department: "Cardiology",         gcpDate: "Apr 2024", gcpStatus: "Expired",  licenseState: "IL",  licenseExpiry: "N/A",      cvOnFile: false, lastActive: "3 days ago" },
  { id: 6,  name: "Priya Nair",          initials: "PN", avatarColor: "#9B2335", role: "RN",           department: "Infectious Disease", gcpDate: "Nov 2025", gcpStatus: "Expiring", licenseState: "IL",  licenseExpiry: "Sep 2026", cvOnFile: true,  lastActive: "Today" },
  { id: 7,  name: "Thomas Reyes",        initials: "TR", avatarColor: "#1D4ED8", role: "RN",           department: "Oncology",           gcpDate: "Jan 2026", gcpStatus: "Current",  licenseState: "IL",  licenseExpiry: "Jan 2028", cvOnFile: true,  lastActive: "Yesterday" },
  { id: 8,  name: "Dana Fischer",        initials: "DF", avatarColor: "#B45309", role: "Data Manager", department: "Clinical Ops",       gcpDate: "Mar 2025", gcpStatus: "Expiring", licenseState: "N/A", licenseExpiry: "N/A",      cvOnFile: true,  lastActive: "Today" },
  { id: 9,  name: "Kevin Lim",           initials: "KL", avatarColor: "#7E22CE", role: "Data Manager", department: "Clinical Ops",       gcpDate: "Feb 2026", gcpStatus: "Current",  licenseState: "N/A", licenseExpiry: "N/A",      cvOnFile: false, lastActive: "2 days ago" },
  { id: 10, name: "Simone Brooks",       initials: "SB", avatarColor: "#0D7A5F", role: "Coordinator",  department: "Neurology",          gcpDate: "Aug 2023", gcpStatus: "Expired",  licenseState: "N/A", licenseExpiry: "N/A",      cvOnFile: true,  lastActive: "1 week ago" },
  { id: 11, name: "Omar Hassan",         initials: "OH", avatarColor: "#5C4EE5", role: "Coordinator",  department: "Cardiology",         gcpDate: "Apr 2026", gcpStatus: "Current",  licenseState: "N/A", licenseExpiry: "N/A",      cvOnFile: true,  lastActive: "Today" },
  { id: 12, name: "Laura Nguyen",        initials: "LN", avatarColor: "#9B2335", role: "CRC",          department: "Infectious Disease", gcpDate: "Dec 2025", gcpStatus: "Current",  licenseState: "N/A", licenseExpiry: "N/A",      cvOnFile: true,  lastActive: "Today" },
];

function RolePill({ role }: { role: RoleBadge }) {
  const c = ROLE_COLORS[role];
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.bg, color: c.text }}>
      {role}
    </span>
  );
}

function TrainingBadge({ status, date }: { status: TrainingStatus; date: string }) {
  const c = TRAINING_COLORS[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {date} · {status}
    </span>
  );
}

export function UsersPage() {
  const navigate                        = useNavigate();
  const [staff, setStaff]             = useState(STAFF);
  const [staffSearch, setStaffSearch] = useState("");
  const [hoveredRow, setHoveredRow]   = useState<number | null>(null);
  const [showWizard, setShowWizard]   = useState(false);

  const filtered = staff.filter(s =>
    staffSearch === "" ||
    s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    s.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(staffSearch.toLowerCase()),
  );

  const expired  = staff.filter(s => s.gcpStatus === "Expired").length;
  const expiring = staff.filter(s => s.gcpStatus === "Expiring").length;
  const noCV     = staff.filter(s => !s.cvOnFile).length;

  function handleCreateUser(name: string, role: string) {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colors   = ["#5C4EE5", "#0D7A5F", "#B45309", "#7E22CE", "#9B2335", "#1D4ED8"];
    const newMember: StaffMember = {
      id: staff.length + 1,
      name,
      initials,
      avatarColor: colors[staff.length % colors.length],
      role: (role as RoleBadge) || "Coordinator",
      department: "Clinical Ops",
      gcpDate: "—",
      gcpStatus: "Current",
      licenseState: "N/A",
      licenseExpiry: "N/A",
      cvOnFile: false,
      lastActive: "Never",
    };
    setStaff(prev => [...prev, newMember]);
  }

  return (
    <div className="flex flex-col min-h-full -m-6">
      {showWizard && (
        <NewUserWizard onClose={() => setShowWizard(false)} onCreate={handleCreateUser} />
      )}
      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4" style={{ background: CARD_BG, borderBottom: `1px solid ${BORDER}` }}>
        <h1 className="text-base font-semibold" style={{ color: TEXT_DARK }}>Users</h1>
        <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>Staff directory, credentials, and access management</p>
      </div>

      <div className="px-6 py-5 flex-1 flex flex-col gap-4" style={{ background: PAGE_BG }}>
        <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          {/* Table header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: PRIMARY }} />
              <h2 className="text-base font-semibold" style={{ color: TEXT_DARK }}>Staff Directory</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: BORDER, color: TEXT_MID }}>
                {STAFF.length} members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ border: `1px solid ${BORDER2}`, background: PAGE_BG }}>
                <Search size={13} style={{ color: TEXT_MUTED }} />
                <input
                  placeholder="Search staff..."
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm w-36"
                  style={{ color: TEXT_DARK }}
                />
              </div>
              <button
                onClick={() => setShowWizard(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                style={{ background: PRIMARY }}
              >
                <Plus size={13} />
                Add Staff
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Name", "Role", "Department", "GCP Training", "Medical License", "CV on File", "Last Active", ""].map(h => (
                    <th key={h} className="text-left pb-2 pr-4 font-medium" style={{ color: TEXT_MUTED, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr
                    key={s.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: `1px solid ${BORDER}`, background: hoveredRow === s.id ? PAGE_BG : "transparent" }}
                    onMouseEnter={() => setHoveredRow(s.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => navigate(`/users/${s.id}`)}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ background: s.avatarColor, fontSize: 10 }}>
                          {s.initials}
                        </div>
                        <span className="font-medium text-xs" style={{ color: TEXT_DARK }}>{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4"><RolePill role={s.role} /></td>
                    <td className="py-3 pr-4"><span className="text-xs" style={{ color: TEXT_MID }}>{s.department}</span></td>
                    <td className="py-3 pr-4"><TrainingBadge status={s.gcpStatus} date={s.gcpDate} /></td>
                    <td className="py-3 pr-4">
                      <span className="text-xs" style={{ color: TEXT_MID }}>
                        {s.licenseState !== "N/A" ? `${s.licenseState} · exp ${s.licenseExpiry}` : <span style={{ color: TEXT_MUTED }}>—</span>}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {s.cvOnFile
                        ? <CheckCircle size={15} style={{ color: "#10B981" }} />
                        : <button className="flex items-center gap-1 text-xs font-medium" style={{ color: PRIMARY }}><Upload size={12} />Upload</button>}
                    </td>
                    <td className="py-3 pr-4"><span className="text-xs" style={{ color: TEXT_MUTED }}>{s.lastActive}</span></td>
                    <td className="py-3 w-0" onClick={e => e.stopPropagation()}>
                      {hoveredRow === s.id && (
                        <div className="flex items-center gap-2 pr-1">
                          <button onClick={() => navigate(`/users/${s.id}`)} className="text-xs font-medium px-2 py-1 rounded-md" style={{ color: PRIMARY, background: "#EDE9FF" }}>View Profile</button>
                          <button className="text-xs font-medium px-2 py-1 rounded-md" style={{ color: "#DC2626", background: "#FEF2F2" }}>Remove</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Credential alerts */}
          {(expired > 0 || expiring > 0 || noCV > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {expired > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                  <AlertTriangle size={12} />{expired} staff with expired GCP training
                </div>
              )}
              {expiring > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}>
                  <Clock size={12} />{expiring} staff with GCP expiring soon
                </div>
              )}
              {noCV > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD" }}>
                  <FileText size={12} />{noCV} staff missing CV on file
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
