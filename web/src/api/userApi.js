import api from "./client";

export const userApi = {
  dashboard: () => api.get("/users/dashboard")
};