import { Router } from "express";
import { authGuard } from "../middleware/index.js";
import { userProfileController } from "../controllers/index.js";

export const userRouter = new Router();

userRouter.post("/profile", authGuard, userProfileController);
