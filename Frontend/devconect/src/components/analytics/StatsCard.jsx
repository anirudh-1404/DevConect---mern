import React from "react";

const StatsCard = ({ title, value, icon: Icon, color = "cyan", subtitle }) => {
    const colorClasses = {
        cyan: "from-cyan-500 to-blue-600 border-cyan-500/30",
        green: "from-green-500 to-emerald-600 border-green-500/30",
        purple: "from-purple-500 to-pink-600 border-purple-500/30",
        orange: "from-orange-500 to-red-600 border-orange-500/30",
        blue: "from-blue-500 to-indigo-600 border-blue-500/30",
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-2xl p-6 hover:border-cyan-500/60 transition-all">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
                    <p className="text-4xl font-bold text-white mb-1">{value}</p>
                    {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
                </div>
                {Icon && (
                    <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.cyan
                            } border`}
                    >
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
