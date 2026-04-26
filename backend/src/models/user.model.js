import mongoose from "mongoose";
const USER_ROLES = ["user", "admin", "deliveryBoy"];
const AUTH_PROVIDER = ["credentials", "google", "github", "facebook"];
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    mobile: { type: String },
    role: { type: String, enum: USER_ROLES, default: "user", required: true },
    isAuthenticated: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    authProvider: { type: String, enum: AUTH_PROVIDER, default: "credentials" },
    resetOtp: { type: String },
    otpExpires: { type: Date },
    userAgent: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
