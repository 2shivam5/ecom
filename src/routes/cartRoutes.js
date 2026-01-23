
import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import { getCart, addToCart,removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.use(protect);

router.post('/add/:id',protect, addToCart);
router.get('/', getCart);          
router.delete('/remove/:productId',removeFromCart) 

export default router;
