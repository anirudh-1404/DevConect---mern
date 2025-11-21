import React from "react";
import Sidebar from "../components/chat/Sidebar";
import MessageContainer from "../components/chat/MessageContainer";

const Chat = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#020617] px-4 sm:px-6 py-8">
            <div className="max-w-7xl mx-auto h-[calc(100vh-140px)]">
                {}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                        Messages
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Connect and collaborate with your network
                    </p>
                </div>

                {}
                <div className="flex h-[calc(100%-100px)] rounded-3xl overflow-hidden bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                    <Sidebar />
                    <MessageContainer />
                </div>
            </div>
        </div>
    );
};

export default Chat;
