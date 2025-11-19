"use client";

import { useState, useEffect } from "react";
import CopyLinkButton from "./CopyLinkButton";

export default function ShortLinkDisplay({ code }) {
  const [shortUrl, setShortUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location?.origin) {
      setShortUrl(`${window.location.origin}/${code}`);
    } else {
      setShortUrl(`/${code}`);
    }
  }, [code]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gray-100 px-4 py-3 rounded-xl">
      <span className="font-medium text-gray-800 break-words">
        {shortUrl}
      </span>
      <CopyLinkButton shortUrl={shortUrl} />
    </div>
  );
}

