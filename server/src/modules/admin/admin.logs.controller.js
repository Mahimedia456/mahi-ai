import { getLogsByType } from "./admin.logs.service.js";

export async function getAdminLogs(req, res) {
  try {
    const type = req.query.type || "generation";
    const rows = await getLogsByType(type);

    return res.status(200).json({
      success: true,
      items: rows,
    });
  } catch (error) {
    console.error("getAdminLogs error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch logs",
    });
  }
}