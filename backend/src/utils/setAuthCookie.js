import { getEnv } from "../config/env/getEnv.js";

const secure = getEnv.NODE_ENV !== "development";

export const secureCookie = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};
