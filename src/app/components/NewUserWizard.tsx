import { useState } from "react";
import {
  X, ChevronRight, Check, User, GraduationCap, Layers,
  Building2, ClipboardCheck, Upload, Plus, Trash2, BookOpen,
  Shield, Award
} from "lucide-react";

const PRIMARY    = "#5C4EE5";
const PAGE_BG    = "#F2EDE6";
const CARD_BG    = "#FFFCF7";
const BORDER     = "#EDE5DA";
const BORDER2    = "#E3D8CC";
const TEXT_DARK  = "#2D1F12";
const TEXT_MID   = "#3D3028";
const TEXT_MUTED = "#9CA3AF";
const GREEN_BG   = "#ECFDF5";
const GREEN_TXT  = "#059669";

type RoleBadge = "PI" | "Sub-I" | "CRC" | "RN" | "Data Manager" | "Coordinator";

const ROLE_COLORS: Record<RoleBadge, { bg: string; text: string }> = {
  "PI":           { bg: "#EDE9FF", text: "#5C4EE5" },
  "Sub-I":        { bg: "#E8F0FE", text: "#1D4ED8" },
  "CRC":          { bg: "#E6F7F3", text: "#0D7A5F" },
  "RN":           { bg: "#FEE8ED", text: "#9B2335" },
  "Data Manager": { bg: "#FFF0E6", text: "#B45309" },
  "Coordinator":  { bg: "#F3E8FF", text: "#7E22CE" },
};

interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  role: RoleBadge | "";
  // training
  assignedAcademy: string[];
  assignedUniversity: string[];
  gcpDueDate: string;
  // roles & studies
  studyAssignments: { study: string; role: RoleBadge | ""; binderRole: string; access: "Full" | "Limited" | "Read-Only" }[];
  // org
  site: string;
  reportsTo: string;
  accessLevel: "Full" | "Standard" | "Read-Only";
}

const DEPARTMENTS = ["Oncology", "Cardiology", "Neurology", "Infectious Disease", "Clinical Ops", "Regulatory", "Data Management"];
const ROLES: RoleBadge[] = ["PI", "Sub-I", "CRC", "RN", "Data Manager", "Coordinator"];
const SITES = ["Main Campus — Northwestern Memorial", "North Shore — Evanston", "South Loop — Rush University", "West Campus — Loyola"];
const MANAGERS = ["Dr. Amara Okafor", "Dr. Sofia Martinez", "Sarah Chen", "Rachel Huang"];
const STUDIES  = ["JAVAHEART", "ONCOVAULT", "NEUROPILOT", "DIASOLVE", "RHEUMATH", "ASTHMAPLUS"];

const ACADEMY_COURSES = [
  { id: "ac1", name: "eBinders Fundamentals", duration: "2h 30m", required: true },
  { id: "ac2", name: "eConsent Overview", duration: "1h 15m", required: false },
  { id: "ac3", name: "Regulatory Document Management", duration: "3h 00m", required: true },
  { id: "ac4", name: "GCP Refresher 2026", duration: "4h 00m", required: true },
  { id: "ac5", name: "Monitoring Visit Prep", duration: "2h 00m", required: false },
  { id: "ac6", name: "Site Feasibility Basics", duration: "1h 45m", required: false },
];

const UNI_PATHS = [
  { id: "uf1", name: "Clinical Research Coordination Certificate", level: "Foundation", modules: 8 },
  { id: "uf2", name: "ICH-GCP E6 R3 Deep Dive", level: "Advanced", modules: 6 },
  { id: "uf3", name: "Protocol Deviation Management", level: "Advanced", modules: 5 },
];

const BINDER_ROLES: Record<RoleBadge, string[]> = {
  "PI":           ["Principal Investigator", "Authorized Signatory"],
  "Sub-I":        ["Sub-Investigator", "Authorized Signatory"],
  "CRC":          ["Regulatory Coordinator", "Study Coordinator", "Observer"],
  "RN":           ["Study Nurse", "Observer"],
  "Data Manager": ["Data Coordinator", "Observer"],
  "Coordinator":  ["Site Coordinator", "Observer"],
};

const STEPS = [
  { id: 1, title: "Basic Info",        icon: User,           desc: "Identity and contact details" },
  { id: 2, title: "Training",          icon: GraduationCap,  desc: "Assign courses and certification" },
  { id: 3, title: "Roles & Studies",   icon: Layers,         desc: "Assign study roles" },
  { id: 4, title: "Organization",      icon: Building2,      desc: "Link to site and org hierarchy" },
  { id: 5, title: "Review",            icon: ClipboardCheck, desc: "Confirm and create" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
      {STEPS.map((step, i) => {
        const done    = current > step.id;
        const active  = current === step.id;
        const Icon    = step.icon;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 transition-all"
                style={done
                  ? { background: GREEN_TXT, color: "white" }
                  : active
                  ? { background: PRIMARY, color: "white" }
                  : { background: BORDER, color: TEXT_MUTED }}
              >
                {done ? <Check size={14} /> : <Icon size={14} />}
              </div>
              <span className="text-[10px] font-medium mt-1 whitespace-nowrap" style={{ color: active ? PRIMARY : done ? GREEN_TXT : TEXT_MUTED }}>
                {step.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 mb-4" style={{ background: done ? GREEN_TXT : BORDER }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: TEXT_DARK }}>
        {label}{required && <span className="ml-0.5" style={{ color: "#DC2626" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: `1px solid ${BORDER2}`,
  background: CARD_BG,
  color: TEXT_DARK,
  fontSize: 13,
  outline: "none",
} as React.CSSProperties;

const selectStyle = { ...inputStyle, appearance: "none" as const };

// ── Step 1: Basic Info ────────────────────────────────────────────────────
function Step1({ form, update }: { form: NewUserForm; update: (k: keyof NewUserForm, v: any) => void }) {
  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" required>
          <input style={inputStyle} value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="First name" />
        </Field>
        <Field label="Last Name" required>
          <input style={inputStyle} value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Last name" />
        </Field>
      </div>
      <Field label="Email Address" required>
        <input style={inputStyle} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="user@sitex.org" />
      </Field>
      <Field label="Phone Number">
        <input style={inputStyle} type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+1 (312) 555-0000" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Department" required>
          <select style={selectStyle} value={form.department} onChange={e => update("department", e.target.value)}>
            <option value="">Select department…</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Job Title">
          <input style={inputStyle} value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Lead CRC" />
        </Field>
      </div>
      <Field label="Primary Role" required>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map(r => {
            const c = ROLE_COLORS[r];
            const selected = form.role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => update("role", r)}
                className="py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left"
                style={selected
                  ? { background: c.bg, color: c.text, border: `2px solid ${c.text}` }
                  : { border: `1px solid ${BORDER}`, color: TEXT_MID, background: CARD_BG }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </Field>
      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BORDER }}>
          <Upload size={18} style={{ color: TEXT_MUTED }} />
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: TEXT_DARK }}>Upload CV (optional)</p>
          <p className="text-[11px] mt-0.5" style={{ color: TEXT_MUTED }}>PDF or DOCX · will be filed across assigned studies</p>
          <button className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}>
            Browse files
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Training ──────────────────────────────────────────────────────
function Step2({ form, update }: { form: NewUserForm; update: (k: keyof NewUserForm, v: any) => void }) {
  function toggleAcademy(id: string) {
    update("assignedAcademy", form.assignedAcademy.includes(id)
      ? form.assignedAcademy.filter(x => x !== id)
      : [...form.assignedAcademy, id]);
  }
  function toggleUni(id: string) {
    update("assignedUniversity", form.assignedUniversity.includes(id)
      ? form.assignedUniversity.filter(x => x !== id)
      : [...form.assignedUniversity, id]);
  }

  return (
    <div className="p-6 space-y-5">
      {/* GCP due date */}
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "#FFF7ED", border: "1px solid #FDE68A" }}>
        <Shield size={18} style={{ color: "#D97706", flexShrink: 0 }} />
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: TEXT_DARK }}>GCP Training Due Date</p>
          <p className="text-[11px]" style={{ color: TEXT_MUTED }}>Set a deadline for required GCP completion</p>
        </div>
        <input
          type="date"
          value={form.gcpDueDate}
          onChange={e => update("gcpDueDate", e.target.value)}
          style={{ ...inputStyle, width: "auto" }}
        />
      </div>

      {/* Flo Academy */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={15} style={{ color: PRIMARY }} />
          <p className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Flo Academy Courses</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#EDE9FF", color: PRIMARY }}>
            {form.assignedAcademy.length} selected
          </span>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          {ACADEMY_COURSES.map((course, i) => {
            const checked = form.assignedAcademy.includes(course.id);
            return (
              <label
                key={course.id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{
                  borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                  background: checked ? "#F8F7FF" : CARD_BG,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAcademy(course.id)}
                  className="w-3.5 h-3.5 accent-[#5C4EE5] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: checked ? PRIMARY : TEXT_DARK }}>{course.name}</p>
                  <p className="text-[10px]" style={{ color: TEXT_MUTED }}>{course.duration}</p>
                </div>
                {course.required && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "#FEF2F2", color: "#DC2626" }}>Required</span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Flo University */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award size={15} style={{ color: "#7E22CE" }} />
          <p className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Flo University Pathways</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: BORDER, color: TEXT_MID }}>
            {form.assignedUniversity.length} selected
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {UNI_PATHS.map(path => {
            const checked = form.assignedUniversity.includes(path.id);
            const levelColors: Record<string, { bg: string; text: string }> = {
              Foundation: { bg: "#E6F7F3", text: "#0D7A5F" },
              Advanced:   { bg: "#EEF2FF", text: "#4338CA" },
            };
            const lc = levelColors[path.level] ?? { bg: BORDER, text: TEXT_MID };
            return (
              <label
                key={path.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors"
                style={{ border: `1px solid ${checked ? PRIMARY : BORDER}`, background: checked ? "#F8F7FF" : CARD_BG }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleUni(path.id)}
                  className="w-3.5 h-3.5 accent-[#5C4EE5] flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: checked ? PRIMARY : TEXT_DARK }}>{path.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: TEXT_MUTED }}>{path.modules} modules</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: lc.bg, color: lc.text }}>{path.level}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Roles & Studies ───────────────────────────────────────────────
function Step3({ form, update }: { form: NewUserForm; update: (k: keyof NewUserForm, v: any) => void }) {
  function addAssignment() {
    update("studyAssignments", [...form.studyAssignments, { study: "", role: "" as RoleBadge | "", binderRole: "", access: "Full" }]);
  }
  function removeAssignment(i: number) {
    update("studyAssignments", form.studyAssignments.filter((_, idx) => idx !== i));
  }
  function updateAssignment(i: number, key: string, val: string) {
    const updated = form.studyAssignments.map((a, idx) =>
      idx === i ? { ...a, [key]: val, ...(key === "role" ? { binderRole: "" } : {}) } : a
    );
    update("studyAssignments", updated);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: TEXT_DARK }}>Study Role Assignments</p>
          <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>Assign this person to studies with specific roles and access levels</p>
        </div>
        <button
          type="button"
          onClick={addAssignment}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ background: PRIMARY, color: "white" }}
        >
          <Plus size={12} /> Add Study
        </button>
      </div>

      {form.studyAssignments.length === 0 ? (
        <div className="rounded-xl p-8 flex flex-col items-center gap-2" style={{ border: `1px dashed ${BORDER2}` }}>
          <BookOpen size={24} style={{ color: TEXT_MUTED }} />
          <p className="text-xs font-medium" style={{ color: TEXT_DARK }}>No studies assigned yet</p>
          <p className="text-[11px]" style={{ color: TEXT_MUTED }}>You can skip this step and assign studies later from the user's profile.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {form.studyAssignments.map((a, i) => {
            const binderOptions = a.role && BINDER_ROLES[a.role as RoleBadge] ? BINDER_ROLES[a.role as RoleBadge] : [];
            return (
              <div key={i} className="rounded-xl p-4" style={{ border: `1px solid ${BORDER}`, background: PAGE_BG }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold" style={{ color: TEXT_MID }}>Assignment {i + 1}</span>
                  <button type="button" onClick={() => removeAssignment(i)} className="p-1 rounded hover:bg-red-50">
                    <Trash2 size={13} style={{ color: "#DC2626" }} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: TEXT_MUTED }}>Study</label>
                    <select style={selectStyle} value={a.study} onChange={e => updateAssignment(i, "study", e.target.value)}>
                      <option value="">Select study…</option>
                      {STUDIES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: TEXT_MUTED }}>Role</label>
                    <select style={selectStyle} value={a.role} onChange={e => updateAssignment(i, "role", e.target.value)}>
                      <option value="">Select role…</option>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: TEXT_MUTED }}>Binder Role</label>
                    <select style={selectStyle} value={a.binderRole} onChange={e => updateAssignment(i, "binderRole", e.target.value)} disabled={!a.role}>
                      <option value="">Select binder role…</option>
                      {binderOptions.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: TEXT_MUTED }}>Access Level</label>
                    <select style={selectStyle} value={a.access} onChange={e => updateAssignment(i, "access", e.target.value)}>
                      <option>Full</option>
                      <option>Limited</option>
                      <option>Read-Only</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin binder role */}
      <div className="rounded-xl p-4" style={{ border: `1px solid ${BORDER}`, background: CARD_BG }}>
        <p className="text-xs font-semibold mb-3" style={{ color: TEXT_DARK }}>Administrative Binder Access</p>
        <div className="space-y-2">
          {["Site Master File", "Regulatory Binder — Admin", "Staff Credentials Binder"].map(binder => (
            <label key={binder} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 accent-[#5C4EE5]" />
              <span className="text-xs" style={{ color: TEXT_DARK }}>{binder}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Organization ──────────────────────────────────────────────────
function Step4({ form, update }: { form: NewUserForm; update: (k: keyof NewUserForm, v: any) => void }) {
  return (
    <div className="p-6 space-y-4">
      <Field label="Site Location" required>
        <select style={selectStyle} value={form.site} onChange={e => update("site", e.target.value)}>
          <option value="">Select site…</option>
          {SITES.map(s => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Reports To">
        <select style={selectStyle} value={form.reportsTo} onChange={e => update("reportsTo", e.target.value)}>
          <option value="">Select manager…</option>
          {MANAGERS.map(m => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Platform Access Level">
        <div className="grid grid-cols-3 gap-2">
          {(["Full", "Standard", "Read-Only"] as const).map(level => (
            <button
              key={level}
              type="button"
              onClick={() => update("accessLevel", level)}
              className="py-2 px-3 rounded-lg text-xs font-semibold transition-all"
              style={form.accessLevel === level
                ? { background: "#EDE9FF", color: PRIMARY, border: `2px solid ${PRIMARY}` }
                : { border: `1px solid ${BORDER}`, color: TEXT_MID, background: CARD_BG }}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: TEXT_MUTED }}>
          {form.accessLevel === "Full" ? "Full access to all studies and administrative features"
            : form.accessLevel === "Standard" ? "Access to assigned studies and standard features"
            : "Read-only access to assigned content"}
        </p>
      </Field>
      <div className="rounded-xl p-4" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-semibold mb-3" style={{ color: TEXT_DARK }}>Invitation & Onboarding</p>
        <div className="space-y-2">
          {[
            { label: "Send registration email invitation", checked: true },
            { label: "Require email verification before login", checked: true },
            { label: "Include training assignment in invitation", checked: true },
            { label: "Notify site director on account activation", checked: false },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked={opt.checked} className="w-3.5 h-3.5 accent-[#5C4EE5]" />
              <span className="text-xs" style={{ color: TEXT_DARK }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Review ────────────────────────────────────────────────────────
function Step5({ form }: { form: NewUserForm }) {
  const fullName = `${form.firstName} ${form.lastName}`.trim() || "—";
  const roleColor = form.role ? ROLE_COLORS[form.role as RoleBadge] : null;

  return (
    <div className="p-6 space-y-4">
      {/* Identity card */}
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{ background: PRIMARY, fontSize: 16 }}
        >
          {form.firstName?.[0] ?? "?"}
          {form.lastName?.[0] ?? ""}
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: TEXT_DARK }}>{fullName}</p>
          <p className="text-xs" style={{ color: TEXT_MUTED }}>{form.email || "—"}</p>
          <div className="flex items-center gap-2 mt-1">
            {roleColor && form.role && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: roleColor.bg, color: roleColor.text }}>
                {form.role}
              </span>
            )}
            <span className="text-[10px]" style={{ color: TEXT_MUTED }}>{form.department || "No dept"}</span>
          </div>
        </div>
      </div>

      {/* Summary rows */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {[
          { label: "Site",          value: form.site || "Not set" },
          { label: "Reports To",    value: form.reportsTo || "Not set" },
          { label: "Access Level",  value: form.accessLevel },
          { label: "GCP Due Date",  value: form.gcpDueDate || "Not set" },
          { label: "Flo Academy",   value: form.assignedAcademy.length > 0 ? `${form.assignedAcademy.length} courses assigned` : "None assigned" },
          { label: "Flo University",value: form.assignedUniversity.length > 0 ? `${form.assignedUniversity.length} pathways assigned` : "None assigned" },
          { label: "Studies",       value: form.studyAssignments.filter(a => a.study).length > 0
              ? form.studyAssignments.filter(a => a.study).map(a => a.study).join(", ")
              : "None assigned" },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            className="flex items-center px-4 py-2.5"
            style={{ borderBottom: i < 6 ? `1px solid ${BORDER}` : "none", background: i % 2 === 0 ? CARD_BG : PAGE_BG }}
          >
            <span className="text-[11px] font-semibold w-32 flex-shrink-0" style={{ color: TEXT_MUTED }}>{label}</span>
            <span className="text-xs" style={{ color: TEXT_DARK }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: GREEN_BG, border: "1px solid #A7F3D0" }}>
        <Check size={15} style={{ color: GREEN_TXT, flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs leading-relaxed" style={{ color: "#065F46" }}>
          A registration email will be sent to <strong>{form.email || "the provided email"}</strong>. Once they complete
          registration, their account will be activated with the roles and training you've configured.
        </p>
      </div>
    </div>
  );
}

// ── Wizard ────────────────────────────────────────────────────────────────
interface NewUserWizardProps {
  onClose: () => void;
  onCreate: (name: string, role: RoleBadge | "") => void;
}

export function NewUserWizard({ onClose, onCreate }: NewUserWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewUserForm>({
    firstName: "", lastName: "", email: "", phone: "", department: "", title: "", role: "",
    assignedAcademy: ["ac1", "ac3", "ac4"],
    assignedUniversity: [],
    gcpDueDate: "",
    studyAssignments: [],
    site: "", reportsTo: "", accessLevel: "Standard",
  });

  function update(k: keyof NewUserForm, v: any) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function handleCreate() {
    onCreate(`${form.firstName} ${form.lastName}`.trim() || "New User", form.role);
    onClose();
  }

  const canAdvance = (() => {
    if (step === 1) return form.firstName.trim() && form.email.trim() && form.department && form.role;
    return true;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}`, width: 600, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${BORDER}`, background: PAGE_BG }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: TEXT_DARK }}>Add New Staff Member</h2>
            <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>Step {step} of {STEPS.length} — {STEPS[step - 1].desc}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={16} style={{ color: TEXT_MUTED }} />
          </button>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && <Step1 form={form} update={update} />}
          {step === 2 && <Step2 form={form} update={update} />}
          {step === 3 && <Step3 form={form} update={update} />}
          {step === 4 && <Step4 form={form} update={update} />}
          {step === 5 && <Step5 form={form} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            className="text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ border: `1px solid ${BORDER}`, color: TEXT_MID }}
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex items-center gap-1">
            {STEPS.map(s => (
              <div key={s.id} className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: s.id === step ? PRIMARY : BORDER }} />
            ))}
          </div>
          {step < STEPS.length ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-opacity"
              style={{ background: PRIMARY, color: "white", opacity: canAdvance ? 1 : 0.4 }}
            >
              Continue <ChevronRight size={13} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg"
              style={{ background: GREEN_TXT, color: "white" }}
            >
              <Check size={13} /> Create & Send Invite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
