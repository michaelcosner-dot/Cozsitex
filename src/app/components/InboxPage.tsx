import { useState, useMemo } from "react";
import {
  Mail, MailOpen, Archive, Check, Share2, Link, Search, Plus,
  ChevronDown, X, Reply, Eye, EyeOff, Inbox,
} from "lucide-react";

const PRIMARY   = "#5C4EE5";
const PAGE_BG   = "#F2EDE6";
const CARD_BG   = "#FFFCF7";
const BORDER    = "#EDE5DA";
const BORDER2   = "#E3D8CC";
const TEXT_DARK = "#2D1F12";
const TEXT_MID  = "#3D3028";
const TEXT_SOFT = "#4D3F34";

// ── Types ─────────────────────────────────────────────────────────────────────

type MsgStatus = "unread" | "read" | "acknowledged" | "archived";

interface Message {
  id: number;
  senderName: string;
  senderRole: string;
  senderOrg: string;
  initials: string;
  avatarColor: string;
  subject: string;
  preview: string;
  body: string;
  studyTag: string;
  studyTagColor: string;
  timestamp: string;
  status: MsgStatus;
  category: "monitor" | "sponsor" | "cro" | "irb" | "internal";
}

// ── Avatar color palette ───────────────────────────────────────────────────────

const AVATAR_COLORS: Record<string, string> = {
  monitor:  "#7C6FF7",
  sponsor:  "#E07B39",
  cro:      "#2DA48A",
  irb:      "#C4506A",
  internal: "#5C4EE5",
};

const STUDY_TAG_COLORS: Record<string, { bg: string; text: string }> = {
  "ONX-204":        { bg: "#EDE9FF", text: "#5C4EE5" },
  "PROTO-2024-001": { bg: "#FFF0E6", text: "#B45309" },
  "PROTO-2024-015": { bg: "#E6F7F3", text: "#0D7A5F" },
  "PROTO-2024-032": { bg: "#FEE8ED", text: "#9B2335" },
  "PROTO-2024-048": { bg: "#E8F0FE", text: "#1D4ED8" },
  "PROTO-2024-053": { bg: "#F3E8FF", text: "#7E22CE" },
  "SITE-WIDE":      { bg: "#F0F0F0", text: "#4D3F34" },
};

// ── Mock messages ─────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    senderName: "Jessica Reyes",
    senderRole: "Clinical Research Associate",
    senderOrg: "Onyxia Bio",
    initials: "JR",
    avatarColor: AVATAR_COLORS.monitor,
    subject: "Monitoring Visit Scheduled — May 6–7",
    preview: "Please confirm site availability for the upcoming routine monitoring visit. We will need access to subject records and the investigator site file.",
    body: `Hi Team,

I am writing to confirm the scheduling of our upcoming routine monitoring visit for ONX-204.

Proposed Dates: May 6–7, 2026 (9:00 AM – 5:00 PM)

During the visit we will review:
- Source document verification for subjects 012–024
- Investigator Site File completeness audit
- Regulatory binder review
- Protocol deviation log
- Delegation log updates

Please ensure the PI is available for at least 30 minutes on May 6 for a brief discussion on the pending protocol amendment v3.2.

Confirm availability by replying to this message or contacting your CRA liaison.

Best,
Jessica Reyes
CRA II — Onyxia Bio`,
    studyTag: "ONX-204",
    studyTagColor: "ONX-204",
    timestamp: "Today, 9:14 AM",
    status: "unread",
    category: "monitor",
  },
  {
    id: 2,
    senderName: "Thomas Walsh",
    senderRole: "Sponsor Medical Monitor",
    senderOrg: "CardioMed Inc",
    initials: "TW",
    avatarColor: AVATAR_COLORS.sponsor,
    subject: "Protocol Amendment v1.5 — Action Required",
    preview: "Please review the attached amendment summary and distribute the updated ICF to all enrolled subjects within 14 days of IRB approval.",
    body: `Dear Site Investigator,

CardioMed Inc has submitted Protocol Amendment v1.5 to your IRB on April 19, 2026. Key changes include:

1. Expanded eligibility criteria (removal of prior statin exclusion)
2. Addition of a Week 26 echocardiogram assessment
3. Revised primary endpoint definition (MACE-5 to MACE-4)
4. Updated dosing schedule for subjects with eGFR < 45

Required site actions upon IRB approval:
- Re-consent all currently enrolled subjects (n=45)
- Update local protocol to v1.5
- Submit updated delegation log
- Notify pharmacy of dosing schedule change

Please acknowledge receipt and projected re-consent timeline.

Thomas Walsh, MD
Medical Monitor — CardioMed Inc`,
    studyTag: "PROTO-2024-001",
    studyTagColor: "PROTO-2024-001",
    timestamp: "Today, 8:02 AM",
    status: "unread",
    category: "sponsor",
  },
  {
    id: 3,
    senderName: "IRB Central",
    senderRole: "Regulatory Affairs",
    senderOrg: "IRB Central",
    initials: "IC",
    avatarColor: AVATAR_COLORS.irb,
    subject: "Document Expiration Warning — CV & Medical License",
    preview: "Investigator CV and medical license for Dr. A. Okafor expire within 60 days. Upload renewed documents to the eTMF portal by June 1.",
    body: `AUTOMATED NOTICE — IRB Central Regulatory Affairs

Study: ONX-204 | Site: CozSite (Site 003)
Investigator: Dr. A. Okafor

The following essential documents are approaching expiration:

1. Principal Investigator CV
   - Expiry: June 1, 2026
   - Status: Renewal required

2. Medical License (State Board)
   - Expiry: May 31, 2026
   - Status: Renewal pending with state board

3. GCP Training Certificate
   - Expiry: July 15, 2026
   - Status: Renewal course scheduled

ACTION REQUIRED: Upload renewed documents to the eTMF portal (eTMF Ref: CZ-003-DOCS) within 30 days of expiration. Failure to maintain current documentation may result in a protocol deviation.

This is an automated notice. Do not reply to this message directly — contact your IRB coordinator.`,
    studyTag: "ONX-204",
    studyTagColor: "ONX-204",
    timestamp: "Yesterday, 4:45 PM",
    status: "unread",
    category: "irb",
  },
  {
    id: 4,
    senderName: "Maria Santos",
    senderRole: "Data Manager",
    senderOrg: "PrecisionCRO",
    initials: "MS",
    avatarColor: AVATAR_COLORS.cro,
    subject: "Query Resolution Requested — 14 Open Queries",
    preview: "Queries have been open for >7 days on subjects 008, 011, and 019. Please resolve or dispute by April 25 to avoid data lock delays.",
    body: `Hi,

This is a reminder that the following EDC queries require site resolution before the Q1 data lock on April 30, 2026.

Subject 008 — 3 queries
  - Q-2024-032-008-001: Missing AE onset date
  - Q-2024-032-008-002: Inconsistent weight (Visit 4 vs Visit 5)
  - Q-2024-032-008-003: Concomitant medication stop date missing

Subject 011 — 6 queries
  - Q-2024-032-011-001 through 006: Lab values out of range (not acknowledged)

Subject 019 — 5 queries
  - Protocol deviation not captured in EDC

Please log in to the Medidata Rave portal to address these. If you have questions about specific query logic, please reach out to me directly.

Resolution deadline: April 25, 2026

Maria Santos
Senior Data Manager — PrecisionCRO`,
    studyTag: "PROTO-2024-032",
    studyTagColor: "PROTO-2024-032",
    timestamp: "Yesterday, 2:18 PM",
    status: "read",
    category: "cro",
  },
  {
    id: 5,
    senderName: "Kevin Park",
    senderRole: "Budget & Grants Analyst",
    senderOrg: "Onyxia Bio",
    initials: "KP",
    avatarColor: AVATAR_COLORS.sponsor,
    subject: "Budget Amendment Approval — Q2 Overage Request",
    preview: "The $48,200 Q2 budget amendment for additional screening visits has been approved. Updated payment schedule attached.",
    body: `Dear Site Administrator,

We are pleased to confirm approval of your budget amendment request submitted March 28, 2026.

Approved Amendment:
- Additional screening visits (n=12): $28,800
- Unscheduled visit coverage extension: $11,400
- Lab processing fee adjustment (Quest Diagnostics): $8,000
Total Approved: $48,200

This amount has been added to your study contract (Amendment #4) and reflected in the ClinicalPay portal. Payment will be issued within 30 days of receipt of signed amendment.

Please have the PI and Site Director sign the contract amendment and return via DocuSign by April 28, 2026.

Kevin Park
Budget & Grants Analyst — Onyxia Bio Contracts`,
    studyTag: "ONX-204",
    studyTagColor: "ONX-204",
    timestamp: "Apr 19, 11:30 AM",
    status: "acknowledged",
    category: "sponsor",
  },
  {
    id: 6,
    senderName: "Dr. Lin Zhao",
    senderRole: "Medical Monitor",
    senderOrg: "PrecisionCRO",
    initials: "LZ",
    avatarColor: AVATAR_COLORS.cro,
    subject: "Enrollment Milestone — 75% Target Reached",
    preview: "Congratulations — PROTO-2024-015 has reached 75% of enrollment target. Q3 interim analysis timeline updated accordingly.",
    body: `Dear Site Team,

We are pleased to report that PROTO-2024-015 (Diabetes Study Phase II) has reached the 75% enrollment milestone as of April 18, 2026.

Current enrollment: 45 / 60 subjects (75%)
Projected completion: July 12, 2026 (ahead of August target)

Site-level breakdown:
- CozSite (Site 02): 45 enrolled — highest enrollment across all sites

Implications for Q3 Interim Analysis:
The DSMB interim analysis is now scheduled for August 15, 2026. All site data must be locked by July 31. Please ensure all outstanding queries are resolved by July 15.

Outstanding items from your site:
- 2 subjects pending final Visit 6 data entry
- Pharmacy log needs reconciliation (last updated March 14)

Thank you for your team's excellent performance.

Dr. Lin Zhao, PharmD
Medical Monitor — PrecisionCRO`,
    studyTag: "PROTO-2024-015",
    studyTagColor: "PROTO-2024-015",
    timestamp: "Apr 18, 3:55 PM",
    status: "acknowledged",
    category: "cro",
  },
  {
    id: 7,
    senderName: "Rebecca Moss",
    senderRole: "IRB Coordinator",
    senderOrg: "Western IRB",
    initials: "RM",
    avatarColor: AVATAR_COLORS.irb,
    subject: "Consent Form Update Required — v2.1 Approved",
    preview: "ICF version 2.1 has been approved. All subjects consented under v2.0 must be re-consented within 30 days. See checklist attached.",
    body: `Dear Research Team,

Western IRB has approved Informed Consent Form version 2.1 for study PROTO-2024-048 (Neurology Phase III) effective April 14, 2026.

Changes from v2.0 to v2.1:
- Section 4: Updated risk language for MRI contrast agents
- Section 7: Added optional genetic sub-study opt-in
- Section 9: Revised compensation schedule ($25 increase per visit)
- Appendix B: New contact information for the IRB

Re-consent Requirements:
All 28 currently enrolled subjects must complete re-consent within 30 days (by May 14, 2026). Subjects who decline re-consent must be documented and discussed with the sponsor medical monitor.

Steps:
1. Print updated ICF (v2.1) from the eTMF portal
2. Conduct re-consent discussion with each subject
3. Scan and upload signed forms within 2 business days
4. Log re-consent dates in EDC (field: RECONDT)

Please contact me if you need re-consent training or have questions.

Rebecca Moss
IRB Coordinator — Western IRB`,
    studyTag: "PROTO-2024-048",
    studyTagColor: "PROTO-2024-048",
    timestamp: "Apr 17, 9:00 AM",
    status: "read",
    category: "irb",
  },
  {
    id: 8,
    senderName: "Site Operations",
    senderRole: "Internal Notice",
    senderOrg: "CozSite",
    initials: "SO",
    avatarColor: AVATAR_COLORS.internal,
    subject: "Quarterly Staff GCP Refresher — May 1 Deadline",
    preview: "All research staff must complete the annual GCP refresher training via CITI by May 1. Three team members are currently non-compliant.",
    body: `All Research Staff,

This is a reminder that the annual GCP refresher training must be completed via the CITI Program by May 1, 2026 per FDA 21 CFR Part 312 requirements.

Current compliance status as of April 20, 2026:
- Compliant: 9 staff members
- Non-compliant (past due): 3 staff members
  * M. Hernandez — expired April 1
  * D. Kim — expired March 15
  * T. Nguyen — expires April 30

Action: Log in to citiprogram.org, complete the "GCP for Clinical Trials with Investigational Drugs (ICH Focus)" refresher course, and upload your completion certificate to the site training binder.

Non-compliance will result in removal from study delegation logs until training is current.

Questions? Contact the Site Training Coordinator.

Site Operations — CozSite Research`,
    studyTag: "SITE-WIDE",
    studyTagColor: "SITE-WIDE",
    timestamp: "Apr 16, 8:30 AM",
    status: "archived",
    category: "internal",
  },
  {
    id: 9,
    senderName: "Carlos Mendez",
    senderRole: "Sponsor CRA Manager",
    senderOrg: "NeuroPharma Global",
    initials: "CM",
    avatarColor: AVATAR_COLORS.monitor,
    subject: "Site Initiation Visit Follow-Up — Action Items",
    preview: "Per our SIV on April 10, please complete the 6 action items listed below by April 30. Pharmacy log template and delegation log are attached.",
    body: `Hi Team,

Thank you for hosting our Site Initiation Visit on April 10, 2026. Your team's preparation was excellent. The following action items were identified:

Action Item Summary (due April 30, 2026):

1. [PHARMACY] Submit completed pharmacy log template to sponsor (template attached)
2. [REGULATORY] Upload fully executed Financial Disclosure forms for all sub-investigators
3. [TRAINING] Confirm protocol training completion for Dr. Park and Nurse A. Torres
4. [EDC] Complete EDC certification for all staff accessing Medidata
5. [SCREENING] Activate screening log in EDC — currently still in "draft" status
6. [DELEGATION] Update delegation log to reflect current site staff (remove former employee R. Watts)

Once all items are resolved, we will issue the Site Green Light notification and you may begin screening subjects.

Please send confirmation of each completed item to me directly.

Carlos Mendez
Sr. CRA Manager — NeuroPharma Global`,
    studyTag: "PROTO-2024-053",
    studyTagColor: "PROTO-2024-053",
    timestamp: "Apr 15, 1:12 PM",
    status: "read",
    category: "monitor",
  },
];

const STUDY_IDS = [
  "ONX-204", "PROTO-2024-001", "PROTO-2024-015",
  "PROTO-2024-032", "PROTO-2024-048", "PROTO-2024-053",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTagStyle(tag: string) {
  const colors = STUDY_TAG_COLORS[tag] ?? { bg: "#F0F0F0", text: "#4D3F34" };
  return { backgroundColor: colors.bg, color: colors.text };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontSize: size < 28 ? 9 : 11,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

function StudyPill({ tag }: { tag: string }) {
  return (
    <span
      className="text-xs font-semibold"
      style={{
        ...getTagStyle(tag),
        padding: "1px 6px",
        borderRadius: 4,
        fontSize: 10,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {tag}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "acknowledged" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Detail panel state
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectStudy, setConnectStudy] = useState("");
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [ackSuccess, setAckSuccess] = useState<number | null>(null);

  // ── Derived data ────────────────────────────────────────────────────────────

  const counts = useMemo(() => ({
    all:          messages.filter(m => m.status !== "archived").length,
    unread:       messages.filter(m => m.status === "unread").length,
    acknowledged: messages.filter(m => m.status === "acknowledged").length,
    archived:     messages.filter(m => m.status === "archived").length,
  }), [messages]);

  const filtered = useMemo(() => {
    let base = messages;
    if (activeTab === "unread")       base = base.filter(m => m.status === "unread");
    else if (activeTab === "acknowledged") base = base.filter(m => m.status === "acknowledged");
    else if (activeTab === "archived") base = base.filter(m => m.status === "archived");
    else                              base = base.filter(m => m.status !== "archived");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(m =>
        m.subject.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q) ||
        m.senderOrg.toLowerCase().includes(q) ||
        m.studyTag.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q)
      );
    }
    return base;
  }, [messages, activeTab, searchQuery]);

  const selectedMsg = messages.find(m => m.id === selectedId) ?? null;

  // ── Actions ─────────────────────────────────────────────────────────────────

  function markStatus(id: number, status: MsgStatus) {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status } : m));
  }

  function handleSelect(id: number) {
    setSelectedId(id);
    setShareOpen(false);
    setShareSuccess(false);
    setConnectOpen(false);
    setConnectSuccess(false);
    setAckSuccess(null);
    // Mark as read on open
    setMessages(msgs => msgs.map(m =>
      m.id === id && m.status === "unread" ? { ...m, status: "read" } : m
    ));
  }

  function handleAcknowledge(id: number) {
    markStatus(id, "acknowledged");
    setAckSuccess(id);
    setTimeout(() => setAckSuccess(null), 2500);
  }

  function handleMarkUnread(id: number) {
    markStatus(id, "unread");
  }

  function handleArchive(id: number) {
    markStatus(id, "archived");
    setSelectedId(null);
  }

  function handleShare() {
    setShareOpen(o => !o);
    setShareSuccess(false);
    setConnectOpen(false);
  }

  function handleConnect() {
    setConnectOpen(o => !o);
    setConnectSuccess(false);
    setShareOpen(false);
  }

  function submitShare() {
    if (!shareEmail.trim()) return;
    setShareSuccess(true);
    setShareEmail("");
    setTimeout(() => { setShareOpen(false); setShareSuccess(false); }, 2000);
  }

  function submitConnect() {
    if (!connectStudy) return;
    setConnectSuccess(true);
    setTimeout(() => { setConnectOpen(false); setConnectSuccess(false); }, 2000);
  }

  // ── Tabs config ─────────────────────────────────────────────────────────────

  const TABS: { key: typeof activeTab; label: string }[] = [
    { key: "all",          label: "All" },
    { key: "unread",       label: "Unread" },
    { key: "acknowledged", label: "Acknowledged" },
    { key: "archived",     label: "Archived" },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col"
      style={{ height: "100vh", backgroundColor: PAGE_BG, overflow: "hidden" }}
    >
      {/* ── Top Header ── */}
      <div
        style={{
          backgroundColor: CARD_BG,
          borderBottom: `1px solid ${BORDER}`,
          padding: "14px 20px 0",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          {/* Left: title + badge */}
          <div className="flex items-center gap-2">
            <Mail size={18} style={{ color: PRIMARY }} strokeWidth={2} />
            <span className="text-base font-bold" style={{ color: TEXT_DARK }}>Messages</span>
            {counts.unread > 0 && (
              <span
                className="text-xs font-bold"
                style={{
                  backgroundColor: PRIMARY,
                  color: "#fff",
                  borderRadius: 99,
                  padding: "1px 7px",
                  fontSize: 11,
                  lineHeight: "18px",
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {counts.unread}
              </span>
            )}
          </div>

          {/* Right: search + compose */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2"
              style={{
                backgroundColor: "#F5F0EA",
                border: `1px solid ${BORDER}`,
                borderRadius: 7,
                padding: "5px 10px",
                width: 220,
              }}
            >
              <Search size={13} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search messages, studies…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="text-xs bg-transparent outline-none w-full"
                style={{ color: TEXT_DARK }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={12} style={{ color: "#9CA3AF" }} />
                </button>
              )}
            </div>

            <button
              className="flex items-center gap-1 text-xs font-semibold"
              style={{
                backgroundColor: PRIMARY,
                color: "#fff",
                borderRadius: 7,
                padding: "6px 11px",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Plus size={13} />
              Compose
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-0">
          {TABS.map(tab => {
            const count = counts[tab.key];
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedId(null); }}
                className="flex items-center gap-1 text-xs font-medium"
                style={{
                  padding: "7px 14px",
                  borderBottom: active ? `2px solid ${PRIMARY}` : "2px solid transparent",
                  color: active ? PRIMARY : TEXT_SOFT,
                  background: "none",
                  border: "none",
                  borderBottom: active ? `2px solid ${PRIMARY}` : "2px solid transparent",
                  cursor: "pointer",
                  transition: "color 0.15s",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="text-xs"
                    style={{
                      backgroundColor: active ? "#EDE9FF" : "#F0EBE3",
                      color: active ? PRIMARY : TEXT_SOFT,
                      borderRadius: 99,
                      padding: "0 5px",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Two-Pane Body ── */}
      <div className="flex flex-1" style={{ overflow: "hidden", minHeight: 0 }}>

        {/* ── Message List (left pane) ── */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            borderRight: `1px solid ${BORDER}`,
            overflowY: "auto",
            backgroundColor: CARD_BG,
          }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ padding: 48, color: "#9CA3AF" }}>
              <Inbox size={28} style={{ marginBottom: 8, opacity: 0.5 }} />
              <span className="text-xs">No messages</span>
            </div>
          ) : (
            filtered.map((msg, idx) => {
              const isSelected = selectedId === msg.id;
              const isUnread = msg.status === "unread";
              return (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    width: "100%",
                    padding: "11px 14px",
                    background: isSelected ? "#F0EEFF" : "transparent",
                    borderLeft: isSelected ? `3px solid ${PRIMARY}` : "3px solid transparent",
                    borderBottom: `1px solid ${BORDER}`,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                >
                  {/* Unread dot */}
                  <div style={{ paddingTop: 6, width: 7, flexShrink: 0 }}>
                    {isUnread && (
                      <div style={{
                        width: 6, height: 6,
                        borderRadius: "50%",
                        backgroundColor: PRIMARY,
                      }} />
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar initials={msg.initials} color={msg.avatarColor} size={30} />

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Row 1: sender + timestamp */}
                    <div className="flex items-center justify-between" style={{ marginBottom: 1 }}>
                      <span
                        className="text-xs font-semibold truncate"
                        style={{ color: isUnread ? TEXT_DARK : TEXT_MID, maxWidth: 150 }}
                      >
                        {msg.senderName}
                      </span>
                      <span className="text-xs" style={{ color: "#9CA3AF", fontSize: 10, flexShrink: 0 }}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Row 2: subject */}
                    <div
                      className="text-xs truncate"
                      style={{
                        color: isUnread ? TEXT_DARK : TEXT_SOFT,
                        fontWeight: isUnread ? 600 : 400,
                        marginBottom: 3,
                      }}
                    >
                      {msg.subject}
                    </div>

                    {/* Row 3: preview */}
                    <div
                      className="text-xs"
                      style={{
                        color: "#9CA3AF",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.4,
                        marginBottom: 5,
                        fontSize: 11,
                      }}
                    >
                      {msg.preview}
                    </div>

                    {/* Row 4: study tag */}
                    <StudyPill tag={msg.studyTag} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* ── Detail Panel (right pane) ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: PAGE_BG,
            minWidth: 0,
          }}
        >
          {!selectedMsg ? (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: "100%", color: "#9CA3AF" }}
            >
              <MailOpen size={36} style={{ marginBottom: 10, opacity: 0.35 }} />
              <span className="text-sm font-medium" style={{ color: TEXT_SOFT, opacity: 0.6 }}>
                Select a message to read
              </span>
              <span className="text-xs" style={{ color: "#9CA3AF", marginTop: 4 }}>
                {counts.unread > 0 ? `${counts.unread} unread message${counts.unread > 1 ? "s" : ""}` : "All caught up"}
              </span>
            </div>
          ) : (
            <div style={{ padding: "20px 24px", maxWidth: 760 }}>

              {/* Message header card */}
              <div
                style={{
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                  marginBottom: 12,
                }}
              >
                {/* Subject line */}
                <div className="flex items-start justify-between gap-4" style={{ marginBottom: 12 }}>
                  <h2
                    className="text-sm font-bold leading-snug"
                    style={{ color: TEXT_DARK, flex: 1 }}
                  >
                    {selectedMsg.subject}
                  </h2>
                  <StudyPill tag={selectedMsg.studyTag} />
                </div>

                {/* Sender info */}
                <div className="flex items-center gap-3">
                  <Avatar initials={selectedMsg.initials} color={selectedMsg.avatarColor} size={34} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>
                        {selectedMsg.senderName}
                      </span>
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>·</span>
                      <span className="text-xs" style={{ color: TEXT_SOFT }}>
                        {selectedMsg.senderRole}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "#9CA3AF", marginTop: 1 }}>
                      {selectedMsg.senderOrg} · {selectedMsg.timestamp}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div
                style={{
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  flexWrap: "wrap",
                }}
              >
                {/* Acknowledge */}
                <ActionBtn
                  icon={<Check size={13} />}
                  label={ackSuccess === selectedMsg.id ? "Acknowledged!" : "Acknowledge"}
                  active={selectedMsg.status === "acknowledged"}
                  successState={ackSuccess === selectedMsg.id}
                  successColor="#16A34A"
                  onClick={() => handleAcknowledge(selectedMsg.id)}
                  primaryColor={PRIMARY}
                />

                <Divider />

                {/* Mark unread */}
                <ActionBtn
                  icon={selectedMsg.status === "unread" ? <EyeOff size={13} /> : <Eye size={13} />}
                  label={selectedMsg.status === "unread" ? "Mark Read" : "Mark Unread"}
                  onClick={() =>
                    selectedMsg.status === "unread"
                      ? markStatus(selectedMsg.id, "read")
                      : handleMarkUnread(selectedMsg.id)
                  }
                  primaryColor={PRIMARY}
                />

                {/* Archive */}
                <ActionBtn
                  icon={<Archive size={13} />}
                  label={selectedMsg.status === "archived" ? "Unarchive" : "Archive"}
                  onClick={() =>
                    selectedMsg.status === "archived"
                      ? markStatus(selectedMsg.id, "read")
                      : handleArchive(selectedMsg.id)
                  }
                  primaryColor={PRIMARY}
                />

                <Divider />

                {/* Share */}
                <ActionBtn
                  icon={<Share2 size={13} />}
                  label="Share"
                  active={shareOpen}
                  onClick={handleShare}
                  primaryColor={PRIMARY}
                />

                {/* Connect to Study */}
                <ActionBtn
                  icon={<Link size={13} />}
                  label="Connect to Study"
                  active={connectOpen}
                  onClick={handleConnect}
                  primaryColor={PRIMARY}
                />

                {/* Reply */}
                <ActionBtn
                  icon={<Reply size={13} />}
                  label="Reply"
                  onClick={() => {}}
                  primaryColor={PRIMARY}
                />
              </div>

              {/* Share inline form */}
              {shareOpen && (
                <div
                  style={{
                    backgroundColor: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 12,
                  }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>
                      Share via email
                    </span>
                    <button onClick={() => setShareOpen(false)}>
                      <X size={13} style={{ color: "#9CA3AF" }} />
                    </button>
                  </div>
                  {shareSuccess ? (
                    <div className="flex items-center gap-2" style={{ color: "#16A34A" }}>
                      <Check size={13} />
                      <span className="text-xs font-medium">Message shared successfully</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="Recipient email address"
                        value={shareEmail}
                        onChange={e => setShareEmail(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && submitShare()}
                        className="text-xs outline-none flex-1"
                        style={{
                          border: `1px solid ${BORDER2}`,
                          borderRadius: 6,
                          padding: "6px 10px",
                          backgroundColor: "#F5F0EA",
                          color: TEXT_DARK,
                        }}
                      />
                      <button
                        onClick={submitShare}
                        className="text-xs font-semibold"
                        style={{
                          backgroundColor: PRIMARY,
                          color: "#fff",
                          borderRadius: 6,
                          padding: "6px 12px",
                          border: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Connect to Study inline form */}
              {connectOpen && (
                <div
                  style={{
                    backgroundColor: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 12,
                  }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <span className="text-xs font-semibold" style={{ color: TEXT_DARK }}>
                      Connect to study
                    </span>
                    <button onClick={() => setConnectOpen(false)}>
                      <X size={13} style={{ color: "#9CA3AF" }} />
                    </button>
                  </div>
                  {connectSuccess ? (
                    <div className="flex items-center gap-2" style={{ color: "#16A34A" }}>
                      <Check size={13} />
                      <span className="text-xs font-medium">
                        Connected to {connectStudy}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-1 flex-1"
                        style={{
                          border: `1px solid ${BORDER2}`,
                          borderRadius: 6,
                          padding: "5px 10px",
                          backgroundColor: "#F5F0EA",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <select
                          value={connectStudy}
                          onChange={e => setConnectStudy(e.target.value)}
                          className="text-xs outline-none flex-1 bg-transparent"
                          style={{ color: connectStudy ? TEXT_DARK : "#9CA3AF", cursor: "pointer", appearance: "none", width: "100%" }}
                        >
                          <option value="">Select study ID…</option>
                          {STUDY_IDS.map(id => (
                            <option key={id} value={id}>{id}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                      </div>
                      <button
                        onClick={submitConnect}
                        disabled={!connectStudy}
                        className="text-xs font-semibold"
                        style={{
                          backgroundColor: connectStudy ? PRIMARY : "#C4B8F0",
                          color: "#fff",
                          borderRadius: 6,
                          padding: "6px 12px",
                          border: "none",
                          cursor: connectStudy ? "pointer" : "not-allowed",
                          whiteSpace: "nowrap",
                          transition: "background 0.15s",
                        }}
                      >
                        Connect
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Message body */}
              <div
                style={{
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "18px 20px",
                }}
              >
                <pre
                  className="text-xs leading-relaxed"
                  style={{
                    color: TEXT_MID,
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {selectedMsg.body}
                </pre>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shared small components ───────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        width: 1, height: 18,
        backgroundColor: "#EDE5DA",
        margin: "0 4px",
        flexShrink: 0,
      }}
    />
  );
}

interface ActionBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  successState?: boolean;
  successColor?: string;
  primaryColor: string;
}

function ActionBtn({
  icon, label, onClick, active, successState, successColor, primaryColor,
}: ActionBtnProps) {
  const bg = successState
    ? (successColor ? `${successColor}18` : "#E6F4EA")
    : active
    ? "#EDE9FF"
    : "transparent";

  const color = successState
    ? successColor ?? "#16A34A"
    : active
    ? primaryColor
    : "#4D3F34";

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-medium"
      style={{
        background: bg,
        color,
        borderRadius: 6,
        padding: "5px 10px",
        border: "none",
        cursor: "pointer",
        transition: "background 0.12s, color 0.12s",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
