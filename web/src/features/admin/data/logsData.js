export const generationLogs = [
  {
    id: "gen_001",
    type: "Image",
    user: "Areeba Khan",
    model: "Mahi Image v2",
    status: "Success",
    time: "2026-04-02 21:05",
    detail: "Luxury portrait render completed in 4.1s",
  },
  {
    id: "gen_002",
    type: "Video",
    user: "Sami Raza",
    model: "Mahi Video v1",
    status: "Success",
    time: "2026-04-02 20:58",
    detail: "Product teaser rendered in 49s",
  },
  {
    id: "gen_003",
    type: "Image",
    user: "Hamza Noor",
    model: "Mahi Image v2",
    status: "Queued",
    time: "2026-04-02 20:54",
    detail: "Waiting for GPU assignment",
  },
];

export const apiLogs = [
  {
    id: "api_001",
    endpoint: "/api/generate/image",
    method: "POST",
    status: "200",
    latency: "182ms",
    time: "2026-04-02 21:01",
    detail: "Image generation request processed",
  },
  {
    id: "api_002",
    endpoint: "/api/generate/video",
    method: "POST",
    status: "200",
    latency: "264ms",
    time: "2026-04-02 20:48",
    detail: "Video job created successfully",
  },
  {
    id: "api_003",
    endpoint: "/api/billing/checkout",
    method: "POST",
    status: "500",
    latency: "821ms",
    time: "2026-04-02 20:21",
    detail: "Stripe session creation failed",
  },
];

export const errorLogs = [
  {
    id: "err_001",
    severity: "High",
    source: "Billing Service",
    status: "Open",
    time: "2026-04-02 20:21",
    detail: "Stripe session creation failed with internal exception",
  },
  {
    id: "err_002",
    severity: "Medium",
    source: "Video Queue",
    status: "Resolved",
    time: "2026-04-02 18:44",
    detail: "Temporary queue congestion recovered automatically",
  },
];

export const jobQueueLogs = [
  {
    id: "job_001",
    queue: "image-render",
    state: "Processing",
    worker: "gpu-node-02",
    time: "2026-04-02 21:07",
    detail: "7 active jobs in queue",
  },
  {
    id: "job_002",
    queue: "video-render",
    state: "Delayed",
    worker: "gpu-node-04",
    time: "2026-04-02 20:57",
    detail: "Queue delay due to high memory utilization",
  },
];

export const moderationLogs = [
  {
    id: "mod_001",
    user: "Zoya Malik",
    action: "Flagged Prompt",
    status: "Manual Review",
    time: "2026-04-02 17:40",
    detail: "Prompt pattern matched moderation threshold",
  },
  {
    id: "mod_002",
    user: "Bilal Ahmed",
    action: "Blocked Output",
    status: "Closed",
    time: "2026-04-02 15:14",
    detail: "Generated output blocked by policy engine",
  },
];