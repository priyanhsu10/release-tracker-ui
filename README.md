# Release Tracker UI

A React-based dashboard for tracking component deployments across different environments.

## Features

- View component deployments across DEV, QA, UAT, and PROD environments
- Search and filter by EIM (Enterprise Information Management)
- Detailed deployment information with version history
- Dark/Light theme support
- Real-time deployment status tracking

## Data Structures

### EIM Structure
```typescript
interface Eim {
  id: number;
  eimNumber: string;
  name: string;
  description: string;
}
```

### Deployment Structure
```typescript
interface DeploymentInfo {
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
```

## CORS Solution

This application uses Vite's built-in proxy to resolve CORS issues when making API calls to the backend server.

### Configuration

The `vite.config.ts` file includes a proxy configuration:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

### How it works

1. Frontend runs on `http://localhost:5173` (Vite dev server)
2. Backend runs on `http://localhost:8080`
3. All API calls use relative URLs (e.g., `/api/tracker-dashboard/components`)
4. Vite proxy forwards these requests to the backend server
5. No CORS issues because requests appear to come from the same origin

## API Endpoints

The application expects the following API endpoints on your backend:

- `GET /api/tracker-dashboard/components` - Get all components
- `GET /api/tracker-dashboard/components?eimId={eimId}` - Get components by EIM
- `GET /api/tracker-dashboard/history` - Get deployment history
- `GET /api/tracker-dashboard/history?eimId={eimId}` - Get history by EIM
- `GET /api/tracker-dashboard/eims` - Get all EIMs
- `GET /api/tracker-dashboard/search/{searchTerm}` - Search EIMs
- `GET /api/tracker-dashboard/servers` - Get server information

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure your backend server is running on `http://localhost:8080`

4. Open your browser to `http://localhost:5173`

## Development

- The application will automatically proxy API requests to your backend
- If the backend is unavailable, the app will fall back to mock data
- All API calls include error handling and graceful fallbacks
- EIM search supports searching by EIM number, name, or description

## Environment Variables

No environment variables are required for development. The proxy configuration handles the backend connection automatically.

## Production Deployment

For production deployment, you'll need to:

1. Update the API URLs in `src/data/mockData.ts` to point to your production backend
2. Remove the proxy configuration from `vite.config.ts`
3. Ensure your production backend has proper CORS headers configured 