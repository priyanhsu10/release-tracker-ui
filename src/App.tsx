import React, { useState, useEffect } from "react";
import { ComponentData, Theme, Eim } from "./types";
import { DeploymentHistory } from "./types";
import { getComponents, getComponentHistory, getEims } from "./data/mockData";
import DeploymentModal from "./components/DeploymentModal";
import ComponentHistory from "./components/ComponentHistory";
import ComponentTable from "./components/ComponentTable";
import SummaryStats from "./components/SummaryStats";
import Legend from "./components/Legend";
import Pagination from "./components/Pagination";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEnvironmentColor,
  getEnvironmentTextColor,
  isRecentDeployment,
} from "./utils/helpers";
import { Moon, Sun, RefreshCw } from "lucide-react";

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

          {/* Component Table */}
          <ComponentTable
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedEnvironment={selectedEnvironment}
            setSelectedEnvironment={setSelectedEnvironment}
            environments={environments}
            paginatedData={paginatedData}
            handleComponentClick={handleComponentClick}
            handleVersionClick={handleVersionClick}
            timezone={timezone}
            isRecentDeployment={isRecentDeployment}
            getEnvironmentTextColor={getEnvironmentTextColor}
          />

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredData.length}
            goToPage={goToPage}
          />

          {/* Summary Stats */}
          <SummaryStats
            environments={environments}
            filteredData={filteredData}
            isRecentDeployment={isRecentDeployment}
            getEnvironmentColor={getEnvironmentColor}
            getEnvironmentTextColor={getEnvironmentTextColor}
          />

          {/* Legend */}
          <Legend />

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
