"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [links, setLinks] = useState([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    fetchLinks();
    if (typeof window !== "undefined" && window.location?.origin) {
      setBaseUrl(window.location.origin);
    }
  }, []);

  async function fetchLinks() {
    try {
      const res = await fetch("/api/links", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load links");
      }
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      setError("Unable to load links. Please refresh.");
    }
  }

  async function createLink(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({ target_url: targetUrl, code }),
    });

    if (res.status === 409) {
      setError("This short code already exists.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError("Failed to create link.");
      setLoading(false);
      return;
    }

    setMessage("Link created successfully!");
    setTargetUrl("");
    setCode("");
    setLoading(false);
    fetchLinks();
  }

  async function deleteLink(code) {
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      setLinks((prev) => prev.filter((link) => link.code !== code));
      setMessage("Link deleted.");
    } catch (err) {
      setError("Failed to delete link. Please try again.");
    }
  }

  async function copy(code) {
    setError("");
    setMessage("");
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "";
    const shortUrl = `${origin}/${code}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shortUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setMessage("Short link copied!");
    } catch (err) {
      setError("Unable to copy link.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8 w-full">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          TinyLink Dashboard
        </h1>

        {/* Create Link Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Create a new short link
          </h2>

          <form onSubmit={createLink} className="space-y-4">
            <input
              type="text"
              placeholder="Enter long URL (https://...)"
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />

            <input
              type="text"
              placeholder="Custom short code"
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Link"}
            </button>

            {error && <p className="text-red-600">{error}</p>}
            {message && <p className="text-green-600">{message}</p>}
          </form>
        </div>

        {/* Links List */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">All Links</h2>

          {links.length === 0 ? (
            <div className="p-6 text-gray-500 bg-white border rounded-2xl text-center shadow-sm">
              No links yet. Create one above!
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((item) => (
                <div
                  key={item.code}
                  className="bg-white p-5 sm:p-6 border rounded-2xl shadow-sm hover:shadow-md transition flex flex-col gap-4 sm:flex-row sm:items-start overflow-hidden w-full max-w-full"
                >
                  <div className="space-y-2 flex-1 min-w-0 pr-0 sm:pr-4">
                    <a
                      href={`/${item.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:underline break-all block"
                    >
                      {baseUrl ? `${baseUrl}/${item.code}` : `/${item.code}`}
                    </a>

                    <p className="text-sm text-gray-600 break-words overflow-wrap-anywhere">
                      → {item.target_url}
                    </p>

                    <p className="text-xs text-gray-500">
                      Clicks: <b>{item.clicks}</b> ·{" "}
                      Last clicked:{" "}
                      {item.last_clicked
                        ? new Date(item.last_clicked).toLocaleString()
                        : "Never"}
                    </p>

                    <a
                      href={`/stats/${item.code}`}
                      className="text-sm text-purple-600 hover:underline inline-block"
                    >
                      View stats →
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => copy(item.code)}
                      className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition whitespace-nowrap flex-shrink-0"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => deleteLink(item.code)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition whitespace-nowrap flex-shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
