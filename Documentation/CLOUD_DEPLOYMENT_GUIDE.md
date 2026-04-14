# UConnect Cloud Deployment Guide (No Self-Hosted Server)

This guide is for deploying UConnect to cloud platforms, not your own server.

It is beginner-focused and uses managed services so SSL, uptime, and scaling are easier.

---

## 1. Recommended Cloud Architecture

Use this setup:

- Frontend (Angular): Netlify or Vercel
- Backend (Node.js API): Render Web Service
- Database (MySQL): Railway MySQL or PlanetScale MySQL
- Domain and SSL: handled by your frontend and backend cloud providers

Why this is good for non-coders:

- No VPS setup
- No manual SSL certificate installation
- Automatic HTTPS
- Easy environment variable management in dashboards

---

## 2. Accounts You Need

Create these accounts first:

1. GitHub account
2. Render account (backend)
3. Netlify or Vercel account (frontend)
4. Railway or PlanetScale account (MySQL)
5. Optional: domain registrar account (for custom domain)

---

## 3. Before Deployment (Local Checks)

In your local project:

1. Backend build must pass: npm run build in UConnect-Backend
2. Frontend build must pass: npm run build in UConnect-Frontend
3. Push latest code to GitHub

---

## 4. Deploy the Database (Managed MySQL)

Choose one managed MySQL provider:

- Railway MySQL (easy)
- PlanetScale (production-friendly)

After creating the MySQL instance, copy these values:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

You will use these in backend environment variables.

---

## 5. Deploy the Backend on Render

### 5.1 Create the service

1. Open Render dashboard
2. Click New > Web Service
3. Connect your GitHub repo
4. Select repo path: UConnect-Backend
5. Runtime: Node

### 5.2 Build and start commands

- Build Command: npm install ; npm run build
- Start Command: npm run start

### 5.3 Set backend environment variables

Add these in Render Environment section:

- PORT=3000
- FRONTEND_ORIGIN=https://your-frontend-domain
- PUBLIC_BASE_URL=https://your-backend-domain
- DB_HOST=from managed mysql
- DB_PORT=from managed mysql
- DB_USER=from managed mysql
- DB_PASSWORD=from managed mysql
- DB_NAME=from managed mysql
- ADMIN_KEY=your-strong-secret-admin-key

Important:

- FRONTEND_ORIGIN must exactly match your frontend domain
- PUBLIC_BASE_URL must be your backend HTTPS URL

### 5.4 Deploy and verify backend

After deploy, open:

- https://your-backend-domain/api/health

Expected response:
{"status":"healthy"}

If health is not working, check Render logs first.

---

## 6. Deploy the Frontend (Netlify or Vercel)

The frontend uses runtime env generation from .env during build.
Set API_BASE_URL in cloud environment variables.

### Option A: Netlify

1. New site from Git
2. Choose repository and set base directory: UConnect-Frontend
3. Build command: npm run build
4. Publish directory: dist/adet-fe-bsit21/browser
5. Add environment variable:
   API_BASE_URL=https://your-backend-domain/api
6. Deploy site

### Option B: Vercel

1. New project from GitHub repo
2. Root directory: UConnect-Frontend
3. Build command: npm run build
4. Output directory: dist/adet-fe-bsit21/browser
5. Add environment variable:
   API_BASE_URL=https://your-backend-domain/api
6. Deploy project

---

## 7. Connect Frontend and Backend Correctly

After both are online:

1. Confirm backend allows frontend domain in FRONTEND_ORIGIN
2. Confirm frontend API_BASE_URL points to backend API URL
3. Open app URL and test Home, Map, Admin pages

---

## 8. Custom Domain and SSL (Cloud Managed)

### Frontend domain

In Netlify or Vercel:

1. Add custom domain
2. Update DNS at your registrar
3. Wait for SSL to be auto-provisioned

### Backend domain

In Render:

1. Add custom domain to Web Service
2. Update DNS records
3. Wait for SSL activation

After both are active:

- Update FRONTEND_ORIGIN and API_BASE_URL to custom domains
- Redeploy frontend and backend

---

## 9. Production Environment Checklist

Before going live, verify:

1. ADMIN_KEY is strong and private
2. DB credentials are private and only in cloud env vars
3. .env files are not committed to Git
4. Frontend and backend are HTTPS only
5. Health endpoint works
6. CORS allows only your real frontend domain
7. Admin actions (create/edit/delete) work with valid key only

---

## 10. Common Deployment Errors and Fixes

### Error: CORS blocked

Fix:

- FRONTEND_ORIGIN in backend must exactly match frontend URL
- Include protocol, for example https://app.example.com

### Error: Frontend loads but no data

Fix:

- Check API_BASE_URL in frontend cloud env vars
- Confirm backend URL is public and healthy

### Error: Backend cannot connect to DB

Fix:

- Recheck DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- Check if DB provider requires IP allowlist or SSL options

### Error: 401 on admin actions

Fix:

- Use exact ADMIN_KEY from backend environment

### Error: Build passes locally but fails in cloud

Fix:

- Confirm root directory is correct
- Confirm build and output paths are correct
- Confirm environment variables are set in cloud dashboard

---

## 11. Suggested Release Flow (Simple)

For each release:

1. Test locally first
2. Push to GitHub main branch
3. Cloud auto-deploy runs
4. Check frontend page and backend health
5. Smoke test Home, Map, and Admin

---

## 12. Security Rules for This Project

Never put these in frontend env:

- DB credentials
- ADMIN_KEY
- Any private secrets

Frontend env values are public by nature.
Only backend cloud env should contain real secrets.

---

If you want, a third document can be added next for rollback and incident recovery (what to do if deployment breaks in production).
