import mongoose from "mongoose";

import { getEnv } from "../env/getEnv.js";

const connectDb = async () => {
  try {
    const db = await mongoose.connect(getEnv.MONGODB_URI);
    console.log(`database is connected:${db.connection.host}❤️`);
  } catch (error) {
    console.log("db error");
    process.exit(1);
  }
};

export default connectDb;
