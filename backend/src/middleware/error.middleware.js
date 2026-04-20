import { ZodError } from "zod";
import { statusCode } from "../config/constants/statusCode.js";
import { getEnv } from "../config/env/getEnv.js";

export const errorHandler = (err, req, res, next) => {
  let code = err.statusCode || statusCode.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";
  let errors = [];
  const isSecure = getEnv.NODE_ENV === "development";
  
  /**
  * Check if it's a Zod Validation Error
  * */ 
  
  if (err instanceof ZodError || err.name === "ZodError") {
    code = statusCode.BAD_REQUEST;
    message = "Validation failed";
    const issues = err.issues || err.errors || [];
    errors = issues.map((e) => ({
      path: e.path ? e.path.join(".") : "unknown",
      message: e.message,
    }));
  }

  return res.status(code).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,

    stack: isSecure ? err.stack : undefined,
  });
};
