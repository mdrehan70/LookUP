import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/UserModel.js";

// Controller function to create a new post
export const createPost = async (req, res) => {
  const { username, userId, fileUrl, caption, fileType, date } = req.body;

  try {
    // Find the user (optional, depending on whether you want to associate the user with the post)
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create a new post document
    const newPost = new PostModel({
      username,
      user: userId, // Storing user ID to link post to the user
      fileUrl,
      caption,
      fileType,
      date,
    });

    // Save the post to the database
    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Failed to create post" });
  }
};
