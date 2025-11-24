import { loginUser } from "../services/auth.service";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    user_email: "",
    password: "",
    service: "FU",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await loginUser(formData);
      const { token } = response.data;

      //decode the token to get user info
      const decoded = jwtDecode(token);

      localStorage.setItem("system_user_id", decoded.system_user_id);
      localStorage.setItem("token", token);

      setToken(token);

      navigate("/admin/dashboard");
    } catch (error) {
      console.log("Login error:", error);
      setError(error);
      toast.error(
        "Login failed. Please check your credentials and try again.",
        {
          style: { width: "300px" },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    error,
    setError,
    handleLogin,
    token,
    setToken,
  };
};

export default useAuth;
