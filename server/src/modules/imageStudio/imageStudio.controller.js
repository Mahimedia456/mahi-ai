import * as imageStudioService from "./imageStudio.service.js";

export async function createJob(req, res, next) {
  try {
    const job = await imageStudioService.createImageStudioJob({
      userId: req.user.id,
      body: req.body,
    });

    res.status(201).json({
      ok: true,
      job,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelJob(req, res, next) {
  try {
    const job = await imageStudioService.cancelImageStudioJob({
      userId: req.user.id,
      jobId: req.params.jobId,
    });

    res.json({
      ok: true,
      job,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJob(req, res, next) {
  try {
    const job = await imageStudioService.getImageStudioJob({
      userId: req.user.id,
      jobId: req.params.jobId,
    });

    res.json({
      ok: true,
      job,
    });
  } catch (error) {
    next(error);
  }
}

export async function listJobs(req, res, next) {
  try {
    const result = await imageStudioService.listImageStudioJobs({
      userId: req.user.id,
      status: req.query.status,
      limit: Number(req.query.limit || 24),
      page: Number(req.query.page || 1),
    });

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function listOutputs(req, res, next) {
  try {
    const result = await imageStudioService.listImageStudioOutputs({
      userId: req.user.id,
      archived: req.query.archived === "true",
      limit: Number(req.query.limit || 24),
      page: Number(req.query.page || 1),
    });

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAssets(req, res, next) {
  try {
    const items = await imageStudioService.listImageStudioAssets({
      userId: req.user.id,
      limit: Number(req.query.limit || 50),
    });

    res.json({
      ok: true,
      items,
    });
  } catch (error) {
    next(error);
  }
}

export async function listPresets(req, res, next) {
  try {
    const items = await imageStudioService.listImageStudioPresets({
      userId: req.user.id,
    });

    res.json({
      ok: true,
      items,
    });
  } catch (error) {
    next(error);
  }
}

export async function archiveOutput(req, res, next) {
  try {
    const output = await imageStudioService.toggleArchiveOutput({
      userId: req.user.id,
      outputId: req.params.outputId,
      archived: req.body.archived === true,
    });

    res.json({
      ok: true,
      output,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteOutput(req, res, next) {
  try {
    const result = await imageStudioService.deleteImageStudioOutput({
      userId: req.user.id,
      outputId: req.params.outputId,
    });

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAssetUpload(req, res, next) {
  try {
    const result = await imageStudioService.createStudioAssetUpload({
      userId: req.user.id,
      fileName: req.body.fileName,
      contentType: req.body.contentType,
    });

    res.json({
      ok: true,
      upload: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function registerAsset(req, res, next) {
  try {
    const asset = await imageStudioService.registerStudioAsset({
      userId: req.user.id,
      body: req.body,
    });

    res.status(201).json({
      ok: true,
      asset,
    });
  } catch (error) {
    next(error);
  }
}