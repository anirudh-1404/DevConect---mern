import API from "@/API/Interceptor";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import StatsCard from "@/components/analytics/StatsCard";
import SimpleChart from "@/components/analytics/SimpleChart";
import {
    Eye,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Briefcase,
    Users,
    TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const isDeveloper = user?.role?.toLowerCase() === "developer";

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await API.get("/analytics/dashboard");
            setAnalytics(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midnight-blue"></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-midnight-black text-white flex items-center justify-center">
                <p className="text-gray-400">Failed to load analytics</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-midnight-black text-white px-4 sm:px-6 py-16">
            <div className="max-w-7xl mx-auto">
                { }
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet mb-2">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Track your activity and performance on DevConnect
                    </p>
                </div>

                {isDeveloper ? (

                    <>
                        { }
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Profile Views"
                                value={analytics.profileViews?.total}
                                icon={Eye}
                                color="cyan"
                                subtitle="Last 30 days"
                            />
                            <StatsCard
                                title="Total Applications"
                                value={analytics.applications.stats?.total}
                                icon={FileText}
                                color="blue"
                            />
                            <StatsCard
                                title="Hired / Offered"
                                value={analytics.applications.stats?.hired}
                                icon={CheckCircle}
                                color="green"
                            />
                            <StatsCard
                                title="Profile Completion"
                                value={`${analytics.profileCompletion || 0}%`}
                                icon={TrendingUp}
                                color="purple"
                            />
                        </div>

                        { }
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            { }
                            <SimpleChart
                                title="Application Status Breakdown"
                                data={{
                                    Applied: analytics.applications.stats.applied,
                                    Interviewing: analytics.applications.stats.interviewing,
                                    Hired: analytics.applications.stats.hired,
                                    Rejected: analytics.applications.stats.rejected,
                                }}
                            />

                            { }
                            <SimpleChart
                                title="Profile Views (Last 30 Days)"
                                data={analytics.profileViews.byDate}
                            />
                        </div>

                        { }
                        <div className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Recent Profile Viewers
                            </h3>
                            {analytics.profileViews?.recent?.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">
                                    No profile views yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics.profileViews?.recent?.map((view, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-midnight-gray/40 rounded-xl p-4 hover:bg-midnight-gray/60 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={view.user.avatar || "https://github.com/shadcn.png"}
                                                    alt={view.user.username}
                                                    className="w-10 h-10 rounded-full border-2 border-midnight-blue"
                                                />
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {view.user.username}
                                                    </p>
                                                    <p className="text-gray-400 text-xs">
                                                        {new Date(view.viewedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/developers/${view.user._id}`}
                                                className="text-midnight-blue hover:text-blue-400 text-sm"
                                            >
                                                View Profile
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        { }
                        <div className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Recent Applications
                            </h3>
                            {analytics.applications?.recent?.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">
                                    No applications yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics.applications?.recent?.map((app) => (
                                        <div
                                            key={app._id}
                                            className="flex items-center justify-between bg-midnight-gray/40 rounded-xl p-4"
                                        >
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{app.job.title}</p>
                                                <p className="text-gray-400 text-sm">{app.job.company}</p>
                                            </div>
                                            <span
                                                className={`
                        px-3 py-1 rounded-full text-xs font-bold
                        ${app.status === "Applied"
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : ""
                                                    }
                        ${["Interview Scheduled", "Interviewing"].includes(app.status)
                                                        ? "bg-purple-500/20 text-purple-400"
                                                        : ""
                                                    }
                        ${["Hired", "Offered"].includes(app.status)
                                                        ? "bg-green-500/20 text-green-400"
                                                        : ""
                                                    }
                        ${app.status === "Rejected"
                                                        ? "bg-red-500/20 text-red-400"
                                                        : ""
                                                    }
                      `}
                                            >
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (

                    <>
                        { }
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Total Jobs Posted"
                                value={analytics.jobs?.total}
                                icon={Briefcase}
                                color="cyan"
                            />
                            <StatsCard
                                title="Open Jobs"
                                value={analytics.jobs?.open}
                                icon={Clock}
                                color="green"
                            />
                            <StatsCard
                                title="Total Applicants"
                                value={analytics.applicants?.total}
                                icon={Users}
                                color="purple"
                            />
                            <StatsCard
                                title="Profile Views"
                                value={analytics.profileViews?.total}
                                icon={Eye}
                                color="orange"
                                subtitle="Last 30 days"
                            />
                        </div>

                        { }
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
                            <SimpleChart
                                title="Applications per Job"
                                data={analytics.applicants?.byJob}
                            />
                        </div>

                        { }
                        <div className="bg-midnight-gray/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Most Popular Jobs
                            </h3>
                            {analytics.popularJobs?.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">
                                    No jobs posted yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics.popularJobs?.map((job) => (
                                        <div
                                            key={job._id}
                                            className="flex items-center justify-between bg-midnight-gray/40 rounded-xl p-4 hover:bg-midnight-gray/60 transition-all"
                                        >
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{job.title}</p>
                                                <p className="text-gray-400 text-sm">{job.company}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-midnight-blue font-semibold">
                                                        {job.applicantCount}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">applicants</p>
                                                </div>
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="text-midnight-blue hover:text-blue-400 text-sm"
                                                >
                                                    View →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
