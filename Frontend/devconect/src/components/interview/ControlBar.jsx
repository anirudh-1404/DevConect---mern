import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MonitorOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ControlBar = ({ toggleAudio, toggleVideo, shareScreen, onEndCall }) => {
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const navigate = useNavigate();

    const handleToggleAudio = () => {
        const newState = toggleAudio();
        setIsAudioOn(newState);
    };

    const handleToggleVideo = () => {
        const newState = toggleVideo();
        setIsVideoOn(newState);
    };

    const handleShareScreen = async () => {
        if (isScreenSharing) {
            // Stop screen sharing logic handled in hook
            setIsScreenSharing(false);
        } else {
            const success = await shareScreen();
            if (success) {
                setIsScreenSharing(true);
            }
        }
    };

    const handleEndCall = () => {
        if (window.confirm('Are you sure you want to end the interview?')) {
            if (onEndCall) onEndCall();
            navigate('/interviews');
        }
    };

    return (
        <div className="bg-midnight-gray border-t border-white/10 p-4">
            <div className="flex items-center justify-center gap-4">
                {/* Mute/Unmute */}
                <button
                    onClick={handleToggleAudio}
                    className={`p-4 rounded-full transition-all ${isAudioOn
                            ? 'bg-midnight-blue/20 hover:bg-midnight-blue/30 text-midnight-blue'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        }`}
                    title={isAudioOn ? 'Mute' : 'Unmute'}
                >
                    {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                {/* Video On/Off */}
                <button
                    onClick={handleToggleVideo}
                    className={`p-4 rounded-full transition-all ${isVideoOn
                            ? 'bg-midnight-blue/20 hover:bg-midnight-blue/30 text-midnight-blue'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        }`}
                    title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                    {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>

                {/* Screen Share */}
                <button
                    onClick={handleShareScreen}
                    className={`p-4 rounded-full transition-all ${isScreenSharing
                            ? 'bg-midnight-violet/20 hover:bg-midnight-violet/30 text-midnight-violet'
                            : 'bg-midnight-blue/20 hover:bg-midnight-blue/30 text-midnight-blue'
                        }`}
                    title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                >
                    {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                </button>

                {/* End Call */}
                <button
                    onClick={handleEndCall}
                    className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all ml-4"
                    title="End interview"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default ControlBar;
