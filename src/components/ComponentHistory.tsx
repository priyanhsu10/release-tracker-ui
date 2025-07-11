import React, { useState } from 'react';
import { ArrowLeft, Clock, User, GitBranch, ExternalLink, AlertCircle, CheckCircle, RotateCcw, Filter } from 'lucide-react';
import { ComponentData, DeploymentHistory } from '../types';

interface ComponentHistoryProps {
  component: ComponentData;
  history: DeploymentHistory[];
  onBack: () => void;
}

const ComponentHistory: React.FC<ComponentHistoryProps> = ({ component, history, onBack }) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const filteredHistory = history.filter(deployment => {
    const envMatch = !selectedEnvironment || deployment.environment === selectedEnvironment;
    const statusMatch = !selectedStatus || deployment.status === selectedStatus;
    return envMatch && statusMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'rollback':
        return <RotateCcw className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rollback':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnvironmentColor = (env: string): string => {
    switch (env) {
      case 'dev': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qa': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'uat': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'prod': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (date: string, time: string): string => {
    return `${date} at ${time}`;
  };

  const environments = ['dev', 'qa', 'uat', 'prod'];
  const statuses = ['success', 'failed', 'rollback'];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{component.name}</h1>
                <p className="text-gray-600 mb-4">{component.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Owner: {component.owner}</span>
                  </div>
                  {component.repository && (
                    <a
                      href={component.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
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
                {environments.map(env => {
                  const deployment = component.deployments[env];
                  return (
                    <div key={env} className="text-center">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getEnvironmentColor(env)}`}>
                        {env.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {deployment ? deployment.version : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Environments</option>
                {environments.map(env => (
                  <option key={env} value={env}>
                    {env.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Deployment History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Deployment History</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredHistory.length} of {history.length} deployments
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No deployments found matching the selected filters.
              </div>
            ) : (
              filteredHistory.map((deployment) => (
                <div key={deployment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(deployment.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 font-mono">
                            {deployment.version}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEnvironmentColor(deployment.environment)}`}>
                            {deployment.environment.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deployment.status)}`}>
                            {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDateTime(deployment.deployedAt, deployment.deployedTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{deployment.deployedBy}</span>
                          </div>
                          {deployment.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Duration: {deployment.duration}</span>
                            </div>
                          )}
                        </div>

                        {deployment.releaseSummary && (
                          <p className="text-gray-700 mb-3">{deployment.releaseSummary}</p>
                        )}

                        {deployment.releaseNotes && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">{deployment.releaseNotes}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {deployment.jiraTicket && (
                            <span>Ticket: {deployment.jiraTicket}</span>
                          )}
                          {deployment.gitBranch && (
                            <span className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              {deployment.gitBranch}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {deployment.gitCommitUrl && (
                        <a
                          href={deployment.gitCommitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Commit"
                        >
                          <GitBranch className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-medium text-gray-900">Successful Deployments</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {history.filter(d => d.status === 'success').length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-gray-900">Failed Deployments</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {history.filter(d => d.status === 'failed').length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium text-gray-900">Rollbacks</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {history.filter(d => d.status === 'rollback').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentHistory;