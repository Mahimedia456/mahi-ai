import {
  deleteContent,
  getContentById,
  getContentList,
  getContentStats,
  updateContent,
  uploadContentAsset,
} from "./admin.content.service.js";

export async function getAdminContentStats(req, res, next) {
  try {
    const stats = await getContentStats({
      type: req.query.type,
    });

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("getAdminContentStats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch content stats",
    });
  }
}

export async function getAdminContentList(req, res, next) {
  try {
    const result = await getContentList({
      type: req.query.type,
      status: req.query.status,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getAdminContentList error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch content list",
    });
  }
}

export async function getAdminContentDetail(req, res, next) {
  try {
    const item = await getContentById(req.params.contentId);

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("getAdminContentDetail error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch content detail",
    });
  }
}

export async function patchAdminContent(req, res, next) {
  try {
    const item = await updateContent(req.params.contentId, req.body);

    return res.status(200).json({
      success: true,
      message: "Content updated successfully",
      item,
    });
  } catch (error) {
    console.error("patchAdminContent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update content",
    });
  }
}

export async function removeAdminContent(req, res, next) {
  try {
    await deleteContent(req.params.contentId);

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("removeAdminContent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete content",
    });
  }
}

export async function postAdminContentUpload(req, res, next) {
  try {
    const item = await uploadContentAsset(req.file, req.body);

    return res.status(201).json({
      success: true,
      message: "Content uploaded successfully",
      item,
    });
  } catch (error) {
    console.error("postAdminContentUpload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload content",
    });
  }
}