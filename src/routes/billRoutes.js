import express from "express";
import {
  createInvoice
} from "../controllers/billController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, createInvoice);

export default router;