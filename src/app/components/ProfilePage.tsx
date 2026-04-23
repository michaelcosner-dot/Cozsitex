import { useState } from "react";
import {
  Building2, Award, FileText,
  Clock, MapPin, Phone, Mail, Edit2, Eye,
  Star, TrendingUp, Shield,
} from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PRIMARY    = "#5C4EE5";
const PAGE_BG    = "#F2EDE6";
const CARD_BG    = "#FFFCF7";
const BORDER     = "#EDE5DA";
const BORDER2    = "#E3D8CC";
const TEXT_DARK  = "#2D1F12";
const TEXT_MID   = "#3D3028";
const TEXT_MUTED = "#9CA3AF";

// ── Sub-components ─────────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  editMode,
  wide = false,
}: {
  label: string;
  value: string;
  editMode: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="text-xs font-medium mb-1" style={{ color: TEXT_MUTED }}>
        {label}
      </p>
      {editMode ? (
        <input
          defaultValue={value}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
          style={{
            background: PAGE_BG,
            border: `1px solid ${BORDER2}`,
            color: TEXT_DARK,
            // @ts-ignore
            "--tw-ring-color": PRIMARY,
          }}
        />
      ) : (
        <p className="text-sm" style={{ color: TEXT_DARK }}>
          {value}
        </p>
      )}
    </div>
  );
}

function ScoreBar({ label, score, max = 100 }: { label: string; score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs" style={{ color: TEXT_MID }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{score}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full w-full" style={{ background: BORDER }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: PRIMARY }}
        />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [correctionText, setCorrectionText] = useState({
    therapeuticAreas: "",
    trialCount: "",
    rating: "",
    investigators: "",
  });

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: PAGE_BG }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT_DARK }}>
            Site Profile
          </h1>
          <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
            Master profile · Visible to sponsors during site selection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ border: `1.5px solid ${PRIMARY}`, color: PRIMARY, background: "transparent" }}
          >
            <Eye size={14} />
            Preview Sponsor View
          </button>
          <button
            onClick={() => setEditMode((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ background: editMode ? "#444" : PRIMARY }}
          >
            <Edit2 size={14} />
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* ── Section 1 — Site Information ───────────────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={16} style={{ color: PRIMARY }} />
          <h2 className="text-base font-semibold" style={{ color: TEXT_DARK }}>
            Site Information
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <FieldRow label="Site Name"            value="Northgate Clinical Research Center"             editMode={editMode} wide />
          <FieldRow label="Site ID"              value="NCT-SITE-00412"                                 editMode={editMode} />
          <FieldRow label="Site Type"            value="Academic Medical Center"                        editMode={editMode} />
          <FieldRow label="Parent Institution"   value="University Health System"                       editMode={editMode} />
          <FieldRow label="Address"              value="1200 Medical Plaza Dr, Suite 400, Chicago, IL 60601" editMode={editMode} wide />
          <FieldRow label="Phone"                value="+1 (312) 555-0174"                              editMode={editMode} />
          <FieldRow label="Fax"                  value="+1 (312) 555-0199"                              editMode={editMode} />
          <FieldRow label="Email"                value="research@northgatecrc.org"                       editMode={editMode} />
          <FieldRow label="FDA Registration #"   value="FD-2019-00412"                                  editMode={editMode} />
          <FieldRow label="OHRP Registration #"  value="IRB-00009241"                                   editMode={editMode} />
          <FieldRow label="Year Established"     value="2008"                                           editMode={editMode} />
          <FieldRow label="Total Staff"          value="47"                                             editMode={editMode} />
          <FieldRow label="Active Studies"       value="11"                                             editMode={editMode} />
          <FieldRow
            label="Therapeutic Areas"
            value="Oncology, Cardiology, Neurology, Infectious Disease"
            editMode={editMode}
            wide
          />
        </div>
      </div>

      {/* ── Section 2 — Citeline Profile ───────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}
      >
        {/* Banner */}
        <div
          className="px-6 py-3 flex items-center gap-2 text-sm font-medium"
          style={{ background: "#EDE9FF", color: PRIMARY, borderBottom: `1px solid ${BORDER}` }}
        >
          <TrendingUp size={15} />
          Your Citeline profile influences sponsor site selection decisions. Keep it accurate.
        </div>

        <div className="p-6" style={{ background: CARD_BG }}>
          <div className="flex items-center gap-2 mb-5">
            <Star size={16} style={{ color: PRIMARY }} />
            <h2 className="text-base font-semibold" style={{ color: TEXT_DARK }}>
              Citeline Profile
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left — current Citeline data */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: TEXT_MUTED }}>
                Our Citeline Data
              </p>
              <div className="space-y-4">
                {[
                  { label: "Listed Therapeutic Areas", value: "Oncology, Cardiology, Neurology" },
                  { label: "Published Trial Count",    value: "34 trials" },
                  { label: "Site Rating",              value: "4.2 / 5.0" },
                  { label: "Last Updated",             value: "January 12, 2026" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs mb-0.5" style={{ color: TEXT_MUTED }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: TEXT_DARK }}>{value}</p>
                  </div>
                ))}

                <div>
                  <p className="text-xs mb-1.5" style={{ color: TEXT_MUTED }}>Key Investigators</p>
                  <div className="space-y-1.5">
                    {["Dr. Amara Okafor (PI)", "Dr. Sofia Martinez (Sub-I)", "Dr. James Whitfield (Sub-I)"].map((name) => (
                      <div key={name} className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ background: PRIMARY, fontSize: 9 }}
                        >
                          {name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-xs" style={{ color: TEXT_DARK }}>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Corrections form */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                  Corrections &amp; Updates
                </p>
                <span
                  className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "#FFFBEB", color: "#D97706" }}
                >
                  <Clock size={11} />
                  3 corrections pending review
                </span>
              </div>

              <div className="space-y-3">
                {(
                  [
                    { key: "therapeuticAreas", label: "Therapeutic Areas correction" },
                    { key: "trialCount",       label: "Trial count correction" },
                    { key: "rating",           label: "Site rating correction" },
                    { key: "investigators",    label: "Investigator list correction" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs mb-1 block" style={{ color: TEXT_MUTED }}>{label}</label>
                    <textarea
                      rows={2}
                      placeholder="Describe the inaccuracy and correct value…"
                      value={correctionText[key]}
                      onChange={(e) =>
                        setCorrectionText((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="w-full rounded-lg px-3 py-2 text-xs outline-none resize-none focus:ring-2"
                      style={{
                        background: PAGE_BG,
                        border: `1px solid ${BORDER2}`,
                        color: TEXT_DARK,
                      }}
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs" style={{ color: TEXT_MUTED }}>
                    Corrections typically processed within 5 business days
                  </p>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                    style={{ background: PRIMARY }}
                  >
                    Submit Correction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3 — Sponsor-Facing Preview ─────────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Eye size={16} style={{ color: PRIMARY }} />
          <h2 className="text-base font-semibold" style={{ color: TEXT_DARK }}>
            Sponsor-Facing Preview
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "#EDE9FF", color: PRIMARY }}
          >
            Read-only · Sponsor view
          </span>
        </div>

        {/* Preview card */}
        <div
          className="rounded-xl p-5"
          style={{ background: PAGE_BG, border: `1px solid ${BORDER2}` }}
        >
          {/* Site header row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold" style={{ color: TEXT_DARK }}>
                  Northgate Clinical Research Center
                </h3>
                {/* Strong performer badge */}
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "#ECFDF5", color: "#059669" }}
                >
                  <Award size={11} />
                  Strong Performer
                </span>
              </div>
              <p className="text-xs" style={{ color: TEXT_MUTED }}>
                Academic Medical Center · University Health System
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: TEXT_MID }}>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  Chicago, IL 60601
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  +1 (312) 555-0174
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={12} />
                  research@northgatecrc.org
                </span>
              </div>
            </div>
          </div>

          {/* Therapeutic area pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {["Oncology", "Cardiology", "Neurology", "Infectious Disease"].map((ta) => (
              <span
                key={ta}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "#EDE9FF", color: PRIMARY }}
              >
                {ta}
              </span>
            ))}
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { icon: <FileText size={15} />, value: "11",     label: "Active Studies" },
              { icon: <TrendingUp size={15} />, value: "84%",  label: "Enrollment Success" },
              { icon: <Clock size={15} />,      value: "42 d", label: "Avg Startup Time" },
              { icon: <Shield size={15} />,     value: "18 yrs",label: "PI Exp. Avg" },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="rounded-lg px-3 py-3 text-center"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
              >
                <div className="flex justify-center mb-1" style={{ color: PRIMARY }}>
                  {icon}
                </div>
                <p className="text-sm font-bold" style={{ color: TEXT_DARK }}>{value}</p>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Top 3 investigators */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: TEXT_MUTED }}>
                Top Investigators
              </p>
              <div className="space-y-2.5">
                {[
                  { name: "Dr. Amara Okafor",   role: "PI",     exp: "22 yrs", spec: "Oncology" },
                  { name: "Dr. Sofia Martinez",  role: "Sub-I",  exp: "15 yrs", spec: "Cardiology" },
                  { name: "Dr. James Whitfield", role: "Sub-I",  exp: "18 yrs", spec: "Neurology" },
                ].map((inv) => (
                  <div key={inv.name} className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                      style={{ background: PRIMARY, fontSize: 11 }}
                    >
                      {inv.name.split(" ").filter((_, i) => i > 0).map((w) => w[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: TEXT_DARK }}>{inv.name}</p>
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>
                        {inv.role} · {inv.spec} · {inv.exp} exp.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Site score */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                  Site Score
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold" style={{ color: TEXT_DARK }}>87</span>
                  <span className="text-xs" style={{ color: TEXT_MUTED }}>/100</span>
                </div>
              </div>

              {/* Overall bar */}
              <div className="mb-4">
                <div className="h-3 rounded-full overflow-hidden" style={{ background: BORDER }}>
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: "87%",
                      background: `linear-gradient(90deg, ${PRIMARY} 0%, #7C6FF7 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Category breakdowns */}
              <div className="space-y-2.5">
                <ScoreBar label="Experience"  score={92} />
                <ScoreBar label="Compliance"  score={88} />
                <ScoreBar label="Capacity"    score={79} />
                <ScoreBar label="Speed"       score={85} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  );
}
