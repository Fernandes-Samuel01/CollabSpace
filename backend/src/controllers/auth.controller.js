import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken, cookieOptions } from "../utils/jwt.util.js";
import {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
} from "../services/auth.service.js";
import { User } from "../models/user.model.js";

// ---- POST /auth/register ----
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const user = await registerUser({ name, email, password });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user },
        "Registration successful. Verification code sent to your email."
      )
    );
});

// ---- POST /auth/verify-email ----
export const verify = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ApiError(400, "Email and code are required");
  }

  const user = await verifyEmail({ email, code });

  // ❗ NO auto-login — frontend redirects to /login
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user },
        "Email verified successfully. Please login."
      )
    );
});

// ---- POST /auth/resend-code ----
export const resendCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const data = await resendVerificationCode({ email });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Verification code resent"));
});

// ---- POST /auth/login ----
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await loginUser({ email, password });

  const token = generateToken({ id: user._id });

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

// ---- POST /auth/logout ----
export const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ---- GET /auth/me ----
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { user: user.toSafeObject() }, "Current user"));
});