import React from "react";

const Legend: React.FC = () => {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        Legend
      </h3>
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              v1.0.0
            </span>
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </div>
          <span>Recent deployment (within 24 hours)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 dark:text-gray-500 text-lg">—</span>
          <span>No deployment in this environment</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
            v1.0.0
          </button>
          <span>Click version for details, component name for history</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
