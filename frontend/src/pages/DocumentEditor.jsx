import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { documentService } from "../services/document.service.js";
import { useDocumentSocket } from "../hooks/useDocumentSocket.js";
import { usePresence } from "../hooks/usePresence.js";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import PresenceBar from "../components/PresenceBar.jsx";
import TypingIndicator from "../components/TypingIndicator.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import ShareDocumentModal from "../components/ShareDocumentModal.jsx";
import toast from "react-hot-toast";

const DocumentEditor = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doc, setDoc] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [isShareOpen, setIsShareOpen] = useState(false);

  const isApplyingRemote = useRef(false);
  const saveStatusTimer = useRef(null);
  const typingTimer = useRef(null);
  const isTypingRef = useRef(false);

  const {
    users,
    typingUsers,
    activity,
    handlePresenceUpdate,
    handleActivity,
  } = usePresence(user?._id);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await documentService.getOne(docId);
        setDoc(res.data.document);
        setTitle(res.data.document.title);
        setContent(res.data.document.content);
        setRole(res.data.role);
      } catch (err) {
        toast.error(err.message);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [docId, navigate]);

  const { emitChange, emitTitle, emitTyping, connected } = useDocumentSocket(
    docId,
    {
      onJoined: ({ users: initialUsers }) => {
        if (initialUsers) handlePresenceUpdate({ users: initialUsers });
      },
      onRemoteChange: ({ content: newContent }) => {
        isApplyingRemote.current = true;
        setContent(newContent);
        setSaveStatus("saved");
        setTimeout(() => (isApplyingRemote.current = false), 0);
      },
      onRemoteTitle: ({ title: newTitle }) => {
        isApplyingRemote.current = true;
        setTitle(newTitle);
        setTimeout(() => (isApplyingRemote.current = false), 0);
      },
      onPresenceUpdate: handlePresenceUpdate,
      onUserJoined: ({ user: u }) => {
        toast.success(`${u.name} joined`, { icon: "👋", duration: 2000 });
      },
      onUserLeft: ({ user: u }) => {
        toast(`${u.name} left`, { icon: "👋", duration: 2000 });
      },
      onActivity: handleActivity,
      onError: (msg) => {
        toast.error(msg);
        navigate("/dashboard");
      },
    }
  );

  const canEdit = role === "owner" || role === "editor";
  const canShare = role === "owner";

  const triggerTyping = () => {
    if (!isTypingRef.current) {
      emitTyping(true);
      isTypingRef.current = true;
    }

    if (typingTimer.current) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      emitTyping(false);
      isTypingRef.current = false;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
    };
  }, []);

  const showSaving = () => {
    setSaveStatus("saving");

    if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);

    saveStatusTimer.current = setTimeout(() => {
      setSaveStatus("saved");
    }, 1800);
  };

  const handleContentChange = (e) => {
    if (!canEdit) return;

    const newContent = e.target.value;
    setContent(newContent);

    if (isApplyingRemote.current) return;

    emitChange(newContent);
    triggerTyping();
    showSaving();
  };

  const handleTitleChange = (e) => {
    if (!canEdit) return;

    const newTitle = e.target.value;
    setTitle(newTitle);

    if (isApplyingRemote.current) return;

    emitTitle(newTitle);
    showSaving();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            <PresenceBar users={users} currentUserId={user?._id} />

            {canShare && (
              <button
                onClick={() => setIsShareOpen(true)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Share
              </button>
            )}

            <div className="hidden items-center gap-3 text-xs sm:flex">
              <span
                className={`inline-flex items-center gap-1.5 ${connected ? "text-green-600" : "text-amber-600"
                  }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-amber-500"
                    }`}
                />
                {connected ? "Live" : "Connecting..."}
              </span>

              <span className="text-slate-400">|</span>

              <span className="text-slate-500">
                {saveStatus === "saving" ? "Saving..." : "All changes saved"}
              </span>

              <span className="text-slate-400">|</span>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 capitalize">
                {role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="card">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                disabled={!canEdit}
                placeholder="Untitled Document"
                className="w-full border-none bg-transparent text-3xl font-bold text-slate-900 outline-none placeholder-slate-300 disabled:cursor-not-allowed"
              />

              <hr className="my-4 border-slate-200" />

              <textarea
                value={content}
                onChange={handleContentChange}
                disabled={!canEdit}
                placeholder={
                  canEdit
                    ? "Start typing your document..."
                    : "You have view-only access"
                }
                className="min-h-[60vh] w-full resize-none bg-transparent leading-relaxed text-slate-800 outline-none disabled:cursor-not-allowed"
              />
            </div>

            <TypingIndicator users={typingUsers} />

            {!canEdit && (
              <p className="mt-3 text-center text-sm text-slate-500">
                🔒 Read-only mode — you don't have edit access
              </p>
            )}
          </div>

          <ActivityFeed activity={activity} />
        </div>
      </main>

      <ShareDocumentModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        documentId={docId}
        document={doc}
        onShared={(updatedDoc) => {
          setDoc(updatedDoc);
        }}
      />
    </div>
  );
};

export default DocumentEditor;