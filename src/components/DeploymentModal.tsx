import React from "react";
import {
  X,
  GitBranch,
  Clock,
  User,
  FileText,
  Tag,
  CheckCircle,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import { DeploymentInfo } from "../types";
import { formatDateTime } from "../utils/formatDateTime";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deployment: DeploymentInfo | null;
  environment: string;
  componentName: string;
}

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

const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
  deployment,
  environment,
  componentName,
}) => {
  if (!isOpen || !deployment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full min-h-[200px] max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Deployment Details
            </h2>
            {/* Environment badge */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getEnvironmentColor(
                environment
              )} uppercase tracking-wide`}
            >
              {environment}
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
                <div className="flex items-center gap-2 mt-1">
                  {/* Version badge */}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700 font-mono">
                    <Tag className="h-4 w-4 mr-1 text-blue-400 dark:text-blue-300" />
                    {deployment.artifactVersion}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Environment
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getEnvironmentColor(
                      environment
                    )} uppercase tracking-wide`}
                  >
                    {environment}
                  </span>
                </div>
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
                    {formatDateTime(deployment.deployedAt)}
                  </p>
                </div>
              </div>
              {deployment.changeNumber && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Change Number
                  </label>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-300" />
                    <p className="text-lg text-gray-900 dark:text-white">
                      {deployment.changeNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deployment.branchUrl && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Artifact/Branch
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={deployment.branchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span className="truncate max-w-[160px]">
                      {deployment.branchUrl}
                    </span>
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            )}
            {deployment.gitCommitUrl && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Git Commit
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={deployment.gitCommitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1"
                  >
                    <GitBranch className="h-4 w-4" />
                    <span className="truncate max-w-[120px]">
                      {deployment.gitCommitUrl}
                    </span>
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Build Number */}
          {deployment.buildNumber && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2 block">
                Build Number
              </label>
              <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white">
                  {deployment.buildNumber}
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
            {deployment.jiraTicketId && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Jira Ticket
                </label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {deployment.jiraTicketId}
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
            {deployment.branchUrl && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Branch URL
                </label>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <p className="text-gray-900 dark:text-white font-mono">
                    {deployment.branchUrl}
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
