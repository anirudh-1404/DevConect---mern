import React, { useState, useEffect } from "react";
import { Award, ThumbsUp } from "lucide-react";
import API from "@/API/Interceptor";
import toast from "react-hot-toast";

const SkillEndorsements = ({ userId, skills, isOwnProfile }) => {
    const [endorsements, setEndorsements] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEndorsements();
    }, [userId]);

    const fetchEndorsements = async () => {
        try {
            const { data } = await API.get(`/endorsements/${userId}`);
            setEndorsements(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching endorsements:", error);
            setLoading(false);
        }
    };

    const handleEndorse = async (skill) => {
        try {
            await API.post("/endorsements/endorse", { userId, skill });
            toast.success(`Endorsed ${skill}!`);
            fetchEndorsements();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to endorse");
        }
    };

    const handleUnendorse = async (skill) => {
        try {
            await API.post("/endorsements/unendorse", { userId, skill });
            toast.success("Endorsement removed");
            fetchEndorsements();
        } catch (error) {
            toast.error("Failed to remove endorsement");
        }
    };

    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isEndorsed = (skill) => {
        return endorsements[skill]?.some(e => e.endorser._id === localUser.id);
    };

    if (!skills || skills.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-emerald-400" />
                <h3 className="text-2xl font-bold text-white">Skills & Endorsements</h3>
            </div>

            <div className="space-y-4">
                {skills.map((skill) => {
                    const skillEndorsements = endorsements[skill] || [];
                    const count = skillEndorsements.length;
                    const userHasEndorsed = isEndorsed(skill);

                    return (
                        <div
                            key={skill}
                            className="glass-card rounded-xl p-4 hover:border-emerald-500/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-white font-medium">{skill}</span>
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                                        {count} {count === 1 ? 'endorsement' : 'endorsements'}
                                    </span>
                                </div>

                                {!isOwnProfile && (
                                    <button
                                        onClick={() => userHasEndorsed ? handleUnendorse(skill) : handleEndorse(skill)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${userHasEndorsed
                                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                            : "bg-zinc-800 text-gray-300 hover:bg-gray-700 border border-slate-700"
                                            }`}
                                    >
                                        <ThumbsUp className={`w-4 h-4 ${userHasEndorsed ? 'fill-current' : ''}`} />
                                        {userHasEndorsed ? 'Endorsed' : 'Endorse'}
                                    </button>
                                )}
                            </div>

                            {count > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {skillEndorsements.slice(0, 5).map((endorsement, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full border border-slate-700"
                                            title={endorsement.endorser.username}
                                        >
                                            <img
                                                src={
                                                    endorsement.endorser.avatar ||
                                                    "https://github.com/shadcn.png"
                                                }
                                                alt={endorsement.endorser.username}
                                                className="w-5 h-5 rounded-full border border-emerald-400"
                                            />

                                            <span className="text-xs text-slate-400">
                                                {endorsement.endorser.username}
                                            </span>
                                        </div>
                                    ))}

                                    {count > 5 && (
                                        <span className="text-xs text-slate-500 px-3 py-1">
                                            +{count - 5} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillEndorsements;
