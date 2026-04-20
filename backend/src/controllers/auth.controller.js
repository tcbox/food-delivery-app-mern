import { statusCode } from "../config/constants/statusCode.js";
import asyncHandler from "../utils/asyncHandler.js";
import z, { email } from "zod";
import { secureCookie } from "../utils/setAuthCookie.js";
import { createUser } from "../services/user.services.js";
import { _7day } from "../utils/date.js";

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
    mobile: z.string().trim().min(10).optional(),
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
    ...secureCookie,
    expires: _7day,
  });

  return res.status(statusCode.CREATED).json({
    success: true,
    message: "user registered successfully",
    data: {
      id: newUser.id,
      name: newUser.username,
      email: newUser.email,
      mobile: newUser.mobile,
    },
  });
});

export { register };
