import { hashPassword, comparePassword } from "../utils/AuthHelper.js";
import genToken from "../utils/genToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Session from "../models/session.model.js";
import { _30day } from "../utils/date.js";
import AppError from "../utils/AppError.js";
import { statusCode } from "../config/constants/statusCode.js";
import { SendOtpMailer } from "../utils/emailServer.js";
import VerificationCodeModel from "../models/verificationCode.model.js";

// Service should NOT take req, res, next. It takes data directly and returns data.

/*
 * signup
 * */
export const createUserService = async (validateBody) => {
  const { username, email, password, mobile, role, authProvider, userAgent } =
    validateBody;

  const user = await User.findOne({ email }).lean();
  if (user) {
    throw new AppError(statusCode.BAD_REQUEST, "user already exist");
  }

  const hashedPassword = password ? await hashPassword(password) : "";

  if (!hashedPassword) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Password is Missing, Please enter password ",
    );
  }

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    mobile,
    role,
    authProvider,
    userAgent,
  });

  // Create Session record in DB
  const session = await Session.create({
    userId: newUser._id,
    userAgent,
    expiresAt: _30day,
  });

  // Pass both userId and sessionId to token
  const token = await genToken({
    userId: newUser._id,
    sessionId: session._id,
  });

  return { newUser, token };
};

/*
 * Login
 * */
export const loginUserService = async (validateBody) => {
  const { email, mobile, password, userAgent } = validateBody;

  const user = await User.findOne({
    $or: [{ email: email || "" }, { mobile: mobile || "" }],
  }).lean();

  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found!");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError(statusCode.UNAUTHORIZED, "User not found");
  }

  const session = await Session.findOneAndUpdate(
    { userId: user._id, userAgent },
    { expiresAt: _30day }, // Em update cheyali
    { upsert: true, returnDocument: "after" }, // Upsert logic
  );

  const token = await genToken({
    userId: user._id,
    sessionId: session._id,
  });

  return {
    user,
    token,
  };
};

/*
 * Send OTP Service
 * */
export const sendOtpService = async (email, mobile) => {
  const user = await User.findOne({
    $or: [{ email: email || "" }, { mobile: mobile || "" }],
  }).lean();

  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (email) {
    await SendOtpMailer(email, otp);
  } else if (mobile) {
    console.log(`Sending SMS to ${mobile} with OTP: ${otp}`);
  }

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  // Save OTP to User model directly
  await User.findByIdAndUpdate(user._id, {
    resetOtp: otp,
    otpExpires: expiresAt,
  });

  // Optional: keeping VerificationCodeModel for now as it was there
  await VerificationCodeModel.findOneAndUpdate(
    { userId: user._id, type: email ? "EMAIL_OTP" : "MOBILE_OTP" },
    { code: otp, expiresAt },
    { upsert: true, returnDocument: "after" },
  );

  return { success: true, message: "OTP sent successfully" };
};

export const verifyOtpService = async (email, mobile, otp) => {
  const user = await User.findOne({
    $or: [{ email: email || "" }, { mobile: mobile || "" }],
  });

  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "User not found");
  }

  if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
    throw new AppError(statusCode.UNAUTHORIZED, "Invalid or expired OTP");
  }

  user.isVerified = true;
  user.resetOtp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return { success: true, message: "OTP verified successfully" };
};

export const resetPassword = async (email, mobile, newPassword) => {
  const user = await User.findOne({
    $or: [{ email: email || "" }, { mobile: mobile || "" }],
  });

  if (!user) {
    throw new AppError(statusCode.NOT_FOUND, "user not found");
  }

  // Use comparePassword from AuthHelper for consistency
  const isSamePassword = await comparePassword(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "New password must be different from old password",
    );
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
  return { message: "Password reset successful" };
};
