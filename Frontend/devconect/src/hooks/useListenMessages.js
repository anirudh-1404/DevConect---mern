import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const isMessageFromSelectedConversation =
                newMessage.senderId === selectedConversation?._id;

            if (isMessageFromSelectedConversation) {
                setMessages([...messages, newMessage]);
            }
        });

        return () => socket?.off("newMessage");
    }, [socket, setMessages, messages, selectedConversation]);
};

export default useListenMessages;
