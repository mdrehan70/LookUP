// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import VerifySecurityAnswer from "./auth/VerifySecurityAnswer";
import ResetPassword from "./auth/ResetPassword";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/verify-security-answer"
          element={<VerifySecurityAnswer />}
        />
        <Route path="/forgot-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
