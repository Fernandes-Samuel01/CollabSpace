const Loader = ({ fullScreen = false }) => {
  const wrapper = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-slate-50 z-50"
    : "flex items-center justify-center py-8";

  return (
    <div className={wrapper}>
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
};

export default Loader;