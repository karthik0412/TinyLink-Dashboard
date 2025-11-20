"use client";

export default function FormattedDate({ date, fallback = "Never" }) {
  if (!date) {
    return <span>{fallback}</span>;
  }

  // Parse the date and format it using the user's local timezone
  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return <span>{formatted}</span>;
}

