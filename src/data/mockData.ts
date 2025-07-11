import { ComponentData, DeploymentHistory, IEM } from '../types';

export const mockIEMs: IEM[] = [
  {
    id: 'iem-us-east-1',
    name: 'US East Production',
    description: 'Primary production environment for US East region',
    region: 'us-east-1',
    status: 'active',
    componentCount: 3,
    lastUpdated: '2024-01-20'
  },
  {
    id: 'iem-us-west-1',
    name: 'US West Production',
    description: 'Production environment for US West region',
    region: 'us-west-1',
    status: 'active',
    componentCount: 2,
    lastUpdated: '2024-01-19'
  },
  {
    id: 'iem-eu-central-1',
    name: 'EU Central Production',
    description: 'Production environment for European region',
    region: 'eu-central-1',
    status: 'active',
    componentCount: 1,
    lastUpdated: '2024-01-18'
  },
  {
    id: 'iem-staging',
    name: 'Global Staging',
    description: 'Staging environment for all regions',
    region: 'global',
    status: 'maintenance',
    componentCount: 6,
    lastUpdated: '2024-01-17'
  },
  {
    id: 'iem-dev',
    name: 'Development Environment',
    description: 'Development and testing environment',
    region: 'us-east-1',
    status: 'active',
    componentCount: 6,
    lastUpdated: '2024-01-20'
  }
];

export const mockData: ComponentData[] = [
  {
    id: 'user-service',
    name: 'User Service',
    description: 'Handles user authentication and profile management',
    repository: 'https://github.com/company/user-service',
    owner: 'Platform Team',
    iemId: 'iem-us-east-1',
    deployments: {
      dev: { 
        version: 'v3.2.1', 
        jiraTicket: 'PROJ-1234', 
        artifactUrl: 'https://registry.com/user-service:v3.2.1', 
        deployedAt: '2024-01-15', 
        deployedTime: '14:32:15', 
        deployedBy: 'John Doe',
        gitBranch: 'feature/user-profile-updates',
        gitCommitUrl: 'https://github.com/company/user-service/commit/abc123',
        releaseNotes: 'Added new user profile fields and improved validation',
        releaseSummary: 'Enhanced user profile management with additional fields for better user experience',
        buildNumber: 'BUILD-2024-001',
        approvedBy: 'Tech Lead'
      },
      qa: { 
        version: 'v3.2.0', 
        jiraTicket: 'PROJ-1233', 
        artifactUrl: 'https://registry.com/user-service:v3.2.0', 
        deployedAt: '2024-01-14', 
        deployedTime: '09:45:22', 
        deployedBy: 'Jane Smith',
        gitBranch: 'release/v3.2.0',
        gitCommitUrl: 'https://github.com/company/user-service/commit/def456',
        releaseNotes: 'Bug fixes and performance improvements',
        releaseSummary: 'Stability improvements and bug fixes for user authentication flow',
        buildNumber: 'BUILD-2024-002',
        approvedBy: 'QA Lead'
      },
      uat: { 
        version: 'v3.1.5', 
        jiraTicket: 'PROJ-1230', 
        artifactUrl: 'https://registry.com/user-service:v3.1.5', 
        deployedAt: '2024-01-10', 
        deployedTime: '16:18:07', 
        deployedBy: 'Bob Johnson',
        gitBranch: 'release/v3.1.5',
        gitCommitUrl: 'https://github.com/company/user-service/commit/ghi789',
        releaseNotes: 'Security updates and API improvements',
        releaseSummary: 'Enhanced security measures and improved API response times',
        buildNumber: 'BUILD-2024-003',
        approvedBy: 'Security Team'
      },
      prod: { 
        version: 'v3.1.4', 
        jiraTicket: 'PROJ-1229', 
        artifactUrl: 'https://registry.com/user-service:v3.1.4', 
        deployedAt: '2024-01-08', 
        deployedTime: '11:25:43', 
        deployedBy: 'Alice Wilson',
        gitBranch: 'release/v3.1.4',
        gitCommitUrl: 'https://github.com/company/user-service/commit/jkl012',
        releaseNotes: 'Critical security patch and bug fixes',
        releaseSummary: 'Emergency release to address security vulnerabilities',
        buildNumber: 'BUILD-2024-004',
        approvedBy: 'CTO'
      }
    }
  },
  {
    id: 'order-service',
    name: 'Order Service',
    description: 'Manages order processing and fulfillment',
    repository: 'https://github.com/company/order-service',
    owner: 'Commerce Team',
    iemId: 'iem-us-east-1',
    deployments: {
      dev: { 
        version: 'v2.8.3', 
        jiraTicket: 'PROJ-1240', 
        artifactUrl: 'https://registry.com/order-service:v2.8.3', 
        deployedAt: '2024-01-16', 
        deployedTime: '13:22:18', 
        deployedBy: 'Mike Davis',
        gitBranch: 'feature/order-tracking',
        gitCommitUrl: 'https://github.com/company/order-service/commit/mno345',
        releaseNotes: 'Added real-time order tracking functionality',
        releaseSummary: 'New order tracking feature with real-time updates and notifications',
        buildNumber: 'BUILD-2024-005',
        approvedBy: 'Product Manager'
      },
      qa: { 
        version: 'v2.8.2', 
        jiraTicket: 'PROJ-1239', 
        artifactUrl: 'https://registry.com/order-service:v2.8.2', 
        deployedAt: '2024-01-15', 
        deployedTime: '10:15:33', 
        deployedBy: 'Sarah Brown',
        gitBranch: 'release/v2.8.2',
        gitCommitUrl: 'https://github.com/company/order-service/commit/pqr678',
        releaseNotes: 'Performance optimizations for order processing',
        releaseSummary: 'Improved order processing speed and reduced latency',
        buildNumber: 'BUILD-2024-006',
        approvedBy: 'Tech Lead'
      },
      uat: null,
      prod: { 
        version: 'v2.8.1', 
        jiraTicket: 'PROJ-1238', 
        artifactUrl: 'https://registry.com/order-service:v2.8.1', 
        deployedAt: '2024-01-12', 
        deployedTime: '08:30:45', 
        deployedBy: 'Tom Wilson',
        gitBranch: 'release/v2.8.1',
        gitCommitUrl: 'https://github.com/company/order-service/commit/stu901',
        releaseNotes: 'Bug fixes for order cancellation flow',
        releaseSummary: 'Fixed critical issues in order cancellation and refund processing',
        buildNumber: 'BUILD-2024-007',
        approvedBy: 'Operations Manager'
      }
    }
  },
  {
    id: 'payment-service',
    name: 'Payment Service',
    description: 'Handles payment processing and transactions',
    repository: 'https://github.com/company/payment-service',
    owner: 'Payments Team',
    iemId: 'iem-us-east-1',
    deployments: {
      dev: { 
        version: 'v1.5.2', 
        jiraTicket: 'PROJ-1245', 
        artifactUrl: 'https://registry.com/payment-service:v1.5.2', 
        deployedAt: '2024-01-17', 
        deployedTime: '15:47:29', 
        deployedBy: 'Lisa Chen',
        gitBranch: 'feature/new-payment-methods',
        gitCommitUrl: 'https://github.com/company/payment-service/commit/vwx234',
        releaseNotes: 'Added support for new payment methods including digital wallets',
        releaseSummary: 'Expanded payment options with Apple Pay, Google Pay, and cryptocurrency support',
        buildNumber: 'BUILD-2024-008',
        approvedBy: 'Payments Lead'
      },
      qa: { 
        version: 'v1.5.1', 
        jiraTicket: 'PROJ-1244', 
        artifactUrl: 'https://registry.com/payment-service:v1.5.1', 
        deployedAt: '2024-01-16', 
        deployedTime: '12:33:51', 
        deployedBy: 'David Lee',
        gitBranch: 'release/v1.5.1',
        gitCommitUrl: 'https://github.com/company/payment-service/commit/yzab567',
        releaseNotes: 'Enhanced fraud detection and security measures',
        releaseSummary: 'Improved fraud detection algorithms and enhanced transaction security',
        buildNumber: 'BUILD-2024-009',
        approvedBy: 'Security Team'
      },
      uat: { 
        version: 'v1.5.0', 
        jiraTicket: 'PROJ-1243', 
        artifactUrl: 'https://registry.com/payment-service:v1.5.0', 
        deployedAt: '2024-01-15', 
        deployedTime: '14:20:16', 
        deployedBy: 'Emma Taylor',
        gitBranch: 'release/v1.5.0',
        gitCommitUrl: 'https://github.com/company/payment-service/commit/cdef890',
        releaseNotes: 'Major refactoring of payment processing engine',
        releaseSummary: 'Complete overhaul of payment processing with improved reliability and speed',
        buildNumber: 'BUILD-2024-010',
        approvedBy: 'Architecture Team'
      },
      prod: { 
        version: 'v1.4.8', 
        jiraTicket: 'PROJ-1242', 
        artifactUrl: 'https://registry.com/payment-service:v1.4.8', 
        deployedAt: '2024-01-13', 
        deployedTime: '09:12:38', 
        deployedBy: 'Ryan Garcia',
        gitBranch: 'hotfix/payment-gateway-fix',
        gitCommitUrl: 'https://github.com/company/payment-service/commit/ghij123',
        releaseNotes: 'Critical fix for payment gateway timeout issues',
        releaseSummary: 'Emergency hotfix to resolve payment gateway connectivity issues',
        buildNumber: 'BUILD-2024-011',
        approvedBy: 'CTO'
      }
    }
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    description: 'Handles email, SMS, and push notifications',
    repository: 'https://github.com/company/notification-service',
    owner: 'Platform Team',
    iemId: 'iem-us-west-1',
    deployments: {
      dev: { 
        version: 'v4.1.0', 
        jiraTicket: 'PROJ-1250', 
        artifactUrl: 'https://registry.com/notification-service:v4.1.0', 
        deployedAt: '2024-01-18', 
        deployedTime: '11:55:42', 
        deployedBy: 'Kate Johnson',
        gitBranch: 'feature/push-notifications',
        gitCommitUrl: 'https://github.com/company/notification-service/commit/abc789',
        releaseNotes: 'Added push notification support for mobile apps',
        releaseSummary: 'Enhanced notification system with mobile push capabilities',
        buildNumber: 'BUILD-2024-012',
        approvedBy: 'Mobile Team Lead'
      },
      qa: { 
        version: 'v4.0.9', 
        jiraTicket: 'PROJ-1249', 
        artifactUrl: 'https://registry.com/notification-service:v4.0.9', 
        deployedAt: '2024-01-17', 
        deployedTime: '16:28:13', 
        deployedBy: 'Alex Martinez',
        gitBranch: 'release/v4.0.9',
        gitCommitUrl: 'https://github.com/company/notification-service/commit/def012',
        releaseNotes: 'Performance improvements for email delivery',
        releaseSummary: 'Optimized email processing and delivery speed',
        buildNumber: 'BUILD-2024-013',
        approvedBy: 'QA Lead'
      },
      uat: null,
      prod: { 
        version: 'v4.0.8', 
        jiraTicket: 'PROJ-1248', 
        artifactUrl: 'https://registry.com/notification-service:v4.0.8', 
        deployedAt: '2024-01-14', 
        deployedTime: '13:41:27', 
        deployedBy: 'Sophie White',
        gitBranch: 'release/v4.0.8',
        gitCommitUrl: 'https://github.com/company/notification-service/commit/ghi345',
        releaseNotes: 'Bug fixes for SMS delivery failures',
        releaseSummary: 'Fixed critical issues in SMS notification delivery',
        buildNumber: 'BUILD-2024-014',
        approvedBy: 'Operations Manager'
      }
    }
  },
  {
    id: 'inventory-service',
    name: 'Inventory Service',
    description: 'Manages product inventory and stock levels',
    repository: 'https://github.com/company/inventory-service',
    owner: 'Commerce Team',
    iemId: 'iem-us-west-1',
    deployments: {
      dev: { 
        version: 'v2.3.1', 
        jiraTicket: 'PROJ-1255', 
        artifactUrl: 'https://registry.com/inventory-service:v2.3.1', 
        deployedAt: '2024-01-19', 
        deployedTime: '10:14:56', 
        deployedBy: 'Chris Anderson',
        gitBranch: 'feature/real-time-inventory',
        gitCommitUrl: 'https://github.com/company/inventory-service/commit/jkl678',
        releaseNotes: 'Added real-time inventory tracking and alerts',
        releaseSummary: 'Enhanced inventory management with real-time updates and low-stock alerts',
        buildNumber: 'BUILD-2024-015',
        approvedBy: 'Product Manager'
      },
      qa: { 
        version: 'v2.3.0', 
        jiraTicket: 'PROJ-1254', 
        artifactUrl: 'https://registry.com/inventory-service:v2.3.0', 
        deployedAt: '2024-01-18', 
        deployedTime: '14:37:21', 
        deployedBy: 'Maria Rodriguez',
        gitBranch: 'release/v2.3.0',
        gitCommitUrl: 'https://github.com/company/inventory-service/commit/mno901',
        releaseNotes: 'Performance optimizations for inventory queries',
        releaseSummary: 'Improved query performance and reduced database load',
        buildNumber: 'BUILD-2024-016',
        approvedBy: 'Tech Lead'
      },
      uat: { 
        version: 'v2.2.8', 
        jiraTicket: 'PROJ-1253', 
        artifactUrl: 'https://registry.com/inventory-service:v2.2.8', 
        deployedAt: '2024-01-16', 
        deployedTime: '09:52:34', 
        deployedBy: 'James Wilson',
        gitBranch: 'release/v2.2.8',
        gitCommitUrl: 'https://github.com/company/inventory-service/commit/pqr234',
        releaseNotes: 'Added support for multi-warehouse inventory',
        releaseSummary: 'Extended inventory system to support multiple warehouse locations',
        buildNumber: 'BUILD-2024-017',
        approvedBy: 'Operations Team'
      },
      prod: { 
        version: 'v2.2.7', 
        jiraTicket: 'PROJ-1252', 
        artifactUrl: 'https://registry.com/inventory-service:v2.2.7', 
        deployedAt: '2024-01-15', 
        deployedTime: '15:19:08', 
        deployedBy: 'Jennifer Lee',
        gitBranch: 'hotfix/inventory-sync',
        gitCommitUrl: 'https://github.com/company/inventory-service/commit/stu567',
        releaseNotes: 'Critical fix for inventory synchronization issues',
        releaseSummary: 'Emergency hotfix to resolve inventory sync problems',
        buildNumber: 'BUILD-2024-018',
        approvedBy: 'CTO'
      }
    }
  },
  {
    id: 'analytics-service',
    name: 'Analytics Service',
    description: 'Provides business analytics and reporting',
    repository: 'https://github.com/company/analytics-service',
    owner: 'Data Team',
    iemId: 'iem-eu-central-1',
    deployments: {
      dev: { 
        version: 'v1.8.4', 
        jiraTicket: 'PROJ-1260', 
        artifactUrl: 'https://registry.com/analytics-service:v1.8.4', 
        deployedAt: '2024-01-20', 
        deployedTime: '12:43:17', 
        deployedBy: 'Daniel Kim',
        gitBranch: 'feature/advanced-reporting',
        gitCommitUrl: 'https://github.com/company/analytics-service/commit/vwx890',
        releaseNotes: 'Added advanced reporting capabilities and custom dashboards',
        releaseSummary: 'Enhanced analytics platform with customizable reporting and dashboard features',
        buildNumber: 'BUILD-2024-019',
        approvedBy: 'Data Team Lead'
      },
      qa: null,
      uat: { 
        version: 'v1.8.2', 
        jiraTicket: 'PROJ-1259', 
        artifactUrl: 'https://registry.com/analytics-service:v1.8.2', 
        deployedAt: '2024-01-17', 
        deployedTime: '11:26:49', 
        deployedBy: 'Rachel Davis',
        gitBranch: 'release/v1.8.2',
        gitCommitUrl: 'https://github.com/company/analytics-service/commit/yza123',
        releaseNotes: 'Performance improvements for large dataset processing',
        releaseSummary: 'Optimized data processing for better performance with large datasets',
        buildNumber: 'BUILD-2024-020',
        approvedBy: 'Performance Team'
      },
      prod: { 
        version: 'v1.8.1', 
        jiraTicket: 'PROJ-1258', 
        artifactUrl: 'https://registry.com/analytics-service:v1.8.1', 
        deployedAt: '2024-01-16', 
        deployedTime: '16:08:32', 
        deployedBy: 'Kevin Brown',
        gitBranch: 'release/v1.8.1',
        gitCommitUrl: 'https://github.com/company/analytics-service/commit/bcd456',
        releaseNotes: 'Security updates and bug fixes for data export functionality',
        releaseSummary: 'Enhanced security and fixed issues in data export features',
        buildNumber: 'BUILD-2024-021',
        approvedBy: 'Security Team'
      }
    }
  },
  {
    id: 'auth-service',
    name: 'Authentication Service',
    description: 'Centralized authentication and authorization',
    repository: 'https://github.com/company/auth-service',
    owner: 'Security Team',
    iemId: 'iem-staging',
    deployments: {
      dev: { 
        version: 'v3.5.2', 
        jiraTicket: 'PROJ-1265', 
        artifactUrl: 'https://registry.com/auth-service:v3.5.2', 
        deployedAt: '2024-01-20', 
        deployedTime: '09:15:33', 
        deployedBy: 'Security Admin',
        gitBranch: 'feature/oauth2-improvements',
        gitCommitUrl: 'https://github.com/company/auth-service/commit/efg789',
        releaseNotes: 'Enhanced OAuth2 implementation with better token management',
        releaseSummary: 'Improved OAuth2 flow with enhanced security and token lifecycle management',
        buildNumber: 'BUILD-2024-022',
        approvedBy: 'Security Lead'
      },
      qa: { 
        version: 'v3.5.1', 
        jiraTicket: 'PROJ-1264', 
        artifactUrl: 'https://registry.com/auth-service:v3.5.1', 
        deployedAt: '2024-01-19', 
        deployedTime: '13:42:18', 
        deployedBy: 'QA Engineer',
        gitBranch: 'release/v3.5.1',
        gitCommitUrl: 'https://github.com/company/auth-service/commit/hij012',
        releaseNotes: 'Bug fixes for multi-factor authentication',
        releaseSummary: 'Fixed critical issues in MFA implementation',
        buildNumber: 'BUILD-2024-023',
        approvedBy: 'QA Lead'
      },
      uat: { 
        version: 'v3.5.0', 
        jiraTicket: 'PROJ-1263', 
        artifactUrl: 'https://registry.com/auth-service:v3.5.0', 
        deployedAt: '2024-01-18', 
        deployedTime: '10:28:45', 
        deployedBy: 'DevOps Engineer',
        gitBranch: 'release/v3.5.0',
        gitCommitUrl: 'https://github.com/company/auth-service/commit/klm345',
        releaseNotes: 'Major update with SSO integration and improved security',
        releaseSummary: 'Comprehensive security update with SSO support and enhanced authentication flows',
        buildNumber: 'BUILD-2024-024',
        approvedBy: 'Architecture Team'
      },
      prod: { 
        version: 'v3.4.8', 
        jiraTicket: 'PROJ-1262', 
        artifactUrl: 'https://registry.com/auth-service:v3.4.8', 
        deployedAt: '2024-01-17', 
        deployedTime: '14:55:12', 
        deployedBy: 'Production Admin',
        gitBranch: 'hotfix/session-timeout',
        gitCommitUrl: 'https://github.com/company/auth-service/commit/nop678',
        releaseNotes: 'Critical fix for session timeout issues',
        releaseSummary: 'Emergency fix to resolve user session timeout problems',
        buildNumber: 'BUILD-2024-025',
        approvedBy: 'CTO'
      }
    }
  },
  {
    id: 'logging-service',
    name: 'Logging Service',
    description: 'Centralized logging and monitoring',
    repository: 'https://github.com/company/logging-service',
    owner: 'DevOps Team',
    iemId: 'iem-dev',
    deployments: {
      dev: { 
        version: 'v2.1.3', 
        jiraTicket: 'PROJ-1270', 
        artifactUrl: 'https://registry.com/logging-service:v2.1.3', 
        deployedAt: '2024-01-20', 
        deployedTime: '16:22:41', 
        deployedBy: 'DevOps Lead',
        gitBranch: 'feature/structured-logging',
        gitCommitUrl: 'https://github.com/company/logging-service/commit/qrs901',
        releaseNotes: 'Implemented structured logging with JSON format',
        releaseSummary: 'Enhanced logging system with structured JSON format for better parsing and analysis',
        buildNumber: 'BUILD-2024-026',
        approvedBy: 'DevOps Manager'
      },
      qa: { 
        version: 'v2.1.2', 
        jiraTicket: 'PROJ-1269', 
        artifactUrl: 'https://registry.com/logging-service:v2.1.2', 
        deployedAt: '2024-01-19', 
        deployedTime: '11:37:29', 
        deployedBy: 'QA Automation',
        gitBranch: 'release/v2.1.2',
        gitCommitUrl: 'https://github.com/company/logging-service/commit/tuv234',
        releaseNotes: 'Performance improvements for log aggregation',
        releaseSummary: 'Optimized log collection and aggregation for better performance',
        buildNumber: 'BUILD-2024-027',
        approvedBy: 'Performance Team'
      },
      uat: { 
        version: 'v2.1.1', 
        jiraTicket: 'PROJ-1268', 
        artifactUrl: 'https://registry.com/logging-service:v2.1.1', 
        deployedAt: '2024-01-18', 
        deployedTime: '08:44:16', 
        deployedBy: 'System Admin',
        gitBranch: 'release/v2.1.1',
        gitCommitUrl: 'https://github.com/company/logging-service/commit/wxy567',
        releaseNotes: 'Added support for custom log retention policies',
        releaseSummary: 'Enhanced logging system with configurable retention policies',
        buildNumber: 'BUILD-2024-028',
        approvedBy: 'Operations Team'
      },
      prod: { 
        version: 'v2.1.0', 
        jiraTicket: 'PROJ-1267', 
        artifactUrl: 'https://registry.com/logging-service:v2.1.0', 
        deployedAt: '2024-01-17', 
        deployedTime: '12:18:53', 
        deployedBy: 'Production Team',
        gitBranch: 'release/v2.1.0',
        gitCommitUrl: 'https://github.com/company/logging-service/commit/zab890',
        releaseNotes: 'Major update with improved log search and filtering',
        releaseSummary: 'Comprehensive logging platform update with enhanced search capabilities',
        buildNumber: 'BUILD-2024-029',
        approvedBy: 'Engineering Manager'
      }
    }
  },
  {
    id: 'config-service',
    name: 'Configuration Service',
    description: 'Centralized configuration management',
    repository: 'https://github.com/company/config-service',
    owner: 'Platform Team',
    iemId: 'iem-dev',
    deployments: {
      dev: { 
        version: 'v1.4.1', 
        jiraTicket: 'PROJ-1275', 
        artifactUrl: 'https://registry.com/config-service:v1.4.1', 
        deployedAt: '2024-01-20', 
        deployedTime: '14:08:27', 
        deployedBy: 'Platform Engineer',
        gitBranch: 'feature/dynamic-config',
        gitCommitUrl: 'https://github.com/company/config-service/commit/cde123',
        releaseNotes: 'Added dynamic configuration updates without restart',
        releaseSummary: 'Enhanced configuration service with hot-reload capabilities',
        buildNumber: 'BUILD-2024-030',
        approvedBy: 'Platform Lead'
      },
      qa: { 
        version: 'v1.4.0', 
        jiraTicket: 'PROJ-1274', 
        artifactUrl: 'https://registry.com/config-service:v1.4.0', 
        deployedAt: '2024-01-19', 
        deployedTime: '09:51:14', 
        deployedBy: 'QA Team',
        gitBranch: 'release/v1.4.0',
        gitCommitUrl: 'https://github.com/company/config-service/commit/fgh456',
        releaseNotes: 'Major refactoring with improved API design',
        releaseSummary: 'Redesigned configuration API for better usability and performance',
        buildNumber: 'BUILD-2024-031',
        approvedBy: 'API Team'
      },
      uat: { 
        version: 'v1.3.8', 
        jiraTicket: 'PROJ-1273', 
        artifactUrl: 'https://registry.com/config-service:v1.3.8', 
        deployedAt: '2024-01-18', 
        deployedTime: '15:33:42', 
        deployedBy: 'UAT Team',
        gitBranch: 'release/v1.3.8',
        gitCommitUrl: 'https://github.com/company/config-service/commit/ijk789',
        releaseNotes: 'Security improvements and access control updates',
        releaseSummary: 'Enhanced security with role-based access control for configurations',
        buildNumber: 'BUILD-2024-032',
        approvedBy: 'Security Team'
      },
      prod: { 
        version: 'v1.3.7', 
        jiraTicket: 'PROJ-1272', 
        artifactUrl: 'https://registry.com/config-service:v1.3.7', 
        deployedAt: '2024-01-17', 
        deployedTime: '10:47:19', 
        deployedBy: 'Production Team',
        gitBranch: 'hotfix/config-validation',
        gitCommitUrl: 'https://github.com/company/config-service/commit/lmn012',
        releaseNotes: 'Critical fix for configuration validation errors',
        releaseSummary: 'Emergency fix to resolve configuration validation issues',
        buildNumber: 'BUILD-2024-033',
        approvedBy: 'Operations Manager'
      }
    }
  }
];

export const mockHistory: Record<string, DeploymentHistory[]> = {
  'user-service': [
    {
      id: 'hist-001',
      version: 'v3.2.1',
      environment: 'dev',
      deployedAt: '2024-01-15',
      deployedTime: '14:32:15',
      deployedBy: 'John Doe',
      status: 'success',
      duration: '3m 45s',
      jiraTicket: 'PROJ-1234',
      gitBranch: 'feature/user-profile-updates',
      gitCommitUrl: 'https://github.com/company/user-service/commit/abc123',
      releaseNotes: 'Added new user profile fields and improved validation',
      releaseSummary: 'Enhanced user profile management with additional fields for better user experience'
    },
    {
      id: 'hist-002',
      version: 'v3.2.0',
      environment: 'qa',
      deployedAt: '2024-01-14',
      deployedTime: '09:45:22',
      deployedBy: 'Jane Smith',
      status: 'success',
      duration: '2m 18s',
      jiraTicket: 'PROJ-1233',
      gitBranch: 'release/v3.2.0',
      gitCommitUrl: 'https://github.com/company/user-service/commit/def456',
      releaseNotes: 'Bug fixes and performance improvements',
      releaseSummary: 'Stability improvements and bug fixes for user authentication flow'
    },
    {
      id: 'hist-003',
      version: 'v3.1.9',
      environment: 'dev',
      deployedAt: '2024-01-13',
      deployedTime: '16:22:10',
      deployedBy: 'John Doe',
      status: 'failed',
      duration: '1m 32s',
      jiraTicket: 'PROJ-1232',
      gitBranch: 'feature/failed-deployment',
      gitCommitUrl: 'https://github.com/company/user-service/commit/failed123',
      releaseNotes: 'Attempted feature deployment that failed',
      releaseSummary: 'Deployment failed due to configuration issues'
    },
    {
      id: 'hist-004',
      version: 'v3.1.4',
      environment: 'prod',
      deployedAt: '2024-01-08',
      deployedTime: '11:25:43',
      deployedBy: 'Alice Wilson',
      status: 'success',
      duration: '5m 12s',
      jiraTicket: 'PROJ-1229',
      gitBranch: 'release/v3.1.4',
      gitCommitUrl: 'https://github.com/company/user-service/commit/jkl012',
      releaseNotes: 'Critical security patch and bug fixes',
      releaseSummary: 'Emergency release to address security vulnerabilities'
    },
    {
      id: 'hist-005',
      version: 'v3.1.3',
      environment: 'prod',
      deployedAt: '2024-01-05',
      deployedTime: '14:15:30',
      deployedBy: 'Bob Johnson',
      status: 'rollback',
      duration: '8m 45s',
      jiraTicket: 'PROJ-1228',
      gitBranch: 'release/v3.1.3',
      gitCommitUrl: 'https://github.com/company/user-service/commit/rollback456',
      releaseNotes: 'Deployment rolled back due to performance issues',
      releaseSummary: 'Rollback performed due to unexpected performance degradation'
    }
  ],
  'order-service': [
    {
      id: 'hist-006',
      version: 'v2.8.3',
      environment: 'dev',
      deployedAt: '2024-01-16',
      deployedTime: '13:22:18',
      deployedBy: 'Mike Davis',
      status: 'success',
      duration: '4m 12s',
      jiraTicket: 'PROJ-1240',
      gitBranch: 'feature/order-tracking',
      gitCommitUrl: 'https://github.com/company/order-service/commit/mno345',
      releaseNotes: 'Added real-time order tracking functionality',
      releaseSummary: 'New order tracking feature with real-time updates and notifications'
    },
    {
      id: 'hist-007',
      version: 'v2.8.2',
      environment: 'qa',
      deployedAt: '2024-01-15',
      deployedTime: '10:15:33',
      deployedBy: 'Sarah Brown',
      status: 'success',
      duration: '3m 28s',
      jiraTicket: 'PROJ-1239',
      gitBranch: 'release/v2.8.2',
      gitCommitUrl: 'https://github.com/company/order-service/commit/pqr678',
      releaseNotes: 'Performance optimizations for order processing',
      releaseSummary: 'Improved order processing speed and reduced latency'
    }
  ],
  'payment-service': [
    {
      id: 'hist-008',
      version: 'v1.5.2',
      environment: 'dev',
      deployedAt: '2024-01-17',
      deployedTime: '15:47:29',
      deployedBy: 'Lisa Chen',
      status: 'success',
      duration: '6m 15s',
      jiraTicket: 'PROJ-1245',
      gitBranch: 'feature/new-payment-methods',
      gitCommitUrl: 'https://github.com/company/payment-service/commit/vwx234',
      releaseNotes: 'Added support for new payment methods including digital wallets',
      releaseSummary: 'Expanded payment options with Apple Pay, Google Pay, and cryptocurrency support'
    }
  ]
};