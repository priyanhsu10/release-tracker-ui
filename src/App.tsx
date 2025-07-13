import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ExternalLink,
  Sun,
  Moon,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ComponentData, Theme, Eim } from "./types";
import { DeploymentHistory } from "./types";
import { getComponents, getComponentHistory, getEims } from "./data/mockData";
import DeploymentModal from "./components/DeploymentModal";
import ComponentHistory from "./components/ComponentHistory";
import { useParams, useNavigate } from "react-router-dom";
import { formatDateTime } from "./utils/formatDateTime";

const getEnvironmentColor = (env: string, darkMode = false): string => {
  if (darkMode) {
    switch (env) {
      case "dev":
        return "dark:bg-yellow-900/30";
      case "qa":
        return "dark:bg-blue-900/30";
      case "uat":
        return "dark:bg-purple-900/30";
      case "fut":
        return "dark:bg-purple-900/30";
      case "prod":
        return "dark:bg-green-900/30";
      default:
        return "dark:bg-gray-800/30";
    }
  } else {
    switch (env) {
      case "dev":
        return "bg-yellow-50 border-yellow-200";
      case "qa":
        return "bg-blue-50 border-blue-200";
      case "uat":
        return "bg-purple-50 border-purple-200";
      case "prod":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  }
};

const getEnvironmentTextColor = (env: string, darkMode = false): string => {
  if (darkMode) {
    switch (env) {
      case "dev":
        return "dark:text-yellow-200";
      case "qa":
        return "dark:text-blue-200";
      case "uat":
        return "dark:text-purple-200";
      case "prod":
        return "dark:text-green-200";
      default:
        return "dark:text-gray-200";
    }
  } else {
    switch (env) {
      case "dev":
        return "text-yellow-700";
      case "qa":
        return "text-blue-700";
      case "uat":
        return "text-purple-700";
      case "prod":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  }
};

const isRecentDeployment = (deployedAt?: string): boolean => {
  if (!deployedAt) return false;
  const deployDate = new Date(deployedAt);
  const now = new Date();
  const diffInHours = (now.getTime() - deployDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

const Tooltip: React.FC<{
  deployment: ComponentData["deployments"][string];
  children: React.ReactNode;
}> = ({ deployment, children }) => {
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

// Theme context
const ThemeContext = React.createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);

function App() {
  const { eimName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentData | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    deployment: ComponentData["deployments"][string] | null;
    environment: string;
    componentName: string;
  }>({
    isOpen: false,
    deployment: null,
    environment: "",
    componentName: "",
  });

  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light";
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // New state for async data
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [componentHistory, setComponentHistory] = useState<
    Record<string, DeploymentHistory[]>
  >({});
  const [currentEim, setCurrentEim] = useState<Eim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>(
    () => localStorage.getItem("timezone") || "UTC"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Reduced from 10 to make pagination more visible

  useEffect(() => {
    localStorage.setItem("timezone", timezone);
  }, [timezone]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Asia/Hong_Kong",
    "Australia/Sydney",
  ];

  const fetchData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const [components, history, eims] = await Promise.all([
        getComponents(eimName),
        getComponentHistory(eimName),
        getEims(eimName),
      ]);

      setComponents(components);
      setComponentHistory(history);

      // Set current EIM if we have EIM data and eimName
      if (eimName && eims.length > 0) {
        const foundEim = eims.find((e: Eim) => e.id === Number(eimName));
        setCurrentEim(foundEim || null);
      } else {
        setCurrentEim(null);
      }

      setLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eimName]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(false);
  };

  // Format current time in selected timezone
  const formatCurrentTime = (date: Date, tz: string): string => {
    try {
      return date.toLocaleTimeString("en-US", {
        timeZone: tz,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      // Fallback to UTC if timezone is invalid
      return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
  };

  // Filter components by search term and selected environment
  const filteredData = components.filter((component: ComponentData) => {
    const matchesSearch = component.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesEnv =
      !selectedEnvironment || component.deployments[selectedEnvironment];
    return matchesSearch && matchesEnv;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedEnvironment]);

  // Calculate pagination for component table
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Dynamically compute all unique environments from components data, always including standard ones
  const environments = React.useMemo(() => {
    const standard = ["dev", "qa", "uat", "prod"];
    const envSet = new Set<string>(standard);
    components.forEach((component) => {
      Object.keys(component.deployments).forEach((env) => {
        if (component.deployments[env]) {
          envSet.add(env);
        }
      });
    });
    // Standard environments in order, then any others
    const others = Array.from(envSet).filter((env) => !standard.includes(env));
    return [...standard, ...others];
  }, [components]);

  const handleVersionClick = (
    deployment: ComponentData["deployments"][string],
    environment: string,
    componentName: string
  ) => {
    setModalState({
      isOpen: true,
      deployment,
      environment,
      componentName,
    });
  };

  const handleComponentClick = (component: ComponentData) => {
    setSelectedComponent(component);
  };

  const handleBackToDashboard = () => {
    setSelectedComponent(null);
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      deployment: null,
      environment: "",
      componentName: "",
    });
  };

  // Loading and error UI
  if (loading)
    return (
      <div className="p-8 text-center text-lg dark:bg-gray-900 dark:text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-600 dark:bg-gray-900 dark:text-red-400">
        {error}
      </div>
    );

  // Show component history if a component is selected
  if (selectedComponent) {
    const history = componentHistory[selectedComponent.id] || [];
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ComponentHistory
          component={selectedComponent}
          history={history}
          onBack={handleBackToDashboard}
          timezone={timezone}
          onDeploymentClick={(deployment, environment) => {
            setModalState({
              isOpen: true,
              deployment: deployment as ComponentData["deployments"][string],
              environment,
              componentName: selectedComponent.name,
            });
          }}
        />
        {/* Deployment Modal for Component History */}
        <DeploymentModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          deployment={modalState.deployment}
          environment={modalState.environment}
          componentName={modalState.componentName}
          timezone={timezone}
        />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          {/* Header with theme toggle and EIM info */}
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0 truncate">
                Release Tracker Dashboard
              </h1>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-2"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
            {/* Compact EIM Info Block on the right */}
            {eimName && (
              <div className="flex-shrink-0 min-w-[220px] max-w-xs ml-auto">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 shadow-sm">
                  {currentEim ? (
                    <div className="flex flex-col text-right">
                      <span className="text-lg font-bold text-blue-800 dark:text-blue-200 truncate">
                        {currentEim.name}
                      </span>
                      <span className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                        {currentEim.eimNumber}
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {currentEim.description}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end min-h-[60px] justify-center">
                      <span className="text-base font-bold text-blue-900 dark:text-blue-100 mb-1">
                        EIM Not Found
                      </span>
                      <span className="text-xs text-blue-800 dark:text-blue-200">
                        No info for:{" "}
                        <span className="font-mono">{eimName}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {eimName && (
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone:
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Time:
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white">
                  {formatCurrentTime(currentTime, timezone)}
                </span>
              </div>
            </div>
          )}

          {/* Back to EIM Search button below header */}
          {eimName && (
            <button
              className="mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap"
              onClick={() => navigate("/")}
            >
              ← Back to EIM Search
            </button>
          )}

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
                  {paginatedData.map(
                    (component: ComponentData, index: number) => (
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
                              <div className="font-semibold">
                                {component.name}
                              </div>
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
                                    {isRecentDeployment(
                                      deployment.deployedAt
                                    ) && (
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
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages >= 1 && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {totalPages === 1
                  ? `All ${filteredData.length} components shown (no pagination needed)`
                  : `Showing ${startIndex + 1}-${Math.min(
                      endIndex,
                      filteredData.length
                    )} of ${filteredData.length} components`}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
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
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
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
                totalCount > 0
                  ? Math.round((deployedCount / totalCount) * 100)
                  : 0;
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

          {/* Legend */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Legend
            </h3>
            <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    v1.0.0
                  </span>
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </div>
                <span>Recent deployment (within 24 hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 dark:text-gray-500 text-lg">
                  —
                </span>
                <span>No deployment in this environment</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                  v1.0.0
                </button>
                <span>
                  Click version for details, component name for history
                </span>
              </div>
            </div>
          </div>

          {/* Deployment Modal */}
          <DeploymentModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            deployment={modalState.deployment}
            environment={modalState.environment}
            componentName={modalState.componentName}
            timezone={timezone}
          />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
