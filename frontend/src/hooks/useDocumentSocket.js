import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext.jsx";

export const useDocumentSocket = (docId, handlers = {}) => {
  const { socket, connected } = useSocket();
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!socket || !connected || !docId) return;

    socket.emit("document:join", { docId }, (res) => {
      if (!res?.success) {
        handlersRef.current.onError?.(res?.message || "Failed to join");
        return;
      }
      handlersRef.current.onJoined?.({
        canEdit: res.canEdit,
        users: res.users || [],
      });
    });

    const onChange = (p) => handlersRef.current.onRemoteChange?.(p);
    const onTitle = (p) => handlersRef.current.onRemoteTitle?.(p);
    const onPresence = (p) => handlersRef.current.onPresenceUpdate?.(p);
    const onJoined = (p) => handlersRef.current.onUserJoined?.(p);
    const onLeft = (p) => handlersRef.current.onUserLeft?.(p);
    const onActivity = (p) => handlersRef.current.onActivity?.(p);

    socket.on("document:change", onChange);
    socket.on("document:title", onTitle);
    socket.on("presence:update", onPresence);
    socket.on("presence:joined", onJoined);
    socket.on("presence:left", onLeft);
    socket.on("activity:edit", onActivity);

    return () => {
      socket.off("document:change", onChange);
      socket.off("document:title", onTitle);
      socket.off("presence:update", onPresence);
      socket.off("presence:joined", onJoined);
      socket.off("presence:left", onLeft);
      socket.off("activity:edit", onActivity);
      socket.emit("document:leave", { docId });
    };
  }, [socket, connected, docId]);

  const emitChange = (content) => {
    socket?.emit("document:change", { docId, content });
  };
  const emitTitle = (title) => {
    socket?.emit("document:title", { docId, title });
  };
  const emitTyping = (isTyping) => {
    socket?.emit("presence:typing", { docId, isTyping });
  };

  return { emitChange, emitTitle, emitTyping, connected };
};