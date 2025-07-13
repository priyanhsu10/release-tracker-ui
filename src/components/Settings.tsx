import React, { useEffect, useState } from "react";

const getTimezones = () => {
  // Use a static list for compatibility
  return [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
};

const Settings: React.FC = () => {
  const [timezone, setTimezone] = useState<string>(
    () => localStorage.getItem("timezone") || "UTC"
  );
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("timezone", timezone);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const timezones = getTimezones();
  const formatted = now.toLocaleString("en-US", {
    timeZone: timezone,
    hour12: false,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Settings
        </h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Current time in {timezone}:</span>
          <span className="ml-2 font-mono">{formatted}</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
