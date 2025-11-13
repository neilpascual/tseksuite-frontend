import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showAltLayout, setShowAltLayout] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin/");
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
      navigate("/admin/");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="relative min-h-screen w-screen">
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{ backgroundColor: "#5FB3C5" }}
      >
        <div
          className="w-full max-w-sm 2xl:max-w-xl 2xl:max-h-[500px] rounded-lg p-12"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <h1 className="text-white text-4xl font-normal text-center mb-12 tracking-widest 2xl:text-6xl">
            LOGIN
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-xs mb-1.5 pl-1 2xl:text-xl">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 rounded-full bg-white text-gray-800 focus:outline-none "
                style={{ backgroundColor: "#E8F4F6" }}
                required
              />
            </div>
            <div className="mt-5">
              <label className="block text-white text-xs mb-1.5 pl-1 2xl:text-xl">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 pr-10 rounded-full bg-white text-gray-800 focus:outline-none"
                  style={{ backgroundColor: "#E8F4F6" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 text-gray-600"
                  style={{
                    right: "12px",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="pt-10 font-bold 2xl:text-2xl">
              <button
                type="submit"
                className="w-full text-white font-medium py-3.5 rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#2E99B0" }}
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
