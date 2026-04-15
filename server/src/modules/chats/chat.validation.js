import { z } from "zod";

const imageOptionsSchema = z
  .object({
    width: z.number().int().min(512).max(1024).optional(),
    height: z.number().int().min(512).max(1024).optional(),
    steps: z.number().int().min(1).max(50).optional(),
    guidance: z.number().min(0).max(20).optional(),
    seed: z.number().int().nonnegative().optional(),
    negativePrompt: z.string().trim().max(2000).optional(),
    quality: z.enum(["fast", "high"]).optional(),
  })
  .optional();

export const listThreadsSchema = z.object({
  projectId: z.string().uuid().optional(),
});

export const createThreadSchema = z.object({
  projectId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).max(120).optional(),
  mode: z.enum(["chat", "code", "fast", "image"]).optional(),
});

export const updateThreadSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  projectId: z.string().uuid().nullable().optional(),
  archived: z.boolean().optional(),
});

export const createMessageSchema = z.object({
  content: z.string().trim().min(1).max(50000),
  mode: z.enum(["chat", "code", "fast", "image"]).optional(),
  model: z.string().trim().min(1).max(160).optional(),
  options: imageOptionsSchema,
});