import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  verify,
  resendCode,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Rate limiters — protect from brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { success: false, message: "Too many attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const resendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 3,
  message: { success: false, message: "Too many resend requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public
router.post("/register", authLimiter, register);
router.post("/verify-email", authLimiter, verify);
router.post("/resend-code", resendLimiter, resendCode);
router.post("/login", authLimiter, login);
router.post("/logout", logout);

// Protected
router.get("/me", protect, getMe);

export default router;