import { Document } from "../models/document.model.js";
import { presenceStore } from "./presence.store.js";
import { broadcastPresence } from "./presence.socket.js";

const saveTimers = new Map();
const SAVE_DEBOUNCE_MS = 1500;

const scheduleSave = (docId, content, userId) => {
  if (saveTimers.has(docId)) clearTimeout(saveTimers.get(docId));

  const timer = setTimeout(async () => {
    try {
      await Document.findByIdAndUpdate(docId, {
        content,
        lastEditedBy: userId,
        lastEditedAt: new Date(),
      });
      saveTimers.delete(docId);
    } catch (err) {
      console.error(`❌ Failed to save document ${docId}:`, err.message);
    }
  }, SAVE_DEBOUNCE_MS);

  saveTimers.set(docId, timer);
};

export const registerDocumentHandlers = (io, socket) => {
  // ---- Join ----
  socket.on("document:join", async ({ docId }, callback) => {
    try {
      const doc = await Document.findById(docId);
      if (!doc) {
        return callback?.({ success: false, message: "Document not found" });
      }
      if (!doc.canView(socket.user.id)) {
        return callback?.({ success: false, message: "Access denied" });
      }

      socket.join(docId);
      socket.data.currentDocId = docId;
      socket.data.canEdit = doc.canEdit(socket.user.id);

      // Add to presence store
      const wasFirstSocket = !presenceStore.hasOtherSocketsForUser(
        docId,
        socket.user.id,
        socket.id
      );

      presenceStore.add(docId, socket.id, {
        userId: socket.user.id,
        name: socket.user.name,
        email: socket.user.email,
        avatar: socket.user.avatar,
      });

      // Notify others ONLY if this user wasn't already in the room (avoid spam)
      if (wasFirstSocket) {
        socket.to(docId).emit("presence:joined", {
          docId,
          user: {
            userId: socket.user.id,
            name: socket.user.name,
            avatar: socket.user.avatar,
          },
        });
      }

      // Broadcast updated presence list to all in room
      broadcastPresence(io, docId);

      console.log(
        `👤 ${socket.user.name} joined doc ${docId} (canEdit: ${socket.data.canEdit})`
      );

      callback?.({
        success: true,
        canEdit: socket.data.canEdit,
        users: presenceStore.getUniqueUsers(docId),
      });
    } catch (err) {
      console.error("document:join error:", err);
      callback?.({ success: false, message: "Server error" });
    }
  });

  // ---- Leave ----
  socket.on("document:leave", ({ docId }) => {
    if (!docId) return;
    socket.leave(docId);

    presenceStore.remove(docId, socket.id);
    socket.data.currentDocId = null;

    const stillConnected = presenceStore.hasOtherSocketsForUser(
      docId,
      socket.user.id,
      socket.id
    );
    if (!stillConnected) {
      socket.to(docId).emit("presence:left", {
        docId,
        user: {
          userId: socket.user.id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
      });
    }
    broadcastPresence(io, docId);
  });

  // ---- Content change ----
  socket.on("document:change", async ({ docId, content }) => {
    if (socket.data.currentDocId !== docId) return;
    if (!socket.data.canEdit) return;

    socket.to(docId).emit("document:change", {
      content,
      userId: socket.user.id,
      userName: socket.user.name,
    });

    // Activity ping (lightweight — no DB write)
    socket.to(docId).emit("activity:edit", {
      docId,
      user: {
        userId: socket.user.id,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
      at: new Date().toISOString(),
    });

    scheduleSave(docId, content, socket.user.id);
  });

  // ---- Title change ----
  socket.on("document:title", async ({ docId, title }) => {
    if (socket.data.currentDocId !== docId) return;
    if (!socket.data.canEdit) return;

    try {
      await Document.findByIdAndUpdate(docId, {
        title: title.trim(),
        lastEditedBy: socket.user.id,
        lastEditedAt: new Date(),
      });

      socket.to(docId).emit("document:title", {
        title,
        userId: socket.user.id,
      });

      socket.to(docId).emit("activity:edit", {
        docId,
        user: {
          userId: socket.user.id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        action: "renamed",
        at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("document:title error:", err.message);
    }
  });
};