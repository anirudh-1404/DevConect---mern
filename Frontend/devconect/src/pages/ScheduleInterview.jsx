import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '@/API/Interceptor';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Loader2 } from 'lucide-react';

const ScheduleInterview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { applicant, applicationId } = location.state || {};

    const [formData, setFormData] = useState({
        scheduledAt: '',
        duration: 60,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!applicant) {
            toast.error('No applicant selected');
            return;
        }

        try {
            setLoading(true);
            const { data } = await API.post('/interviews/schedule', {
                developerId: applicant._id,
                applicationId,
                scheduledAt: formData.scheduledAt,
                duration: formData.duration,
                timezone: formData.timezone,
            });

            toast.success('Interview scheduled successfully!');
            navigate('/recruiter/crm');
        } catch (err) {
            console.error('Error scheduling interview:', err);
            toast.error(err.response?.data?.message || 'Error scheduling interview');
        } finally {
            setLoading(false);
        }
    };

    if (!applicant) {
        return (
            <div className="min-h-screen bg-midnight-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">No applicant selected</p>
                    <button
                        onClick={() => navigate('/recruiter/crm')}
                        className="px-6 py-3 bg-midnight-blue text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Back to CRM
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-midnight-black py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-violet mb-2">
                        Schedule Interview
                    </h1>
                    <p className="text-gray-400">Set up a virtual interview session</p>
                </div>

                {/* Applicant Info */}
                <div className="bg-midnight-gray/50 border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={applicant.avatar || 'https://github.com/shadcn.png'}
                            alt={applicant.username}
                            className="w-16 h-16 rounded-full border-2 border-midnight-blue"
                        />
                        <div>
                            <h3 className="text-xl font-semibold text-white">{applicant.username}</h3>
                            <p className="text-gray-400">{applicant.email}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-midnight-gray/50 border border-white/10 rounded-2xl p-8 space-y-6">
                    {/* Date & Time */}
                    <div>
                        <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-midnight-blue" />
                            Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.scheduledAt}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full p-3 rounded-lg bg-midnight-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue transition-all"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4 text-midnight-blue" />
                            Duration (minutes)
                        </label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            className="w-full p-3 rounded-lg bg-midnight-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-midnight-blue/40 focus:border-midnight-blue transition-all"
                        >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                        </select>
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-gray-300 text-sm mb-2 font-medium">
                            Timezone
                        </label>
                        <input
                            type="text"
                            value={formData.timezone}
                            readOnly
                            className="w-full p-3 rounded-lg bg-midnight-black/50 border border-white/10 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/recruiter/crm')}
                            className="flex-1 px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-midnight-blue to-midnight-violet text-white font-semibold hover:shadow-lg hover:shadow-midnight-blue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                'Schedule Interview'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleInterview;
