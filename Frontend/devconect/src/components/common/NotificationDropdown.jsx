import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, Trash2 } from "lucide-react";
import API from "../../API/Interceptor";
import toast from "react-hot-toast";

const NotificationDropdown = ({ notifications, setNotifications, unreadCount }) => {
    const handleMarkAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await API.put("/notifications/all");
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            toast.success("All marked as read");
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await API.delete("/notifications");
            setNotifications([]);
            toast.success("Notifications cleared");
        } catch (error) {
            console.error("Error clearing notifications", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-white/10 transition-all outline-none mr-2">
                    <Bell className="w-6 h-6 text-gray-300 hover:text-cyan-400 transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#0f2027] animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 bg-[#0f2027]/95 backdrop-blur-xl border border-white/10 text-gray-200 max-h-[500px] overflow-y-auto"
            >
                <div className="flex justify-between items-center px-2 py-1.5">
                    <DropdownMenuLabel className="text-white font-semibold">
                        Notifications
                    </DropdownMenuLabel>
                    <div className="flex gap-2">
                        <button
                            onClick={handleMarkAllRead}
                            title="Mark all as read"
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            title="Clear all"
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-red-400"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />

                {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-sm">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification._id}
                            className="focus:bg-white/5 cursor-pointer p-0"
                        >
                            <Link
                                to={notification.link}
                                className={`flex items-start gap-3 p-3 w-full ${!notification.read ? "bg-cyan-500/10" : ""
                                    }`}
                                onClick={() =>
                                    !notification.read && handleMarkAsRead(notification._id)
                                }
                            >
                                <Avatar className="w-8 h-8 mt-1 border border-white/10">
                                    <AvatarImage src={notification.from?.avatar} />
                                    <AvatarFallback>
                                        {notification.from?.username?.[0] || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm leading-none">
                                        <span className="font-semibold text-white">
                                            {notification.from?.username || "User"}
                                        </span>{" "}
                                        <span className="text-gray-400">
                                            {notification.message}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 mt-2 rounded-full bg-cyan-500 shrink-0" />
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
