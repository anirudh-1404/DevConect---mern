import axios from "axios";


const PISTON_API = "https://emkc.org/api/v2/piston";


const languageMap = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    cpp: "c++",
    c: "c",
    csharp: "csharp",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    swift: "swift",
};

export const executeCode = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ message: "Code and language are required" });
        }

        const pistonLanguage = languageMap[language] || language;

        
        const response = await axios.post(`${PISTON_API}/execute`, {
            language: pistonLanguage,
            version: "*", 
            files: [
                {
                    content: code,
                },
            ],
        });

        const result = response.data;

        res.status(200).json({
            output: result.run.output || "",
            stderr: result.run.stderr || "",
            stdout: result.run.stdout || "",
            exitCode: result.run.code,
        });
    } catch (error) {
        console.error("Code execution error:", error);
        res.status(500).json({
            message: "Failed to execute code",
            error: error.response?.data?.message || error.message,
        });
    }
};

export const getSupportedLanguages = async (req, res) => {
    try {
        const response = await axios.get(`${PISTON_API}/runtimes`);
        const runtimes = response.data;

        
        const supported = runtimes.filter((runtime) =>
            Object.values(languageMap).includes(runtime.language)
        );

        res.status(200).json({ languages: supported });
    } catch (error) {
        console.error("Error fetching languages:", error);
        res.status(500).json({ message: "Failed to fetch supported languages" });
    }
};
