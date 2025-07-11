import { ComponentData, DeploymentHistory } from "../types";

export const mockData: ComponentData[] = [
  {
    id: "user-service",
    name: "User Service",
    description: "Handles user authentication and profile management",
    repository: "https://github.com/company/user-service",
    owner: "Platform Team",
    deployments: {
      dev: {
        version: "v3.2.1",
        jiraTicket: "PROJ-1234",
        artifactUrl: "https://registry.com/user-service:v3.2.1",
        deployedAt: "2024-01-15",
        deployedTime: "14:32:15",
        deployedBy: "John Doe",
        gitBranch: "feature/user-profile-updates",
        gitCommitUrl: "https://github.com/company/user-service/commit/abc123",
        releaseNotes: "Added new user profile fields and improved validation",
        releaseSummary:
          "Enhanced user profile management with additional fields for better user experience",
        buildNumber: "BUILD-2024-001",
        approvedBy: "Tech Lead",
      },
      qa: {
        version: "v3.2.0",
        jiraTicket: "PROJ-1233",
        artifactUrl: "https://registry.com/user-service:v3.2.0",
        deployedAt: "2024-01-14",
        deployedTime: "09:45:22",
        deployedBy: "Jane Smith",
        gitBranch: "release/v3.2.0",
        gitCommitUrl: "https://github.com/company/user-service/commit/def456",
        releaseNotes: "Bug fixes and performance improvements",
        releaseSummary:
          "Stability improvements and bug fixes for user authentication flow",
        buildNumber: "BUILD-2024-002",
        approvedBy: "QA Lead",
      },
      uat: {
        version: "v3.1.5",
        jiraTicket: "PROJ-1230",
        artifactUrl: "https://registry.com/user-service:v3.1.5",
        deployedAt: "2024-01-10",
        deployedTime: "16:18:07",
        deployedBy: "Bob Johnson",
        gitBranch: "release/v3.1.5",
        gitCommitUrl: "https://github.com/company/user-service/commit/ghi789",
        releaseNotes: "Security updates and API improvements",
        releaseSummary:
          "Enhanced security measures and improved API response times",
        buildNumber: "BUILD-2024-003",
        approvedBy: "Security Team",
      },
      prod: {
        version: "v3.1.4",
        jiraTicket: "PROJ-1229",
        artifactUrl: "https://registry.com/user-service:v3.1.4",
        deployedAt: "2024-01-08",
        deployedTime: "11:25:43",
        deployedBy: "Alice Wilson",
        gitBranch: "release/v3.1.4",
        gitCommitUrl: "https://github.com/company/user-service/commit/jkl012",
        releaseNotes: "Critical security patch and bug fixes",
        releaseSummary: "Emergency release to address security vulnerabilities",
        buildNumber: "BUILD-2024-004",
        approvedBy: "CTO",
      },
    },
  },
  {
    id: "order-service",
    name: "Order Service",
    description: "Manages order processing and fulfillment",
    repository: "https://github.com/company/order-service",
    owner: "Commerce Team",
    deployments: {
      dev: {
        version: "v2.8.3",
        jiraTicket: "PROJ-1240",
        artifactUrl: "https://registry.com/order-service:v2.8.3",
        deployedAt: "2024-01-16",
        deployedTime: "13:22:18",
        deployedBy: "Mike Davis",
        gitBranch: "feature/order-tracking",
        gitCommitUrl: "https://github.com/company/order-service/commit/mno345",
        releaseNotes: "Added real-time order tracking functionality",
        releaseSummary:
          "New order tracking feature with real-time updates and notifications",
        buildNumber: "BUILD-2024-005",
        approvedBy: "Product Manager",
      },
      qa: {
        version: "v2.8.2",
        jiraTicket: "PROJ-1239",
        artifactUrl: "https://registry.com/order-service:v2.8.2",
        deployedAt: "2024-01-15",
        deployedTime: "10:15:33",
        deployedBy: "Sarah Brown",
        gitBranch: "release/v2.8.2",
        gitCommitUrl: "https://github.com/company/order-service/commit/pqr678",
        releaseNotes: "Performance optimizations for order processing",
        releaseSummary: "Improved order processing speed and reduced latency",
        buildNumber: "BUILD-2024-006",
        approvedBy: "Tech Lead",
      },
      uat: null,
      prod: {
        version: "v2.8.1",
        jiraTicket: "PROJ-1238",
        artifactUrl: "https://registry.com/order-service:v2.8.1",
        deployedAt: "2024-01-12",
        deployedTime: "08:30:45",
        deployedBy: "Tom Wilson",
        gitBranch: "release/v2.8.1",
        gitCommitUrl: "https://github.com/company/order-service/commit/stu901",
        releaseNotes: "Bug fixes for order cancellation flow",
        releaseSummary:
          "Fixed critical issues in order cancellation and refund processing",
        buildNumber: "BUILD-2024-007",
        approvedBy: "Operations Manager",
      },
    },
  },
  {
    id: "payment-service",
    name: "Payment Service",
    description: "Handles payment processing and transactions",
    repository: "https://github.com/company/payment-service",
    owner: "Payments Team",
    deployments: {
      dev: {
        version: "v1.5.2",
        jiraTicket: "PROJ-1245",
        artifactUrl: "https://registry.com/payment-service:v1.5.2",
        deployedAt: "2024-01-17",
        deployedTime: "15:47:29",
        deployedBy: "Lisa Chen",
        gitBranch: "feature/new-payment-methods",
        gitCommitUrl:
          "https://github.com/company/payment-service/commit/vwx234",
        releaseNotes:
          "Added support for new payment methods including digital wallets",
        releaseSummary:
          "Expanded payment options with Apple Pay, Google Pay, and cryptocurrency support",
        buildNumber: "BUILD-2024-008",
        approvedBy: "Payments Lead",
      },
      qa: {
        version: "v1.5.1",
        jiraTicket: "PROJ-1244",
        artifactUrl: "https://registry.com/payment-service:v1.5.1",
        deployedAt: "2024-01-16",
        deployedTime: "12:33:51",
        deployedBy: "David Lee",
        gitBranch: "release/v1.5.1",
        gitCommitUrl:
          "https://github.com/company/payment-service/commit/yzab567",
        releaseNotes: "Enhanced fraud detection and security measures",
        releaseSummary:
          "Improved fraud detection algorithms and enhanced transaction security",
        buildNumber: "BUILD-2024-009",
        approvedBy: "Security Team",
      },
      uat: {
        version: "v1.5.0",
        jiraTicket: "PROJ-1243",
        artifactUrl: "https://registry.com/payment-service:v1.5.0",
        deployedAt: "2024-01-15",
        deployedTime: "14:20:16",
        deployedBy: "Emma Taylor",
        gitBranch: "release/v1.5.0",
        gitCommitUrl:
          "https://github.com/company/payment-service/commit/cdef890",
        releaseNotes: "Major refactoring of payment processing engine",
        releaseSummary:
          "Complete overhaul of payment processing with improved reliability and speed",
        buildNumber: "BUILD-2024-010",
        approvedBy: "Architecture Team",
      },
      prod: {
        version: "v1.4.8",
        jiraTicket: "PROJ-1242",
        artifactUrl: "https://registry.com/payment-service:v1.4.8",
        deployedAt: "2024-01-13",
        deployedTime: "09:12:38",
        deployedBy: "Ryan Garcia",
        gitBranch: "hotfix/payment-gateway-fix",
        gitCommitUrl:
          "https://github.com/company/payment-service/commit/ghij123",
        releaseNotes: "Critical fix for payment gateway timeout issues",
        releaseSummary:
          "Emergency hotfix to resolve payment gateway connectivity issues",
        buildNumber: "BUILD-2024-011",
        approvedBy: "CTO",
      },
    },
  },
];

export const mockHistory: Record<string, DeploymentHistory[]> = {
  "user-service": [
    {
      id: "hist-001",
      version: "v3.2.1",
      environment: "dev",
      deployedAt: "2024-01-15",
      deployedTime: "14:32:15",
      deployedBy: "John Doe",
      status: "success",
      duration: "3m 45s",
      jiraTicket: "PROJ-1234",
      gitBranch: "feature/user-profile-updates",
      gitCommitUrl: "https://github.com/company/user-service/commit/abc123",
      releaseNotes: "Added new user profile fields and improved validation",
      releaseSummary:
        "Enhanced user profile management with additional fields for better user experience",
    },
    {
      id: "hist-002",
      version: "v3.2.0",
      environment: "qa",
      deployedAt: "2024-01-14",
      deployedTime: "09:45:22",
      deployedBy: "Jane Smith",
      status: "success",
      duration: "2m 18s",
      jiraTicket: "PROJ-1233",
      gitBranch: "release/v3.2.0",
      gitCommitUrl: "https://github.com/company/user-service/commit/def456",
      releaseNotes: "Bug fixes and performance improvements",
      releaseSummary:
        "Stability improvements and bug fixes for user authentication flow",
    },
    {
      id: "hist-003",
      version: "v3.1.9",
      environment: "dev",
      deployedAt: "2024-01-13",
      deployedTime: "16:22:10",
      deployedBy: "John Doe",
      status: "failed",
      duration: "1m 32s",
      jiraTicket: "PROJ-1232",
      gitBranch: "feature/failed-deployment",
      gitCommitUrl: "https://github.com/company/user-service/commit/failed123",
      releaseNotes: "Attempted feature deployment that failed",
      releaseSummary: "Deployment failed due to configuration issues",
    },
    {
      id: "hist-004",
      version: "v3.1.4",
      environment: "prod",
      deployedAt: "2024-01-08",
      deployedTime: "11:25:43",
      deployedBy: "Alice Wilson",
      status: "success",
      duration: "5m 12s",
      jiraTicket: "PROJ-1229",
      gitBranch: "release/v3.1.4",
      gitCommitUrl: "https://github.com/company/user-service/commit/jkl012",
      releaseNotes: "Critical security patch and bug fixes",
      releaseSummary: "Emergency release to address security vulnerabilities",
    },
    {
      id: "hist-005",
      version: "v3.1.3",
      environment: "prod",
      deployedAt: "2024-01-05",
      deployedTime: "14:15:30",
      deployedBy: "Bob Johnson",
      status: "rollback",
      duration: "8m 45s",
      jiraTicket: "PROJ-1228",
      gitBranch: "release/v3.1.3",
      gitCommitUrl:
        "https://github.com/company/user-service/commit/rollback456",
      releaseNotes: "Deployment rolled back due to performance issues",
      releaseSummary:
        "Rollback performed due to unexpected performance degradation",
    },
  ],
  "order-service": [
    {
      id: "hist-006",
      version: "v2.8.3",
      environment: "dev",
      deployedAt: "2024-01-16",
      deployedTime: "13:22:18",
      deployedBy: "Mike Davis",
      status: "success",
      duration: "4m 12s",
      jiraTicket: "PROJ-1240",
      gitBranch: "feature/order-tracking",
      gitCommitUrl: "https://github.com/company/order-service/commit/mno345",
      releaseNotes: "Added real-time order tracking functionality",
      releaseSummary:
        "New order tracking feature with real-time updates and notifications",
    },
    {
      id: "hist-007",
      version: "v2.8.2",
      environment: "qa",
      deployedAt: "2024-01-15",
      deployedTime: "10:15:33",
      deployedBy: "Sarah Brown",
      status: "success",
      duration: "3m 28s",
      jiraTicket: "PROJ-1239",
      gitBranch: "release/v2.8.2",
      gitCommitUrl: "https://github.com/company/order-service/commit/pqr678",
      releaseNotes: "Performance optimizations for order processing",
      releaseSummary: "Improved order processing speed and reduced latency",
    },
  ],
  "payment-service": [
    {
      id: "hist-008",
      version: "v1.5.2",
      environment: "dev",
      deployedAt: "2024-01-17",
      deployedTime: "15:47:29",
      deployedBy: "Lisa Chen",
      status: "success",
      duration: "6m 15s",
      jiraTicket: "PROJ-1245",
      gitBranch: "feature/new-payment-methods",
      gitCommitUrl: "https://github.com/company/payment-service/commit/vwx234",
      releaseNotes:
        "Added support for new payment methods including digital wallets",
      releaseSummary:
        "Expanded payment options with Apple Pay, Google Pay, and cryptocurrency support",
    },
  ],
};

// EIM number and name mock data
export const mockEims = [
  { number: "EIM-001", name: "Platform Team" },
  { number: "EIM-002", name: "Commerce Team" },
  { number: "EIM-003", name: "Payments Team" },
];

// Mock server data
export const mockServers = [
  { id: "srv-001", name: "Server Alpha", ip: "10.0.0.1", status: "active" },
  { id: "srv-002", name: "Server Beta", ip: "10.0.0.2", status: "inactive" },
  { id: "srv-003", name: "Server Gamma", ip: "10.0.0.3", status: "active" },
];

// Mock API call to get all servers
export function getServers() {
  // Simulate fetch API with a Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        json: async () => mockServers,
      });
    }, 300); // Simulate network delay
  });
}
