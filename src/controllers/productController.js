


import asyncHandler from "../utils/asyncHandler.js";
import { Product } from "../models/productModel.js";

export const createProduct = asyncHandler(async (req, res) => {
 console.log("DEBUG - req.user:", req.user);
  console.log("DEBUG - req.user.role:", req.user?.role, "TYPE:", typeof req.user?.role);

  if (req.user.role !== 'admin') {
        console.log("BLOCKED:", req.user.role, "tried to create product");

    res.status(403);
    throw new Error('Only Normal Admin can create products');
  }
    console.log("ADMIN ALLOWED:", req.user.name);

  const product = new Product({
    ...req.body,
    createdBy: req.user._id,
    user: req.user._id,
    stock: req.body.stock || 0
  });
  
  const savedProduct = await product.save();
  console.log(" SAVED:", savedProduct.name);
  res.status(201).json(savedProduct);
});

export const getProducts = asyncHandler(async (req, res) => {
  console.log("GET PRODUCTS by:", req.user?.name || "guest");
  
  const query = req.user?.role === 'admin' || req.user?.isAdmin
    ? {}  
    : { createdBy: req.user._id };  
    
  const products = await Product.find(query)
    .select('name price category image stock');
    
  res.json({
    success: true,
    count: products.length,
    products
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    ...(req.user?.role !== 'admin' ? { createdBy: req.user._id } : {})
  });
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    ...(req.user?.role !== 'admin' ? { createdBy: req.user._id } : {})
  });
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    ...(req.user?.role !== 'admin' ? { createdBy: req.user._id } : {})
  });
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json({ message: "Product deleted successfully" });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  if (req.user.role !== 'superadmin') {
    res.status(403);
    throw new Error('SuperAdmin access required');
  }
  
  const products = await Product.find()
    .select('name price category image stock createdBy');
    
  res.json({ 
    success: true,
    productsCount: products.length, 
    products 
  });
});

export const deleteAnyProduct = asyncHandler(async (req, res) => {
  if (req.user.role !== 'superadmin') {
    res.status(403);
    throw new Error('SuperAdmin access required');
  }
  
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json({ message: "Product deleted successfully", deletedProduct });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  
  const products = await Product.find({ category })
    .select('name price image category stock')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    
  const total = await Product.countDocuments({ category });
  
  res.json({
    success: true,
    category,
    count: products.length,
    total,
    page,
    products
  });
});
