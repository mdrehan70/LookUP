// Example Node.js/Express route

import UserModel from "../Models/UserModel.js";

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, name, profilePic } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { username, name, profilePic },
      { new: true }
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
