
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAdmins, createAdmin, updateAdmin, deleteAdmin, getAllUsers
} from "../controllers/adminController.js";

const router = express.Router();

router.route("/admins")
  .get(protect, authorize, getAdmins)
  .post(protect, authorize, createAdmin);

router.route("/admins/:id")
  .put(protect, authorize, updateAdmin)
  .delete(protect, authorize, deleteAdmin);

router.get("/users", protect, authorize, getAllUsers);

export default router;
