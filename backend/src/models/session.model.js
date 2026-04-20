import mongoose from "mongoose";
import { _30day } from "../utils/date.js";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    userAgent: { type: String },
    ip: { type: String },
    expiresAt: {
      type: Date,
      required: true,
      default: () => _30day, // Default 30 days
    },
  },
  { timestamps: true },
);

// TTL Index: Automatically delete sessions when they expire
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 },);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
