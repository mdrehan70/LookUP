import PostModel from "../Models/PostModel.js";

export const FetchAllPost = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await PostModel.find({ user: id });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching posts.",
    });
  }
};

// delete post  controller
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error while deleting post" });
  }
};
