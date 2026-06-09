import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const ShareDocumentModal = ({
  isOpen,
  onClose,
  documentId,
  document,
  onShared,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [updatingRoleId, setUpdatingRoleId] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const collaborators = document?.collaborators || [];

  const handleShare = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(`/documents/${documentId}/collaborators`, {
        email: email.trim(),
        role,
      });

      const updatedDocument = res.data?.data?.document;

      setEmail("");
      setRole("editor");

      if (onShared) onShared(updatedDocument);

      toast.success("Document shared successfully");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to share document"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (collabUser, newRole) => {
    const collaboratorId = collabUser?._id || collabUser;
    const collaboratorEmail = collabUser?.email;

    if (!collaboratorEmail) {
      toast.error("Cannot update role because collaborator email is missing");
      return;
    }

    try {
      setUpdatingRoleId(collaboratorId);

      const res = await api.post(`/documents/${documentId}/collaborators`, {
        email: collaboratorEmail,
        role: newRole,
      });

      const updatedDocument = res.data?.data?.document;

      if (onShared) onShared(updatedDocument);

      toast.success("Role updated");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update role"
      );
    } finally {
      setUpdatingRoleId("");
    }
  };

  const handleRemove = async (collaboratorId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this collaborator?"
    );

    if (!confirmRemove) return;

    try {
      setRemovingId(collaboratorId);

      const res = await api.delete(
        `/documents/${documentId}/collaborators/${collaboratorId}`
      );

      const updatedDocument = res.data?.data?.document;

      if (onShared) onShared(updatedDocument);

      toast.success("Collaborator removed");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to remove collaborator"
      );
    } finally {
      setRemovingId("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Share Document
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <label className="label">User email</label>
            <input
              className="input"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Permission</label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            People with access
          </h3>

          {collaborators.length === 0 ? (
            <p className="text-sm text-slate-500">
              No collaborators added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {collaborators.map((collab) => {
                const collabUser = collab.user;
                const collaboratorId = collabUser?._id || collabUser;
                const isUpdating = updatingRoleId === collaboratorId;
                const isRemoving = removingId === collaboratorId;

                return (
                  <div
                    key={collaboratorId}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {collabUser?.name || "Unknown user"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {collabUser?.email || collabUser}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={collab.role}
                        disabled={isUpdating || isRemoving}
                        onChange={(e) =>
                          handleRoleChange(collabUser, e.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium capitalize text-slate-600 outline-none hover:bg-slate-50 disabled:opacity-50"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemove(collaboratorId)}
                        disabled={isRemoving || isUpdating}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareDocumentModal;