import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    // const isLoggedIn = await fetchCurrentUser
    const data = await login({
      email: "francis.darang@getfullsuite.com",
      password: "password",
    });

    if (data.isSuccess) {
      toast.success(data.message);
      navigate("/admin/dashboard");
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin/dashboard");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Mock Admin Login</h1>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg"
      >
        Login as Admin
      </button>
    </div>
  );
}

export default LoginPage;
