import {
  Gem, Globe, Zap, FolderOpen,
  CheckCircle, Clock, AlertCircle,
  Mail, Tablet, FileText, ArrowRight, ExternalLink,
  ChevronRight,
} from "lucide-react";

const PLUM       = "#211236";
const CORAL      = "#FF7859";
const BLUSH      = "#FFEBE8";
const LAVENDER   = "#F5EDFF";
const BUTTERCREAM = "#FFF2CF";
const VIOLET     = "#B582FF";
const CARD_BG    = "#FFFCF7";
const BORDER     = "#EDE5DA";

// ── Read-only preview: Consent Anywhere ──────────────────────────────────
function PreviewConsentAnywhere() {
  const methods = [
    {
      icon: Mail,
      type: "Remote link",
      subject: "Subject 042 · ICF v2.3",
      status: "Awaiting signature",
      statusColor: "#A55A00",
      statusBg: "#FFF3CC",
      dot: "#F59E0B",
    },
    {
      icon: Tablet,
      type: "In-person",
      subject: "Subject 039 · ICF v2.3",
      status: "Signed",
      statusColor: "#038748",
      statusBg: "#D4F4E0",
      dot: "#10B981",
    },
    {
      icon: FileText,
      type: "Paper upload",
      subject: "Subject 031 · ICF v1.8",
      status: "Uploaded",
      statusColor: "#5C4EE5",
      statusBg: "#EEF2FF",
      dot: "#5C4EE5",
    },
  ];

  return (
    <div className="space-y-2 pointer-events-none select-none">
      {methods.map(m => (
        <div
          key={m.type}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
          style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: LAVENDER }}>
            <m.icon className="w-3.5 h-3.5" style={{ color: VIOLET }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: PLUM }}>{m.type}</div>
            <div className="text-[10px] text-gray-400 truncate">{m.subject}</div>
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: m.statusBg, color: m.statusColor }}>
            {m.status}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ background: "#F9F6F2", border: `1px solid ${BORDER}` }}>
        <span className="text-[10px] text-gray-400">3 of 12 consents completed this week</span>
        <div className="flex-1 mx-3 h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE5DA" }}>
          <div className="h-full rounded-full" style={{ width: "25%", background: CORAL }} />
        </div>
        <span className="text-[10px] font-semibold" style={{ color: PLUM }}>25%</span>
      </div>
    </div>
  );
}

// ── Read-only preview: Tracking & Reporting ──────────────────────────────
function PreviewTracking() {
  const rows = [
    { label: "Consents current",    value: 28, total: 36, color: "#10B981", bg: "#D4F4E0" },
    { label: "Expiring within 7 days", value: 4,  total: 36, color: "#F59E0B", bg: "#FFF3CC" },
    { label: "Awaiting re-consent", value: 3,  total: 36, color: "#D30000", bg: "#FFECEC" },
    { label: "Auto-reminders sent", value: 11, total: 36, color: VIOLET,    bg: LAVENDER },
  ];

  return (
    <div className="space-y-2 pointer-events-none select-none">
      <div className="grid grid-cols-2 gap-2 mb-1">
        <div className="rounded-lg px-3 py-2.5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <div className="text-[10px] text-gray-400 mb-0.5">Consent rate</div>
          <div className="text-xl font-bold" style={{ color: PLUM }}>78<span className="text-sm font-medium text-gray-400">%</span></div>
          <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE5DA" }}>
            <div className="h-full rounded-full" style={{ width: "78%", background: "#10B981" }} />
          </div>
        </div>
        <div className="rounded-lg px-3 py-2.5" style={{ background: BLUSH, border: `1px solid #F5C6BB` }}>
          <div className="text-[10px] mb-0.5" style={{ color: "#A85948" }}>Action needed</div>
          <div className="text-xl font-bold" style={{ color: "#D30000" }}>7</div>
          <div className="text-[10px] mt-0.5" style={{ color: "#A85948" }}>subjects</div>
        </div>
      </div>
      {rows.map(r => (
        <div key={r.label} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: r.bg }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
          </div>
          <span className="text-[10px] flex-1 text-gray-600">{r.label}</span>
          <span className="text-[10px] font-bold" style={{ color: r.color }}>{r.value}</span>
          <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "#EDE5DA" }}>
            <div className="h-full rounded-full" style={{ width: `${(r.value / r.total) * 100}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Read-only preview: eBinder Integration ───────────────────────────────
function PrevieweBinder() {
  const versions = [
    { name: "ICF v2.3", status: "Active",      date: "Apr 14, 2026", color: "#038748", bg: "#D4F4E0" },
    { name: "ICF v2.2", status: "Superseded",  date: "Jan 08, 2026", color: "#9CA3AF", bg: "#F3F4F6" },
    { name: "ICF v1.8", status: "Historical",  date: "Sep 22, 2025", color: "#9CA3AF", bg: "#F3F4F6" },
  ];

  return (
    <div className="space-y-2 pointer-events-none select-none">
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: BUTTERCREAM, borderBottom: `1px solid #EAD99A` }}>
          <FolderOpen className="w-3.5 h-3.5" style={{ color: "#A55A00" }} />
          <span className="text-[10px] font-semibold" style={{ color: PLUM }}>PROTO-2024-001 / Consent</span>
          <span className="ml-auto text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "#D4F4E0", color: "#038748" }}>
            Auto-synced
          </span>
        </div>
        <div style={{ background: CARD_BG }}>
          {versions.map((v, i) => (
            <div
              key={v.name}
              className="flex items-center gap-2.5 px-3 py-2"
              style={{ borderBottom: i < versions.length - 1 ? `1px solid ${BORDER}` : "none" }}
            >
              <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: v.color }} />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold" style={{ color: PLUM }}>{v.name}</span>
                <span className="text-[10px] text-gray-400 ml-1.5">{v.date}</span>
              </div>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: v.bg, color: v.color }}>
                {v.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: LAVENDER, border: `1px solid #DDD0F5` }}>
        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: VIOLET }}>
          <CheckCircle className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-[10px] font-medium" style={{ color: "#4A236D" }}>Monitor-ready — all versions tracked automatically</span>
      </div>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  iconBg,
  iconColor,
  cardBg,
  accentColor,
  title,
  tagline,
  bullets,
  preview,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  accentColor: string;
  title: string;
  tagline: string;
  bullets: string[];
  preview: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl flex flex-col overflow-hidden" style={{ background: cardBg, border: `1px solid ${BORDER}` }}>
      <div className="px-6 pt-6 pb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: iconBg }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <h3 className="text-base font-semibold mb-1" style={{ color: PLUM }}>{title}</h3>
        <p className="text-xs mb-4" style={{ color: "#6B5A4E" }}>{tagline}</p>
        <ul className="space-y-1.5">
          {bullets.map(b => (
            <li key={b} className="flex items-start gap-2 text-xs" style={{ color: "#4D3F34" }}>
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: iconBg }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
              </div>
              {b}
            </li>
          ))}
        </ul>
      </div>
      {/* Read-only preview */}
      <div className="mx-4 mb-5 mt-1">
        <div className="relative rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="px-3 pt-3 pb-3" style={{ background: "#F9F6F2" }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#EDE5DA" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#EDE5DA" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#EDE5DA" }} />
              <div className="ml-auto text-[9px] font-medium px-2 py-0.5 rounded" style={{ background: "#F0EDFB", color: "#5C4EE5" }}>
                Preview
              </div>
            </div>
            {preview}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export function ConsentPage() {
  return (
    <div className="max-w-5xl mx-auto">

      {/* Hero */}
      <div
        className="rounded-2xl px-8 py-10 mb-8 flex items-center gap-8"
        style={{
          background: `linear-gradient(135deg, ${PLUM} 0%, #4A236D 60%, #6B3A8C 100%)`,
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.12)", color: "#DDD0F5", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <Gem className="w-3 h-3" />
              Add-on module
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Florence eConsent
          </h1>
          <p className="text-sm mb-6 max-w-lg" style={{ color: "#C4B8D4", lineHeight: "1.6" }}>
            Get consent signed faster — wherever your subjects are. Eliminate paper chasing, automate compliance tracking, and keep every signature exactly where monitors expect it.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: CORAL, color: "white" }}
            >
              Request access
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: "white", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Talk to your Florence rep
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats cluster */}
        <div className="hidden lg:flex flex-col gap-3 flex-shrink-0">
          {[
            { value: "50%", label: "faster consent completion" },
            { value: "Zero", label: "manual filing to eBinders" },
            { value: "100%", label: "audit-ready at any moment" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="text-lg font-bold" style={{ color: CORAL }}>{s.value}</span>
              <span className="text-xs" style={{ color: "#C4B8D4" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <FeatureCard
          icon={Globe}
          iconBg={BLUSH}
          iconColor={CORAL}
          cardBg="#FFFCF7"
          accentColor={CORAL}
          title="Consent anywhere"
          tagline="Remote, in-person, or paper — one workflow, every method."
          bullets={[
            "Email or SMS a secure signing link to subjects off-site",
            "Tablet-based signing for in-clinic visits",
            "Paper backup with digital upload and audit trail",
          ]}
          preview={<PreviewConsentAnywhere />}
        />
        <FeatureCard
          icon={Zap}
          iconBg={LAVENDER}
          iconColor={VIOLET}
          cardBg="#FFFCF7"
          accentColor={VIOLET}
          title="Automated tracking and reporting"
          tagline="Know who needs re-consent before a monitor asks."
          bullets={[
            "Real-time dashboard of consent status across all subjects",
            "Auto-reminders sent when consents approach expiry",
            "One-click compliance report for any audit or visit",
          ]}
          preview={<PreviewTracking />}
        />
        <FeatureCard
          icon={FolderOpen}
          iconBg={BUTTERCREAM}
          iconColor="#A55A00"
          cardBg="#FFFCF7"
          accentColor="#F59E0B"
          title="Built into your eBinder"
          tagline="Signed consents file themselves. Nothing falls through the gaps."
          bullets={[
            "Every signed ICF auto-routes to the correct binder section",
            "Version history tracked and superseded docs archived",
            "Monitor-ready visibility without any manual steps",
          ]}
          preview={<PrevieweBinder />}
        />
      </div>

      {/* Bottom CTA */}
      <div
        className="rounded-2xl px-8 py-7 flex items-center justify-between gap-6"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
      >
        <div>
          <h3 className="text-base font-semibold mb-1" style={{ color: PLUM }}>Ready to unlock eConsent?</h3>
          <p className="text-xs" style={{ color: "#6B5A4E" }}>
            Contact your Florence rep or submit a request and the team will reach out within one business day.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            style={{ border: `1px solid ${BORDER}`, color: PLUM }}
          >
            Learn more
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: CORAL, color: "white" }}
          >
            Request access
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
