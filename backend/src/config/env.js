import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: Number(process.env.SMTP_PORT) || 2525,
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
    FROM:
      process.env.SMTP_FROM || "CollabSpace <no-reply@collabspace.dev>",
  },
};

const required = ["MONGO_URI", "JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
}

export const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);