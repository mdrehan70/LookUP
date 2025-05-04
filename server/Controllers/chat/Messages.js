import ChatModel from "../../Models/ChatModel.js";
import MessageModel from "../../Models/MessageModel.js";
import UserModel from "../../Models/UserModel.js";

// Controller to send a message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    console.log("Incoming message:", { senderId, receiverId, message });

    // Validate user existence
    const sender = await UserModel.findById(senderId);
    const receiver = await UserModel.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(400).json({ error: "User not found." });
    }

    // Create a new message
    const newMessage = new MessageModel({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    await newMessage.save();

    // Check if a chat already exists for the sender and receiver
    let chat = await ChatModel.findOne({
      users: { $all: [senderId, receiverId] }, // Ensures both sender and receiver are part of the chat
    });

    if (!chat) {
      // If no chat exists, create a new chat and associate it with the users
      chat = new ChatModel({
        users: [senderId, receiverId], // Add both users to the chat
        messages: [newMessage._id], // Add the new message to the chat
      });
      await chat.save();
    } else {
      // If chat exists, just add the new message to the existing chat
      chat.messages.push(newMessage._id);
      await chat.save();
    }

    return res
      .status(200)
      .json({ message: "Message sent successfully!", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Controller to fetch messages for a chat

// Controller to fetch messages
export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params; // Get both sender and receiver IDs from the URL params

    // Fetch messages where the sender and receiver match either the sender/receiver pairs
    const messages = await MessageModel.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate("sender", "name profilePic") // Populate sender's name and profile picture
      .populate("receiver", "name profilePic") // Populate receiver's name and profile picture
      .sort({ createdAt: 1 }); // Sort by date in ascending order (oldest first)

    if (!messages.length) {
      return res.status(404).json({ error: "No messages found." });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
