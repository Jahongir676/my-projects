import { User, OTP } from "../modules/index.js";
import { generateJwtToken, verifyJwtToken } from "../utils/utiles.js";
import { statusCodes, ApiError } from "../utils/index.js";
import bcrypt from "bcrypt";

export const authService = {
  findUserByEmail: async (email) => {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to find user");
    }
  },

  registerUser: async (userData, otp) => {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();

      const dbOtp = new OTP({
        user_id: user._id,
        otp_code: otp,
      });
      await dbOtp.save();

      return user;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to register user");
    }
  },

  loginUser: async (email, password) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      const payload = {
        sub: user.email,
        role: user.role,
      };

      const accessToken = generateJwtToken(payload, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRES_IN);
      const refreshToken = generateJwtToken(payload, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRES_IN);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to login user");
    }
  },

  refreshToken: async (token) => {
    try {
      const decoded = verifyJwtToken(token, process.env.JWT_REFRESH_SECRET);
      const newAccessToken = generateJwtToken(
        { sub: decoded.sub, role: decoded.role },
        process.env.JWT_ACCESS_SECRET,
        process.env.JWT_ACCESS_EXPIRES_IN
      );

      return newAccessToken;
    } catch (error) {
      throw new ApiError(statusCodes.FORBIDDEN, "Invalid refresh token");
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new ApiError(statusCodes.NOT_FOUND, "User not found");

      const dbOtp = await OTP.findOne({ user_id: user._id });
      if (!dbOtp || dbOtp.otp_code !== otp) return false;

      user.is_active = true;
      await user.save();
      await OTP.deleteOne({ user_id: user._id });

      return true;
    } catch (error) {
      throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Failed to verify OTP");
    }
  },
};
