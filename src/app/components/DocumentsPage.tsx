import { useState } from "react";
import {
  Inbox, FileText, CheckCircle, Clock, XCircle, ChevronDown,
  Eye, FolderInput, X, Search, AlertCircle, History, MapPin,
  ArrowRight, Send, ArrowUpRight, ArrowDownLeft, MessageSquare,
  Plus, Paperclip, Building2, RefreshCw,
} from "lucide-react";

const PRIMARY    = "#5C4EE5";
const CARD_BG    = "#FFFCF7";
const BORDER     = "#EDE5DA";
const PAGE_BG    = "#F2EDE6";
const TEXT_DARK  = "#2D1F12";
const TEXT_MID   = "#3D3028";
const TEXT_MUTED = "#9CA3AF";
const BORDER2    = "#E3D8CC";

type InboxStatus = "New" | "Routed" | "Filed" | "Rejected";
type TabFilter   = InboxStatus | "All" | "Sponsor Exchange" | "Audit Trail";

interface IncomingDoc {
  id: number;
  sender: string;
  senderOrg: string;
  senderInitials: string;
  senderColor: string;
  docName: string;
  docType: string;
  study: string;
  sites: string[];
  isMultisite: boolean;
  receivedAt: string;
  status: InboxStatus;
  note?: string;
}

const DOCS: IncomingDoc[] = [
  { id: 1, sender: "Dr. Patricia Wells",  senderOrg: "Novartis",   senderInitials: "PW", senderColor: "#5C4EE5", docName: "Protocol Amendment 3 — JAVAHEART",      docType: "Protocol",   study: "JAVAHEART",  sites: ["Site 01 — Cleveland Clinic", "Site 02 — Mayo Clinic", "Site 03 — Johns Hopkins"], isMultisite: true,  receivedAt: "Today, 9:14 AM",      status: "New" },
  { id: 2, sender: "James Holbrook",      senderOrg: "Pfizer CRO", senderInitials: "JH", senderColor: "#FF7859", docName: "IRB Approval Renewal — ONCOVAULT",       docType: "IRB",        study: "ONCOVAULT",  sites: ["Site 01 — Dana-Farber"],                                                               isMultisite: false, receivedAt: "Today, 8:02 AM",      status: "New" },
  { id: 3, sender: "Carla Mendes",        senderOrg: "AstraZeneca",senderInitials: "CM", senderColor: "#10B981", docName: "ICF v2.4 — NEUROPILOT",                  docType: "Consent",    study: "NEUROPILOT", sites: ["Site 01 — UCSF", "Site 02 — Stanford"],                                                isMultisite: true,  receivedAt: "Today, 7:45 AM",      status: "New" },
  { id: 4, sender: "Monitor — R. Torres", senderOrg: "Covance",    senderInitials: "RT", senderColor: "#F59E0B", docName: "Site Visit Report — Apr 18",             docType: "Monitoring", study: "DIASOLVE",   sites: ["Site 01 — MGH"],                                                                       isMultisite: false, receivedAt: "Yesterday, 4:30 PM",  status: "New" },
  { id: 5, sender: "Dr. Patricia Wells",  senderOrg: "Novartis",   senderInitials: "PW", senderColor: "#5C4EE5", docName: "IND Safety Update Q1 2026 — JAVAHEART",  docType: "Safety",     study: "JAVAHEART",  sites: ["Site 01 — Cleveland Clinic", "Site 02 — Mayo Clinic", "Site 03 — Johns Hopkins"], isMultisite: true,  receivedAt: "Yesterday, 2:15 PM",  status: "Routed" },
  { id: 6, sender: "Sarah Kim",           senderOrg: "BioMarin",   senderInitials: "SK", senderColor: "#8B5CF6", docName: "Financial Disclosure Form — RHEUMATH",   docType: "Agreement",  study: "RHEUMATH",   sites: ["Site 01 — UPMC"],                                                                      isMultisite: false, receivedAt: "Yesterday, 11:10 AM", status: "Routed" },
  { id: 7, sender: "James Holbrook",      senderOrg: "Pfizer CRO", senderInitials: "JH", senderColor: "#FF7859", docName: "GCP Training Certificate — K. Tran",     docType: "Training",   study: "ONCOVAULT",  sites: ["Site 01 — Dana-Farber"],                                                               isMultisite: false, receivedAt: "Apr 21, 3:00 PM",    status: "Filed" },
  { id: 8, sender: "Monitor — A. Singh",  senderOrg: "PRA Health", senderInitials: "AS", senderColor: "#D97706", docName: "IMV Log — Site Visit Mar 30",            docType: "Monitoring", study: "ASTHMAPLUS", sites: ["Site 01 — Brigham & Women's"],                                                         isMultisite: false, receivedAt: "Apr 21, 10:45 AM",   status: "Filed" },
  { id: 9, sender: "Carla Mendes",        senderOrg: "AstraZeneca",senderInitials: "CM", senderColor: "#10B981", docName: "Duplicate Protocol — NEUROPILOT (v2.2)", docType: "Protocol",   study: "NEUROPILOT", sites: ["Site 01 — UCSF", "Site 02 — Stanford"],                                                isMultisite: true,  receivedAt: "Apr 20, 2:00 PM",    status: "Rejected" },
];

const BINDER_SECTIONS = [
  "Regulatory / Protocol",
  "Regulatory / IRB Approval",
  "Regulatory / IND Safety",
  "Consent / ICF",
  "Investigator Files / PI CV",
  "Investigator Files / Financial Disclosure",
  "Training / GCP Certificates",
  "Monitoring / Visit Reports",
  "Agreements / CTA",
];

const STATUS_CONFIG: Record<InboxStatus, { bg: string; text: string; icon: React.ElementType }> = {
  New:      { bg: "#EEF2FF", text: PRIMARY,   icon: Inbox },
  Routed:   { bg: "#FFF3CC", text: "#A55A00", icon: Clock },
  Filed:    { bg: "#D4F4E0", text: "#038748", icon: CheckCircle },
  Rejected: { bg: "#FFECEC", text: "#D30000", icon: XCircle },
};

// ── Sponsor Exchange data ─────────────────────────────────────────────────
type ExchangeStatus = "Action Required" | "Sent" | "Acknowledged" | "Returned" | "Closed";

interface ExchangeMessage {
  id: number;
  from: "Site" | "Sponsor";
  fromName: string;
  fromInitials: string;
  fromColor: string;
  content: string;
  attachment?: string;
  sentAt: string;
}

interface ExchangeThread {
  id: number;
  sponsor: string;
  sponsorInitials: string;
  sponsorColor: string;
  study: string;
  site: string;
  subject: string;
  docType: string;
  lastActivity: string;
  status: ExchangeStatus;
  unread: boolean;
  messages: ExchangeMessage[];
}

const EXCHANGE_THREADS: ExchangeThread[] = [
  {
    id: 1,
    sponsor: "Dr. Patricia Wells", sponsorInitials: "PW", sponsorColor: "#5C4EE5",
    study: "JAVAHEART", site: "Site 01 — Cleveland Clinic",
    subject: "Delegation of Authority Log — Amendment 3",
    docType: "Regulatory", lastActivity: "Today, 9:30 AM",
    status: "Action Required", unread: true,
    messages: [
      { id: 1, from: "Sponsor", fromName: "Dr. Patricia Wells", fromInitials: "PW", fromColor: "#5C4EE5", content: "Please provide an updated Delegation of Authority log reflecting the new protocol amendment. All site staff roles should be current.", attachment: "DOA_template_v3.pdf", sentAt: "Today, 8:52 AM" },
      { id: 2, from: "Site", fromName: "Sarah Chen", fromInitials: "SC", fromColor: "#10B981", content: "Received. We're updating the DOA to reflect PI Okafor's current team. Will have it back to you by EOD.", sentAt: "Today, 9:30 AM" },
    ],
  },
  {
    id: 2,
    sponsor: "James Holbrook", sponsorInitials: "JH", sponsorColor: "#FF7859",
    study: "ONCOVAULT", site: "Site 01 — Dana-Farber",
    subject: "Site Qualification Package — Q2 2026",
    docType: "Qualification", lastActivity: "Yesterday, 3:15 PM",
    status: "Sent", unread: false,
    messages: [
      { id: 1, from: "Site", fromName: "Rachel Huang", fromInitials: "RH", fromColor: "#0D7A5F", content: "Please find our Q2 2026 site qualification documents attached. Includes updated CV for Dr. Martinez, current GCP certifications, and IRB approval.", attachment: "ONCOVAULT_SiteQual_Q2_2026.pdf", sentAt: "Yesterday, 3:15 PM" },
    ],
  },
  {
    id: 3,
    sponsor: "Carla Mendes", sponsorInitials: "CM", sponsorColor: "#10B981",
    study: "NEUROPILOT", site: "Site 01 — UCSF",
    subject: "ICF v2.4 — Site Acknowledgment",
    docType: "Consent", lastActivity: "Yesterday, 11:00 AM",
    status: "Acknowledged", unread: false,
    messages: [
      { id: 1, from: "Sponsor", fromName: "Carla Mendes", fromInitials: "CM", fromColor: "#10B981", content: "Please acknowledge receipt of ICF v2.4 for NEUROPILOT. Once acknowledged, please begin re-consenting eligible participants.", attachment: "NEUROPILOT_ICF_v2.4.pdf", sentAt: "Apr 22, 9:00 AM" },
      { id: 2, from: "Site", fromName: "Sarah Chen", fromInitials: "SC", fromColor: "#10B981", content: "ICF v2.4 received and acknowledged. Initiating re-consent workflow for 12 eligible participants.", sentAt: "Yesterday, 11:00 AM" },
    ],
  },
  {
    id: 4,
    sponsor: "Monitor — R. Torres", sponsorInitials: "RT", sponsorColor: "#F59E0B",
    study: "DIASOLVE", site: "Site 01 — MGH",
    subject: "Corrective Action Plan — April Visit",
    docType: "Monitoring", lastActivity: "Apr 20, 5:00 PM",
    status: "Returned", unread: false,
    messages: [
      { id: 1, from: "Sponsor", fromName: "Monitor — R. Torres", fromInitials: "RT", fromColor: "#F59E0B", content: "Following the April 18 monitoring visit, please provide a Corrective Action Plan addressing the 2 critical findings and 3 major findings identified.", sentAt: "Apr 19, 10:00 AM" },
      { id: 2, from: "Site", fromName: "Rachel Huang", fromInitials: "RH", fromColor: "#0D7A5F", content: "CAP submitted. Actions for all 5 findings have been assigned to the relevant team members.", attachment: "DIASOLVE_CAP_April2026.pdf", sentAt: "Apr 20, 3:30 PM" },
      { id: 3, from: "Sponsor", fromName: "Monitor — R. Torres", fromInitials: "RT", fromColor: "#F59E0B", content: "Thank you. Two items need revision — please see highlighted comments in the returned document.", attachment: "DIASOLVE_CAP_April2026_review.pdf", sentAt: "Apr 20, 5:00 PM" },
    ],
  },
  {
    id: 5,
    sponsor: "Sarah Kim", sponsorInitials: "SK", sponsorColor: "#8B5CF6",
    study: "RHEUMATH", site: "Site 01 — UPMC",
    subject: "Lab Certification — Updated Reference Ranges",
    docType: "Regulatory", lastActivity: "Apr 18, 2:00 PM",
    status: "Closed", unread: false,
    messages: [
      { id: 1, from: "Sponsor", fromName: "Sarah Kim", fromInitials: "SK", fromColor: "#8B5CF6", content: "Please submit updated lab certification with current reference ranges as required by amendment 2.", sentAt: "Apr 15, 9:00 AM" },
      { id: 2, from: "Site", fromName: "Dana Fischer", fromInitials: "DF", fromColor: "#B45309", content: "Attached is our current lab certification with updated reference ranges.", attachment: "RHEUMATH_LabCert_2026.pdf", sentAt: "Apr 17, 1:00 PM" },
      { id: 3, from: "Sponsor", fromName: "Sarah Kim", fromInitials: "SK", fromColor: "#8B5CF6", content: "Received and accepted. No further action required. Closing this exchange.", sentAt: "Apr 18, 2:00 PM" },
    ],
  },
];

const EXCHANGE_STATUS_CONFIG: Record<ExchangeStatus, { bg: string; text: string }> = {
  "Action Required": { bg: "#FFECEC", text: "#D30000" },
  "Sent":            { bg: "#EEF2FF", text: PRIMARY },
  "Acknowledged":    { bg: "#D4F4E0", text: "#038748" },
  "Returned":        { bg: "#FFF3CC", text: "#A55A00" },
  "Closed":          { bg: PAGE_BG,   text: TEXT_MUTED },
};

function SponsorExchangeTab() {
  const [selectedThread, setSelectedThread] = useState<ExchangeThread | null>(EXCHANGE_THREADS[0]);
  const [compose, setCompose] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const actionRequired = EXCHANGE_THREADS.filter(t => t.status === "Action Required").length;

  return (
    <div className="flex gap-4 min-h-[600px]">
      {/* Thread list */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        {actionRequired > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: "#FFECEC", color: "#D30000", border: "1px solid #FECACA" }}>
            <AlertCircle size={13} />{actionRequired} thread{actionRequired !== 1 ? "s" : ""} need action
          </div>
        )}
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg"
          style={{ background: PRIMARY, color: "white" }}
        >
          <Plus size={13} /> New Exchange
        </button>
        <div className="rounded-xl overflow-hidden flex-1" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          {EXCHANGE_THREADS.map((thread, i) => {
            const sc = EXCHANGE_STATUS_CONFIG[thread.status];
            const isSelected = selectedThread?.id === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className="px-3 py-3 cursor-pointer transition-colors"
                style={{
                  borderBottom: i < EXCHANGE_THREADS.length - 1 ? `1px solid ${BORDER}` : "none",
                  background: isSelected ? "#F0EDFB" : "transparent",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {thread.unread && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PRIMARY }} />}
                    <span className="text-xs font-semibold truncate" style={{ color: isSelected ? PRIMARY : TEXT_DARK }}>{thread.study}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: sc.bg, color: sc.text }}>{thread.status}</span>
                  </div>
                </div>
                <p className="text-[11px] font-medium truncate" style={{ color: TEXT_MID }}>{thread.subject}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] truncate" style={{ color: TEXT_MUTED }}>{thread.sponsor}</span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: TEXT_MUTED }}>{thread.lastActivity.split(",")[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thread detail */}
      {selectedThread ? (
        <div className="flex-1 flex flex-col rounded-xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          {/* Thread header */}
          <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold" style={{ color: TEXT_DARK }}>{selectedThread.subject}</span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: EXCHANGE_STATUS_CONFIG[selectedThread.status].bg, color: EXCHANGE_STATUS_CONFIG[selectedThread.status].text }}
                  >
                    {selectedThread.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: TEXT_MUTED }}>
                  <span className="flex items-center gap-1"><Building2 size={11} />{selectedThread.site}</span>
                  <span>·</span>
                  <span className="font-medium" style={{ color: PRIMARY }}>{selectedThread.study}</span>
                  <span>·</span>
                  <span>{selectedThread.docType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}>
                  <FolderInput size={12} /> File to eBinder
                </button>
                {selectedThread.status !== "Closed" && (
                  <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
                    Mark Closed
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {selectedThread.messages.map(msg => {
              const isSite = msg.from === "Site";
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isSite ? "flex-row-reverse" : ""}`}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: msg.fromColor }}
                  >
                    {msg.fromInitials}
                  </div>
                  <div className={`flex flex-col max-w-[75%] ${isSite ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold" style={{ color: TEXT_MID }}>{msg.fromName}</span>
                      {isSite
                        ? <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#E6F7F3", color: "#0D7A5F" }}>
                            <ArrowUpRight size={9} className="inline" /> Site
                          </span>
                        : <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#EEF2FF", color: PRIMARY }}>
                            <ArrowDownLeft size={9} className="inline" /> Sponsor
                          </span>}
                      <span className="text-[10px]" style={{ color: TEXT_MUTED }}>{msg.sentAt}</span>
                    </div>
                    <div
                      className="px-4 py-3 rounded-xl text-xs leading-relaxed"
                      style={{
                        background: isSite ? "#EDE9FF" : PAGE_BG,
                        border: `1px solid ${isSite ? "#C4B5FD" : BORDER}`,
                        color: TEXT_DARK,
                      }}
                    >
                      {msg.content}
                    </div>
                    {msg.attachment && (
                      <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                        <Paperclip size={11} style={{ color: TEXT_MUTED }} />
                        <span className="text-[11px] font-medium" style={{ color: PRIMARY }}>{msg.attachment}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compose */}
          {selectedThread.status !== "Closed" && (
            <div className="px-5 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
              <div className="flex items-end gap-3">
                <div className="flex-1 rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER2}` }}>
                  <textarea
                    rows={2}
                    placeholder="Reply to sponsor…"
                    value={compose}
                    onChange={e => setCompose(e.target.value)}
                    className="w-full px-4 py-3 text-xs resize-none outline-none"
                    style={{ background: CARD_BG, color: TEXT_DARK }}
                  />
                  <div className="flex items-center gap-2 px-4 py-2" style={{ borderTop: `1px solid ${BORDER}`, background: PAGE_BG }}>
                    <button className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded" style={{ color: TEXT_MUTED }}>
                      <Paperclip size={12} /> Attach
                    </button>
                    <button className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded" style={{ color: TEXT_MUTED }}>
                      <FolderInput size={12} /> From eBinder
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setCompose("")}
                  disabled={!compose.trim()}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-3 rounded-xl transition-opacity"
                  style={{ background: PRIMARY, color: "white", opacity: compose.trim() ? 1 : 0.4 }}
                >
                  <Send size={13} /> Send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col gap-3" style={{ background: CARD_BG, borderRadius: 12, border: `1px solid ${BORDER}` }}>
          <MessageSquare size={32} style={{ color: TEXT_MUTED }} />
          <p className="text-sm font-medium" style={{ color: TEXT_DARK }}>Select a thread to view</p>
        </div>
      )}
    </div>
  );
}

const AUDIT_LOG = [
  { id: 1, action: "Filed",    actionColor: "#038748", actionBg: "#D4F4E0", doc: "GCP Training Certificate — K. Tran",      study: "ONCOVAULT",  detail: "Training / GCP Certificates",         user: "Sarah Chen", userInitials: "SC", userColor: "#10B981", at: "Apr 21, 3:22 PM" },
  { id: 2, action: "Filed",    actionColor: "#038748", actionBg: "#D4F4E0", doc: "IMV Log — Site Visit Mar 30",              study: "ASTHMAPLUS", detail: "Monitoring / Visit Reports",           user: "Sarah Chen", userInitials: "SC", userColor: "#10B981", at: "Apr 21, 11:05 AM" },
  { id: 3, action: "Rejected", actionColor: "#D30000", actionBg: "#FFECEC", doc: "Duplicate Protocol — NEUROPILOT (v2.2)",  study: "NEUROPILOT", detail: "Duplicate — superseded by v2.3",       user: "Sarah Chen", userInitials: "SC", userColor: "#10B981", at: "Apr 20, 2:14 PM" },
  { id: 4, action: "Routed",   actionColor: "#A55A00", actionBg: "#FFF3CC", doc: "IND Safety Update Q1 2026 — JAVAHEART",  study: "JAVAHEART",  detail: "Forwarded to Reg. Coordinator",        user: "Sarah Chen", userInitials: "SC", userColor: "#10B981", at: "Yesterday, 2:31 PM" },
  { id: 5, action: "Routed",   actionColor: "#A55A00", actionBg: "#FFF3CC", doc: "Financial Disclosure Form — RHEUMATH",   study: "RHEUMATH",   detail: "Forwarded to Reg. Coordinator",        user: "Sarah Chen", userInitials: "SC", userColor: "#10B981", at: "Yesterday, 11:22 AM" },
  { id: 6, action: "Received", actionColor: TEXT_MUTED, actionBg: PAGE_BG,  doc: "Protocol Amendment 3 — JAVAHEART",       study: "JAVAHEART",  detail: "From Dr. Patricia Wells · Novartis",   user: "System",     userInitials: "SY", userColor: "#9CA3AF", at: "Today, 9:14 AM" },
];

function FileToBinder({ doc, onClose }: { doc: IncomingDoc; onClose: () => void }) {
  const [section, setSection] = useState(BINDER_SECTIONS[0]);
  const [selectedSites, setSelectedSites] = useState<string[]>(
    doc.isMultisite ? [] : doc.sites,
  );

  function toggleSite(site: string) {
    setSelectedSites(prev =>
      prev.includes(site) ? prev.filter(s => s !== site) : [...prev, site],
    );
  }

  const canSubmit = selectedSites.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative rounded-2xl shadow-2xl w-[460px] flex flex-col" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>File to eBinder</h2>
            <p className="text-xs mt-0.5 max-w-xs truncate" style={{ color: TEXT_MUTED }}>{doc.docName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 ml-4">
            <X className="w-4 h-4" style={{ color: TEXT_MUTED }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Study */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_DARK }}>Study</label>
            <div className="text-xs px-3 py-2 rounded-md font-medium" style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: TEXT_DARK }}>{doc.study}</div>
          </div>

          {/* Site(s) */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_DARK }}>
              {doc.isMultisite ? "Sites" : "Site"}
              {doc.isMultisite && (
                <span className="ml-2 text-[10px] font-normal px-1.5 py-0.5 rounded-full" style={{ background: "#EEF2FF", color: PRIMARY }}>
                  Multi-site study
                </span>
              )}
            </label>
            {doc.isMultisite ? (
              <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                {doc.sites.map((site, i) => {
                  const checked = selectedSites.includes(site);
                  return (
                    <label
                      key={site}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors"
                      style={{
                        borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                        background: checked ? "#F0EDFB" : CARD_BG,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSite(site)}
                        className="w-3.5 h-3.5 accent-[#5C4EE5] flex-shrink-0"
                      />
                      <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: checked ? PRIMARY : TEXT_MUTED }} />
                      <span className="text-xs" style={{ color: checked ? PRIMARY : TEXT_DARK }}>{site}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs px-3 py-2 rounded-md flex items-center gap-2" style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: TEXT_DARK }}>
                <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: TEXT_MUTED }} />
                {doc.sites[0]}
              </div>
            )}
          </div>

          {/* Binder section */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_DARK }}>Binder section</label>
            <div className="relative">
              <select
                value={section}
                onChange={e => setSection(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md appearance-none pr-8"
                style={{ border: `1px solid ${BORDER}`, background: CARD_BG, color: TEXT_DARK }}
              >
                {BINDER_SECTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-2.5 pointer-events-none" style={{ color: TEXT_MUTED }} />
            </div>
          </div>

          {/* Info banner */}
          <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ background: "#F0EDFB", border: `1px solid #DDD0F5` }}>
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PRIMARY }} />
            <p className="text-xs leading-relaxed" style={{ color: "#4A236D" }}>
              {doc.isMultisite && selectedSites.length > 0
                ? `Will be filed to ${selectedSites.length} site binder${selectedSites.length !== 1 ? "s" : ""} and versioned automatically.`
                : "Document will be versioned and tracked automatically once filed."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={onClose}
            className="flex-1 text-xs py-2 rounded-lg font-medium"
            style={{ border: `1px solid ${BORDER}`, color: TEXT_DARK }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            disabled={!canSubmit}
            className="flex-1 text-xs py-2 rounded-lg font-semibold text-white transition-opacity"
            style={{ background: PRIMARY, opacity: canSubmit ? 1 : 0.4 }}
          >
            {doc.isMultisite && selectedSites.length > 1
              ? `File to ${selectedSites.length} sites`
              : "File document"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentsPage() {
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("All");
  const [filingDoc, setFilingDoc] = useState<IncomingDoc | null>(null);

  const isAuditTab    = activeTab === "Audit Trail";
  const isExchangeTab = activeTab === "Sponsor Exchange";

  const filtered = (isAuditTab || isExchangeTab) ? [] : DOCS.filter(d => {
    const matchSearch = search === "" ||
      d.docName.toLowerCase().includes(search.toLowerCase()) ||
      d.sender.toLowerCase().includes(search.toLowerCase()) ||
      d.study.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === "All" || d.status === activeTab;
    return matchSearch && matchStatus;
  });

  const counts = {
    total:    DOCS.length,
    awaiting: DOCS.filter(d => d.status === "New").length,
    filed:    DOCS.filter(d => d.status === "Filed").length,
    rejected: DOCS.filter(d => d.status === "Rejected").length,
  };

  const TABS: TabFilter[] = ["All", "New", "Routed", "Filed", "Rejected", "Sponsor Exchange", "Audit Trail"];

  return (
    <div className="flex flex-col min-h-full -m-6">
      {filingDoc && <FileToBinder doc={filingDoc} onClose={() => setFilingDoc(null)} />}

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4" style={{ background: CARD_BG, borderBottom: `1px solid ${BORDER}` }}>
        <h1 className="text-base font-semibold" style={{ color: TEXT_DARK }}>Document Inbox</h1>
        <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>Documents sent to you by sponsors, CROs, and monitors</p>
      </div>

      <div className="px-6 py-5 flex-1 flex flex-col gap-4" style={{ background: PAGE_BG }}>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3">
          {([
            { label: "Total incoming",  value: counts.total,    sub: "all time",       icon: Inbox,        color: PRIMARY,   bg: "#EEF2FF" },
            { label: "Awaiting review", value: counts.awaiting, sub: "need action",    icon: AlertCircle,  color: "#D97706", bg: "#FFF3CC" },
            { label: "Filed",           value: counts.filed,    sub: "this week",      icon: CheckCircle,  color: "#038748", bg: "#D4F4E0" },
            { label: "Rejected",        value: counts.rejected, sub: "this week",      icon: XCircle,      color: "#D30000", bg: "#FFECEC" },
          ] as const).map(s => (
            <div key={s.label} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: TEXT_MUTED }}>{s.label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold" style={{ color: TEXT_DARK }}>{s.value}</span>
                <span className="text-[11px] ml-2" style={{ color: TEXT_MUTED }}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter / tab bar */}
        <div className="flex items-center gap-3" style={{ background: CARD_BG, borderRadius: 10, border: `1px solid ${BORDER}`, padding: "8px 14px" }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: TEXT_MUTED }} />
            <input
              type="text"
              placeholder="Search by sender, document, or study…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md"
              style={{ border: `1px solid ${BORDER}`, background: PAGE_BG, color: TEXT_DARK }}
            />
          </div>
          <div className="flex items-center gap-0.5 ml-auto">
            {TABS.map(tab => {
              const active = activeTab === tab;
              const isAudit = tab === "Audit Trail";
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                  style={active ? { background: PRIMARY, color: "white" } : { color: TEXT_MUTED }}
                >
                  {isAudit && <History className="w-3 h-3" />}
                  {tab === "Sponsor Exchange" && <RefreshCw className="w-3 h-3" />}
                  {tab}
                  {tab === "New" && counts.awaiting > 0 && (
                    <span className="text-[10px] font-bold px-1 rounded-full" style={active ? { color: "rgba(255,255,255,0.8)" } : { color: PRIMARY }}>{counts.awaiting}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sponsor Exchange */}
        {isExchangeTab ? (
          <SponsorExchangeTab />
        ) : isAuditTab ? (
          <div className="rounded-xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
              <History className="w-3.5 h-3.5" style={{ color: TEXT_MUTED }} />
              <span className="text-xs font-medium" style={{ color: TEXT_DARK }}>Document action history</span>
            </div>
            {AUDIT_LOG.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-4 py-3"
                style={{ borderBottom: i < AUDIT_LOG.length - 1 ? `1px solid ${BORDER}` : "none" }}
              >
                {/* User avatar */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: entry.userColor }}>
                  {entry.userInitials}
                </div>

                {/* Action badge */}
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: entry.actionBg, color: entry.actionColor }}>
                  {entry.action}
                </span>

                {/* Doc + detail */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-3 h-3 flex-shrink-0" style={{ color: TEXT_MUTED }} />
                    <span className="text-xs font-medium truncate" style={{ color: TEXT_DARK }}>{entry.doc}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "#EEF2FF", color: PRIMARY }}>{entry.study}</span>
                  </div>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: TEXT_MUTED }}>{entry.detail}</p>
                </div>

                {/* Time + user */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px]" style={{ color: TEXT_MUTED }}>{entry.at}</p>
                  <p className="text-[11px] font-medium" style={{ color: TEXT_DARK }}>{entry.user}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Document list */}
            <div className="rounded-xl overflow-hidden flex-1" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
                    {["Sender", "Document", "Study", "Received", "Status", ""].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-medium" style={{ color: TEXT_MUTED }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center" style={{ color: TEXT_MUTED }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: PAGE_BG }}>
                            <Inbox className="w-6 h-6" style={{ color: TEXT_MUTED }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: TEXT_DARK }}>No documents found</p>
                            <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>Try adjusting your search or filter.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((doc, i) => {
                    const cfg = STATUS_CONFIG[doc.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr
                        key={doc.id}
                        className="transition-colors hover:bg-[#FAF6F0]"
                        style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : "none" }}
                      >
                        {/* Sender */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                              style={{ background: doc.senderColor }}
                            >
                              {doc.senderInitials}
                            </div>
                            <div>
                              <div className="font-medium" style={{ color: TEXT_DARK }}>{doc.sender}</div>
                              <div style={{ color: TEXT_MUTED }}>{doc.senderOrg}</div>
                            </div>
                          </div>
                        </td>

                        {/* Document */}
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: TEXT_MUTED }} />
                            <div>
                              <div className="font-medium max-w-[220px] truncate" style={{ color: TEXT_DARK }}>{doc.docName}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: "#EEF2FF", color: PRIMARY }}>{doc.docType}</span>
                                {doc.isMultisite && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: PAGE_BG, color: TEXT_MUTED }}>
                                    {doc.sites.length} sites
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Study */}
                        <td className="px-4 py-3 font-medium" style={{ color: TEXT_DARK }}>{doc.study}</td>

                        {/* Received */}
                        <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>{doc.receivedAt}</td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium"
                            style={{ background: cfg.bg, color: cfg.text }}
                          >
                            <StatusIcon className="w-3 h-3" />{doc.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          {doc.status === "New" && (
                            <div className="flex items-center gap-1.5">
                              <button
                                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors hover:bg-gray-50"
                                style={{ borderColor: BORDER, color: TEXT_DARK }}
                              >
                                <Eye className="w-3 h-3" />Preview
                              </button>
                              <button
                                onClick={() => setFilingDoc(doc)}
                                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ background: PRIMARY }}
                              >
                                <FolderInput className="w-3 h-3" />File to Binder
                              </button>
                            </div>
                          )}
                          {doc.status === "Routed" && (
                            <button
                              onClick={() => setFilingDoc(doc)}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors hover:bg-gray-50"
                              style={{ border: `1px solid ${BORDER}`, color: TEXT_DARK }}
                            >
                              <FolderInput className="w-3 h-3" />File to Binder
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
