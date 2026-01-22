import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";




export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // split at space
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password -tokens");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Token invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }
});

export const authorize=async(req,res,next)=>{
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('admin access required')
  }
}

export const adminOnly = (req, res, next) => {
  console.log("REQ.USER =>", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
      yourRole: req.user.role
    });
  }

  next();
};


// export const adminOnly=async(req,res,next)=>{

//   if (!req.user) {
//     return res.status(400).json({
//       success:false,
//       massage:"not authenticated"
//     })
//   }
//    if (!req.user.role !== "admin") {
//     return res.status(400).json({
//       success:false,
//       massage:"admina access required"
//     })
//   }

//   if (req.user.role==='admin') {
//     next();
//   }
//   else{
//         console.log("MIDDLEWARE BLOCKED:", req.user?.role);
//     res.status(403);
//     throw new Error('admin access required');
//   }
// };

export const superAdminOnly=async(req,res,next)=>{
  if (req.user.role==='superadmin') {
    next();
  } else {
    res.status(403).json({message:"superadmin access required"})
   // throw new Error('super admin access required')
  }
};

export default{protect,authorize,adminOnly,superAdminOnly}