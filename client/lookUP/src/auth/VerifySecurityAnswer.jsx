import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios"; // Import axios
import "./VerifySecurityAnswer.css";

const VerifySecurityAnswer = () => {
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !securityAnswer) {
      toast.error("All fields are required!");
      return;
    }

    try {
      // Send POST request to your backend API
      const { data } = await axios.post(
        "https://lookup-g4bt.onrender.com/api/auth/verify-security-answer",
        {
          email,
          securityAnswer,
        }
      );

      toast.success(data.message || "Verified successfully!");
      navigate("/forgot-password");
    } catch (error) {
      console.error("Verification Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="verify-wrapper">
      <form className="verify-form" onSubmit={handleVerify}>
        <h2>Verify Your Identity</h2>
        <input
          type="email"
          placeholder="Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="What is your favourite color?"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
        />
        <button type="submit" className="verify-button">
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifySecurityAnswer;
