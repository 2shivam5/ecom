import asyncHandler from '../utils/asyncHandler.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';


// export const getCart = asyncHandler(async (req, res) => {
//       console.log('DEBUG USER:', req.user?._id); 
//         console.log(' PRODUCT ID:', req.body.productId);


//   const cart = await Cart.findOne({ userId: req.user._id })
//     .populate('items.productId', 'name');

//       console.log('DEBUG CART:', cart?.items?.length || 0); 

    
//   res.json({
//     success: true,
//     items: cart?.items || [],
//     totalAmount: cart?.totalAmount || 0,
//     message: " Cart loaded from MongoDB!"
//   });
// });

export const getCart=asyncHandler(async(req,res)=>{
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      suceess:false,
      message:"user not authenticated"
    });
  }
  console.log(req.user._id);

  const cart = await Cart.findOne({ userId:req.user._id })
  .populate("items.productId", "name price");
if (!cart) {
  return res.status(200).json({
    success:false,
    items:[],
    totalAmount:0,
    message: "cart is empty",
  });
}
  console.log(cart.items.length);
  res.status(200).json({
    success: true,
    items: cart.items,
    totalAmount: cart.totalAmount,
    message: "Cart loaded!",
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  console.log(userId)
  

  if (!userId) {
    return res.status(401).json({
       success: false, 
       message: "User not authenticated" });
  }
  if (req.user.role !== "user") {
    return res.status(401).json({
      message:"only user insert product in cart"
    })
  }

  const productId = req.params.id;
  const { quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [], totalAmount: 0 });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId: product._id,
      quantity,
      price: product.price
    });
  }

  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    cart
  });
});

export const removeFromCart=asyncHandler(async(req,res)=>{
console.log('remove item',req.params.productId);


let cart=await Cart.findOne({ userId: req.user._id})
if(!cart || !cart.items.length){
    return res.json({
        success:true,
        items:[],
        totalAmount:0,
        message:'cart already empty'
    });
}
const initialCount = cart.items.length;
cart.items=cart.items.filter(item => item.productId.toString() !==req.params.productId);

  cart.totalAmount = cart.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

await cart.save();
console.log("item left:", cart.items.length);

res.json({
    success:true,
    message:'item removed',
    itemsCount:cart.items.length,
    totalAmount:cart.totalAmount
});

});