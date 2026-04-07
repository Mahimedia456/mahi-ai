import { z } from "zod";

export const createThreadSchema = z.object({
  projectId: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(200).optional(),
  mode: z.enum(["chat", "agent", "code", "research", "image"]).optional(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1, "Message is required").max(20000),
  model: z.string().optional(),
});

export const listThreadsSchema = z.object({
  projectId: z.string().uuid().optional(),
});