// WebRTC signaling for interview rooms
export const setupInterviewSocket = (io) => {
    const interviewNamespace = io.of("/interview");

    interviewNamespace.on("connection", (socket) => {
        console.log(`User connected to interview: ${socket.id}`);

        // Join interview room
        socket.on("join-room", ({ roomId, userId, username }) => {
            socket.join(roomId);
            socket.to(roomId).emit("user-joined", {
                userId,
                socketId: socket.id,
                username,
            });
            console.log(`User ${username} joined room ${roomId}`);
        });

        // WebRTC signaling - Offer
        socket.on("offer", ({ roomId, offer, to }) => {
            socket.to(to).emit("offer", {
                offer,
                from: socket.id,
            });
        });

        // WebRTC signaling - Answer
        socket.on("answer", ({ roomId, answer, to }) => {
            socket.to(to).emit("answer", {
                answer,
                from: socket.id,
            });
        });

        // WebRTC signaling - ICE Candidate
        socket.on("ice-candidate", ({ roomId, candidate, to }) => {
            socket.to(to).emit("ice-candidate", {
                candidate,
                from: socket.id,
            });
        });

        // Screen sharing
        socket.on("start-screen-share", ({ roomId }) => {
            socket.to(roomId).emit("screen-share-started", { from: socket.id });
        });

        socket.on("stop-screen-share", ({ roomId }) => {
            socket.to(roomId).emit("screen-share-stopped", { from: socket.id });
        });

        // Chat messages
        socket.on("send-message", ({ roomId, message, sender }) => {
            socket.to(roomId).emit("receive-message", {
                message,
                sender,
                timestamp: new Date(),
            });
        });

        // Code editor sync
        socket.on("code-change", ({ roomId, code, language }) => {
            socket.to(roomId).emit("code-update", { code, language });
        });

        // Whiteboard sync
        socket.on("whiteboard-draw", ({ roomId, drawData }) => {
            socket.to(roomId).emit("whiteboard-update", { drawData });
        });

        // Leave room
        socket.on("leave-room", ({ roomId, userId }) => {
            socket.leave(roomId);
            socket.to(roomId).emit("user-left", { userId, socketId: socket.id });
            console.log(`User ${userId} left room ${roomId}`);
        });

        // Disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected from interview: ${socket.id}`);
        });
    });

    return interviewNamespace;
};
