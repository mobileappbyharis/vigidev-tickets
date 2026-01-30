# 🚀 Guide de Déploiement VigiTickets

---

## Vercel (Recommandé pour MVP)

### Option 1 : Via Interface Web Vercel

1. Go to https://vercel.com/dashboard
2. Sign in avec `pgmhaouassi@gmail.com`
3. Click "Add New..." → "Project"
4. Import GitHub repo `mobileappbyharis/vigidev-tickets`
5. Configure environment variables :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL=https://vigitickets.vercel.app`
   - `RESEND_API_KEY` (optionnel, ajouter plus tard)
6. Click "Deploy"
7. Domain sera `https://vigitickets.vercel.app`

### Option 2 : Via CLI Vercel

```bash
# Install Vercel CLI globally (si pas déjà installé)
npm i -g vercel

# Login (utilise pgmhaouassi@gmail.com)
vercel login

# Dans le dossier du projet
vercel

# Réponds aux questions :
# - Set up and deploy? → Yes
# - Which scope? → mobileappbyharis
# - Link to existing project? → No (first time)
# - Project name? → vigitickets
# - Root directory? → ./
# - Build command? → npm run build
# - Start command? → npm start

# Ajoute les env vars via Vercel dashboard ou :
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
```

### Configuration Environment Variables (Vercel)

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add these variables for **Production**, **Preview**, **Development** :

```env
NEXT_PUBLIC_SUPABASE_URL=https://tzmilnltvvtsvdmrkhin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://vigitickets.vercel.app  (ou ton domain custom)
RESEND_API_KEY=re_xxxxx (ajouter après setup Resend)
```

### Custom Domain (Optional)

1. Vercel Dashboard → Domains
2. Add custom domain : `tickets.vigidev.com`
3. Ajoute CNAME record DNS pointant vers Vercel
4. Vercel SSL auto via ACME

### Auto-Deploy Setup

Already configured via GitHub integration. À chaque `git push` sur `main` :
- Vercel build automatiquement
- Tests passent → Deploy automatic

---

## Google Cloud Run (Alternative Production)

### Build & Push Docker Image

```bash
# Authentifie avec GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/vigitickets:latest .

# Push vers Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/vigitickets:latest
```

### Déploie sur Cloud Run

```bash
gcloud run deploy vigitickets \
  --image gcr.io/YOUR_PROJECT_ID/vigitickets:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars \
    NEXT_PUBLIC_SUPABASE_URL=https://tzmilnltvvtsvdmrkhin.supabase.co,\
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...,\
    SUPABASE_SERVICE_ROLE_KEY=eyJ...,\
    NEXT_PUBLIC_APP_URL=https://vigitickets-xxxxx.run.app,\
    RESEND_API_KEY=re_xxxxx \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --allow-unauthenticated
```

### Connect Custom Domain (GCP)

1. GCP Console → Cloud Run → vigitickets
2. Custom Domains → Map Custom Domain
3. Add `tickets.vigidev.com`
4. Configure DNS CNAME

---

## GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
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

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

To setup secrets :
1. Generate token : https://vercel.com/account/tokens
2. GitHub Repo → Settings → Secrets and variables → Actions
3. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## Monitoring & Logs

### Vercel Analytics
- Dashboard shows build times, deployment history, performance
- Check failed deployments → see error logs

### Supabase Logs
- Dashboard → Logs → Voir les erreurs API/Auth
- Database performance via Database menu

### Error Tracking
- Setup Sentry (optional) pour production errors
- Vercel integrations → Add Sentry

---

## Health Check & Status

### Local Test
```bash
curl http://localhost:3000/api/health
# Response: {"status":"ok","timestamp":"2025-01-30T...","environment":"development"}
```

### Production Test
```bash
curl https://vigitickets.vercel.app/api/health
curl https://tickets.vigidev.com/api/health (si custom domain)
```

---

## Rollback

### Vercel
1. Dashboard → Deployments
2. Click déploiement précédent
3. Click "Promote to Production"

### GCP Cloud Run
```bash
gcloud run deploy vigitickets \
  --image gcr.io/YOUR_PROJECT_ID/vigitickets:PREVIOUS_TAG
```

---

## Performance Optimization

### Vercel
- Image optimization automatic via Next.js
- Serverless functions auto-scaled
- Edge caching for static assets
- ISR (Incremental Static Regeneration) configured

### Supabase
- Enable connection pooling for DB
- Setup caching policies for Realtime
- Monitor DB performance in logs

---

## Troubleshooting

### Build Fails on Vercel
1. Check logs in Vercel Dashboard
2. Check environment variables are set
3. Run `npm run build` locally to debug
4. Commit fix → Push → Auto-redeploy

### Blank Page / 500 Error
1. Check `.env` variables are correct
2. Check Supabase is accessible from Vercel (no IP blocking)
3. Check browser console for errors
4. Check Vercel function logs

### Slow Performance
1. Check Supabase query performance
2. Check image optimization
3. Enable Vercel Analytics
4. Check if database indexes are used

### CORS Errors
1. Check Supabase CORS settings
2. Add Vercel domain to allowed origins in Supabase
3. Check API routes headers

---

## Checklist Pré-Déploiement

- [ ] `.env.local` contient toutes les clés
- [ ] `npm run build` réussit localement
- [ ] `npm run type-check` passe
- [ ] Pas d'erreurs console en `npm run dev`
- [ ] Tests manuels complètent (si appliquable)
- [ ] Tous les commits sont pushés
- [ ] Variables d'env configurées sur Vercel
- [ ] Health check `/api/health` répond 200

---

## Support & Issues

### Resources
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Docs: https://supabase.com/docs

### Common Issues
- See FOUNDATIONS.md "Debugging" section
- Check GitHub Issues for solutions
- Ask Claude for help with deployment errors

---

**Version**: 1.0 (Janvier 2025)
**Updated**: After Phase 1 Foundation Setup
