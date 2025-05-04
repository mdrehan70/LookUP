import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Sidebar from "../HomePageComponents/Sidebar";
import Feed from "../HomePageComponents/Feed";
import CreatePost from "./CreatePost";
import SearchUsers from "./SearchUsers";
import UserProfile from "./UserProfile";
import "./Home.css";
import FollowingPage from "./FollowingPage";
import FollowersPage from "./FollowersPage";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

function Home() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch token and user data from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to signin
      navigate("/signin");
    }
    // else do nothing and show Home
  }, [navigate]);

  const handleAddPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Feed posts={posts} />} />
          <Route path="/chatlist/:id" element={<ChatList />} />
          <Route path="/chatwindow/:id" element={<ChatWindow />} />
          <Route
            path="/create"
            element={<CreatePost onPostCreate={handleAddPost} />}
          />
          <Route path="/search" element={<SearchUsers />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
          <Route path="/followers/:id" element={<FollowersPage />} />
          <Route path="/following/:id" element={<FollowingPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
