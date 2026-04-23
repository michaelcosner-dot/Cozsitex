import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { CRCHomepage } from "./components/CRCHomepage";
import { PIHomepage } from "./components/PIHomepage";
import { SiteDirectorHomepage } from "./components/SiteDirectorHomepage";
import { StudyWorkspace } from "./components/StudyWorkspace";
import { StudyCreationWizard } from "./components/StudyCreationWizard";
import { TasksPage } from "./components/TasksPage";
import { StudiesPage } from "./components/StudiesPage";
import { ReportsPage } from "./components/ReportsPage";
import { InboxPage } from "./components/InboxPage";
import { MonitoringPage } from "./components/MonitoringPage";
import { ProfilePage } from "./components/ProfilePage";
import { DocumentsPage } from "./components/DocumentsPage";
import { FeasibilityPage } from "./components/FeasibilityPage";
import { ConsentPage } from "./components/ConsentPage";
import { SiteManagementPage } from "./components/SiteManagementPage";
import { UsersPage } from "./components/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: CRCHomepage },
      { path: "crc", Component: CRCHomepage },
      { path: "pi", Component: PIHomepage },
      { path: "director", Component: SiteDirectorHomepage },
      { path: "inbox", Component: InboxPage },
      { path: "tasks", Component: TasksPage },
      { path: "studies", Component: StudiesPage },
      { path: "reports", Component: ReportsPage },
      { path: "monitoring", Component: MonitoringPage },
      { path: "documents", Component: DocumentsPage },
      { path: "consents", Component: ConsentPage },
      { path: "feasibility", Component: FeasibilityPage },
      { path: "profile", Component: ProfilePage },
      { path: "site-management", Component: SiteManagementPage },
      { path: "users", Component: UsersPage },
      { path: "study/:studyId", Component: StudyWorkspace },
      { path: "study/create", Component: StudyCreationWizard },
    ],
  },
]);
