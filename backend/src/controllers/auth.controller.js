import { statusCode } from "../config/constants/statusCode.js";
import asyncHandler from "../utils/asyncHandler.js";
import z, { email } from "zod";
import { secureCookie } from "../utils/AuthHelper.js";
import {
  createUserService,
  loginUserService,
  resetPassword,
  sendOtpService,
} from "../services/user.services.js";
import { _7day } from "../utils/date.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";

/*
 * authSchema
 * */
const authSchema = z.object({
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
});

/*
 * Handler schema
 * */
export const registerSchema = authSchema.superRefine((data, ctx) => {
  if (data.authProvider === "credentials") {
    if (!data.password) {
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

export const loginSchema = authSchema
  .pick({
    email: true,
    mobile: true,
    password: true,
    userAgent: true,
    authProvider: true,
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.mobile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email or Mobile is required",
        path: ["email"],
      });
    }
    if (data.authProvider === "credentials" && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password required for credentials login",
        path: ["password"],
      });
    }
  });

/*
 * Handlers
 * */

const registerUser = asyncHandler(async (req, res, next) => {
  const validateBody = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // services
  const { newUser, token } = await createUserService(validateBody);

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

const loginUser = asyncHandler(async (req, res, next) => {
  const validateBody = loginSchema.safeParse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  if (!validateBody.success) {
    throw new AppError(statusCode.BAD_REQUEST, "Invalid input data");
  }

  const { user, token } = await loginUserService(validateBody.data);

  res.cookie("token", token, {
    ...secureCookie,
    expires: _7day,
  });

  console.log("user after", user);
  console.log("token after", token);
  console.log("cookie set:", res.get("Set-Cookie"));

  return res.status(statusCode.OK).json({
    success: true,
    message: "Login successful",
    data: { id: user._id, name: user.username, email: user.email },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Already logged out",
    });
  }

  res.clearCookie("token");
  return res.status(statusCode.OK).json({
    success: true,
    message: "logout successful",
  });
});

const sendOtp = asyncHandler(async (req, res, next) => {
  const { email, mobile } = req.body;

  if (!email && !mobile) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Email or Mobile is required to send OTP",
    );
  }

  const response = await sendOtpService(email, mobile);

  return res.status(statusCode.OK).json({
    success: true,
    message: response.message,
  });
});

const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, mobile, otp } = req.body;

  if (!email && !mobile)
    throw new AppError(statusCode.SERVICE_UNAVAILABLE, "session timeout ");

  const response = await verifyOtpService(email, mobile, otp);

  return res.status(statusCode.OK).json({
    success: true,
    message: response.message,
  });
});

const verifyPassword = asyncHandler(async (req, res, next) => {
  const { email, mobile, newPassword } = req.body;
  if (!email && !mobile)
    throw new AppError(statusCode.NOT_FOUND, "user not found");

  const response = await resetPassword(email, mobile, newPassword);

  return res
    .status(statusCode.OK)
    .json({ success: true, message: response.message });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  verifyPassword,
};
