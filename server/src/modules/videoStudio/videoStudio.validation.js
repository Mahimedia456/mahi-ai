import { z } from "zod";

export const videoStudioModeEnum = z.enum(["text_to_video", "frame_to_video"]);
export const videoStudioAspectEnum = z.enum(["16:9", "9:16", "1:1", "4:5"]);
export const videoStudioResolutionEnum = z.enum(["480p", "720p"]);
export const videoStudioStatusEnum = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
  "cancelled",
]);

const metaSchema = z.object({}).passthrough();

export const createVideoStudioJobSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),
    mode: videoStudioModeEnum,

    prompt: z.string().trim().max(6000).optional(),
    negativePrompt: z.string().trim().max(4000).optional(),
    motionPrompt: z.string().trim().max(4000).optional(),

    durationSeconds: z.coerce.number().min(2).max(12).default(5),
    aspectRatio: videoStudioAspectEnum.default("16:9"),
    fps: z.coerce.number().int().min(8).max(30).default(24),
    resolution: videoStudioResolutionEnum.default("720p"),

    style: z.string().trim().max(120).optional(),
    modelKey: z.string().trim().max(120).optional(),
    seed: z.coerce.number().int().nonnegative().optional(),
    guidanceScale: z.coerce.number().min(0).max(20).optional(),
    steps: z.coerce.number().int().min(1).max(100).optional(),
    motionStrength: z.coerce.number().int().min(0).max(100).default(50),

    inputImagePath: z.string().trim().max(1000).optional(),
    inputImageUrl: z.string().trim().max(2000).optional(),

    meta: metaSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "text_to_video") {
      if (!data.prompt || !data.prompt.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["prompt"],
          message: "Prompt is required for text to video.",
        });
      }
    }

    if (data.mode === "frame_to_video") {
      if (!data.inputImagePath || !data.inputImagePath.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inputImagePath"],
          message: "inputImagePath is required for frame to video.",
        });
      }

      if (!data.motionPrompt || !data.motionPrompt.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["motionPrompt"],
          message: "motionPrompt is required for frame to video.",
        });
      }
    }
  });

export const listVideoStudioJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  status: videoStudioStatusEnum.optional(),
  mode: videoStudioModeEnum.optional(),
  search: z.string().trim().max(300).optional(),
});

export const getUploadUrlSchema = z.object({
  kind: z.enum(["inputs", "previews", "outputs", "covers"]),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1).max(120),
});

export const saveAssetSchema = z.object({
  jobId: z.string().uuid().optional(),
  assetType: z.enum([
    "input_image",
    "preview_image",
    "thumbnail",
    "output_video",
    "reference_asset",
  ]),
  title: z.string().trim().max(160).optional(),
  description: z.string().trim().max(1000).optional(),
  storagePath: z.string().trim().min(1).max(1000),
  publicUrl: z.string().trim().max(2000).optional(),
  mimeType: z.string().trim().max(120).optional(),
  fileSizeBytes: z.coerce.number().int().nonnegative().optional(),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  durationMs: z.coerce.number().int().nonnegative().optional(),
  fps: z.coerce.number().int().positive().optional(),
  isLibraryItem: z.coerce.boolean().default(false),
  tags: z.array(z.string().trim().min(1).max(80)).default([]),
  meta: metaSchema.optional(),
});

export const listVideoStudioLibraryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(16),
  assetType: z
    .enum([
      "input_image",
      "preview_image",
      "thumbnail",
      "output_video",
      "reference_asset",
    ])
    .optional(),
  search: z.string().trim().max(300).optional(),
});