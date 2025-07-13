import { DeploymentHistory } from "../types";

export const filterDeploymentHistory = (
  history: DeploymentHistory[],
  selectedEnvironment: string,
  selectedStatus: string,
  startDate: string,
  endDate: string
): DeploymentHistory[] => {
  return history.filter((deployment) => {
    const envMatch =
      !selectedEnvironment ||
      deployment.envName?.toLowerCase() === selectedEnvironment.toLowerCase();
    const statusMatch = !selectedStatus || deployment.status === selectedStatus;

    // Date range filtering
    let dateMatch = true;
    if (startDate || endDate) {
      const deploymentDate = new Date(deployment.deployedAt);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (deploymentDate < start) {
          dateMatch = false;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (deploymentDate > end) {
          dateMatch = false;
        }
      }
    }

    return envMatch && statusMatch && dateMatch;
  });
};

export const computeEnvironments = (history: DeploymentHistory[]): string[] => {
  const standard = ["dev", "qa", "uat", "prod"];
  const envSet = new Set<string>(standard);
  history.forEach((deployment) => {
    if (deployment.envName) {
      envSet.add(deployment.envName.toLowerCase());
    }
  });
  // Standard environments in order, then any others
  const others = Array.from(envSet).filter((env) => !standard.includes(env));
  return [...standard, ...others];
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return "CheckCircle";
    case "failed":
      return "AlertCircle";
    case "rollback":
      return "RotateCcw";
    default:
      return "Clock";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 border-green-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "rollback":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getEnvironmentColor = (env: string): string => {
  const envLower = env?.toLowerCase();
  switch (envLower) {
    case "dev":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "qa":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "uat":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "prod":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
