// src/components/Post.js
import React, { useState } from "react";
import { FaHeart, FaThumbsDown } from "react-icons/fa";
import "./Post.css";
import ProfileImage from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

function Post({
  userId,
  username,
  profilePic,
  fileUrl,
  caption,
  date,
  fileType,
}) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  // console.log("post user ID from post:", userId);
  const navigate = useNavigate();
  const handleLike = () => {
    setLiked(!liked);
    if (!liked && disliked) {
      setDisliked(false);
    }
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (!disliked && liked) {
      setLiked(false);
    }
  };

  const formatTimeAgo = (postDate) => {
    const now = new Date();
    const posted = new Date(postDate);
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return posted.toLocaleDateString();
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-profile-container">
          <img
            className="post-profile-pic"
            src={profilePic || ProfileImage}
            alt="profile"
            onClick={() => navigate(`/user-profile/${userId}`)}
          />
        </div>
        <h4 onClick={() => navigate(`/user-profile/${userId}`)}>{username}</h4>
      </div>

      <div className="post-media">
        {fileType === "image" ? (
          <img src={fileUrl} alt="post" className="post-media-content" />
        ) : fileType === "video" ? (
          <video controls className="post-media-content">
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>

      <p>
        <strong>{username}</strong> {caption}
      </p>

      <div className="post-actions">
        <button
          className={`post-btn ${liked ? "active-like" : ""}`}
          onClick={handleLike}
        >
          <FaHeart /> Like
        </button>
        <button
          className={`post-btn ${disliked ? "active-dislike" : ""}`}
          onClick={handleDislike}
        >
          <FaThumbsDown /> Dislike
        </button>
      </div>

      <div className="post-date">{formatTimeAgo(date)}</div>
    </div>
  );
}

export default Post;
