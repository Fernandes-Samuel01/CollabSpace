import { verifyToken } from "../utils/jwt.util.js";
import { User } from "../models/user.model.js";

/**
 * Socket.io middleware: authenticate user via JWT.
 * Token can be sent in:
 *   - socket.handshake.auth.token  (preferred)
 *   - socket.handshake.headers.cookie (fallback)
 */
export const socketAuth = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    // Fallback: parse cookie header
    if (!token && socket.handshake.headers.cookie) {
      const match = socket.handshake.headers.cookie.match(/token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) return next(new Error("User not found"));
    if (!user.isVerified) return next(new Error("Email not verified"));

    // Attach user to socket for use in event handlers
    socket.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
};