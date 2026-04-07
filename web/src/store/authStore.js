import { create } from "zustand";
import { authApi } from "../api/authApi";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("mahi_access_token") || null,
  loading: false,

  login: async (payload) => {
    set({ loading: true });

    try {
      const res = await authApi.login(payload);
      const { user, accessToken } = res.data.data;

      localStorage.setItem("mahi_access_token", accessToken);
      localStorage.setItem("mahi_user", JSON.stringify(user));

      if (user.role === "admin" || user.role === "super_admin") {
        localStorage.setItem("mahi_admin_auth", "true");
        localStorage.removeItem("mahi_auth_token");
      } else {
        localStorage.setItem("mahi_auth_token", "true");
        localStorage.removeItem("mahi_admin_auth");
      }

      set({ user, accessToken, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchMe: async () => {
    try {
      const res = await authApi.me();
      const user = res.data.data.user;
      set({ user });
      localStorage.setItem("mahi_user", JSON.stringify(user));
      return user;
    } catch {
      localStorage.removeItem("mahi_access_token");
      localStorage.removeItem("mahi_auth_token");
      localStorage.removeItem("mahi_admin_auth");
      localStorage.removeItem("mahi_user");
      set({ user: null, accessToken: null });
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("mahi_access_token");
    localStorage.removeItem("mahi_auth_token");
    localStorage.removeItem("mahi_admin_auth");
    localStorage.removeItem("mahi_user");
    set({ user: null, accessToken: null });
  }
}));