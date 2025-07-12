import React, { useState, useEffect } from "react";
import { Search, Filter, ExternalLink, Sun, Moon } from "lucide-react";
import { ComponentData, Theme } from "./types";
import { DeploymentHistory } from "./types";
import { getComponents, getComponentHistory, getEims } from "./data/mockData";
import DeploymentModal from "./components/DeploymentModal";
import ComponentHistory from "./components/ComponentHistory";
import { useParams, useNavigate } from "react-router-dom";

const environments = ["dev", "qa", "uat", "prod"];

const getEnvironmentColor = (env: string, darkMode = false): string => {
  if (darkMode) {
    switch (env) {
      case "dev":
        return "dark:bg-yellow-900/30";
      case "qa":
        return "dark:bg-blue-900/30";
      case "uat":
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

const formatDateTime = (date?: string, time?: string): string => {
  if (!date) return "";
  if (!time) return date;
  return `${date} at ${time}`;
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
              <span>{deployment.version}</span>
            </div>
            {deployment.jiraTicket && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Ticket:</span>
                <span>{deployment.jiraTicket}</span>
              </div>
            )}
            {(deployment.deployedAt || deployment.deployedTime) && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Deployed:</span>
                <span>
                  {formatDateTime(
                    deployment.deployedAt,
                    deployment.deployedTime
                  )}
                </span>
              </div>
            )}
            {deployment.deployedBy && (
              <div className="flex items-center gap-1">
                <span className="font-medium">By:</span>
                <span>{deployment.deployedBy}</span>
              </div>
            )}
            {deployment.artifactUrl && (
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
  const [eims, setEims] = useState<{ number: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getComponents(eimName),
      getComponentHistory(eimName),
      getEims(eimName),
    ])
      .then(([components, history, eims]) => {
        setComponents(components);
        setComponentHistory(history);
        setEims(eims);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [eimName]);

  // Filter components by search term only (EIM filtering is now done in the API)
  const filteredData = components.filter((component: ComponentData) => {
    const matchesSearch = component.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
        />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          {/* Header with theme toggle */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                Release Tracker Dashboard
              </h1>
              <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
            {eimName &&
              (() => {
                const eim = eims.find(
                  (e: (typeof eims)[number]) => e.name === eimName
                );
                if (!eim) return null;
                return (
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm min-w-[220px] justify-end">
                    <div className="flex flex-col text-right">
                      <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                        {eim.number}
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300">
                        {eim.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
          </div>

          {/* Back to EIM Search */}
          {eimName && (
            <button
              className="mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
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
                  {filteredData.map(
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
                                  <div className="relative">
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
                                      {deployment.version}
                                    </button>
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
          />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
