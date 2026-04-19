import { statusCode } from "src/config/constants/statusCode.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import z, { email } from "zod";
import bcrypt from "bcrypt";
import { createUser } from "../services/user.services.js";

export const registerSchema = z
  .object({
    username: z.string().min(3).max(255).trim(),
    email: z.string().email().trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Password must include uppercase, lowercase, number, and special character",
      )
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Password must include uppercase, lowercase, number, and special character",
      )
      .trim(),
    role: z.enum(["user", "admin", "deliveryBoy"]).default("user"),
    mobile: z.string().optional().trim(),
    userAgent: z.string().optional(),
    authProvider: z
      .enum(["credentials", "google", "github", "facebook"])
      .default("credentials"),
  })
  .superRefine((data, ctx) => {
    if (data.authProvider === "credentials") {
      if (!data.authProvider) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "password is required for credential login",
          path: ["password"],
        });
      }
      if (!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "password is required for credential login",
          path: ["confirmPassword"],
        });
      }
      if (
        data.password &&
        data.confirmPassword &&
        data.password !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "password do not match",
          path: ["password", "confirmPassword"],
        });
      }
    }
  });
const register = asyncHandler(async (req, res, next) => {
  const validateBody = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // services
  const { newUser, token } = await createUser(validateBody);

  res.cookie("token", token, {
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(statusCode.CREATED).json({
    success: true,
    message: "user registered successfully",
    data: {
      name: newUser.username,
      email: newUser.email,
    },
  });
});

export { register };
