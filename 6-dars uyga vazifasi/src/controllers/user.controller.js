import { userService } from "../services/index.js";
import { statusCodes, ApiError } from "../utils/index.js";

export const userProfileController = async (req, res, next) => {
  try {
    const userEmail = req.user.sub;
    const userProfile = await userService.getUserProfile(userEmail);

    if (!userProfile) {
      return res.status(statusCodes.NOT_FOUND).send("User not found.");
    }

    res.send(userProfile);
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
