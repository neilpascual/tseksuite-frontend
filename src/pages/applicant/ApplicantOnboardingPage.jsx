import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import Footer from "../../components/applicant/Footer";

const ApplicantOnboardingPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  const navigate = useNavigate(); // Add this hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (formData.firstName && formData.lastName && formData.email) {
      console.log("Form submitted:", formData);

      // You can save the form data to context, state management, or localStorage if needed
      // For example, using localStorage:
      localStorage.setItem("applicantData", JSON.stringify(formData));

      // Navigate to instructions page
      navigate("/instructions");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col font-['Poppins']"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left Section - Welcome Message */}
          <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8">
              <span className="text-cyan-600">Welcome,</span>{" "}
              <span className="text-black">Candidate!</span>
            </h1>

            <div className="space-y-4 lg:space-y-6 text-gray-800 text-sm sm:text-base">
              <p className="leading-relaxed">
                Thank you for your interest in joining our program. Please
                complete the form with accurate information
                <span className="font-semibold">
                  {" "}
                  — especially your email address, as it will be used to link
                  your account and test results.
                </span>
              </p>

              <p className="leading-relaxed">
                Once you've submitted your details, you'll receive access to
                your assessment. Make sure to take the test only once per
                applicant.
              </p>

              <p className="leading-relaxed">
                <span className="text-cyan-600 font-bold">Good luck</span>{" "}
                <span className="font-semibold">—</span> we're excited to see
                how you perform!
              </p>
            </div>
          </div>

          {/* Right Section - Application Form */}
          <div className="w-full sm:w-96">
            {/* Form Card */}
            <div
              className="bg-white rounded-2xl p-6 sm:p-8 relative border border-gray-200 mb-6 sm:mb-0"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              <h2 className="text-xl font-bold mb-1">Candidate Form</h2>
              <p className="text-gray-500 text-xs mb-6">
                Please provide accurate details.
              </p>

              <div>
                {/* Full Name */}
                <div className="mb-5">
                  <label className="block text-xs font-bold mb-2 text-gray-900">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md mb-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 font-['Poppins']"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 font-['Poppins']"
                  />
                </div>

                {/* Email Address */}
                <div className="mb-6 sm:mb-4">
                  <label className="block text-xs font-bold mb-2 text-gray-900">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 font-['Poppins']"
                  />
                </div>

                {/* Department */}
                {/* added Department Field */}
                <div className="mb-6 sm:mb-6">
                  <label className="block text-[11px] sm:text-xs font-bold mb-2 text-gray-900">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm sm:text-base border
                       border-gray-300 rounded-md focus:outline-none 
                       focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500
                        bg-white text-gray-700 font-['Poppins'] pr-10"
                  >
                    <option value="">Select department</option>
                    <option value="HR">Human Resources</option>
                    <option value="ENG">Engineering</option>
                    <option value="FN">Finance</option>
                    <option value="BO">Business Ops</option>
                  </select>
                </div>

                {/* Submit Button - Hidden on mobile, visible on sm+ */}
                <div className="hidden sm:flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white  font-semibold px-10 py-3 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm group"
                    style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
                  >
                    Proceed
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

            {/* Submit Button - Visible only on mobile, outside the form card */}
            <div className="sm:hidden w-full">
              <button
                onClick={handleSubmit}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-[18px] font-semibold w-full py-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm group"
                style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
              >
                Proceed
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

      {/* Data Privacy Notice */}
      <div className="bg-gray-50 px-4 py-6">
        <p className="text-xs text-center text-gray-700 max-w-5xl mx-auto leading-relaxed">
          <span className="font-bold">Data Privacy Notice:</span> All
          information collected through this form, including your email address,
          will be treated with strict confidentiality and used solely for
          legitimate company purposes, such as recruitment evaluation and
          communication of results.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ApplicantOnboardingPage;
