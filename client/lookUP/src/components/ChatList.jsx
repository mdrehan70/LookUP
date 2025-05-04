import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ChatList.css";

function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchChats = async () => {
      if (!userData?._id) return;

      try {
        const res = await axios.get(
          `https://lookup-g4bt.onrender.com/api/chat/user/${userData._id}`
        );
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [userData?._id]);

  const openChatRoom = (otherUserId) => {
    navigate(`/chatwindow/${otherUserId}`);
  };

  return (
    <div className="chats-container">
      <h2 className="chat-header">Your Chats</h2>
      <div className="chat-list">
        {chats.map((chat) => {
          const otherUser = chat.users.find((u) => u._id !== userData._id);
          const latestMessage =
            chat.latestMessage?.message || "No messages yet";

          return (
            <div
              key={chat._id}
              className="chat-user"
              onClick={() => openChatRoom(otherUser._id)}
            >
              <div className="chat-user-info">
                <div className="chat-user-name">{otherUser?.name}</div>
                <div className="chat-latest-message">
                  {latestMessage.length > 40
                    ? latestMessage.slice(0, 40) + "..."
                    : latestMessage}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
