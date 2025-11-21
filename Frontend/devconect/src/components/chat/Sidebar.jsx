import React from "react";
import Conversations from "./Conversations";
import { MessageSquare } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="border-r border-cyan-800/40 p-6 flex flex-col bg-gray-800/30 backdrop-blur-lg w-full md:w-80 lg:w-96">
            {}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white tracking-wide">Conversations</h2>
                </div>
                <p className="text-gray-400 text-xs">Your recent chats</p>
            </div>

            {}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-4"></div>

            {}
            <Conversations />
        </div>
    );
};

export default Sidebar;
