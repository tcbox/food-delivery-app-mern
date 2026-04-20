import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const route = Router();

route.post("/register", register);
export default route;
