const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv").config()

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Storage (multer ke liye)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "skillBlogImage",
    allowed_formats: ["jpeg", "png", "jpg","avif","webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

// ✅ Export dono cheezein
module.exports = { cloudinary, storage };
