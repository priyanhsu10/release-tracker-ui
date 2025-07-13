import React from "react";
import { Sun, Moon, RefreshCw } from "lucide-react";
import { Theme, Eim } from "../types";

interface DashboardHeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  isRefreshing: boolean;
  handleRefresh: () => void;
  eimName?: string;
  currentEim: Eim | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  theme,
  toggleTheme,
  isRefreshing,
  handleRefresh,
  eimName,
  currentEim,
}) => {
  return (
    <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0 truncate">
          Release Tracker Dashboard
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-2"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh data"
        >
          <RefreshCw
            className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
      {/* Compact EIM Info Block on the right */}
      {eimName && (
        <div className="flex-shrink-0 min-w-[220px] max-w-xs ml-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 shadow-sm">
            {currentEim ? (
              <div className="flex flex-col text-right">
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200 truncate">
                  {currentEim.name}
                </span>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                  {currentEim.eimNumber}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {currentEim.description}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end min-h-[60px] justify-center">
                <span className="text-base font-bold text-blue-900 dark:text-blue-100 mb-1">
                  EIM Not Found
                </span>
                <span className="text-xs text-blue-800 dark:text-blue-200">
                  No info for: <span className="font-mono">{eimName}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
