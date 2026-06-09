import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.util.js";
import { User } from "../models/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
  // Token can come from cookie OR Authorization header
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new ApiError(401, "Not authenticated. Please login.");

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "User no longer exists");
  if (!user.isVerified) throw new ApiError(403, "Email not verified");

  // Attach minimal user info to request
  req.user = { id: user._id.toString(), email: user.email, name: user.name };
  next();
});