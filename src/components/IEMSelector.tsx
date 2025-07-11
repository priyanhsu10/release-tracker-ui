import React, { useState } from 'react';
import { Search, Server, MapPin, Activity, Users, Calendar, ChevronRight } from 'lucide-react';
import { IEM } from '../types';

interface IEMSelectorProps {
  iems: IEM[];
  onSelectIEM: (iem: IEM) => void;
}

const IEMSelector: React.FC<IEMSelectorProps> = ({ iems, onSelectIEM }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const filteredIEMs = iems.filter(iem => {
    const matchesSearch = iem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         iem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         iem.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || iem.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'inactive': return <Activity className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const regions = [...new Set(iems.map(iem => iem.region))];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integration Environment Management</h1>
          <p className="text-gray-600">Select an IEM to view its release tracker dashboard</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search IEMs by name, description, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* IEM Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIEMs.map((iem) => (
            <div
              key={iem.id}
              onClick={() => onSelectIEM(iem)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Server className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {iem.name}
                    </h3>
                    <p className="text-sm text-gray-500">{iem.region}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <p className="text-gray-600 mb-4 text-sm">{iem.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(iem.status)}
                    <span className="text-sm font-medium text-gray-700">Status</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(iem.status)}`}>
                    {iem.status.charAt(0).toUpperCase() + iem.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Components</span>
                  </div>
                  <span className="text-sm text-gray-900 font-medium">{iem.componentCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                  </div>
                  <span className="text-sm text-gray-900">{iem.lastUpdated}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                  <span>View Release Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIEMs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No IEMs Found</h3>
            <p className="text-gray-600">
              No Integration Environment Management systems match your search criteria.
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-green-500" />
              <h3 className="font-medium text-gray-900">Active IEMs</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {iems.filter(iem => iem.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-900">Total Components</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {iems.reduce((sum, iem) => sum + iem.componentCount, 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium text-gray-900">Regions</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {regions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IEMSelector;