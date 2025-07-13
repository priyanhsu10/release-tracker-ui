import React from "react";
import { Search, Filter } from "lucide-react";
import { ComponentData } from "../types";
import { formatDateTime } from "../utils/formatDateTime";
import Tooltip from "./Tooltip";

interface ComponentTableProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedEnvironment: string;
  setSelectedEnvironment: (env: string) => void;
  environments: string[];
  paginatedData: ComponentData[];
  handleComponentClick: (component: ComponentData) => void;
  handleVersionClick: (
    deployment: ComponentData["deployments"][string],
    environment: string,
    componentName: string
  ) => void;
  timezone: string;
  isRecentDeployment: (deployedAt?: string) => boolean;
  getEnvironmentTextColor: (env: string, darkMode?: boolean) => string;
}

const ComponentTable: React.FC<ComponentTableProps> = ({
  searchTerm,
  setSearchTerm,
  selectedEnvironment,
  setSelectedEnvironment,
  environments,
  paginatedData,
  handleComponentClick,
  handleVersionClick,
  timezone,
  isRecentDeployment,
  getEnvironmentTextColor,
}) => {
  return (
    <>
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Environments</option>
              {environments.map((env: string) => (
                <option key={env} value={env}>
                  {env.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 min-w-[200px]">
                  Component
                </th>
                {environments.map((env: string) => (
                  <th
                    key={env}
                    className={`text-center py-4 px-6 font-semibold text-gray-900 dark:text-white min-w-[120px] bg-inherit`}
                  >
                    {env.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.map((component: ComponentData, index: number) => (
                <tr
                  key={component.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50/50 dark:bg-gray-800/50"
                  }`}
                >
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white sticky left-0 bg-inherit z-10 border-r border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleComponentClick(component)}
                      className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <div>
                        <div className="font-semibold">{component.name}</div>
                        {component.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {component.description}
                          </div>
                        )}
                      </div>
                    </button>
                  </td>
                  {environments.map((env: string) => {
                    const deployment = component.deployments[env];
                    // Only colored text in dark mode
                    const envText = getEnvironmentTextColor(env);
                    const envTextDark =
                      {
                        dev: "dark:text-yellow-300",
                        qa: "dark:text-blue-300",
                        uat: "dark:text-purple-300",
                        prod: "dark:text-green-300",
                      }[env] || "dark:text-gray-200";
                    return (
                      <td
                        key={env}
                        className={`py-4 px-6 text-center border-r border-gray-100 dark:border-gray-700 bg-inherit dark:bg-gray-800`}
                      >
                        {deployment ? (
                          <Tooltip deployment={deployment}>
                            <div className="relative flex flex-col items-center">
                              <button
                                onClick={() =>
                                  handleVersionClick(
                                    deployment,
                                    env,
                                    component.name
                                  )
                                }
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${envText} ${envTextDark} bg-white/70 dark:bg-gray-700 hover:bg-white/90 dark:hover:bg-gray-600 transition-colors`}
                              >
                                {deployment.artifactVersion}
                              </button>
                              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDateTime(
                                  deployment.deployedAt,
                                  timezone
                                )}
                              </span>
                              {isRecentDeployment(deployment.deployedAt) && (
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                              )}
                            </div>
                          </Tooltip>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-lg">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ComponentTable;
