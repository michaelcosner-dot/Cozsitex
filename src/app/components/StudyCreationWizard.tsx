import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Check, FileText, Users, DollarSign, ClipboardCheck } from "lucide-react";

const STEPS = [
  { id: 1, title: "Basic Information", description: "Protocol details and study metadata" },
  { id: 2, title: "Study Team", description: "PI and key personnel assignment" },
  { id: 3, title: "Enrollment & Dates", description: "Target enrollment and key milestones" },
  { id: 4, title: "Link Products", description: "Connect to point solutions" },
  { id: 5, title: "Review & Create", description: "Confirm study details" },
];

export function StudyCreationWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    protocolNumber: "",
    studyTitle: "",
    sponsor: "",
    therapeuticArea: "",
    phase: "",
    status: "Startup",
    location: "",
    department: "",
    pi: "",
    cro: "",
    targetEnrollment: "",
    irbOfRecord: "",
    irbApprovalDate: "",
    siteActivationDate: "",
    estimatedCompletion: "",
    linkEBinders: false,
    linkEConsent: false,
    linkBudget: false,
    linkMonitoring: false,
    selectedBinder: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    navigate("/study/001");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Navigation */}
      <Link to="/director" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Create New Study</h1>
        <p className="text-gray-600">Master a new study in the SiteX platform</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden md:block">{step.description}</div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}`}
                  style={{ marginTop: "-24px" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Basic Study Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Protocol Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.protocolNumber}
                  onChange={(e) => updateFormData("protocolNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PROTO-2024-XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sponsor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sponsor}
                  onChange={(e) => updateFormData("sponsor", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sponsor name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Study Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studyTitle}
                onChange={(e) => updateFormData("studyTitle", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full study title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Therapeutic Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.therapeuticArea}
                  onChange={(e) => updateFormData("therapeuticArea", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select therapeutic area</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phase <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.phase}
                  onChange={(e) => updateFormData("phase", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select phase</option>
                  <option value="Phase I">Phase I</option>
                  <option value="Phase II">Phase II</option>
                  <option value="Phase III">Phase III</option>
                  <option value="Phase IV">Phase IV</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select location</option>
                  <option value="Main Campus">Main Campus</option>
                  <option value="North Campus">North Campus</option>
                  <option value="South Campus">South Campus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => updateFormData("department", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Department name"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Study Team Assignment</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Principal Investigator <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pi}
                onChange={(e) => updateFormData("pi", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select PI</option>
                <option value="Dr. Martinez">Dr. Martinez</option>
                <option value="Dr. Chen">Dr. Chen</option>
                <option value="Dr. Patel">Dr. Patel</option>
                <option value="Dr. Kim">Dr. Kim</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CRO (Optional)</label>
              <input
                type="text"
                value={formData.cro}
                onChange={(e) => updateFormData("cro", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contract Research Organization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                IRB of Record <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.irbOfRecord}
                onChange={(e) => updateFormData("irbOfRecord", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IRB-XXXX-XXXX"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Enrollment & Key Dates</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Enrollment <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.targetEnrollment}
                onChange={(e) => updateFormData("targetEnrollment", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Number of subjects"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">IRB Approval Date</label>
                <input
                  type="date"
                  value={formData.irbApprovalDate}
                  onChange={(e) => updateFormData("irbApprovalDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Activation Date</label>
                <input
                  type="date"
                  value={formData.siteActivationDate}
                  onChange={(e) => updateFormData("siteActivationDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estimated Completion</label>
                <input
                  type="date"
                  value={formData.estimatedCompletion}
                  onChange={(e) => updateFormData("estimatedCompletion", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Link to Point Solutions</h2>
            <p className="text-sm text-gray-600 mb-4">
              Connect this study to existing point solution products. You can skip this step and link products later.
            </p>

            <div className="space-y-3">
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.linkEBinders}
                    onChange={(e) => updateFormData("linkEBinders", e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">eBinders</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Regulatory document management system</p>
                    {formData.linkEBinders && (
                      <select
                        value={formData.selectedBinder}
                        onChange={(e) => updateFormData("selectedBinder", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select existing binder/folder</option>
                        <option value="binder1">Binder: Cardiology 2024</option>
                        <option value="binder2">Binder: Clinical Trials - Q1</option>
                        <option value="create">Create new binder</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.linkEConsent}
                    onChange={(e) => updateFormData("linkEConsent", e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold">eConsent</h3>
                    </div>
                    <p className="text-sm text-gray-600">Electronic informed consent platform</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.linkBudget}
                    onChange={(e) => updateFormData("linkBudget", e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">Budget & Contracting</h3>
                    </div>
                    <p className="text-sm text-gray-600">Financial management and budgeting</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.linkMonitoring}
                    onChange={(e) => updateFormData("linkMonitoring", e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ClipboardCheck className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold">Monitoring</h3>
                    </div>
                    <p className="text-sm text-gray-600">Site monitoring and visit management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-4">Review & Confirm</h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Study Information</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Protocol Number:</span>{" "}
                  <span className="font-medium">{formData.protocolNumber || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sponsor:</span>{" "}
                  <span className="font-medium">{formData.sponsor || "—"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Study Title:</span>{" "}
                  <span className="font-medium">{formData.studyTitle || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Therapeutic Area:</span>{" "}
                  <span className="font-medium">{formData.therapeuticArea || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phase:</span>{" "}
                  <span className="font-medium">{formData.phase || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>{" "}
                  <span className="font-medium">{formData.location || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Department:</span>{" "}
                  <span className="font-medium">{formData.department || "—"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Study Team</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Principal Investigator:</span>{" "}
                  <span className="font-medium">{formData.pi || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">IRB of Record:</span>{" "}
                  <span className="font-medium">{formData.irbOfRecord || "—"}</span>
                </div>
                {formData.cro && (
                  <div className="col-span-2">
                    <span className="text-gray-600">CRO:</span> <span className="font-medium">{formData.cro}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Enrollment & Dates</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Target Enrollment:</span>{" "}
                  <span className="font-medium">{formData.targetEnrollment || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">IRB Approval:</span>{" "}
                  <span className="font-medium">{formData.irbApprovalDate || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Site Activation:</span>{" "}
                  <span className="font-medium">{formData.siteActivationDate || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Est. Completion:</span>{" "}
                  <span className="font-medium">{formData.estimatedCompletion || "—"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Connected Products</h3>
              <div className="flex flex-wrap gap-2">
                {formData.linkEBinders && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    eBinders
                  </span>
                )}
                {formData.linkEConsent && (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    eConsent
                  </span>
                )}
                {formData.linkBudget && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Budget
                  </span>
                )}
                {formData.linkMonitoring && (
                  <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                    <ClipboardCheck className="w-4 h-4" />
                    Monitoring
                  </span>
                )}
                {!formData.linkEBinders &&
                  !formData.linkEConsent &&
                  !formData.linkBudget &&
                  !formData.linkMonitoring && (
                    <span className="text-sm text-gray-500">No products linked (can be added later)</span>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep < STEPS.length ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Create Study
          </button>
        )}
      </div>
    </div>
  );
}
