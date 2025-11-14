# Video Games API (Backend + Frontend Demo)

This repository contains a small Express backend that exposes `/games` and `/users` resources, backed by SQLite for local development, and a minimal static frontend served from `public/index.html` that consumes those endpoints.

Quick start (Windows PowerShell):

1. Install dependencies:

```powershell
npm install
```

2. Set an API key (required by config) and start the server:

```powershell
$env:API_KEY = "dev-api-key-123"
node src/index.js
```

3. Open the demo in your browser:

http://localhost:3000/

Notes for deployment
- This project uses SQLite locally. For cloud deployment prefer Postgres and update `src/config/database.js` accordingly.
- For Render / Railway / Heroku, set `API_KEY` environment variable in the service settings.
    
If you want, I can prepare deployment configuration for Render (backend) and Vercel (frontend).
