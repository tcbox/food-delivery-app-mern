import jwt from "jsonwebtoken";
import { getEnv } from "../config/env/getEnv.js";

const genToken = (data) => {
  try {
    const token = jwt.sign({ data }, getEnv.JWT_SECRET, {
      expiresIn: "7d", // Yeah you can write exactly like this!
    });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default genToken;
