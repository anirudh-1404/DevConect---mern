import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';

const ChatPanel = ({ socket, roomId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!socket) return;

        socket.on('receive-message', ({ message, sender, timestamp }) => {
            setMessages((prev) => [...prev, { message, sender, timestamp, isOwn: false }]);
        });

        return () => {
            socket.off('receive-message');
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socket) return;

        const newMessage = {
            message: inputMessage,
            sender: {
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
            },
            timestamp: new Date(),
            isOwn: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        socket.emit('send-message', {
            roomId,
            message: inputMessage,
            sender: {
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
            },
        });
        setInputMessage('');
    };

    return (
        <div className="w-80 bg-midnight-gray border-l border-white/10 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-midnight-blue" />
                    Chat
                </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-2 ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <img
                                src={msg.sender.avatar || 'https://github.com/shadcn.png'}
                                alt={msg.sender.username}
                                className="w-8 h-8 rounded-full border border-midnight-blue/30"
                            />
                            <div className={`flex-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                                <p className="text-xs text-gray-400 mb-1">{msg.sender.username}</p>
                                <div
                                    className={`inline-block px-3 py-2 rounded-lg ${msg.isOwn
                                            ? 'bg-midnight-blue text-white'
                                            : 'bg-midnight-black text-gray-200'
                                        }`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-lg bg-midnight-black border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className="px-4 py-2 bg-midnight-blue text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatPanel;
