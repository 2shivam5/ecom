import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({
  to,
  subject,
  text,
  attachments = [],
}) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    attachments,
  });
};

export const sendOTPEmail = async ({ to, name, subject, text }) => {
  await sendMail({ to, subject, text });
};

export default transporter;
