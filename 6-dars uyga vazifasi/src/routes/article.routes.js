import { Router } from "express";
import {
  createArticleController,
  getArticleController,
  updateArticleController,
  deleteArticleController,
} from "../controllers/index.js";
import { authGuard, roleGuard } from "../middleware/index.js";

export const articleRouter = new Router();

articleRouter.get("/", getArticleController);
articleRouter.get("/:id", getArticleController);
articleRouter.post("/", authGuard, roleGuard(["admin", "superAdmin"]), createArticleController);
articleRouter.put("/", authGuard, roleGuard(["admin", "superAdmin"]), updateArticleController);
articleRouter.delete("/", authGuard, roleGuard(["admin", "superAdmin"]), deleteArticleController);
