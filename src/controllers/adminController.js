import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find() 
    .populate('createdBy','name email');
  res.json({ productsCount: products.length, products });
});



export const updateProduct = asyncHandler(async (req, res) => {
  console.log("admin updated by:", req.user.name, "ID:", req.params.id);
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  Object.assign(product, req.body);
  await product.save();
  console.log("update", product.name);
  res.json(product);
});

export const deleteAnyProduct = asyncHandler(async (req, res) => {
  console.log("admin delete product:", req.user.name);
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "product deleted" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");  
  res.json({ usersCount: users.length, users });
});

export const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: { $in: ["admin", "superadmin"] } })
    .select("-password -tokens");
  res.json({ adminsCount: admins.length, admins });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "Email exists" });
  
  const admin = await User.create({ 
    name, 
    email, 
    password, 
    role: "admin", 
    isAdmin: true 
  });
  res.status(201).json({
    _id: admin._id, 
    name: admin.name, 
    email: admin.email, 
    role: admin.role 
  });
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.params.id);
  if (!admin || admin.role === "superadmin") {
    return res.status(404).json({ message: "Admin not found" });
  }
  admin.name = req.body.name || admin.name;
  admin.email = req.body.email || admin.email;
  if (req.body.password) admin.password = req.body.password;
  await admin.save();
  res.json({ message: "Admin updated", admin });
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.params.id);
  if (!admin || admin.role === "superadmin") {
    return res.status(404).json({ message: "Cannot delete superadmin" });
  }
  await admin.deleteOne();
  res.json({ message: "Admin deleted" });
});
