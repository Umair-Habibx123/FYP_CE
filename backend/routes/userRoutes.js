import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { gfs } from "../gridfsConfig.js";
import User from "../models/User.js";
import Industry from "../models/Industry.js";
import Teacher from "../models/Teachers.js";
import Student from "../models/Students.js";
import dotenv from "dotenv";
const { compare } = bcrypt;
const { sign } = jwt;
dotenv.config();

const router = Router();
router.use(cookieParser());

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

router.post("/insertUsers", async (req, res) => {
  const { _id, username, email, password, profilePic, role, status } = req.body;

  if (!_id || !username || !password || !email || !role) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      _id,
      username,
      email,
      password: hashedPassword,
      profilePic,
      role,
      status: status || "pending",
    });

    await newUser.save();
    console.log(`User ${email} registered successfully.`);
    res.status(201).json({
      message: "User created successfully.",
      user: { email, username, role, profilePic, status: newUser.status },
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getProfilePic/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await gfs.find({ filename }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    gfs.openDownloadStreamByName(filename).pipe(res);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers["authorization"];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

router.get("/fetchAllUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
});

router.get("/user-profile", authenticateUser, async (req, res) => {
  try {
    console.log("Fetching user profile for:", req.user._id);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.status !== "verified") {
      const cookieOptions = {
        secure: true,
        sameSite: "None",
      };

      res.clearCookie("token", cookieOptions);
      res.clearCookie("role", cookieOptions);
      res.clearCookie("id", cookieOptions);
      res.clearCookie("email", cookieOptions);
      res.clearCookie("loggedIn", cookieOptions);

      return res
        .status(403)
        .json({ error: "User is not verified. Authentication cleared." });
    }

    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user._id,
      profilePic: user.profilePic
        ? `${process.env.VITE_REACT_APP_BACKEND_BASEURL}${user.profilePic}`
        : null,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.role === "industry") {
      const industryProfile = await Industry.findOne({ _id: user._id });

      if (industryProfile) {
        console.log("Industry profile found:", industryProfile);

        userProfile.industryDetails = {
          representingIndustries: industryProfile.representingIndustries,
          verifiedAt: industryProfile.verifiedAt,
          verifiedBy: industryProfile.verifiedBy,
        };
      } else {
        console.log("No industry profile found for:", user._id);
      }
    } else if (user.role === "teacher") {
      const teacherProfile = await Teacher.findOne({ _id: user._id });

      if (teacherProfile) {
        console.log("Teacher profile found:", teacherProfile);

        userProfile.teacherDetails = {
          employeeId: teacherProfile.employeeId,
          designation: teacherProfile.designation,
          department: teacherProfile.department,
          university: teacherProfile.university,
          verified: teacherProfile.verified,
          verificationDocuments: teacherProfile.verificationDocuments,
          verifiedAt: teacherProfile.verifiedAt,
          verifiedBy: teacherProfile.verifiedBy,
        };
      } else {
        console.log("No teacher profile found for:", user._id);
      }
    } else if (req.user.role === "student") {
      const studentProfile = await Student.findOne({ _id: user._id });

      if (studentProfile) {
        console.log("Student profile found:", studentProfile);
        userProfile.studentDetails = {
          studentId: studentProfile.studentId,
          degreeOrProgram: studentProfile.degreeOrProgram,
          yearOfStudy: studentProfile.yearOfStudy,
          university: studentProfile.university,
          verified: studentProfile.verified,
          verificationDocuments: studentProfile.verificationDocuments,
          verifiedAt: studentProfile.verifiedAt,
          verifiedBy: studentProfile.verifiedBy,
        };
      } else {
        console.log("No teacher profile found for:", user._id);
      }
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/other-user-profile", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    console.log("Fetching user profile for:", email);

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic
        ? `${process.env.VITE_REACT_APP_BACKEND_BASEURL}${user.profilePic}`
        : null,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.role === "teacher") {
      console.log("Fetching teacher profile for:", user._id);
      const teacherProfile = await Teacher.findOne({ _id: user._id });

      if (teacherProfile) {
        console.log("Teacher profile found:", teacherProfile);

        userProfile.teacherDetails = {
          employeeId: teacherProfile.employeeId,
          designation: teacherProfile.designation,
          department: teacherProfile.department,
          university: teacherProfile.university,
          verified: teacherProfile.verified,
          verificationDocuments: teacherProfile.verificationDocuments,
          verifiedAt: teacherProfile.verifiedAt,
          verifiedBy: teacherProfile.verifiedBy,
        };
      } else {
        console.log("No teacher profile found for:", user._id);
      }
    }

    console.log("User profile fetched:", userProfile);
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateProfile", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password, profilePic } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (password) user.password = password;
    if (profilePic) user.profilePic = profilePic;

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await compare(password, user.password);
    const isHashedPasswordValid = password === user.password;

    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: "Invalid email or password." });
    // }

    if (!isPasswordValid && !isHashedPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (user.status !== "verified") {
      return res.status(403).json({
        error: "Account not verified. Please contact the administrator.",
      });
    }

    if (req.cookies.token) {
      const cookieOptions = {
        secure: true,
        sameSite: "None",
      };

      res.clearCookie("token", cookieOptions);
      res.clearCookie("role", cookieOptions);
      res.clearCookie("id", cookieOptions);
      res.clearCookie("email", cookieOptions);
      res.clearCookie("loggedIn", cookieOptions);
    }

    const token = sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);
    res.cookie("id", user.id, { ...cookieOptions, httpOnly: false });
    res.cookie("email", user.email, { ...cookieOptions, httpOnly: false });
    res.cookie("role", user.role, { ...cookieOptions, httpOnly: false });
    res.cookie("loggedIn", true, { ...cookieOptions, httpOnly: false });

    res.status(200).json({
      message: "Login successful!",
      user: {
        username: user.username,
        id: user.id,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  const cookieOptions = {
    secure: true,
    sameSite: "None",
  };

  res.clearCookie("token", cookieOptions);
  res.clearCookie("role", cookieOptions);
  res.clearCookie("id", cookieOptions);
  res.clearCookie("email", cookieOptions);
  res.clearCookie("loggedIn", cookieOptions);

  res.status(200).json({ message: "Logged out successfully." });
});

export default router;
