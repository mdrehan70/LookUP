import UserModel from "../Models/UserModel.js";

export const getUserProfile = async (req, res) => {
  try {
    // Get user id from the request params
    const userId = req.params.id;

    // Fetch user from the database
    const user = await UserModel.findById(userId).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user, // Send user data (without password)
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
