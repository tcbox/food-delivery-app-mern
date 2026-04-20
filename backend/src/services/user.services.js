import genToken from "../utils/genToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Session from "../models/session.model.js";
import { _30day } from "../utils/date.js";

// Service should NOT take req, res, next. It takes data directly and returns data.
export const createUser = async (validateBody) => {
  const { username, email, password, mobile, role, authProvider, userAgent } =
    validateBody;

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User Already Exists");
  }

  let hashPassword = "";

  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(password, salt);
  }

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
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
