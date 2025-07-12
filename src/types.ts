export interface DeploymentInfo {
  id: number;
  artifactVersion: string;
  deployedAt: string;
  deployedTime?: string | null;
  deployedBy: string;
  status: "success" | "failed" | "rollback";
  duration?: string | null;
  jiraTicketId?: string;
  branchUrl?: string;
  gitCommitUrl?: string | null;
  releaseNotes?: string;
  buildNumber?: string | null;
  changeNumber?: string;
  componentName: string;
  componentId: number;
  environmentId: number;
  eimId: number;
  rn: number;
  envName: string;
}

export interface ComponentData {
  id: string;
  name: string;
  description?: string;
  repository?: string;
  owner?: string;
  deployments: Record<string, DeploymentInfo | null>;
}

export interface DeploymentHistory {
  id: number;
  artifactVersion: string;
  deployedAt: string;
  deployedTime?: string | null;
  deployedBy: string;
  status: "success" | "failed" | "rollback";
  duration?: string | null;
  jiraTicketId?: string;
  branchUrl?: string;
  gitCommitUrl?: string | null;
  releaseNotes?: string;
  buildNumber?: string | null;
  changeNumber?: string;
  componentName: string;
  componentId: number;
  environmentId: number;
  eimId: number;
  rn: number;
  envName: string;
}

// New type for API response structure
export interface ApiDeploymentResponse {
  [componentName: string]: DeploymentInfo[];
}

// New EIM interface
export interface Eim {
  id: number;
  eimNumber: string;
  name: string;
  description: string;
}

export type Theme = "light" | "dark";
