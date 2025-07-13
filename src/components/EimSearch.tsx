import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchEims } from "../data/mockData";
import { Search, Sun, Moon } from "lucide-react";
import { Theme, Eim } from "../types";
import { useDebounce } from "../hooks/useDebounce";

const EimSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Eim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light";
  });
  const navigate = useNavigate();

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Search effect using debounced search term
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchEims(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching EIMs:", error);
        setError("Failed to search EIMs");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const handleSelect = (eimName: string) => {
    navigate(`/dashboard/${encodeURIComponent(eimName)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-200">
      {/* App Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg mb-2">
          Release Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-xl mx-auto">
          Select an{" "}
          <span className="font-semibold text-blue-700 dark:text-blue-400">
            EIM
          </span>{" "}
          to view deployments and component history
        </p>
      </div>
      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Select EIM
          </h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search EIM number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
            autoFocus
            autoComplete="off"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600 max-h-60 overflow-y-auto">
          {loading && (
            <li className="py-3 text-gray-400 dark:text-gray-500 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Searching...</span>
              </div>
            </li>
          )}
          {error && (
            <li className="py-3 text-red-400 dark:text-red-400 text-center">
              <div className="flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </li>
          )}
          {!loading &&
            !error &&
            searchResults.length === 0 &&
            debouncedSearchTerm.trim() && (
              <li className="py-3 text-gray-400 dark:text-gray-500 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span>🔍</span>
                  <span>No EIM found for "{debouncedSearchTerm}"</span>
                  <span className="text-xs">Try a different search term</span>
                </div>
              </li>
            )}
          {!loading && !error && searchResults.length > 0 && (
            <li className="py-2 px-2 text-xs text-gray-500 dark:text-gray-400 text-center border-b border-gray-200 dark:border-gray-600">
              Found {searchResults.length} EIM
              {searchResults.length !== 1 ? "s" : ""}
            </li>
          )}
          {!loading &&
            !error &&
            searchResults.map((eim) => (
              <li key={eim.id}>
                <button
                  className="w-full text-left py-3 px-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 flex flex-col items-start group"
                  onClick={() => handleSelect(eim.id.toString())}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-base font-semibold group-hover:underline">
                      {eim.eimNumber}
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
                      ID: {eim.id}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {eim.name}
                  </span>
                  {eim.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                      {eim.description}
                    </span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default EimSearch;
