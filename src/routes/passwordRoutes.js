import express from 'express';
import {
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  changePassword
} from '../controllers/passwordController.js';

const router = express.Router();

router.post('/request-otp', requestForgotPasswordOtp);

router.post('/verify-otp', verifyForgotPasswordOtp);

router.post('/change-password', changePassword);

export default router;