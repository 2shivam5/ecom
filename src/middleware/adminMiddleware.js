import { protect } from "./authMiddleware.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const adminProtect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED TOKEN:", decoded);

        const user=await User.findById(decoded.userId).select("-password");
        console.log("token decoded",decoded);
        console.log("user found:",user);
        
        

        if(!user || !user.isAdmin){
            return res.status(403).json({message:"Not authorized as admin"});
        }
        req.user=user;
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}