import { CodingSession } from "../models/CodingSessionSchema.js";


export const createSession = async (req, res) => {
    try {
        const { title, description, language, isPublic } = req.body;
        const hostId = req.user._id;

        if (!title) {
            return res.status(400).json({ message: "Session title is required" });
        }

        const session = await CodingSession.create({
            title,
            description,
            host: hostId,
            participants: [hostId], 
            language: language || "javascript",
            isPublic: isPublic || false,
        });

        const populatedSession = await CodingSession.findById(session._id)
            .populate("host", "username avatar")
            .populate("participants", "username avatar");

        res.status(201).json({
            message: "Coding session created successfully",
            session: populatedSession,
        });
    } catch (error) {
        console.error("Error creating coding session:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getSessions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, filter } = req.query;

        let query = {};

        
        if (status) {
            query.status = status;
        }

        
        if (filter === "my") {
            query.$or = [{ host: userId }, { participants: userId }];
        } else if (filter === "public") {
            query.isPublic = true;
            query.status = "active";
        } else {
            
            query.$or = [
                { host: userId },
                { participants: userId },
                { isPublic: true, status: "active" },
            ];
        }

        const sessions = await CodingSession.find(query)
            .populate("host", "username avatar")
            .populate("participants", "username avatar")
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            sessions,
            count: sessions.length,
        });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await CodingSession.findById(id)
            .populate("host", "username avatar")
            .populate("participants", "username avatar");

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        
        const isParticipant = session.participants.some(
            (p) => p._id.toString() === userId.toString()
        );
        const isHost = session.host._id.toString() === userId.toString();

        if (!isParticipant && !isHost && !session.isPublic) {
            return res.status(403).json({ message: "Access denied to this session" });
        }

        res.status(200).json({ session });
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const joinSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await CodingSession.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.status === "ended") {
            return res.status(400).json({ message: "This session has ended" });
        }

        
        const isAlreadyParticipant = session.participants.some(
            (p) => p.toString() === userId.toString()
        );

        if (isAlreadyParticipant) {
            return res.status(400).json({ message: "Already in this session" });
        }

        
        if (!session.isPublic && session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "This is a private session" });
        }

        
        session.participants.push(userId);
        await session.save();

        const updatedSession = await CodingSession.findById(id)
            .populate("host", "username avatar")
            .populate("participants", "username avatar");

        res.status(200).json({
            message: "Joined session successfully",
            session: updatedSession,
        });
    } catch (error) {
        console.error("Error joining session:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const endSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await CodingSession.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the host can end the session" });
        }

        if (session.status === "ended") {
            return res.status(400).json({ message: "Session already ended" });
        }

        session.status = "ended";
        session.endedAt = new Date();
        await session.save();

        res.status(200).json({
            message: "Session ended successfully",
            session,
        });
    } catch (error) {
        console.error("Error ending session:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;
        const userId = req.user._id;

        const session = await CodingSession.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        
        const isParticipant = session.participants.some(
            (p) => p.toString() === userId.toString()
        );

        if (!isParticipant && session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        session.code = code;
        await session.save();

        res.status(200).json({
            message: "Code saved successfully",
        });
    } catch (error) {
        console.error("Error updating code:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { language } = req.body;
        const userId = req.user._id;

        const session = await CodingSession.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only host can change language" });
        }

        session.language = language;
        await session.save();

        res.status(200).json({
            message: "Language updated successfully",
            language,
        });
    } catch (error) {
        console.error("Error updating language:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
