import api from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  verifyRegisterOtp: (payload) => api.post("/auth/verify-register-otp", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  verifyForgotOtp: (payload) => api.post("/auth/verify-forgot-otp", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload)
};