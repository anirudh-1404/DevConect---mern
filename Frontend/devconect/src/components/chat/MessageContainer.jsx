import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { MessageCircle } from "lucide-react";
import useConversation from "../../zustand/useConversation";
import { useAuth } from "../../context/AuthContext";
import API from "../../API/Interceptor";

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    useEffect(() => {
        const markAsRead = async () => {
            if (selectedConversation?._id) {
                try {
                    await API.put(`/messages/mark-read/${selectedConversation._id}`);
                    
                    window.dispatchEvent(new Event("messagesRead"));
                } catch (error) {
                    console.error("Error marking messages as read:", error);
                }
            }
        };

        markAsRead();
    }, [selectedConversation]);

    return (
        <div className="flex-1 flex flex-col bg-gray-900/20">
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    {}
                    <div className="bg-gray-800/50 backdrop-blur-md px-6 py-4 border-b border-cyan-800/30 flex items-center gap-4 shadow-sm">
                        <div className="relative">
                            <img
                                src={selectedConversation.avatar || "https://github.com/shadcn.png"}
                                alt="user avatar"
                                className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg">
                                {selectedConversation.username}
                            </span>
                            <span className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};

const NoChatSelected = () => {
    const { user } = useAuth();
    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-900/20">
            <div className="px-4 text-center flex flex-col items-center gap-6 max-w-md">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl"></div>
                    <MessageCircle className="relative w-24 h-24 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
                </div>
                <div>
                    <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        Welcome, {user?.username || "User"}! 👋
                    </p>
                    <p className="text-gray-400 text-base">
                        Select a conversation to start messaging
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
            </div>
        </div>
    );
};

export default MessageContainer;
