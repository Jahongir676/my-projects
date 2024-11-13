import { Router } from "express";
import {
  loginController,
  refreshTokenController,
  registerController,
  verifyController,
} from "../controllers/index.js";

export const authRouter = new Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/refreshToken", refreshTokenController);
authRouter.post("/verify", verifyController);
