import React from "react";
import {
  Clock,
  User,
  GitBranch,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { DeploymentHistory } from "../types";
import { formatDateTime } from "../utils/formatDateTime";

interface DeploymentHistoryItemProps {
  deployment: DeploymentHistory;
  timezone: string;
  onDeploymentClick?: (
    deployment: DeploymentHistory,
    environment: string
  ) => void;
}

const DeploymentHistoryItem: React.FC<DeploymentHistoryItemProps> = ({
  deployment,
  timezone,
  onDeploymentClick,
}) => {
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
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getStatusIcon(deployment.status)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`text-lg font-semibold font-mono cursor-pointer transition-colors ${
                  onDeploymentClick
                    ? "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    : "text-gray-900 dark:text-white"
                }`}
                onClick={() =>
                  onDeploymentClick?.(
                    deployment,
                    deployment.envName || "unknown"
                  )
                }
              >
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
                <span>{formatDateTime(deployment.deployedAt, timezone)}</span>
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
};

export default DeploymentHistoryItem;
