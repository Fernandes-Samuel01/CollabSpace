import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-xl font-bold text-indigo-600 tracking-tight"
        >
          CollabSpace
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 hidden sm:inline">
            {user?.name}
          </span>
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;