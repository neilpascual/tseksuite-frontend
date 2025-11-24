import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

export const removeLocalVariables = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("system_user_id");
  return;
};
