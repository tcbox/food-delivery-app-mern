import mongoose from "mongoose";

const verificationCode = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  code: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const VerificationCodeModel = mongoose.model(
  "VerificationCode",
  verificationCode,
);

export default VerificationCodeModel;
