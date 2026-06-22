import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Use in-memory storage — no disk writes, no multer-storage-cloudinary needed
const memStorage = multer.memoryStorage();
const multerUpload = multer({ storage: memStorage });

/**
 * Uploads a buffer to Cloudinary via upload_stream and resolves with the result.
 */
const streamUpload = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    Readable.from(buffer).pipe(stream);
  });
};

/**
 * Factory that returns an Express middleware chain:
 *  1. multer parses the multipart form and stores file in memory (req.file.buffer)
 *  2. A custom middleware uploads the buffer to Cloudinary and patches req.file.path
 *     so that existing controllers can continue using `req.file.path` unchanged.
 */
const createUploadMiddleware = (fieldName) => {
  const multerMiddleware = multerUpload.single(fieldName);

  return [
    multerMiddleware,
    async (req, res, next) => {
      if (!req.file) return next(); // no file attached — skip

      try {
        const result = await streamUpload(req.file.buffer, {
          folder: "devconnect",
          resource_type: "auto",
        });

        // Patch req.file.path to be the Cloudinary secure URL
        // (mirrors the behaviour of multer-storage-cloudinary)
        req.file.path = result.secure_url;
        next();
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "File upload to Cloudinary failed." });
      }
    },
  ];
};

/**
 * Default export keeps the same interface as before:
 *   upload.single("fieldName")  → middleware array [multer, cloudinaryUploader]
 *
 * Because routes do:  router.post("/route", upload.single("avatar"), handler)
 * and Express accepts an array of middlewares in place of a single one.
 */
const upload = {
  single: (fieldName) => createUploadMiddleware(fieldName),
};

export default upload;
