import { ProfileView } from "../models/ProfileViewSchema.js";
import { Application } from "../models/ApplicationSchema.js";
import { Job } from "../models/JobSchema.js";
import User from "../models/UserSchema.js";

export const trackProfileView = async (req, res) => {
    try {
        const { userId } = req.params;
        const viewerId = req.user._id;

        
        if (userId === viewerId.toString()) {
            return res.status(200).json({ message: "Self-view not tracked" });
        }

        
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingView = await ProfileView.findOne({
            viewer: viewerId,
            viewedUser: userId,
            createdAt: { $gte: oneDayAgo },
        });

        if (!existingView) {
            await ProfileView.create({
                viewer: viewerId,
                viewedUser: userId,
            });
        }

        res.status(200).json({ message: "Profile view tracked" });
    } catch (error) {
        console.error("Error tracking profile view:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDashboardAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role?.toLowerCase();

        if (userRole === "developer") {
            
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

            
            const profileViews = await ProfileView.find({
                viewedUser: userId,
                createdAt: { $gte: thirtyDaysAgo },
            }).populate("viewer", "username avatar");

            
            const viewsByDate = {};
            profileViews.forEach((view) => {
                const date = view.createdAt.toISOString().split("T")[0];
                viewsByDate[date] = (viewsByDate[date] || 0) + 1;
            });

            
            const applications = await Application.find({ applicant: userId }).populate(
                "job",
                "title company"
            );

            const applicationStats = {
                total: applications.length,
                pending: applications.filter((a) => a.status === "Pending").length,
                reviewed: applications.filter((a) => a.status === "Reviewed").length,
                accepted: applications.filter((a) => a.status === "Accepted").length,
                rejected: applications.filter((a) => a.status === "Rejected").length,
            };

            
            const recentViewers = profileViews
                .slice(-10)
                .reverse()
                .map((v) => ({
                    user: v.viewer,
                    viewedAt: v.createdAt,
                }));

            
            const user = await User.findById(userId);
            const completionFields = ["avatar", "bio", "skills", "location", "github", "linkedin"];
            const completedFields = completionFields.filter((field) => user[field] && (Array.isArray(user[field]) ? user[field].length > 0 : true));
            const profileCompletion = Math.round((completedFields.length / completionFields.length) * 100);

            res.status(200).json({
                role: "developer",
                profileViews: {
                    total: profileViews.length,
                    byDate: viewsByDate,
                    recent: recentViewers,
                },
                applications: {
                    stats: applicationStats,
                    recent: applications.slice(-5).reverse(),
                },
                profileCompletion,
            });
        } else if (userRole === "recruiter") {
            
            const jobs = await Job.find({ postedBy: userId });
            const jobIds = jobs.map((j) => j._id);

            
            const applications = await Application.find({ job: { $in: jobIds } }).populate(
                "applicant",
                "username avatar"
            );

            
            const applicationsPerJob = {};
            jobs.forEach((job) => {
                applicationsPerJob[job.title] = applications.filter(
                    (a) => a.job.toString() === job._id.toString()
                ).length;
            });

            
            const jobsWithApplicants = jobs.map((job) => ({
                ...job.toObject(),
                applicantCount: applications.filter(
                    (a) => a.job.toString() === job._id.toString()
                ).length,
            }));
            const popularJobs = jobsWithApplicants
                .sort((a, b) => b.applicantCount - a.applicantCount)
                .slice(0, 5);

            
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const profileViews = await ProfileView.find({
                viewedUser: userId,
                createdAt: { $gte: thirtyDaysAgo },
            });

            res.status(200).json({
                role: "recruiter",
                jobs: {
                    total: jobs.length,
                    open: jobs.filter((j) => j.status === "Open").length,
                    closed: jobs.filter((j) => j.status === "Closed").length,
                },
                applicants: {
                    total: applications.length,
                    byJob: applicationsPerJob,
                },
                popularJobs,
                profileViews: {
                    total: profileViews.length,
                },
            });
        } else {
            res.status(400).json({ message: "Invalid user role" });
        }
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
