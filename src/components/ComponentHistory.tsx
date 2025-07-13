import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentData, DeploymentHistory } from "../types";
import ComponentHistoryHeader from "./ComponentHistoryHeader";
import ComponentHistoryFilters from "./ComponentHistoryFilters";
import DeploymentHistoryItem from "./DeploymentHistoryItem";
import ComponentHistoryStats from "./ComponentHistoryStats";
import {
  filterDeploymentHistory,
  computeEnvironments,
} from "../utils/componentHistoryHelpers";

interface ComponentHistoryProps {
  component: ComponentData;
  history: DeploymentHistory[];
  onBack: () => void;
  timezone: string;
  onDeploymentClick?: (
    deployment: DeploymentHistory,
    environment: string
  ) => void;
}

const ComponentHistory: React.FC<ComponentHistoryProps> = ({
  component,
  history,
  onBack,
  timezone,
  onDeploymentClick,
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredHistory = filterDeploymentHistory(
    history,
    selectedEnvironment,
    selectedStatus,
    startDate,
    endDate
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedEnvironment, selectedStatus, startDate, endDate]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const clearAllFilters = () => {
    setSelectedEnvironment("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Dynamically compute all unique environments from history data
  const environments = React.useMemo(
    () => computeEnvironments(history),
    [history]
  );

  const statuses = ["success", "failed", "rollback"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ComponentHistoryHeader
          component={component}
          environments={environments}
          onBack={onBack}
        />

        {/* Filters */}
        <ComponentHistoryFilters
          selectedEnvironment={selectedEnvironment}
          setSelectedEnvironment={setSelectedEnvironment}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          environments={environments}
          statuses={statuses}
          clearAllFilters={clearAllFilters}
        />

        {/* Deployment History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Deployment History
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredHistory.length)} of{" "}
                  {filteredHistory.length} deployments
                  {filteredHistory.length !== history.length &&
                    ` (filtered from ${history.length} total)`}
                </p>
              </div>

              {/* Top Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No deployments found matching the selected filters.
              </div>
            ) : (
              paginatedHistory.map((deployment) => (
                <DeploymentHistoryItem
                  key={deployment.id}
                  deployment={deployment}
                  timezone={timezone}
                  onDeploymentClick={onDeploymentClick}
                />
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages >= 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {totalPages === 1
                    ? "All deployments shown (no pagination needed)"
                    : `Page ${currentPage} of ${totalPages}`}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                currentPage === pageNum
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <ComponentHistoryStats history={history} />
      </div>
    </div>
  );
};

export default ComponentHistory;
