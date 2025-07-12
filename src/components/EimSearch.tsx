import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchEims } from "../data/mockData";
import { Search, Sun, Moon } from "lucide-react";
import { Theme, Eim } from "../types";

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

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchEims(searchTerm);
        setSearchResults(results);
      } catch (err) {
        setError("Failed to search EIMs");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
          />
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600 max-h-60 overflow-y-auto">
          {loading && (
            <li className="py-2 text-gray-400 dark:text-gray-500 text-center">
              Searching...
            </li>
          )}
          {error && (
            <li className="py-2 text-red-400 dark:text-red-400 text-center">
              {error}
            </li>
          )}
          {!loading &&
            !error &&
            searchResults.length === 0 &&
            searchTerm.trim() && (
              <li className="py-2 text-gray-400 dark:text-gray-500 text-center">
                No EIM found
              </li>
            )}
          {!loading &&
            !error &&
            searchResults.map((eim) => (
              <li key={eim.id}>
                <button
                  className="w-full text-left py-2 px-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors font-medium text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 flex flex-col items-start"
                  onClick={() => handleSelect(eim.id.toString())}
                >
                  <span className="text-base font-semibold">
                    {eim.eimNumber}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {eim.name}
                  </span>
                  {eim.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
