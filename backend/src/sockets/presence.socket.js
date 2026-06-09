import { presenceStore } from "./presence.store.js";

const TYPING_TIMEOUT_MS = 2500;

// Per-socket typing timers (auto-clear typing state)
const typingTimers = new Map();

/**
 * Broadcast the current presence list to everyone in the room.
 */
export const broadcastPresence = (io, docId) => {
  const users = presenceStore.getUniqueUsers(docId);
  io.to(docId).emit("presence:update", { docId, users });
};

export const registerPresenceHandlers = (io, socket) => {
  // ---- Typing started ----
  socket.on("presence:typing", ({ docId, isTyping }) => {
    if (socket.data.currentDocId !== docId) return;

    presenceStore.setTyping(docId, socket.id, !!isTyping);
    broadcastPresence(io, docId);

    // Clear any existing auto-stop timer
    const existing = typingTimers.get(socket.id);
    if (existing) clearTimeout(existing);

    // Auto-stop typing after timeout (in case 'stopped' event is missed)
    if (isTyping) {
      const timer = setTimeout(() => {
        presenceStore.setTyping(docId, socket.id, false);
        broadcastPresence(io, docId);
        typingTimers.delete(socket.id);
      }, TYPING_TIMEOUT_MS);
      typingTimers.set(socket.id, timer);
    } else {
      typingTimers.delete(socket.id);
    }
  });

  // ---- Cleanup on disconnect ----
  socket.on("disconnect", () => {
    const timer = typingTimers.get(socket.id);
    if (timer) {
      clearTimeout(timer);
      typingTimers.delete(socket.id);
    }

    // Remove from all rooms + notify each
    const removedFrom = presenceStore.removeFromAll(socket.id);
    for (const { docId, user } of removedFrom) {
      // Only emit "user left" if no other tab of theirs remains
      const stillConnected = presenceStore.hasOtherSocketsForUser(
        docId,
        user.userId,
        socket.id
      );
      if (!stillConnected) {
        io.to(docId).emit("presence:left", {
          docId,
          user: {
            userId: user.userId,
            name: user.name,
            avatar: user.avatar,
          },
        });
      }
      broadcastPresence(io, docId);
    }
  });
};