import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validEmail = "francis@getfullsuite.com";
    const validPassword = "password";

    if (email !== validEmail || password !== validPassword) {
      toast.error("Invalid email or password");
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
  };

  return (
    <div className="relative min-h-screen w-screen">
      <div
        className="relative z-10 min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: "#5FB3C5" }}
      >
        <div
          className="w-full max-w-sm 2xl:max-w-xl rounded-2xl p-8 2xl:p-12 shadow-2xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex justify-center items-center mb-6 mt-4">
            <div className="relative">
              <div
                className="w-25 h-25 2xl:w-28 2xl:h-28 rounded-full flex items-center justify-center shadow-xl relative z-10"
                style={{ backgroundColor: "rgba(46, 153, 176, 0.95)" }}
              >
                <img
                  src="/assets/Suitetest.png"
                  alt="SuiteTest Logo"
                  className="w-16 h-16 2xl:w-20 2xl:h-20 object-contain"
                />
              </div>

              {/* FullSuite Logo - No background, just the logo with shadow */}
              <div
                className="absolute bottom-0 right-0 left-14 w-10 h-10 2xl:w-14 2xl:h-14 flex items-center justify-center"
                style={{
                  transform: "translate(35%, 35%)",
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                }}
              >
                <img
                  src="/assets/Suitelifer.png"
                  alt="FullSuite Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8 2xl:mb-10">
            <div className="text-white text-xl 2xl:text-3xl font-light tracking-wide">
              Welcome, Admin!
            </div>
            <div className="text-white/90 text-xs 2xl:text-md font-light mt-1">
              Oversee. Organize. Optimize.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-sm mb-2 pl-1 2xl:text-lg font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="francis@getfullsuite.com"
                  className="w-full px-4 py-3.5 2xl:py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 placeholder-gray-400"
                  style={{ backgroundColor: "#E8F4F6" }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-2 pl-1 2xl:text-lg font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 2xl:py-4 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 placeholder-gray-400"
                  style={{ backgroundColor: "#E8F4F6" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-6 2xl:pt-8">
              <button
                type="submit"
                className="w-full text-white font-semibold py-4 2xl:py-5 rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 2xl:text-xl"
                style={{
                  backgroundColor: "#2E99B0",
                  boxShadow: "0 4px 15px rgba(46, 153, 176, 0.4)",
                }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
