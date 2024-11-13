import { articleService } from "../services/index.js";
import { statusCodes, ApiError } from "../utils/index.js";

export const getArticleController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = id ? await articleService.getArticleById(id) : await articleService.getAllArticles();

    if (!article) {
      return res.status(statusCodes.NOT_FOUND).send("Article not found.");
    }

    res.send(article);
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const createArticleController = async (req, res, next) => {
  try {
    const articleData = req.body;
    await articleService.createArticle(articleData);
    res.status(statusCodes.CREATED).send("Article created successfully.");
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const updateArticleController = async (req, res, next) => {
  try {
    const articleData = req.body;
    const updated = await articleService.updateArticle(articleData);

    if (!updated) {
      return res.status(statusCodes.NOT_FOUND).send("Article not found.");
    }

    res.send("Article updated successfully.");
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const deleteArticleController = async (req, res, next) => {
  try {
    const { id } = req.body;
    const deleted = await articleService.deleteArticle(id);

    if (!deleted) {
      return res.status(statusCodes.NOT_FOUND).send("Article not found.");
    }

    res.send("Article deleted successfully.");
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
