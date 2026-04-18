import { Link } from "react-router";
import { FileText, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

const mockApprovalQueue = [
  { id: 1, type: "Protocol Amendment", document: "Amendment 3 - Inclusion Criteria Update", study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial", requestor: "Sarah Chen", deadline: "2026-04-19", daysRemaining: 1 },
  { id: 2, type: "Informed Consent", document: "ICF Version 2.1 - Spanish Translation", study: "PROTO-2024-015", studyName: "Diabetes Study Phase II", requestor: "Michael Torres", deadline: "2026-04-20", daysRemaining: 2 },
  { id: 3, type: "SAE Report", document: "Serious Adverse Event Report - Subject 045", study: "PROTO-2024-032", studyName: "Oncology Trial", requestor: "Lisa Wong", deadline: "2026-04-18", daysRemaining: 0 },
  { id: 4, type: "Annual Review", document: "Continuing Review Application 2026", study: "PROTO-2024-001", studyName: "Cardiac Intervention Trial", requestor: "Sarah Chen", deadline: "2026-04-25", daysRemaining: 7 },
];

const mockStudies = [
  { id: "001", protocol: "PROTO-2024-001", name: "Cardiac Intervention Trial", enrollment: 45, target: 60, status: "active" },
  { id: "015", protocol: "PROTO-2024-015", name: "Diabetes Study Phase II", enrollment: 23, target: 40, status: "active" },
  { id: "032", protocol: "PROTO-2024-032", name: "Oncology Trial", enrollment: 12, target: 30, status: "active" },
];

const mockAnnouncements = [
  { id: 1, title: "IRB deadline reminder", body: "All Q2 submissions must be completed by April 30", time: "1 hour ago" },
];

export function PIHomepage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Welcome, Dr. Martinez</h1>
        <p className="text-sm text-gray-600 mt-1">Principal Investigator</p>
      </div>

      {/* Action Queue */}
      <div className="bg-white border border-gray-300 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Items Requiring Your Signature</h2>
            <p className="text-sm text-gray-600 mt-0.5">{mockApprovalQueue.length} items pending</p>
          </div>
        </div>

        {mockApprovalQueue.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">All caught up! No items require your attention.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {mockApprovalQueue.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {item.type}
                          </span>
                          {item.daysRemaining === 0 && (
                            <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                              <AlertCircle className="w-3 h-3" />
                              Due today
                            </span>
                          )}
                          {item.daysRemaining === 1 && (
                            <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
                              <AlertCircle className="w-3 h-3" />
                              Due tomorrow
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">{item.document}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Study</div>
                        <div className="font-mono text-xs text-gray-600">{item.study}</div>
                        <div className="font-medium">{item.studyName}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Requested by</div>
                        <div className="font-medium">{item.requestor}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">Deadline</div>
                        <div className="font-medium">{item.deadline}</div>
                        <div className="text-xs text-gray-600">{item.daysRemaining} days remaining</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Review & Sign
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Studies Summary */}
      <div className="bg-white border border-gray-300 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">My Studies</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockStudies.map((study) => (
            <Link
              key={study.id}
              to={`/study/${study.id}`}
              className="p-4 hover:bg-gray-50 flex items-center justify-between group"
            >
              <div className="flex-1">
                <div className="font-mono text-sm text-gray-500">{study.protocol}</div>
                <h3 className="font-semibold mt-0.5 group-hover:text-blue-600">{study.name}</h3>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-gray-500 text-xs mb-0.5">Enrollment</div>
                  <div className="font-semibold">
                    {study.enrollment} / {study.target}
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${(study.enrollment / study.target) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {study.status}
                  </span>
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
            <div key={announcement.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <span className="text-xs text-gray-500">{announcement.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{announcement.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
