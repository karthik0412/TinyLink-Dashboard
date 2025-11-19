"use client";

import { useState } from "react";

export default function CopyLinkButton({ shortUrl }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleCopy() {
    setError("");

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy");
    }
  }

  return (
    <div className="flex flex-col items-stretch sm:items-end gap-1 w-full sm:w-auto">
      <button
        type="button"
        onClick={handleCopy}
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

