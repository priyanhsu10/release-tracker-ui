import React from "react";
import { CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import { DeploymentHistory } from "../types";

interface ComponentHistoryStatsProps {
  history: DeploymentHistory[];
}

const ComponentHistoryStats: React.FC<ComponentHistoryStatsProps> = ({
  history,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Successful Deployments
          </h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {history.filter((d) => d.status === "success").length}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Failed Deployments
          </h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {history.filter((d) => d.status === "failed").length}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <RotateCcw className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Rollbacks
          </h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {history.filter((d) => d.status === "rollback").length}
        </p>
      </div>
    </div>
  );
};

export default ComponentHistoryStats;
