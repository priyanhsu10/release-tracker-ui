import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockEims } from "../data/mockData";
import { Search } from "lucide-react";

const EimSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Search by EIM number or name
  const filteredEIMList = mockEims.filter(
    (eim) =>
      eim.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (eimName: string) => {
    navigate(`/dashboard/${encodeURIComponent(eimName)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* App Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg mb-2">
          Release Tracker
        </h1>
        <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">
          Select an <span className="font-semibold text-blue-700">EIM</span> to
          view deployments and component history
        </p>
      </div>
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Select EIM
        </h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search EIM number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
          />
        </div>
        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
          {filteredEIMList.length === 0 && (
            <li className="py-2 text-gray-400 text-center">No EIM found</li>
          )}
          {filteredEIMList.map((eim) => (
            <li key={eim.number}>
              <button
                className="w-full text-left py-2 px-2 hover:bg-blue-50 rounded transition-colors font-medium text-blue-700 hover:text-blue-900 flex flex-col items-start"
                onClick={() => handleSelect(eim.name)}
              >
                <span className="text-base font-semibold">{eim.number}</span>
                <span className="text-sm text-gray-700">{eim.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EimSearch;
