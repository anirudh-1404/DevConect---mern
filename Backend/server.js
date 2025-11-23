import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import developerRouter from "./routes/developerRoutes.js";
import recruiterRouter from "./routes/recruiterRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import codingSessionRoutes from "./routes/codingSessionRoutes.js";
import executionRoutes from "./routes/executionRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import { app, server, io } from "./socket/socket.js";
import { setupInterviewSocket } from "./socket/interviewSocket.js";

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", userRouter);
app.use("/api/post", postRoutes);
app.use("/api", developerRouter);
app.use("/api", recruiterRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sessions", codingSessionRoutes);
app.use("/api/code", executionRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/submissions", submissionRoutes);

db();

// Setup interview WebRTC signaling
setupInterviewSocket(io);

server.listen(process.env.PORT, () => {
  console.log("app is running on port 8000");
});

app.get("/api/test", (req, res, next) => {
  res.status(200).json({
    message: "success",
  });
});
