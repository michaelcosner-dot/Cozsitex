import { useParams, Link } from "react-router";
import { useState } from "react";

const MOCK_STUDIES: Record<string, any> = {
  "onx-204": {
    id: "ONX-204",
    title: "ONX-204",
    phase: "Phase II",
    status: "active",
    indication: "mNSCLC",
    sponsor: "Onyxia Bio",
    therapeuticArea: "Oncology",
    pi: "Dr. A. Okafor",
    protocol: "v3.2 · amendment pending",
    irb: "Active · expires Dec '26",
    sites: "42 active / 60 planned",
    sponsorContact: "J. Reyes · Onyxia Bio",
    nextMilestone: "Protocol amend. v3.2",
    stats: {
      sitesActivated: { value: "42/60", sub: "13 in IRB" },
      enrolled: { value: "118/180", sub: "66% · on pace" },
      openTasks: { value: "2", sub: "3 due today" },
      docsPending: { value: "6", sub: "2 overdue" },
      budgetBurn: { value: "62%", sub: "of $12.4M" },
    },
    team: ["MB", "KN", "RS", "MH"],
    teamExtra: 5,
  },
  "001": {
    id: "PROTO-2024-001",
    title: "Cardiac Intervention Trial",
    phase: "Phase III",
    status: "active",
    indication: "Cardiology",
    sponsor: "CardioMed Inc",
    therapeuticArea: "Cardiology",
    pi: "Dr. Martinez",
    protocol: "v1.4 · approved",
    irb: "Active · expires Mar '27",
    sites: "18 active / 24 planned",
    sponsorContact: "T. Walsh · CardioMed Inc",
    nextMilestone: "Interim analysis Q3 '26",
    stats: {
      sitesActivated: { value: "18/24", sub: "3 in IRB" },
      enrolled: { value: "45/60", sub: "75% · on pace" },
      openTasks: { value: "5", sub: "2 due today" },
      docsPending: { value: "3", sub: "1 overdue" },
      budgetBurn: { value: "48%", sub: "of $8.2M" },
    },
    team: ["SC", "MT", "LW"],
    teamExtra: 2,
  },
};

const CONNECTED_TOOLS = [
  {
    id: "ebinders",
    name: "eBinders",
    letter: "e",
    color: "#4F46E5",
    badge: 6,
    description: "eTMF · 1,284 docs",
    statusText: "6 pending your sig",
    preview: "[ ebinders preview ]",
  },
  {
    id: "econsent",
    name: "eConsent",
    letter: "e",
    color: "#7C3AED",
    badge: 2,
    description: "318 sigs, 5 ICF versions",
    statusText: "2 awaiting countersign",
    preview: "[ econsent preview ]",
  },
  {
    id: "feasibility",
    name: "Feasibility",
    letter: "F",
    color: "#D97706",
    badge: 0,
    description: "42 sites scored",
    statusText: "Complete — Q1 '26",
    preview: "[ feasibility preview ]",
  },
  {
    id: "protocol-intel",
    name: "Protocol Intel",
    letter: "P",
    color: "#059669",
    badge: 3,
    description: "11 flags, 3 critical",
    statusText: "3 new flags · $6.4",
    preview: "[ protocol intel preview ]",
  },
  {
    id: "site-monitor",
    name: "Site Monitor",
    letter: "S",
    color: "#8B5CF6",
    badge: 2,
    description: "42 sites · 2 queries",
    statusText: "Queries need response",
    preview: "[ site monitor preview ]",
  },
  {
    id: "reports",
    name: "Reports",
    letter: "R",
    color: "#0D9488",
    badge: 0,
    description: "Dashboards & exports",
    statusText: "Weekly digest ready",
    preview: "[ reports preview ]",
  },
];

const MY_TASKS = [
  { id: 1, title: "Approve protocol amendment v3.2", urgency: "Today", urgencyColor: "#F59E0B", done: false },
  { id: 2, title: "Resolve 3 protocol ambiguity flags", urgency: "Soon", urgencyColor: "#5C4EE5", done: false },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    actor: "KN",
    actorColor: "#7C3AED",
    action: "uploaded",
    object: "Protocol Amendment v3.2",
    tool: "eBinders",
    time: "18m ago",
  },
  {
    id: 2,
    actor: "RS",
    actorColor: "#059669",
    action: "countersigned",
    object: "ICF Version 5 — Spanish",
    tool: "eConsent",
    time: "1h ago",
  },
  {
    id: 3,
    actor: "MH",
    actorColor: "#D97706",
    action: "flagged",
    object: "3 new protocol flags",
    tool: "Protocol Intel",
    time: "2h ago",
  },
  {
    id: 4,
    actor: "MB",
    actorColor: "#4F46E5",
    action: "completed",
    object: "Site initiation visit — Site 42",
    tool: "Site Monitor",
    time: "4h ago",
  },
  {
    id: 5,
    actor: "SC",
    actorColor: "#0D9488",
    action: "exported",
    object: "Weekly enrollment digest",
    tool: "Reports",
    time: "Yesterday",
  },
  {
    id: 6,
    actor: "KN",
    actorColor: "#7C3AED",
    action: "submitted",
    object: "SAE report #14 to IRB",
    tool: "eBinders",
    time: "Yesterday",
  },
];

const MILESTONES = [
  { label: "Protocol Approved", date: "Jan 12, 2024", done: true },
  { label: "Site Activation (first)", date: "Feb 1, 2024", done: true },
  { label: "First Patient In", date: "Mar 15, 2024", done: true },
  { label: "50% Enrollment", date: "Oct 3, 2024", done: true },
  { label: "Protocol Amend. v3.2", date: "May 2026", done: false, current: true },
  { label: "Full Enrollment", date: "Aug 2026", done: false },
  { label: "Database Lock", date: "Dec 2026", done: false },
  { label: "Primary Analysis", date: "Q1 2027", done: false },
];

const PERSONNEL = [
  { initials: "AO", name: "Dr. A. Okafor", role: "Principal Investigator", color: "#4F46E5" },
  { initials: "SC", name: "Sarah Chen", role: "CRC Lead", color: "#0D9488" },
  { initials: "KN", name: "Karen Ng", role: "Sub-Investigator", color: "#7C3AED" },
  { initials: "RS", name: "Robert Steele", role: "Research Nurse", color: "#059669" },
  { initials: "MH", name: "Maya Harlow", role: "Data Manager", color: "#D97706" },
  { initials: "MB", name: "Marcus Bell", role: "Budget Coordinator", color: "#8B5CF6" },
];

function Avatar({ initials, color, size = 28 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        flexShrink: 0,
        border: "2px solid #fff",
      }}
    >
      {initials}
    </div>
  );
}

function ToolCard({ tool }: { tool: typeof CONNECTED_TOOLS[0] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ background: tool.color }}
          >
            {tool.letter}
          </div>
          <span className="font-semibold text-[13px] text-gray-900">{tool.name}</span>
        </div>
        {tool.badge > 0 && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "#FEF3EC", color: "#C05621" }}
          >
            {tool.badge} for you
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500">{tool.description}</p>
      <div
        className="rounded-lg flex items-center justify-center text-xs text-gray-300 border border-dashed border-gray-200"
        style={{ height: 64 }}
      >
        {tool.preview}
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-500">{tool.statusText}</span>
        <button className="text-xs font-medium text-gray-700 hover:text-gray-900">
          open →
        </button>
      </div>
    </div>
  );
}

export function StudyWorkspace() {
  const { studyId } = useParams();
  const key = studyId?.toLowerCase() || "onx-204";
  const study = MOCK_STUDIES[key] || MOCK_STUDIES["onx-204"];

  const [tasksDone, setTasksDone] = useState<number[]>([]);
  const [activityFilter, setActivityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "personnel" | "milestones">("overview");

  const toggleTask = (id: number) =>
    setTasksDone((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-gray-600">Portfolio</Link>
        <span>›</span>
        <Link to="/" className="hover:text-gray-600">Studies</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">{study.id}</span>
      </div>

      {/* Main layout: content + right sidebar */}
      <div className="flex gap-5 items-start">
        {/* Left / main content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Study Header Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            {/* Title row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <h1 className="text-xl font-bold text-gray-900">{study.title}</h1>
                </div>
                <button
                  className="text-xs font-medium border border-gray-300 rounded-full px-3 py-0.5 text-gray-600 hover:bg-gray-50"
                >
                  Watch
                </button>
                <span
                  className="text-xs font-semibold px-3 py-0.5 rounded-full"
                  style={{ background: "#EEF2FF", color: "#4338CA" }}
                >
                  {study.phase}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <div className="flex items-center">
                  {study.team.map((t: string, i: number) => (
                    <div key={t} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: study.team.length - i }}>
                      <Avatar
                        initials={t}
                        color={PERSONNEL.find((p) => p.initials === t)?.color || "#6B7280"}
                        size={28}
                      />
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-gray-500 bg-gray-100"
                    style={{ width: 28, height: 28, marginLeft: -8, fontSize: 10 }}
                  >
                    +{study.teamExtra}
                  </div>
                </div>
                <button className="text-sm font-medium border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                  Share
                </button>
                <button
                  className="text-sm font-semibold text-white rounded-lg px-4 py-1.5"
                  style={{ background: "#111827" }}
                >
                  Resume →
                </button>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-gray-500 mb-5">
              {study.phase} · {study.indication} · {study.sponsor} · {study.therapeuticArea} · PI: {study.pi}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-5 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
              {[
                { label: "SITES ACTIVATED", ...study.stats.sitesActivated },
                { label: "ENROLLED", ...study.stats.enrolled },
                { label: "MY OPEN TASKS", ...study.stats.openTasks },
                { label: "DOCS PENDING", ...study.stats.docsPending },
                { label: "BUDGET BURN", ...study.stats.budgetBurn },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-3">
                  <div className="text-[10px] font-semibold text-gray-400 tracking-wide mb-1">{stat.label}</div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1">
            {(["overview", "personnel", "milestones"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="text-sm font-medium px-4 py-2 rounded-lg capitalize transition-colors"
                style={
                  activeTab === tab
                    ? { background: "#fff", color: "#111827", border: "1px solid #E5E7EB" }
                    : { color: "#6B7280", border: "1px solid transparent" }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <>
              {/* Connected Tools */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Connected tools</h2>
                <div className="grid grid-cols-3 gap-3">
                  {CONNECTED_TOOLS.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">Recent activity</h2>
                  <div className="flex gap-1">
                    {["all", "eBinders", "eConsent", "Protocol Intel"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setActivityFilter(f)}
                        className="text-xs px-2.5 py-1 rounded-full capitalize"
                        style={
                          activityFilter === f
                            ? { background: "#F3F4F6", color: "#111827", fontWeight: 600 }
                            : { color: "#6B7280" }
                        }
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.filter(
                    (a) => activityFilter === "all" || a.tool === activityFilter
                  ).map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <Avatar initials={event.actor} color={event.actorColor} size={28} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{event.actor}</span>{" "}
                          <span className="text-gray-500">{event.action}</span>{" "}
                          <span className="font-medium">{event.object}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: "#F3F4F6", color: "#6B7280" }}
                          >
                            {event.tool}
                          </span>
                          <span className="text-xs text-gray-400">{event.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "personnel" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Study Personnel</h2>
                <button
                  className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
                  style={{ background: "#5C4EE5" }}
                >
                  + Add member
                </button>
              </div>
              <div className="space-y-2">
                {PERSONNEL.map((p) => (
                  <div
                    key={p.initials}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                  >
                    <Avatar initials={p.initials} color={p.color} size={36} />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.role}</div>
                    </div>
                    <button className="text-xs text-gray-400 hover:text-gray-700">View profile →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-700">Study Milestones</h2>
                <button
                  className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
                  style={{ background: "#5C4EE5" }}
                >
                  + Add milestone
                </button>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
                <div className="space-y-5">
                  {MILESTONES.map((m) => (
                    <div key={m.label} className="relative flex items-start gap-4">
                      <div
                        className="absolute -left-4 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: m.done ? "#5C4EE5" : m.current ? "#fff" : "#fff",
                          borderColor: m.done ? "#5C4EE5" : m.current ? "#5C4EE5" : "#D1D5DB",
                        }}
                      >
                        {m.done && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                        {m.current && (
                          <div className="w-2 h-2 rounded-full" style={{ background: "#5C4EE5" }} />
                        )}
                      </div>
                      <div className="pl-2">
                        <div
                          className="text-sm font-medium"
                          style={{ color: m.done ? "#6B7280" : "#111827" }}
                        >
                          {m.label}
                          {m.current && (
                            <span
                              className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: "#EEF2FF", color: "#4338CA" }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{m.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {/* My Tasks on this study */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-800">My tasks on this study</span>
              <span className="text-xs text-gray-400">{MY_TASKS.length} items</span>
            </div>
            <div className="space-y-2">
              {MY_TASKS.map((task) => (
                <div key={task.id} className="flex items-start gap-2.5">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center hover:border-purple-400 transition-colors"
                    style={
                      tasksDone.includes(task.id)
                        ? { background: "#5C4EE5", borderColor: "#5C4EE5" }
                        : {}
                    }
                  >
                    {tasksDone.includes(task.id) && (
                      <svg viewBox="0 0 10 8" width="8" height="8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs text-gray-800 leading-snug"
                      style={tasksDone.includes(task.id) ? { textDecoration: "line-through", color: "#9CA3AF" } : {}}
                    >
                      {task.title}
                    </p>
                    <span
                      className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: task.urgencyColor + "20", color: task.urgencyColor }}
                    >
                      {task.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-gray-400 hover:text-gray-700 w-full text-left">
              See all tasks on this study →
            </button>
          </div>

          {/* Study Snapshot */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-800">Study snapshot</span>
              <span className="text-[10px] text-gray-400">synced 18m ago</span>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Protocol", value: study.protocol },
                { label: "IRB", value: study.irb },
                { label: "Sites", value: study.sites },
                { label: "Sponsor contact", value: study.sponsorContact },
                { label: "Next milestone", value: study.nextMilestone },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
                  <div className="text-xs text-gray-800 mt-0.5">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">Quick links</div>
            <div className="space-y-1.5">
              {[
                { label: "IRB submission portal", icon: "🏛️" },
                { label: "Sponsor study page", icon: "🔗" },
                { label: "Budget tracker", icon: "💰" },
                { label: "Protocol PDF", icon: "📄" },
              ].map((link) => (
                <button
                  key={link.label}
                  className="w-full flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-2 py-1.5 text-left"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
