import { Article } from "../modules/index.js";
import { ApiError } from "../utils/index.js";
import { statusCodes } from "../utils/index.js";

export const articleService = {
  getAllArticles: async () => {
    try {
      const articles = await Article.find();
      return articles;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch articles");
    }
  },

  getArticleById: async (id) => {
    try {
      const article = await Article.findById(id);
      if (!article) {
        throw new ApiError(statusCodes.NOT_FOUND, "Article not found");
      }
      return article;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch article");
    }
  },

  createArticle: async (articleData) => {
    try {
      const newArticle = new Article(articleData);
      await newArticle.save();
      return newArticle;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to create article");
    }
  },

  updateArticle: async (articleData) => {
    try {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleData.id,
        articleData,
        { new: true }
      );

      if (!updatedArticle) {
        throw new ApiError(statusCodes.NOT_FOUND, "Article not found");
      }

      return updatedArticle;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to update article");
    }
  },

  deleteArticle: async (id) => {
    try {
      const deletedArticle = await Article.findByIdAndDelete(id);
      if (!deletedArticle) {
        throw new ApiError(statusCodes.NOT_FOUND, "Article not found");
      }
      return deletedArticle;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to delete article");
    }
  },
};
