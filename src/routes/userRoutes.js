import express from "express";
import { protect, superAdminOnly } from "../middleware/authMiddleware.js";
import { loginUser, logoutUser, registerUser, } from "../controllers/authController.js";
import { getUserProfile, getUserProducts } from "../controllers/userController.js";

const router=express.Router();


router.post("/register",protect,superAdminOnly, registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);  
router.get("/products", protect, getUserProducts);


export default router;