import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "devconnect",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi", "mkv", "mp3", "wav"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

export default upload;
