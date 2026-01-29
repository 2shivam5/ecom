
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, 
  },
});

export const sendOTPEmail = async ({ to, name, otp }) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: "Delivery OTP",
    text: `Hi ${name}, This is a secret code it is use to verify your delivery
    it is valid for 10 minutes
    thanks a lot! ${otp}`,
  });
};

export default transporter;
