import React from "react";
import { Users, Crown } from "lucide-react";

const ParticipantList = ({ participants, host }) => {
    return (
        <div className="w-80 bg-gray-900/50 backdrop-blur-xl border-l border-cyan-800/40 p-6 overflow-y-auto">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">
                        Participants ({participants.length})
                    </h3>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>

            <div className="space-y-3">
                {participants.map((participant) => {
                    const isHost = participant._id === host._id;

                    return (
                        <div
                            key={participant._id}
                            className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all"
                        >
                            <div className="relative">
                                <img
                                    src={participant.avatar || "https://github.com/shadcn.png"}
                                    alt={participant.username}
                                    className="w-10 h-10 rounded-full border-2 border-cyan-400"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-medium">{participant.username}</p>
                                    {isHost && (
                                        <Crown className="w-4 h-4 text-yellow-400" title="Host" />
                                    )}
                                </div>
                                <p className="text-xs text-green-400">Online</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {}
            <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-xs text-cyan-400 font-medium mb-2">💡 Tip</p>
                <p className="text-xs text-gray-300">
                    All changes are synced in real-time. Code is auto-saved every 2 seconds.
                </p>
            </div>
        </div>
    );
};

export default ParticipantList;
