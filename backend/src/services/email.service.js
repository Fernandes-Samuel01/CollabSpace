import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { verificationEmailTemplate } from "../templates/verificationEmail.js";

// Reusable transporter (created once)
const transporter = nodemailer.createTransport({
  host: env.SMTP.HOST,
  port: env.SMTP.PORT,
  auth: {
    user: env.SMTP.USER,
    pass: env.SMTP.PASS,
  },
});

// Verify SMTP connection at boot (non-blocking)
transporter.verify((err) => {
  if (err) console.error("❌ SMTP connection failed:", err.message);
  else console.log("✅ SMTP server ready");
});

export const sendVerificationEmail = async ({ to, name, code }) => {
  const info = await transporter.sendMail({
    from: env.SMTP.FROM,
    to,
    subject: "Verify your CollabSpace account",
    html: verificationEmailTemplate({ name, code }),
  });

  if (env.NODE_ENV === "development") {
    console.log(`📧 Verification email sent to ${to} (id: ${info.messageId})`);
  }

  return info;
};