import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthProvider";

const LoginForm = () => {
  const { formData, setFormData, isLoading, handleLogin } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#5FB3C5] via-[#4A9DB0] to-[#2E99B0] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex justify-center items-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20">
                <img
                  src="/assets/Suitetest.png"
                  alt="SuiteTest Logo"
                  className="w-16 h-16 object-contain drop-shadow-lg"
                />
              </div>

              {/* FullSuite Logo */}
              <div className="absolute -bottom-5 -right-7 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/Suitelifer.png"
                  alt="FullSuite Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white/20 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Admin Portal
              </h1>
            </div>
            <p className="text-white/80 text-lg font-light tracking-wide">
              Oversee • Organize • Optimize
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white text-sm mb-2 pl-1 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.user_email}
                  onChange={(e) =>
                    setFormData({ ...formData, user_email: e.target.value })
                  }
                  placeholder="enter your email"
                  className="w-full px-4 py-3.5 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 placeholder-gray-400"
                  style={{ backgroundColor: "#E8F4F6" }}
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      formData.user_email &&
                      formData.password
                    ) {
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm mb-2 pl-1 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 placeholder-gray-400"
                  style={{ backgroundColor: "#E8F4F6" }}
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      formData.user_email &&
                      formData.password
                    ) {
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full group relative overflow-hidden text-white font-semibold py-4 rounded-2xl transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: "linear-gradient(135deg, #2E99B0, #1E7A8C)",
                  boxShadow: "0 8px 25px rgba(46, 153, 176, 0.4)",
                }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                {/* Button content */}
                <div className="relative flex items-center justify-center gap-3">
                  <span>{isLoading ? "Signing In..." : "Login"}</span>
                  {!isLoading && (
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Secure access to your administration dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
