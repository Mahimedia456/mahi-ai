import {
  deleteModel,
  exportModelsCsv,
  exportModelUsageCsv,
  getModelDetailBundle,
  getModelStats,
  getModels,
  getModelUsageSeries,
  updateModelStatus,
} from "./admin.models.service.js";

export async function getAdminModels(req, res) {
  try {
    const items = await getModels({
      status: req.query.status,
      type: req.query.type,
      search: req.query.search,
    });

    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("getAdminModels error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAdminModelStats(req, res) {
  try {
    const stats = await getModelStats();
    return res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("getAdminModelStats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAdminModelDetail(req, res) {
  try {
    const result = await getModelDetailBundle(req.params.modelId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("getAdminModelDetail error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAdminModelAnalytics(req, res) {
  try {
    const stats = await getModelStats();
    const usage = await getModelUsageSeries(null, 7);
    return res.status(200).json({ success: true, stats, usage });
  } catch (error) {
    console.error("getAdminModelAnalytics error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function patchAdminModelStatus(req, res) {
  try {
    const item = await updateModelStatus(req.params.modelId, req.body.status);
    return res.status(200).json({
      success: true,
      message: "Model status updated successfully",
      item,
    });
  } catch (error) {
    console.error("patchAdminModelStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteAdminModel(req, res) {
  try {
    await deleteModel(req.params.modelId);
    return res.status(200).json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (error) {
    console.error("deleteAdminModel error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function exportAdminModelsCsv(req, res) {
  try {
    const csv = await exportModelsCsv();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="models.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    console.error("exportAdminModelsCsv error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function exportAdminModelUsageCsv(req, res) {
  try {
    const csv = await exportModelUsageCsv(req.params.modelId);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="model-usage.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    console.error("exportAdminModelUsageCsv error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}