import {
  getAnalyticsStats,
  getAnalyticsChart,
} from "./admin.analytics.service.js";

export async function getAdminAnalyticsStats(req, res) {
  try {
    const type = req.query.type || "platform";
    const stats = await getAnalyticsStats(type);

    return res.status(200).json({
      success: true,
      items: stats,
    });
  } catch (error) {
    console.error("getAdminAnalyticsStats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics stats",
    });
  }
}

export async function getAdminAnalyticsChart(req, res) {
  try {
    const type = req.query.type || "platform";
    const chart = await getAnalyticsChart(type);

    return res.status(200).json({
      success: true,
      items: chart,
    });
  } catch (error) {
    console.error("getAdminAnalyticsChart error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics chart",
    });
  }
}