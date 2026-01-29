

import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createProduct, getProducts, getProduct, updateProduct, 
  deleteProduct, getProductsByCategory
} from "../controllers/productController.js";

const router = express.Router();

router.post('/createProduct', protect, adminOnly, createProduct);  
router.get('/category/:category', getProductsByCategory);

router.get('/', protect, getProducts);
router.route('/:id')
  .get(protect, getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
