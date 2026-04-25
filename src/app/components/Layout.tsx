import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { MusicPlayer } from "./MusicPlayer";
import {
  Search, Bell,
  AlertCircle, FileSignature, MessageSquare, ClipboardList,
  CheckCircle, TrendingUp, AlertTriangle, Megaphone, X, CheckSquare,
  Headphones, BookOpen, Users, GraduationCap, Sparkles, Newspaper, Settings,
  Home, Inbox, FileText, BarChart2, Activity, Scale, Landmark, Database,
  Building2, Zap, Gem, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";

const PRIMARY = "#FF7859";

// ── Sidebar nav structure ─────────────────────────────────────────────────
const MY_WORK_NAV = [
  { id: "home",    label: "Home",  icon: Home,        path: null },
  { id: "inbox",   label: "Messages", icon: Inbox,       path: "/inbox",  badge: 3 },
  { id: "tasks",   label: "Tasks", icon: CheckSquare, path: "/tasks",  badge: 5 },
];

const STUDIES_NAV = [
  { id: "studies",     label: "Studies",        icon: BookOpen,      path: "/studies" },
  { id: "documents",   label: "Document Inbox", icon: FileText,      path: "/documents" },
  { id: "consents",    label: "Consent",        icon: FileSignature, path: "/consents", locked: true },
  { id: "feasibility", label: "Feasibility",    icon: Search,        path: "/feasibility" },
  { id: "reports",     label: "Reports",        icon: BarChart2,     path: "/reports" },
  { id: "monitoring",  label: "Monitoring",     icon: Activity,      path: "/monitoring" },
];

const ADMIN_NAV = [
  { id: "settings",        label: "Preferences",     icon: Settings,   path: "/settings" },
  { id: "users",           label: "Users",           icon: Users,      path: "/users" },
  { id: "profiles",        label: "Profiles",        icon: Building2,  path: "/profile" },
  { id: "site-management", label: "Site Management", icon: Building2,  path: "/site-management" },
  { id: "automations",     label: "Automations",     icon: Zap,        path: "/automations" },
];

const INTEGRATION_NAV = [
  { id: "contracting", label: "Contracts", icon: Scale,    path: "/integrations/contracting" },
  { id: "irb",         label: "IRB",       icon: Landmark, path: "/integrations/irb" },
  { id: "ctms",        label: "CTMS",      icon: Database, path: "/integrations/ctms" },
];

// ── Notifications ─────────────────────────────────────────────────────────
type NotifType = "overdue" | "signature" | "query" | "consent" | "assignment" | "milestone" | "document" | "adverse" | "announcement";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  group: "today" | "earlier";
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1,  type: "overdue",      title: "Task overdue — IRB submission",        desc: "PROTO-2024-001 · 3 days past due",                     time: "Just now",   unread: true,  group: "today" },
  { id: 2,  type: "signature",    title: "Signature required",                   desc: "PROTO-2024-001 · Amendment 3 awaits your review",      time: "15 min ago", unread: true,  group: "today" },
  { id: 3,  type: "adverse",      title: "SAE report requires PI sign-off",      desc: "PROTO-2024-032 · Subject 045 serious adverse event",   time: "32 min ago", unread: true,  group: "today" },
  { id: 4,  type: "query",        title: "New data query opened",                desc: "PROTO-2024-032 · Subject 045 visit date discrepancy",  time: "42 min ago", unread: true,  group: "today" },
  { id: 5,  type: "consent",      title: "Consent form expiring",                desc: "PROTO-2024-015 · ICF v1.8 expires in 7 days",          time: "1 hr ago",   unread: true,  group: "today" },
  { id: 6,  type: "assignment",   title: "New task assigned to you",             desc: "PROTO-2024-001 · Budget revision approval",            time: "2 hrs ago",  unread: false, group: "today" },
  { id: 7,  type: "milestone",    title: "Enrollment milestone reached",         desc: "PROTO-2024-048 · 50% of target enrolled (40/80)",      time: "3 hrs ago",  unread: false, group: "today" },
  { id: 8,  type: "document",     title: "Document signed",                      desc: "PROTO-2024-015 · ICF v2.1 signed by Dr. Martinez",     time: "Yesterday",  unread: false, group: "earlier" },
  { id: 9,  type: "query",        title: "Data query resolved",                  desc: "PROTO-2024-001 · Concomitant medication query closed",  time: "Yesterday",  unread: false, group: "earlier" },
  { id: 10, type: "announcement", title: "New announcement posted",              desc: "Protocol Amendment — PROTO-2024-015",                  time: "2 days ago", unread: false, group: "earlier" },
];

const NOTIF_CONFIG: Record<NotifType, { icon: React.ElementType; bg: string; iconColor: string }> = {
  overdue:      { icon: AlertCircle,    bg: "#FFECEC", iconColor: "#D30000" },
  adverse:      { icon: AlertTriangle,  bg: "#FFECEC", iconColor: "#AC0000" },
  signature:    { icon: FileSignature,  bg: "#FDF1EA", iconColor: "#A85948" },
  consent:      { icon: ClipboardList,  bg: "#FFF3CC", iconColor: "#A55A00" },
  query:        { icon: MessageSquare,  bg: "#FFF3CC", iconColor: "#FF991F" },
  assignment:   { icon: CheckSquare,    bg: "#D4F4E0", iconColor: "#038748" },
  milestone:    { icon: TrendingUp,     bg: "#D4F4E0", iconColor: "#038748" },
  document:     { icon: CheckCircle,    bg: "#D4F4E0", iconColor: "#038748" },
  announcement: { icon: Megaphone,      bg: "#F3F4F6", iconColor: "#6B7280" },
};

// ── Layout ────────────────────────────────────────────────────────────────
export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showResources, setShowResources] = useState(false);

  const persona =
    location.pathname.startsWith("/pi") ? "PI" :
    location.pathname.startsWith("/director") ? "Director" :
    "CRC";

  const homeLink = persona === "PI" ? "/pi" : persona === "Director" ? "/director" : "/crc";

  const unreadCount = notifications.filter(n => n.unread).length;
  const visibleNotifs = notifFilter === "unread" ? notifications.filter(n => n.unread) : notifications;
  const todayNotifs = visibleNotifs.filter(n => n.group === "today");
  const earlierNotifs = visibleNotifs.filter(n => n.group === "earlier");

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  const isHomeActive = ["/", "/crc", "/pi", "/director"].includes(location.pathname);
  const isPathActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="min-h-screen flex" style={{ background: "#F2EDE6" }}>
      {/* ── Sidebar ── */}
      <aside
        className="sticky top-0 h-screen flex-shrink-0 flex flex-col transition-all duration-200 overflow-hidden"
        style={{
          width: sidebarExpanded ? 220 : 52,
          background: "#FFFCF7",
          borderRight: "1px solid #EDE5DA",
        }}
      >
        {/* Logo row */}
        <div className="flex items-center gap-2.5 px-4 py-4 flex-shrink-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: PRIMARY }}
          >
            S
          </div>
          {sidebarExpanded && (
            <span className="font-semibold text-sm tracking-tight text-gray-900">SiteX</span>
          )}
        </div>

        {/* Nav body */}
        <nav className="flex-1 overflow-y-auto px-2 pb-3 space-y-4">
          {/* MY WORK — no section label, self-evident primary nav */}
          <div>
            {MY_WORK_NAV.map(item => {
              const isActive = item.id === "home" ? isHomeActive : isPathActive(item.path ?? "");
              const to = item.id === "home" ? homeLink : (item.path ?? "#");
              return (
                <SidebarItem
                  key={item.id}
                  to={to}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  isActive={isActive}
                  expanded={sidebarExpanded}
                />
              );
            })}
          </div>

          {/* STUDIES */}
          <div>
            {sidebarExpanded && (
              <div className="px-2 pb-1 pt-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Studies</span>
              </div>
            )}
            {STUDIES_NAV.map(item => (
              <SidebarItem
                key={item.id}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={isPathActive(item.path)}
                expanded={sidebarExpanded}
              />
            ))}
          </div>

          {/* INTEGRATIONS */}
          <div>
            {sidebarExpanded && (
              <div className="px-2 pb-1 pt-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Integrations</span>
              </div>
            )}
            {INTEGRATION_NAV.map(item => (
              <SidebarItem
                key={item.id}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={isPathActive(item.path)}
                expanded={sidebarExpanded}
              />
            ))}
          </div>

        </nav>

        {/* Sidebar toggle */}
        <div className="px-2 py-2 flex-shrink-0" style={{ borderTop: "1px solid #EDE5DA" }}>
          <button
            onClick={() => setSidebarExpanded(v => !v)}
            className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg transition-colors hover:bg-[#F5EDE0]"
            style={{ color: "#9CA3AF" }}
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded
              ? <PanelLeftClose className="w-4 h-4 flex-shrink-0" />
              : <PanelLeftOpen  className="w-4 h-4 flex-shrink-0" />}
            {sidebarExpanded && (
              <span className="text-sm font-medium" style={{ color: "#9CA3AF" }}>Collapse</span>
            )}
          </button>
        </div>

        {/* ADMIN — pinned above user footer */}
        <div className="px-2 py-2 flex-shrink-0" style={{ borderTop: "1px solid #EDE5DA" }}>
          {sidebarExpanded && (
            <div className="px-2 pb-1 pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Admin</span>
            </div>
          )}
          {ADMIN_NAV.map(item => (
            <SidebarItem
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={isPathActive(item.path)}
              expanded={sidebarExpanded}
            />
          ))}
        </div>

        {/* User footer */}
        {(() => {
          const footerUser =
            persona === "PI"       ? { initials: "AO", name: "Dr. Okafor",  role: "Principal Investigator" } :
            persona === "Director" ? { initials: "KC", name: "Dr. K. Chen", role: "Site Director" } :
                                     { initials: "SC", name: "Sarah Chen",  role: "CRC" };
          return (
            <div
              className="px-3 py-3 flex items-center gap-2.5 flex-shrink-0"
              style={{ borderTop: "1px solid #EDE5DA" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}, #F18067)` }}
              >
                {footerUser.initials}
              </div>
              {sidebarExpanded && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-800 truncate">{footerUser.name}</div>
                  <div className="text-[10px] text-gray-400">{footerUser.role}</div>
                </div>
              )}
            </div>
          );
        })()}
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="sticky top-0 z-50 flex items-center justify-between px-5 py-2.5 flex-shrink-0"
          style={{ background: "#FFFCF7", borderBottom: "1px solid #EDE5DA", boxShadow: "0 1px 3px rgba(80,55,30,0.06)" }}
        >
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search studies, tasks, documents…"
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border focus:outline-none"
                style={{ background: "#F5EFE7", borderColor: "#E3D8CC", color: "#3D3028" }}
              />
            </div>
          </div>

          {/* Music player */}
          <MusicPlayer />

          <div className="flex items-center gap-3">
            {/* Persona pill */}
            <div
              className="flex rounded-full border p-0.5 gap-0.5"
              style={{ borderColor: "#E3D8CC", background: "#EDE5DC" }}
            >
              {(["CRC", "PI", "Director"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => navigate(p === "CRC" ? "/crc" : p === "PI" ? "/pi" : "/director")}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: persona === p ? "#FFFCF7" : "transparent",
                    color: persona === p ? PRIMARY : "#8C7B6E",
                    boxShadow: persona === p ? "0 1px 3px rgba(80,55,30,0.12)" : "none",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Resources */}
            <div className="relative">
              <button
                onClick={() => setShowResources(v => !v)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold transition-colors hover:bg-gray-100"
                style={{ borderColor: "#E3D8CC", color: "#4D3F34", background: showResources ? "#F5EDE0" : "transparent" }}
              >
                ?
              </button>
            </div>

            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(v => !v)}
                className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                    style={{ background: "#D30000", fontSize: "9px" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[420px] bg-white border border-gray-200 rounded-xl shadow-xl z-20 flex flex-col max-h-[600px]">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                      <div>
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={markAllRead} className="text-xs font-medium hover:underline" style={{ color: PRIMARY }}>
                          Mark all read
                        </button>
                        <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-gray-100 rounded">
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-1 px-4 pt-2 pb-1 border-b border-gray-100 flex-shrink-0">
                      {(["all", "unread"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setNotifFilter(f)}
                          className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                          style={notifFilter === f ? { background: PRIMARY, color: "white" } : { color: "#6B7280" }}
                        >
                          {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
                        </button>
                      ))}
                    </div>

                    <div className="overflow-y-auto flex-1">
                      {todayNotifs.length > 0 && (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">Today</div>
                          {todayNotifs.map(n => <NotifRow key={n.id} notif={n} onRead={markRead} />)}
                        </>
                      )}
                      {earlierNotifs.length > 0 && (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">Earlier</div>
                          {earlierNotifs.map(n => <NotifRow key={n.id} notif={n} onRead={markRead} />)}
                        </>
                      )}
                      {visibleNotifs.length === 0 && (
                        <div className="p-8 text-center text-sm text-gray-500">No notifications</div>
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-100 text-center flex-shrink-0">
                      <button className="text-xs font-medium hover:underline" style={{ color: PRIMARY }}>
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* ── Resources slide-out panel ── */}
      {showResources && (
        <div className="fixed inset-0 z-40" onClick={() => setShowResources(false)} />
      )}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300"
        style={{
          width: 420,
          background: "#FFFCF7",
          borderLeft: "1px solid #EDE5DA",
          boxShadow: "-4px 0 24px rgba(80,55,30,0.10)",
          transform: showResources ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid #EDE5DA" }}
        >
          <div>
            <h2 className="text-base font-semibold text-gray-900">Customer Resources</h2>
            <p className="text-xs text-gray-400 mt-0.5">Help, learning & community</p>
          </div>
          <button
            onClick={() => setShowResources(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {[
            { icon: Headphones,    label: "Contact support",   desc: "Report an issue or share feedback" },
            { icon: BookOpen,      label: "Help center",       desc: "Get answers quickly" },
            { icon: Sparkles,      label: "What's new",        desc: "Latest features and product updates" },
            { icon: Users,         label: "Community",         desc: "Connect with Florence users like you" },
            { icon: GraduationCap, label: "Academy",           desc: "Build your skill set and learn best practices" },
            { icon: Newspaper,     label: "The League",        desc: "Trending topics for research leaders" },
            { icon: CheckCircle,   label: "Compliance",        desc: "Regulatory guidance and audit readiness" },
          ].map(({ icon: Icon, label, desc }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-[#F5EDE0]"
              style={{ borderBottom: "1px solid #F0EAE2" }}
              onClick={e => e.preventDefault()}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFEBE8" }}
              >
                <Icon className="w-5 h-5" style={{ color: PRIMARY }} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-gray-800">{label}</span>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar item ─────────────────────────────────────────────────────────
function SidebarItem({
  to,
  icon: Icon,
  label,
  badge,
  locked,
  isActive,
  expanded,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  locked?: boolean;
  isActive: boolean;
  expanded: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors"
      style={{
        background: isActive ? "#FDF0E6" : "transparent",
        color: isActive ? "#2D1F12" : "#4D3F34",
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F5EDE0"; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      title={!expanded ? label : undefined}
    >
      <Icon
        className="w-4 h-4 flex-shrink-0"
        style={{ color: isActive ? PRIMARY : "#9CA3AF" }}
      />
      {expanded && (
        <>
          <span className={`text-sm flex-1 truncate ${isActive ? "font-semibold" : "font-medium"}`}>
            {label}
          </span>
          {badge !== undefined && (
            <span className="text-xs text-gray-400 font-medium flex-shrink-0">{badge}</span>
          )}
          {locked && (
            <Gem className="w-3 h-3 flex-shrink-0" style={{ color: "#C4B8D4" }} />
          )}
        </>
      )}
    </Link>
  );
}

// ── Notification row ──────────────────────────────────────────────────────
function NotifRow({ notif, onRead }: { notif: Notification; onRead: (id: number) => void }) {
  const cfg = NOTIF_CONFIG[notif.type];
  const Icon = cfg.icon;
  return (
    <div
      onClick={() => onRead(notif.id)}
      className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${notif.unread ? "bg-indigo-50/20" : ""}`}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: cfg.bg }}>
        <Icon className="w-4 h-4" style={{ color: cfg.iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${notif.unread ? "font-semibold" : "font-medium text-gray-700"}`}>{notif.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.desc}</p>
        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
      </div>
      {notif.unread && (
        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "#5C4EE5" }} />
      )}
    </div>
  );
}
