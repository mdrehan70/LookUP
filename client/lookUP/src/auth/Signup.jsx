import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // signup function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !username || !email || !password || !securityAnswer) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          name,
          username,
          email,
          password,
          securityAnswer,
        }
      );

      if (data.success) {
        toast.success(data.message);

        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setSecurityAnswer("");

        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <input
          type="text"
          placeholder="What is your favorite color?"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
        />
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <p className="login-redirect">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
