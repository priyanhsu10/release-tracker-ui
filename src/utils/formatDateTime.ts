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

export function formatDateTime(isoString?: string | null): string {
  const { date, time } = extractDateTime(isoString);
  if (!date) return "";
  return time ? `${date} at ${time}` : date;
}
