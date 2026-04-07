import api from "./client";

export const adminApi = {
  overview: () => api.get("/admin/overview"),

  getUsers: (params = {}) => api.get("/admin/users", { params }),
  getUserActivity: () => api.get("/admin/users/activity"),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (payload) => api.post("/admin/users", payload),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getPlans: () => api.get("/admin/plans"),
  getPlanById: (id) => api.get(`/admin/plans/${id}`),
  createPlan: (payload) => api.post("/admin/plans", payload),
  updatePlan: (id, payload) => api.patch(`/admin/plans/${id}`, payload),
  deletePlan: (id) => api.delete(`/admin/plans/${id}`),

  getTransactions: () => api.get("/admin/transactions"),
  getRefunds: () => api.get("/admin/refunds"),

  getSettings: () => api.get("/admin/settings"),
  updateSetting: (payload) => api.post("/admin/settings", payload),

  getAiLimits: () => api.get("/admin/settings/ai-limits"),
  updateAiLimits: (payload) => api.post("/admin/settings/ai-limits", payload),

  getBlockedWords: () => api.get("/admin/settings/blocked-words"),
  addBlockedWord: (payload) => api.post("/admin/settings/blocked-words", payload),
  deleteBlockedWord: (id) => api.delete(`/admin/settings/blocked-words/${id}`),

  getNotifications: () => api.get("/admin/notifications"),
  markNotificationRead: (id) => api.patch(`/admin/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch("/admin/notifications/read-all"),

  getProfile: () => api.get("/admin/profile"),
  updateProfile: (payload) => api.patch("/admin/profile", payload)
};