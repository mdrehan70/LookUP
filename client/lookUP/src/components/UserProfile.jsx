import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate for redirecting
import { ImSpinner2 } from "react-icons/im";

import { FaTimes } from "react-icons/fa";

import axios from "axios";
import "./UserProfile.css";
import profilepic from "../assets/profilepic.jpg";
import { toast } from "react-hot-toast";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const [profileImage, setProfileImage] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [saving, setSaving] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popupImage, setPopupImage] = useState(null);

  const navigate = useNavigate(); // Add useNavigate hook

  // fetch user details function
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/user-profile/${id}`
      );
      setUser(res.data.user);
      setProfileImage(res.data.user.profilePic);
      setUsername(res.data.user.username);
      setName(res.data.user.name);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update isFollowing when loggedInUser or user id changes
  useEffect(() => {
    if (user && loggedInUser) {
      setIsFollowing(user.followers.includes(loggedInUser._id));
    }
  }, [user, loggedInUser]);

  // fetch user all posts
  const FetchUserAllPosts = async () => {
    console.log("Fetching posts for user:", id);
    console.log("Found posts:", allPost);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/fetch-all-post/${id}`
      );
      console.log(res.data.posts);
      setAllPost(res.data.posts); // ✅ Set posts properly
      console.log("Found posts: after", res.data.posts);
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      toast.error("Failed to fetch posts. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
    FetchUserAllPosts();
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (loggedInUser) {
      setIsCurrentUser(loggedInUser._id === id);
    } else {
      setIsCurrentUser(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let updatedProfileImageUrl = profileImage;

      if (typeof profileImage === "object") {
        const formData = new FormData();
        formData.append("file", profileImage);
        formData.append("upload_preset", "your-profile-upload-preset");
        formData.append("cloud_name", "dnqwoghil");
        formData.append("folder", "profile-pics");

        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dnqwoghil/image/upload",
          formData
        );
        updatedProfileImageUrl = cloudinaryRes.data.secure_url;
      } else {
        updatedProfileImageUrl = user.profilePic;
      }

      const updatedData = { username, name };
      if (updatedProfileImageUrl !== user.profilePic) {
        updatedData.profilePic = updatedProfileImageUrl;
      }

      const res = await axios.put(
        `http://localhost:8080/api/update-user-profile/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        setUser(res.data.updatedUser);
        await fetchUserDetails();
        setShowEditModal(false);
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile!");
    }
    setSaving(false);
  };
  // function to follow
  const FollowHandler = async () => {
    try {
      const res = await axios.put("http://localhost:8080/api/follow", {
        loggedUserID: loggedInUser._id,
        targetUserID: id,
      });

      if (res.status === 200) {
        toast.success("Followed Successfully!");
        setIsFollowing(true);

        // Update loggedInUser.following manually
        const updatedUser = {
          ...loggedInUser,
          following: [...loggedInUser.following, id],
        };

        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ update localStorage
        setLoggedInUser(updatedUser);
        fetchUserDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Server Error during Follow."
      );
    }
  };

  // function to unfollow
  const UnFollowHandler = async () => {
    try {
      const res = await axios.put("http://localhost:8080/api/unfollow", {
        loggedUserID: loggedInUser._id,
        targetUserID: id,
      });

      if (res.status === 200) {
        toast.success("Unfollowed Successfully!");
        setIsFollowing(false);
        // Update loggedInUser.following manually
        const updatedUser = {
          ...loggedInUser,
          following: loggedInUser.following.filter((userId) => userId !== id),
        };

        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ update localStorage
        setLoggedInUser(updatedUser);
        fetchUserDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Server Error during Unfollow."
      );
    }
  };

  // function to delete post
  const DeletePost = async (DeletePostID, e) => {
    // e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return; // cancel if user says no
    }

    try {
      const res = await axios.delete(
        `http://localhost:8080/api/delete-post/${DeletePostID}`
      );

      if (res.status === 200) {
        toast.success("Post deleted successfully!");
        // After successful delete, remove the post from state
        setAllPost((prevPosts) =>
          prevPosts.filter((post) => post._id !== DeletePostID)
        );
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post.");
    }
  };

  const handleFollowersClick = () => {
    navigate(`/followers/${id}`);
  };

  const handleFollowingClick = () => {
    navigate(`/following/${id}`);
  };

  const openImagePopup = (imageUrl, caption, date) => {
    setPopupImage({
      imageUrl,
      caption,
      date,
    });
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
    setPopupImage(null); // Clear popup data when closing
  };

  if (loading) {
    return (
      <div className="profile-container loading-center">
        <ImSpinner2 className="spinner-icon" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <h2>User not found</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profileImage || profilepic}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-details">
          <h2 className="user-name">{name}</h2>
          <p className="username">@{username}</p>
          <div className="follow-stats">
            <span onClick={handleFollowersClick} style={{ cursor: "pointer" }}>
              <strong>{user.followers?.length || 0}</strong> Followers
            </span>
            <span onClick={handleFollowingClick} style={{ cursor: "pointer" }}>
              <strong>{user.following?.length || 0}</strong> Following
            </span>
          </div>
          {!isCurrentUser && (
            <div className="action-buttons">
              {isFollowing ? (
                <button className="follow-btn" onClick={UnFollowHandler}>
                  Unfollow
                </button>
              ) : (
                <button className="follow-btn" onClick={FollowHandler}>
                  Follow
                </button>
              )}

              <button
                className="message-btn"
                onClick={() => {
                  navigate(`/chatwindow/${user._id}`);
                }}
              >
                Message
              </button>
            </div>
          )}
        </div>
        {isCurrentUser && (
          <button
            className="edit-profile-btn"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      <h3 className="posts-title">Posts</h3>
      <div className="posts-grid">
        {allPost.length > 0 ? (
          allPost.map((post) => (
            <div key={post._id} className="post-card">
              {/* Show delete button only if it's the logged-in user's profile */}
              {isCurrentUser && (
                <button
                  className="delete-post-btn"
                  onClick={() => {
                    // e.stopPropagation();
                    DeletePost(post._id);
                  }}
                >
                  <FaTimes />
                </button>
              )}

              {/* Post Content */}
              {post.fileType === "image" ? (
                // Render image if file type is image
                <img
                  src={post.fileUrl}
                  alt="post"
                  onClick={() =>
                    openImagePopup(post.fileUrl, post.caption, post.date)
                  } // Pass additional data
                />
              ) : post.fileType === "video" ? (
                // Render video if file type is video
                <video src={post.fileUrl} controls />
              ) : (
                // Default render if file type is neither image nor video
                <p>Unsupported file type</p>
              )}
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}

        {/* Image Popup */}
        {showPopUp && (
          <div className="image-popup">
            <div className="popup-content">
              <button className="cancel-popup-btn" onClick={closePopUp}>
                <FaTimes />
              </button>
              <img src={popupImage.imageUrl} alt="Large View" />
              <div className="popup-caption">
                <p>{popupImage.caption}</p>
                <p className="posted-time">
                  {new Date(popupImage.date).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {showEditModal && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="profileImage">Profile Image</label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="full name"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {saving ? <ImSpinner2 className="spinner-icon" /> : "Save"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
