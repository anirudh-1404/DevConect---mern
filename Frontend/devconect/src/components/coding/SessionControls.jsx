import React from "react";
import { Code2, LogOut } from "lucide-react";

const SessionControls = ({ language, onLanguageChange, onEndSession, isHost }) => {
    const languages = [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "cpp", label: "C++" },
        { value: "c", label: "C" },
        { value: "csharp", label: "C#" },
        { value: "go", label: "Go" },
        { value: "rust", label: "Rust" },
        { value: "php", label: "PHP" },
        { value: "ruby", label: "Ruby" },
        { value: "swift", label: "Swift" },
    ];

    return (
        <div className="flex items-center gap-3">
            {}
            <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    disabled={!isHost}
                    className="px-4 py-2 rounded-xl bg-gray-800/50 border border-cyan-800/40 text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            {}
            {isHost && (
                <button
                    onClick={onEndSession}
                    className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">End Session</span>
                </button>
            )}
        </div>
    );
};

export default SessionControls;
