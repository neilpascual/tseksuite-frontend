import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, loginUser } from '../../api/api'

export function useAuth() {
  const queryClient = useQueryClient();

  const authQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const login = async (loginCredentials) => {
    try {
      const data = await loginUser(loginCredentials);
      localStorage.setItem("token", data.token);

      await queryClient.invalidateQueries(["authUser"]);

      return { isSuccess: true, message: "Successfully logged in" };
    } catch (error) {
      return { isSuccess: false, message: error.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.removeQueries(["authUser"]);
  };

  return { ...authQuery, login, logout };
}
