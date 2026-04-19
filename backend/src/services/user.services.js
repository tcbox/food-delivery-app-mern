import genToken from "src/utils/genToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { cookieOption } from "src/utils/setAuthCookie.js";
// Service should NOT take req, res, next. It takes data directly and returns data.
export const createUser = async (validateBody) => {
  const { username, email, password, mobile, role, authProvider } =
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
  });

  const token = await genToken(newUser._id);

  return { newUser, token };
};
