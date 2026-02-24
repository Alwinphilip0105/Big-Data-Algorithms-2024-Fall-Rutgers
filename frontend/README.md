# Frontend (Vite + React)

## Local development

1. Create env file from example:

```bash
copy .env.example .env
```

2. Set API URL in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

3. Install and run:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

- Automated deployment uses repository workflow [deploy-frontend-pages.yml](../.github/workflows/deploy-frontend-pages.yml).
- Before deploying, set GitHub repository variable `VITE_API_BASE_URL` to your hosted backend URL.

Optional manual deployment:

```bash
npm run deploy
```
