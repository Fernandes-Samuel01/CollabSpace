import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  create,
  listAll,
  listMine,
  listShared,
  getOne,
  update,
  remove,
  addCollab,
  removeCollab,
} from "../controllers/document.controller.js";

const router = Router();

// All document routes are protected
router.use(protect);

// Collections
router.get("/", listAll);
router.get("/mine", listMine);
router.get("/shared", listShared);
router.post("/", create);

// Single document
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

// Collaborators
router.post("/:id/collaborators", addCollab);
router.delete("/:id/collaborators/:collaboratorId", removeCollab);

export default router;