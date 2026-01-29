import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import { sendOTPEmail } from "../utils/sendMail.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestForgotPassword=asyncHandler(async(req,res)=>{
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

    console.log("forgot passwprd",otp);

    user.forgotOtp=otp;
    user.forgotOtpExpiresAt=Date.now()+10*60*1000;
    user.forgotOtpAttempts=0;

    await user.save();

     await sendOTPEmail({
    to: user.email,
    subject: "Reset Password OTP",
    text: `Hi ${user.name},

Your password reset OTP is: ${otp}

This OTP is valid for 10 minutes.
If you did not request this, please ignore this email.

Thanks,
E-Commerce Team`,
  });

    res.json({success:true,message:"OTP sent to your email"});
    
});

export const verifyForgotPasswordOtp=asyncHandler(async(req,res)=>{

    const { email,otp,password}=req.body;

    if(!email || !otp || !password){
        return res.status(400)
        .json({message:"Email, OTP and new password are required"});
    }
    const user=await User.findOne({email,role:{$in:["user","admin"]}});

    if(!user){
        return res.status(404)
        .json({message:"User with this email does not exist"}); 
    }
    if(!user.forgotOtp){
        return res.status(400)  
        .json({message:"OTP not requested"});
    }
    const maxAttempts=3;

    if(user.forgotOtpAttempts>=maxAttempts){
        return res.status(400)
        .json({message:"OTP attempts exceeded. Please request a new OTP"});
    }
    if(new Date()>new Date (user.forgotOtpExpiresAt)){
        return res.status(400)
        .json({message:"OTP expired"});
    }
   
    if(user.forgotOtp!==otp)
    {
        user.forgotOtpAttempts+=1;
        await user.save();
        return res.status(400)
        .json({message:"Invalid OTP", attemptsLeft: maxAttempts - user.forgotOtpAttempts});
    }
    user.password=password;
    user.forgotOtp=undefined;
    user.forgotOtpExpiresAt=undefined;
    user.forgotOtpAttempts=0;

    await user.save();
    
    res.json({success:true,
        message:"Congratulation! Your password reset successfully"
    });
    
});