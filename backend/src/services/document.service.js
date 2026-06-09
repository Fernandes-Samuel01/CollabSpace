import { Document } from "../models/document.model.js";
import { ApiError } from "../utils/ApiError.js";

// ---- CREATE DOCUMENT ----
export const createDocument = async ({ userId, title, content }) => {
  const doc = await Document.create({
    title: title || "Untitled Document",
    content: content || "",
    owner: userId, // ✅ FIX: ensure owner is set
    collaborators: [],
  });

  return doc;
};

// ---- GET DOCUMENT BY ID ----
export const getDocumentById = async ({ userId, docId }) => {
  const document = await Document.findById(docId).populate(
    "owner collaborators.user",
    "name email"
  );

  if (!document) throw new ApiError(404, "Document not found");

  // ✅ OWNER ACCESS
  if (document.owner._id.toString() === userId) {
    return { document, role: "owner" };
  }

  // ✅ COLLABORATOR ACCESS
  const collaborator = document.collaborators.find(
    (c) => c.user._id.toString() === userId
  );

  if (!collaborator) {
    throw new ApiError(403, "You don't have access to this document");
  }

  return { document, role: collaborator.role };
};

// ---- LIST ALL ACCESSIBLE ----
export const listAccessibleDocuments = async ({ userId }) => {
  return await Document.find({
    $or: [
      { owner: userId },
      { "collaborators.user": userId },
    ],
  })
    .populate("owner", "name email")
    .sort({ updatedAt: -1 });
};

// ---- LIST OWNED ----
export const listOwnedDocuments = async ({ userId }) => {
  return await Document.find({ owner: userId })
    .populate("owner", "name email")
    .sort({ updatedAt: -1 });
};

// ---- LIST SHARED ----
export const listSharedDocuments = async ({ userId }) => {
  return await Document.find({
    "collaborators.user": userId,
  })
    .populate("owner", "name email")
    .sort({ updatedAt: -1 });
};

// ---- UPDATE ----
export const updateDocument = async ({ userId, docId, updates }) => {
  const { document, role } = await getDocumentById({ userId, docId });

  if (role === "viewer") {
    throw new ApiError(403, "You don't have edit permissions");
  }

  if (updates.title !== undefined) document.title = updates.title;
  if (updates.content !== undefined) document.content = updates.content;

  await document.save();
  return document;
};

// ---- DELETE ----
export const deleteDocument = async ({ userId, docId }) => {
  const document = await Document.findById(docId);

  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== userId) {
    throw new ApiError(403, "Only owner can delete document");
  }

  await document.deleteOne();
  return { success: true };
};

// ---- ADD COLLABORATOR ----
export const addCollaborator = async ({
  userId,
  docId,
  collaboratorEmail,
  role,
}) => {
  const document = await Document.findById(docId);
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== userId) {
    throw new ApiError(403, "Only owner can add collaborators");
  }

  const { User } = await import("../models/user.model.js");
  const user = await User.findOne({ email: collaboratorEmail });

  if (!user) throw new ApiError(404, "User not found");

  const already = document.collaborators.find(
    (c) => c.user.toString() === user._id.toString()
  );

  if (already) {
    already.role = role;
  } else {
    document.collaborators.push({ user: user._id, role });
  }

  await document.save();
  return document;
};

// ---- REMOVE COLLABORATOR ----
export const removeCollaborator = async ({
  userId,
  docId,
  collaboratorId,
}) => {
  const document = await Document.findById(docId);
  if (!document) throw new ApiError(404, "Document not found");

  if (document.owner.toString() !== userId) {
    throw new ApiError(403, "Only owner can remove collaborators");
  }

  document.collaborators = document.collaborators.filter(
    (c) => c.user.toString() !== collaboratorId
  );

  await document.save();
  return document;
};