
// // import express from "express";
// // import { protect, adminOnly } from "../middleware/authMiddleware.js";
// // import {
// //   createOrder,
// //   getMyOrders,
// //   updateStatusByAdmin
// // } from "../controllers/orderController.js";
// // import asyncHandler from "../utils/asyncHandler.js";
// // import Order from "../models/orderModel.js";

// // const router = express.Router();

// // router.post("/", protect, createOrder);
// // router.get("/my", protect, getMyOrders);


// // router.put("/:id/ship",protect,adminOnly, asyncHandler(async(req,res)=>{
// //   const order=await Order.findById(req.params.id);

// //   if (!order) {
// //     return res.status(400).json({message:"order not found"})
// //   }
// //   if (order.orderStatus !== "Pending") {
// //        return res.status(400).json({message:"order must be pending"})
// //   }
// //   order.orderStatus="shipped";
// //   order.shippedAt=Date.now();

// //   await order.save();
// //   res.json(order);
// // }));


// // router.put("/:id/deliver",protect,adminOnly,asyncHandler(async(req,res)=>{
// //   const order=await Order.findById(req.params.id);

// //   if (!order) {
// //     return res.status(400).json({message:"order not found"})
// //   }
// //   if (order.orderStatus !== "shipped") {
// //     return res.status(400).json({message:"order must be shipped first"})
// //   }
// //   order.orderStatus="delivered";
// //   order.isPaid=true;
// //   order.isDelivered=true;
  
// //   order.deliveredAt=Date.now();
// // await order.save();
// // res.json(order);
// // }));



// // router.put("/:id/status", protect, adminOnly, updateStatusByAdmin);

// // export default router;


// import express from "express";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";
// import {
//   createOrder,
//   getMyOrders,
//   updateStatusByAdmin
// } from "../controllers/orderController.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import Order from "../models/orderModel.js";

// const router = express.Router();


// router.post("/", protect, createOrder);

// router.get("/my", protect, getMyOrders);


// // router.put(
// //   "/:id/ship",
// //   protect,
// //   adminOnly,
// //   asyncHandler(async (req, res) => {
// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({ message: "Order not found" });
// //     }

// //     if (order.orderStatus !== "Pending") {
// //       return res.status(400).json({ message: "Order must be pending" });
// //     }

// //     order.orderStatus = "shipped";
// //     order.shippedAt = Date.now();

// //     await order.save();
// //     res.json(order);
// //   })
// // );

// // router.put(
// //   "/:id/send-otp",
// //   protect,
// //   adminOnly,
// //   asyncHandler(async (req, res) => {
// //     const order = await Order.findById(req.params.id).populate("user");

// //     if (!order) {
// //       return res.status(404).json({ message: "Order not found" });
// //     }

// //     if (order.orderStatus !== "shipped") {
// //       return res
// //         .status(400)
// //         .json({ message: "Order must be shipped first" });
// //     }

// //     const otp = order.generateDeliveryOtp();
// //     await order.save();

// //     console.log(" DELIVERY OTP:", otp);

// //     res.json({
// //       message: "Delivery OTP sent ",
      
// //     });
// //   })
// // );

// // router.put(
// //   "/:id/verify-otp",
// //   protect,
// //   asyncHandler(async (req, res) => {
// //     const { otp } = req.body;

// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({ message: "Order not found" });
// //     }

// //     if (order.orderStatus !== "shipped") {
// //       return res
// //         .status(400)
// //         .json({ message: "Order not ready for delivery" });
// //     }

// //     const isValid = order.verifyDeliveryOtp(otp);

// //     if (!isValid) {
// //       return res
// //         .status(400)
// //         .json({ message: "Invalid or expired OTP" });
// //     }

// //     order.orderStatus = "delivered";
// //     order.isDelivered = true;
// //     order.deliveredAt = Date.now();
// //     order.isPaid=true;
// //     order.deliveryConfirmed = true;
// //     order.deliveryOtp = undefined;
// //     order.otpExpiresAt = undefined;

// //     await order.save();

// //     res.json({
// //       success: true,
// //       message: "Order delivered successfully",
// //       order
// //     });
// //   })
// // );



// router.put("/:id/status", protect, adminOnly, updateStatusByAdmin);

// export default router;

import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  createOrder,
  getMyOrders,
  updateStatusByAdmin,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  shipOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);

router.put("/:id/ship", protect, adminOnly, shipOrder);

router.put("/:id/status", protect, adminOnly, updateStatusByAdmin);

router.put("/:id/verify-otp", protect, verifyDeliveryOtp);

router.put("/:id/send-otp", protect, adminOnly, sendDeliveryOtp);

export default router;
