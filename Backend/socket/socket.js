import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;


    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    socket.on("join-coding-session", (sessionId) => {
        socket.join(`session-${sessionId}`);
        console.log(`User ${userId} joined coding session ${sessionId}`);


        socket.to(`session-${sessionId}`).emit("user-joined-session", {
            userId,
            socketId: socket.id,
        });
    });

    socket.on("leave-coding-session", (sessionId) => {
        socket.leave(`session-${sessionId}`);
        console.log(`User ${userId} left coding session ${sessionId}`);


        socket.to(`session-${sessionId}`).emit("user-left-session", {
            userId,
        });
    });

    socket.on("code-change", ({ sessionId, code, userId: senderId }) => {

        socket.to(`session-${sessionId}`).emit("code-update", {
            code,
            userId: senderId,
        });
    });

    socket.on("cursor-position", ({ sessionId, position, userId: senderId }) => {

        socket.to(`session-${sessionId}`).emit("cursor-update", {
            position,
            userId: senderId,
        });
    });

    socket.on("language-change", ({ sessionId, language, userId: senderId }) => {

        socket.to(`session-${sessionId}`).emit("language-update", {
            language,
            userId: senderId,
        });
    });


    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
