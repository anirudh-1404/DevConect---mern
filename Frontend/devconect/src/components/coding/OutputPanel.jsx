import React, { useState } from "react";
import { Play, X, Loader2, Terminal } from "lucide-react";

const OutputPanel = ({ code, language, onClose }) => {
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const executeCode = async () => {
        setLoading(true);
        setOutput("");
        setError("");

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL_API}/code/execute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ code, language }),
            });

            const data = await response.json();

            if (response.ok) {
                setOutput(data.output || data.stdout || "No output");
                if (data.stderr) {
                    setError(data.stderr);
                }
            } else {
                setError(data.message || "Execution failed");
            }
        } catch (err) {
            setError("Failed to execute code: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl border-t border-cyan-800/40 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Output</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={executeCode}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Run Code
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {}
                {output && (
                    <div>
                        <p className="text-xs text-gray-400 mb-2">Standard Output:</p>
                        <pre className="bg-gray-950 border border-gray-700 rounded-xl p-4 text-green-400 font-mono text-sm overflow-x-auto max-h-60 overflow-y-auto">
                            {output}
                        </pre>
                    </div>
                )}

                {}
                {error && (
                    <div>
                        <p className="text-xs text-red-400 mb-2">Error:</p>
                        <pre className="bg-gray-950 border border-red-500/30 rounded-xl p-4 text-red-400 font-mono text-sm overflow-x-auto max-h-60 overflow-y-auto">
                            {error}
                        </pre>
                    </div>
                )}

                {}
                {!output && !error && !loading && (
                    <div className="bg-gray-950 border border-gray-700 rounded-xl p-8 text-center">
                        <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Click "Run Code" to see the output</p>
                        <p className="text-gray-500 text-sm mt-1">
                            Supports {language} execution
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutputPanel;
