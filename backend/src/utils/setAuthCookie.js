import { getEnv } from "src/config/env/getEnv";

const secure = getEnv.NODE_ENV !== "development";

export const cookieOption = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

