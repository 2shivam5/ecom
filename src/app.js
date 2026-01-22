
import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; 
import User from "./models/userModel.js"; 


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders",orderRoutes);


app.post("/api/create-admin", async (req, res) => {
  try {
    const { name, email, password, role = "admin" } = req.body;
    const hashedPassword = await bcrypt.hash(password || "admin123", 12);
    
    const admin = await User.create({
      name: name || "Test Admin",
      email: email || "admin@test.com",
      password: hashedPassword,
      role: role,
      isAdmin: true
    });
    
    res.json({ 
      message: "Admin created successfully!", 
      admin: { name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API Working! Port 6000 " });
});

const PORT = 6000;
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const superUser = await User.findOne({ email: "gadmin@gmail.com" });
    if (!superUser) {
      const hashedPassword = await bcrypt.hash("superpass123", 12);
      await User.create({
        name: "Super Admin",
        email: "gadmin@gmail.com",
        password: hashedPassword,
        role: "superadmin",
        isAdmin: true
      });
      console.log(" SUPERADMIN CREATED! Email: gadmin@gmail.com | Pass: superpass123");
    }

    app.listen(PORT, () => {
      console.log(`Server running at port: ${PORT}`);
    });
  } catch (error) {
    console.error(" Startup error:", error);
  }
};

startServer();
