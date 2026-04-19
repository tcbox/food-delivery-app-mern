import "dotenv/config.js";
import z from "zod";

const envConfig = z.object({
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().url().min(10),
  JWT_SECRET: z.string().min(32).trim(),
  JWT_REFRESH_SECRET: z.string().min(32).trim(),
  NODE_ENV: z.string().trim(),
});

const parsedEnv = envConfig.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Environment variables validation error:",
    parsedEnv.error.format(),
  );
  process.exit(1);
}

export const getEnv = parsedEnv.data;
