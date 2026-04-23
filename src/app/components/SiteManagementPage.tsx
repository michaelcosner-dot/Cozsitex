import { useState } from "react";
import {
  Globe, CheckCircle, AlertCircle, Clock, ChevronDown,
  FolderOpen, FileText, ExternalLink, RefreshCw, Check,
  Plus, X, MapPin, Building2,
} from "lucide-react";

const PRIMARY = "#5C4EE5";
const CARD_BG = "#FFFCF7";
const BORDER = "#EDE5DA";
const PAGE_BG = "#F2EDE6";
const TEXT_DARK = "#2D1F12";
const TEXT_MUTED = "#9CA3AF";

const SITES = [
  { name: "Northgate CRC",              url: "ngcrc.ebinders.io",      location: "Atlanta, GA",      studies: 11, compliance: 91, lastSync: "3 min ago",  status: "Online" },
  { name: "Lakeside Medical Center",    url: "lakeside.ebinders.io",   location: "Chicago, IL",      studies: 8,  compliance: 78, lastSync: "12 min ago", status: "Online" },
  { name: "Downtown Research Group",    url: "downtown-rg.ebinders.io",location: "New York, NY",     studies: 6,  compliance: 94, lastSync: "1 hr ago",   status: "Online" },
  { name: "Westfield University Hospital", url: "westfield.ebinders.io", location: "Houston, TX",   studies: 14, compliance: 65, lastSync: "2 hrs ago",  status: "Online" },
  { name: "Harbor View Clinical",       url: "harborview.ebinders.io", location: "San Diego, CA",   studies: 3,  compliance: 88, lastSync: "30 min ago", status: "Online" },
  { name: "Summit Health Partners",     url: "summit.ebinders.io",     location: "Denver, CO",       studies: 9,  compliance: 83, lastSync: "45 min ago", status: "Online" },
  { name: "Riverside Research Institute", url: "riverside.ebinders.io", location: "Portland, OR",   studies: 5,  compliance: 71, lastSync: "3 hrs ago",  status: "Syncing" },
  { name: "Clearwater Medical Group",   url: "clearwater.ebinders.io", location: "Tampa, FL",        studies: 2,  compliance: 97, lastSync: "15 min ago", status: "Online" },
];

const STUDIES_LIST = [
  { id: "JAVAHEART",  phase: "Phase III" },
  { id: "ONCOVAULT",  phase: "Phase II" },
  { id: "NEUROPILOT", phase: "Phase I" },
  { id: "DIASOLVE",   phase: "Phase II" },
  { id: "RHEUMATH",   phase: "Phase III" },
  { id: "ASTHMAPLUS", phase: "Phase II" },
  { id: "BROWAVE",    phase: "Phase I" },
];

const TEMPLATES = [
  { name: "Oncology Standard",  folders: 8,  placeholders: 34, roles: 6, badge: "MOST USED", tree: ["Regulatory/", "Consent/", "Investigator/", "Staff Training/", "Monitoring/", "Site Agreements/", "Pharmacy/", "Labs/"] },
  { name: "Cardiology Core",    folders: 6,  placeholders: 28, roles: 5, badge: null,        tree: ["Regulatory/", "Consent/", "Investigator/", "Staff Training/", "Monitoring/", "Site Agreements/"] },
  { name: "Neurology Extended", folders: 10, placeholders: 42, roles: 7, badge: null,        tree: ["Regulatory/", "Consent/", "Investigator/", "Staff Training/", "Monitoring/", "Site Agreements/", "Pharmacy/", "Labs/", "Genetics/", "Imaging/"] },
  { name: "Minimal",            folders: 3,  placeholders: 12, roles: 3, badge: null,        tree: ["Regulatory/", "Consent/", "Investigator/"] },
];

const ROLES = ["PI", "CRC Lead", "Sub-I", "Coordinator", "Data Manager", "Monitor Liaison"];
const STAFF = ["Dr. Okafor", "Sarah Chen", "James Park", "Maria Lopez", "Dr. Williams", "Kevin Tran", "Amy Singh", "Dr. Patel"];

const RECENT_ACTIVITY = [
  { color: "green",  action: "Document Approved",       sub: "Protocol v3.2 — Northgate CRC",              time: "2 min ago" },
  { color: "orange", action: "Sync Warning",            sub: "Riverside Research — 3 docs pending",         time: "8 min ago" },
  { color: "green",  action: "Deployment Complete",     sub: "JAVAHEART — Summit Health Partners",          time: "15 min ago" },
  { color: "red",    action: "Compliance Alert",        sub: "Westfield University — GCP expired",          time: "22 min ago" },
  { color: "green",  action: "New Document Uploaded",   sub: "ICF Master v2.1 — Lakeside Medical",          time: "34 min ago" },
  { color: "green",  action: "Acknowledgement Received",sub: "ONCOVAULT Protocol — Harbor View",            time: "1 hr ago" },
  { color: "orange", action: "Review Requested",        sub: "Financial Disclosure — Downtown RG",          time: "1.5 hrs ago" },
  { color: "red",    action: "Missing Document",        sub: "Delegation Log — Westfield",                  time: "2 hrs ago" },
  { color: "green",  action: "Site Onboarded",          sub: "Clearwater Medical Group",                    time: "3 hrs ago" },
  { color: "green",  action: "Deployment Started",      sub: "DIASOLVE — 4 sites",                          time: "4 hrs ago" },
];

function complianceColor(pct: number): string {
  if (pct >= 90) return "#16A34A";
  if (pct >= 75) return "#EA580C";
  return "#DC2626";
}

const TABS = ["Sites", "Network Overview", "Deploy Study"] as const;
type Tab = typeof TABS[number];

// ── Add Site panel ────────────────────────────────────────────────────────
function AddSitePanel({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", url: "", location: "", contact: "", type: "Academic" });
  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex flex-col w-[400px] shadow-2xl"
      style={{ background: CARD_BG, borderLeft: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div>
          <h2 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Add site</h2>
          <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>Connect a new site to your network</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
          <X className="w-4 h-4" style={{ color: TEXT_MUTED }} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {[
          { label: "Site name", field: "name", placeholder: "e.g. Northgate CRC" },
          { label: "eBinders URL", field: "url", placeholder: "e.g. ngcrc.ebinders.io" },
          { label: "Location", field: "location", placeholder: "e.g. Atlanta, GA" },
          { label: "Primary contact email", field: "contact", placeholder: "coordinator@site.org" },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_DARK }}>{label}</label>
            <input
              type="text"
              value={form[field as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              placeholder={placeholder}
              className="w-full text-sm px-3 py-2 rounded-md"
              style={{ border: `1px solid ${BORDER}`, background: PAGE_BG, color: TEXT_DARK }}
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_DARK }}>Site type</label>
          <div className="relative">
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full text-sm px-3 py-2 rounded-md appearance-none pr-8"
              style={{ border: `1px solid ${BORDER}`, background: PAGE_BG, color: TEXT_DARK }}
            >
              {["Academic", "Community", "Hospital", "Private Practice", "Network"].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-2.5 pointer-events-none" style={{ color: TEXT_MUTED }} />
          </div>
        </div>
      </div>
      <div className="px-5 py-4 flex gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={onClose}
          className="flex-1 text-sm py-2 rounded-lg font-medium border"
          style={{ borderColor: BORDER, color: TEXT_DARK, background: CARD_BG }}
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="flex-1 text-sm py-2 rounded-lg font-semibold text-white"
          style={{ background: PRIMARY }}
        >
          Add site
        </button>
      </div>
    </div>
  );
}

export function SiteManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Sites");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showAddSite, setShowAddSite] = useState(false);

  // Deploy Study state
  const [step, setStep] = useState(1);
  const [selectedStudy, setSelectedStudy] = useState("JAVAHEART");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [selectedSites, setSelectedSites] = useState<boolean[]>(Array(8).fill(false));
  const [roleAssignments, setRoleAssignments] = useState<Record<string, string>>(
    Object.fromEntries(ROLES.map(r => [r, ""]))
  );
  const [deployProgress, setDeployProgress] = useState<Record<number, number>>({});
  const [deployStatus, setDeployStatus] = useState<Record<number, string>>({});
  const [deployDone, setDeployDone] = useState(false);

  const chosenSitesCount = selectedSites.filter(Boolean).length;
  const chosenTemplate = TEMPLATES[selectedTemplate];

  function startDeploy() {
    const chosen = selectedSites.map((s, i) => s ? i : -1).filter(i => i >= 0);
    const init: Record<number, number> = {};
    const initStatus: Record<number, string> = {};
    chosen.forEach(i => { init[i] = 0; initStatus[i] = "Queued"; });
    setDeployProgress(init);
    setDeployStatus(initStatus);
    setDeployDone(false);
    chosen.forEach((siteIdx, order) => {
      setTimeout(() => {
        setDeployStatus(prev => ({ ...prev, [siteIdx]: "Deploying" }));
        let pct = 0;
        const interval = setInterval(() => {
          pct += 10;
          setDeployProgress(prev => ({ ...prev, [siteIdx]: pct }));
          if (pct >= 100) {
            clearInterval(interval);
            setDeployStatus(prev => ({ ...prev, [siteIdx]: "Complete" }));
            if (order === chosen.length - 1) setTimeout(() => setDeployDone(true), 300);
          }
        }, 100);
      }, order * 1000);
    });
  }

  function resetDeploy() {
    setStep(1); setSelectedStudy("JAVAHEART"); setSelectedTemplate(0);
    setSelectedSites(Array(8).fill(false)); setDeployProgress({}); setDeployStatus({}); setDeployDone(false);
  }

  return (
    <div className="flex flex-col min-h-full -m-6">
      {showAddSite && <div className="fixed inset-0 z-40" onClick={() => setShowAddSite(false)} />}
      {showAddSite && <AddSitePanel onClose={() => setShowAddSite(false)} />}

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between" style={{ background: CARD_BG, borderBottom: `1px solid ${BORDER}` }}>
        <div>
          <h1 className="text-base font-semibold" style={{ color: TEXT_DARK }}>Site Management</h1>
          <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>Configure and manage sites in your network</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium"
            style={{ borderColor: BORDER, color: TEXT_DARK, background: CARD_BG }}
          >
            <RefreshCw size={13} />
            Sync All
          </button>
          <button
            onClick={() => setShowAddSite(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium text-white"
            style={{ background: PRIMARY }}
          >
            <Plus size={13} />
            Add site
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-6 pt-3 pb-0" style={{ background: CARD_BG, borderBottom: `1px solid ${BORDER}` }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="text-xs px-3 py-2 rounded-t-md font-medium transition-colors"
            style={{
              color: activeTab === tab ? PRIMARY : TEXT_MUTED,
              borderBottom: activeTab === tab ? `2px solid ${PRIMARY}` : "2px solid transparent",
              background: "transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-6 py-5 flex-1" style={{ background: PAGE_BG }}>

        {/* ── SITES TAB ── */}
        {activeTab === "Sites" && (
          <div className="flex flex-col gap-4">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total sites",       value: "8",   icon: <Building2 size={16} /> },
                { label: "Active studies",     value: "58",  icon: <FolderOpen size={16} /> },
                { label: "Avg compliance",     value: "83%", icon: <CheckCircle size={16} /> },
                { label: "Sites syncing",      value: "1",   icon: <Clock size={16} /> },
              ].map(kpi => (
                <div key={kpi.label} className="rounded-lg p-4 flex flex-col gap-1" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>{kpi.label}</span>
                    <span style={{ color: PRIMARY }}>{kpi.icon}</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: TEXT_DARK }}>{kpi.value}</span>
                </div>
              ))}
            </div>

            {/* Sites table */}
            <div className="rounded-lg overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
                    {["Site", "Location", "Active studies", "Compliance", "Last sync", "Status", ""].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-medium" style={{ color: TEXT_MUTED }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SITES.map((site, i) => (
                    <tr
                      key={site.name}
                      className="relative transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${BORDER}`, background: hoveredRow === i ? PAGE_BG : "transparent" }}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium" style={{ color: TEXT_DARK }}>{site.name}</div>
                        <div style={{ color: TEXT_MUTED }}>{site.url}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" style={{ color: TEXT_MUTED }}>
                          <MapPin size={11} />
                          {site.location}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: TEXT_DARK }}>{site.studies}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold" style={{ color: complianceColor(site.compliance) }}>{site.compliance}%</span>
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                            <div className="h-full rounded-full" style={{ width: `${site.compliance}%`, background: complianceColor(site.compliance) }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>{site.lastSync}</td>
                      <td className="px-4 py-3">
                        {site.status === "Syncing" ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#EA580C" }} />
                            <span style={{ color: "#EA580C" }}>Syncing</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#16A34A" }} />
                            <span style={{ color: "#16A34A" }}>Online</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {hoveredRow === i && (
                          <div className="flex items-center gap-1.5">
                            <button className="text-xs px-2 py-1 rounded font-medium text-white" style={{ background: PRIMARY }}>Open eBinders</button>
                            <button className="text-xs px-2 py-1 rounded font-medium" style={{ background: BORDER, color: TEXT_DARK }}>Settings</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── NETWORK OVERVIEW TAB ── */}
        {activeTab === "Network Overview" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Connected Sites",    value: "12",  icon: <Globe size={16} /> },
                { label: "Active Deployments", value: "8",   icon: <FolderOpen size={16} /> },
                { label: "Docs In Review",     value: "47",  icon: <FileText size={16} /> },
                { label: "Network Compliance", value: "84%", icon: <CheckCircle size={16} /> },
              ].map(kpi => (
                <div key={kpi.label} className="rounded-lg p-4 flex flex-col gap-1" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>{kpi.label}</span>
                    <span style={{ color: PRIMARY }}>{kpi.icon}</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: TEXT_DARK }}>{kpi.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="rounded-lg overflow-hidden" style={{ flex: "0 0 60%", background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
                  <span className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Connected Sites</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
                      {["Site", "Studies", "Compliance", "Last Sync", "Status"].map(h => (
                        <th key={h} className="text-left px-4 py-2 font-medium" style={{ color: TEXT_MUTED }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SITES.map((site, i) => (
                      <tr
                        key={site.name}
                        className="relative cursor-pointer transition-colors"
                        style={{ borderBottom: `1px solid ${BORDER}`, background: hoveredRow === i ? PAGE_BG : "transparent" }}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-4 py-2.5">
                          <div className="font-medium" style={{ color: TEXT_DARK }}>{site.name}</div>
                          <div style={{ color: TEXT_MUTED }}>{site.url}</div>
                        </td>
                        <td className="px-4 py-2.5" style={{ color: TEXT_DARK }}>{site.studies}</td>
                        <td className="px-4 py-2.5"><span className="font-semibold" style={{ color: complianceColor(site.compliance) }}>{site.compliance}%</span></td>
                        <td className="px-4 py-2.5" style={{ color: TEXT_MUTED }}>{site.lastSync}</td>
                        <td className="px-4 py-2.5">
                          {site.status === "Syncing" ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ background: "#EA580C" }} />
                              <span style={{ color: "#EA580C" }}>Syncing</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ background: "#16A34A" }} />
                              <span style={{ color: "#16A34A" }}>Online</span>
                            </span>
                          )}
                        </td>
                        {hoveredRow === i && (
                          <td className="px-4 py-2.5 absolute right-0 top-0 h-full flex items-center gap-1.5">
                            <button className="text-xs px-2 py-1 rounded font-medium text-white" style={{ background: PRIMARY }}>Open eBinders</button>
                            <button className="text-xs px-2 py-1 rounded font-medium" style={{ background: BORDER, color: TEXT_DARK }}>Sync Now</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg flex-1 overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
                  <span className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Recent Activity</span>
                </div>
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {RECENT_ACTIVITY.map((item, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: item.color === "green" ? "#16A34A" : item.color === "orange" ? "#EA580C" : "#DC2626" }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs" style={{ color: TEXT_DARK }}>{item.action}</div>
                        <div className="text-xs truncate" style={{ color: TEXT_MUTED }}>{item.sub}</div>
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: TEXT_MUTED }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── DEPLOY STUDY TAB ── */}
        {activeTab === "Deploy Study" && (
          <div className="flex flex-col gap-5">
            {/* Step bar */}
            <div className="rounded-lg px-8 py-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s, idx) => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: step > s ? "#16A34A" : step === s ? PRIMARY : BORDER, color: step >= s ? "#fff" : TEXT_MUTED }}
                      >
                        {step > s ? <Check size={13} /> : s}
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap" style={{ color: step === s ? PRIMARY : step > s ? "#16A34A" : TEXT_MUTED }}>
                        {["Select Study", "Template", "Sites", "Configure", "Deploy"][idx]}
                      </span>
                    </div>
                    {idx < 4 && <div className="h-0.5 flex-1 mx-1 mt-[-14px]" style={{ background: step > s ? "#16A34A" : BORDER }} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              {/* Step 1 */}
              {step === 1 && (
                <div className="flex flex-col gap-4 max-w-md">
                  <h2 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Select Study</h2>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: TEXT_DARK }}>Study</label>
                    <div className="relative">
                      <select value={selectedStudy} onChange={e => setSelectedStudy(e.target.value)} className="w-full text-sm px-3 py-2 rounded-md appearance-none pr-8" style={{ border: `1px solid ${BORDER}`, background: CARD_BG, color: TEXT_DARK }}>
                        {STUDIES_LIST.map(s => <option key={s.id} value={s.id}>{s.id} — {s.phase}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-2.5 pointer-events-none" style={{ color: TEXT_MUTED }} />
                    </div>
                    {selectedStudy && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: PRIMARY }}>{STUDIES_LIST.find(s => s.id === selectedStudy)?.phase}</span>
                        <span className="text-xs" style={{ color: TEXT_MUTED }}>Selected: {selectedStudy}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs px-4 py-2 rounded-md font-medium text-white w-fit" style={{ background: PRIMARY }}>Next: Select Template →</button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Select Template</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((tpl, i) => (
                      <div key={tpl.name} onClick={() => setSelectedTemplate(i)} className="rounded-lg p-4 cursor-pointer transition-all" style={{ border: `2px solid ${selectedTemplate === i ? PRIMARY : BORDER}`, background: selectedTemplate === i ? "#F0EEFF" : CARD_BG }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold" style={{ color: TEXT_DARK }}>{tpl.name}</span>
                          {tpl.badge && <span className="text-xs px-1.5 py-0.5 rounded font-semibold text-white" style={{ background: PRIMARY }}>{tpl.badge}</span>}
                        </div>
                        <div className="flex gap-3 text-xs mb-3" style={{ color: TEXT_MUTED }}>
                          <span>{tpl.folders} folders</span><span>{tpl.placeholders} placeholders</span><span>{tpl.roles} roles</span>
                        </div>
                        <div className="rounded p-2 text-xs" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
                          {tpl.tree.slice(0, 4).map(f => (
                            <div key={f} className="flex items-center gap-1 py-0.5" style={{ color: TEXT_MUTED }}>
                              <FolderOpen size={11} style={{ color: "#CA8A04" }} /><span>{f}</span>
                            </div>
                          ))}
                          {tpl.tree.length > 4 && <div className="text-xs pl-1 pt-0.5" style={{ color: TEXT_MUTED }}>+{tpl.tree.length - 4} more</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(1)} className="text-xs px-4 py-2 rounded-md font-medium border" style={{ borderColor: BORDER, color: TEXT_DARK, background: CARD_BG }}>← Back</button>
                    <button onClick={() => setStep(3)} className="text-xs px-4 py-2 rounded-md font-medium text-white" style={{ background: PRIMARY }}>Next: Select Sites →</button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="flex flex-col gap-4 max-w-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Select Sites</h2>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedSites(Array(8).fill(true))} className="text-xs px-2 py-1 rounded font-medium" style={{ color: PRIMARY, background: "#F0EEFF" }}>Select All</button>
                      <button onClick={() => setSelectedSites(Array(8).fill(false))} className="text-xs px-2 py-1 rounded font-medium border" style={{ borderColor: BORDER, color: TEXT_DARK }}>Clear All</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {SITES.map((site, i) => (
                      <div key={site.name}>
                        <label className="flex items-center gap-3 p-2.5 rounded-md cursor-pointer" style={{ border: `1px solid ${selectedSites[i] ? PRIMARY : BORDER}`, background: selectedSites[i] ? "#F0EEFF" : CARD_BG }}>
                          <input type="checkbox" checked={selectedSites[i]} onChange={e => { const n = [...selectedSites]; n[i] = e.target.checked; setSelectedSites(n); }} className="accent-purple-600" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium" style={{ color: TEXT_DARK }}>{site.name}</div>
                            <div className="text-xs" style={{ color: TEXT_MUTED }}>{site.url} · {site.studies} studies</div>
                          </div>
                          <span className="text-xs font-semibold" style={{ color: complianceColor(site.compliance) }}>{site.compliance}%</span>
                        </label>
                        {i === 6 && selectedSites[6] && (
                          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md mt-1" style={{ background: "#FFEDD5", color: "#EA580C", border: "1px solid #FED7AA" }}>
                            <AlertCircle size={12} />Riverside is syncing — deployment will queue.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(2)} className="text-xs px-4 py-2 rounded-md font-medium border" style={{ borderColor: BORDER, color: TEXT_DARK, background: CARD_BG }}>← Back</button>
                    <button onClick={() => setStep(4)} disabled={chosenSitesCount === 0} className="text-xs px-4 py-2 rounded-md font-medium text-white disabled:opacity-50" style={{ background: PRIMARY }}>Next: Configure →</button>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Configure</h2>
                  <div className="flex gap-5">
                    <div className="flex-1">
                      <div className="text-xs font-semibold mb-2" style={{ color: TEXT_DARK }}>Folder Structure Preview</div>
                      <div className="rounded-lg p-4 text-xs" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
                        {[
                          { folder: "Regulatory", docs: ["Protocol", "IRB Approval", "IND Safety Reports", "Amendments/"] },
                          { folder: "Consent Documents", docs: ["ICF Master", "HIPAA Auth"] },
                          { folder: "Investigator Files", docs: ["PI CV", "Medical License", "Financial Disclosure", "Delegation Log"] },
                          { folder: "Staff Training", docs: ["GCP Certs"] },
                          { folder: "Monitoring", docs: ["IMV Log", "Visit Reports"] },
                          { folder: "Site Agreements", docs: ["CTA", "Site Budget", "Lab Cert"] },
                        ].map(item => (
                          <div key={item.folder} className="mb-2">
                            <div className="flex items-center gap-1 font-medium mb-0.5" style={{ color: TEXT_DARK }}><span>📁</span><span>{item.folder}</span></div>
                            {item.docs.map(doc => <div key={doc} className="flex items-center gap-1 ml-4 py-0.5" style={{ color: TEXT_MUTED }}><span>{doc.endsWith("/") ? "📁" : "📄"}</span><span>{doc}</span></div>)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold mb-2" style={{ color: TEXT_DARK }}>Role Assignments</div>
                      <div className="flex flex-col gap-2">
                        {ROLES.map(role => (
                          <div key={role} className="flex items-center gap-3">
                            <label className="text-xs font-medium w-28 flex-shrink-0" style={{ color: TEXT_DARK }}>{role}</label>
                            <div className="relative flex-1">
                              <select value={roleAssignments[role]} onChange={e => setRoleAssignments(prev => ({ ...prev, [role]: e.target.value }))} className="w-full text-xs px-2.5 py-1.5 rounded-md appearance-none pr-6" style={{ border: `1px solid ${BORDER}`, background: CARD_BG, color: TEXT_DARK }}>
                                <option value="">Assign staff...</option>
                                {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-1.5 pointer-events-none" style={{ color: TEXT_MUTED }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(3)} className="text-xs px-4 py-2 rounded-md font-medium border" style={{ borderColor: BORDER, color: TEXT_DARK, background: CARD_BG }}>← Back</button>
                    <button onClick={() => setStep(5)} className="text-xs px-4 py-2 rounded-md font-medium text-white" style={{ background: PRIMARY }}>Next: Review & Deploy →</button>
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {step === 5 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Review & Deploy</h2>
                  <div className="rounded-lg p-4 grid grid-cols-2 gap-3" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
                    {[
                      { label: "Study",        value: selectedStudy },
                      { label: "Template",     value: chosenTemplate.name },
                      { label: "Sites",        value: `${chosenSitesCount} site${chosenSitesCount !== 1 ? "s" : ""}` },
                      { label: "Folders",      value: String(chosenTemplate.folders) },
                      { label: "Placeholders", value: String(chosenTemplate.placeholders) },
                      { label: "Roles",        value: String(chosenTemplate.roles) },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="text-xs" style={{ color: TEXT_MUTED }}>{item.label}</div>
                        <div className="text-sm font-semibold" style={{ color: TEXT_DARK }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  {Object.keys(deployProgress).length === 0 && !deployDone && (
                    <div className="flex gap-2">
                      <button onClick={() => setStep(4)} className="text-xs px-4 py-2 rounded-md font-medium border" style={{ borderColor: BORDER, color: TEXT_DARK, background: CARD_BG }}>← Back</button>
                      <button onClick={startDeploy} className="text-sm px-5 py-2.5 rounded-md font-semibold text-white" style={{ background: PRIMARY }}>Deploy to {chosenSitesCount} Site{chosenSitesCount !== 1 ? "s" : ""} →</button>
                    </div>
                  )}
                  {Object.keys(deployProgress).length > 0 && (
                    <div className="flex flex-col gap-2">
                      {selectedSites.map((sel, i) => {
                        if (!sel) return null;
                        const pct = deployProgress[i] ?? 0;
                        const status = deployStatus[i] ?? "Queued";
                        return (
                          <div key={i} className="rounded-lg p-3" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-medium" style={{ color: TEXT_DARK }}>{SITES[i].name}</span>
                              <div className="flex items-center gap-2">
                                {status === "Complete" && deployDone && <a href="#" className="text-xs flex items-center gap-1" style={{ color: PRIMARY }}>View in eBinders <ExternalLink size={11} /></a>}
                                <span className="text-xs font-medium" style={{ color: status === "Complete" ? "#16A34A" : status === "Deploying" ? PRIMARY : TEXT_MUTED }}>{status}</span>
                              </div>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                              <div className="h-full rounded-full transition-all duration-100" style={{ width: `${pct}%`, background: status === "Complete" ? "#16A34A" : PRIMARY }} />
                            </div>
                          </div>
                        );
                      })}
                      {deployDone && (
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#16A34A" }}>
                            <CheckCircle size={16} />Deployment complete!
                          </div>
                          <button onClick={resetDeploy} className="text-xs px-3 py-1.5 rounded-md font-medium border" style={{ borderColor: BORDER, color: TEXT_DARK, background: CARD_BG }}>Deploy Another</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
