import asyncHandler from "../utils/asyncHandler.js";
import { Cart } from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId", "name price stock");

  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  const orderItems = [];

  for (const item of cart.items) {
    const product = item.productId;
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < item.quantity) return res.status(400).json({ message: `Out of stock: ${product.name}` });

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: item.price
    });

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: "COD",
    price: cart.totalAmount
  });

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  res.status(201).json({ success: true, message: "Order Placed Successfully (COD)" });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ count: orders.length, orders });
});

export const updateStatusByAdmin = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const currentStatus = order.orderStatus.toLowerCase();
  const newStatus = status.toLowerCase();

  if (newStatus === "delivered" && currentStatus !== "shipped")
    return res.status(400).json({ message: "Order must be shipped first" });

  order.orderStatus = newStatus;
  if (newStatus === "delivered") {
    order.isDelivered = true;
    order.isPaid = true;
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.json({ success: true, order });
});

export const shipOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.orderStatus !== "Pending")
    return res.status(400).json({ message: "Order must be pending" });

  order.orderStatus = "shipped";
  order.shippedAt = Date.now();
  await order.save();

  res.json({ success: true, order });
});

export const sendDeliveryOtp = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.orderStatus !== "shipped") return res.status(400).json({ message: "Order must be shipped first" });

  const otp = order.generateDeliveryOtp();
  await order.save();
  console.log("DELIVERY OTP:", otp);

  res.json({ success: true, message: "Delivery OTP generated" });
});

export const verifyDeliveryOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const isValid = order.verifyDeliveryOtp(otp);
  if (!isValid) return res.status(400).json({ message: "Invalid or expired OTP" });

  order.orderStatus = "delivered";
  order.isDelivered = true;
  isPaid:true,
  order.deliveryConfirmed = true;
  order.deliveredAt = Date.now();
  order.deliveryOtp = undefined;
  order.otpExpireAt = undefined;

  await order.save();
  res.json({ success: true, message: "Order delivery successfully" });
});



// import asyncHandler from "../utils/asyncHandler.js";
// import { Cart } from "../models/cartModel.js";
// import Product from "../models/productModel.js";
// import Order from "../models/orderModel.js";


// export const createOrder = asyncHandler(async (req, res) => {
//   const { shippingAddress } = req.body;

//   const cart = await Cart.findOne({ userId: req.user._id })
//     .populate("items.productId", "name price stock");

//   if (!cart || cart.items.length === 0) {
//     return res.status(400).json({ message: "Cart is empty" });
//   }

//   const orderItems = [];

//   for (const item of cart.items) {
//     const product = item.productId;

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (product.stock < item.quantity) {
//       return res.status(400).json({
//         message: `Out of stock: ${product.name}`
//       });
//     }

//     orderItems.push({
//       product: product._id, 
//       name: product.name,
//       quantity: item.quantity,
//       price: item.price
//     });

//     product.stock -= item.quantity;
//     await product.save();
//   }

//   const order = await Order.create({
//     user: req.user._id,
//     orderItems,
//     shippingAddress,
//     paymentMethod: "COD",
//     price: cart.totalAmount,
//     orderStatus: "Pending",
//     isPaid: false,
//     isDelivered: false
//   });

//   cart.items = [];
//   cart.totalAmount = 0;
//   await cart.save();

//   res.status(201).json({
//     success: true,
//     message: "Order Placed Successfully (COD)",
//     order
//   });
// });

// export const getMyOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
//   res.json({
//     count: orders.length,
//     orders
//   });
// });


// export const updateStatusByAdmin = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   const order = await Order.findById(req.params.id);

//   if (!order) return res.status(404).json({ message: "Order not found" });

//   const currentStatus = order.orderStatus.toLowerCase();
//   const newStatus = status.toLowerCase();

 

//   if (newStatus === "delivered" && currentStatus !== "shipped") {
//     return res.status(400).json({ message: "Order must be shipped first" });
//   }

//   order.orderStatus = newStatus;

//   if (newStatus === "delivered") {
//     order.isDelivered = true;
//     order.isPaid=true;
//     order.deliveredAt = Date.now();
//   }

//   const updatedOrder = await order.save();
//   res.json(updatedOrder);
// });


// export const sendDeliveryOtp=asyncHandler(async(req,res)=>{
//   const order=await Order.findById(req.params.id);
//   //.populate("user");

//   if (!order) {
//     return res.status(401).json({
//       message:"order not found"
//     });
//   }

//   if (order.status !== "shipped") {
//     return res.status(401).json({
//       message:"order not shipped"
//     });
//   }
//   const otp=order.genrateDeliveryOtp();
//   await order.save();

//   //console.log(`otp for ${order.user.email}: ${otp}`);
//   console.log("delivery otp",otp);
  

//   res.json({message: "otp sent"})
// });

// export const verifyDeliveryOtp=asyncHandler(async(req,res)=>{
//   const {otp}=req.body;

//   const order=await order.findById(req.params.id);

//   if (!order) {
//     return res.status(401).json({
//       message:"order not found"
//     });
//   }
//   const isValid=order.verifyDeliveryOtp(otp);

//   if (!isValid) {
//     return res.status(401).json({
//       message:"invalid or expire otp"
//     });
//   }

//   order.status="deliveres";
//   order.isDelivered=true;
//   order.deliveryConfirm=true;
//   order.deliveredAt=Date.now();
//   order.deliveryOtp=undefined;
//   order.otpExpiresAt=undefined;

//   await order.save();

//   res.json({message:"order delivered successfuly"});
// });



