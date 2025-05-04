import UserModel from "../Models/UserModel.js";

// FOLLOW USER
export const followUser = async (req, res) => {
  const { loggedUserID, targetUserID } = req.body;
  try {
    if (loggedUserID === targetUserID) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const loggedInUser = await UserModel.findById(loggedUserID);
    const targetUser = await UserModel.findById(targetUserID);

    if (!loggedInUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if already following
    if (loggedInUser.following.includes(targetUserID)) {
      return res.status(400).json({ message: "Already following this user." });
    }

    loggedInUser.following.push(targetUserID);
    targetUser.followers.push(loggedUserID);

    await loggedInUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Successfully followed the user." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during follow." });
  }
};

// UNFOLLOW USER
export const unfollowUser = async (req, res) => {
  const { loggedUserID, targetUserID } = req.body;
  try {
    if (loggedUserID === targetUserID) {
      return res.status(400).json({ message: "You cannot unfollow yourself." });
    }

    const loggedInUser = await UserModel.findById(loggedUserID);
    const targetUser = await UserModel.findById(targetUserID);

    if (!loggedInUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove targetUserID from following
    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== targetUserID
    );

    // Remove loggedUserID from followers
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== loggedUserID
    );

    await loggedInUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Successfully unfollowed the user." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during unfollow." });
  }
};

// fetchinh followers and followings

// Fetch followers for a specific user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the URL parameter
    const user = await UserModel.findById(userId).populate(
      "followers",
      "name profilePic _id"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the followers data as response
    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch users that a specific user is following
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters
    const user = await UserModel.findById(userId).populate(
      "following",
      "name profilePic _id"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the following users as a response
    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
