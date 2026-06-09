import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./sockets/index.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // ✨ Initialize Socket.io
    initSocket(server);

    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`📡 Environment: ${env.NODE_ENV}`);
    });

    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();