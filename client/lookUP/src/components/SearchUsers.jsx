import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import "./SearchUsers.css"; // <-- Import your provided CSS file
import { useNavigate } from "react-router-dom";

const SearchUsers = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchText.trim() === "") {
      setUsers([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/search-users?name=${searchText}`
      );
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {loading ? (
          <ImSpinner2 className="search-icon spinner" />
        ) : (
          <FiSearch className="search-icon" />
        )}
      </div>

      <div className="user-list">
        {Array.isArray(users) && users.length > 0
          ? users.map((user) => (
              <div
                key={user._id}
                className="user-item"
                onClick={() => navigate(`/user-profile/${user._id}`)}
              >
                {user.name}
              </div>
            ))
          : searchText && <div className="no-results">No users found.</div>}
      </div>
    </div>
  );
};

export default SearchUsers;
