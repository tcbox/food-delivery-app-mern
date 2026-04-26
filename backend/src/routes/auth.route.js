import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  sendOtp,
  verifyOtp,
  verifyPassword,
} from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/logout", logoutUser);
authRoute.post("/reset-otp", sendOtp);
authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/resetpassword", verifyPassword);

export default authRoute;
