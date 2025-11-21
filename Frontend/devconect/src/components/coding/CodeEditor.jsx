import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, language, onChange }) => {
    const handleEditorChange = (value) => {
        onChange(value || "");
    };

    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    );
};

export default CodeEditor;
