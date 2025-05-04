// routes/authRoutes.js
import express from "express";
import {
  resetPassword,
  Signin,
  Signup,
  verifySecurityAnswer,
} from "../Controllers/AuthControllers.js";
import { searchUsers } from "../Controllers/SearchUserController.js";
import { getUserProfile } from "../Controllers/GetUserProfileController.js";
import { createPost } from "../Controllers/CreatePost.js";
import { updateUserProfile } from "../Controllers/updateUserProfile.js";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../Controllers/FollowControllers.js";
import { deletePost, FetchAllPost } from "../Controllers/FetchAllPost.js";
import { getHomePagePosts } from "../Controllers/FetchHomePosts.js";
import { getMessages, sendMessage } from "../Controllers/chat/Messages.js";
import { getUserChats } from "../Controllers/chat/FetchChats.js";
const router = express.Router();

// auth routes**************
router.post("/auth/signup", Signup);
router.post("/auth/signin", Signin);
router.post("/auth/verify-security-answer", verifySecurityAnswer);
router.post("/auth/reset-password", resetPassword);

// search available users
router.get("/search-users", searchUsers);
// get userprofile details route
router.get("/user-profile/:id", getUserProfile);

// create new post
router.post("/create-new-post", createPost);

// update user profile
router.put("/update-user-profile/:id", updateUserProfile);

// Follow a user
router.put("/follow", followUser);

// Unfollow a user
router.put("/unfollow", unfollowUser);

// Route to get followers of a user
router.get("/user-followers/:userId", getFollowers);

// Route to fetch following users of a specific user
router.get("/user-following/:userId", getFollowing);

// fetch all posts for a user
router.get("/fetch-all-post/:id", FetchAllPost);

// Route
router.delete("/delete-post/:id", deletePost);

// fetch all posts for home page
router.get("/home-page-posts", getHomePagePosts);

// GET /api/chat/messages/:senderId/:receiverId
router.get("/chat/messages/:senderId/:receiverId", getMessages);

// POST /api/chat/send-messages
router.post("/chat/send-messages", sendMessage);

// fetch chats for the loggedin user
router.get("/chat/user/:userId", getUserChats);

export default router;
