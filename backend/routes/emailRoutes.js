import { Router } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const router = Router();
router.use(cookieParser());

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const SECRET_KEY = process.env.SECRET_KEY;
const RESET_TOKEN_EXPIRY = "15m";

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

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${code} is your verification code`,
    html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code - Collaborative Edge</title>
    <style>
        /* Base Styles */
        body {
            font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }
        
        /* Header */
        .email-header {
            background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }
        
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        /* Content */
        .email-content {
            padding: 30px;
        }
        
        .email-content h2 {
            color: #2b6cb0;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .email-content p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        /* Button */
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
            color: #ffffff !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        /* Info Box */
        .info-box {
            background-color: #f0f7ff;
            border-left: 4px solid #4a90e2;
            padding: 16px;
            border-radius: 4px;
            margin: 20px 0;
        }
        
        /* Code Display */
        .verification-code {
            display: inline-block;
            padding: 16px 32px;
            font-size: 28px;
            font-weight: 700;
            color: #2b6cb0;
            background-color: #f0f7ff;
            border-radius: 8px;
            margin: 15px 0;
            letter-spacing: 2px;
        }
        
        /* Footer */
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .email-header {
                padding: 25px 15px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-content {
                padding: 20px;
            }
            
            .email-content h2 {
                font-size: 20px;
            }
            
            .verification-code {
                padding: 12px 24px;
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">CollaborativeEdge</div>
            <h1>Your Verification Code</h1>
        </div>
        
        <div class="email-content" style="text-align: center;">
            <h2>Account Verification</h2>
            <p>Please use the following verification code to complete your account setup:</p>
            
            <div class="verification-code">${code}</div>
            
            <p>This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
            
            <div class="info-box" style="text-align: left;">
                <p><strong>Security Tip:</strong> Our support team will never ask for this code. If someone requests it, it may be a phishing attempt.</p>
            </div>
        </div>
        
        <div class="email-footer">
            <p>&copy; 2025 Collaborative Edge. All rights reserved.</p>
            <p>If you didn't request this code, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
        `,
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

    const emailHtml = `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Collaborative Edge</title>
    <style>
        /* Base Styles */
        body {
            font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }
        
        /* Header */
        .email-header {
            background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }
        
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        /* Content */
        .email-content {
            padding: 30px;
        }
        
        .email-content h2 {
            color: #2b6cb0;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .email-content p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        /* Button */
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
            color: #ffffff !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        /* Info Box */
        .info-box {
            background-color: #f0f7ff;
            border-left: 4px solid #4a90e2;
            padding: 16px;
            border-radius: 4px;
            margin: 20px 0;
        }
        
        /* Footer */
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .email-header {
                padding: 25px 15px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-content {
                padding: 20px;
            }
            
            .email-content h2 {
                font-size: 20px;
            }
            
            .action-button {
                display: block;
                margin: 20px auto;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">CollaborativeEdge</div>
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="email-content">
            <h2>Need to reset your password?</h2>
            <p>We received a request to reset your password for your Collaborative Edge account. Click the button below to reset your password.</p>
            
            <p><strong>This link is valid for 15 minutes.</strong> If you didn't request this, please ignore this email or contact our support team.</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="action-button">Reset Password</a>
            </div>
            
            <div class="info-box">
                <p>For your security, never share this email with anyone. Our support team will never ask for your password.</p>
            </div>
        </div>
        
        <div class="email-footer">
            <p>&copy; 2025 Collaborative Edge. All rights reserved.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
    `;

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

// Add this to your email routes.js
router.post("/send-verification-confirmation", async (req, res) => {
  const { email, password } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Account Has Been Verified",
      html: `
            
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verified - Collaborative Edge</title>
    <style>
        /* Base Styles */
        body {
            font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        
        /* Container */
        .email-container {
            max-width: 900px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }
        
        /* Header */
        .email-header {
            background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }
        
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        /* Content */
        .email-content {
            padding: 30px;
        }
        
        .email-content h2 {
            color: #2b6cb0;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .email-content p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        /* Button */
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
            color: #ffffff !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        /* Info Box */
        
            .info-box {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  background-color: #f9f9f9;
  max-width: 600px;
  margin: 20px 0;
}

.password-note {
  color: #666;
  font-size: 0.9em;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ccc;
}
        
        /* Footer */
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .email-header {
                padding: 25px 15px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-content {
                padding: 20px;
            }
            
            .email-content h2 {
                font-size: 20px;
            }
            
            .action-button {
                display: block;
                margin: 20px auto;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">CollaborativeEdge</div>
            <h1>Account Successfully Verified</h1>
        </div>
        
        <div class="email-content">
            <h2>Welcome to CollaborativeEdge!</h2>
            <p>Your account has been successfully verified. You can now sign in to your account using the credentials below:</p>
            
            <div class="info-box">
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Password:</strong> ${password}</p>
  <p class="password-note"><em>Note: This is not your actual password. It's an encoded version of your actual password that works for login purposes.</em></p>
</div>
            
            <p>For security reasons, we recommend:</p>
            <ul>
                <li>Never share your password or this email with anyone</li>
                <li>Change your password immediately after first login</li>
                <li>Create a strong, unique password you don't use elsewhere</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/login" class="action-button">Sign In Now</a>
            </div>
        </div>
        
        <div class="email-footer">
            <p>&copy; 2025 Collaborative Edge. All rights reserved.</p>
            <p>If you didn't create this account, please contact us immediately.</p>
        </div>
    </div>
</body>
</html>

            `,
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

export default router;
