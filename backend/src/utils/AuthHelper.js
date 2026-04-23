import { getEnv } from "../config/env/getEnv.js";
import bcrypt from "bcrypt";

export const secure = getEnv.NODE_ENV !== "development";

export const secureCookie = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
