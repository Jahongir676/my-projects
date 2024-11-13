import { User } from "../modules/index.js";
import { ApiError } from "../utils/index.js";
import { statusCodes } from "../utils/index.js";

export const userService = {
  getUserProfile: async (email) => {
    try {
      const user = await User.findOne({ email }).select({ password: 0 });
      if (!user) {
        throw new ApiError(statusCodes.NOT_FOUND, "User not found");
      }
      return user;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch user profile");
    }
  },
};
