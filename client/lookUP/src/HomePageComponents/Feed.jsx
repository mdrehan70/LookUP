// Feed.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import { toast } from "react-hot-toast";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    if (!token || !user) {
      toast.error("Please login to view posts");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/home-page-posts`,
        {
          params: { userId: user._id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data[1].user.profilePic);
      // console.log(response.data.user.profilePic);
      setPosts(response.data); // Already filtered and sorted
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      {/* <button onClick={fetchPosts} className="refresh-button">
        🔄 Refresh Feed
      </button> */}

      {loading && <div className="loading-message">Loading...</div>}

      {posts.length > 0
        ? posts.map((post, index) => (
            <Post
              key={index}
              userId={post.user?._id}
              username={post.user?.username}
              fileUrl={post.fileUrl}
              profilePic={post.user?.profilePic}
              caption={post.caption}
              fileType={post.fileType}
              date={post.createdAt}
            />
          ))
        : !loading && (
            <div className="no-posts-message">
              No posts to display. Please check back later!
            </div>
          )}
    </div>
  );
}

export default Feed;
