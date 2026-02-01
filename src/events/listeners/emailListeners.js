import eventBus from "../eventBus.js";
import { sendOTPEmail } from "../../utils/sendMail.js";

eventBus.on("SendEmail", async ({ to, subject, text }) => {
  try {
    await sendOTPEmail({ to, subject, text });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
});