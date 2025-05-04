// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../Models/UserModel.js";

// Load .env variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup Controller
export const Signup = async (req, res) => {
  const { name, username, email, password, securityAnswer } = req.body;

  try {
    const exist = await UserModel.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      username,
      email,
      password: hashedPassword,
      securityAnswer,
    });

    await user.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Signin Controller
export const Signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Security Answer Verification
export const verifySecurityAnswer = async (req, res) => {
  const { email, securityAnswer } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (
      !user ||
      user.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase()
    ) {
      return res.status(400).json({ message: "Incorrect answer" });
    }
    res.status(200).json({ message: "Verified" });
  } catch (err) {
    console.error("Verify Answer Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findOneAndUpdate({ email }, { password: hashedPassword });
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
