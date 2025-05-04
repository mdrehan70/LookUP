import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import profilepic from "../assets/profilepic.jpg";
import "./FollowingPage.css"; // Add this CSS file for styling

const FollowingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        console.log(`Fetching following for userId: ${id}`); // Log the userId
        const res = await axios.get(
          `http://localhost:8080/api/user-following/${id}`
        );
        console.log("Response data: ", res.data); // Log the response data
        setFollowing(res.data.following); // Assuming the response contains a "following" array
      } catch (error) {
        console.error("Failed to fetch following", error);
      }
    };

    fetchFollowing();
  }, [id]);

  return (
    <div className="following-container">
      <h2 className="following-title">Following</h2>
      <div className="following-list">
        {following.length === 0 ? (
          <p>No users found.</p>
        ) : (
          following.map((follow) => (
            <div
              key={follow._id}
              className="following-item"
              onClick={() => navigate(`/user-profile/${follow._id}`)}
            >
              <img
                src={follow.profilePic || profilepic}
                alt="Following"
                className="following-profile-pic"
              />
              <p className="following-name">{follow.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
