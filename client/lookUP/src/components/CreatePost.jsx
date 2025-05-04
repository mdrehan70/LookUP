import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./CreatePost.css";
import { FaUpload } from "react-icons/fa";

function CreatePost({ onPostCreate }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false); // To handle upload status

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !caption) {
      toast.error("Please provide both file and caption!");
      return;
    }

    try {
      setUploading(true); // Start uploading

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "lookup-post"); // Your upload preset name
      formData.append("cloud_name", "dnqwoghil"); // Your Cloudinary cloud name

      // Upload directly to Cloudinary
      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dnqwoghil/upload",
        formData
      );
      console.log("cloudinary resp", cloudinaryRes);

      const fileUrl = cloudinaryRes.data.secure_url; // Get secure URL from response
      if (!fileUrl) {
        throw new Error("Upload failed, no file URL received");
      }

      const currentDateTime = new Date().toLocaleString();

      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem("user")); // <-- Changed from Cookies to localStorage
      const userId = user ? user._id : null;
      const username = user ? user.username : "Anonymous";

      // Create the post object
      const newPost = {
        username,
        userId, // Include user ID
        fileUrl,
        caption,
        date: currentDateTime,
        fileType, // image or video
      };

      // Call the API to save the post in the database
      const response = await axios.post(
        "https://lookup-g4bt.onrender.com/api/create-new-post",
        newPost,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("create new post res", response);

      if (response.status === 201) {
        toast.success("Post created and saved successfully!");
        // Add post to feed immediately without refetching
        onPostCreate(newPost);
        setTimeout(() => {
          navigate("/"); // Redirect after successful post creation
        }, 1500);
      } else {
        toast.error("Failed to save the post to the database!");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("Failed to upload file or create post!");
    } finally {
      setUploading(false); // End uploading
      setCaption("");
      setFile(null);
      setFileType("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes

      if (selectedFile.size > maxSize) {
        toast.error("File size exceeds 20MB limit!");
        e.target.value = ""; // Clear file input
        setFile(null);
        setFileType("");
        return;
      }

      setFile(selectedFile);
      setFileType(selectedFile.type.split("/")[0]); // image or video
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="file-input-wrapper">
          <label htmlFor="file-upload" className="file-label">
            <FaUpload /> Upload File (Image/Video)
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {file && (
          <div className="file-preview">
            {fileType === "image" ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="file-thumbnail"
              />
            ) : fileType === "video" ? (
              <video controls className="file-thumbnail">
                <source src={URL.createObjectURL(file)} type={file.type} />
              </video>
            ) : null}
          </div>
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-textarea"
        />

        <div className="create-post-actions">
          <button
            type="submit"
            className="submit-post-btn"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Post"}
          </button>

          <Link
            to="/"
            className="cancel-post-btn"
            style={{ textDecoration: "none" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
