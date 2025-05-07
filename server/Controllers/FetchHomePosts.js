// controllers/postController.js
import mongoose from "mongoose";
import UserModel from "../Models/UserModel.js";
import PostModel from "../Models/PostModel.js";

export const getHomePagePosts = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await UserModel.findById(userId).select("followers following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = [
      ...user.followers.map((id) => id.toString()),
      ...user.following.map((id) => id.toString()),
      userId,
    ];

    // Time threshold: last 24 hours
    const fortyEightHoursAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Fetch and filter posts in DB
    const posts = await PostModel.find({
      user: { $in: connections },
      createdAt: { $gte: fortyEightHoursAgo },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePic _id");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getHomePagePosts:", error);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};
