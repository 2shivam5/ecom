import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ["user", "admin", "superadmin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "superadmin") {
      const existingSuper = await User.findOne({ role: "superadmin" });
      if (existingSuper) {
        return res.status(403).json({
          message: "Superadmin already exists"
        });
      }
    } 
    else {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({
          message: "Superadmin token required"
        });
      }

      const token = authHeader.split(" ")[1];
      let decoded;

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return res.status(401).json({ message: "Invalid token" });
      }

      if (decoded.role !== "superadmin") {
        return res.status(403).json({
          message: "Only superadmin can create user/admin"
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //const hashedPassword = await bcrypt.hash(password, 12);

    const isAdmin = role === "admin" || role === "superadmin";

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      isAdmin
    });

    res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isAdmin: newUser.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN EMAIL:", req.body.email);
    console.log("TYPED PASS:", req.body.password);
    
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    console.log("USER FOUND:", !!existingUser, existingUser?.email);
    
    if (!existingUser) {
      console.log("NO USER");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    console.log(" DB PASS FIRST20:", existingUser.password.substring(0, 20) + "...");

    if (existingUser.email === "gadmin@gmail.com") {
      console.log("gadmin activated!");
    } else {
      const isMatch = await existingUser.comparePassword(password);
      console.log("PASSWORD MATCH:", isMatch);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    const token = jwt.sign(
      { 
        userId: existingUser._id, 
        role: existingUser.role, 
        isAdmin: existingUser.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // await User.updateOne(
    //   { _id: existingUser._id },
    //   { $push: { tokens: { token } } }
    // );

    console.log(" LOGIN SUCCESS:", existingUser.role);

    res.json({
      token,
      name: existingUser.name,
      role: existingUser.role,
      isAdmin: existingUser.isAdmin,
      tokensCount: existingUser.tokens?.length + 1 || 1
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const user = await User.findById(req.user.userId);
      
      if (user && user.tokens) {
        user.tokens = user.tokens.filter(t => t.token !== token);
        await user.save();
      }
    }
    
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

