import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { ComponentData } from "../types";
import { formatDateTime } from "../utils/formatDateTime";

interface TooltipProps {
  deployment: ComponentData["deployments"][string];
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ deployment, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!deployment) return <>{children}</>;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="font-medium">Version:</span>
              <span>{deployment.artifactVersion}</span>
            </div>
            {deployment.jiraTicketId && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Ticket:</span>
                <span>{deployment.jiraTicketId}</span>
              </div>
            )}
            {(deployment.deployedAt || deployment.deployedTime) && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Deployed:</span>
                <span>{formatDateTime(deployment.deployedAt)}</span>
              </div>
            )}
            {deployment.deployedBy && (
              <div className="flex items-center gap-1">
                <span className="font-medium">By:</span>
                <span>{deployment.deployedBy}</span>
              </div>
            )}
            {deployment.branchUrl && (
              <div className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                <span className="text-blue-300">View Artifact</span>
              </div>
            )}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
