import { Navigate, Outlet } from "react-router";
import {
  getToken,
  isTokenExpired,
  removeLocalVariables,
} from "../src/utility/auth.utility";

export default function AdminProtectedRoutes({ children }) {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    removeLocalVariables();
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />; // safe to render protected content
}
