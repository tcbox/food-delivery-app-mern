import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { getEnv } from "./config/env/getEnv.js";
import connectDb from "./config/db/db.js";
import route from "./routes/v1/route.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

const PORT = getEnv.PORT || 3001;

app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    message: `Server is running`,
  });
});

app.use("/api/v1", route);

// Global Error Handler (Always keep this at the end)
app.use(errorHandler);

app.listen(PORT, () => {
  connectDb(); 
  console.log(`server is running at http://localhost:${PORT}`);
});
