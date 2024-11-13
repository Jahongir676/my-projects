import { Router } from "express";
import { blogController } from "../controllers/index.js";
import { authGuard, roleGuard } from "../middleware/index.js";

export const blogRouter = new Router();

blogRouter.get("/", blogController);
blogRouter.post("/", authGuard, roleGuard(["admin"]), blogController);
