import mongoose from "mongoose";

const verificationCode = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: { type: String, required: true },
  createdAt: { type: String, required: true, default: Date.now },
  expriesAt: { type: String, required: true },
});

const VerificationCodeModel = mongoose.model(
  "VarificationCode",
  verificationCode,
  "verification_schema",
);

export default VerificationCodeModel;
