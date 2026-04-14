# UConnect Cloud Deployment Guide

This guide uses one clear deployment path:

- Database: Railway MySQL
- Backend: Render Web Service
- Frontend: Vercel

Use this if you want the simplest setup with the fewest moving parts.

---

## 1. Deployment Order

Deploy in this order:

1. Railway database
2. Render backend
3. Vercel frontend

This order matters because the frontend needs the backend URL, and the backend needs the database connection.

---

## 2. What Each Platform Does

- Railway stores the MySQL data
- Render runs the Node.js backend API
- Vercel serves the Angular frontend

Do not mix their internal connection values.

---

## 3. Prepare the Project Locally

Before cloud deployment, make sure these commands pass:

1. In `UConnect-Backend`, run `npm run build`
2. In `UConnect-Frontend`, run `npm run build`
3. Push the final code to GitHub

If both builds pass locally, the cloud deployment is much easier.

---

## 4. Railway Database Setup

### 4.1 Create the database

1. Open Railway.
2. Create a new MySQL database.
3. Wait until the database is online.

### 4.2 Copy the connection string

Railway gives you a public connection string named `MYSQL_PUBLIC_URL`. It usually looks like this:

```text
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

### 4.3 Example Railway values

Example only:

```text
MYSQL_PUBLIC_URL=mysql://root:password@containers-us-west-xxx.railway.app:3306/railway
```

Use your real Railway value from the dashboard.

### 4.4 What to send to Render

```text
DATABASE_URL=<value from Railway MYSQL_PUBLIC_URL>
```

---

## 5. Render Backend Setup

### 5.1 Create the service

1. Open Render.
2. Create a new Web Service.
3. Connect your GitHub repository.
4. Select the backend folder as the root directory.
5. Choose Node as the runtime.

### 5.2 Build and start commands

Use these commands:

```bash
npm install ; npm run build
```

```bash
npm run start
```

### 5.3 Backend environment variables

Set these in Render:

```text
ADMIN_KEY=uconnect-admin
DATABASE_URL=<paste Railway MYSQL_PUBLIC_URL here>
```

Example:

```text
ADMIN_KEY=uconnect-admin
DATABASE_URL=mysql://root:password@containers-us-west-xxx.railway.app:3306/railway
```

### 5.4 Backend health check

After deployment, open:

```text
https://your-render-service-name.onrender.com/api/health
```

Expected response:

```json
{ "status": "healthy" }
```

If you use a custom backend domain later, replace the Render URL with that domain.

---

## 6. Vercel Frontend Setup

### 6.1 Create the project

1. Open Vercel.
2. Import your GitHub repository.
3. Select the frontend folder as the root directory.
4. Use the default Angular build settings.

### 6.2 Frontend build command

Vercel should run the frontend build normally. The project already supports reading `API_BASE_URL` during build.

### 6.3 Frontend environment variable

Set this in Vercel:

```text
API_BASE_URL=https://your-render-service-name.onrender.com/api
```

Example:

```text
API_BASE_URL=https://uconnect-backend-z9mp.onrender.com/api
```

This is the most important frontend setting.

---

## 7. Connect Backend and Frontend

After both are deployed:

1. Open your Render backend service.
2. Go to the service page and open the Environment tab.
3. Add `FRONTEND_ORIGIN` there.
4. Paste the exact public frontend URL as the value.
5. Save the environment variable and redeploy the backend.
6. Open the frontend and check the Home and Map pages.

Example value:

```text
FRONTEND_ORIGIN=https://your-frontend-domain
```

Important:

- Do not add a trailing slash to `FRONTEND_ORIGIN`
- Use the exact public frontend URL

---

## 8. What Goes in Each Environment

### Render backend

```text
DATABASE_URL=mysql://user:password@host:3306/database
ADMIN_KEY=uconnect-admin
FRONTEND_ORIGIN=https://u-connect-theta.vercel.app
```

Set `FRONTEND_ORIGIN` after the Vercel frontend is deployed.

### Vercel frontend

```text
API_BASE_URL=https://uconnect-backend-z9mp.onrender.com/api
```

### Railway database

```text
Database URL or MySQL host/user/password values
```

---

## 9. Final Verification

After deployment, test these URLs:

```text
https://uconnect-backend-z9mp.onrender.com/api/health
https://uconnect-backend-z9mp.onrender.com/api/locations
https://uconnect-backend-z9mp.onrender.com/api/announcements
```

Then open the frontend and confirm:

1. Locations load on the map
2. Announcements appear on the home page
3. Admin page can read and manage data with the correct admin key

---

## 10. Security Rules

Never put these in Vercel frontend env vars:

- `ADMIN_KEY`
- `DATABASE_URL`
- Database password
- Any private backend secret

Only backend env vars should contain private values.

---
<<<<<<< HEAD
=======

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
>>>>>>> cfa99719372707c85d951b08f81f56ac5708b871
