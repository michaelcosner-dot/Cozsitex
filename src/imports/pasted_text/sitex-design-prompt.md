## SiteX Design Prompt

---

### Product Overview

SiteX is the unifying operational layer for a clinical trial operations platform used by research sites. It connects multiple point solutions (regulatory document management, electronic consent, monitoring, budgeting/contracting) through a golden study record and provides task management, notifications, announcements, and study-level visibility that don't exist today. SiteX is the front door. Users start their day here, understand what needs attention, and route into specialized tools to execute work.

The platform serves three primary user personas across research sites ranging from small single-location operations to large multi-instance organizations managing thousands of studies across departments, locations, and therapeutic areas.

---

### User Personas

**Clinical Research Coordinator (CRC):** The power user. Manages day-to-day operations across 5-30+ assigned studies. Spends the most time in the platform. Needs to quickly understand what's due, what's overdue, and where to go to complete work. Currently wastes significant time navigating disjointed folder structures and switching between tools. Values speed, clarity, and the ability to stay on top of a high-volume workload without things slipping through the cracks.

**Principal Investigator (PI):** An episodic, low-patience user. Logs in primarily to sign documents, review items, and occasionally check study status. Tolerance for complexity is very low. Needs to see exactly what's waiting on them and clear their queue with minimal clicks. If the interface requires more than a couple of interactions to reach an actionable item, they'll delegate the task to a CRC or disengage entirely.

**Site Director:** The portfolio manager. Responsible for operational oversight across all studies at a site or across multiple locations/departments. Needs to understand which studies are healthy, which are at risk, where workload is concentrated, and whether communication is reaching staff. Makes resourcing and prioritization decisions. Values aggregate visibility, filtering, and the ability to drill down from a portfolio view into a specific study.

---

### Core Concepts

**The Golden Study Record:** SiteX is the authoritative source for study data. Studies are created and mastered here through a creation wizard, and every point solution links back to the SiteX study record. In eBinders (the regulatory document product), this link is established by associating a binder/folder with a SiteX study profile, which flags that folder as a study. Other point solutions link through their native study objects. The study record holds: protocol number, title, sponsor, therapeutic area, phase, PI assignment, study status, enrollment targets, IRB of record, key dates, and location/department. The study workspace in SiteX is the unified view of a study's operational state across all connected products.

**The Task Engine:** SiteX owns the task system. Tasks are the primary unit of work and the main reason users open the platform each day. Tasks carry: study association, assignee (with optional delegates), due date, urgency, source (manual, system-generated, or synced from a point solution), category (regulatory, consent, monitoring, budget, general), status lifecycle (pending, in progress, blocked, in review, complete), and a deep link to the relevant point solution screen where the work gets done. Tasks sync bidirectionally with eBinders via API. Other point solutions will integrate over time. Tasks can also be created manually, which is the baseline functionality at launch.

**Notifications:** System-generated, personal, event-driven alerts. Triggered by task lifecycle events (assigned, due soon, overdue, completed, reassigned) and study-level events. Delivered through an in-app notification center (bell icon with badge count and dropdown panel) and configurable email digests. Users control preferences for channel and frequency. Notification states are tracked (unread/read, action taken/not taken).

**Announcements:** Human-authored organizational and study-level communications. Created by site directors or administrators with a title, rich text body, priority level (informational, action required, urgent), audience targeting (by study, role, location/department, or site-wide), optional attachment, and optional acknowledgment requirement. Displayed in a dedicated homepage feed, scoped to the logged-in user's relevant studies and roles. Tracking includes: delivery audience, view count, acknowledgment status, with the ability to resend to non-acknowledgers. Announcements have optional expiration dates and auto-archive when expired.

---

### Pages to Design

**1. CRC Homepage**

The primary view is a personal task queue, sorted by urgency, with overdue items surfaced to the top. Tasks display study name, category, due date, assignee, status, and provide a clear path to the relevant tool (deep link or in-app action). The queue should be filterable by study, category, and status. Quick actions for marking complete, reassigning, and snoozing should be accessible without opening a detail view. Include a quick-add affordance for creating new tasks with study and assignee as required fields.

Below the task queue, a "My Studies" section shows cards for each assigned study. Each card displays: study name and protocol number, sponsor and phase as secondary metadata, enrollment count vs target, a task summary (open count, overdue count), and a connected products indicator showing which point solutions are linked to this study. Clicking a card navigates to the study workspace.

An announcement feed appears as a secondary section, showing announcements scoped to the user's assigned studies and role. Urgent or action-required announcements should be visually prominent. Acknowledgment-required announcements should have an inline acknowledge action.

The persistent header includes global search (spanning studies, tasks, and documents across all connected products), the notification bell with badge count, and user profile/settings access.

**2. PI Homepage**

A simplified, action-oriented view. The primary section is a signature and approval queue showing only items requiring PI action. Each item should display enough context to make a decision (document name, study, requestor, deadline) and offer the most direct possible path to completing the action, ideally deep-linking to the exact signature or review screen in the relevant point solution.

Below the action queue, a compact study summary showing only studies where this PI is assigned, with enrollment figures and a simple status indicator. No connected products detail. Minimal navigation required.

Announcements filtered to the PI's assigned studies. Notification bell in the header.

The design priority for this page is speed and minimal cognitive load. A PI should be able to log in, scan what needs their attention, and clear their queue in a single session.

**3. Site Director Homepage**

The primary view is the study portfolio. A table or configurable grid of all mastered studies with columns for: protocol number, study title, sponsor, PI, phase, status, therapeutic area, location/department, enrollment progress (current vs target, expressed as a count and a visual indicator), task health (open and overdue task counts), and connected product status (which tools are linked). The table must be sortable, filterable, and searchable across all dimensions. For large organizations, filtering by location, department, and therapeutic area is critical.

Above the table, summary metric cards showing: total active studies, aggregate overdue tasks, studies in startup with incomplete product linkage, and enrollment performance across the portfolio.

An announcement management section where the site director can author new announcements and view reach metrics on recent announcements (sent to X, viewed by Y, acknowledged by Z, with the ability to resend or nudge).

The notification bell and global search in the header.

**4. Study Workspace**

Accessed by clicking into any study from any homepage. This is the unified operational view of a single study.

At the top, the study profile header showing all key metadata from the golden record: protocol number, title, sponsor, PI, phase, status, therapeutic area, IRB of record, key dates, enrollment progress. Editable by authorized users.

Below the header, two primary sections. First, the study task board showing all tasks for this study across all categories and assignees, filterable by status, category, and assignee. This is the complete operational picture of what needs to happen for this study. Second, the connected products panel showing a card or row for each point solution with: link status (connected or not set up), a summary metric where available (document count, subjects consented, budget remaining), and a direct deep link into that product's study-specific view. The depth of information in each product card will grow over time as integrations mature. For MVP, showing link status and providing routing is sufficient.

**5. Study Creation Wizard**

A step-based flow for mastering a new study in SiteX. Should feel fast and lightweight, completable in under 5 minutes. Required fields: protocol number, study title, sponsor, therapeutic area, phase, PI assignment, target enrollment, IRB of record, study status, and location/department. Optional fields for key dates (IRB approval, site activation, estimated enrollment completion) and CRO. The final step should prompt the user to link the study to point solutions (particularly eBinders binder selection) or allow them to skip and link later. Confirmation screen summarizes the created record and offers next steps (create onboarding tasks, navigate to the study workspace, or return to the homepage).

Also design a "Link to Study"