const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  let text;
  if (users.length === 1) text = `${users[0].name} is typing`;
  else if (users.length === 2)
    text = `${users[0].name} and ${users[1].name} are typing`;
  else text = `${users[0].name} and ${users.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 h-4">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
      </div>
      <span>{text}...</span>
    </div>
  );
};

export default TypingIndicator;