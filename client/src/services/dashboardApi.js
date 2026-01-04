import api from "./api";

export function getDashboardStats() {
  return api.get("/dashboard/stats");
}
