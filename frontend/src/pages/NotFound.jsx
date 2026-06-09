import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <p className="mt-2 text-lg text-slate-700">Page not found</p>
        <Link to="/" className="mt-6 inline-block btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;