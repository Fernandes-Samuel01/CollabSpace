import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createDocument,
  getDocumentById,
  listAccessibleDocuments,
  listOwnedDocuments,
  listSharedDocuments,
  updateDocument,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
} from "../services/document.service.js";

// ---- POST /documents ----
export const create = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const doc = await createDocument({
    userId: req.user.id,
    title,
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { document: doc }, "Document created"));
});

// ---- GET /documents ----
export const listAll = asyncHandler(async (req, res) => {
  const docs = await listAccessibleDocuments({ userId: req.user.id });
  return res
    .status(200)
    .json(new ApiResponse(200, { documents: docs }, "Documents fetched"));
});

// ---- GET /documents/mine ----
export const listMine = asyncHandler(async (req, res) => {
  const docs = await listOwnedDocuments({ userId: req.user.id });
  return res
    .status(200)
    .json(new ApiResponse(200, { documents: docs }, "Owned documents"));
});

// ---- GET /documents/shared ----
export const listShared = asyncHandler(async (req, res) => {
  const docs = await listSharedDocuments({ userId: req.user.id });
  return res
    .status(200)
    .json(new ApiResponse(200, { documents: docs }, "Shared documents"));
});

// ---- GET /documents/:id ----
export const getOne = asyncHandler(async (req, res) => {
  const { document, role } = await getDocumentById({
    userId: req.user.id,
    docId: req.params.id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { document, role }, "Document fetched"));
});

// ---- PATCH /documents/:id ----
export const update = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (title === undefined && content === undefined) {
    throw new ApiError(400, "Provide title or content to update");
  }

  const doc = await updateDocument({
    userId: req.user.id,
    docId: req.params.id,
    updates: { title, content },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { document: doc }, "Document updated"));
});

// ---- DELETE /documents/:id ----
export const remove = asyncHandler(async (req, res) => {
  const data = await deleteDocument({
    userId: req.user.id,
    docId: req.params.id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Document deleted"));
});

// ---- POST /documents/:id/collaborators ----
export const addCollab = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    throw new ApiError(400, "Email and role are required");
  }

  const doc = await addCollaborator({
    userId: req.user.id,
    docId: req.params.id,
    collaboratorEmail: email,
    role,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { document: doc }, "Collaborator added"));
});

// ---- DELETE /documents/:id/collaborators/:collaboratorId ----
export const removeCollab = asyncHandler(async (req, res) => {
  const doc = await removeCollaborator({
    userId: req.user.id,
    docId: req.params.id,
    collaboratorId: req.params.collaboratorId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { document: doc }, "Collaborator removed"));
});