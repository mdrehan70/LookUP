// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fileUrl: { type: String, required: true },
    caption: { type: String, required: true },
    fileType: { type: String, required: true },
    date: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId, // This is a reference to the User model
      ref: "User", // Reference to the User model (make sure you have a User model)
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
