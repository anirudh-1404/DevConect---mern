import React from "react";

const SimpleChart = ({ data, title, type = "bar" }) => {
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
                <p className="text-gray-400 text-center py-8">No data available</p>
            </div>
        );
    }

    const values = Object.values(data);
    const maxValue = Math.max(...values, 1);

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-800/40 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

            <div className="space-y-4">
                {Object.entries(data).map(([label, value]) => {
                    const percentage = (value / maxValue) * 100;

                    return (
                        <div key={label}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">{label}</span>
                                <span className="text-cyan-400 font-semibold">{value}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SimpleChart;
