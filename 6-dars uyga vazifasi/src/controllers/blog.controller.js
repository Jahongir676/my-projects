import { blogService } from "../services/index.js";
import { statusCodes, ApiError } from "../utils/index.js";

export const blogController = async (req, res, next) => {
  try {
    if (req.method === "GET") {
      const blogs = await blogService.getAllBlogs();
      res.send(blogs);
    } else if (req.method === "POST") {
      const { title, content } = req.body;
      await blogService.createBlog(title, content);
      res.status(statusCodes.CREATED).send("Blog created successfully.");
    }
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
