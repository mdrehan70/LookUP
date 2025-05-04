import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import {
  FaHome,
  FaFacebookMessenger,
  FaSearch,
  FaPlusSquare,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileImage from "../assets/profile.png";
import logo from "../assets/logo.jpg";

function Sidebar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [profilePicture, setprofilePicture] = useState(null);

  const handleLogout = () => {
    // Ask for confirmation before logging out
    const isApproved = window.confirm("Are you sure you want to log out?");

    if (isApproved) {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to signin page
      navigate("/signin");
    } else {
      // If the user cancels the logout, do nothing
      console.log("Logout cancelled");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Fetch user from localStorage
    if (user) {
      setUserId(user._id);
      setprofilePicture(user?.profilePic); // Set user id in the state if user exists
    }
  }, []);

  return (
    <>
      <div className="mobile-header">
        <img
          src={logo}
          alt="logo"
          style={{ width: "120px", height: "35px", margin: "0px" }}
        />
      </div>

      <div className="sidebar">
        <div className="sidebar-title">
          <img
            src={logo}
            alt="logo"
            style={{ width: "120px", height: "30px", margin: "0px" }}
          />
        </div>

        <ul>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            title="Home"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <li>
              <FaHome className="icon" />
              <span>Home</span>
            </li>
          </NavLink>

          <NavLink
            to={`/chatlist/${userId}`}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            title="Chats"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <li>
              <div className="chat-notification-icon">
                <FaFacebookMessenger className="icon " />
                {/* <p className="new-message-notification">2</p> */}
              </div>
              <span>Chats</span>
            </li>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            title="Search"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <li>
              <FaSearch className="icon" />
              <span>Search</span>
            </li>
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            title="Create Post"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <li>
              <FaPlusSquare className="icon" />
              <span>Create</span>
            </li>
          </NavLink>

          {/* Profile link will only be rendered if userId exists */}
          {userId && (
            <NavLink
              to={`/user-profile/${userId}`}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              title="Profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <li>
                <div className="sidebar-profile-container">
                  <img
                    className="sidebar-profile-pic"
                    src={profilePicture || ProfileImage}
                    alt="profile"
                    onClick={() => navigate(`/user-profile/${userId}`)}
                  />
                </div>
                <span>Profile</span>
              </li>
            </NavLink>
          )}

          {/* Updated Logout link */}
          <li
            className="sidebar-link"
            onClick={handleLogout}
            title="Logout"
            style={{ cursor: "pointer" }}
          >
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
