# 🚀 Guide de Déploiement VigiTickets

---

## Firebase Hosting (GCP Platform - Production)

### Option 1 : Via CLI Firebase

```bash
# Install Firebase CLI globally (si pas déjà installé)
npm i -g firebase-tools

# Login avec votre compte Google/GCP
firebase login

# Initialize Firebase project dans le dossier du projet
firebase init hosting

# Réponds aux questions :
# - Which Firebase project? → Select your GCP project
# - Public directory? → .next/static (déjà configuré dans firebase.json)
# - Configure as single-page app? → Yes
# - Setup GitHub Actions? → Yes (optional, pour auto-deploy)
# - Set up automatic builds and deploys with GitHub? → Yes

# Build the Next.js project
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Vérifiez la deployed app
firebase open hosting:site
```

### Configuration firebase.json

Le fichier `firebase.json` est déjà configuré avec :
- Public directory: `.next/static`
- Rewrites pour Single-Page App
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

### Environment Variables Setup

1. Go to [GCP Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Firebase → Settings → Environment Configuration
4. Add these environment variables for build process:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bgnzfhjsvldgejddzqtf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbnpmaGpzdmxkZ2VqZGR6cXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzY1MDMsImV4cCI6MjA4NTM1MjUwM30.ybXf98scocjBI0nqORsQQyqEoyOfAYUpo_k1Hd5GYwE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbnpmaGpzdmxkZ2VqZGR6cXRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTc3NjUwMywiZXhwIjoyMDg1MzUyNTAzfQ.YcYp1yrzsIjrWCS83qNB-Xeza_nsNzBN2vEQ7BszT8k

# Firebase/GCP Configuration
NEXT_PUBLIC_APP_URL=https://navi-f913a.web.app (or custom domain)
RESEND_API_KEY=re_xxxxx (optionnel, ajouter après setup Resend)
```

### Custom Domain (Optional)

1. Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter `tickets.vigidev.com`
4. Follow DNS verification steps (add TXT record)
5. Add CNAME record pointing to Firebase Hosting
6. Firebase SSL auto via Google-managed certificates

### Auto-Deploy Setup with GitHub Actions

GitHub Actions workflow is automatically created by `firebase init hosting --interactive`

À chaque `git push` sur `main` :
- GitHub Actions triggers Firebase build
- Build succeeds → Firebase automatically deploys to Hosting
- Live site updates with zero downtime

Optional: Manually configure `.github/workflows/firebase-hosting-pull-request.yml` and `.github/workflows/firebase-hosting-merge.yml`

---

## Cloud Run (Alternative for API/Backend)

Firebase Hosting is used for static Next.js frontend. Cloud Run can be used separately for:
- Custom API endpoints (Supabase Edge Functions recommended instead)
- Microservices or background jobs
- WebSocket servers for real-time features

For now, Supabase Edge Functions handle all backend logic:
- Notifications (via Deno runtime)
- Webhooks
- Custom business logic

**Note**: Direct Cloud Run deployment not needed for VigiTickets Phase 1-2. Use Firebase Hosting for frontend + Supabase Edge Functions for backend.

---

## GitHub Actions CI/CD

Firebase Hosting setup via `firebase init hosting --interactive` creates workflows automatically.

### Manual CI/CD Setup (if needed)

Create `.github/workflows/deploy.yml` for manual control:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-firebase-project-id
```

### Setup Firebase Service Account for GitHub Actions

1. GCP Console → Service Accounts
2. Create service account with roles: Firebase Admin, Firebase Hosting Admin
3. Create JSON key file
4. GitHub Repo → Settings → Secrets and variables → Actions
5. Add secret `FIREBASE_SERVICE_ACCOUNT` with the JSON key content

---

## Monitoring & Logs

### Firebase Console
- Dashboard shows deployment history, build logs, performance
- Check failed deployments in Activity section
- Real-time traffic monitoring via Analytics

### Supabase Logs
- Dashboard → Logs → Voir les erreurs API/Auth
- Database performance via Database menu
- Realtime subscriptions monitoring

### Error Tracking
- Setup Sentry (optional) for production errors
- Firebase integrations → Add error reporting
- Browser console errors via client-side monitoring

---

## Health Check & Status

### Local Test
```bash
curl http://localhost:3000/api/health
# Response: {"status":"ok","timestamp":"2025-01-30T...","environment":"development"}
```

### Production Test
```bash
curl https://your-project.web.app/api/health
curl https://tickets.vigidev.com/api/health (if custom domain configured)
```

---

## Rollback

### Firebase Hosting

```bash
# List all deployed versions
firebase hosting:channel:list

# Rollback to previous deployment
firebase hosting:clone CHANNEL_ID

# Or via Console:
# 1. Firebase Console → Hosting
# 2. Click "Releases"
# 3. Find previous release
# 4. Click menu → "Activate version"
```

---

## Performance Optimization

### Firebase Hosting
- CDN edge caching for all static assets globally
- Automatic compression (gzip, brotli)
- HTTP/2 server push for optimal delivery
- HTTP caching headers configured in firebase.json

### Next.js Level
- Image optimization automatic via Next.js
- Static generation (SSG) for public pages
- Server-side rendering (SSR) for dynamic content
- Code splitting and lazy loading

### Supabase
- Enable connection pooling for DB queries
- Setup caching policies for Realtime subscriptions
- Monitor DB performance in logs and metrics
- Use indexed columns for frequent queries

---

## Troubleshooting

### Build Fails on Firebase
1. Check logs in Firebase Console → Build
2. Check environment variables are set in `.env.local`
3. Run `npm run build` locally to debug
4. Commit fix → Push → GitHub Actions auto-redeploys

### Blank Page / 500 Error
1. Check `.env` variables are correct and loaded
2. Check Supabase is accessible from Firebase Hosting (no IP blocking)
3. Check browser console (F12) for errors
4. Check Firebase Hosting activity logs

### Slow Performance
1. Check Supabase query performance and indexes
2. Check image optimization in Next.js
3. Enable Firebase Performance Monitoring
4. Check if database queries use proper indexes
5. Verify CDN caching headers in firebase.json

### CORS Errors
1. Check Supabase CORS settings in project settings
2. Add Firebase domain to allowed origins in Supabase
3. Check API routes have proper CORS headers
4. Verify Authorization headers in requests

---

## Checklist Pré-Déploiement

- [ ] `.env.local` contient toutes les clés Supabase
- [ ] `npm run build` réussit localement
- [ ] `npm run type-check` passe sans erreurs
- [ ] Pas d'erreurs console en `npm run dev`
- [ ] Tests manuels complètent (si appliquable)
- [ ] Tous les commits sont pushés à GitHub
- [ ] `firebase init hosting` completed and workflows created
- [ ] GitHub secrets configured for Firebase deployment
- [ ] Health check `/api/health` répond 200 localement
- [ ] Supabase Edge Functions tested locally

---

## Support & Issues

### Resources
- Firebase Hosting Docs: https://firebase.google.com/docs/hosting
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Docs: https://supabase.com/docs
- GCP Console: https://console.cloud.google.com

### Common Issues
- See FOUNDATIONS.md "Debugging" section
- Check GitHub Issues for solutions
- Check Firebase Hosting activity logs for deployment errors
- Ask Claude for help with deployment or configuration

---

**Version**: 1.1 (Janvier 2025)
**Updated**: Migrated from Vercel to Firebase Hosting (GCP Platform)
**Status**: Ready for Phase 1 Production Deployment
