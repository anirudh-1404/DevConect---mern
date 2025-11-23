import React, { useEffect } from 'react';
import { Video, VideoOff } from 'lucide-react';

const VideoPanel = ({ localVideoRef, remoteVideoRef, isConnected, localStream, remoteStream }) => {
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, localVideoRef]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, remoteVideoRef]);
    return (
        <div className="h-full flex flex-col gap-4">
            {/* Remote Video (Large) */}
            <div className="flex-1 bg-midnight-black rounded-2xl overflow-hidden relative border border-white/10">
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">
                                {isConnected ? 'Waiting for video...' : 'Waiting for participant to join...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Local Video (Small, Picture-in-Picture) */}
                {localStream && (
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-midnight-gray rounded-xl overflow-hidden border-2 border-midnight-blue shadow-lg">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover mirror"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                            You
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPanel;
