import React from "react";
import {
  X,
  ExternalLink,
  GitBranch,
  Clock,
  User,
  FileText,
  Tag,
  CheckCircle,
} from "lucide-react";
import { DeploymentInfo } from "../types";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deployment: DeploymentInfo | null;
  environment: string;
  componentName: string;
}

const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
  deployment,
  environment,
  componentName,
}) => {
  if (!isOpen || !deployment) return null;

  const formatDateTime = (date?: string, time?: string): string => {
    if (!date) return "";
    if (!time) return date;
    return `${date} at ${time}`;
  };

  const getEnvironmentColor = (env: string, isDarkMode = false): string => {
    switch (env) {
      case "dev":
        return isDarkMode
          ? "text-yellow-300"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "qa":
        return isDarkMode
          ? "text-blue-300"
          : "bg-blue-100 text-blue-800 border-blue-200";
      case "uat":
        return isDarkMode
          ? "text-purple-300"
          : "bg-purple-100 text-purple-800 border-purple-200";
      case "prod":
        return isDarkMode
          ? "text-green-300"
          : "bg-green-100 text-green-800 border-green-200";
      default:
        return isDarkMode
          ? "text-gray-300"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full min-h-[200px] max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Deployment Details
            </h2>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getEnvironmentColor(
                environment
              )} dark:border-0 dark:${getEnvironmentColor(
                environment,
                true
              )} dark:bg-transparent dark:text-${environment}-300`}
            >
              {environment.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Component
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {componentName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Version
                </label>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <p className="text-lg font-mono text-gray-900 dark:text-white">
                    {deployment.version}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Environment
                </label>
                <p className="text-lg text-gray-900 dark:text-white capitalize">
                  {environment}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Deployed By
                </label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <p className="text-lg text-gray-900 dark:text-white">
                    {deployment.deployedBy}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Deployed At
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <p className="text-lg text-gray-900 dark:text-white">
                    {formatDateTime(
                      deployment.deployedAt,
                      deployment.deployedTime
                    )}
                  </p>
                </div>
              </div>
              {deployment.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Approved By
                  </label>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-300" />
                    <p className="text-lg text-gray-900 dark:text-white">
                      {deployment.approvedBy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Release Summary */}
          {deployment.releaseSummary && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2 block">
                Release Summary
              </label>
              <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white">
                  {deployment.releaseSummary}
                </p>
              </div>
            </div>
          )}

          {/* Release Notes */}
          {deployment.releaseNotes && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2 block">
                Release Notes
              </label>
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-400 dark:text-gray-300 mt-0.5" />
                  <p className="text-gray-900 dark:text-white">
                    {deployment.releaseNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deployment.jiraTicket && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Jira Ticket
                </label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {deployment.jiraTicket}
                </p>
              </div>
            )}
            {deployment.buildNumber && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Build Number
                </label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {deployment.buildNumber}
                </p>
              </div>
            )}
            {deployment.gitBranch && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Git Branch
                </label>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <p className="text-gray-900 dark:text-white font-mono">
                    {deployment.gitBranch}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Links
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {deployment.artifactUrl && (
                <a
                  href={deployment.artifactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-white">
                    View Artifact
                  </span>
                </a>
              )}
              {deployment.gitCommitUrl && (
                <a
                  href={deployment.gitCommitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <GitBranch className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-white">
                    View Commit
                  </span>
                </a>
              )}
              {deployment.rollbackUrl && (
                <a
                  href={deployment.rollbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-red-400 dark:text-red-300" />
                  <span className="text-red-900 dark:text-red-200">
                    Rollback Options
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentModal;
