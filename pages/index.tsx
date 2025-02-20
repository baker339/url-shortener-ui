import { useState } from "react";
import { motion } from "framer-motion";

const API_URL = "https://url-shortener-3b7-eg.fly.dev"; //

export default function Home() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const shortenUrl = async () => {
        if (!originalUrl) return;

        setLoading(true);
        setError("");

        let formattedUrl = originalUrl.trim().replace(" ", "");

        // ✅ Auto-correct URL if missing "http://" or "https://"
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = "https://" + formattedUrl;
        }

        try {
            const response = await fetch(`${API_URL}/shorten`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ original_url: formattedUrl }), // ✅ Send fixed URL
            });

            const data = await response.json();
            if (response.ok) {
                setShortenedUrl(data.short_url);
            } else {
                setError(data.error || "Failed to shorten URL");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortenedUrl);
        alert("Copied to clipboard!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass p-8 w-full max-w-md text-center shadow-lg"
            >
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Futuristic URL Shortener
                </h1>

                <input
                    type="text"
                    placeholder="Enter your URL..."
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="w-full p-3 mb-4 text-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shortenUrl}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                    {loading ? "Shortening..." : "Shorten URL"}
                </motion.button>

                {error && <p className="text-red-400 mt-3">{error}</p>}

                {shortenedUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 p-4 bg-black/50 rounded-lg"
                    >
                        <p className="text-sm">Shortened URL:</p>
                        <a
                            href={shortenedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-lg text-cyan-300 hover:underline break-all"
                        >
                            {shortenedUrl}
                        </a>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            className="mt-3 py-2 px-4 bg-green-500 hover:bg-green-600 rounded-lg transition"
                        >
                            Copy to Clipboard
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}