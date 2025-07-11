export interface DeploymentInfo {
  version: string;
  jiraTicket?: string;
  artifactUrl?: string;
  deployedAt?: string;
  deployedTime?: string;
  deployedBy?: string;
  gitBranch?: string;
  gitCommitUrl?: string;
  releaseNotes?: string;
  releaseSummary?: string;
  buildNumber?: string;
  approvedBy?: string;
  rollbackUrl?: string;
}

export interface ComponentData {
  id: string;
  name: string;
  description?: string;
  repository?: string;
  owner?: string;
  iemId: string;
  deployments: Record<string, DeploymentInfo | null>;
}

export interface DeploymentHistory {
  id: string;
  version: string;
  environment: string;
  deployedAt: string;
  deployedTime: string;
  deployedBy: string;
  status: 'success' | 'failed' | 'rollback';
  duration?: string;
  jiraTicket?: string;
  gitBranch?: string;
  gitCommitUrl?: string;
  releaseNotes?: string;
  releaseSummary?: string;
}

export interface IEM {
  id: string;
  name: string;
  description: string;
  region: string;
  status: 'active' | 'maintenance' | 'inactive';
  componentCount: number;
  lastUpdated: string;
}