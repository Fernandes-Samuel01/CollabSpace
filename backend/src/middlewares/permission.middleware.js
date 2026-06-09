import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Document } from "../models/document.model.js";

/**
 * Loads the document by :id and attaches it to req.document.
 * Verifies the user has the required permission level.
 *
 * @param {"view" | "edit" | "manage"} level
 */
export const requireDocPermission = (level = "view") =>
  asyncHandler(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await Document.findById(docId);
    if (!doc) throw new ApiError(404, "Document not found");

    let allowed = false;
    if (level === "view") allowed = doc.canView(req.user.id);
    else if (level === "edit") allowed = doc.canEdit(req.user.id);
    else if (level === "manage") allowed = doc.canManage(req.user.id);

    if (!allowed) {
      throw new ApiError(403, `You don't have ${level} access to this document`);
    }

    req.document = doc;
    next();
  });