import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,    
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  userId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true,
    },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,     
    enum: ["user", "admin","superadmin"],  
    default: "user"
  },
    isAdmin: {
    type: Boolean,
    default: false
  },
  // tokens: [{
  //   token: {
  //     type: String,
  //     required: true
  //   },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //     expires: '7d'
  //   }
  // }]
}, { timestamps: true });

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 7);
  
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);  
export default User;
