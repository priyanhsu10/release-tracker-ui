// Utility to extract and format date and time from an ISO string
export function extractDateTime(isoString?: string | null): {
  date: string;
  time: string;
} {
  if (!isoString) return { date: "", time: "" };
  const [date, timeWithMs] = isoString.split("T");
  const time = timeWithMs ? timeWithMs.split(".")[0] : "";
  return { date, time };
}

export function formatDateTime(
  isoString?: string | null,
  timezone?: string
): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (timezone) {
      // Use toLocaleString with timezone
      return date.toLocaleString("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
    // fallback: show as local
    return date.toLocaleString("en-US", { hour12: false });
  } catch {
    // fallback to old logic
    const { date, time } = extractDateTime(isoString);
    if (!date) return "";
    return time ? `${date} at ${time}` : date;
  }
}
