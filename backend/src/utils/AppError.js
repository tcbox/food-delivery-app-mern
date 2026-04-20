import { statusCode } from "../config/constants/statusCode.js";

export default class AppError extends Error {
  constructor(code, message, isError = true) {
    super(message);
    this.statusCode = code;
    this.message = message;
    this.isError = isError;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

 
}

// Example of specialized error class
