import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { useSocketContext } from "@/context/SocketContext";
import API from "@/API/Interceptor";
import { Bell, MessageCircle, Menu, X, Code2, Sparkles, ChevronDown, Users, Briefcase, Terminal, LayoutDashboard, Globe, FileText, UserCog, Video, Trophy, Bookmark } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { socket } = useSocketContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadMessages();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleNewMessage = () => {
      fetchUnreadMessages();
    };

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleMessagesRead = () => {
      fetchUnreadMessages();
    };

    socket?.on("newMessage", handleNewMessage);
    socket?.on("newNotification", handleNewNotification);
    window.addEventListener("messagesRead", handleMessagesRead);

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("newNotification", handleNewNotification);
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, [isAuthenticated, socket]);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data.notifications || []);
      const unread = data.notifications?.filter((n) => !n.isRead).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const { data } = await API.get("/messages/conversations");
      const total = data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      setUnreadMessages(total);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await API.put(`/notifications/${notificationId}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await API.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-midnight-black/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          { }
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Code2 className="w-8 h-8 text-neon-cyan group-hover:text-neon-green transition-colors" />
              <Sparkles className="w-3 h-3 text-neon-pink absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-midnight-blue to-midnight-violet text-transparent bg-clip-text">
              DevConnect
            </span>
          </Link>

          { }
          <div className="hidden lg:flex items-center gap-4">
            { }
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Globe className="w-4 h-4 text-midnight-blue" />
                <span className="font-medium text-sm">Explore</span>
                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-52 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-midnight-gray border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <Link to="/community" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                    <Globe className="w-4 h-4 text-midnight-blue" />
                    Community
                  </Link>
                  <Link to="/jobs" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                    <Briefcase className="w-4 h-4 text-neon-pink" />
                    Jobs
                  </Link>
                  <Link to="/developers" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                    <Users className="w-4 h-4 text-neon-cyan" />
                    Developers
                  </Link>
                  <Link to="/recruiters" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                    <Users className="w-4 h-4 text-neon-cyan" />
                    Recruiters
                  </Link>
                  {isAuthenticated && (
                    <>
                      <Link to="/saved-jobs" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                        <Bookmark className="w-4 h-4 text-midnight-blue" />
                        Saved Jobs
                      </Link>
                      <Link to="/saved-posts" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                        <Bookmark className="w-4 h-4 text-midnight-violet" />
                        Saved Posts
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            { }
            {isAuthenticated && (
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  <Terminal className="w-4 h-4 text-midnight-violet" />
                  <span className="font-medium text-sm">Tools</span>
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-52 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-midnight-gray border border-white/10 rounded-xl shadow-xl overflow-hidden">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                      <LayoutDashboard className="w-5 h-5 text-midnight-blue" />
                      Dashboard
                    </Link>
                    <Link to="/resume-builder" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                      <FileText className="w-4 h-4 text-neon-green" />
                      Resume Builder
                    </Link>
                    <Link to="/coding-sessions" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                      <Terminal className="w-4 h-4 text-neon-green" />
                      Live Coding
                    </Link>
                    <Link to="/interviews" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                      <Video className="w-4 h-4 text-midnight-violet" />
                      Interviews
                    </Link>
                    <Link to="/hackathons" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      Hackathons
                    </Link>
                    {user?.role?.toLowerCase() === "recruiter" && (
                      <Link to="/recruiter/crm" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neon-black hover:text-white transition-colors border-t border-gray-800">
                        <UserCog className="w-4 h-4 text-midnight-violet" />
                        Recruiter CRM
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          { }
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <button className="px-5 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-5 py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all">
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              <>
                { }
                <Link to="/messages" className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-midnight-blue text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </Link>

                { }
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-midnight-blue text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  { }
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-midnight-gray border border-white/10 rounded-xl shadow-xl overflow-hidden">
                      <div className="p-4 border-b border-gray-800">
                        <h3 className="text-white font-bold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-gray-400 text-center py-8 text-sm">No notifications</p>
                        ) : (
                          notifications.slice(0, 10).map((notif) => (
                            <div
                              key={notif._id}
                              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.isRead ? "bg-midnight-blue/10" : ""
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <img
                                  src={notif.from?.avatar || "https://github.com/shadcn.png"}
                                  alt={notif.from?.username}
                                  className="w-10 h-10 rounded-full border border-white/10"
                                />
                                <div className="flex-1">
                                  <p className="text-white text-sm">
                                    <span className="font-semibold text-white">{notif.from?.username}</span>{" "}
                                    {notif.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                      {!notif.isRead && (
                                        <button
                                          onClick={() => markAsRead(notif._id)}
                                          className="text-xs text-midnight-blue hover:text-midnight-violet"
                                        >
                                          Mark read
                                        </button>
                                      )}
                                      <button
                                        onClick={() => deleteNotification(notif._id)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                { }
                <Link to="/post/create">
                  <button className="px-4 py-2 rounded-lg bg-midnight-blue text-white font-semibold text-sm hover:bg-blue-600 transition-all">
                    Create Post
                  </button>
                </Link>

                { }
                <div className="flex items-center gap-2 pl-3 border-l border-gray-700">
                  <Link to="/profile">
                    <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          { }
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      { }
      {menuOpen && (
        <div className="lg:hidden bg-midnight-black/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-6 space-y-3">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white transition-all rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5 text-midnight-blue" />
                Dashboard
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/resume-builder"
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white transition-all rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <FileText className="w-5 h-5 text-midnight-violet" />
                Resume Builder
              </Link>
            )}
            <Link to="/jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg">
              <Briefcase className="w-5 h-5 text-midnight-blue" />
              Jobs
            </Link>
            <Link to="/community" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg">
              <Globe className="w-5 h-5 text-midnight-violet" />
              Community
            </Link>
            <Link to="/coding-sessions" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
              <Terminal className="w-5 h-5 text-neon-green" />
              Live Coding
            </Link>
            <Link to="/interviews" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
              <Video className="w-5 h-5 text-midnight-violet" />
              Interviews
            </Link>
            <Link to="/hackathons" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Hackathons
            </Link>
            {user?.role?.toLowerCase() === "recruiter" && (
              <Link to="/recruiter/crm" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
                <UserCog className="w-5 h-5 text-midnight-violet" />
                Recruiter CRM
              </Link>
            )}
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Network</div>
            <Link to="/developers" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
              <Users className="w-5 h-5 text-neon-cyan" />
              Developers
            </Link>
            <Link to="/recruiters" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
              <Users className="w-5 h-5 text-neon-cyan" />
              Recruiters
            </Link>

            {isAuthenticated && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Saved</div>
                <Link to="/saved-jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
                  <Bookmark className="w-5 h-5 text-midnight-blue" />
                  Saved Jobs
                </Link>
                <Link to="/saved-posts" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neon-gray/50 rounded-lg">
                  <Bookmark className="w-5 h-5 text-midnight-violet" />
                  Saved Posts
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <button className="w-full px-4 py-3 text-neon-cyan border border-neon-cyan/30 rounded-lg font-semibold hover:bg-neon-cyan/10 transition-all">
                    Login
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-black rounded-lg font-semibold hover:shadow-lg transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <Link to="/messages" onClick={() => setMenuOpen(false)}>
                  <button className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-neon-gray/50 rounded-lg font-medium transition-all flex items-center justify-between">
                    Messages
                    {unreadMessages > 0 && (
                      <span className="px-2 py-1 bg-neon-cyan text-black text-xs font-bold rounded-full">
                        {unreadMessages}
                      </span>
                    )}
                  </button>
                </Link>
                <Link to="/post/create" onClick={() => setMenuOpen(false)}>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-neon-pink to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    Create Post
                  </button>
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <button className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-neon-gray/50 rounded-lg font-medium transition-all">
                    Profile
                  </button>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
