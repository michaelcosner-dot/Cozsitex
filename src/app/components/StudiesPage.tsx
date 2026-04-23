import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search, Plus, X, List, LayoutGrid, FileWarning, Zap,
  ChevronDown, ChevronUp, ChevronRight, Building2, ExternalLink, Users,
  MapPin, Settings, ArrowUpDown,
} from "lucide-react";

const PRIMARY = "#5C4EE5";

// ── Types ─────────────────────────────────────────────────────────────────
type StudyStatus = "Startup" | "Enrolling" | "Follow-up" | "Closed";
type Phase = "Phase I" | "Phase II" | "Phase III" | "Phase IV" | "N/A";

interface SiteInstance {
  site: string;
  pi: string;
  crc: string;
  status: StudyStatus;
  enrollmentCurrent: number;
  enrollmentTarget: number;
  ebindersUrl: string;
  activationDate: string;
  flags: { expiredDocs: number; urgentActions: number };
}

interface Study {
  id: string;
  nickname: string;
  protocolId: string;
  studyType: string;
  phase: Phase;
  status: StudyStatus;
  sponsor: string;
  sponsorType: string;
  cro: string;
  funderType: string;
  therapeuticArea: string;
  condition: string;
  deviceDrug: string;
  nct: string;
  rec: string;
  eudract: string;
  pi: string;
  department: string;
  isMultiSite: boolean;
  siteInstances: SiteInstance[];
  enrollmentTarget: number;
  enrollmentCurrent: number;
  activationDate: string;
  dateCreated: string;
  flags: { expiredDocs: number; urgentActions: number };
}

interface StaffRow { name: string; role: string; }

interface StudyForm {
  nickname: string; protocolId: string; studyType: string; phase: string; status: string;
  sponsor: string; sponsorType: string; cro: string; funderType: string;
  therapeuticArea: string; condition: string; deviceDrug: string;
  nct: string; rec: string; eudract: string;
  department: string; irb: string;
  isMultiSite: boolean; sites: string[];
  studyStructure: string; studyRoles: string[]; taskTemplates: string[];
  prefAutoAssign: boolean; prefRequirePI: boolean; prefEBindersSync: boolean; prefEmailNotif: boolean;
  linkEBinders: boolean; linkEConsent: boolean; linkBudget: boolean; linkMonitoring: boolean;
  pi: string; crc: string; additionalStaff: StaffRow[];
  enrollmentTarget: string;
  activationDate: string;
  milestones: Record<string, string>;
}

const EMPTY_FORM: StudyForm = {
  nickname: "", protocolId: "", studyType: "", phase: "", status: "Startup",
  sponsor: "", sponsorType: "", cro: "", funderType: "", therapeuticArea: "",
  condition: "", deviceDrug: "", nct: "", rec: "", eudract: "",
  department: "", irb: "", isMultiSite: false, sites: [],
  studyStructure: "", studyRoles: [], taskTemplates: [],
  prefAutoAssign: true, prefRequirePI: false, prefEBindersSync: true, prefEmailNotif: true,
  linkEBinders: false, linkEConsent: false, linkBudget: false, linkMonitoring: false,
  pi: "", crc: "", additionalStaff: [],
  enrollmentTarget: "", activationDate: "",
  milestones: {},
};

// ── Options ───────────────────────────────────────────────────────────────
const STUDY_TYPES   = ["Interventional", "Observational", "Expanded Access", "Registry"];
const PHASES        = ["Phase I", "Phase II", "Phase III", "Phase IV", "N/A"];
const STATUSES      = ["Startup", "Enrolling", "Follow-up", "Closed"];
const SPONSOR_TYPES = ["Industry", "Academic", "Government", "Non-profit", "Cooperative Group"];
const FUNDER_TYPES  = ["Industry Funded", "NIH/Federal", "Foundation", "Institutional", "Mixed"];
const THER_AREAS    = ["Cardiology", "Oncology", "Neurology", "Endocrinology", "Pulmonology", "Rheumatology", "Infectious Disease", "Psychiatry", "Dermatology", "Other"];
const PI_OPTIONS    = ["Dr. Martinez", "Dr. Chen", "Dr. Patel", "Dr. Kim", "Dr. Okafor", "Dr. Singh"];
const DEPT_OPTIONS  = ["Cardiology", "Oncology", "Neurology", "Endocrinology", "Pulmonology", "General Medicine", "Rheumatology"];
const SITE_OPTIONS  = ["Northgate CRC", "Lakeside Medical Center", "Downtown Research Group", "Westfield University Hospital", "Harbor View Clinical", "Summit Health Partners", "Riverside Research Institute", "Clearwater Medical Group"];
const CRC_OPTIONS   = ["Sarah Chen", "Michael Torres", "Amy Park", "James Liu", "Diana Ross"];
const STAFF_ROLES   = ["Co-Investigator", "Study Nurse", "Data Manager", "Pharmacist", "Regulatory Specialist", "Biostatistician", "Research Assistant", "Sub-Investigator"];
const STUDY_STRUCTURES = ["Randomized Controlled Trial", "Open Label", "Double-Blind", "Single-Blind", "Crossover", "Parallel Group", "Observational", "Registry"];
const STUDY_ROLE_OPTIONS = ["CRC Lead", "Co-Investigator", "Study Nurse", "Data Manager", "Pharmacist", "Regulatory Specialist", "Biostatistician", "Research Assistant"];
const TASK_TEMPLATES = ["Startup Checklist", "Regulatory Package", "Consent Workflow", "Monitoring Visit Prep", "SAE Reporting", "Study Closeout"];
const MILESTONES = [
  { id: "protocol_received",      label: "Protocol Received" },
  { id: "irb_submission",         label: "IRB Submission" },
  { id: "irb_approval",           label: "IRB Approval / First Approval" },
  { id: "sqv",                    label: "Site Qualification Visit (SQV)" },
  { id: "siv",                    label: "Site Initiation Visit (SIV)" },
  { id: "site_activation",        label: "Site Activation" },
  { id: "first_patient_screened", label: "First Patient Screened" },
  { id: "fpe",                    label: "First Patient Enrolled (FPE)" },
  { id: "enrollment_complete",    label: "Enrollment Complete (LPI)" },
  { id: "lplv",                   label: "Last Patient Last Visit (LPLV)" },
  { id: "database_lock",          label: "Database Lock" },
  { id: "study_closure",          label: "Study Closure / Close-out Visit" },
  { id: "final_report",           label: "Final Clinical Study Report" },
];

// ── Mock data ─────────────────────────────────────────────────────────────
const MOCK_STUDIES: Study[] = [
  {
    id: "001", nickname: "JAVAHEART", protocolId: "AFIBSTUDY1",
    studyType: "Interventional", phase: "Phase III", status: "Enrolling",
    sponsor: "CardioMed Inc.", sponsorType: "Industry", cro: "ICON plc",
    funderType: "Industry Funded", therapeuticArea: "Cardiology",
    condition: "Atrial Fibrillation", deviceDrug: "JVH-304",
    nct: "NCT04823901", rec: "21/SC/0123", eudract: "2021-001234-56",
    pi: "Dr. Martinez", department: "Cardiology",
    isMultiSite: false, siteInstances: [],
    enrollmentTarget: 60, enrollmentCurrent: 45, activationDate: "2024-03-01", dateCreated: "2024-01-15",
    flags: { expiredDocs: 1, urgentActions: 2 },
  },
  {
    id: "015", nickname: "DIABSOLVE", protocolId: "PROTO-2024-015",
    studyType: "Interventional", phase: "Phase II", status: "Follow-up",
    sponsor: "EndoResearch", sponsorType: "Industry", cro: "",
    funderType: "Industry Funded", therapeuticArea: "Endocrinology",
    condition: "Type 2 Diabetes", deviceDrug: "DXL-101",
    nct: "NCT04719802", rec: "", eudract: "",
    pi: "Dr. Chen", department: "Endocrinology",
    isMultiSite: false, siteInstances: [],
    enrollmentTarget: 40, enrollmentCurrent: 40, activationDate: "2023-09-15", dateCreated: "2023-07-10",
    flags: { expiredDocs: 0, urgentActions: 0 },
  },
  {
    id: "032", nickname: "ONCOVAULT", protocolId: "PROTO-2024-032",
    studyType: "Interventional", phase: "Phase I", status: "Enrolling",
    sponsor: "OncoGenomics", sponsorType: "Industry", cro: "Covance",
    funderType: "Industry Funded", therapeuticArea: "Oncology",
    condition: "Non-Small Cell Lung Cancer", deviceDrug: "OGX-228",
    nct: "NCT05112044", rec: "22/LO/0456", eudract: "2022-003421-11",
    pi: "Dr. Martinez", department: "Oncology",
    isMultiSite: true,
    siteInstances: [
      { site: "Northgate CRC",             pi: "Dr. Martinez", crc: "Sarah Chen",    status: "Enrolling",  enrollmentCurrent: 6,  enrollmentTarget: 12, ebindersUrl: "ngcrc.ebinders.io",     activationDate: "2024-01-10", flags: { expiredDocs: 2, urgentActions: 1 } },
      { site: "Lakeside Medical Center",   pi: "Dr. Patel",    crc: "Amy Park",      status: "Enrolling",  enrollmentCurrent: 4,  enrollmentTarget: 10, ebindersUrl: "lakeside.ebinders.io",  activationDate: "2024-02-05", flags: { expiredDocs: 0, urgentActions: 0 } },
      { site: "Downtown Research Group",   pi: "Dr. Kim",      crc: "James Liu",     status: "Startup",    enrollmentCurrent: 0,  enrollmentTarget: 8,  ebindersUrl: "downtown-rg.ebinders.io", activationDate: "", flags: { expiredDocs: 0, urgentActions: 1 } },
    ],
    enrollmentTarget: 30, enrollmentCurrent: 12, activationDate: "2024-01-10", dateCreated: "2023-11-20",
    flags: { expiredDocs: 2, urgentActions: 1 },
  },
  {
    id: "048", nickname: "NEUROPILOT", protocolId: "PROTO-2024-048",
    studyType: "Interventional", phase: "Phase III", status: "Enrolling",
    sponsor: "NeuroAdvance", sponsorType: "Industry", cro: "PRA Health",
    funderType: "Industry Funded", therapeuticArea: "Neurology",
    condition: "Parkinson's Disease", deviceDrug: "NAV-551",
    nct: "NCT04988321", rec: "", eudract: "2023-005678-33",
    pi: "Dr. Patel", department: "Neurology",
    isMultiSite: true,
    siteInstances: [
      { site: "Northgate CRC",                  pi: "Dr. Patel",    crc: "Michael Torres", status: "Enrolling",   enrollmentCurrent: 22, enrollmentTarget: 25, ebindersUrl: "ngcrc.ebinders.io",      activationDate: "2023-06-20", flags: { expiredDocs: 0, urgentActions: 0 } },
      { site: "Harbor View Clinical",           pi: "Dr. Chen",     crc: "Diana Ross",     status: "Enrolling",   enrollmentCurrent: 18, enrollmentTarget: 20, ebindersUrl: "harborview.ebinders.io", activationDate: "2023-07-14", flags: { expiredDocs: 0, urgentActions: 0 } },
      { site: "Summit Health Partners",         pi: "Dr. Singh",    crc: "Amy Park",       status: "Enrolling",   enrollmentCurrent: 15, enrollmentTarget: 20, ebindersUrl: "summit.ebinders.io",     activationDate: "2023-08-01", flags: { expiredDocs: 0, urgentActions: 1 } },
      { site: "Riverside Research Institute",   pi: "Dr. Martinez", crc: "Sarah Chen",     status: "Follow-up",   enrollmentCurrent: 12, enrollmentTarget: 15, ebindersUrl: "riverside.ebinders.io",  activationDate: "2023-06-20", flags: { expiredDocs: 1, urgentActions: 0 } },
    ],
    enrollmentTarget: 80, enrollmentCurrent: 67, activationDate: "2023-06-20", dateCreated: "2023-04-05",
    flags: { expiredDocs: 0, urgentActions: 0 },
  },
  {
    id: "053", nickname: "ASTHMAPLUS", protocolId: "PROTO-2024-053",
    studyType: "Observational", phase: "Phase II", status: "Startup",
    sponsor: "RespiraTech", sponsorType: "Industry", cro: "",
    funderType: "Industry Funded", therapeuticArea: "Pulmonology",
    condition: "Severe Asthma", deviceDrug: "RTX-090",
    nct: "", rec: "", eudract: "",
    pi: "Dr. Kim", department: "Pulmonology",
    isMultiSite: false, siteInstances: [],
    enrollmentTarget: 50, enrollmentCurrent: 0, activationDate: "", dateCreated: "2024-02-28",
    flags: { expiredDocs: 1, urgentActions: 3 },
  },
  {
    id: "061", nickname: "RHEUMPATH", protocolId: "PROTO-2024-061",
    studyType: "Interventional", phase: "Phase III", status: "Follow-up",
    sponsor: "ImmunoGen Ltd.", sponsorType: "Industry", cro: "Syneos",
    funderType: "Industry Funded", therapeuticArea: "Rheumatology",
    condition: "Rheumatoid Arthritis", deviceDrug: "IMG-442",
    nct: "NCT05230188", rec: "22/YH/0789", eudract: "2022-007890-22",
    pi: "Dr. Singh", department: "Rheumatology",
    isMultiSite: true,
    siteInstances: [
      { site: "Northgate CRC",           pi: "Dr. Singh",    crc: "Sarah Chen",    status: "Follow-up", enrollmentCurrent: 65, enrollmentTarget: 65, ebindersUrl: "ngcrc.ebinders.io",    activationDate: "2022-11-01", flags: { expiredDocs: 0, urgentActions: 0 } },
      { site: "Lakeside Medical Center", pi: "Dr. Martinez", crc: "Diana Ross",    status: "Follow-up", enrollmentCurrent: 53, enrollmentTarget: 55, ebindersUrl: "lakeside.ebinders.io", activationDate: "2022-12-15", flags: { expiredDocs: 0, urgentActions: 0 } },
    ],
    enrollmentTarget: 120, enrollmentCurrent: 118, activationDate: "2022-11-01", dateCreated: "2022-08-14",
    flags: { expiredDocs: 0, urgentActions: 0 },
  },
  {
    id: "074", nickname: "BRIOWAVE", protocolId: "PROTO-2024-074",
    studyType: "Interventional", phase: "Phase II", status: "Startup",
    sponsor: "BioStem Pharma", sponsorType: "Industry", cro: "IQVIA",
    funderType: "Industry Funded", therapeuticArea: "Oncology",
    condition: "Diffuse Large B-Cell Lymphoma", deviceDrug: "BSP-117",
    nct: "", rec: "", eudract: "",
    pi: "Dr. Okafor", department: "Oncology",
    isMultiSite: false, siteInstances: [],
    enrollmentTarget: 45, enrollmentCurrent: 0, activationDate: "", dateCreated: "2024-03-18",
    flags: { expiredDocs: 0, urgentActions: 1 },
  },
  {
    id: "088", nickname: "CARDIO-X9", protocolId: "PROTO-2023-088",
    studyType: "Interventional", phase: "Phase IV", status: "Closed",
    sponsor: "Merck KGaA", sponsorType: "Industry", cro: "Parexel",
    funderType: "Industry Funded", therapeuticArea: "Cardiology",
    condition: "Heart Failure", deviceDrug: "MRK-980",
    nct: "NCT03987621", rec: "20/NW/0234", eudract: "2020-009012-44",
    pi: "Dr. Martinez", department: "Cardiology",
    isMultiSite: true,
    siteInstances: [
      { site: "Northgate CRC",             pi: "Dr. Martinez", crc: "Sarah Chen",  status: "Closed", enrollmentCurrent: 120, enrollmentTarget: 120, ebindersUrl: "ngcrc.ebinders.io",     activationDate: "2021-04-15", flags: { expiredDocs: 0, urgentActions: 0 } },
      { site: "Westfield University Hospital", pi: "Dr. Chen", crc: "James Liu",   status: "Closed", enrollmentCurrent: 80,  enrollmentTarget: 80,  ebindersUrl: "westfield.ebinders.io", activationDate: "2021-05-01", flags: { expiredDocs: 0, urgentActions: 0 } },
    ],
    enrollmentTarget: 200, enrollmentCurrent: 200, activationDate: "2021-04-15", dateCreated: "2021-01-08",
    flags: { expiredDocs: 0, urgentActions: 0 },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<StudyStatus, { bg: string; text: string }> = {
  Startup:     { bg: "#FFF3CC", text: "#A55A00" },
  Enrolling:   { bg: "#D4F4E0", text: "#02512B" },
  "Follow-up": { bg: "#EEF0FF", text: PRIMARY },
  Closed:      { bg: "#F3F4F6", text: "#6B7280" },
};

const STATUS_DOT: Record<StudyStatus, string> = {
  Startup:     "#D97706",
  Enrolling:   "#038748",
  "Follow-up": PRIMARY,
  Closed:      "#9CA3AF",
};

const PHASE_STYLE: Record<string, { bg: string; text: string }> = {
  "Phase I":   { bg: "#FFF3CC", text: "#A55A00" },
  "Phase II":  { bg: "#FDF1EA", text: "#A85948" },
  "Phase III": { bg: "#EEF0FF", text: PRIMARY },
  "Phase IV":  { bg: "#F0FDF4", text: "#15803D" },
  "N/A":       { bg: "#F3F4F6", text: "#6B7280" },
};

const inputCls = "w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:border-[#5C4EE5]/60 transition-colors";
const inputStyle = { borderColor: "#E3D8CC", background: "white", color: "#1A1511" };

// ── Sub-components ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: StudyStatus }) {
  const s = STATUS_STYLE[status];
  return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={s}>{status}</span>;
}

function PhaseBadge({ phase }: { phase: string }) {
  const s = PHASE_STYLE[phase] ?? PHASE_STYLE["N/A"];
  return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={s}>{phase}</span>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
        {required && <span style={{ color: "#DC2626" }} className="mr-0.5">*</span>}{label}
      </label>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className={`${inputCls} appearance-none pr-8`} style={inputStyle}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export function StudiesPage() {
  const navigate = useNavigate();
  const [view,           setView]           = useState<"table" | "grid">("table");
  const [panel,          setPanel]          = useState<null | "create" | "edit">(null);
  const [editStudy,      setEditStudy]      = useState<Study | null>(null);
  const [search,         setSearch]         = useState("");
  const [filterStatus,   setFilterStatus]   = useState<StudyStatus | "">("");
  const [filterPhase,    setFilterPhase]    = useState<string>("");
  const [filterTA,       setFilterTA]       = useState<string>("");
  const [filterSite,     setFilterSite]     = useState<string>("");
  const [sortBy,         setSortBy]         = useState<"name" | "status" | "enrollment" | "phase" | "dateCreated">("name");
  const [sortDir,        setSortDir]        = useState<"asc" | "desc">("asc");
  const [expandedStudies, setExpandedStudies] = useState<Set<string>>(new Set());
  const [showSettings,   setShowSettings]   = useState(false);
  const [colVis,         setColVis]         = useState({
    status: true, phase: true, therapeuticArea: true, site: true, department: false,
    fundingType: true, dateCreated: true,
  });
  const [formTab,        setFormTab]        = useState<"profile" | "configurations" | "staff" | "data">("profile");
  const [form,           setForm]           = useState<StudyForm>(EMPTY_FORM);
  const [studies,        setStudies]        = useState<Study[]>(MOCK_STUDIES);
  const setField = (k: keyof StudyForm, v: any) => setForm(p => ({ ...p, [k]: v }));

  // Unique sites across all multi-site studies
  const allSites = useMemo(() => {
    const siteSet = new Set<string>();
    studies.forEach(s => s.siteInstances.forEach(si => siteSet.add(si.site)));
    return Array.from(siteSet).sort();
  }, [studies]);

  const totalSiteActivations = useMemo(() =>
    studies.reduce((acc, s) => acc + (s.isMultiSite ? s.siteInstances.length : 1), 0),
  [studies]);

  const displayed = useMemo(() => {
    let s = [...studies];
    if (search)       s = s.filter(x => x.nickname.toLowerCase().includes(search.toLowerCase()) || x.protocolId.toLowerCase().includes(search.toLowerCase()) || x.sponsor.toLowerCase().includes(search.toLowerCase()) || x.condition.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus) s = s.filter(x => x.status === filterStatus || x.siteInstances.some(si => si.status === filterStatus));
    if (filterPhase)  s = s.filter(x => x.phase === filterPhase);
    if (filterTA)     s = s.filter(x => x.therapeuticArea === filterTA);
    if (filterSite)   s = s.filter(x => x.siteInstances.some(si => si.site === filterSite));
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "name")        s.sort((a, b) => dir * a.nickname.localeCompare(b.nickname));
    if (sortBy === "status")      s.sort((a, b) => dir * a.status.localeCompare(b.status));
    if (sortBy === "enrollment")  s.sort((a, b) => dir * ((a.enrollmentCurrent / (a.enrollmentTarget || 1)) - (b.enrollmentCurrent / (b.enrollmentTarget || 1))));
    if (sortBy === "phase")       s.sort((a, b) => dir * a.phase.localeCompare(b.phase));
    if (sortBy === "dateCreated") s.sort((a, b) => dir * a.dateCreated.localeCompare(b.dateCreated));
    return s;
  }, [studies, search, filterStatus, filterPhase, filterTA, filterSite, sortBy, sortDir]);

  const counts = useMemo(() => ({
    total:     studies.length,
    startup:   studies.filter(s => s.status === "Startup").length,
    enrolling: studies.filter(s => s.status === "Enrolling").length,
    followup:  studies.filter(s => s.status === "Follow-up").length,
    closed:    studies.filter(s => s.status === "Closed").length,
  }), [studies]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStudies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => { setFilterStatus(""); setFilterPhase(""); setFilterTA(""); setFilterSite(""); };
  const hasFilters = filterStatus || filterPhase || filterTA || filterSite;

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: typeof sortBy }) => {
    if (sortBy !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3" style={{ color: PRIMARY }} />
      : <ChevronDown className="w-3 h-3" style={{ color: PRIMARY }} />;
  };

  const openCreate = () => { setForm(EMPTY_FORM); setFormTab("profile"); setEditStudy(null); setPanel("create"); };

  const openEdit = (study: Study) => {
    setForm({
      nickname: study.nickname, protocolId: study.protocolId, studyType: study.studyType,
      phase: study.phase, status: study.status, sponsor: study.sponsor,
      sponsorType: study.sponsorType, cro: study.cro, funderType: study.funderType,
      therapeuticArea: study.therapeuticArea, condition: study.condition, deviceDrug: study.deviceDrug,
      nct: study.nct, rec: study.rec, eudract: study.eudract,
      department: study.department, irb: "", isMultiSite: study.isMultiSite,
      sites: study.siteInstances.map(si => si.site),
      studyStructure: "", studyRoles: [], taskTemplates: [],
      prefAutoAssign: true, prefRequirePI: false, prefEBindersSync: true, prefEmailNotif: true,
      linkEBinders: true, linkEConsent: false, linkBudget: false, linkMonitoring: false,
      pi: study.pi, crc: "", additionalStaff: [],
      enrollmentTarget: String(study.enrollmentTarget), activationDate: study.activationDate,
      milestones: {},
    });
    setFormTab("profile");
    setEditStudy(study);
    setPanel("edit");
  };

  const saveStudy = () => {
    if (panel === "create") {
      const newStudy: Study = {
        id: String(Date.now()), nickname: form.nickname || "UNTITLED", protocolId: form.protocolId,
        studyType: form.studyType, phase: (form.phase as Phase) || "N/A", status: (form.status as StudyStatus) || "Startup",
        sponsor: form.sponsor, sponsorType: form.sponsorType, cro: form.cro, funderType: form.funderType,
        therapeuticArea: form.therapeuticArea, condition: form.condition, deviceDrug: form.deviceDrug,
        nct: form.nct, rec: form.rec, eudract: form.eudract,
        pi: form.pi, department: form.department, isMultiSite: form.isMultiSite,
        siteInstances: [],
        enrollmentTarget: Number(form.enrollmentTarget) || 0, enrollmentCurrent: 0,
        activationDate: form.activationDate, dateCreated: new Date().toISOString().slice(0, 10),
        flags: { expiredDocs: 0, urgentActions: 0 },
      };
      setStudies(p => [newStudy, ...p]);
    }
    setPanel(null);
  };

  const STATUS_TABS = [
    { label: "All",       count: counts.total,     value: "" as const,          dot: "#9CA3AF" },
    { label: "Startup",   count: counts.startup,   value: "Startup" as const,   dot: "#D97706" },
    { label: "Enrolling", count: counts.enrolling, value: "Enrolling" as const, dot: "#038748" },
    { label: "Follow-up", count: counts.followup,  value: "Follow-up" as const, dot: PRIMARY },
    { label: "Closed",    count: counts.closed,    value: "Closed" as const,    dot: "#9CA3AF" },
  ];

  return (
    <div className="-m-6 flex" style={{ height: "calc(100vh - 53px)", background: "#F2EDE6" }}>

      {/* ── Main list ── */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* ── Row 1: Title + actions ── */}
        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ background: "#FFFCF7", borderBottom: "1px solid #EDE5DA" }}>
          {/* Title + meta */}
          <div>
            <h1 className="text-base font-semibold" style={{ color: "#2D1F12" }}>Studies</h1>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{counts.total} studies · {totalSiteActivations} site activations</p>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: "#EDE5DA" }}>
              {([{ k: "table", Icon: List }, { k: "grid", Icon: LayoutGrid }] as const).map(({ k, Icon }) => (
                <button key={k} onClick={() => setView(k as any)} className="px-2.5 py-1.5 transition-colors"
                  style={view === k ? { background: "#EDE5DA", color: "#2D1F12" } : { background: "#FFFCF7", color: "#9CA3AF" }}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
              style={{ background: PRIMARY }}>
              <Plus className="w-3.5 h-3.5" /> New Study
            </button>
          </div>
        </div>

        {/* ── Row 2: Search + filters ── */}
        <div className="flex items-center gap-2 px-6 py-2.5 flex-shrink-0 flex-wrap" style={{ background: "#FFFCF7", borderBottom: "1px solid #EDE5DA" }}>
          {/* Search */}
          <div className="relative" style={{ minWidth: 220 }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search nickname, protocol, sponsor…"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg focus:outline-none"
              style={{ border: "1px solid #EDE5DA", background: "#F2EDE6", color: "#1A1511" }}
            />
          </div>

          {/* Filter selects */}
          {([
            { key: "status",  label: "Status",   value: filterStatus, opts: STATUSES,   onChange: (v: string) => setFilterStatus(v as StudyStatus | "") },
            { key: "phase",   label: "Phase",    value: filterPhase,  opts: PHASES,     onChange: setFilterPhase },
            { key: "therapy", label: "Therapy",  value: filterTA,     opts: THER_AREAS, onChange: setFilterTA },
          ] as const).map(f => (
            <div key={f.key} className="relative">
              <select value={f.value} onChange={e => f.onChange(e.target.value)}
                className="appearance-none text-xs rounded-lg pl-3 pr-7 py-1.5 focus:outline-none cursor-pointer font-medium"
                style={{
                  border: `1px solid ${f.value ? PRIMARY : "#EDE5DA"}`,
                  color: f.value ? PRIMARY : "#6B7280",
                  background: f.value ? "#F0EEFF" : "#FFFCF7",
                }}>
                <option value="">{f.label}</option>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: f.value ? PRIMARY : "#9CA3AF" }} />
            </div>
          ))}

          {colVis.site && (
            <div className="relative">
              <select value={filterSite} onChange={e => setFilterSite(e.target.value)}
                className="appearance-none text-xs rounded-lg pl-3 pr-7 py-1.5 focus:outline-none cursor-pointer font-medium"
                style={{
                  border: `1px solid ${filterSite ? "#038748" : "#EDE5DA"}`,
                  color: filterSite ? "#038748" : "#6B7280",
                  background: filterSite ? "#EDFBF4" : "#FFFCF7",
                }}>
                <option value="">Site</option>
                {allSites.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: filterSite ? "#038748" : "#9CA3AF" }} />
            </div>
          )}

          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ background: "#FFECEC", color: "#D30000" }}>
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}

          {/* Column settings gear — pushed right */}
          <div className="relative ml-auto">
            <button onClick={() => setShowSettings(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border"
              style={{
                borderColor: showSettings ? PRIMARY : "#EDE5DA",
                background: showSettings ? "#F0EEFF" : "#FFFCF7",
                color: showSettings ? PRIMARY : "#9CA3AF",
              }}>
              <Settings className="w-3.5 h-3.5" />
              Columns
            </button>
            {showSettings && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                <div className="absolute top-9 right-0 z-50 rounded-xl shadow-xl" style={{ background: "#FFFCF7", border: "1px solid #EDE5DA", width: 220 }}>
                  <div className="px-3.5 py-2.5" style={{ borderBottom: "1px solid #EDE5DA" }}>
                    <div className="text-xs font-semibold" style={{ color: "#2D1F12" }}>Show / Hide Columns</div>
                  </div>
                  <div className="py-1.5 px-1">
                    {([
                      { key: "status",          label: "Status" },
                      { key: "phase",           label: "Phase" },
                      { key: "therapeuticArea", label: "Therapeutic Area" },
                      { key: "fundingType",     label: "Funding Type" },
                      { key: "dateCreated",     label: "Date Created" },
                      { key: "site",            label: "Site" },
                      { key: "department",      label: "Department" },
                    ] as { key: keyof typeof colVis; label: string }[]).map(({ key, label }) => {
                      const on = colVis[key];
                      return (
                        <button key={key} onClick={() => setColVis(v => ({ ...v, [key]: !v[key] }))}
                          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors hover:bg-[#F5EDE0]">
                          <span className="text-xs font-medium" style={{ color: on ? "#2D1F12" : "#9CA3AF" }}>{label}</span>
                          <div className="relative flex-shrink-0 w-8 h-4 rounded-full transition-colors" style={{ background: on ? PRIMARY : "#D1D5DB" }}>
                            <div className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all" style={{ left: on ? "calc(100% - 14px)" : 2 }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-3.5 py-2" style={{ borderTop: "1px solid #EDE5DA" }}>
                    <button onClick={() => setColVis({ status: true, phase: true, therapeuticArea: true, site: true, department: false, fundingType: true, dateCreated: true })}
                      className="text-[11px] hover:underline" style={{ color: "#9CA3AF" }}>Reset to default</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Row 3: Status tabs + active-filter chips + count ── */}
        <div className="flex items-center gap-1 px-6 py-2 flex-shrink-0" style={{ background: "#F2EDE6", borderBottom: "1px solid #EDE5DA" }}>
          {STATUS_TABS.map(tab => {
            const active = filterStatus === tab.value;
            return (
              <button key={tab.label}
                onClick={() => setFilterStatus(tab.value as any)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={active
                  ? { background: "#FFFCF7", color: "#2D1F12", boxShadow: "0 1px 4px rgba(80,55,30,0.12)" }
                  : { color: "#8C7B6E", background: "transparent" }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tab.dot, opacity: active ? 1 : 0.6 }} />
                {tab.label}
                <span className="font-normal" style={{ color: active ? "#9CA3AF" : "#A89080" }}>{tab.count}</span>
              </button>
            );
          })}
          {filterSite && (
            <span className="flex items-center gap-1 ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: "#EDFBF4", color: "#038748", border: "1px solid #A7F3D0" }}>
              <MapPin className="w-2.5 h-2.5" />{filterSite}
              <button onClick={() => setFilterSite("")} className="ml-0.5 hover:opacity-70 font-bold">×</button>
            </span>
          )}
          <span className="ml-auto text-[11px]" style={{ color: "#9CA3AF" }}>{displayed.length} of {counts.total}</span>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#F2EDE6" }}>
          {view === "table" ? (
            <table className="w-full text-sm">
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr style={{ background: "#FFFCF7", borderBottom: "2px solid #EDE5DA" }}>
                  {/* Study — sortable */}
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    <button onClick={() => handleSort("name")} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide hover:opacity-80" style={{ color: sortBy === "name" ? PRIMARY : "#9CA3AF" }}>
                      Study <SortIcon col="name" />
                    </button>
                  </th>
                  {colVis.phase && (
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button onClick={() => handleSort("phase")} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide hover:opacity-80" style={{ color: sortBy === "phase" ? PRIMARY : "#9CA3AF" }}>
                        Phase <SortIcon col="phase" />
                      </button>
                    </th>
                  )}
                  {colVis.status && (
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button onClick={() => handleSort("status")} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide hover:opacity-80" style={{ color: sortBy === "status" ? PRIMARY : "#9CA3AF" }}>
                        Status <SortIcon col="status" />
                      </button>
                    </th>
                  )}
                  {colVis.therapeuticArea && <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#9CA3AF" }}>Therapy</th>}
                  {colVis.department      && <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#9CA3AF" }}>Dept.</th>}
                  {colVis.fundingType     && <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#9CA3AF" }}>Funding</th>}
                  {colVis.dateCreated && (
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button onClick={() => handleSort("dateCreated")} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide hover:opacity-80" style={{ color: sortBy === "dateCreated" ? PRIMARY : "#9CA3AF" }}>
                        Created <SortIcon col="dateCreated" />
                      </button>
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#9CA3AF" }}>Sponsor / CRO</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#9CA3AF" }}>PI</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    <button onClick={() => handleSort("enrollment")} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide hover:opacity-80" style={{ color: sortBy === "enrollment" ? PRIMARY : "#9CA3AF" }}>
                      Enrollment <SortIcon col="enrollment" />
                    </button>
                  </th>
                  {colVis.site && <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#9CA3AF" }}>Sites</th>}
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#9CA3AF" }}>Flags</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {displayed.map(study => {
                  const pct = study.enrollmentTarget > 0 ? Math.round((study.enrollmentCurrent / study.enrollmentTarget) * 100) : 0;
                  const isExpanded = expandedStudies.has(study.id);
                  const enrollColor = pct >= 80 ? "#038748" : pct >= 40 ? "#D97706" : PRIMARY;
                  return (
                    <>
                      {/* ── Study row ── */}
                      <tr
                        key={study.id}
                        className="transition-colors group/row"
                        style={{ borderBottom: "1px solid #EDE5DA", background: "#FFFCF7", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#FAF6F0")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#FFFCF7")}
                        onClick={() => navigate(`/study/${study.id}`)}
                      >
                        {/* Study name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {study.isMultiSite ? (
                              <button onClick={e => toggleExpand(study.id, e)}
                                className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors"
                                style={{ background: isExpanded ? "#EDE5DA" : "transparent", color: "#9CA3AF" }}>
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>
                            ) : <span className="w-5 flex-shrink-0" />}
                            <div className="min-w-0">
                              <div className="font-bold text-sm transition-colors" style={{ color: "#2D1F12" }}
                                onMouseEnter={e => (e.currentTarget.style.color = PRIMARY)}
                                onMouseLeave={e => (e.currentTarget.style.color = "#2D1F12")}>
                                {study.nickname}
                              </div>
                              <div className="font-mono text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{study.protocolId}</div>
                            </div>
                          </div>
                        </td>
                        {colVis.phase && <td className="px-4 py-3"><PhaseBadge phase={study.phase} /></td>}
                        {colVis.status && <td className="px-4 py-3"><StatusBadge status={study.status} /></td>}
                        {colVis.therapeuticArea && <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#4D3F34" }}>{study.therapeuticArea}</td>}
                        {colVis.department      && <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#4D3F34" }}>{study.department || "—"}</td>}
                        {colVis.fundingType     && (
                          <td className="px-4 py-3">
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: "#F3F0FF", color: "#6B4EAA" }}>
                              {study.funderType || "—"}
                            </span>
                          </td>
                        )}
                        {colVis.dateCreated && (
                          <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#9CA3AF" }}>
                            {study.dateCreated ? new Date(study.dateCreated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "—"}
                          </td>
                        )}
                        {/* Sponsor */}
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium whitespace-nowrap" style={{ color: "#2D1F12" }}>{study.sponsor}</div>
                          {study.cro && <div className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>CRO: {study.cro}</div>}
                        </td>
                        {/* PI */}
                        <td className="px-4 py-3">
                          {study.isMultiSite
                            ? <span className="flex items-center gap-1 text-[11px]" style={{ color: "#9CA3AF" }}><Users className="w-3 h-3" />{study.siteInstances.length} PIs</span>
                            : <span className="text-xs whitespace-nowrap" style={{ color: "#4D3F34" }}>{study.pi}</span>}
                        </td>
                        {/* Enrollment */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#EDE5DA" }}>
                              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: enrollColor }} />
                            </div>
                            <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: "#2D1F12" }}>
                              {study.enrollmentCurrent}<span style={{ color: "#9CA3AF", fontWeight: 400 }}>/{study.enrollmentTarget}</span>
                            </span>
                            <span className="text-[10px] font-medium" style={{ color: enrollColor }}>{pct}%</span>
                          </div>
                        </td>
                        {/* Sites */}
                        {colVis.site && (
                          <td className="px-4 py-3">
                            {study.isMultiSite ? (
                              <button onClick={e => toggleExpand(study.id, e)}
                                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full transition-colors"
                                style={{ background: "#EEF0FF", color: PRIMARY }}>
                                <Building2 className="w-3 h-3" />{study.siteInstances.length} sites
                              </button>
                            ) : (
                              <span className="text-[11px]" style={{ color: "#9CA3AF" }}>Single</span>
                            )}
                          </td>
                        )}
                        {/* Flags */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {study.flags.expiredDocs > 0 && (
                              <span className="flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#FFF3CC", color: "#A55A00" }}>
                                <FileWarning className="w-3 h-3" />{study.flags.expiredDocs}
                              </span>
                            )}
                            {study.flags.urgentActions > 0 && (
                              <span className="flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#FFECEC", color: "#D30000" }}>
                                <Zap className="w-3 h-3" />{study.flags.urgentActions}
                              </span>
                            )}
                            {!study.flags.expiredDocs && !study.flags.urgentActions && <span style={{ color: "#D1D5DB" }}>—</span>}
                          </div>
                        </td>
                        {/* Edit */}
                        <td className="px-3 py-3">
                          <button onClick={e => { e.stopPropagation(); openEdit(study); }}
                            className="opacity-0 group-hover/row:opacity-100 transition-opacity text-[11px] font-medium px-2.5 py-1 rounded-lg"
                            style={{ background: "#EDE5DA", color: "#4D3F34" }}>
                            Edit
                          </button>
                        </td>
                      </tr>

                      {/* ── Site sub-rows ── */}
                      {isExpanded && study.siteInstances.map((si, idx) => {
                        const siPct = si.enrollmentTarget > 0 ? Math.round((si.enrollmentCurrent / si.enrollmentTarget) * 100) : 0;
                        const siColor = siPct >= 80 ? "#038748" : siPct >= 40 ? "#D97706" : PRIMARY;
                        return (
                          <tr key={`${study.id}-si-${idx}`} className="transition-colors"
                            style={{ borderBottom: "1px solid #EDE5DA", background: "#F7F3EE" }}>
                            <td style={{ paddingLeft: 48, paddingTop: 10, paddingBottom: 10, paddingRight: 16 }}>
                              <div className="flex items-center gap-2">
                                <div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ background: PRIMARY, opacity: 0.25 }} />
                                <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "#9CA3AF" }} />
                                <span className="text-xs font-medium" style={{ color: "#4D3F34" }}>{si.site}</span>
                              </div>
                            </td>
                            {colVis.phase && <td className="px-4 py-2" />}
                            {colVis.status && <td className="px-4 py-2"><StatusBadge status={si.status} /></td>}
                            {colVis.therapeuticArea && <td className="px-4 py-2 text-[11px]" style={{ color: "#9CA3AF" }}>{si.activationDate || "Not activated"}</td>}
                            {colVis.department && <td className="px-4 py-2" />}
                            {colVis.fundingType && <td className="px-4 py-2" />}
                            {colVis.dateCreated && <td className="px-4 py-2" />}
                            <td className="px-4 py-2">
                              {si.ebindersUrl && (
                                <a href="#" onClick={e => e.preventDefault()}
                                  className="flex items-center gap-1 text-[11px] font-medium hover:underline" style={{ color: PRIMARY }}>
                                  <ExternalLink className="w-3 h-3" />eBinders
                                </a>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-[11px] font-medium" style={{ color: "#2D1F12" }}>{si.pi}</div>
                              <div className="text-[10px]" style={{ color: "#9CA3AF" }}>CRC: {si.crc}</div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE5DA" }}>
                                  <div className="h-1.5 rounded-full" style={{ width: `${siPct}%`, background: siColor }} />
                                </div>
                                <span className="text-[11px] font-semibold" style={{ color: "#2D1F12" }}>
                                  {si.enrollmentCurrent}<span style={{ color: "#9CA3AF", fontWeight: 400 }}>/{si.enrollmentTarget}</span>
                                </span>
                              </div>
                            </td>
                            {colVis.site && <td className="px-4 py-2" />}
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-1">
                                {si.flags.expiredDocs > 0 && <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#FFF3CC", color: "#A55A00" }}><FileWarning className="w-2.5 h-2.5" />{si.flags.expiredDocs}</span>}
                                {si.flags.urgentActions > 0 && <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#FFECEC", color: "#D30000" }}><Zap className="w-2.5 h-2.5" />{si.flags.urgentActions}</span>}
                                {!si.flags.expiredDocs && !si.flags.urgentActions && <span style={{ color: "#D1D5DB", fontSize: 10 }}>—</span>}
                              </div>
                            </td>
                            <td className="px-3 py-2" />
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={12} className="py-20 text-center">
                      <div className="text-sm font-medium" style={{ color: "#9CA3AF" }}>No studies match the current filters</div>
                      <button onClick={clearFilters} className="text-xs mt-2 hover:underline" style={{ color: PRIMARY }}>Clear filters</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* ── Grid view ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
              {displayed.map(study => {
                const pct = study.enrollmentTarget > 0 ? Math.round((study.enrollmentCurrent / study.enrollmentTarget) * 100) : 0;
                const enrollColor = pct >= 80 ? "#038748" : pct >= 40 ? "#D97706" : PRIMARY;
                return (
                  <div
                    key={study.id}
                    onClick={() => navigate(`/study/${study.id}`)}
                    className="rounded-xl p-4 cursor-pointer transition-all group/card flex flex-col"
                    style={{ background: "#FFFCF7", border: "1px solid #EDE5DA" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(80,55,30,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "#C8B8A8"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#EDE5DA"; }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <div className="font-mono text-[10px]" style={{ color: "#9CA3AF" }}>{study.protocolId}</div>
                        <div className="font-bold text-sm mt-0.5 transition-colors" style={{ color: "#2D1F12" }}>{study.nickname}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); openEdit(study); }}
                        className="opacity-0 group-hover/card:opacity-100 transition-opacity text-[10px] font-medium px-2 py-1 rounded-lg flex-shrink-0"
                        style={{ background: "#EDE5DA", color: "#4D3F34" }}>Edit</button>
                    </div>

                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      <PhaseBadge phase={study.phase} />
                      <StatusBadge status={study.status} />
                      {study.isMultiSite && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#EEF0FF", color: PRIMARY }}>
                          <Building2 className="w-2.5 h-2.5" />{study.siteInstances.length} sites
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "#9CA3AF" }}>{study.therapeuticArea}</span>
                        <span className="text-[11px]" style={{ color: "#4D3F34" }}>{study.isMultiSite ? `${study.siteInstances.length} PIs` : study.pi}</span>
                      </div>
                      <div className="text-xs truncate" style={{ color: "#9CA3AF" }}>{study.sponsor}</div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span style={{ color: "#9CA3AF" }}>Enrollment</span>
                        <span className="font-semibold" style={{ color: "#2D1F12" }}>{study.enrollmentCurrent}/{study.enrollmentTarget} <span style={{ color: enrollColor }}>({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "#038748" }} />
                      </div>
                    </div>

                    {/* Multi-site instances list */}
                    {study.isMultiSite && study.siteInstances.length > 0 && (
                      <div className="mt-auto pt-2.5 border-t" style={{ borderColor: "#F0EAE2" }}>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Sites</div>
                        <div className="space-y-1">
                          {study.siteInstances.slice(0, 3).map((si, i) => (
                            <div key={i} className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_DOT[si.status] }} />
                                <span className="text-[11px] text-gray-600 truncate">{si.site}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 flex-shrink-0">{si.enrollmentCurrent}/{si.enrollmentTarget}</span>
                            </div>
                          ))}
                          {study.siteInstances.length > 3 && (
                            <div className="text-[10px] text-gray-400 pl-3">+{study.siteInstances.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    )}

                    {(study.flags.expiredDocs > 0 || study.flags.urgentActions > 0) && (
                      <div className="flex gap-2 mt-2.5 pt-2.5 border-t" style={{ borderColor: "#F0EAE2" }}>
                        {study.flags.expiredDocs > 0 && <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: "#FF991F" }}><FileWarning className="w-3 h-3" />{study.flags.expiredDocs} expired</span>}
                        {study.flags.urgentActions > 0 && <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: "#D30000" }}><Zap className="w-3 h-3" />{study.flags.urgentActions} urgent</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit panel ── */}
      {panel && (
        <div className="flex-shrink-0 flex flex-col border-l overflow-hidden" style={{ width: 500, background: "white", borderColor: "#E8DDD2" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "#EDE5DA" }}>
            <div>
              <h2 className="font-semibold text-sm">{panel === "create" ? "New Study" : `Edit — ${editStudy?.nickname}`}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{panel === "create" ? "Fill in study profile and metadata" : "Update study details and metadata"}</p>
            </div>
            <button onClick={() => setPanel(null)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {panel === "create" && (
            <div className="px-5 py-3 border-b flex-shrink-0" style={{ background: "#FAF7F3", borderColor: "#EDE5DA" }}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Study Scope</div>
              <div className="flex gap-2">
                {([{ key: false, label: "Single Site", icon: "🏥" }, { key: true, label: "Multi-Site Network", icon: "🌐" }] as const).map(opt => (
                  <button key={String(opt.key)} onClick={() => setField("isMultiSite", opt.key)}
                    className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
                    style={form.isMultiSite === opt.key ? { borderColor: PRIMARY, background: "#F0EEFF", color: PRIMARY } : { borderColor: "#E3D8CC", background: "white", color: "#6B7280" }}>
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex border-b flex-shrink-0" style={{ borderColor: "#EDE5DA" }}>
            {([{ key: "profile", label: "Profile" }, { key: "configurations", label: "Configurations" }, { key: "staff", label: "Staff" }, { key: "data", label: "Data" }] as const).map(tab => (
              <button key={tab.key} onClick={() => setFormTab(tab.key)}
                className="flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors"
                style={formTab === tab.key ? { borderColor: PRIMARY, color: PRIMARY } : { borderColor: "transparent", color: "#9CA3AF" }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">

            {/* ── Profile tab ── */}
            {formTab === "profile" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Study Nickname" required>
                    <input value={form.nickname} onChange={e => setField("nickname", e.target.value)} placeholder="JAVAHEART" className={inputCls} style={inputStyle} />
                  </FormField>
                  <FormField label="Unique Protocol ID" required>
                    <input value={form.protocolId} onChange={e => setField("protocolId", e.target.value)} placeholder="AFIBSTUDY1" className={inputCls} style={inputStyle} />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Study Type"><SelectField value={form.studyType} onChange={v => setField("studyType", v)} options={STUDY_TYPES} placeholder="Select Study Type" /></FormField>
                  <FormField label="Study Phase"><SelectField value={form.phase} onChange={v => setField("phase", v)} options={PHASES} placeholder="Select Phase" /></FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Study Status" required><SelectField value={form.status} onChange={v => setField("status", v)} options={STATUSES} placeholder="Select Status" /></FormField>
                  <FormField label="Sponsor" required><input value={form.sponsor} onChange={e => setField("sponsor", e.target.value)} placeholder="Sponsor name" className={inputCls} style={inputStyle} /></FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Sponsor Type"><SelectField value={form.sponsorType} onChange={v => setField("sponsorType", v)} options={SPONSOR_TYPES} placeholder="Select Sponsor Type" /></FormField>
                  <FormField label="Funder Type"><SelectField value={form.funderType} onChange={v => setField("funderType", v)} options={FUNDER_TYPES} placeholder="Select Funder Type" /></FormField>
                </div>
                <FormField label="Contract Research Organization (CRO)">
                  <input value={form.cro} onChange={e => setField("cro", e.target.value)} placeholder="CRO name" className={inputCls} style={inputStyle} />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Therapeutic Area"><SelectField value={form.therapeuticArea} onChange={v => setField("therapeuticArea", v)} options={THER_AREAS} placeholder="Select Therapeutic Area" /></FormField>
                  <FormField label="Condition / Disease"><input value={form.condition} onChange={e => setField("condition", e.target.value)} placeholder="e.g. Atrial Fibrillation" className={inputCls} style={inputStyle} /></FormField>
                </div>
                <FormField label="Device / Drug"><input value={form.deviceDrug} onChange={e => setField("deviceDrug", e.target.value)} placeholder="e.g. JVH-304" className={inputCls} style={inputStyle} /></FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Department"><SelectField value={form.department} onChange={v => setField("department", v)} options={DEPT_OPTIONS} placeholder="Select Department" /></FormField>
                  <FormField label="IRB"><input value={form.irb} onChange={e => setField("irb", e.target.value)} placeholder="IRB name or #" className={inputCls} style={inputStyle} /></FormField>
                </div>
                <div className="pt-2 border-t" style={{ borderColor: "#EDE5DA" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Registry IDs</div>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="NCT"><input value={form.nct} onChange={e => setField("nct", e.target.value)} placeholder="NCT…" className={inputCls} style={inputStyle} /></FormField>
                    <FormField label="Rec"><input value={form.rec} onChange={e => setField("rec", e.target.value)} placeholder="Rec #" className={inputCls} style={inputStyle} /></FormField>
                    <FormField label="EudraCT"><input value={form.eudract} onChange={e => setField("eudract", e.target.value)} placeholder="EudraCT #" className={inputCls} style={inputStyle} /></FormField>
                  </div>
                </div>
                <div className="pt-2 border-t" style={{ borderColor: "#EDE5DA" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Sites / Network</div>
                  {form.sites.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.sites.map(s => (
                        <span key={s} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: "#E3D8CC", color: "#4D3F34", background: "#FAF7F3" }}>
                          {s}
                          <button onClick={() => setField("sites", form.sites.filter(x => x !== s))} className="text-gray-400 hover:text-red-500 transition-colors leading-none ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <select value="" onChange={e => { if (e.target.value && !form.sites.includes(e.target.value)) setField("sites", [...form.sites, e.target.value]); }}
                      className="appearance-none w-full text-xs border rounded-lg pl-3 pr-8 py-2 focus:outline-none cursor-pointer"
                      style={{ borderColor: PRIMARY, color: PRIMARY, background: "#F0EEFF" }}>
                      <option value="">+ Add Site to Network</option>
                      {SITE_OPTIONS.filter(s => !form.sites.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: PRIMARY }} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Configurations tab ── */}
            {formTab === "configurations" && (
              <div className="space-y-5">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Study Structure</div>
                  <SelectField value={form.studyStructure} onChange={v => setField("studyStructure", v)} options={STUDY_STRUCTURES} placeholder="Select Study Structure" />
                </div>
                <div className="pt-3 border-t" style={{ borderColor: "#EDE5DA" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Study Roles</div>
                  <div className="grid grid-cols-2 gap-2">
                    {STUDY_ROLE_OPTIONS.map(role => {
                      const checked = form.studyRoles.includes(role);
                      return (
                        <button key={role} onClick={() => setField("studyRoles", checked ? form.studyRoles.filter(r => r !== role) : [...form.studyRoles, role])}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left text-xs font-medium transition-all"
                          style={checked ? { borderColor: PRIMARY, background: "#F0EEFF", color: PRIMARY } : { borderColor: "#E3D8CC", color: "#6B7280" }}>
                          <div className="w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center" style={checked ? { background: PRIMARY, borderColor: PRIMARY } : { borderColor: "#D5C7B8" }}>
                            {checked && <span className="text-white font-bold" style={{ fontSize: 8 }}>✓</span>}
                          </div>
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="pt-3 border-t" style={{ borderColor: "#EDE5DA" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Task Templates</div>
                  <div className="space-y-2">
                    {TASK_TEMPLATES.map(tmpl => {
                      const checked = form.taskTemplates.includes(tmpl);
                      return (
                        <button key={tmpl} onClick={() => setField("taskTemplates", checked ? form.taskTemplates.filter(t => t !== tmpl) : [...form.taskTemplates, tmpl])}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg border text-left transition-all"
                          style={checked ? { borderColor: PRIMARY, background: "#F0EEFF" } : { borderColor: "#E3D8CC" }}>
                          <div className="w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center" style={checked ? { background: PRIMARY, borderColor: PRIMARY } : { borderColor: "#D5C7B8" }}>
                            {checked && <span className="text-white font-bold" style={{ fontSize: 9 }}>✓</span>}
                          </div>
                          <span className="text-xs font-medium" style={checked ? { color: PRIMARY } : { color: "#374151" }}>{tmpl}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="pt-3 border-t" style={{ borderColor: "#EDE5DA" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Preferences</div>
                  <div className="space-y-3">
                    {[
                      { key: "prefAutoAssign",   label: "Auto-assign tasks to CRC Lead",  desc: "New tasks are automatically assigned to the CRC Lead" },
                      { key: "prefRequirePI",    label: "Require PI sign-off on tasks",    desc: "Tasks require PI approval before closing" },
                      { key: "prefEBindersSync", label: "Enable eBinders auto-sync",       desc: "Documents sync automatically with eBinders" },
                      { key: "prefEmailNotif",   label: "Send email notifications",        desc: "Team members receive email alerts for key events" },
                    ].map(pref => (
                      <div key={pref.key} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-800">{pref.label}</div>
                          <div className="text-[11px] text-gray-400">{pref.desc}</div>
                        </div>
                        <button onClick={() => setField(pref.key as keyof StudyForm, !(form as any)[pref.key])}
                          className="flex-shrink-0 w-9 h-5 rounded-full transition-colors relative"
                          style={{ background: (form as any)[pref.key] ? PRIMARY : "#D5C7B8" }}>
                          <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: (form as any)[pref.key] ? "18px" : "2px" }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Staff tab ── */}
            {formTab === "staff" && (
              <div className="space-y-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Study Leadership</div>
                <div className="p-3 border rounded-xl space-y-3" style={{ borderColor: "#E8DDD2", background: "#FAF7F3" }}>
                  <FormField label="Principal Investigator (PI)" required><SelectField value={form.pi} onChange={v => setField("pi", v)} options={PI_OPTIONS} placeholder="Select PI" /></FormField>
                  <FormField label="Lead CRC"><SelectField value={form.crc} onChange={v => setField("crc", v)} options={CRC_OPTIONS} placeholder="Select Lead CRC" /></FormField>
                </div>
                {form.additionalStaff.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Additional Staff</div>
                    {form.additionalStaff.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 border rounded-lg" style={{ borderColor: "#E3D8CC" }}>
                        <input value={s.name} onChange={e => setField("additionalStaff", form.additionalStaff.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Name"
                          className="flex-1 text-xs border rounded px-2 py-1 focus:outline-none" style={{ borderColor: "#E3D8CC", color: "#1A1511" }} />
                        <div className="relative w-36 flex-shrink-0">
                          <select value={s.role} onChange={e => setField("additionalStaff", form.additionalStaff.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                            className="appearance-none w-full text-xs border rounded px-2 pr-6 py-1 focus:outline-none" style={{ borderColor: "#E3D8CC", color: "#1A1511" }}>
                            <option value="">Role…</option>
                            {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>
                        <button onClick={() => setField("additionalStaff", form.additionalStaff.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setField("additionalStaff", [...form.additionalStaff, { name: "", role: "" }])}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-dashed text-xs font-medium transition-colors hover:border-[#5C4EE5]/50 hover:text-[#5C4EE5]"
                  style={{ borderColor: "#D5C7B8", color: "#8C7B6E" }}>
                  <Plus className="w-3.5 h-3.5" /> Add Staff
                </button>
              </div>
            )}

            {/* ── Data tab ── */}
            {formTab === "data" && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl border space-y-2.5" style={{ background: "#FAF7F3", borderColor: "#E8DDD2" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">System Data</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Flo Study ID</span>
                    <span className="font-mono font-semibold text-gray-700">{panel === "edit" && editStudy ? `FLO-${editStudy.id.padStart(4, "0")}` : "Auto-generated on save"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Study Creation Date</span>
                    <span className="font-semibold text-gray-700">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
                <FormField label="Target Enrollment">
                  <input type="number" value={form.enrollmentTarget} onChange={e => setField("enrollmentTarget", e.target.value)} placeholder="0" className={inputCls} style={inputStyle} />
                </FormField>
                <div className="pt-2 border-t" style={{ borderColor: "#EDE5DA" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Milestone Tracking</div>
                  <p className="text-xs text-gray-400 mb-3">Record key study milestone dates.</p>
                  <div className="space-y-2">
                    {MILESTONES.map(m => (
                      <div key={m.id} className="flex items-center gap-3">
                        <label className="text-xs text-gray-600 flex-1 min-w-0 truncate">{m.label}</label>
                        <input type="date" value={form.milestones[m.id] ?? ""} onChange={e => setField("milestones", { ...form.milestones, [m.id]: e.target.value })}
                          className="text-xs border rounded-lg px-2 py-1.5 focus:outline-none w-36 flex-shrink-0"
                          style={{ borderColor: form.milestones[m.id] ? PRIMARY : "#E3D8CC", color: "#1A1511" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t flex-shrink-0" style={{ borderColor: "#EDE5DA", background: "#FAF7F3" }}>
            <button onClick={() => setPanel(null)} className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: "#E3D8CC", color: "#6B7280" }}>Cancel</button>
            <button onClick={saveStudy} className="px-5 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity" style={{ background: PRIMARY }}>
              {panel === "create" ? "Create Study" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
