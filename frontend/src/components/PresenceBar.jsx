const COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-teal-500",
];

const colorFor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

const Avatar = ({ user, ring = false }) => {
  const initial = user.name?.[0]?.toUpperCase() || "?";
  return (
    <div
      title={`${user.name}${user.isTyping ? " (typing)" : ""}`}
      className={`relative w-9 h-9 rounded-full text-white flex items-center justify-center font-semibold text-sm ${colorFor(
        user.userId
      )} ${ring ? "ring-2 ring-white" : ""}`}
    >
      {initial}
      {user.isTyping && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white animate-pulse" />
      )}
    </div>
  );
};

const PresenceBar = ({ users, currentUserId }) => {
  if (!users || users.length === 0) return null;

  // Self first, others after
  const sortedUsers = [...users].sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return 0;
  });

  const visible = sortedUsers.slice(0, 5);
  const overflow = sortedUsers.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((u) => (
        <Avatar key={u.userId} user={u} ring />
      ))}
      {overflow > 0 && (
        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-semibold ring-2 ring-white">
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default PresenceBar;