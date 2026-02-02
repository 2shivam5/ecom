
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Product from "../models/productModel.js";
import mongoose from 'mongoose';
 

// export const regUserAndAdmin=asyncHandler(async(req,res)=>{
// const {name,email,password,role}=req.body;

// if (!["user","admin"].includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
// }
// const exists=await User.findOne ({ email });

// if (exists) {
//   return res.status(400).json({message:"user already exist"})
// }
// const newUser=await User.create({
//   name,
//   email,
//   password,
//   role,
//   isAdmin:role ==="admin"
// });
// res.status(201).json({
//   success:true,
//   massage:`${role},created successfully`,
//   user:{
//     id:newUser.id,
//     name:newUser.name,
//     email:newUser.email,
//     role:newUser.role
//   }
// });
// });

export const getUserById = asyncHandler(async(req,res)=>{
 const { id }= req.params;

 if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400)
  .json({message:"Invalid user ID"});

 }
 const user=await User.findById(id).select("-password -tokens");
 
 if (!user) {
  return res.status(404)
  .json({message:"User not found"});
 }
  res.json(user);
});


export const getUserProfile = asyncHandler(async (req, res) => {
  console.log("PROFILE:", req.user.name);
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    isAdmin: req.user.isAdmin
  });
});

export const getUserProducts = asyncHandler(async (req, res) => {
  console.log("USER PRODUCTS:", req.user.name);
  const products = await Product.find({ createdBy: req.user._id })
    .select('name price category image');
  res.json({ 
    success: true,
    count: products.length, 
    products 
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  Object.assign(user, req.body);
  const updatedUser = await user.save();
  
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role
  });
});
