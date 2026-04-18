import { Link } from "react-router";
import { Plus, Filter, MoreVertical, AlertCircle, Clock, CheckCircle, LinkIcon } from "lucide-react";
import { useState } from "react";
import { MultiSelect } from "./MultiSelect";

const mockTasks = [
  { id: 1, title: "Complete IRB submission", study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial", category: "Regulatory", dueDate: "2026-04-15", assignee: "Sarah Chen", status: "overdue", urgency: "high" },
  { id: 2, title: "Review consent forms", study: "PROTO-2024-015", studyName: "Diabetes Study Phase II", category: "Consent", dueDate: "2026-04-18", assignee: "You", status: "pending", urgency: "high" },
  { id: 3, title: "Upload monitoring report", study: "PROTO-2024-032", studyName: "Oncology Trial", category: "Monitoring", dueDate: "2026-04-20", assignee: "You", status: "in-progress", urgency: "medium" },
  { id: 4, title: "Budget revision approval", study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial", category: "Budget", dueDate: "2026-04-22", assignee: "Michael Torres", status: "pending", urgency: "low" },
  { id: 5, title: "Site activation checklist", study: "PROTO-2024-048", studyName: "Neurology Phase III", category: "General", dueDate: "2026-04-25", assignee: "You", status: "pending", urgency: "medium" },
];

const mockStudies = [
  { id: "001", protocol: "PROTO-2024-001", name: "Cardiac Intervention Trial", sponsor: "CardioMed Inc", phase: "Phase III", enrollment: 45, target: 60, openTasks: 8, overdueTasks: 2, connectedProducts: ["eBinders", "eConsent", "Budget"] },
  { id: "015", protocol: "PROTO-2024-015", name: "Diabetes Study Phase II", sponsor: "EndoResearch", phase: "Phase II", enrollment: 23, target: 40, openTasks: 5, overdueTasks: 0, connectedProducts: ["eBinders", "eConsent"] },
  { id: "032", protocol: "PROTO-2024-032", name: "Oncology Trial", sponsor: "OncoGenomics", phase: "Phase I", enrollment: 12, target: 30, openTasks: 12, overdueTasks: 1, connectedProducts: ["eBinders", "Monitoring"] },
  { id: "048", protocol: "PROTO-2024-048", name: "Neurology Phase III", sponsor: "NeuroAdvance", phase: "Phase III", enrollment: 67, target: 80, openTasks: 6, overdueTasks: 0, connectedProducts: ["eBinders", "eConsent", "Budget", "Monitoring"] },
];

const mockAnnouncements = [
  { id: 1, title: "IRB deadline reminder", body: "All Q2 submissions must be completed by April 30", priority: "urgent", requiresAck: true, time: "1 hour ago" },
  { id: 2, title: "System maintenance scheduled", body: "eBinders will be offline Saturday 8pm-11pm", priority: "informational", requiresAck: false, time: "3 hours ago" },
];

export function CRCHomepage() {
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterStudy, setFilterStudy] = useState<string[]>([]);

  const filteredTasks = mockTasks.filter((task) => {
    if (filterCategory.length > 0 && !filterCategory.includes(task.category.toLowerCase())) return false;
    if (filterStatus.length > 0 && !filterStatus.includes(task.status)) return false;
    if (filterStudy.length > 0 && !filterStudy.includes(task.study)) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue": return "bg-red-100 text-red-700 border-red-300";
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-300";
      case "completed": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, Sarah</h1>
          <p className="text-sm text-gray-600 mt-1">Clinical Research Coordinator</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Task Queue */}
      <div className="bg-white border border-gray-300 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold">My Tasks</h2>
          <div className="flex items-center gap-2">
            <MultiSelect
              options={[
                { value: "regulatory", label: "Regulatory" },
                { value: "consent", label: "Consent" },
                { value: "monitoring", label: "Monitoring" },
                { value: "budget", label: "Budget" },
                { value: "general", label: "General" },
              ]}
              selected={filterCategory}
              onChange={setFilterCategory}
              placeholder="All Categories"
              className="w-48"
            />
            <MultiSelect
              options={[
                { value: "pending", label: "Pending" },
                { value: "in-progress", label: "In Progress" },
                { value: "overdue", label: "Overdue" },
                { value: "completed", label: "Completed" },
              ]}
              selected={filterStatus}
              onChange={setFilterStatus}
              placeholder="All Status"
              className="w-44"
            />
            <MultiSelect
              options={mockStudies.map(s => ({ value: s.protocol, label: s.protocol }))}
              selected={filterStudy}
              onChange={setFilterStudy}
              placeholder="All Studies"
              className="w-48"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-mono">{task.study}</span>
                  <span>{task.studyName}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{task.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <div className="text-gray-500 text-xs">Due Date</div>
                  <div className={`font-medium ${task.status === 'overdue' ? 'text-red-600' : ''}`}>
                    {task.dueDate}
                  </div>
                </div>

                <div className="text-right min-w-[100px]">
                  <div className="text-gray-500 text-xs">Assignee</div>
                  <div className="font-medium">{task.assignee}</div>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-sm">
                    View
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Studies */}
      <div>
        <h2 className="font-semibold mb-4">My Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockStudies.map((study) => (
            <Link
              key={study.id}
              to={`/study/${study.id}`}
              className="bg-white border border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="mb-3">
                <div className="font-mono text-sm text-gray-500">{study.protocol}</div>
                <h3 className="font-semibold mt-1">{study.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span>{study.sponsor}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {study.phase}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Enrollment</span>
                  <span className="font-medium">
                    {study.enrollment} / {study.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(study.enrollment / study.target) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{study.openTasks} open</span>
                </div>
                {study.overdueTasks > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{study.overdueTasks} overdue</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Connected Products</div>
                <div className="flex flex-wrap gap-1">
                  {study.connectedProducts.map((product) => (
                    <span key={product} className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white border border-gray-300 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">Announcements</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 ${announcement.priority === 'urgent' ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {announcement.priority === 'urgent' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    <h3 className="font-medium">{announcement.title}</h3>
                    <span className="text-xs text-gray-500">{announcement.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{announcement.body}</p>
                </div>
                {announcement.requiresAck && (
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
