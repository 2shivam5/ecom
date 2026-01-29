import express from "express";
import { sendOTPEmail } from "../utils/sendMail.js";
import Order from "../models/orderModel.js";

const router = express.Router();

router.get("/test-mail", async (req, res) => {
  await sendOTPEmail({
   to:Order.user.email,
   name:Order.user.name,
    otp
  });

  res.json({ success: true, message: "Test mail sent " });
});

export default router;
