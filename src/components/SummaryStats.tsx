import React from "react";
import { ComponentData } from "../types";

interface SummaryStatsProps {
  environments: string[];
  filteredData: ComponentData[];
  isRecentDeployment: (deployedAt?: string) => boolean;
  getEnvironmentColor: (env: string, darkMode?: boolean) => string;
  getEnvironmentTextColor: (env: string, darkMode?: boolean) => string;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({
  environments,
  filteredData,
  isRecentDeployment,
  getEnvironmentColor,
  getEnvironmentTextColor,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {environments.map((env: string) => {
        const deployedCount = filteredData.filter(
          (component: ComponentData) => component.deployments[env]
        ).length;
        const recentCount = filteredData.filter(
          (component: ComponentData) =>
            component.deployments[env] &&
            isRecentDeployment(component.deployments[env]?.deployedAt)
        ).length;
        const totalCount = filteredData.length;
        const percentage =
          totalCount > 0 ? Math.round((deployedCount / totalCount) * 100) : 0;
        const envTextDark =
          {
            dev: "dark:text-yellow-300",
            qa: "dark:text-blue-300",
            uat: "dark:text-purple-300",
            prod: "dark:text-green-300",
          }[env] || "dark:text-gray-200";
        return (
          <div
            key={env}
            className={`rounded-lg p-4 ${getEnvironmentColor(
              env
            )} dark:bg-gray-800`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium text-gray-600 ${envTextDark}`}
                >
                  {env.toUpperCase()}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {deployedCount}/{totalCount}
                </p>
                {recentCount > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {recentCount} recent deployment
                    {recentCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div
                className={`text-sm font-medium ${getEnvironmentTextColor(
                  env
                )} ${envTextDark}`}
              >
                {percentage}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryStats;
