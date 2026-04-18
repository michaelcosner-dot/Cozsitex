import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { CRCHomepage } from "./components/CRCHomepage";
import { PIHomepage } from "./components/PIHomepage";
import { SiteDirectorHomepage } from "./components/SiteDirectorHomepage";
import { StudyWorkspace } from "./components/StudyWorkspace";
import { StudyCreationWizard } from "./components/StudyCreationWizard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: CRCHomepage },
      { path: "crc", Component: CRCHomepage },
      { path: "pi", Component: PIHomepage },
      { path: "director", Component: SiteDirectorHomepage },
      { path: "study/:studyId", Component: StudyWorkspace },
      { path: "study/create", Component: StudyCreationWizard },
    ],
  },
]);
