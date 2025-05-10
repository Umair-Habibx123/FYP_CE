import { Router } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { loadTemplate } from "../utils/template.js";

dotenv.config();

const router = Router();
router.use(cookieParser());

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const SECRET_KEY = process.env.SECRET_KEY;
const RESET_TOKEN_EXPIRY = "15m";

// verfication code schema

const VerificationSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now, expires: 1500 },
});

const Verification = mongoose.model("Verification", VerificationSchema);

router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this email already exists." });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Verification.findOneAndUpdate(
    { email },
    { code, expiresAt },
    { upsert: true }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = await loadTemplate("verification-email", { CODE: code });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${code} is your verification code`,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email sending failed." });
  }
});

router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const record = await Verification.findOne({ email });

  if (!record)
    return res.status(400).json({ success: false, message: "No code found." });
  if (record.expiresAt < new Date())
    return res.status(400).json({ success: false, message: "Code expired." });
  if (record.code !== code)
    return res.status(400).json({ success: false, message: "Invalid code." });

  res.json({ success: true, message: "Verification successful." });
});

// forgot password schema

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Received forgot password request for:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Email not found: Try Creating Account.", email);
      return res.status(404).json({ error: "Email not found." });
    }

    const resetToken = jwt.sign({ email }, SECRET_KEY, {
      expiresIn: RESET_TOKEN_EXPIRY,
    });

    console.log("Generated reset token:", resetToken);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("Reset link:", resetLink);

    const emailHtml = await loadTemplate("reset-password-email", {
      resetLink: resetLink,
      timer: RESET_TOKEN_EXPIRY,
    });

    await transporter.sendMail({
      from: "no-reply@yourrouter.com",
      to: email,
      subject: "Password Reset",
      html: emailHtml,
    });

    console.log("Email sent successfully to:", email);
    res.json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Invalid request parameters." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token." });
  }
});

router.get("/validate-token/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.json({ message: "Valid token" });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// verification confirmation email

router.post("/send-verification-confirmation", async (req, res) => {
  const { email, password } = req.body;

  const emailtemp = await loadTemplate("account-verified-email", {
    email: email,
    password: password,
    url: process.env.FRONTEND_URL,
  });

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Account Has Been Verified",
      html: emailtemp,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification confirmation sent." });
  } catch (error) {
    console.error("Error sending verification confirmation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification confirmation.",
    });
  }
});

// contact us email schema

const transporterContactUs = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post(
  "/contact",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    const emailtemplate = await loadTemplate("contact-us-email", {
      name: name,
      email: email,
      subject: subject,
      message: message,
      dated: new Date().toLocaleString(),
    });

    try {
      // Email options
      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Submission: ${subject}`,
        html: emailtemplate,
      };

      // Send email
      await transporterContactUs.sendMail(mailOptions);

      const emailtemplate2 = await loadTemplate(
        "contact-us-email-confirmation",
        {
          name: name,
          email: email,
          subject: subject,
          message: message,
          dated: new Date().toLocaleString(),
          contactMail: process.env.EMAIL_USER,
        }
      );

      // Send confirmation to user
      const userMailOptions = {
        from: `"CollaborativeEdge Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "We Received Your Message",
        html: emailtemplate2,
      };

      await transporterContactUs.sendMail(userMailOptions);

      res.json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res
        .status(500)
        .json({ error: "Failed to send message. Please try again later." });
    }
  }
);

export default router;
