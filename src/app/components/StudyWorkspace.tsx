import { useParams, Link } from "react-router";
import { ArrowLeft, Edit, Plus, ExternalLink, FileText, Users, DollarSign, ClipboardCheck, Link as LinkIcon, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { MultiSelect } from "./MultiSelect";

const mockStudyData: Record<string, any> = {
  "001": {
    protocol: "PROTO-2024-001",
    title: "Cardiac Intervention Trial",
    sponsor: "CardioMed Inc",
    pi: "Dr. Martinez",
    phase: "Phase III",
    status: "Active",
    therapeuticArea: "Cardiology",
    irb: "IRB-2024-0045",
    location: "Main Campus",
    department: "Cardiology",
    enrollment: 45,
    target: 60,
    irbApprovalDate: "2024-01-15",
    siteActivationDate: "2024-02-01",
    estimatedCompletion: "2026-12-31",
  },
};

const mockTasks = [
  { id: 1, title: "Complete IRB submission", category: "Regulatory", assignee: "Sarah Chen", dueDate: "2026-04-15", status: "overdue" },
  { id: 2, title: "Budget revision approval", category: "Budget", assignee: "Michael Torres", dueDate: "2026-04-22", status: "pending" },
  { id: 3, title: "Review consent forms", category: "Consent", assignee: "Sarah Chen", dueDate: "2026-04-18", status: "in-progress" },
  { id: 4, title: "Protocol deviation report", category: "Regulatory", assignee: "Lisa Wong", dueDate: "2026-04-20", status: "pending" },
  { id: 5, title: "Subject screening log update", category: "General", assignee: "Sarah Chen", dueDate: "2026-04-25", status: "pending" },
];

const mockConnectedProducts = [
  { name: "eBinders", connected: true, metric: "156 documents", metricLabel: "Total Documents", link: "#" },
  { name: "eConsent", connected: true, metric: "45 consented", metricLabel: "Subjects Consented", link: "#" },
  { name: "Budget", connected: true, metric: "$125,000 remaining", metricLabel: "Budget Remaining", link: "#" },
  { name: "Monitoring", connected: false, metric: null, metricLabel: null, link: null },
];

export function StudyWorkspace() {
  const { studyId } = useParams();
  const study = mockStudyData[studyId || "001"] || mockStudyData["001"];
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterAssignee, setFilterAssignee] = useState<string[]>([]);

  const filteredTasks = mockTasks.filter((task) => {
    if (filterCategory.length > 0 && !filterCategory.includes(task.category.toLowerCase())) return false;
    if (filterStatus.length > 0 && !filterStatus.includes(task.status)) return false;
    if (filterAssignee.length > 0 && !filterAssignee.includes(task.assignee)) return false;
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

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Back Navigation */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Study Profile Header */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold">{study.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${
                study.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
              }`}>
                {study.status}
              </span>
            </div>
            <div className="font-mono text-sm text-gray-600">{study.protocol}</div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Study
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div>
            <div className="text-xs text-gray-500 mb-1">Sponsor</div>
            <div className="font-medium">{study.sponsor}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Principal Investigator</div>
            <div className="font-medium">{study.pi}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Phase</div>
            <div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                {study.phase}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Therapeutic Area</div>
            <div className="font-medium">{study.therapeuticArea}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">IRB of Record</div>
            <div className="font-medium font-mono text-sm">{study.irb}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Location</div>
            <div className="font-medium">{study.location}</div>
            <div className="text-xs text-gray-500">{study.department}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-500 mb-1">IRB Approval Date</div>
            <div className="font-medium">{study.irbApprovalDate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Site Activation Date</div>
            <div className="font-medium">{study.siteActivationDate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Est. Completion</div>
            <div className="font-medium">{study.estimatedCompletion}</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">Enrollment Progress</div>
            <div className="font-semibold">
              {study.enrollment} / {study.target} subjects
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${(study.enrollment / study.target) * 100}%` }}
            >
              <span className="text-xs text-white font-medium">
                {Math.round((study.enrollment / study.target) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Task Board */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-300 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold">Study Tasks</h2>
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
                  className="w-44"
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
                  className="w-40"
                />
                <MultiSelect
                  options={[
                    { value: "Sarah Chen", label: "Sarah Chen" },
                    { value: "Michael Torres", label: "Michael Torres" },
                    { value: "Lisa Wong", label: "Lisa Wong" },
                  ]}
                  selected={filterAssignee}
                  onChange={setFilterAssignee}
                  placeholder="All Assignees"
                  className="w-44"
                />
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{task.category}</span>
                        <span className="text-gray-600">Due: {task.dueDate}</span>
                        <span className="text-gray-600">Assigned to: {task.assignee}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-sm">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connected Products Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-300 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold">Connected Products</h2>
            </div>
            <div className="p-4 space-y-4">
              {mockConnectedProducts.map((product) => (
                <div
                  key={product.name}
                  className={`border rounded-lg p-4 ${
                    product.connected ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {product.name === "eBinders" && <FileText className="w-5 h-5 text-blue-600" />}
                      {product.name === "eConsent" && <Users className="w-5 h-5 text-purple-600" />}
                      {product.name === "Budget" && <DollarSign className="w-5 h-5 text-green-600" />}
                      {product.name === "Monitoring" && <ClipboardCheck className="w-5 h-5 text-orange-600" />}
                      <h3 className="font-semibold">{product.name}</h3>
                    </div>
                    {product.connected ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {product.connected ? (
                    <>
                      {product.metric && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-600 mb-0.5">{product.metricLabel}</div>
                          <div className="font-semibold text-lg">{product.metric}</div>
                        </div>
                      )}
                      <button className="w-full px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                        Open {product.name}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
                      <LinkIcon className="w-4 h-4" />
                      Link {product.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
