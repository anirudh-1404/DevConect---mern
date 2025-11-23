import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/API/Interceptor';
import toast from 'react-hot-toast';
import { Calendar, Clock, Video, User, Loader2, AlertCircle } from 'lucide-react';

const InterviewsList = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming'); // upcoming, all, completed
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchInterviews();
    }, [filter]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const params = filter === 'upcoming' ? '?upcoming=true' : filter === 'completed' ? '?status=completed' : '';
            const { data } = await API.get(`/interviews${params}`);
            setInterviews(data.interviews);
        } catch (err) {
            console.error('Error fetching interviews:', err);
            toast.error('Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    const joinInterview = (roomId) => {
        navigate(`/interview/${roomId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'in-progress':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'completed':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-midnight-blue/20 text-midnight-blue border-midnight-blue/30';
        }
    };

    const isUpcoming = (scheduledAt) => {
        return new Date(scheduledAt) > new Date();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-midnight-blue animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading interviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-midnight-black py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet mb-2">
                        My Interviews
                    </h1>
                    <p className="text-gray-400">Manage your scheduled interview sessions</p>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8 justify-center">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'upcoming'
                            ? 'bg-midnight-blue text-white'
                            : 'bg-midnight-gray/50 text-gray-400 hover:text-white'
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                            ? 'bg-midnight-blue text-white'
                            : 'bg-midnight-gray/50 text-gray-400 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'completed'
                            ? 'bg-midnight-blue text-white'
                            : 'bg-midnight-gray/50 text-gray-400 hover:text-white'
                            }`}
                    >
                        Completed
                    </button>
                </div>

                {/* Interviews List */}
                {interviews.length === 0 ? (
                    <div className="text-center py-16">
                        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No interviews found</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {filter === 'upcoming' ? 'You have no upcoming interviews' : 'No interviews to display'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {interviews.map((interview) => {
                            const otherParticipant =
                                interview.recruiter._id === user._id ? interview.developer : interview.recruiter;
                            const isRecruiter = interview.recruiter._id === user._id;

                            return (
                                <div
                                    key={interview._id}
                                    className="bg-midnight-gray/50 border border-white/10 rounded-2xl p-6 hover:border-midnight-blue/30 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4 flex-1">
                                            <img
                                                src={otherParticipant.avatar || 'https://github.com/shadcn.png'}
                                                alt={otherParticipant.username}
                                                className="w-16 h-16 rounded-full border-2 border-midnight-blue"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-white">
                                                        {otherParticipant.username}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                            interview.status
                                                        )}`}
                                                    >
                                                        {interview.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-3">
                                                    {isRecruiter ? 'Candidate' : 'Recruiter'} • {otherParticipant.email}
                                                </p>
                                                <div className="flex gap-6 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Calendar className="w-4 h-4 text-midnight-blue" />
                                                        {new Date(interview.scheduledAt).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Clock className="w-4 h-4 text-midnight-blue" />
                                                        {new Date(interview.scheduledAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Clock className="w-4 h-4 text-midnight-blue" />
                                                        {interview.duration} minutes
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {(interview.status === 'scheduled' || interview.status === 'in-progress') && (
                                                <button
                                                    onClick={() => joinInterview(interview.roomId)}
                                                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold hover:shadow-lg hover:shadow-midnight-blue/40 transition-all flex items-center gap-2"
                                                >
                                                    <Video className="w-4 h-4" />
                                                    {interview.status === 'in-progress' ? 'Rejoin Interview' : 'Join Interview'}
                                                </button>
                                            )}
                                            {interview.status === 'completed' && (
                                                <button
                                                    className="px-6 py-2.5 rounded-lg bg-midnight-gray border border-white/10 text-gray-400 font-medium cursor-not-allowed"
                                                    disabled
                                                >
                                                    Completed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewsList;
