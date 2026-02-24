# Backend Service

## Run locally

```bash
npm install
npm start
```

Service defaults:

- Port: `3000` (override with `PORT`)
- Health endpoint: `/health`

## Environment variables

- `PORT`: Server port (set automatically by Render in production)
- `FRONTEND_ORIGINS`: Comma-separated CORS allowlist
  - Example: `https://yourusername.github.io/Big-Data-Algorithms-2024-Fall-Rutgers,http://localhost:5173`

You can copy `backend/.env.example` for local reference.

## Deploy on Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/health`
- Set `FRONTEND_ORIGINS` to your GitHub Pages URL and local dev URL.