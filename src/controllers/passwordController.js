import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import  eventBus  from "../events/eventBus.js";
import bcrypt from "bcryptjs";
//import { sendEmailinBackground } from "../services/emailServices.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestForgotPasswordOtp=asyncHandler(async(req,res)=>{
    const { email }= req.body;

    if (!email) {
        return res.status(400)
        .json({ message: "Email is required" });
    }

    const user=await User.findOne({email,role:{$in:["user","admin"]}}); 
    if (!user) {
        return res.status(404)
        .json({ message: "User with this email does not exist" });
    }
    
    const otp=generateOTP();
    console.log("forgot password OTP:",otp);

    user.forgotOtp=await bcrypt.hash(otp,7);
    user.forgotOtpVerified=0;
    await user.save();

    res.json({success:true,message:"OTP sent to your email, please check inbox"});

    eventBus.emit("SendEmail", {
        to: email,
        subject: "Your Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
    });
});


export const verifyForgotPasswordOtp=asyncHandler(async(req,res)=>{

    const { email,otp}=req.body;

    if(!email || !otp ){
        return res.status(400)
        .json({message:"Email and OTP are required"});
    }

    const user=await User.findOne({email,role:{$in:["user","admin"]}});

    if(!user){
        return res.status(404)
        .json({message:"User not found"}); 
    }
    if(!user.forgotOtp){
        return res.status(400)  
        .json({message:"OTP not requested"});
    }
    const isMatch = await bcrypt.compare(otp, user.forgotOtp);
        if (!isMatch) {            
            return res.status(400)
            .json({message:"Invalid OTP"});
        }
        
        user.forgotOtpVerified=1;
        await user.save();

    res.json({success:true,
        message:"OTP verified successfully. You can now reset your password."
    });
    
});

export const changePassword=asyncHandler(async(req,res)=>{
const{ email, password, confirmPassword}=req.body;

if(!email || !password || !confirmPassword){
    return res.status(400)
    .json({message:"Email, password and confirm password are required"});
};

if(password !== confirmPassword){
    return res.status(400)
    .json({message:"Passwords & confirm password do not match"});
};

const user=await User.findOne({email,role:{$in:["user","admin"]}});

if(!user){
    return res.status(404)
    .json({message:"User not found"});
};

if(user.forgotOtpVerified !==1 ){
    return res.status(400)
    .json({message:"OTP not verified"});
}
user.password=password;
user.forgotOtp=undefined;
user.forgotOtpVerified=0;

await user.save();

res.json({
    success:true,
    message:"Password changed successfully. You can now log in with your new password." 
    });
});