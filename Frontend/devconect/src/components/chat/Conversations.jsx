import React, { useEffect, useState } from "react";
import Conversation from "./Conversation";
import useConversation from "../../zustand/useConversation";
import API from "../../API/Interceptor";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useSocketContext } from "../../context/SocketContext";

const Conversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const { setSelectedConversation, selectedConversation } = useConversation();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await API.get("/messages/conversations");
                if (res.data.error) {
                    throw new Error(res.data.error);
                }
                const fetchedConversations = Array.isArray(res.data) ? res.data : [];
                setConversations(fetchedConversations);

                
                if (userId) {
                    const existingConversation = fetchedConversations.find(
                        (c) => c._id === userId
                    );

                    if (existingConversation) {
                        setSelectedConversation(existingConversation);
                    } else {
                        
                        try {
                            const userRes = await API.get(`/auth/${userId}`);
                            const user = userRes.data;
                            const mockConversation = {
                                _id: user._id,
                                username: user.username,
                                avatar: user?.avatar,
                                mock: true, 
                            };
                            setConversations((prev) => [mockConversation, ...prev]);
                            setSelectedConversation(mockConversation);
                        } catch (err) {
                            console.error("Error fetching user for chat:", err);
                            toast.error("User not found");
                        }
                    }
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, [userId, setSelectedConversation]);

    const { socket } = useSocketContext();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setConversations((prevConversations) => {
                const senderId = newMessage.senderId;

                
                
                
                
                

                const isSelected = selectedConversation?._id === senderId;

                const conversationExists = prevConversations.find(c => c._id === senderId);

                if (conversationExists) {
                    return prevConversations.map(c => {
                        if (c._id === senderId) {
                            return {
                                ...c,
                                unreadCount: isSelected ? c.unreadCount : (c.unreadCount || 0) + 1,
                                
                                
                            };
                        }
                        return c;
                    });
                } else {
                    
                    
                    
                    return prevConversations;
                }
            });
        });

        return () => socket?.off("newMessage");
    }, [socket, selectedConversation]);

    useEffect(() => {
        const handleMessagesRead = () => {
            if (selectedConversation) {
                setConversations((prev) =>
                    prev.map((c) =>
                        c._id === selectedConversation._id ? { ...c, unreadCount: 0 } : c
                    )
                );
            }
        };

        window.addEventListener("messagesRead", handleMessagesRead);
        return () => window.removeEventListener("messagesRead", handleMessagesRead);
    }, [selectedConversation]);


    return (
        <div className="py-2 flex flex-col overflow-auto">
            {conversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === conversations.length - 1}
                />
            ))}

            {loading ? <span className="loading loading-spinner mx-auto"></span> : null}
        </div>
    );
};

export default Conversations;
