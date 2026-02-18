# Project Hub

A personal project hub built with React, Vite, and TypeScript. This static site provides a clean and simple way to showcase your projects.

## Tech Stack

- React 19
- Vite 7
- TypeScript 5
- Static site (no backend)

## Local Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SkjalgN/project-hub.git
cd project-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Adding Projects

Projects are stored in `public/projects.json`. To add a new project:

1. Open `public/projects.json`
2. Add a new project object with the following structure:

```json
{
  "id": "unique-project-id",
  "name": "Project Name",
  "description": "A brief description of your project",
  "status": "active",
  "liveUrl": "https://example.com",
  "repoUrl": "https://github.com/username/repo",
  "tags": ["react", "typescript", "api"],
  "logo": "/images/logos/react.svg",
  "previewImage": "/images/previews/my-project.svg"
}
```

### Field Descriptions

- **id** (string, required): A unique identifier for the project (kebab-case recommended)
- **name** (string, required): The display name of the project
- **description** (string, required): A brief description of what the project does
- **status** (string, required): One of `"active"`, `"wip"`, or `"archived"`
  - `active`: Actively maintained projects
  - `wip`: Work in progress
  - `archived`: No longer maintained
- **liveUrl** (string, optional): URL to the live demo (leave empty string if not available)
- **repoUrl** (string, optional): URL to the GitHub repository (leave empty string if not available)
- **tags** (array, required): List of relevant tags for filtering (e.g., technologies, categories)
- **logo** (string, required): Path to the technology logo image (e.g., `/images/logos/react.svg`)
- **previewImage** (string, required): Path to the project preview/screenshot image (e.g., `/images/previews/my-project.svg`)

### Example

```json
{
  "id": "weather-dashboard",
  "name": "Weather Dashboard",
  "description": "A real-time weather application displaying current conditions and forecasts",
  "status": "active",
  "liveUrl": "https://weather-app.example.com",
  "repoUrl": "https://github.com/example/weather-dashboard",
  "tags": ["react", "typescript", "api", "frontend"],
  "logo": "/images/logos/react.svg",
  "previewImage": "/images/previews/weather-dashboard.svg"
}
```

## Deployment to Azure Static Web Apps

### Using Azure Portal

1. Build your project:
```bash
npm run build
```

2. Log in to the [Azure Portal](https://portal.azure.com)

3. Create a new Static Web App:
   - Search for "Static Web Apps" in the portal
   - Click "Create"
   - Fill in the required information:
     - Subscription
     - Resource Group
     - Name
     - Region
   
4. Configure deployment:
   - Choose GitHub as the source
   - Authorize Azure to access your repository
   - Select your repository and branch
   
5. Set build configuration:
   - App location: `/`
   - API location: (leave empty)
   - Output location: `dist`

6. Click "Review + Create" and then "Create"

### Using Azure CLI

1. Install Azure CLI if you haven't already:
```bash
# macOS
brew install azure-cli

# Windows (using installer)
# Download from https://aka.ms/installazurecliwindows

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

2. Login to Azure:
```bash
az login
```

3. Create a Static Web App:
```bash
az staticwebapp create \
  --name project-hub \
  --resource-group <your-resource-group> \
  --source https://github.com/<your-username>/project-hub \
  --location "westus2" \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

### GitHub Actions (Automatic Deployment)

When you create a Static Web App via Azure Portal, a GitHub Actions workflow is automatically added to your repository. This workflow will:

1. Build your project on every push to the main branch
2. Deploy the built files to Azure Static Web Apps
3. Provide preview deployments for pull requests

The workflow file will be located at `.github/workflows/azure-static-web-apps-<name>.yml`

### Manual Deployment

If you prefer manual deployment:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder using the Azure Static Web Apps CLI:
```bash
npm install -g @azure/static-web-apps-cli
swa deploy ./dist --app-name project-hub
```
