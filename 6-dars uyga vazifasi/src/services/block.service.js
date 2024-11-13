import { Category } from "../modules/index.js";
import { ApiError } from "../utils/index.js";
import { statusCodes } from "../utils/index.js";

export const blogService = {
  getAllBlogs: async () => {
    try {
      return await Category.find();
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch blogs");
    }
  },

  createBlog: async (blogData) => {
    try {
      const newBlog = new Category(blogData);
      await newBlog.save();
      return newBlog;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to create blog");
    }
  },
};
