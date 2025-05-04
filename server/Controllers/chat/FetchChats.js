// controllers/chatController.js
import ChatModel from "../../Models/ChatModel.js";

export const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const chats = await ChatModel.find({ users: userId })
      .populate("users", "name")
      .populate("messages");

    // Only send latest message
    const formattedChats = chats.map((chat) => {
      const latestMessage =
        chat.messages?.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;

      return {
        _id: chat._id,
        users: chat.users,
        latestMessage, // ✅ This replaces chat.messages
      };
    });

    res.status(200).json(formattedChats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
