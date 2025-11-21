import React from "react";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const Conversation = ({ conversation, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();

    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = onlineUsers.includes(conversation._id);

    return (
        <>
            <div
                className={`flex gap-3 items-center p-3 rounded-xl cursor-pointer transition-all duration-300 group
				${isSelected
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "hover:bg-gray-800/50 border border-transparent hover:border-cyan-800/30"
                    }
			`}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className="relative">
                    <img
                        src={conversation.avatar || "https://github.com/shadcn.png"}
                        alt="user avatar"
                        className={`w-12 h-12 rounded-full object-cover border-2 transition-all
                            ${isSelected ? "border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "border-gray-600 group-hover:border-cyan-500"}
                        `}
                    />
                    {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                    )}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex gap-3 justify-between items-center">
                        <p className={`font-semibold truncate transition-colors
                            ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}
                        `}>
                            {conversation.username}
                        </p>
                        {conversation.unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-cyan-500 text-white text-xs font-bold rounded-full shadow-lg shadow-cyan-500/50 animate-pulse">
                                {conversation.unreadCount}
                            </span>
                        )}
                    </div>
                    {isOnline && (
                        <span className="text-xs text-green-400">Online</span>
                    )}
                </div>
            </div>

            {!lastIdx && <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-2" />}
        </>
    );
};

export default Conversation;
