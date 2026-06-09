import mongoose from "mongoose";

export const DOC_ROLES = {
  OWNER: "owner",
  EDITOR: "editor",
  VIEWER: "viewer",
};

const collaboratorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: [DOC_ROLES.EDITOR, DOC_ROLES.VIEWER],
      default: DOC_ROLES.EDITOR,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      default: "Untitled Document",
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ---- Indexes for fast queries ----
documentSchema.index({ owner: 1, updatedAt: -1 });
documentSchema.index({ "collaborators.user": 1, updatedAt: -1 });

// ---- Instance methods (used in services + sockets) ----

/**
 * Check if a user has access to this doc, and return their role.
 * Returns null if no access.
 */
documentSchema.methods.getUserRole = function (userId) {
  const uid = userId.toString();
  if (this.owner.toString() === uid) return DOC_ROLES.OWNER;

  const collab = this.collaborators.find(
    (c) => c.user.toString() === uid
  );
  return collab ? collab.role : null;
};

documentSchema.methods.canView = function (userId) {
  return this.getUserRole(userId) !== null;
};

documentSchema.methods.canEdit = function (userId) {
  const role = this.getUserRole(userId);
  return role === DOC_ROLES.OWNER || role === DOC_ROLES.EDITOR;
};

documentSchema.methods.canManage = function (userId) {
  return this.getUserRole(userId) === DOC_ROLES.OWNER;
};

export const Document = mongoose.model("Document", documentSchema);