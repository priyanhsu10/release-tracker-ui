import {
  ComponentData,
  DeploymentHistory,
  ApiDeploymentResponse,
  DeploymentInfo,
  Eim,
} from "../types";

// API-like async functions for real data
export async function getComponents(eimId?: string): Promise<ComponentData[]> {
  let url = "/api/tracker-dashboard/latest-deployment";
  if (eimId) {
    url += `/${encodeURIComponent(eimId)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const apiData: ApiDeploymentResponse = await response.json();

  // Transform API response to ComponentData format
  const components: ComponentData[] = Object.entries(apiData).map(
    ([componentName, deployments]) => {
      // Group deployments by environment
      const deploymentsByEnv: Record<string, DeploymentInfo | null> = {};

      deployments.forEach((deployment) => {
        const envName = deployment.envName.toLowerCase();
        // Keep only the latest deployment per environment (highest rn)
        if (
          !deploymentsByEnv[envName] ||
          deployment.rn > deploymentsByEnv[envName]!.rn
        ) {
          deploymentsByEnv[envName] = deployment;
        }
      });

      return {
        id:
          deployments[0]?.componentId?.toString() ||
          componentName.toLowerCase().replace(/\s+/g, "-"),
        name: componentName,
        description: `${componentName} component`,
        repository: deployments[0]?.branchUrl || "",
        owner: eimId || "Unknown",
        deployments: deploymentsByEnv,
      };
    }
  );

  return components;
}

export async function getComponentHistory(
  eimId?: string
): Promise<Record<string, DeploymentHistory[]>> {
  let url = "/api/tracker-dashboard/history";
  if (eimId) {
    url += `/${encodeURIComponent(eimId)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const apiData: ApiDeploymentResponse = await response.json();

  // Transform API response to DeploymentHistory format
  const history: Record<string, DeploymentHistory[]> = {};

  Object.entries(apiData).forEach(([componentName, deployments]) => {
    const componentId =
      deployments[0]?.componentId?.toString() ||
      componentName.toLowerCase().replace(/\s+/g, "-");

    history[componentId] = deployments.map((deployment) => ({
      id: deployment.id,
      artifactVersion: deployment.artifactVersion,
      deployedAt: deployment.deployedAt.split("T")[0], // Extract date part
      deployedTime: deployment.deployedAt.split("T")[1]?.split(".")[0] || null, // Extract time part
      deployedBy: deployment.deployedBy,
      status: deployment.status,
      duration: deployment.duration,
      jiraTicketId: deployment.jiraTicketId,
      branchUrl: deployment.branchUrl,
      gitCommitUrl: deployment.gitCommitUrl,
      releaseNotes: deployment.releaseNotes,
      buildNumber: deployment.buildNumber,
      changeNumber: deployment.changeNumber,
      componentName: deployment.componentName,
      componentId: deployment.componentId,
      environmentId: deployment.environmentId,
      eimId: deployment.eimId,
      rn: deployment.rn,
      envName: deployment.envName,
    }));
  });

  return history;
}

export async function getEims(eimId?: string): Promise<Eim[]> {
  let url = "/api/tracker-dashboard/eims";
  if (eimId) {
    url += `/${encodeURIComponent(eimId)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Ensure we always return an array
  // If the API returns a single EIM object, wrap it in an array
  // If it returns an array, return it as is
  return Array.isArray(data) ? data : [data];
}

export async function searchEims(searchTerm: string): Promise<Eim[]> {
  if (!searchTerm.trim()) {
    return [];
  }

  const response = await fetch(
    `/api/tracker-dashboard/eims/search/${encodeURIComponent(searchTerm)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Real API call for EIM search (keeping for backward compatibility)
export async function searchEimsAPI(searchTerm: string): Promise<Eim[]> {
  return searchEims(searchTerm);
}

// Real API call to get all servers
export async function getServers() {
  const response = await fetch("/api/tracker-dashboard/servers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    ok: true,
    status: 200,
    json: async () => data,
  };
}
