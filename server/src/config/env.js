import dotenv from "dotenv";

dotenv.config();

function required(name, fallback = "") {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toBoolean(value, defaultValue = false) {
  if (value === undefined) return defaultValue;
  return String(value).toLowerCase() === "true";
}

function toNumber(value, defaultValue) {
  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 4000),
  appUrl: required("APP_URL"),

  databaseUrl: required("DATABASE_URL"),
  directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,

  supabaseUrl: required("SUPABASE_URL"),
  supabaseAnonKey: required("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET || "ai-content",
  supabaseStoragePublicUrl:
    process.env.SUPABASE_STORAGE_PUBLIC_URL ||
    `${required("SUPABASE_URL")}/storage/v1/object/public`,

  supabaseS3Endpoint: process.env.SUPABASE_S3_ENDPOINT || "",
  supabaseS3Region: process.env.SUPABASE_S3_REGION || "ap-south-1",
  supabaseS3AccessKey: process.env.SUPABASE_S3_ACCESS_KEY || "",
  supabaseS3SecretKey: process.env.SUPABASE_S3_SECRET_KEY || "",

  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  smtpHost: required("SMTP_HOST"),
  smtpPort: toNumber(process.env.SMTP_PORT, 465),
  smtpSecure: toBoolean(process.env.SMTP_SECURE, true),
  smtpUser: required("SMTP_USER"),
  smtpPass: required("SMTP_PASS"),
  mailFrom: required("MAIL_FROM"),

  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: toNumber(process.env.REDIS_PORT, 6379),
  redisPassword: process.env.REDIS_PASSWORD || "",

  aiProvider: process.env.AI_PROVIDER || "self_hosted",
  vllmBaseUrl: process.env.VLLM_BASE_URL || "http://127.0.0.1:8000/v1",
  vllmApiKey: process.env.VLLM_API_KEY || "mahi-local-key",
  aiDefaultModel: process.env.AI_DEFAULT_MODEL || "mahi-chat",

  pythonAgentUrl: process.env.PYTHON_AGENT_URL || "http://127.0.0.1:8100",
  pythonImageUrl: process.env.PYTHON_IMAGE_URL || "http://127.0.0.1:8200",
  pythonIngestUrl: process.env.PYTHON_INGEST_URL || "http://127.0.0.1:8300",
};