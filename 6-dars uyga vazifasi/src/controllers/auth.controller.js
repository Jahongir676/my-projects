import { generateJwtToken, verifyJwtToken } from "../utils/utiles.js";
import { otpGenerator, sendMail } from "../helpers/index.js";
import { authService } from "../services/index.js";
import { statusCodes, ApiError } from "../utils/index.js";

export const registerController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await authService.findUserByEmail(email);

    if (existingUser) {
      return res.status(statusCodes.CONFLICT).send("Email already exists.");
    }

    const otp = otpGenerator();
    await sendMail(email, "OTP Verification", `Your OTP: ${otp}`);
    const user = await authService.registerUser(req.body, otp);

    res.status(statusCodes.CREATED).send("User registered successfully. OTP sent.");
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.loginUser(email, password);

    if (!tokens) {
      return res.status(statusCodes.UNAUTHORIZED).send("Invalid credentials.");
    }

    res.send(tokens);
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const { token } = req.body;
    const newAccessToken = await authService.refreshToken(token);

    res.send({ accessToken: newAccessToken });
  } catch (error) {
    next(new ApiError(statusCodes.FORBIDDEN, "Invalid refresh token."));
  }
};

export const verifyController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const isVerified = await authService.verifyOtp(email, otp);

    if (!isVerified) {
      return res.status(statusCodes.BAD_REQUEST).send("Invalid OTP.");
    }

    res.send("User verified successfully.");
  } catch (error) {
    next(new ApiError(statusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
