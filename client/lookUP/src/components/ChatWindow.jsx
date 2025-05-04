import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./ChatWindow.css";
import profilepic from "../assets/profilepic.jpg";
import socket from "../socket/socket";

function ChatWindow() {
  const { id } = useParams();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const messagesEndRef = useRef(null);

  const roomId = [userData._id, id].sort().join("_");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `https://lookup-g4bt.onrender.com/api/user-profile/${id}`
        );
        setProfileImage(res.data.user.profilePic);
        setName(res.data.user.name);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://lookup-g4bt.onrender.com/api/chat/messages/${userData._id}/${id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages", error);
        toast.error("Failed to load messages");
      }
    };

    fetchUserDetails();
    fetchMessages();
  }, [id, userData._id]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    // LEAVE any previous room
    socket.emit("leaveAllRooms");

    // JOIN new room
    socket.emit("joinRoom", roomId);
    console.log(`Joined room: ${roomId}`);

    // Clear any previous listener before setting a new one
    socket.off("receiveMessage");
    socket.on("receiveMessage", (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      // Optionally leave room on component unmount
      socket.emit("leaveRoom", roomId);
      socket.off("receiveMessage");
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageData = {
      senderId: userData._id,
      receiverId: id,
      message: input,
      createdAt: new Date().toISOString(),
    };

    // Emit message to server
    socket.emit("sendMessage", { roomId, message: messageData });

    // Send to DB
    try {
      await axios.post("https://lookup-g4bt.onrender.com/api/chat/send-messages", {
        senderId: userData._id,
        receiverId: id,
        message: input,
      });

      setMessages((prev) => [...prev, messageData]);
      setInput("");
      toast.success("Message sent!");
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Send failed");
    }
  };

  return (
    <div className="chatroom-container">
      <div className="chat-header">
        <div className="chat-profile-pic">
          <img
            src={profileImage || profilepic}
            alt="Profile"
            className="profile-img"
          />
        </div>
        <div className="chat-user-info">
          <h3>{name}</h3>
        </div>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => {
          const senderId = msg.sender?._id || msg.senderId;
          const isSentByCurrentUser = senderId === userData._id;

          return (
            <div
              key={msg._id || index}
              className={`chat-message ${
                isSentByCurrentUser ? "sent" : "received"
              }`}
            >
              <div className="chat-meta">
                <strong>
                  {/* {msg.sender?.name ||
                    (isSentByCurrentUser ? userData.name : name)} */}
                </strong>
              </div>
              <div className="chat-text">{msg.message}</div>
              <div className="chat-time">
                {new Date(msg.createdAt || msg.updatedAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-box">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
