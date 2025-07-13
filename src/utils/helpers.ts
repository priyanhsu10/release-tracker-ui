export const getEnvironmentColor = (env: string, darkMode = false): string => {
  if (darkMode) {
    switch (env) {
      case "dev":
        return "dark:bg-yellow-900/30";
      case "qa":
        return "dark:bg-blue-900/30";
      case "uat":
        return "dark:bg-purple-900/30";
      case "fut":
        return "dark:bg-purple-900/30";
      case "prod":
        return "dark:bg-green-900/30";
      default:
        return "dark:bg-gray-800/30";
    }
  } else {
    switch (env) {
      case "dev":
        return "bg-yellow-50 border-yellow-200";
      case "qa":
        return "bg-blue-50 border-blue-200";
      case "uat":
        return "bg-purple-50 border-purple-200";
      case "prod":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  }
};

export const getEnvironmentTextColor = (
  env: string,
  darkMode = false
): string => {
  if (darkMode) {
    switch (env) {
      case "dev":
        return "dark:text-yellow-200";
      case "qa":
        return "dark:text-blue-200";
      case "uat":
        return "dark:text-purple-200";
      case "prod":
        return "dark:text-green-200";
      default:
        return "dark:text-gray-200";
    }
  } else {
    switch (env) {
      case "dev":
        return "text-yellow-700";
      case "qa":
        return "text-blue-700";
      case "uat":
        return "text-purple-700";
      case "prod":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  }
};

export const isRecentDeployment = (deployedAt?: string): boolean => {
  if (!deployedAt) return false;
  const deployDate = new Date(deployedAt);
  const now = new Date();
  const diffInHours = (now.getTime() - deployDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

export const formatCurrentTime = (date: Date, tz: string): string => {
  try {
    return date.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    // Fallback to UTC if timezone is invalid
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
};
