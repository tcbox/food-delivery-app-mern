import { hashPassword, comparePassword } from "../utils/AuthHelper.js";
import genToken from "../utils/genToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Session from "../models/session.model.js";
import { _30day } from "../utils/date.js";
import AppError from "../utils/AppError.js";
import { statusCode } from "../config/constants/statusCode.js";

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

  // Session unte update chestundi, lekapote kothadi create chestundi (Upsert)
  const session = await Session.findOneAndUpdate(
    { userId: user._id, userAgent }, // Denithoni vethukutundi
    { expiresAt: _30day }, // Em update cheyali
    { upsert: true, new: true }, // Upsert logic
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
