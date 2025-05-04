import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./Signin.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and Password are required!");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/signin",
        {
          email,
          password,
        }
      );

      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.message || "Signin failed");
      }
    } catch (error) {
      console.error("Signin Error:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signin-wrapper">
      <form className="signin-form" onSubmit={handleSignin}>
        <h2>Sign In</h2>
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

        <button type="submit" className="signin-button">
          Login
        </button>

        <p className="forgot-password-link">
          <Link to="/verify-security-answer">Forgot Password?</Link>
        </p>

        <p className="signup-redirect">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
