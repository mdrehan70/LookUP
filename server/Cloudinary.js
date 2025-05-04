// config/cloudinary.js
import cloudinary from "cloudinary";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
