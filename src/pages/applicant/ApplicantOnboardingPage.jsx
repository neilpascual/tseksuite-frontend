import Footer from "../../components/applicant/Footer";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "@/components/ConfimationModal";
import toast from "react-hot-toast";
import OnboardingMessage from "../../components/applicant/OnboardingMessage";
import { getAllDepartments, submitExaminerData, validateInvitationLink } from "../../../api/api";

const ApplicantOnboardingPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    validateInviteToken();
    fetchDepartments();
  }, [token]);

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepts(true);
      const response = await getAllDepartments()
      if (!response) {
        throw new Error("Failed to fetch departments");
      }

      // Filter only active departments
      const activeDepartments = response.filter((dept) => dept.is_active);
      setDepartments(activeDepartments);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    } finally {
      setIsLoadingDepts(false);
    }
  };

  const validateInviteToken = async () => {
    if (!token) {
      setError("Invalid invitation link. Please use the link provided to you.");
      setIsValidating(false);
      return;
    }

    try {
      const response = await validateInvitationLink(token)

      if (!response.status === 200) {

        if (response.status === 404) {
          throw new Error(
            "Invitation validation endpoint not found. Please ensure your backend has the /api/invitation/validate/:token route."
          );
        }

        throw new Error("Invalid or expired invitation link");
      }

      if (!response) {
        console.error("No data object in result:", result);
        throw new Error("Invalid invitation data received from server");
      }

      setInviteData(response);

      const deptId =
        response.dept_id ||
        response.department_id ||
        response.deptId ||
        "";

      setFormData((prev) => ({
        ...prev,
        department: deptId ? deptId.toString() : "",
      }));

      setIsValidating(false);
    } catch (err) {
      console.error("Token validation error:", err);
      setError(err.message || "Failed to validate invitation");
      setIsValidating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!inviteData) {
      //TODO
      // wag alert dito ayusin UI
      toast.error("Invalid invitation. Please use a valid invite link.");
      return;
    }

    if (!formData.firstName.trim()) {
      toast.error("Please enter your First name");
      return;
    }

    if (!formData.lastName.trim()) {
      toast.error("Please enter your Last name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email Address required!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.department) {
      // TODO
      // pati dito
      toast.error("Please select a department");
      return;
    }

    setIsSubmitting(true);

    try {
      const applicantData = {
        token: token,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      };

      const result = await submitExaminerData(applicantData)

      const applicantDataForStorage = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        examiner_id: result.examiner.examiner_id,
      };

      if (localStorage.getItem("applicantData")) {
        localStorage.removeItem("applicantData");
      }

      if (localStorage.getItem("selectedQuiz")) {
        localStorage.removeItem("selectedQuiz");
      }

      // Validate if there the localStorage Exists and if so then override
      localStorage.setItem(
        "applicantData",
        JSON.stringify(applicantDataForStorage)
      );
      localStorage.setItem("selectedQuiz", JSON.stringify(result.quiz));

      navigate("/test-instructions", {
        state: {
          applicantData: applicantDataForStorage,
          selectedQuiz: result.quiz,
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div
          className="max-w-md w-full bg-white rounded-2xl p-8 text-center border border-gray-200"
          style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Invitation
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Please contact your recruiter for a new invitation link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <ConfirmationModal
          title="Proceed to Next Step?"
          message="Please confirm that your details are correct."
          checklist={[
            `Name: ${formData.firstName} ${formData.lastName}`,
            `Email: ${formData.email}`,
          ]}
          confirmLabel="Yes, Proceed"
          cancelLabel="Cancel"
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            handleSubmit();
          }}
          confirmColor="green"
        />
      )}

      <div
        className="min-h-screen bg-gray-50 flex flex-col "
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <OnboardingMessage />
            <div className="w-full sm:w-96">
              <div
                className="bg-white rounded-2xl p-6 sm:p-8 relative border border-gray-200 mb-6 sm:mb-0"
                style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
              >
                <h2 className="text-xl font-bold mb-1">Examinee Form</h2>
                <p className="text-gray-500 text-xs mb-6">
                  Please provide accurate details.
                </p>
                <div>
                  <div className="mb-5">
                    <label className="block text-xs font-bold mb-2 text-gray-900">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md mb-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 disabled:bg-gray-100"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="mb-6 sm:mb-4">
                    <label className="block text-xs font-bold mb-2 text-gray-900">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 disabled:bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please enter your email address
                    </p>
                  </div>
                  <div className="mb-6 sm:mb-6">
                    <label className="block text-[11px] sm:text-xs font-bold mb-2 text-gray-900">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={
                        inviteData?.dept_id || isLoadingDepts || isSubmitting
                      }
                      className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-md bg-white text-gray-700 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="">
                        {isLoadingDepts
                          ? "Loading departments..."
                          : "Select department"}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </option>
                      ))}
                    </select>
                    {inviteData?.dept_id ? (
                      <p className="text-xs text-gray-500 mt-1">
                        Department set by invitation
                      </p>
                    ) : (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ Please select your department
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:flex justify-end">
                    <button
                      // onClick={handleSubmit}
                      onClick={() => setShowModal(true)}
                      disabled={isSubmitting}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white
                      font-semibold px-10 py-3 rounded-lg shadow-lg
                      transition-colors duration-200 flex items-center gap-2
                      text-sm group disabled:bg-gray-400
                      disabled:cursor-not-allowed"
                      style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
                    >
                      {isSubmitting ? "Submitting..." : "Proceed"}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="sm:hidden w-full">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-[18px] font-semibold w-full py-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm group disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
                >
                  {isSubmitting ? "Submitting..." : "Proceed"}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-6">
          <p className="text-xs text-center text-gray-700 max-w-5xl mx-auto leading-relaxed">
            <span className="font-bold">Data Privacy Notice:</span> All
            information collected through this form, including your email
            address, will be treated with strict confidentiality and used solely
            for legitimate company purposes, such as recruitment evaluation and
            communication of results.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ApplicantOnboardingPage;
