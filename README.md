# PrepTracker

A learning plan tracker for Azure cloud architecture, C# language mastery, and competitive programming. Built with React + Azure Static Web Apps + Cosmos DB.

**Live:** https://lemon-beach-066ce8f10.7.azurestaticapps.net

## Features

- **Three learning tracks:** Azure & Cloud Architecture, C# Language Mastery, Competitive Programming (C#)
- **Tree & list views** with search and track filtering
- **Topic detail panel** with resources, architectural decision notes, and practice checklists
- **Status tracking** (Not Started → In Progress → Completed) with optimistic UI updates
- **Dashboard** with streak counter, weekly activity heatmap, progress rings, and badges
- **Dark/light theme** toggle
- **GitHub authentication** via Azure Static Web Apps built-in auth

## Architecture

```
Azure Static Web Apps (Free Tier)
├── Frontend: React + Vite + TypeScript + Tailwind CSS
├── API: Azure Functions v3 (Node.js 20, managed by SWA)
├── Auth: GitHub (built-in, zero config)
└── Data: Azure Cosmos DB (NoSQL) → DB "PrepTracker"
    ├── planItems (partition key: /userId)
    └── userStats (partition key: /userId)
```

**Cost: $0** — SWA free tier + existing Cosmos DB account.

## Project Structure

```
PrepTrackerApp/
├── client/                     # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/         # UI components (dashboard, plan, detail, layout)
│   │   ├── hooks/              # React hooks (useAuth, useTheme, useTreeBuilder)
│   │   ├── services/           # API client
│   │   ├── data/               # Seed data (full learning plan)
│   │   ├── lib/                # Utilities (badges, streaks, cn helper)
│   │   └── types/              # TypeScript types
│   └── public/                 # Static assets + SWA config
├── api/                        # Azure Functions (v3, plain JS)
│   ├── getPlanItems/           # GET /api/plan-items
│   ├── updateItemStatus/       # PATCH /api/plan-items/:id
│   ├── getUserStats/           # GET /api/user-stats
│   ├── init/                   # GET /api/init (combined items + stats)
│   ├── seedPlan/               # POST /api/seed
│   ├── health/                 # GET /api/health
│   └── shared/                 # Cosmos DB client singleton + auth helper
├── infra/                      # Bicep templates
│   ├── main.bicep
│   └── modules/
│       ├── cosmosDatabase.bicep
│       └── staticWebApp.bicep
└── .github/workflows/          # CI/CD
    └── deploy.yml
```

## Local Development

### Prerequisites

- Node.js 20+
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) (optional, for local API)
- [SWA CLI](https://azure.github.io/static-web-apps-cli/) (`npm install -g @azure/static-web-apps-cli`)

### Setup

```bash
# Install client dependencies
cd client && npm install

# Install API dependencies
cd ../api && npm install

# Start frontend dev server
cd ../client && npm run dev

# Or use SWA CLI for full-stack local dev (frontend + API + auth emulator)
cd .. && swa start http://localhost:5173 --api-location api
```

### Environment Variables (API)

Create `api/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_CONNECTION_STRING": "<your-cosmos-connection-string>"
  }
}
```

## Deployment

### Azure Resources

| Resource | Details |
|----------|---------|
| Static Web App | `prep-tracker-app` (Free tier, Central US) |
| Cosmos DB | Existing account → database `PrepTracker` |
| Resource Group (SWA) | `PrepTrackerApp` |

### Deploy with SWA CLI

```bash
cd client && npm run build
cd ..
npx swa deploy client/dist \
  --api-location api \
  --deployment-token <SWA_DEPLOYMENT_TOKEN> \
  --env production \
  --api-language node \
  --api-version 20
```

### Deploy with GitHub Actions

Push to `main` triggers `.github/workflows/deploy.yml`. Requires the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret set in the GitHub repo.

### Infrastructure (Bicep)

```bash
# Create Cosmos DB database + containers on existing account
az deployment group create \
  --resource-group <cosmos-rg> \
  --template-file infra/modules/cosmosDatabase.bicep \
  --parameters cosmosAccountName=<account-name>

# Create Static Web App
az deployment group create \
  --resource-group PrepTrackerApp \
  --template-file infra/modules/staticWebApp.bicep \
  --parameters name=prep-tracker-app
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/init` | Yes | Combined plan items + user stats (single call) |
| GET | `/api/plan-items?trackId=` | Yes | List plan items, optional track filter |
| PATCH | `/api/plan-items/:id` | Yes | Update item status |
| GET | `/api/user-stats` | Yes | Get streak, badges, activity |
| POST | `/api/seed` | Yes | Seed plan data (guarded, runs once) |
| GET | `/api/health` | No | Health check + Cosmos connectivity |

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Lucide icons, react-markdown, canvas-confetti, sonner (toasts)
- **API:** Azure Functions v3 (Node.js 20), @azure/cosmos
- **Data:** Azure Cosmos DB (NoSQL, SQL API)
- **Auth:** GitHub OAuth (SWA built-in)
- **Infra:** Bicep, GitHub Actions
- **Deployment:** Azure Static Web Apps CLI
