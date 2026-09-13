# Deployment & Operations Guide
## Little Steps – Trusted 24×7 Childcare Platform

**Document Version:** 1.0.0  
**Target Environments:** Local Dev, Staging (Render/Vercel), Production (AWS/GCP/Docker)  

---

## 1. Quick Start (Local Development)

### Prerequisites
* **Node.js**: v18.x or higher (v20+ or v22 LTS recommended)
* **npm**: v9.x or higher

### Step 1: Start Backend REST API
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm start
```
* The backend will start on **`http://localhost:5001`**.
* Verify health: `curl http://localhost:5001/api/health`

### Step 2: Start Frontend Web Application
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
* The React frontend will launch on **`http://localhost:5173`**.
* Open your browser at `http://localhost:5173` to explore the application.

---

## 2. Environment Variables

### Backend (`backend/.env`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` | HTTP port for the Express API server |
| `NODE_ENV` | `development` | Set to `production` in live environments |
| `CORS_ORIGIN` | `*` or `https://app.littlesteps.com` | Allowed frontend origin domains |

### Frontend (`frontend/.env`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `/api` | Base URL path proxied to backend |

---

## 3. Production Build & Static Bundling

### Building the Frontend
```bash
cd frontend
npm run build
```
This produces an optimized, minified single-page application bundle inside `frontend/dist/`.

### Serving Frontend via Express (Unified Deployment)
In a single-container deployment (e.g. AWS App Runner or Render Web Service), Express can serve the compiled frontend bundle directly:
```javascript
// backend/src/server.js
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
```

---

## 4. Cloud Deployment Profiles

### Option A: Vercel (Frontend) + Render (Backend)
1. **Frontend on Vercel**:
   * Root Directory: `frontend`
   * Build Command: `npm run build`
   * Output Directory: `dist`
   * Environment Variable: `VITE_API_BASE_URL=https://api.littlesteps.com`
2. **Backend on Render**:
   * Build Command: `npm install`
   * Start Command: `npm start`
   * Root Directory: `backend`

### Option B: Docker Container Deployment
A simple Dockerfile for containerized deployment:
```dockerfile
# Multi-stage Dockerfile
FROM node:22-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

ENV PORT=5001
ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "backend/src/server.js"]
```

---

## 5. Production Health Check & Monitoring
* **Liveness Endpoint**: `GET /api/health` returns `200 OK` with timestamp and uptime status.
* **Database Persistence**: Ensure write permissions exist on `backend/src/data/` if using file-backed storage, or link to a managed MongoDB/PostgreSQL instance for high-availability production clusters.
