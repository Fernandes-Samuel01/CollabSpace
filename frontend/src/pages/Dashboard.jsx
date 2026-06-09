import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { documentService } from "../services/document.service.js";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState("all"); // all | mine | shared

  const fetchDocs = async (currentTab = tab) => {
    setLoading(true);
    try {
      let res;
      if (currentTab === "mine") res = await documentService.listMine();
      else if (currentTab === "shared") res = await documentService.listShared();
      else res = await documentService.list();
      setDocs(res.data.documents);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(tab);
    // eslint-disable-next-line
  }, [tab]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await documentService.create({
        title: "Untitled Document",
        content: "",
      });
      toast.success("Document created");
      navigate(`/documents/${res.data.document._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this document?")) return;
    try {
      await documentService.remove(id);
      toast.success("Deleted");
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "mine", label: "My Documents" },
    { key: "shared", label: "Shared with me" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Hello, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your documents — collaborate in real-time
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="btn-primary"
          >
            {creating ? "Creating..." : "+ New Document"}
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-slate-200 flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                tab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Document grid */}
        {loading ? (
          <Loader />
        ) : docs.length === 0 ? (
          <div className="mt-12 text-center text-slate-500">
            <p className="text-lg">No documents yet</p>
            <p className="text-sm mt-1">
              Click "New Document" to create your first one
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => {
              const isOwner = doc.owner._id === user._id;
              return (
                <div
                  key={doc._id}
                  onClick={() => navigate(`/documents/${doc._id}`)}
                  className="card cursor-pointer hover:shadow-md transition group"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900 truncate flex-1">
                      {doc.title}
                    </h3>
                    {isOwner && (
                      <button
                        onClick={(e) => handleDelete(doc._id, e)}
                        className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[2.5rem]">
                    {doc.content || "Empty document"}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {isOwner ? "Owner" : "Shared"} · by {doc.owner.name}
                    </span>
                    <span>
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;