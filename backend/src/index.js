import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { getEnv } from "./config/env/getEnv.js";
import connectDb from "./config/db/db.js";


const app = express();
const PORT = getEnv.PORT || 3001;
app.use(cookieParser());
app.use(cors());

app.use("/", (req, res) => {
  res.status(200).json({
    message: `Server is running`,
  });
});

app.listen(PORT, () => {
  connectDb();
  console.log(`server is running at http://localhost:${PORT}`);
});
