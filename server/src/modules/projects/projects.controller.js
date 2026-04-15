import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  listProjectsService,
  createProjectService,
} from "./projects.service.js";

function getUserId(req) {
  return req.user?.userId || req.user?.id;
}

export const listProjects = asyncHandler(async (req, res) => {

  const userId = getUserId(req);

  const data = await listProjectsService({ userId });

  res.json({
    success: true,
    data,
  });

});

export const createProject = asyncHandler(async (req, res) => {

  const userId = getUserId(req);

  const project = await createProjectService({
    userId,
    name: req.body.name,
  });

  res.status(201).json({
    success: true,
    data: project,
  });

});