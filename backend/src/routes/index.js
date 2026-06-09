import { Router } from "express";
import authRoutes from "./auth.routes.js";
import documentRoutes from "./document.routes.js";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CollabSpace API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);

export default router;