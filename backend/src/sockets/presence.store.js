/**
 * In-memory presence store.
 * Structure:
 *   docId -> Map<socketId, { userId, name, email, avatar, isTyping, joinedAt }>
 */
class PresenceStore {
  constructor() {
    this.rooms = new Map();
  }

  // ---- Add user to a document room ----
  add(docId, socketId, userInfo) {
    if (!this.rooms.has(docId)) {
      this.rooms.set(docId, new Map());
    }
    this.rooms.get(docId).set(socketId, {
      ...userInfo,
      isTyping: false,
      joinedAt: new Date(),
    });
  }

  // ---- Remove a single socket (one tab) ----
  remove(docId, socketId) {
    const room = this.rooms.get(docId);
    if (!room) return null;

    const removed = room.get(socketId);
    room.delete(socketId);

    if (room.size === 0) {
      this.rooms.delete(docId);
    }
    return removed || null;
  }

  // ---- Remove a socket from EVERY room (on disconnect) ----
  removeFromAll(socketId) {
    const removed = []; // array of { docId, user }
    for (const [docId, room] of this.rooms.entries()) {
      if (room.has(socketId)) {
        const user = room.get(socketId);
        room.delete(socketId);
        removed.push({ docId, user });
        if (room.size === 0) this.rooms.delete(docId);
      }
    }
    return removed;
  }

  // ---- Set typing state ----
  setTyping(docId, socketId, isTyping) {
    const room = this.rooms.get(docId);
    if (!room || !room.has(socketId)) return null;
    const entry = room.get(socketId);
    entry.isTyping = isTyping;
    return entry;
  }

  // ---- Get all unique users in a doc (dedup by userId) ----
  getUniqueUsers(docId) {
    const room = this.rooms.get(docId);
    if (!room) return [];

    const seen = new Map(); // userId -> userInfo
    for (const entry of room.values()) {
      if (!seen.has(entry.userId)) {
        seen.set(entry.userId, {
          userId: entry.userId,
          name: entry.name,
          email: entry.email,
          avatar: entry.avatar,
          isTyping: entry.isTyping,
        });
      } else if (entry.isTyping) {
        // If any tab of this user is typing, mark the user as typing
        seen.get(entry.userId).isTyping = true;
      }
    }
    return Array.from(seen.values());
  }

  // ---- Check if a user has any other socket still connected to this doc ----
  hasOtherSocketsForUser(docId, userId, excludeSocketId) {
    const room = this.rooms.get(docId);
    if (!room) return false;
    for (const [sid, entry] of room.entries()) {
      if (sid !== excludeSocketId && entry.userId === userId) return true;
    }
    return false;
  }
}

export const presenceStore = new PresenceStore();