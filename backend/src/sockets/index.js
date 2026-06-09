import { Server } from "socket.io";
import { allowedOrigins } from "../config/env.js";
import { socketAuth } from "./auth.socket.js";
import { registerDocumentHandlers } from "./document.socket.js";
import { registerPresenceHandlers } from "./presence.socket.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.user.name} (${socket.id})`);

    registerDocumentHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${socket.user.name} (${reason})`);
    });
  });

  console.log("✅ Socket.io initialized");
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};