import express from 'express';
import {
  requestForgotPassword,
  verifyForgotPasswordOtp,
} from '../controllers/passwordController.js';

const router = express.Router();

router.post('/request-reset', requestForgotPassword);

router.post('/reset', verifyForgotPasswordOtp);

export default router;