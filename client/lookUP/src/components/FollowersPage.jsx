import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import profilepic from "../assets/profilepic.jpg";
import "./FollowersPage.css"; // Add this CSS file for styling

const FollowersPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(
          `https://lookup-g4bt.onrender.com/api/user-followers/${id}`
        );
        setFollowers(res.data.followers);
      } catch (error) {
        console.error("Failed to fetch followers", error);
      }
    };

    fetchFollowers();
  }, [id]);

  return (
    <div className="followers-container">
      <h2 className="followers-title">Followers</h2>
      <div className="followers-list">
        {followers.length === 0 ? (
          <p>No followers found.</p>
        ) : (
          followers.map((follower) => (
            <div
              key={follower._id}
              className="follower-item"
              onClick={() => navigate(`/user-profile/${follower._id}`)}
            >
              <img
                src={follower.profilePic || profilepic}
                alt="Follower"
                className="follower-profile-pic"
              />
              <p className="follower-name">{follower.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowersPage;
