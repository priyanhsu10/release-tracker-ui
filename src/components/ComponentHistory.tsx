import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  User,
  GitBranch,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Filter,
} from "lucide-react";
import { ComponentData, DeploymentHistory } from "../types";

interface ComponentHistoryProps {
  component: ComponentData;
  history: DeploymentHistory[];
  onBack: () => void;
}

const ComponentHistory: React.FC<ComponentHistoryProps> = ({
  component,
  history,
  onBack,
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const filteredHistory = history.filter((deployment) => {
    const envMatch =
      !selectedEnvironment ||
      deployment.envName?.toLowerCase() === selectedEnvironment.toLowerCase();
    const statusMatch = !selectedStatus || deployment.status === selectedStatus;
    return envMatch && statusMatch;
  });

  // Dynamically compute all unique environments from history data, always including standard ones
  const environments = React.useMemo(() => {
    const standard = ["dev", "qa", "uat", "prod"];
    const envSet = new Set<string>(standard);
    history.forEach((deployment) => {
      if (deployment.envName) {
        envSet.add(deployment.envName.toLowerCase());
      }
    });
    // Standard environments in order, then any others
    const others = Array.from(envSet).filter((env) => !standard.includes(env));
    return [...standard, ...others];
  }, [history]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "rollback":
        return <RotateCcw className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "rollback":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEnvironmentColor = (env: string): string => {
    const envLower = env?.toLowerCase();
    switch (envLower) {
      case "dev":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "qa":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "uat":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "prod":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDateTime = (date?: string, time?: string): string => {
    if (!date) return "Unknown date";
    if (!time) return date;
    return `${date} at ${time}`;
  };

  const statuses = ["success", "failed", "rollback"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {component?.name || "Unknown Component"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {component?.description || "No description available"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Owner: {component?.owner || "Unknown"}</span>
                  </div>
                  {component?.repository && (
                    <a
                      href={component.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400"
                    >
                      <GitBranch className="h-4 w-4" />
                      <span>Repository</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Current Deployments Summary */}
              <div className="flex gap-2">
                {environments.map((env) => {
                  const deployment = component?.deployments?.[env];
                  const envTextDark =
                    {
                      dev: "dark:text-yellow-300",
                      qa: "dark:text-blue-300",
                      uat: "dark:text-purple-300",
                      prod: "dark:text-green-300",
                    }[env] || "dark:text-gray-200";
                  return (
                    <div key={env} className="text-center">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${getEnvironmentColor(
                          env
                        )} ${envTextDark} dark:bg-transparent dark:border-0`}
                      >
                        {env.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {deployment?.artifactVersion || "\u2014"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Filters:
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Environments</option>
                {environments.map((env) => (
                  <option key={env} value={env}>
                    {env.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Deployment History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Deployment History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Showing {filteredHistory.length} of {history.length} deployments
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No deployments found matching the selected filters.
              </div>
            ) : (
              filteredHistory.map((deployment) => {
                const envName = deployment.envName?.toLowerCase() || "unknown";
                const envTextDark =
                  {
                    dev: "dark:text-yellow-300",
                    qa: "dark:text-blue-300",
                    uat: "dark:text-purple-300",
                    prod: "dark:text-green-300",
                  }[envName] || "dark:text-gray-200";
                const statusTextDark =
                  {
                    success: "dark:text-green-300",
                    failed: "dark:text-red-300",
                    rollback: "dark:text-orange-300",
                  }[deployment.status] || "dark:text-gray-200";
                return (
                  <div
                    key={deployment.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(deployment.status)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                              {deployment.artifactVersion || "Unknown Version"}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getEnvironmentColor(
                                deployment.envName || "unknown"
                              )} ${envTextDark} dark:bg-transparent dark:border-0`}
                            >
                              {(deployment.envName || "UNKNOWN").toUpperCase()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                deployment.status
                              )} ${statusTextDark} dark:bg-transparent dark:border-0`}
                            >
                              {deployment.status.charAt(0).toUpperCase() +
                                deployment.status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDateTime(
                                  deployment.deployedAt,
                                  deployment.deployedTime || undefined
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{deployment.deployedBy || "Unknown"}</span>
                            </div>
                            {deployment.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Duration: {deployment.duration}</span>
                              </div>
                            )}
                          </div>

                          {deployment.releaseNotes && (
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-3">
                              <p className="text-sm text-gray-700 dark:text-gray-200">
                                {deployment.releaseNotes}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                            {deployment.jiraTicketId && (
                              <span>Ticket: {deployment.jiraTicketId}</span>
                            )}
                            {deployment.branchUrl && (
                              <span className="flex items-center gap-1">
                                <GitBranch className="h-3 w-3" />
                                {deployment.branchUrl}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {deployment.gitCommitUrl && (
                          <a
                            href={deployment.gitCommitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="View Commit"
                          >
                            <GitBranch className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Summary Stats */}
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
      </div>
    </div>
  );
};

export default ComponentHistory;
