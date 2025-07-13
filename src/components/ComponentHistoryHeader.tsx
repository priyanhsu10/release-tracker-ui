import React from "react";
import { ArrowLeft, User, GitBranch, ExternalLink } from "lucide-react";
import { ComponentData } from "../types";

interface ComponentHistoryHeaderProps {
  component: ComponentData;
  environments: string[];
  onBack: () => void;
}

const ComponentHistoryHeader: React.FC<ComponentHistoryHeaderProps> = ({
  component,
  environments,
  onBack,
}) => {
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

  return (
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
  );
};

export default ComponentHistoryHeader;
