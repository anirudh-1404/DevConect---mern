import Conversation from "../models/ConversationSchema.js";
import Message from "../models/MessageSchema.js";
import Notification from "../models/NotificationSchema.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        
        await Promise.all([conversation.save(), newMessage.save()]);

        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        
        const newNotification = new Notification({
            type: "message",
            from: senderId,
            to: receiverId,
            message: `sent you a message`,
            link: `/messages?userId=${senderId}`,
        });

        await newNotification.save();

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", newNotification);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); 

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        
        const conversations = await Conversation.find({
            participants: loggedInUserId,
        }).populate("participants", "username avatar"); 

        
        const formattedConversations = await Promise.all(
            conversations.map(async (conversation) => {
                const otherParticipant = conversation.participants.find(
                    (participant) => participant._id.toString() !== loggedInUserId.toString()
                );

                
                const unreadCount = await Message.countDocuments({
                    _id: { $in: conversation.messages },
                    receiverId: loggedInUserId,
                    isRead: false,
                });

                return {
                    ...otherParticipant._doc, 
                    conversationId: conversation._id,
                    unreadCount,
                };
            })
        );

        res.status(200).json(formattedConversations);
    } catch (error) {
        console.log("Error in getConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const receiverId = req.user._id;

        await Message.updateMany(
            { senderId, receiverId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.log("Error in markMessagesAsRead controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const count = await Message.countDocuments({
            receiverId: userId,
            isRead: false,
        });

        res.status(200).json({ count });
    } catch (error) {
        console.log("Error in getUnreadCount controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
