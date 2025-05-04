import UserModel from "../Models/UserModel.js";

export const searchUsers = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name query is required." });
    }

    const users = await UserModel.find({
      name: { $regex: name, $options: "i" }, // case-insensitive search
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
