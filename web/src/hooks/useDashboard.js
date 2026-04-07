import { userApi } from "../api/userApi";
import { adminApi } from "../api/adminApi";

export async function getUserDashboard() {
  const res = await userApi.dashboard();
  return res.data.data;
}

export async function getAdminOverview() {
  const res = await adminApi.overview();
  return res.data.data;
}