import React from "react";
import { useAuth } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { Check, CheckCheck } from "lucide-react";

const Message = ({ message }) => {
    const { user } = useAuth();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === user?._id;
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe
        ? user?.avatar
        : selectedConversation?.avatar;

    const bubbleBgColor = fromMe
        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        : "bg-gray-800/80 text-gray-100 border border-gray-700/50";

    const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className={`w-10 h-10 rounded-full border-2 shadow-md ${fromMe ? "border-cyan-400" : "border-gray-600"}`}>
                    <img
                        alt="User Avatar"
                        src={profilePic || "https://github.com/shadcn.png"}
                        className="rounded-full object-cover"
                    />
                </div>
            </div>
            <div
                className={`chat-bubble ${bubbleBgColor} backdrop-blur-sm px-4 py-2.5 rounded-2xl max-w-xs md:max-w-md break-words transition-all hover:scale-[1.02]`}
            >
                <p className="leading-relaxed">{message.message}</p>
            </div>
            <div className="chat-footer opacity-60 text-xs flex gap-1 items-center mt-1 text-gray-400">
                <span>{formattedTime}</span>
                {fromMe && (
                    <CheckCheck className="w-3 h-3 text-cyan-400" />
                )}
            </div>
        </div>
    );
};

export default Message;
