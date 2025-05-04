// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityAnswer: { type: String, required: true },
  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  profilePic: { type: String, default: "" }, // You can update this from frontend later
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
