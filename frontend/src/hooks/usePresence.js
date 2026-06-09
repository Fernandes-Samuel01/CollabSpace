import { useState, useCallback } from "react";

export const usePresence = (currentUserId) => {
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);

  const handlePresenceUpdate = useCallback(({ users }) => {
    setUsers(users || []);
  }, []);

  const handleActivity = useCallback((event) => {
    setActivity((prev) => {
      const next = [{ ...event, id: `${Date.now()}-${Math.random()}` }, ...prev];
      return next.slice(0, 30); // keep last 30 events
    });
  }, []);

  // Other users (exclude self)
  const otherUsers = users.filter((u) => u.userId !== currentUserId);

  // Typing users (exclude self)
  const typingUsers = otherUsers.filter((u) => u.isTyping);

  return {
    users,
    otherUsers,
    typingUsers,
    activity,
    handlePresenceUpdate,
    handleActivity,
  };
};