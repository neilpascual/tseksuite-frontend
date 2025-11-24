import hris_api from "../configs/hris_api.config";

export const loginUser = async (formData) => {
  return await hris_api.post("/api/auth/login", formData);
};
