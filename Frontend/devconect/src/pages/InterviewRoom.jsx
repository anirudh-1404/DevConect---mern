import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebRTC } from '@/hooks/useWebRTC';
import VideoPanel from '@/components/interview/VideoPanel';
import ChatPanel from '@/components/interview/ChatPanel';
import ControlBar from '@/components/interview/ControlBar';
import API from '@/API/Interceptor';
import toast from 'react-hot-toast';
import { Loader2, AlertCircle } from 'lucide-react';

const InterviewRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const {
        localStream,
        remoteStream,
        isConnected,
        error,
        localVideoRef,
        remoteVideoRef,
        toggleAudio,
        toggleVideo,
        shareScreen,
        socket,
    } = useWebRTC(roomId, user._id, user.username);

    useEffect(() => {
        fetchInterviewDetails();
    }, [roomId]);

    useEffect(() => {
        if (interview && interview.status === 'scheduled') {
            // Update status to in-progress when joining
            updateInterviewStatus('in-progress', new Date());
        }
    }, [interview]);

    const fetchInterviewDetails = async () => {
        try {
            const { data } = await API.get(`/interviews/room/${roomId}`);
            setInterview(data.interview);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching interview:', err);
            toast.error('Interview not found or you are not authorized');
            navigate('/interviews');
        }
    };

    const updateInterviewStatus = async (status, startedAt = null, endedAt = null) => {
        try {
            await API.patch(`/interviews/${interview._id}/status`, {
                status,
                startedAt,
                endedAt,
            });
        } catch (err) {
            console.error('Error updating interview status:', err);
        }
    };

    const handleEndCall = async () => {
        await updateInterviewStatus('completed', interview.startedAt, new Date());
        navigate('/interviews');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-midnight-blue animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading interview room...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-midnight-black flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/interviews')}
                        className="px-6 py-3 bg-midnight-blue text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Back to Interviews
                    </button>
                </div>
            </div>
        );
    }

    const otherParticipant =
        interview.recruiter._id === user._id ? interview.developer : interview.recruiter;

    return (
        <div className="min-h-screen bg-midnight-black flex flex-col">
            {/* Header */}
            <header className="bg-midnight-gray border-b border-white/10 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Interview Room</h1>
                        <p className="text-sm text-gray-400">
                            Interview with {otherParticipant.username}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isConnected
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'
                                    } animate-pulse`}
                            />
                            <span className="text-sm font-medium">
                                {isConnected ? 'Connected' : 'Connecting...'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Video */}
                <div className="flex-1 p-4">
                    <VideoPanel
                        localVideoRef={localVideoRef}
                        remoteVideoRef={remoteVideoRef}
                        isConnected={isConnected}
                        localStream={localStream}
                        remoteStream={remoteStream}
                    />
                </div>

                {/* Right: Chat */}
                <ChatPanel socket={socket} roomId={roomId} />
            </div>

            {/* Control Bar */}
            <ControlBar
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                shareScreen={shareScreen}
                onEndCall={handleEndCall}
            />

            {/* CSS for mirroring local video */}
            <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
        </div>
    );
};

export default InterviewRoom;
