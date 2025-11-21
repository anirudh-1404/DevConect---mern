import React, { useState } from "react";
import { Send } from "lucide-react";
import useConversation from "../../zustand/useConversation";
import API from "../../API/Interceptor";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        try {
            const res = await API.post(`/messages/send/${selectedConversation._id}`, {
                message,
            });
            if (res.data.error) throw new Error(res.data.error);
            setMessages([...messages, res.data]);
            setMessage("");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="px-6 py-4 bg-gray-800/30 backdrop-blur-md border-t border-cyan-800/30" onSubmit={handleSubmit}>
            <div className="w-full relative flex items-center gap-3">
                <input
                    type="text"
                    className="flex-1 px-5 py-3 rounded-xl bg-gray-900/50 border border-cyan-800/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            <span className="hidden sm:inline">Send</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;
