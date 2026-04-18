import { Link } from "react-router";
import { Plus, Filter, Download, TrendingUp, AlertTriangle, Users, Briefcase, LinkIcon, ExternalLink } from "lucide-react";
import { useState } from "react";
import { MultiSelect } from "./MultiSelect";

const mockPortfolio = [
  { id: "001", protocol: "PROTO-2024-001", title: "Cardiac Intervention Trial", sponsor: "CardioMed Inc", pi: "Dr. Martinez", phase: "Phase III", status: "Active", therapeuticArea: "Cardiology", location: "Main Campus", department: "Cardiology", enrollment: 45, target: 60, openTasks: 8, overdueTasks: 2, connectedProducts: ["eBinders", "eConsent", "Budget"] },
  { id: "015", protocol: "PROTO-2024-015", title: "Diabetes Study Phase II", sponsor: "EndoResearch", pi: "Dr. Chen", phase: "Phase II", status: "Active", therapeuticArea: "Endocrinology", location: "Main Campus", department: "Endocrinology", enrollment: 23, target: 40, openTasks: 5, overdueTasks: 0, connectedProducts: ["eBinders", "eConsent"] },
  { id: "032", protocol: "PROTO-2024-032", title: "Oncology Trial", sponsor: "OncoGenomics", pi: "Dr. Martinez", phase: "Phase I", status: "Active", therapeuticArea: "Oncology", location: "North Campus", department: "Oncology", enrollment: 12, target: 30, openTasks: 12, overdueTasks: 1, connectedProducts: ["eBinders", "Monitoring"] },
  { id: "048", protocol: "PROTO-2024-048", title: "Neurology Phase III", sponsor: "NeuroAdvance", pi: "Dr. Patel", phase: "Phase III", status: "Active", therapeuticArea: "Neurology", location: "Main Campus", department: "Neurology", enrollment: 67, target: 80, openTasks: 6, overdueTasks: 0, connectedProducts: ["eBinders", "eConsent", "Budget", "Monitoring"] },
  { id: "053", protocol: "PROTO-2024-053", title: "Pediatric Asthma Study", sponsor: "RespiraTech", pi: "Dr. Kim", phase: "Phase II", status: "Startup", therapeuticArea: "Pulmonology", location: "Main Campus", department: "Pediatrics", enrollment: 0, target: 50, openTasks: 15, overdueTasks: 3, connectedProducts: ["eBinders"] },
];

const mockRecentAnnouncements = [
  { id: 1, title: "IRB deadline reminder", audience: "All staff", sent: 142, viewed: 98, acknowledged: 67, date: "2026-04-17" },
  { id: 2, title: "System maintenance scheduled", audience: "All staff", sent: 142, viewed: 125, acknowledged: 0, date: "2026-04-16" },
  { id: 3, title: "New eConsent workflow", audience: "CRCs", sent: 45, viewed: 38, acknowledged: 28, date: "2026-04-15" },
];

export function SiteDirectorHomepage() {
  const [filterLocation, setFilterLocation] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPhase, setFilterPhase] = useState<string[]>([]);
  const [filterTherapeuticArea, setFilterTherapeuticArea] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("protocol");

  const filteredStudies = mockPortfolio.filter((study) => {
    if (filterLocation.length > 0 && !filterLocation.includes(study.location)) return false;
    if (filterDepartment.length > 0 && !filterDepartment.includes(study.department)) return false;
    if (filterStatus.length > 0 && !filterStatus.includes(study.status)) return false;
    if (filterPhase.length > 0 && !filterPhase.includes(study.phase)) return false;
    if (filterTherapeuticArea.length > 0 && !filterTherapeuticArea.includes(study.therapeuticArea)) return false;
    return true;
  });

  const totalActiveStudies = mockPortfolio.filter(s => s.status === "Active").length;
  const totalOverdueTasks = mockPortfolio.reduce((sum, s) => sum + s.overdueTasks, 0);
  const studiesInStartup = mockPortfolio.filter(s => s.status === "Startup").length;
  const totalEnrollment = mockPortfolio.reduce((sum, s) => sum + s.enrollment, 0);
  const totalTarget = mockPortfolio.reduce((sum, s) => sum + s.target, 0);

  return (
    <div className="max-w-[1800px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Site Portfolio</h1>
          <p className="text-sm text-gray-600 mt-1">Complete operational overview</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            to="/study/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Study
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-semibold">{totalActiveStudies}</div>
          <div className="text-sm text-gray-600">Active Studies</div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-semibold">{totalOverdueTasks}</div>
          <div className="text-sm text-gray-600">Overdue Tasks</div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <LinkIcon className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-semibold">{studiesInStartup}</div>
          <div className="text-sm text-gray-600">Studies in Startup</div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-semibold">
            {totalEnrollment} / {totalTarget}
          </div>
          <div className="text-sm text-gray-600">Portfolio Enrollment</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${(totalEnrollment / totalTarget) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white border border-gray-300 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Study Portfolio</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <MultiSelect
                options={[
                  { value: "Main Campus", label: "Main Campus" },
                  { value: "North Campus", label: "North Campus" },
                  { value: "South Campus", label: "South Campus" },
                ]}
                selected={filterLocation}
                onChange={setFilterLocation}
                placeholder="All Locations"
                className="w-44"
              />
              <MultiSelect
                options={[
                  { value: "Cardiology", label: "Cardiology" },
                  { value: "Oncology", label: "Oncology" },
                  { value: "Neurology", label: "Neurology" },
                  { value: "Endocrinology", label: "Endocrinology" },
                  { value: "Pediatrics", label: "Pediatrics" },
                ]}
                selected={filterDepartment}
                onChange={setFilterDepartment}
                placeholder="All Departments"
                className="w-48"
              />
              <MultiSelect
                options={[
                  { value: "Phase I", label: "Phase I" },
                  { value: "Phase II", label: "Phase II" },
                  { value: "Phase III", label: "Phase III" },
                  { value: "Phase IV", label: "Phase IV" },
                ]}
                selected={filterPhase}
                onChange={setFilterPhase}
                placeholder="All Phases"
                className="w-40"
              />
              <MultiSelect
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Startup", label: "Startup" },
                ]}
                selected={filterStatus}
                onChange={setFilterStatus}
                placeholder="All Status"
                className="w-40"
              />
              <MultiSelect
                options={[
                  { value: "Cardiology", label: "Cardiology" },
                  { value: "Oncology", label: "Oncology" },
                  { value: "Neurology", label: "Neurology" },
                  { value: "Endocrinology", label: "Endocrinology" },
                  { value: "Pulmonology", label: "Pulmonology" },
                ]}
                selected={filterTherapeuticArea}
                onChange={setFilterTherapeuticArea}
                placeholder="All Therapeutic Areas"
                className="w-56"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Protocol</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Study Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Sponsor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">PI</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Phase</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Enrollment</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tasks</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudies.map((study) => (
                <tr key={study.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/study/${study.id}`} className="font-mono text-blue-600 hover:underline">
                      {study.protocol}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{study.title}</div>
                    <div className="text-xs text-gray-500">{study.therapeuticArea}</div>
                  </td>
                  <td className="px-4 py-3">{study.sponsor}</td>
                  <td className="px-4 py-3">{study.pi}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {study.phase}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        study.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {study.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>{study.location}</div>
                    <div className="text-xs text-gray-500">{study.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {study.enrollment} / {study.target}
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${(study.enrollment / study.target) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{study.openTasks}</span>
                      {study.overdueTasks > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                          {study.overdueTasks} overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {study.connectedProducts.map((product) => (
                        <span key={product} className="w-2 h-2 bg-green-500 rounded-full" title={product} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcement Management */}
      <div className="bg-white border border-gray-300 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold">Recent Announcements</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Audience</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Sent To</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Viewed</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Acknowledged</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockRecentAnnouncements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{announcement.title}</td>
                  <td className="px-4 py-3">{announcement.audience}</td>
                  <td className="px-4 py-3">{announcement.sent}</td>
                  <td className="px-4 py-3">
                    <div>
                      {announcement.viewed} ({Math.round((announcement.viewed / announcement.sent) * 100)}%)
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${(announcement.viewed / announcement.sent) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {announcement.acknowledged > 0 ? (
                      <>
                        <div>
                          {announcement.acknowledged} ({Math.round((announcement.acknowledged / announcement.sent) * 100)}%)
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${(announcement.acknowledged / announcement.sent) * 100}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{announcement.date}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline text-sm">Resend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
