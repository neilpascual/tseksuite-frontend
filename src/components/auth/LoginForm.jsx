import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validEmail = "admin@getfullsuite.com";
    const validPassword = "password";

    if (email !== validEmail || password !== validPassword) {
      toast.error("Invalid email or password");
      setIsLoading(false);
      return;
    }

    const data = await login({
      email,
      password,
    });

    if (data.isSuccess) {
      toast.success(data.message);
      navigate("/admin/dashboard");
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
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
        <div className="w-full max-w-md 2xl:max-w-lg">
          {/* Logo Section */}
          <div className="flex justify-center items-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 2xl:w-28 2xl:h-28 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20">
                <img
                  src="/assets/Suitetest.png"
                  alt="SuiteTest Logo"
                  className="w-16 h-16 2xl:w-20 2xl:h-20 object-contain drop-shadow-lg"
                />
              </div>

              {/* FullSuite Logo */}
              <div className="absolute -bottom-5 -right-7 w-12 h-15 2xl:w-15 2xl:h-14 flex items-center justify-center bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/Suitelifer.png"
                  alt="FullSuite Logo"
                  className="w-8 h-8 2xl:w-10 2xl:h-12 object-contain"
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
              <h1 className="text-3xl 2xl:text-4xl font-bold text-white tracking-tight">
                Admin Portal
              </h1>
            </div>
            <p className="text-white/80 text-lg 2xl:text-xl font-light tracking-wide">
              Oversee • Organize • Optimize
            </p>
          </div>

          {/* Login Card */}
          <div
            className="rounded-3xl p-8 2xl:p-10 shadow-2xl border border-white/20 backdrop-blur-md"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium pl-1 2xl:text-base">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="francis@getfullsuite.com"
                    className="w-full px-5 py-4 2xl:py-5 rounded-2xl text-gray-800 focus:outline-none focus:ring-3 focus:ring-white/30 transition-all duration-300 placeholder-gray-500 bg-white/95 backdrop-blur-sm border border-white/30 shadow-lg group-hover:bg-white"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium pl-1 2xl:text-base">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 2xl:py-5 pr-12 rounded-2xl text-gray-800 focus:outline-none focus:ring-3 focus:ring-white/30 transition-all duration-300 placeholder-gray-500 bg-white/95 backdrop-blur-sm border border-white/30 shadow-lg group-hover:bg-white"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-lg hover:bg-white/50"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden text-white font-semibold py-4 2xl:py-5 rounded-2xl transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 2xl:text-lg"
                  style={{
                    background: "linear-gradient(135deg, #2E99B0, #1E7A8C)",
                    boxShadow: "0 8px 25px rgba(46, 153, 176, 0.4)",
                  }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-3">
                    <span>
                      {isLoading ? "Signing In..." : "Access Dashboard"}
                    </span>
                    {!isLoading && (
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">Secure Admin Access Only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
