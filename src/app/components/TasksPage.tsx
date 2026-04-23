import { useState, useMemo } from "react";
import {
  Plus, MoreHorizontal, ChevronDown, ChevronRight, ChevronLeft,
  SlidersHorizontal, MessageSquare, Calendar as CalendarIcon,
  List, LayoutGrid, X,
} from "lucide-react";

const PRIMARY = "#5C4EE5";
const TODAY = "2026-04-18";

// ── Types ─────────────────────────────────────────────────────────────────
type Priority  = "high" | "medium" | "low";
type TaskStatus = "overdue" | "in-progress" | "pending" | "completed";
type ViewMode  = "list" | "board" | "calendar";
type GroupBy   = "section" | "study" | "priority" | "status";
type SortBy    = "manual" | "dueDate" | "priority";
type FilterDate = "all" | "today" | "week" | "overdue";

interface Task {
  id: number;
  section: string;
  title: string;
  study: string;
  studyName: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  assignee: string;
  comments: number;
  subTasks: { done: number; total: number };
}

// ── Mock data ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "regulatory", label: "Regulatory",  emoji: "📋" },
  { id: "consent",    label: "Consent",     emoji: "✍️"  },
  { id: "monitoring", label: "Monitoring",  emoji: "📡" },
  { id: "budget",     label: "Budget",      emoji: "💰" },
  { id: "general",    label: "General",     emoji: "📌" },
];

const MOCK_TASKS: Task[] = [
  // Regulatory
  { id: 1,  section: "regulatory", title: "Complete IRB submission",              study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  dueDate: "2026-04-15", priority: "high",   status: "overdue",     assignee: "Sarah Chen",   comments: 2, subTasks: { done: 0, total: 3 } },
  { id: 2,  section: "regulatory", title: "Submit SAE follow-up report",          study: "PROTO-2024-032", studyName: "Oncology Trial",              dueDate: "2026-04-16", priority: "high",   status: "overdue",     assignee: "You",          comments: 0, subTasks: { done: 0, total: 0 } },
  { id: 3,  section: "regulatory", title: "Regulatory binder audit",              study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  dueDate: "2026-04-28", priority: "medium", status: "in-progress", assignee: "You",          comments: 1, subTasks: { done: 1, total: 4 } },
  { id: 4,  section: "regulatory", title: "Annual renewal application 2026",      study: "PROTO-2024-032", studyName: "Oncology Trial",              dueDate: "2026-04-30", priority: "high",   status: "pending",     assignee: "Sarah Chen",   comments: 0, subTasks: { done: 0, total: 2 } },
  // Consent
  { id: 5,  section: "consent",    title: "Review consent forms — v2.1 Spanish",  study: "PROTO-2024-015", studyName: "Diabetes Study Phase II",     dueDate: "2026-04-18", priority: "high",   status: "pending",     assignee: "You",          comments: 3, subTasks: { done: 0, total: 0 } },
  { id: 6,  section: "consent",    title: "eConsent setup for Neurology trial",   study: "PROTO-2024-048", studyName: "Neurology Phase III",         dueDate: "2026-04-22", priority: "medium", status: "pending",     assignee: "You",          comments: 0, subTasks: { done: 0, total: 0 } },
  { id: 7,  section: "consent",    title: "ICF translation review — French",      study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  dueDate: "2026-04-25", priority: "low",    status: "in-progress", assignee: "M. Torres",    comments: 1, subTasks: { done: 2, total: 3 } },
  // Monitoring
  { id: 8,  section: "monitoring", title: "Prepare visit log for site monitor",   study: "PROTO-2024-048", studyName: "Neurology Phase III",         dueDate: "2026-04-18", priority: "high",   status: "in-progress", assignee: "You",          comments: 0, subTasks: { done: 3, total: 5 } },
  { id: 9,  section: "monitoring", title: "Upload monitoring report",             study: "PROTO-2024-032", studyName: "Oncology Trial",              dueDate: "2026-04-20", priority: "medium", status: "in-progress", assignee: "You",          comments: 2, subTasks: { done: 0, total: 0 } },
  { id: 10, section: "monitoring", title: "Pre-monitoring visit checklist",       study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  dueDate: "2026-04-24", priority: "medium", status: "pending",     assignee: "Sarah Chen",   comments: 0, subTasks: { done: 1, total: 6 } },
  { id: 11, section: "monitoring", title: "Site initiation visit follow-up",      study: "PROTO-2024-053", studyName: "Pediatric Asthma Study",      dueDate: "2026-04-26", priority: "high",   status: "pending",     assignee: "You",          comments: 1, subTasks: { done: 0, total: 3 } },
  // Budget
  { id: 12, section: "budget",     title: "Budget revision approval",             study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  dueDate: "2026-04-22", priority: "low",    status: "pending",     assignee: "M. Torres",    comments: 1, subTasks: { done: 0, total: 0 } },
  { id: 13, section: "budget",     title: "Q2 budget reconciliation",             study: "PROTO-2024-048", studyName: "Neurology Phase III",         dueDate: "2026-04-29", priority: "medium", status: "pending",     assignee: "You",          comments: 0, subTasks: { done: 0, total: 2 } },
  { id: 14, section: "budget",     title: "Invoicing for study lab supplies",     study: "PROTO-2024-015", studyName: "Diabetes Study Phase II",     dueDate: "2026-04-30", priority: "low",    status: "pending",     assignee: "Finance",      comments: 0, subTasks: { done: 0, total: 0 } },
  // General
  { id: 15, section: "general",    title: "Site activation checklist",            study: "PROTO-2024-048", studyName: "Neurology Phase III",         dueDate: "2026-04-25", priority: "medium", status: "pending",     assignee: "You",          comments: 0, subTasks: { done: 4, total: 8 } },
  { id: 16, section: "general",    title: "Staff GCP training coordination",      study: "All Studies",    studyName: "",                            dueDate: "2026-05-01", priority: "medium", status: "pending",     assignee: "You",          comments: 2, subTasks: { done: 0, total: 0 } },
  { id: 17, section: "general",    title: "Patient recruitment outreach",         study: "PROTO-2024-053", studyName: "Pediatric Asthma Study",      dueDate: "2026-04-26", priority: "low",    status: "pending",     assignee: "You",          comments: 1, subTasks: { done: 0, total: 0 } },
  { id: 18, section: "general",    title: "Update site delegation log",           study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial",  dueDate: "2026-04-23", priority: "medium", status: "pending",     assignee: "Sarah Chen",   comments: 0, subTasks: { done: 0, total: 0 } },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const PRIORITY_BORDER: Record<Priority, string> = { high: "#D30000", medium: "#FF991F", low: "#9CA3AF" };

const fmtDate = (d: string) => {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m - 1]} ${+day}`;
};

const isOverdueDate = (d: string, completed: boolean) =>
  !completed && d < TODAY;

function PriorityDot({ priority }: { priority: Priority }) {
  return <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PRIORITY_BORDER[priority] }} />;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const s = priority === "high"
    ? { background: "#FFECEC", color: "#D30000" }
    : priority === "medium"
    ? { background: "#FFF3CC", color: "#A55A00" }
    : { background: "#F3F4F6", color: "#6B7280" };
  return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize" style={s}>{priority}</span>;
}

// ── Main component ────────────────────────────────────────────────────────
export function TasksPage() {
  const [view,            setView]            = useState<ViewMode>("board");
  const [showPanel,       setShowPanel]       = useState(true);
  const [groupBy,         setGroupBy]         = useState<GroupBy>("section");
  const [sortBy,          setSortBy]          = useState<SortBy>("manual");
  const [filterDate,      setFilterDate]      = useState<FilterDate>("all");
  const [filterPriority,  setFilterPriority]  = useState<"all" | Priority>("all");
  const [showCompleted,   setShowCompleted]   = useState(false);
  const [completedIds,    setCompletedIds]    = useState<number[]>([]);
  const [collapsed,       setCollapsed]       = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    let tasks = [...MOCK_TASKS];
    if (!showCompleted) tasks = tasks.filter(t => !completedIds.includes(t.id));
    if (filterDate === "today")   tasks = tasks.filter(t => t.dueDate === TODAY);
    if (filterDate === "week")    tasks = tasks.filter(t => t.dueDate >= TODAY && t.dueDate <= "2026-04-25");
    if (filterDate === "overdue") tasks = tasks.filter(t => isOverdueDate(t.dueDate, completedIds.includes(t.id)));
    if (filterPriority !== "all") tasks = tasks.filter(t => t.priority === filterPriority);
    if (sortBy === "dueDate")  tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    if (sortBy === "priority") tasks.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]));
    return tasks;
  }, [showCompleted, completedIds, filterDate, filterPriority, sortBy]);

  const groups = useMemo(() => {
    if (groupBy === "section") {
      return SECTIONS.map(s => ({
        key: s.id, label: s.label, emoji: s.emoji,
        tasks: filteredTasks.filter(t => t.section === s.id),
      }));
    }
    if (groupBy === "study") {
      const studies = [...new Set(MOCK_TASKS.map(t => t.study))];
      return studies.map(study => ({
        key: study, label: study, emoji: "🔬",
        tasks: filteredTasks.filter(t => t.study === study),
      }));
    }
    if (groupBy === "priority") {
      return (["high","medium","low"] as Priority[]).map(p => ({
        key: p, label: p.charAt(0).toUpperCase() + p.slice(1), emoji: p === "high" ? "🔴" : p === "medium" ? "🟡" : "⚪",
        tasks: filteredTasks.filter(t => t.priority === p),
      }));
    }
    // status
    return (["overdue","in-progress","pending"] as const).map(s => ({
      key: s, label: s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1),
      emoji: s === "overdue" ? "🔴" : s === "in-progress" ? "🟡" : "⚪",
      tasks: filteredTasks.filter(t => (s === "overdue" ? isOverdueDate(t.dueDate, completedIds.includes(t.id)) : t.status === s)),
    }));
  }, [filteredTasks, groupBy, completedIds]);

  const activeFilters = (filterDate !== "all" ? 1 : 0) + (filterPriority !== "all" ? 1 : 0) + (showCompleted ? 1 : 0);

  const toggleComplete = (id: number) =>
    setCompletedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleCollapse = (key: string) =>
    setCollapsed(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);

  const reset = () => { setGroupBy("section"); setSortBy("manual"); setFilterDate("all"); setFilterPriority("all"); setShowCompleted(false); };

  return (
    <div className="-m-6 flex flex-col bg-white" style={{ height: "calc(100vh - 53px)" }}>
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 flex-shrink-0">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">My Tasks /</div>
          <h1 className="text-lg font-bold text-gray-900">Tasks 📋</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            {([
              { key: "list"     as const, Icon: List,         label: "List"     },
              { key: "board"    as const, Icon: LayoutGrid,   label: "Board"    },
              { key: "calendar" as const, Icon: CalendarIcon, label: "Calendar" },
            ]).map(({ key, Icon, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 border-gray-200"
                style={view === key ? { background: "#F3F4F6", color: "#1F2937" } : { background: "white", color: "#9CA3AF" }}
              >
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          {/* Display toggle */}
          <button
            onClick={() => setShowPanel(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            style={{ color: activeFilters > 0 ? PRIMARY : "#374151" }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Display{activeFilters > 0 ? `: ${activeFilters}` : ""}
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
            style={{ background: PRIMARY }}
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {view === "board" && (
            <BoardView groups={groups} completedIds={completedIds} onToggle={toggleComplete} />
          )}
          {view === "list" && (
            <>
              {/* Grouping tabs */}
              <div className="flex items-center gap-1.5 px-6 pt-4 pb-0">
                {([
                  { key: "section"  as const, label: "By Category" },
                  { key: "study"    as const, label: "By Study"    },
                  { key: "priority" as const, label: "By Priority" },
                ] as { key: GroupBy; label: string }[]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setGroupBy(key)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={groupBy === key
                      ? { background: PRIMARY, color: "#fff" }
                      : { background: "#F3F4F6", color: "#6B7280" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <ListView groups={groups} completedIds={completedIds} onToggle={toggleComplete} collapsed={collapsed} onToggleCollapse={toggleCollapse} />
            </>
          )}
          {view === "calendar" && (
            <CalendarView tasks={filteredTasks} completedIds={completedIds} />
          )}
        </div>

        {showPanel && (
          <SettingsPanel
            view={view} groupBy={groupBy} sortBy={sortBy}
            filterDate={filterDate} filterPriority={filterPriority} showCompleted={showCompleted}
            onView={setView} onGroupBy={setGroupBy} onSortBy={setSortBy}
            onFilterDate={setFilterDate} onFilterPriority={setFilterPriority}
            onShowCompleted={setShowCompleted} onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

// ── Board view ────────────────────────────────────────────────────────────
function BoardView({ groups, completedIds, onToggle }: {
  groups: { key: string; label: string; emoji: string; tasks: Task[] }[];
  completedIds: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto overflow-y-hidden h-full px-6 py-5">
      {groups.map(group => (
        <div key={group.key} className="flex-shrink-0 w-72 flex flex-col">
          {/* Column header */}
          <div className="flex items-center gap-2 mb-3 group/col">
            <span className="text-base leading-none">{group.emoji}</span>
            <span className="font-semibold text-sm text-gray-800 italic">{group.label}</span>
            <span className="text-xs text-gray-400 font-normal">{group.tasks.length}</span>
            <button className="ml-auto opacity-0 group-hover/col:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-0.5">
            {group.tasks.map(task => (
              <BoardCard key={task.id} task={task} completed={completedIds.includes(task.id)} onToggle={onToggle} />
            ))}
            {group.tasks.length === 0 && (
              <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-400">
                No tasks
              </div>
            )}
          </div>

          {/* Add task */}
          <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1.5">
            <Plus className="w-3.5 h-3.5" /> Add task
          </button>
        </div>
      ))}
    </div>
  );
}

function BoardCard({ task, completed, onToggle }: { task: Task; completed: boolean; onToggle: (id: number) => void }) {
  const overdue = isOverdueDate(task.dueDate, completed);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group/card">
      <div className="flex items-start gap-2">
        <button
          onClick={e => { e.stopPropagation(); onToggle(task.id); }}
          className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all hover:scale-110"
          style={completed
            ? { borderColor: "#038748", background: "#038748" }
            : { borderColor: PRIORITY_BORDER[task.priority] }}
        >
          {completed && <span className="text-white" style={{ fontSize: 8 }}>✓</span>}
        </button>
        <span className={`text-sm leading-snug ${completed ? "line-through text-gray-400" : "text-gray-900"}`}>
          {task.title}
        </span>
      </div>

      {task.studyName && (
        <div className="ml-6 mt-1 text-[11px] text-gray-400 truncate">{task.study}</div>
      )}

      <div className="ml-6 mt-2 flex items-center gap-3 text-[11px]">
        {task.dueDate && (
          <span className="flex items-center gap-0.5" style={{ color: overdue ? "#D30000" : "#9CA3AF" }}>
            <CalendarIcon className="w-3 h-3" />
            {fmtDate(task.dueDate)}
          </span>
        )}
        {task.subTasks.total > 0 && (
          <span className="text-gray-400">○ {task.subTasks.done}/{task.subTasks.total}</span>
        )}
        {task.comments > 0 && (
          <span className="flex items-center gap-0.5 text-gray-400">
            <MessageSquare className="w-3 h-3" />{task.comments}
          </span>
        )}
      </div>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────
function ListView({ groups, completedIds, onToggle, collapsed, onToggleCollapse }: {
  groups: { key: string; label: string; emoji: string; tasks: Task[] }[];
  completedIds: number[];
  onToggle: (id: number) => void;
  collapsed: string[];
  onToggleCollapse: (key: string) => void;
}) {
  return (
    <div className="overflow-y-auto h-full px-6 py-5">
      <div className="max-w-5xl space-y-5">
        {groups.map(group => {
          const isCollapsed = collapsed.includes(group.key);
          return (
            <div key={group.key}>
              {/* Section header */}
              <button
                onClick={() => onToggleCollapse(group.key)}
                className="flex items-center gap-2 mb-2 w-full text-left group/hdr"
              >
                <span className="text-gray-400 transition-transform" style={{ transform: isCollapsed ? "rotate(-90deg)" : "none" }}>
                  <ChevronDown className="w-4 h-4" />
                </span>
                <span className="text-base leading-none">{group.emoji}</span>
                <span className="font-semibold text-sm text-gray-800">{group.label}</span>
                <span className="text-xs text-gray-400">{group.tasks.length}</span>
              </button>

              {!isCollapsed && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Column headers */}
                  <div className="grid gap-4 px-4 py-2 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
                    style={{ gridTemplateColumns: "1fr 140px 110px 110px 72px" }}>
                    <span>Task</span>
                    <span>Study</span>
                    <span>Due Date</span>
                    <span>Assignee</span>
                    <span>Priority</span>
                  </div>

                  {group.tasks.map(task => {
                    const done = completedIds.includes(task.id);
                    const overdue = isOverdueDate(task.dueDate, done);
                    return (
                      <div
                        key={task.id}
                        className="grid gap-4 px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50 items-center last:border-b-0 transition-colors"
                        style={{ gridTemplateColumns: "1fr 140px 110px 110px 72px" }}
                      >
                        {/* Task cell */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => onToggle(task.id)}
                            className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110"
                            style={done
                              ? { borderColor: "#038748", background: "#038748" }
                              : { borderColor: PRIORITY_BORDER[task.priority] }}
                          >
                            {done && <span className="text-white" style={{ fontSize: 8 }}>✓</span>}
                          </button>
                          <span className={`text-sm truncate ${done ? "line-through text-gray-400" : "text-gray-900"}`}>
                            {task.title}
                          </span>
                          {task.subTasks.total > 0 && (
                            <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                              ○ {task.subTasks.done}/{task.subTasks.total}
                            </span>
                          )}
                          {task.comments > 0 && (
                            <span className="flex items-center gap-0.5 text-[11px] text-gray-400 flex-shrink-0">
                              <MessageSquare className="w-3 h-3" />{task.comments}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-gray-500 truncate">{task.study}</span>
                        <span className="text-xs" style={{ color: overdue ? "#D30000" : "#6B7280" }}>
                          {fmtDate(task.dueDate)}
                        </span>
                        <span className="text-xs text-gray-600 truncate">{task.assignee}</span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                    );
                  })}

                  {/* Add task row */}
                  <button className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-50 w-full text-left hover:text-gray-600 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add task
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Calendar view ─────────────────────────────────────────────────────────
function CalendarView({ tasks, completedIds }: { tasks: Task[]; completedIds: number[] }) {
  const [cal, setCal] = useState({ year: 2026, month: 4 });

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const firstDow   = new Date(cal.year, cal.month - 1, 1).getDay();
  const daysInMonth = new Date(cal.year, cal.month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const dateStr = (day: number) =>
    `${cal.year}-${String(cal.month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

  const tasksForDay = (day: number) =>
    tasks.filter(t => t.dueDate === dateStr(day) && !completedIds.includes(t.id));

  const isToday = (day: number) => dateStr(day) === TODAY;

  const prevMonth = () => setCal(c => c.month === 1 ? { year: c.year - 1, month: 12 } : { year: c.year, month: c.month - 1 });
  const nextMonth = () => setCal(c => c.month === 12 ? { year: c.year + 1, month: 1 } : { year: c.year, month: c.month + 1 });

  return (
    <div className="overflow-y-auto h-full px-6 py-5">
      {/* Cal header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">{MONTHS[cal.month - 1]} {cal.year}</h2>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => setCal({ year: 2026, month: 4 })} className="px-3 py-1 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            Today
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="py-1.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-l border-t border-gray-200 rounded-xl overflow-hidden">
        {cells.map((day, i) => {
          const dayTasks = day ? tasksForDay(day) : [];
          const today    = day ? isToday(day) : false;
          return (
            <div
              key={i}
              className="border-r border-b border-gray-200 p-2 min-h-[108px] transition-colors hover:bg-gray-50/50"
              style={{ background: day ? "white" : "#FAFAFA" }}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full"
                      style={today ? { background: PRIMARY, color: "white" } : { color: "#6B7280" }}
                    >
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] text-gray-400">{dayTasks.length}</span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium cursor-pointer hover:opacity-80 transition-opacity"
                        style={task.priority === "high"
                          ? { background: "#FFECEC", color: "#D30000" }
                          : task.priority === "medium"
                          ? { background: "#FFF3CC", color: "#A55A00" }
                          : { background: "#EEF0FF", color: PRIMARY }
                        }
                        title={`${task.title} · ${task.study}`}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-[10px] text-gray-400 px-1">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-500">
        {([
          { label: "High priority",   bg: "#FFECEC", text: "#D30000" },
          { label: "Medium priority", bg: "#FFF3CC", text: "#A55A00" },
          { label: "Low priority",    bg: "#EEF0FF", text: PRIMARY   },
        ] as const).map(({ label, bg, text }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: bg, color: text }}>■</span>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Settings panel ────────────────────────────────────────────────────────
function SettingsPanel({
  view, groupBy, sortBy, filterDate, filterPriority, showCompleted,
  onView, onGroupBy, onSortBy, onFilterDate, onFilterPriority, onShowCompleted, onReset,
}: {
  view: ViewMode; groupBy: GroupBy; sortBy: SortBy;
  filterDate: FilterDate; filterPriority: "all" | Priority; showCompleted: boolean;
  onView: (v: ViewMode) => void;
  onGroupBy: (v: GroupBy) => void; onSortBy: (v: SortBy) => void;
  onFilterDate: (v: FilterDate) => void; onFilterPriority: (v: "all" | Priority) => void;
  onShowCompleted: (v: boolean) => void; onReset: () => void;
}) {
  const Select = ({ value, onChange, options }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-gray-300"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <div className="w-56 border-l border-gray-200 bg-white flex flex-col flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <span className="font-semibold text-sm text-gray-900">Display</span>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIMARY }} />
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Layout */}
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Layout</div>
          <div className="grid grid-cols-3 gap-1.5">
            {([
              { key: "list"     as const, Icon: List,         label: "List"     },
              { key: "board"    as const, Icon: LayoutGrid,   label: "Board"    },
              { key: "calendar" as const, Icon: CalendarIcon, label: "Calendar" },
            ]).map(({ key, Icon, label }) => (
              <button
                key={key}
                onClick={() => onView(key)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg border text-[10px] font-medium transition-all"
                style={view === key
                  ? { borderColor: PRIMARY, background: "#EEF0FF", color: PRIMARY }
                  : { borderColor: "#E5E7EB", color: "#6B7280" }}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Completed tasks toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Completed tasks</span>
          <button
            onClick={() => onShowCompleted(!showCompleted)}
            className="w-9 h-5 rounded-full relative transition-colors flex-shrink-0"
            style={{ background: showCompleted ? PRIMARY : "#D1D5DB" }}
          >
            <div
              className="w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-all duration-200"
              style={{ left: showCompleted ? "18px" : "2px" }}
            />
          </button>
        </div>

        {/* Sort section */}
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Sort</div>
          <div className="space-y-2.5">
            <div>
              <div className="text-xs text-gray-600 mb-1.5">Grouping</div>
              <Select value={groupBy} onChange={v => onGroupBy(v as GroupBy)} options={[
                { value: "section",  label: "Section"  },
                { value: "study",    label: "Study"    },
                { value: "priority", label: "Priority" },
                { value: "status",   label: "Status"   },
              ]} />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1.5">Sorting</div>
              <Select value={sortBy} onChange={v => onSortBy(v as SortBy)} options={[
                { value: "manual",   label: "Manual"   },
                { value: "dueDate",  label: "Due Date" },
                { value: "priority", label: "Priority" },
              ]} />
            </div>
          </div>
        </div>

        {/* Filter section */}
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Filter</div>
          <div className="space-y-2.5">
            <div>
              <div className="text-xs text-gray-600 mb-1.5">Date</div>
              <Select value={filterDate} onChange={v => onFilterDate(v as FilterDate)} options={[
                { value: "all",     label: "All"       },
                { value: "today",   label: "Today"     },
                { value: "week",    label: "This Week" },
                { value: "overdue", label: "Overdue"   },
              ]} />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1.5">Priority</div>
              <Select value={filterPriority} onChange={v => onFilterPriority(v as "all" | Priority)} options={[
                { value: "all",    label: "All"    },
                { value: "high",   label: "High"   },
                { value: "medium", label: "Medium" },
                { value: "low",    label: "Low"    },
              ]} />
            </div>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={onReset}
          className="text-xs font-semibold w-full text-center hover:underline"
          style={{ color: PRIMARY }}
        >
          Reset all
        </button>
      </div>
    </div>
  );
}
