import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useConversation from "../../zustand/useConversation";
import API from "../../API/Interceptor";
import toast from "react-hot-toast";
import useListenMessages from "../../hooks/useListenMessages";
import { MessageCircle } from "lucide-react";

const Messages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    useListenMessages();
    const lastMessageRef = useRef();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/messages/${selectedConversation._id}`);
                if (res.data.error) throw new Error(res.data.error);
                setMessages(res.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessages]);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div className="px-6 py-4 flex-1 overflow-auto custom-scrollbar">
            {loading && (
                <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-full bg-gray-700/50 animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-700/50 rounded-lg w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-700/50 rounded-lg w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && messages.length > 0 && (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message._id} ref={lastMessageRef}>
                            <Message message={message} />
                        </div>
                    ))}
                </div>
            )}

            {!loading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg font-medium">No messages yet</p>
                    <p className="text-gray-500 text-sm mt-1">Send a message to start the conversation</p>
                </div>
            )}
        </div>
    );
};

export default Messages;
