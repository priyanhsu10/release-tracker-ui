import React from "react";

interface TimezoneSelectorProps {
  timezone: string;
  setTimezone: (timezone: string) => void;
  currentTime: Date;
  formatCurrentTime: (date: Date, tz: string) => string;
  eimName?: string;
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  timezone,
  setTimezone,
  currentTime,
  formatCurrentTime,
  eimName,
}) => {
  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Asia/Hong_Kong",
    "Australia/Sydney",
  ];

  if (!eimName) return null;

  return (
    <div className="mb-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Timezone:
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Time:
        </span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white">
          {formatCurrentTime(currentTime, timezone)}
        </span>
      </div>
    </div>
  );
};

export default TimezoneSelector;
