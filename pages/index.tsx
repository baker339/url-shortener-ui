import { useState } from "react";

const API_URL = "https://url-shortener-3b7-eg.fly.dev"; // 🔥 Replace with your actual backend URL

function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shortenUrl = async () => {
    if (!originalUrl) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: originalUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setShortenedUrl(data.short_url);
      } else {
        setError(data.error || "Failed to shorten URL");
      }
    } catch (err) {
      setError("Something went wrong! " + err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    alert("Copied to clipboard!");
  };

  return (
      <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial" }}>
        <h1>URL Shortener</h1>
        <input
            type="text"
            placeholder="Enter URL..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
        />
        <button
            onClick={shortenUrl}
            style={{
              marginLeft: "10px",
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {shortenedUrl && (
            <div style={{ marginTop: "20px" }}>
              <p>Shortened URL:</p>
              <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
                {shortenedUrl}
              </a>
              <button
                  onClick={copyToClipboard}
                  style={{
                    display: "block",
                    margin: "10px auto",
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
              >
                Copy
              </button>
            </div>
        )}
      </div>
  );
}

export default Home;