# Deploying GemRealty to Google Cloud using Podman and Cloud Run

This guide provides step-by-step instructions to containerize both the backend (FastAPI) and frontend (React/Vite) of GemRealty and deploy them to Google Cloud Run.

## Prerequisites
1. A Google Cloud Platform (GCP) account and a project.
2. [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install) installed and authenticated.
3. [Podman](https://podman.io/) installed locally (optional, for local testing).
4. Enable the following APIs in your GCP Project:
   - Cloud Run API
   - Artifact Registry API
   - Cloud Build API

*Run this to authenticate and set your project:*
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

---

## Part 1: Deploying the Backend (FastAPI)

We will use Cloud Run to host the backend container.

### 1. Create the Backend `Dockerfile`
Create a file named `Dockerfile` in the `backend/` directory:

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port Cloud Run uses
EXPOSE 8080

# Run the FastAPI server
# Cloud Run automatically sets the PORT environment variable to 8080
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
```

### 2. Deploy to Cloud Run
From inside the `backend/` directory, run the following command to build and deploy straight from source:

```bash
cd backend
gcloud run deploy gemrealty-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```
*Note the Service URL returned by this command (e.g., `https://gemrealty-backend-xxx.run.app`). You will need this for the frontend.*

---

## Part 2: Deploying the Frontend (React + Vite)

The frontend needs to be built into static files and served by a lightweight web server like Nginx.

### 1. Create an Nginx Configuration
Create `nginx.conf` in the `frontend/gemrealty/` directory to handle React Router's client-side routing:

```nginx
# frontend/gemrealty/nginx.conf
server {
    listen 8080;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### 2. Create the Frontend `Dockerfile`
Create a `Dockerfile` in the `frontend/gemrealty/` directory:

```dockerfile
# frontend/gemrealty/Dockerfile

# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Build the app (make sure you pass standard VITE env vars like Map keys!)
# It's better to provide these using --build-arg if they shouldn't be publicly hardcoded
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (must match nginx.conf)
EXPOSE 8080

# Cloud Run sets the PORT env var; we use envsubst to replace it dynamically or just rely on our config
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Configure Frontend Environment Variables
Before deploying, ensure your Vite frontend knows where the backend is located. You can either:
- Update your absolute URLs in the frontend code to point to `/api` and rely on CORS.
- Set an environment variable targeting the **Backend Service URL** you got from Part 1. For example, if your code looks for `import.meta.env.VITE_API_URL`, you can pass it to the build.

### 4. Deploy to Cloud Run
From inside the `frontend/gemrealty/` directory, deploy using `gcloud`:

```bash
cd frontend/gemrealty

# Deploy to Cloud Run
gcloud run deploy gemrealty-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars=VITE_GOOGLE_MAPS_API_KEY="Your-Maps-API-Key"
```

*Note: Since Vite bundles environment variables at build-time, you might need to use Cloud Build separately if you want to inject `VITE_` variables securely during the Podman build stage, or commit an `.env.production` file to your build.*

---

## Part 3: Architecture Summary

By now, you have two scalable microservices running on Google Cloud Run:
- **gemrealty-backend**: Python FastAPI handling the chat logic and database APIs.
- **gemrealty-frontend**: Nginx container serving React SPA static files.

### Optional Improvements for Production:
1. **CORS Configuration**: Ensure your backend FastAPI `app.add_middleware(CORSMiddleware, ...)` allows the frontend's Cloud Run URL.
2. **Custom Domains**: You can map custom domains to your Cloud Run services directly from the GCP Console (Cloud Run -> Manage Custom Domains).
3. **Artifact Registry**: For CI/CD, you can build your container images using Podman and push them to Google Artifact Registry first, then deploy using `--image`.
