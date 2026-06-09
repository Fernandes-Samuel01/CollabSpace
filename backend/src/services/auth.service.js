import crypto from "crypto";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendVerificationEmail } from "./email.service.js";

const CODE_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

// ---- Generate 6-digit numeric code ----
const generateCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// ---- Register ----
export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });

  if (existing && existing.isVerified) {
    throw new ApiError(409, "Email already registered. Please login.");
  }

  const code = generateCode();
  const expires = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  let user;

  // If unverified user exists → update; otherwise create
  if (existing && !existing.isVerified) {
    existing.name = name;
    existing.password = password; // pre-save hook re-hashes
    existing.verificationCode = code;
    existing.verificationCodeExpires = expires;
    existing.lastVerificationSentAt = new Date();
    user = await existing.save();
  } else {
    user = await User.create({
      name,
      email,
      password,
      verificationCode: code,
      verificationCodeExpires: expires,
      lastVerificationSentAt: new Date(),
    });
  }

  // Send the email (don't block response if email is slow — but we await for now)
  await sendVerificationEmail({ to: user.email, name: user.name, code });

  return user.toSafeObject();
};

// ---- Verify Email ----
export const verifyEmail = async ({ email, code }) => {
  const user = await User.findOne({ email }).select(
    "+verificationCode +verificationCodeExpires"
  );

  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) throw new ApiError(400, "Email already verified");

  if (!user.verificationCode || !user.verificationCodeExpires) {
    throw new ApiError(400, "No active verification code. Please request a new one.");
  }

  if (user.verificationCodeExpires < new Date()) {
    throw new ApiError(400, "Verification code expired. Please request a new one.");
  }

  if (user.verificationCode !== code) {
    throw new ApiError(400, "Invalid verification code");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return user.toSafeObject();
};

// ---- Resend Verification Code ----
export const resendVerificationCode = async ({ email }) => {
  const user = await User.findOne({ email }).select("+lastVerificationSentAt");

  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) throw new ApiError(400, "Email already verified");

  // Cooldown check
  if (user.lastVerificationSentAt) {
    const elapsed = (Date.now() - user.lastVerificationSentAt.getTime()) / 1000;
    if (elapsed < RESEND_COOLDOWN_SECONDS) {
      const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed);
      throw new ApiError(
        429,
        `Please wait ${wait}s before requesting a new code`
      );
    }
  }

  const code = generateCode();
  user.verificationCode = code;
  user.verificationCodeExpires = new Date(
    Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000
  );
  user.lastVerificationSentAt = new Date();
  await user.save();

  await sendVerificationEmail({ to: user.email, name: user.name, code });

  return { email: user.email, cooldownSeconds: RESEND_COOLDOWN_SECONDS };
};

// ---- Login ----
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new ApiError(401, "Invalid email or password");

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid email or password");

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  return user.toSafeObject();
};