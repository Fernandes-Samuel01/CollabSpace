import api from "../api/axios.js";

export const documentService = {
  list: () => api.get("/documents"),
  listMine: () => api.get("/documents/mine"),
  listShared: () => api.get("/documents/shared"),
  getOne: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post("/documents", data),
  update: (id, data) => api.patch(`/documents/${id}`, data),
  remove: (id) => api.delete(`/documents/${id}`),
  addCollaborator: (id, data) =>
    api.post(`/documents/${id}/collaborators`, data),
  removeCollaborator: (id, collaboratorId) =>
    api.delete(`/documents/${id}/collaborators/${collaboratorId}`),
};