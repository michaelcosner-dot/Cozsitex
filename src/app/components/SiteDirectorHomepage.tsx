import { useState, useMemo } from "react";
import { Link } from "react-router";

/* ─── Mock Data ─── */

type PipelineStatus = "Startup" | "Enrolling" | "Follow-up" | "Closed";
type Health = "good" | "warning" | "risk" | "closed";

const STUDIES = [
  { id: "onx-204",  protocol: "ONX-204",  dept: "Oncology",      pi: "Dr. Okafor",     crc: "Sarah Chen",    crcInit: "SC", crcColor: "#0D9488", phase: "II",  pipeline: "Enrolling"  as PipelineStatus, enrolled: 118, target: 180, health: "good"    as Health, flags: 3, expiredDocs: 0, auditScore: 88, daysInPhase: 82,  startupDays: 44, missingDocs: 2,  staffed: true,  trainingPct: 100, sponsor: "Onyxia Bio" },
  { id: "brio-2",   protocol: "BRIO-2",   dept: "Oncology",      pi: "Dr. Okafor",     crc: "Karen Ng",      crcInit: "KN", crcColor: "#7C3AED", phase: "I",   pipeline: "Enrolling"  as PipelineStatus, enrolled: 9,   target: 24,  health: "warning" as Health, flags: 3, expiredDocs: 1, auditScore: 63, daysInPhase: 31,  startupDays: 51, missingDocs: 8,  staffed: true,  trainingPct: 95,  sponsor: "Bridgewood Oncology" },
  { id: "hel-3b",   protocol: "HEL-3B",   dept: "Oncology",      pi: "Dr. Okafor",     crc: "Robert Steele", crcInit: "RS", crcColor: "#059669", phase: "II",  pipeline: "Follow-up"  as PipelineStatus, enrolled: 30,  target: 30,  health: "good"    as Health, flags: 1, expiredDocs: 0, auditScore: 91, daysInPhase: 107, startupDays: 38, missingDocs: 1,  staffed: true,  trainingPct: 100, sponsor: "Helios Pharma" },
  { id: "vrt-11",   protocol: "VRT-11",   dept: "Oncology",      pi: "Dr. Okafor",     crc: "Maya Harlow",   crcInit: "MH", crcColor: "#D97706", phase: "I",   pipeline: "Startup"    as PipelineStatus, enrolled: 0,   target: 18,  health: "warning" as Health, flags: 0, expiredDocs: 0, auditScore: 74, daysInPhase: 18,  startupDays: null, missingDocs: 3, staffed: true,  trainingPct: 88,  sponsor: "Verta Bio" },
  { id: "card-33",  protocol: "CARD-33",  dept: "Cardiology",    pi: "Dr. Martinez",   crc: "Tom Walsh",     crcInit: "TW", crcColor: "#6366F1", phase: "III", pipeline: "Enrolling"  as PipelineStatus, enrolled: 38,  target: 60,  health: "warning" as Health, flags: 2, expiredDocs: 2, auditScore: 71, daysInPhase: 95,  startupDays: 53, missingDocs: 5,  staffed: false, trainingPct: 88,  sponsor: "CardioMed" },
  { id: "diab-07",  protocol: "DIAB-07",  dept: "Endocrinology", pi: "Dr. Patel",      crc: "Lisa Wong",     crcInit: "LW", crcColor: "#0891B2", phase: "II",  pipeline: "Enrolling"  as PipelineStatus, enrolled: 45,  target: 80,  health: "good"    as Health, flags: 0, expiredDocs: 0, auditScore: 96, daysInPhase: 124, startupDays: 41, missingDocs: 0,  staffed: true,  trainingPct: 100, sponsor: "EndoResearch" },
  { id: "neuro-12", protocol: "NEURO-12", dept: "Neurology",     pi: "Dr. Kim",        crc: "Amy Chen",      crcInit: "AC", crcColor: "#E11D48", phase: "II",  pipeline: "Startup"    as PipelineStatus, enrolled: 0,   target: 30,  health: "risk"    as Health, flags: 5, expiredDocs: 3, auditScore: 51, daysInPhase: 35,  startupDays: null, missingDocs: 12, staffed: false, trainingPct: 72, sponsor: "NeuroAdvance" },
  { id: "resp-04",  protocol: "RESP-04",  dept: "Pulmonology",   pi: "Dr. Johnson",    crc: "Mark Davis",    crcInit: "MD", crcColor: "#0369A1", phase: "II",  pipeline: "Enrolling"  as PipelineStatus, enrolled: 22,  target: 40,  health: "good"    as Health, flags: 1, expiredDocs: 0, auditScore: 82, daysInPhase: 66,  startupDays: 39, missingDocs: 2,  staffed: true,  trainingPct: 91,  sponsor: "RespiraTech" },
  { id: "card-41",  protocol: "CARD-41",  dept: "Cardiology",    pi: "Dr. Martinez",   crc: "Tom Walsh",     crcInit: "TW", crcColor: "#6366F1", phase: "III", pipeline: "Follow-up"  as PipelineStatus, enrolled: 55,  target: 55,  health: "good"    as Health, flags: 0, expiredDocs: 0, auditScore: 94, daysInPhase: 188, startupDays: 47, missingDocs: 0,  staffed: true,  trainingPct: 100, sponsor: "CardioMed" },
  { id: "rhe-09",   protocol: "RHE-09",   dept: "Rheumatology",  pi: "Dr. Singh",      crc: "Paula Reed",    crcInit: "PR", crcColor: "#9333EA", phase: "II",  pipeline: "Startup"    as PipelineStatus, enrolled: 0,   target: 20,  health: "warning" as Health, flags: 1, expiredDocs: 0, auditScore: 68, daysInPhase: 12,  startupDays: null, missingDocs: 4, staffed: true,  trainingPct: 80,  sponsor: "RheumaCare" },
  { id: "onco-88",  protocol: "ONCO-88",  dept: "Oncology",      pi: "Dr. Washington", crc: "Janet Kim",     crcInit: "JK", crcColor: "#047857", phase: "III", pipeline: "Enrolling"  as PipelineStatus, enrolled: 67,  target: 100, health: "good"    as Health, flags: 2, expiredDocs: 1, auditScore: 87, daysInPhase: 143, startupDays: 44, missingDocs: 1,  staffed: true,  trainingPct: 97,  sponsor: "OncoGenomics" },
  { id: "rare-15",  protocol: "RARE-15",  dept: "Rare Disease",  pi: "Dr. Lee",        crc: "Bob Chen",      crcInit: "BC", crcColor: "#B45309", phase: "II",  pipeline: "Closed"     as PipelineStatus, enrolled: 24,  target: 24,  health: "closed"  as Health, flags: 0, expiredDocs: 0, auditScore: 92, daysInPhase: 0,   startupDays: 42, missingDocs: 0,  staffed: true,  trainingPct: 100, sponsor: "RareTx" },
];

const CRC_PERF = [
  { name: "Sarah Chen",    dept: "Oncology",      avgHrs: 1.8, sigs: 42, trend: "up"   as const },
  { name: "Karen Ng",      dept: "Oncology",      avgHrs: 2.1, sigs: 28, trend: "flat" as const },
  { name: "Lisa Wong",     dept: "Endocrinology", avgHrs: 2.3, sigs: 35, trend: "up"   as const },
  { name: "Mark Davis",    dept: "Pulmonology",   avgHrs: 2.6, sigs: 19, trend: "flat" as const },
  { name: "Robert Steele", dept: "Oncology",      avgHrs: 2.8, sigs: 24, trend: "down" as const },
  { name: "Paula Reed",    dept: "Rheumatology",  avgHrs: 3.4, sigs: 11, trend: "flat" as const },
  { name: "Maya Harlow",   dept: "Oncology",      avgHrs: 3.7, sigs: 16, trend: "down" as const },
  { name: "Tom Walsh",     dept: "Cardiology",    avgHrs: 4.1, sigs: 31, trend: "down" as const },
  { name: "Janet Kim",     dept: "Oncology",      avgHrs: 4.4, sigs: 22, trend: "flat" as const },
  { name: "Amy Chen",      dept: "Neurology",     avgHrs: 5.2, sigs: 8,  trend: "down" as const },
];

const PI_PERF = [
  { name: "Dr. Patel",      dept: "Endocrinology", avgHrs: 2.1, sigs: 35 },
  { name: "Dr. Okafor",     dept: "Oncology",      avgHrs: 2.4, sigs: 68 },
  { name: "Dr. Johnson",    dept: "Pulmonology",   avgHrs: 3.2, sigs: 19 },
  { name: "Dr. Martinez",   dept: "Cardiology",    avgHrs: 3.8, sigs: 44 },
  { name: "Dr. Lee",        dept: "Rare Disease",  avgHrs: 4.1, sigs: 14 },
  { name: "Dr. Singh",      dept: "Rheumatology",  avgHrs: 4.5, sigs: 11 },
  { name: "Dr. Washington", dept: "Oncology",      avgHrs: 4.8, sigs: 22 },
  { name: "Dr. Kim",        dept: "Neurology",     avgHrs: 6.8, sigs: 8  },
];

const DEPT_OVERVIEW = [
  { dept: "Oncology",      studies: 5, crcs: 4, avgStartup: 44, avgSigning: 2.8, trainingPct: 96,  staffed: true,  auditScore: 80 },
  { dept: "Cardiology",    studies: 2, crcs: 1, avgStartup: 50, avgSigning: 3.8, trainingPct: 88,  staffed: false, auditScore: 82 },
  { dept: "Endocrinology", studies: 1, crcs: 1, avgStartup: 41, avgSigning: 2.1, trainingPct: 100, staffed: true,  auditScore: 96 },
  { dept: "Neurology",     studies: 1, crcs: 1, avgStartup: 62, avgSigning: 6.8, trainingPct: 72,  staffed: false, auditScore: 51 },
  { dept: "Pulmonology",   studies: 1, crcs: 1, avgStartup: 39, avgSigning: 3.2, trainingPct: 91,  staffed: true,  auditScore: 82 },
  { dept: "Rheumatology",  studies: 1, crcs: 1, avgStartup: 58, avgSigning: 4.5, trainingPct: 80,  staffed: true,  auditScore: 68 },
  { dept: "Rare Disease",  studies: 1, crcs: 1, avgStartup: 42, avgSigning: 4.1, trainingPct: 100, staffed: true,  auditScore: 92 },
];

const BENCHMARKS = {
  startup:    { site: 47, network: 55, top: 38,  unit: "days", lowerBetter: true  },
  signing:    { site: 3.2, network: 5.8, top: 2.1, unit: "hrs", lowerBetter: true  },
  audit:      { site: 84, network: 76, top: 91,  unit: "/100", lowerBetter: false },
  enrollment: { site: 68, network: 61, top: 79,  unit: "%",    lowerBetter: false },
};

const ANNOUNCEMENTS = [
  { id: 1, title: "IRB Deadline — Action Required", audience: "All Staff",  sent: 142, viewed: 98,  acked: 67,  date: "Apr 17", priority: "urgent"        as const },
  { id: 2, title: "Protocol Amendment — BRIO-2",    audience: "CRCs + PIs", sent: 52,  viewed: 44,  acked: 31,  date: "Apr 17", priority: "important"     as const },
  { id: 3, title: "System Maintenance Window",      audience: "All Staff",  sent: 142, viewed: 125, acked: 0,   date: "Apr 16", priority: "informational" as const },
  { id: 4, title: "GCP Training Renewal Required",  audience: "CRCs",       sent: 45,  viewed: 38,  acked: 28,  date: "Apr 15", priority: "important"     as const },
];

const REPORTS = [
  "Enrollment Summary Report",
  "Compliance & Audit Report",
  "Signing Performance Report",
  "Startup Timeline Report",
  "Staff Training Report",
  "Site Benchmarks Report",
];

/* ─── Style Maps ─── */

const PIPELINE_STYLE: Record<PipelineStatus, { bg: string; color: string; dot: string }> = {
  Startup:    { bg: "#EEF2FF", color: "#4338CA", dot: "#818CF8" },
  Enrolling:  { bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  "Follow-up":{ bg: "#FEF9C3", color: "#854D0E", dot: "#EAB308" },
  Closed:     { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" },
};

const HEALTH_CONFIG: Record<Health, { label: string; dot: string; bg: string; color: string }> = {
  good:    { label: "Good",    dot: "#16A34A", bg: "#DCFCE7", color: "#166534" },
  warning: { label: "Warning", dot: "#D97706", bg: "#FEF9C3", color: "#92400E" },
  risk:    { label: "Risk",    dot: "#DC2626", bg: "#FEE2E2", color: "#B91C1C" },
  closed:  { label: "Closed",  dot: "#9CA3AF", bg: "#F3F4F6", color: "#6B7280" },
};

const ANN_STYLE: Record<"urgent" | "important" | "informational", { bg: string; color: string }> = {
  urgent:        { bg: "#FEE2E2", color: "#B91C1C" },
  important:     { bg: "#FEF9C3", color: "#92400E" },
  informational: { bg: "#F3F4F6", color: "#6B7280" },
};

function sigColor(hrs: number) {
  if (hrs < 3) return { color: "#166534", bg: "#DCFCE7" };
  if (hrs < 5) return { color: "#92400E", bg: "#FEF9C3" };
  return { color: "#B91C1C", bg: "#FEE2E2" };
}

function auditColor(score: number) {
  if (score >= 85) return { color: "#166534", bg: "#DCFCE7" };
  if (score >= 70) return { color: "#92400E", bg: "#FEF9C3" };
  return { color: "#B91C1C", bg: "#FEE2E2" };
}

function Avatar({ initials, color, size = 22 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

/* ─── Main Component ─── */

export function SiteDirectorHomepage() {
  const [pipelineTab, setPipelineTab] = useState<"all" | PipelineStatus>("all");
  const [signingTab, setSigningTab] = useState<"crc" | "pi" | "dept">("crc");
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annForm, setAnnForm] = useState({ title: "", body: "", audience: "all", priority: "informational" });

  const totalStudies     = STUDIES.length;
  const criticalRisks    = STUDIES.filter(s => s.health === "risk").length;
  const totalExpiredDocs = STUDIES.reduce((n, s) => n + s.expiredDocs, 0);
  const avgStartup       = Math.round(STUDIES.filter(s => s.startupDays).reduce((n, s) => n + (s.startupDays ?? 0), 0) / STUDIES.filter(s => s.startupDays).length);
  const avgSigning       = +((CRC_PERF.reduce((n, c) => n + c.avgHrs * c.sigs, 0) / CRC_PERF.reduce((n, c) => n + c.sigs, 0)).toFixed(1));
  const avgAudit         = Math.round(STUDIES.reduce((n, s) => n + s.auditScore, 0) / STUDIES.length);

  const pipelineCounts: Record<string, number> = {
    Startup: STUDIES.filter(s => s.pipeline === "Startup").length,
    Enrolling: STUDIES.filter(s => s.pipeline === "Enrolling").length,
    "Follow-up": STUDIES.filter(s => s.pipeline === "Follow-up").length,
    Closed: STUDIES.filter(s => s.pipeline === "Closed").length,
  };

  const filteredStudies = useMemo(() =>
    pipelineTab === "all" ? STUDIES : STUDIES.filter(s => s.pipeline === pipelineTab),
    [pipelineTab]
  );

  const auditRanked = [...STUDIES].sort((a, b) => b.auditScore - a.auditScore);
  const auditTop    = auditRanked.slice(0, 4);
  const auditBottom = auditRanked.slice(-4).reverse();

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Dr. K. Chen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Site Director · {criticalRisks > 0 ? <><span className="text-red-600 font-semibold">{criticalRisks} critical risk{criticalRisks > 1 ? "s" : ""}</span> require attention · </> : ""}
            {totalExpiredDocs > 0 ? <><span className="text-amber-600 font-semibold">{totalExpiredDocs} expired documents</span> · </> : ""}
            Audit readiness: <span className="font-semibold text-gray-700">{avgAudit}/100</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => { setShowReports(v => !v); setShowBenchmarks(false); }}
              className="text-sm font-medium border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 text-gray-700"
            >
              📊 My Reports
            </button>
            {showReports && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowReports(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                  {REPORTS.map(r => (
                    <button key={r} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => { setShowBenchmarks(v => !v); setShowReports(false); }}
            className="text-sm font-medium border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 text-gray-700"
            style={showBenchmarks ? { borderColor: "#FF7859", color: "#FF7859" } : {}}
          >
            🏆 Site Benchmarks
          </button>
          <button
            onClick={() => setShowAnnModal(true)}
            className="text-sm font-semibold text-white rounded-xl px-4 py-2"
            style={{ background: "#111827" }}
          >
            📢 Send Announcement
          </button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-7 gap-3">
        {/* Pipeline counts */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Study Pipeline</div>
          <div className="flex items-end gap-0 divide-x divide-gray-100">
            {(["Startup", "Enrolling", "Follow-up", "Closed"] as PipelineStatus[]).map(p => {
              const st = PIPELINE_STYLE[p];
              return (
                <div key={p} className="flex-1 px-2 first:pl-0 last:pr-0 text-center">
                  <div className="text-2xl font-bold font-display" style={{ color: st.color }}>{pipelineCounts[p]}</div>
                  <div className="text-[9px] font-semibold mt-0.5 leading-tight" style={{ color: st.color }}>{p}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Avg Startup */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Avg Startup</div>
          <div className="text-2xl font-bold text-gray-900 font-display">{avgStartup}d</div>
          <div className="text-xs mt-1" style={{ color: avgStartup < BENCHMARKS.startup.network ? "#059669" : "#D97706" }}>
            {avgStartup < BENCHMARKS.startup.network
              ? `${BENCHMARKS.startup.network - avgStartup}d faster than network`
              : `${avgStartup - BENCHMARKS.startup.network}d slower than network`}
          </div>
        </div>

        {/* Avg Signing */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Avg Signing</div>
          <div className="text-2xl font-bold text-gray-900 font-display">{avgSigning}h</div>
          <div className="text-xs mt-1 text-green-600">
            {Math.round(((BENCHMARKS.signing.network - avgSigning) / BENCHMARKS.signing.network) * 100)}% faster than network
          </div>
        </div>

        {/* Critical Risks */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Critical Risks</div>
          <div className="text-2xl font-bold font-display" style={{ color: criticalRisks > 0 ? "#DC2626" : "#059669" }}>{criticalRisks}</div>
          <div className="text-xs mt-1" style={{ color: criticalRisks > 0 ? "#DC2626" : "#059669" }}>
            {criticalRisks > 0 ? "Require immediate action" : "No critical risks"}
          </div>
        </div>

        {/* Expired Docs */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Expired Docs</div>
          <div className="text-2xl font-bold font-display" style={{ color: totalExpiredDocs > 0 ? "#D97706" : "#059669" }}>{totalExpiredDocs}</div>
          <div className="text-xs mt-1" style={{ color: totalExpiredDocs > 0 ? "#D97706" : "#059669" }}>
            {totalExpiredDocs > 0 ? "Across 3 studies" : "All documents current"}
          </div>
        </div>

        {/* Audit Score */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Audit Score</div>
          <div className="text-2xl font-bold font-display" style={auditColor(avgAudit)}>{avgAudit}<span className="text-sm font-normal text-gray-400">/100</span></div>
          <div className="text-xs mt-1 text-green-600">
            {avgAudit - BENCHMARKS.audit.network}pts above network avg
          </div>
        </div>
      </div>

      {/* ── Benchmarks (collapsible) ── */}
      {showBenchmarks && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Site vs. Network Benchmarks</h2>
            <button onClick={() => setShowBenchmarks(false)} className="text-xs text-gray-400 hover:text-gray-700">close ×</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(BENCHMARKS).map(([key, b]) => {
              const label = key === "startup" ? "Avg Startup Time" : key === "signing" ? "Avg Signing Time" : key === "audit" ? "Audit Score" : "Enrollment Rate";
              const siteVsNetwork = b.lowerBetter ? b.network - b.site : b.site - b.network;
              const siteVsTop     = b.lowerBetter ? b.site - b.top : b.top - b.site;
              const siteGood      = siteVsNetwork > 0;
              const maxVal = b.lowerBetter ? Math.max(b.site, b.network, b.top) * 1.1 : 100;

              return (
                <div key={key} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs font-semibold text-gray-600">{label}</div>
                  {/* Values */}
                  <div className="space-y-2">
                    {[
                      { who: "Your site", val: b.site, color: siteGood ? "#059669" : "#D97706" },
                      { who: "Network avg", val: b.network, color: "#9CA3AF" },
                      { who: "Top sites", val: b.top, color: "#FF7859" },
                    ].map(row => (
                      <div key={row.who}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{row.who}</span>
                          <span className="font-bold" style={{ color: row.color }}>{row.val}{b.unit}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: b.lowerBetter ? `${(1 - row.val / maxVal) * 100}%` : `${(row.val / maxVal) * 100}%`,
                            background: row.color,
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] pt-1 border-t border-gray-200" style={{ color: siteGood ? "#059669" : "#D97706" }}>
                    {siteGood ? `✓ ${Math.abs(siteVsNetwork)}${b.unit} better than network` : `⚠ ${Math.abs(siteVsNetwork)}${b.unit} behind network`}
                    {" · "}
                    <span className="text-gray-400">{Math.abs(siteVsTop)}{b.unit} gap vs top sites</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Study Pipeline + Audit Readiness ── */}
      <div className="grid grid-cols-5 gap-4 items-start">

        {/* Study Pipeline — 3/5 */}
        <div className="col-span-3 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Study Pipeline</span>
            <div className="flex gap-1">
              {(["all", "Startup", "Enrolling", "Follow-up", "Closed"] as const).map(t => {
                const count = t === "all" ? STUDIES.length : pipelineCounts[t];
                return (
                  <button
                    key={t}
                    onClick={() => setPipelineTab(t)}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize transition-colors"
                    style={pipelineTab === t
                      ? { background: "#111827", color: "#fff" }
                      : { color: "#6B7280", background: "#F3F4F6" }
                    }
                  >
                    {t === "all" ? "All" : t} {count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table header */}
          <div
            className="grid px-4 py-2 text-[9px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100"
            style={{ gridTemplateColumns: "90px 80px 90px 80px 70px 70px 40px 70px 50px" }}
          >
            <span>Protocol</span>
            <span>Dept</span>
            <span>PI</span>
            <span>Lead CRC</span>
            <span>Status</span>
            <span>Enrollment</span>
            <span>Flags</span>
            <span>Audit</span>
            <span></span>
          </div>

          <div className="divide-y divide-gray-50">
            {filteredStudies.map(s => {
              const pst  = PIPELINE_STYLE[s.pipeline];
              const hcfg = HEALTH_CONFIG[s.health];
              const pct  = s.target > 0 ? Math.round((s.enrolled / s.target) * 100) : 0;
              const ac   = auditColor(s.auditScore);
              return (
                <div
                  key={s.id}
                  className="grid items-center px-4 py-2.5 hover:bg-gray-50/60 transition-colors"
                  style={{ gridTemplateColumns: "90px 80px 90px 80px 70px 70px 40px 70px 50px" }}
                >
                  <div>
                    <Link to={`/study/${s.id}`} className="text-xs font-bold text-gray-900 hover:underline">{s.protocol}</Link>
                    <div className="text-[9px] text-gray-400">Phase {s.phase}</div>
                  </div>
                  <div className="text-[10px] text-gray-600 truncate pr-1">{s.dept}</div>
                  <div className="text-[10px] text-gray-600 truncate pr-1">{s.pi}</div>
                  <div className="flex items-center gap-1">
                    <Avatar initials={s.crcInit} color={s.crcColor} size={18} />
                    <span className="text-[10px] text-gray-600 truncate">{s.crc.split(" ")[0]}</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: hcfg.bg, color: hcfg.color }}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: hcfg.dot }} />
                      {s.pipeline === "Follow-up" ? "FU" : s.pipeline}
                    </span>
                  </div>
                  <div className="pr-2">
                    <div className="text-[10px] font-semibold text-gray-700 mb-0.5">{s.enrolled}/{s.target}</div>
                    <MiniBar pct={pct} color={s.pipeline === "Enrolling" ? "#16A34A" : s.pipeline === "Follow-up" ? "#EAB308" : "#818CF8"} />
                  </div>
                  <div>
                    {s.flags > 0
                      ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white" style={{ background: s.flags >= 3 ? "#DC2626" : "#D97706" }}>{s.flags}</span>
                      : <span className="text-gray-300 text-xs">—</span>
                    }
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={ac}>{s.auditScore}</span>
                  </div>
                  <div>
                    <Link to={`/study/${s.id}`} className="text-[10px] font-medium text-gray-400 hover:text-gray-700">open →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Readiness Rankings — 2/5 */}
        <div className="col-span-2 space-y-3">
          {/* Top performing */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Audit Readiness</span>
              <span className="text-[10px] text-gray-400">by study score</span>
            </div>
            <div className="px-3 py-2">
              <div className="text-[10px] font-semibold text-green-600 uppercase tracking-wide px-1 mb-1">✓ Best</div>
              {auditTop.map((s, i) => {
                const ac = auditColor(s.auditScore);
                return (
                  <div key={s.id} className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-gray-50">
                    <span className="text-[10px] font-bold text-gray-300 w-3 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-gray-800">{s.protocol}</span>
                        <span className="text-xs font-bold" style={{ color: ac.color }}>{s.auditScore}</span>
                      </div>
                      <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.auditScore}%`, background: ac.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <div className="text-[10px] font-semibold text-red-500 uppercase tracking-wide px-1 mb-1">⚠ Needs attention</div>
                {auditBottom.map((s, i) => {
                  const ac = auditColor(s.auditScore);
                  return (
                    <div key={s.id} className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-red-50/30">
                      <span className="text-[10px] font-bold text-gray-300 w-3 text-center">{STUDIES.length - i}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-gray-800">{s.protocol}</span>
                          <div className="flex items-center gap-1">
                            {s.missingDocs > 0 && <span className="text-[9px] text-gray-400">{s.missingDocs} missing</span>}
                            <span className="text-xs font-bold" style={{ color: ac.color }}>{s.auditScore}</span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.auditScore}%`, background: ac.color }} />
                        </div>
                      </div>
                      <Link to={`/study/${s.id}`} className="text-[9px] text-gray-400 hover:text-gray-700 flex-shrink-0">fix →</Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Signing Performance + Dept Overview ── */}
      <div className="grid grid-cols-5 gap-4 items-start">

        {/* Signing Performance — 3/5 */}
        <div className="col-span-3 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Average Time to Sign</span>
            <div className="flex gap-1">
              {(["crc", "pi", "dept"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setSigningTab(t)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase"
                  style={signingTab === t ? { background: "#111827", color: "#fff" } : { background: "#F3F4F6", color: "#6B7280" }}
                >
                  {t === "crc" ? "By CRC" : t === "pi" ? "By PI" : "By Dept"}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-2 flex items-center gap-4 border-b border-gray-50 bg-gray-50">
            {[{ label: "< 3 hrs — On target", color: "#DCFCE7", text: "#166534" }, { label: "3–5 hrs — Monitor", color: "#FEF9C3", text: "#92400E" }, { label: "> 5 hrs — Action needed", color: "#FEE2E2", text: "#B91C1C" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color, border: `1px solid ${l.text}40` }} />
                <span className="text-[10px] text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {signingTab === "crc" && CRC_PERF.map((p, i) => {
              const sc = sigColor(p.avgHrs);
              const maxHrs = 6;
              return (
                <div key={p.name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/60">
                  <span className="text-[10px] text-gray-300 w-4 text-right font-bold">{i + 1}</span>
                  <div className="w-28 flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-800">{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.dept}</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-5 rounded bg-gray-100 overflow-hidden relative">
                      <div className="h-full rounded" style={{ width: `${(p.avgHrs / maxHrs) * 100}%`, background: sc.bg, border: `1px solid ${sc.color}30` }} />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ color: sc.color }}>{p.avgHrs}h</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 w-14 text-right">{p.sigs} sigs</div>
                  <div className="w-5 text-center">
                    {p.trend === "up"   && <span className="text-green-500 text-xs">↑</span>}
                    {p.trend === "down" && <span className="text-red-400 text-xs">↓</span>}
                    {p.trend === "flat" && <span className="text-gray-300 text-xs">→</span>}
                  </div>
                </div>
              );
            })}

            {signingTab === "pi" && PI_PERF.map((p, i) => {
              const sc = sigColor(p.avgHrs);
              const maxHrs = 8;
              return (
                <div key={p.name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/60">
                  <span className="text-[10px] text-gray-300 w-4 text-right font-bold">{i + 1}</span>
                  <div className="w-32 flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-800">{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.dept}</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-5 rounded bg-gray-100 overflow-hidden relative">
                      <div className="h-full rounded" style={{ width: `${(p.avgHrs / maxHrs) * 100}%`, background: sc.bg, border: `1px solid ${sc.color}30` }} />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ color: sc.color }}>{p.avgHrs}h</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 w-14 text-right">{p.sigs} sigs</div>
                </div>
              );
            })}

            {signingTab === "dept" && DEPT_OVERVIEW.map((d, i) => {
              const sc = sigColor(d.avgSigning);
              const maxHrs = 8;
              return (
                <div key={d.dept} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/60">
                  <span className="text-[10px] text-gray-300 w-4 text-right font-bold">{i + 1}</span>
                  <div className="w-28 flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-800">{d.dept}</div>
                    <div className="text-[10px] text-gray-400">{d.studies} studies · {d.crcs} CRCs</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-5 rounded bg-gray-100 overflow-hidden relative">
                      <div className="h-full rounded" style={{ width: `${(d.avgSigning / maxHrs) * 100}%`, background: sc.bg, border: `1px solid ${sc.color}30` }} />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ color: sc.color }}>{d.avgSigning}h</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 w-20 text-right">Startup: {d.avgStartup}d</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dept Oversight — 2/5 */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Department Oversight</span>
          </div>
          <div className="divide-y divide-gray-50">
            {DEPT_OVERVIEW.map(d => {
              const ac = auditColor(d.auditScore);
              const trainingOk = d.trainingPct >= 90;
              return (
                <div key={d.dept} className="px-4 py-3 hover:bg-gray-50/60">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{d.dept}</div>
                      <div className="text-[10px] text-gray-400">{d.studies} stud{d.studies > 1 ? "ies" : "y"} · {d.crcs} CRC{d.crcs > 1 ? "s" : ""}</div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={ac}>{d.auditScore}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Training */}
                    <div>
                      <div className="text-[9px] text-gray-400 mb-0.5">Training</div>
                      <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.trainingPct}%`, background: trainingOk ? "#16A34A" : "#DC2626" }} />
                      </div>
                      <div className="text-[9px] font-semibold mt-0.5" style={{ color: trainingOk ? "#166534" : "#B91C1C" }}>{d.trainingPct}%</div>
                    </div>
                    {/* Startup */}
                    <div>
                      <div className="text-[9px] text-gray-400 mb-1">Startup</div>
                      <div className="text-[10px] font-semibold text-gray-700">{d.avgStartup}d</div>
                    </div>
                    {/* Staffing */}
                    <div>
                      <div className="text-[9px] text-gray-400 mb-1">Staffing</div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={d.staffed ? { background: "#DCFCE7", color: "#166534" } : { background: "#FEE2E2", color: "#B91C1C" }}>
                        {d.staffed ? "✓ Staffed" : "⚠ Short"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Announcements ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Announcements</span>
          <button
            onClick={() => setShowAnnModal(true)}
            className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
            style={{ background: "#FF7859" }}
          >
            + New Announcement
          </button>
        </div>

        {/* Table header */}
        <div className="grid px-4 py-2 text-[9px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100"
          style={{ gridTemplateColumns: "80px 1fr 100px 60px 120px 120px 60px" }}>
          <span>Priority</span>
          <span>Title</span>
          <span>Audience</span>
          <span>Sent</span>
          <span>Viewed</span>
          <span>Acknowledged</span>
          <span></span>
        </div>

        <div className="divide-y divide-gray-50">
          {ANNOUNCEMENTS.map(a => {
            const as_ = ANN_STYLE[a.priority];
            const viewPct = Math.round((a.viewed / a.sent) * 100);
            const ackPct  = a.acked > 0 ? Math.round((a.acked / a.sent) * 100) : 0;
            return (
              <div key={a.id} className="grid items-center px-4 py-3 hover:bg-gray-50/60"
                style={{ gridTemplateColumns: "80px 1fr 100px 60px 120px 120px 60px" }}>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit" style={as_}>{a.priority}</span>
                <div>
                  <div className="text-xs font-semibold text-gray-800">{a.title}</div>
                  <div className="text-[10px] text-gray-400">{a.date}</div>
                </div>
                <div className="text-[10px] text-gray-500">{a.audience}</div>
                <div className="text-xs font-semibold text-gray-700">{a.sent}</div>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold text-gray-700">{a.viewed}</span>
                    <span className="text-[9px] text-gray-400">{viewPct}%</span>
                  </div>
                  <MiniBar pct={viewPct} color="#059669" />
                </div>
                <div>
                  {a.acked > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-semibold text-gray-700">{a.acked}</span>
                        <span className="text-[9px] text-gray-400">{ackPct}%</span>
                      </div>
                      <MiniBar pct={ackPct} color="#FF7859" />
                    </>
                  ) : <span className="text-[10px] text-gray-300">N/A</span>}
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] font-medium text-gray-400 hover:text-gray-700">View</button>
                  <button className="text-[10px] font-medium text-gray-400 hover:text-gray-700">Resend</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Announcement Modal ── */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">New Announcement</h2>
              <button onClick={() => setShowAnnModal(false)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                  placeholder="Announcement title…"
                  value={annForm.title}
                  onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    value={annForm.priority}
                    onChange={e => setAnnForm(f => ({ ...f, priority: e.target.value }))}
                  >
                    <option value="informational">Informational</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Audience</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    value={annForm.audience}
                    onChange={e => setAnnForm(f => ({ ...f, audience: e.target.value }))}
                  >
                    <option value="all">All Staff</option>
                    <option value="crcs">CRCs Only</option>
                    <option value="pis">PIs Only</option>
                    <option value="crcs-pis">CRCs + PIs</option>
                    <option value="oncology">Oncology Dept</option>
                    <option value="cardiology">Cardiology Dept</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                  rows={4}
                  placeholder="Type your announcement…"
                  value={annForm.body}
                  onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setShowAnnModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => setShowAnnModal(false)}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg"
                style={{ background: "#FF7859" }}
              >
                Send Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
