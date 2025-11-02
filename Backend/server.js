import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["get", "post", "put", "patch", "delete"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", userRouter);
app.use("/api/post", postRoutes);

db();

app.listen(process.env.PORT, () => {
  console.log("app is running on port 8000");
});

app.get("/api/test", (req, res, next) => {
  res.status(200).json({
    message: "success",
  });
});
