import Notification from "../models/NotificationSchema.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: "username avatar",
            })
            .sort({ createdAt: -1 });

        await Notification.updateMany({ to: userId }, { isRead: true });

        res.status(200).json({ notifications });
    } catch (error) {
        console.log("Error in getNotifications controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        if (notificationId) {
            await Notification.findByIdAndDelete(notificationId);
            res.status(200).json({ message: "Notification deleted successfully" });
        } else {
            await Notification.deleteMany({ to: userId });
            res.status(200).json({ message: "Notifications deleted successfully" });
        }
    } catch (error) {
        console.log("Error in deleteNotifications controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        if (notificationId === "all") {
            await Notification.updateMany({ to: userId }, { isRead: true });
        } else {
            await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        }

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.log("Error in markAsRead controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
