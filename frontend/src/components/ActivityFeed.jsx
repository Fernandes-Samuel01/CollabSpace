const formatTimeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
};

const ActivityFeed = ({ activity }) => {
  return (
    <aside className="card sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        Recent Activity
      </h3>
      {(!activity || activity.length === 0) ? (
        <p className="text-xs text-slate-400">No activity yet</p>
      ) : (
        <ul className="space-y-3">
          {activity.map((event) => (
            <li key={event.id} className="flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold flex-shrink-0">
                {event.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700">
                  <span className="font-medium">{event.user?.name}</span>{" "}
                  <span className="text-slate-500">
                    {event.action === "renamed" ? "renamed the document" : "edited"}
                  </span>
                </p>
                <p className="text-slate-400 mt-0.5">
                  {formatTimeAgo(event.at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default ActivityFeed;