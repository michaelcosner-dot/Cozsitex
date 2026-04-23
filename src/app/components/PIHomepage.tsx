import { useState, useMemo } from "react";
import { Link } from "react-router";

/* ─── Mock Data ─── */

const ACTION_QUEUE = [
  {
    id: 1,
    title: "Approve protocol amendment v3.2 redline",
    study: "ONX-204",
    context: "Documents",
    type: "signature" as const,
    urgency: "Today" as const,
    estMins: 12,
    path: "/study/onx-204",
  },
  {
    id: 2,
    title: "Sign FDA Form 1572 — Site #4",
    study: "VRT-11",
    context: "Regulatory",
    type: "signature" as const,
    urgency: "Today" as const,
    estMins: 5,
    path: "/study/vrt-11",
  },
  {
    id: 3,
    title: "Approve Cohort 2 dose escalation memo",
    study: "BRIO-2",
    context: "Protocol Intel",
    type: "approval" as const,
    urgency: "Soon" as const,
    estMins: 18,
    path: "/study/brio-2",
  },
  {
    id: 4,
    title: "Review DSMB charter draft",
    study: "HEL-3B",
    context: "eBinders",
    type: "review" as const,
    urgency: "Later" as const,
    estMins: 30,
    path: "/study/hel-3b",
  },
  {
    id: 5,
    title: "Co-sign budget amendment ($420K)",
    study: "ONX-204",
    context: "Contracting",
    type: "signature" as const,
    urgency: "Later" as const,
    estMins: 8,
    path: "/study/onx-204",
  },
  {
    id: 6,
    title: "Acknowledge Q2 IRB reporting deadline",
    study: "All Studies",
    context: "Announcement",
    type: "ack" as const,
    urgency: "Soon" as const,
    estMins: 2,
    path: "/",
  },
];

const PI_STUDIES = [
  {
    id: "onx-204",
    protocol: "ONX-204",
    name: "mNSCLC · Onyxia Bio",
    phase: "Phase II",
    studyStatus: "Enrolling" as const,
    leadCRC: { initials: "SC", name: "Sarah Chen", color: "#0D9488" },
    enrolled: 118,
    target: 180,
    lastEnrolled: "Apr 18, 2026",
    nextEvent: { label: "Protocol amend. review", date: "May 2" },
    openFlags: 3,
  },
  {
    id: "brio-2",
    protocol: "BRIO-2",
    name: "AML · Bridgewood Oncology",
    phase: "Phase I",
    studyStatus: "Enrolling" as const,
    leadCRC: { initials: "KN", name: "Karen Ng", color: "#7C3AED" },
    enrolled: 9,
    target: 24,
    lastEnrolled: "Apr 12, 2026",
    nextEvent: { label: "Cohort 2 DLT review", date: "May 5" },
    openFlags: 3,
  },
  {
    id: "hel-3b",
    protocol: "HEL-3B",
    name: "Lymphoma · Helios Pharma",
    phase: "Phase II",
    studyStatus: "Follow-up" as const,
    leadCRC: { initials: "RS", name: "Robert Steele", color: "#059669" },
    enrolled: 30,
    target: 30,
    lastEnrolled: "Jan 4, 2026",
    nextEvent: { label: "12-mo follow-up visits", date: "Apr 28" },
    openFlags: 1,
  },
  {
    id: "vrt-11",
    protocol: "VRT-11",
    name: "Solid Tumors · Verta Bio",
    phase: "Phase I",
    studyStatus: "Startup" as const,
    leadCRC: { initials: "MH", name: "Maya Harlow", color: "#D97706" },
    enrolled: 0,
    target: 18,
    lastEnrolled: null,
    nextEvent: { label: "Site activation", date: "Apr 30" },
    openFlags: 0,
  },
];

const PERF = {
  thisMonth: { avg: 2.4, sigs: 18 },
  ytd: { avg: 3.1, sigs: 214 },
  siteBenchmark: 4.8,
  networkBenchmark: 6.2,
  siteRankPct: 5,
  networkRankPct: 8,
  streak: 4,
  monthlyGoalHrs: 3.0,
};

const UPCOMING_EVENTS = PI_STUDIES
  .map(s => ({ study: s.protocol, label: s.nextEvent.label, date: s.nextEvent.date, status: s.studyStatus }))
  .sort((a, b) => {
    const order = ["Apr 28", "Apr 30", "May 2", "May 5"];
    return order.indexOf(a.date) - order.indexOf(b.date);
  });

/* ─── Helpers ─── */

type ActionType = "signature" | "approval" | "review" | "ack";
type Urgency = "Today" | "Soon" | "Later";
type StudyStatus = "Startup" | "Enrolling" | "Follow-up" | "Closed";

const TYPE_STYLE: Record<ActionType, { label: string; bg: string; color: string }> = {
  signature: { label: "signature",  bg: "#EEF2FF", color: "#4338CA" },
  approval:  { label: "approval",   bg: "#FEF3C7", color: "#92400E" },
  review:    { label: "review",     bg: "#F0FDF4", color: "#166534" },
  ack:       { label: "acknowledge",bg: "#FFF7ED", color: "#9A3412" },
};

const URGENCY_STYLE: Record<Urgency, { bg: string; color: string }> = {
  Today: { bg: "#FEE2E2", color: "#B91C1C" },
  Soon:  { bg: "#FEF3C7", color: "#92400E" },
  Later: { bg: "#F3F4F6", color: "#6B7280" },
};

const STATUS_STYLE: Record<StudyStatus, { bg: string; color: string; dot: string }> = {
  Startup:    { bg: "#EEF2FF", color: "#4338CA", dot: "#818CF8" },
  Enrolling:  { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  "Follow-up":{ bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  Closed:     { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" },
};

function Avatar({ initials, color, size = 24 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: color, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({ label, value, sub, subColor }: { label: string; value: React.ReactNode; sub: string; subColor?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <div className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-900 leading-none mb-1.5">{value}</div>
      <div className="text-xs" style={{ color: subColor || "#9CA3AF" }}>{sub}</div>
    </div>
  );
}

// Single-track benchmark bar: you marker + benchmark marker on one shared scale
function BenchmarkTrack({
  label, yours, site, network, max = 7,
}: { label?: string; yours: number; site: number; network: number; max?: number }) {
  const youPct   = (yours   / max) * 100;
  const sitePct  = (site    / max) * 100;
  const netPct   = (network / max) * 100;
  const siteAdv  = Math.round(((site    - yours) / site)    * 100);
  const netAdv   = Math.round(((network - yours) / network) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white">Benchmark comparison</span>
        <div className="flex gap-3">
          <span className="text-[10px] text-green-300">Site: <span className="font-semibold text-white">{siteAdv}% faster</span></span>
          <span className="text-[10px] text-green-300">Network: <span className="font-semibold text-white">{netAdv}% faster</span></span>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-2 rounded-full bg-white/15">
        {/* Your filled area */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${youPct}%`, background: "#4ADE80" }}
        />
        {/* You marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
          style={{ left: `calc(${youPct}% - 6px)`, background: "#4ADE80" }}
        />
        {/* Site benchmark marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/50"
          style={{ left: `${sitePct}%` }}
        />
        {/* Network benchmark marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/30"
          style={{ left: `${netPct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="relative h-4">
        <span
          className="absolute text-[10px] font-semibold text-green-300 -translate-x-1/2"
          style={{ left: `${youPct}%` }}
        >
          You {yours}h
        </span>
        <span
          className="absolute text-[10px] text-white/50 -translate-x-1/2"
          style={{ left: `${sitePct}%` }}
        >
          Site {site}h
        </span>
        <span
          className="absolute text-[10px] text-white/30 -translate-x-1/2"
          style={{ left: `${netPct}%` }}
        >
          Network {network}h
        </span>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export function PIHomepage() {
  const [doneIds, setDoneIds] = useState<number[]>([]);
  const today = ACTION_QUEUE.filter(a => a.urgency === "Today");
  const todaySigsDone = today.filter(a => doneIds.includes(a.id));
  const allDone = doneIds.length >= ACTION_QUEUE.length;

  const sigsDue = ACTION_QUEUE.filter(a => a.type === "signature" && a.urgency === "Today").length;
  const approvalCount = ACTION_QUEUE.filter(a => a.type === "approval").length;
  const flagCount = PI_STUDIES.reduce((sum, s) => sum + s.openFlags, 0);

  const visibleActions = useMemo(
    () => ACTION_QUEUE.filter(a => !doneIds.includes(a.id)),
    [doneIds]
  );

  const toggleDone = (id: number) =>
    setDoneIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // Monthly goal: avg ≤ 3hrs. Already beating it → show buffer below goal.
  const goalHrs = PERF.monthlyGoalHrs;
  const underGoalBy = +(goalHrs - PERF.thisMonth.avg).toFixed(1);
  const goalPct = Math.round((underGoalBy / goalHrs) * 100); // headroom %

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Dr. Okafor</h1>
          <p className="text-sm text-gray-500 mt-1">
            {sigsDue > 0 ? (
              <>You have <span className="font-semibold text-red-600">{sigsDue} signature{sigsDue > 1 ? "s" : ""} due today</span> · {approvalCount} approval{approvalCount !== 1 ? "s" : ""} pending this week</>
            ) : (
              <span className="text-green-600 font-medium">✓ You're all caught up for today!</span>
            )}
          </p>
        </div>
        <button
          className="text-sm font-semibold text-white px-4 py-2.5 rounded-xl"
          style={{ background: "#111827" }}
        >
          Open signature queue
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="Your Studies"
          value={PI_STUDIES.length}
          sub={PI_STUDIES.map(s => s.protocol).join(", ")}
        />
        <StatCard
          label="Signatures Due"
          value={<span style={{ color: sigsDue > 0 ? "#DC2626" : "#059669" }}>{sigsDue}</span>}
          sub={sigsDue > 0 ? "Today — action required" : "None due today"}
          subColor={sigsDue > 0 ? "#DC2626" : "#059669"}
        />
        <StatCard
          label="Approval Queue"
          value={approvalCount + ACTION_QUEUE.filter(a => a.type === "review").length}
          sub={`${approvalCount} pending this week`}
        />
        <StatCard
          label="Protocol Flags"
          value={<span style={{ color: flagCount > 0 ? "#DC2626" : "#059669" }}>{flagCount}</span>}
          sub={flagCount > 0 ? `$6.4 critical · ONX-204` : "No critical flags"}
          subColor={flagCount > 0 ? "#DC2626" : "#059669"}
        />
      </div>

      {/* ── Two-column: Action Queue + Performance ── */}
      <div className="grid grid-cols-5 gap-4 items-stretch">

        {/* Action Queue — left, 2/5 */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm text-gray-900">Action queue</span>
              <span className="text-xs text-gray-400 ml-2">— needs you</span>
            </div>
            <span className="text-[10px] text-gray-400">signatures, approvals, reviews</span>
          </div>

          {allDone ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-semibold text-gray-800 text-sm">All done!</p>
              <p className="text-xs text-gray-400 mt-1">
                No pending actions. Check back later or enjoy the quiet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 flex-1">
              {visibleActions.map((item) => {
                const ts = TYPE_STYLE[item.type];
                const us = URGENCY_STYLE[item.urgency];
                return (
                  <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/60 group">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleDone(item.id)}
                      className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center hover:border-green-400 transition-colors"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug font-medium">{item.title}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: ts.bg, color: ts.color }}
                        >
                          {ts.label}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: us.bg, color: us.color }}
                        >
                          {item.urgency}
                        </span>
                        <span className="text-[10px] text-gray-400">{item.study} · {item.context}</span>
                      </div>
                    </div>

                    <Link
                      to={item.path}
                      className="text-[10px] font-medium flex-shrink-0 mt-0.5 transition-colors hover:text-gray-900"
                      style={{ color: item.urgency === "Today" ? "#DC2626" : "#9CA3AF" }}
                    >
                      open →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          <div className="px-4 py-2.5 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">All items route directly to the relevant point solution →</p>
          </div>
        </div>

        {/* Performance Panel — right, 3/5 */}
        <div
          className="col-span-3 rounded-xl p-5 flex flex-col gap-5"
          style={{ background: "#1C2B1E" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">⏱</span>
              <span className="text-sm font-semibold text-white">Your average time to sign</span>
            </div>
            <span className="text-xs text-green-300">vs. network benchmark</span>
          </div>

          {/* Time metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xs text-green-300 mb-1 uppercase tracking-wide">This Month</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-bold text-white leading-none">{PERF.thisMonth.avg}</span>
                <span className="text-lg font-medium text-white/50">hrs</span>
              </div>
              <div className="text-xs text-white/50 mt-0.5">{PERF.thisMonth.sigs} signatures</div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-white/50 mb-1">
                  <span>Monthly goal: ≤{goalHrs}h avg</span>
                  <span className="text-green-300 font-semibold">
                    {underGoalBy > 0 ? `${underGoalBy}h under goal ✓` : "At goal"}
                  </span>
                </div>
                {/* Goal bar: green = headroom below the 3hr target */}
                <div className="h-1.5 rounded-full bg-white/20 overflow-hidden relative">
                  {/* Your position on the 0–3hr scale */}
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(PERF.thisMonth.avg / goalHrs) * 100}%`, background: "#4ADE80" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] mt-0.5">
                  <span className="text-green-200">0h</span>
                  <span className="text-white/40">goal {goalHrs}h</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xs text-green-300 mb-1 uppercase tracking-wide">All Time</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-bold text-white leading-none">{PERF.ytd.avg}</span>
                <span className="text-lg font-medium text-white/50">hrs</span>
              </div>
              <div className="text-xs text-white/50 mt-0.5">{PERF.ytd.sigs} signatures</div>
              <div className="mt-3 space-y-1.5">
                <div className="text-[10px] text-white/50">Signing streak</div>
                <div className="flex gap-1">
                  {[1,2,3,4].map(w => (
                    <div key={w} className="flex-1 h-2 rounded-full bg-green-400" />
                  ))}
                  <div className="flex-1 h-2 rounded-full bg-white/20" />
                </div>
                <div className="text-[10px] text-green-300">{PERF.streak}-week streak 🔥 · 1 week to next badge</div>
              </div>
            </div>
          </div>

          {/* Single-track benchmark */}
          <BenchmarkTrack
            yours={PERF.thisMonth.avg}
            site={PERF.siteBenchmark}
            network={PERF.networkBenchmark}
            max={7}
          />

          {/* Rank / achievement */}
          <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-semibold">
                You're in the top {PERF.siteRankPct}% of fastest signers across the network.
              </p>
              <p className="text-xs text-green-300 mt-0.5">
                Top {PERF.siteRankPct}% at your site · Top {PERF.networkRankPct}% nationally · Keep it up.
              </p>
            </div>
            <div
              className="text-xs font-bold px-2 py-1 rounded-lg text-green-900 flex-shrink-0"
              style={{ background: "#4ADE80" }}
            >
              Elite
            </div>
          </div>
        </div>
      </div>

      {/* ── Upcoming Events ── */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-900">Upcoming events</span>
          <span className="text-[10px] text-gray-400">Next 30 days across all studies</span>
        </div>
        <div className="flex gap-3">
          {UPCOMING_EVENTS.map((ev, i) => {
            const st = STATUS_STYLE[ev.status as StudyStatus];
            return (
              <div
                key={i}
                className="flex-1 border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {ev.study}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">{ev.date}</span>
                </div>
                <p className="text-xs text-gray-700 font-medium leading-snug">{ev.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── My Studies ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-sm text-gray-900">My studies</span>
          <div className="flex gap-2">
            {(["Startup", "Enrolling", "Follow-up", "Closed"] as StudyStatus[]).map((s) => {
              const st = STATUS_STYLE[s];
              const count = PI_STUDIES.filter(p => p.studyStatus === s).length;
              return (
                <span
                  key={s}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: st.bg, color: st.color }}
                >
                  {count} {s}
                </span>
              );
            })}
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid px-5 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
          style={{ gridTemplateColumns: "1fr 80px 90px 200px 160px 120px 40px 90px" }}
        >
          <span>Study</span>
          <span>Status</span>
          <span>Lead CRC</span>
          <span>Enrollment</span>
          <span>Last enrolled</span>
          <span>Next event</span>
          <span>Flags</span>
          <span></span>
        </div>

        <div className="divide-y divide-gray-50">
          {PI_STUDIES.map((study) => {
            const pct = study.target > 0 ? Math.round((study.enrolled / study.target) * 100) : 0;
            const st = STATUS_STYLE[study.studyStatus];
            const barColor = study.studyStatus === "Enrolling"
              ? "#059669"
              : study.studyStatus === "Follow-up"
              ? "#F59E0B"
              : study.studyStatus === "Startup"
              ? "#818CF8"
              : "#9CA3AF";

            return (
              <div
                key={study.id}
                className="grid items-center px-5 py-3.5 hover:bg-gray-50/60 transition-colors group"
                style={{ gridTemplateColumns: "1fr 80px 90px 200px 160px 120px 40px 90px" }}
              >
                {/* Study name */}
                <div>
                  <div className="font-semibold text-sm text-gray-900">{study.protocol}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{study.phase} · {study.name}</div>
                </div>

                {/* Status */}
                <div>
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: st.bg, color: st.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.dot }} />
                    {study.studyStatus}
                  </span>
                </div>

                {/* Lead CRC */}
                <div className="flex items-center gap-1.5">
                  <Avatar initials={study.leadCRC.initials} color={study.leadCRC.color} size={22} />
                  <span className="text-xs text-gray-600 truncate">{study.leadCRC.name.split(" ")[0]}</span>
                </div>

                {/* Enrollment */}
                <div className="pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-800">
                      {study.enrolled}/{study.target}
                    </span>
                    <span className="text-[10px] text-gray-400">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                </div>

                {/* Last enrolled */}
                <div className="text-xs text-gray-500">
                  {study.lastEnrolled ?? <span className="text-gray-300">—</span>}
                </div>

                {/* Next event */}
                <div>
                  <div className="text-xs text-gray-700 font-medium leading-tight">{study.nextEvent.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{study.nextEvent.date}</div>
                </div>

                {/* Flags */}
                <div>
                  {study.openFlags > 0 ? (
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                      style={{ background: "#DC2626" }}
                    >
                      {study.openFlags}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </div>

                {/* Open */}
                <div>
                  <Link
                    to={`/study/${study.id}`}
                    className="text-xs font-semibold border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 whitespace-nowrap"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
