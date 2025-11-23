import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// Dynamic import to avoid Stream issues
let Peer = null;
const loadPeer = async () => {
    if (!Peer) {
        const module = await import('simple-peer');
        Peer = module.default;
    }
    return Peer;
};

export const useWebRTC = (roomId, userId, username) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    const socketRef = useRef();
    const peerRef = useRef();
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    useEffect(() => {
        if (!roomId || !userId) return;

        // Get user media
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);


                // Connect to socket
                socketRef.current = io(`${import.meta.env.VITE_BASE_URL_API.replace('/api', '')}/interview`, {
                    withCredentials: true,
                });

                socketRef.current.emit('join-room', { roomId, userId, username });

                // Handle user joined (initiator creates offer)
                socketRef.current.on('user-joined', ({ userId: joinedUserId, socketId }) => {
                    console.log('User joined:', joinedUserId);
                    createPeer(socketId, stream);
                });

                // Handle receiving offer (non-initiator creates answer)
                socketRef.current.on('offer', ({ offer, from }) => {
                    console.log('Received offer from:', from);
                    handleOffer(offer, from, stream);
                });

                // Handle receiving answer
                socketRef.current.on('answer', ({ answer, from }) => {
                    console.log('Received answer from:', from);
                    if (peerRef.current) {
                        peerRef.current.signal(answer);
                    }
                });

                // Handle ICE candidates
                socketRef.current.on('ice-candidate', ({ candidate, from }) => {
                    if (peerRef.current) {
                        peerRef.current.signal(candidate);
                    }
                });

                // Handle user left
                socketRef.current.on('user-left', () => {
                    console.log('User left');
                    setRemoteStream(null);
                    setIsConnected(false);
                    if (peerRef.current) {
                        peerRef.current.destroy();
                    }
                });
            })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
                setError('Failed to access camera/microphone. Please grant permissions.');
            });

        return () => {
            // Cleanup
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
            if (peerRef.current) {
                peerRef.current.destroy();
            }
            if (socketRef.current) {
                socketRef.current.emit('leave-room', { roomId, userId });
                socketRef.current.disconnect();
            }
        };
    }, [roomId, userId, username]);

    const createPeer = async (targetSocketId, stream) => {
        const PeerClass = await loadPeer();
        const peer = new PeerClass({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socketRef.current.emit('offer', {
                roomId,
                offer: signal,
                to: targetSocketId,
            });
        });

        peer.on('stream', (remoteStream) => {
            console.log('Received remote stream');
            setRemoteStream(remoteStream);
            setIsConnected(true);
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
            setError('Connection error occurred');
        });

        peerRef.current = peer;
    };

    const handleOffer = async (offer, from, stream) => {
        const PeerClass = await loadPeer();
        const peer = new PeerClass({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socketRef.current.emit('answer', {
                roomId,
                answer: signal,
                to: from,
            });
        });

        peer.on('stream', (remoteStream) => {
            console.log('Received remote stream');
            setRemoteStream(remoteStream);
            setIsConnected(true);
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
            setError('Connection error occurred');
        });

        peer.signal(offer);
        peerRef.current = peer;
    };

    const toggleAudio = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return audioTrack.enabled;
            }
        }
        return false;
    }, [localStream]);

    const toggleVideo = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                return videoTrack.enabled;
            }
        }
        return false;
    }, [localStream]);

    const shareScreen = useCallback(async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });

            const screenTrack = screenStream.getVideoTracks()[0];
            const videoTrack = localStream.getVideoTracks()[0];

            // Replace video track with screen track
            if (peerRef.current) {
                const sender = peerRef.current._pc
                    .getSenders()
                    .find((s) => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(screenTrack);
                }
            }

            socketRef.current.emit('start-screen-share', { roomId });

            // When screen sharing stops, switch back to camera
            screenTrack.onended = () => {
                if (peerRef.current) {
                    const sender = peerRef.current._pc
                        .getSenders()
                        .find((s) => s.track?.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                }
                socketRef.current.emit('stop-screen-share', { roomId });
            };

            return true;
        } catch (err) {
            console.error('Error sharing screen:', err);
            return false;
        }
    }, [localStream, roomId]);

    return {
        localStream,
        remoteStream,
        isConnected,
        error,
        localVideoRef,
        remoteVideoRef,
        toggleAudio,
        toggleVideo,
        shareScreen,
        socket: socketRef.current,
    };
};
