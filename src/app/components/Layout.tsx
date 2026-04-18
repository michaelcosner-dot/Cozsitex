import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { Search, Bell, User, Menu, ChevronLeft, ChevronRight, LayoutDashboard, CheckSquare, FileText, BarChart3, Plug, ChevronDown } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { id: "studies", label: "Studies", icon: LayoutDashboard, path: "/" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { id: "reports", label: "Reports", icon: FileText, path: "/reports" },
  { id: "insights", label: "Insights", icon: BarChart3, path: "/insights" },
  { id: "integrations", label: "Integrations", icon: Plug, path: "/integrations" },
];

const VIEW_OPTIONS = [
  { value: "/crc", label: "CRC View" },
  { value: "/pi", label: "PI View" },
  { value: "/director", label: "Director View" },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount] = useState(5);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  const currentView = VIEW_OPTIONS.find(v => location.pathname === v.value) || VIEW_OPTIONS[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside
        className={`bg-white border-r border-gray-300 sticky top-0 h-screen transition-all duration-300 ${
          sidebarExpanded ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarExpanded && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded" />
                <span className="font-semibold text-lg">SiteX</span>
              </div>
            )}
            {!sidebarExpanded && (
              <div className="w-8 h-8 bg-blue-600 rounded mx-auto" />
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={!sidebarExpanded ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarExpanded && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Toggle Button */}
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {sidebarExpanded ? (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Collapse</span>
                </>
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* View Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowViewDropdown(!showViewDropdown)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 min-w-[140px]"
              >
                <span className="font-medium">{currentView.label}</span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>

              {showViewDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowViewDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                    {VIEW_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          navigate(option.value);
                          setShowViewDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          currentView.value === option.value ? "bg-blue-50 text-blue-600" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search studies, tasks, documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 top-12 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Notifications</h3>
                          <button className="text-sm text-blue-600">Mark all read</button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {[
                          { title: "Task overdue", study: "PROTO-2024-001", time: "2 min ago", unread: true },
                          { title: "Document signed", study: "PROTO-2024-015", time: "1 hour ago", unread: true },
                          { title: "New task assigned", study: "PROTO-2024-032", time: "3 hours ago", unread: false },
                        ].map((notif, i) => (
                          <div
                            key={i}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              notif.unread ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {notif.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{notif.title}</p>
                                <p className="text-xs text-gray-500">{notif.study}</p>
                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button className="text-sm text-blue-600">View all notifications</button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Profile */}
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
