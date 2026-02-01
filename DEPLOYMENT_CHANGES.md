# 📋 Changements de Configuration Vercel Deployment

## 🎯 Objectif
Migration complète de **Firebase Hosting → Vercel** avec CI/CD automatique via GitHub Actions.

---

## ✅ Changements effectués

### 1. `.github/workflows/vercel-deploy.yml`

**❌ Avant (Ancienne config Firebase)**
```yaml
- Environnement développement + production désorganisé
- Actions Vercel obsolètes (amondnet/vercel-action@v25)
- Pas de vérification d'erreur lors du build
- Variables d'env mal gérées
```

**✅ Après (Nouvelle config Vercel optimisée)**
```yaml
✓ Trigger seulement sur 'main' (pas 'develop')
✓ Actions à jour (amondnet/vercel-action@v25.2.0)
✓ Node.js setup amélioré (v4)
✓ Checkout modernisé (v4)
✓ Environment variables centralisées en top-level
✓ Condition production correcte : déploiement en PROD seulement sur main + push
✓ PR trigger pour preview deployments
✓ Job nommé clairement : 'build-and-deploy'
```

### 2. `vercel.json`

**❌ Avant (Minimale)**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "next dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**✅ Après (Configuration complète)**
```json
{
  // Build & Dev commands
  "buildCommand": "npm run build",
  "devCommand": "next dev",
  "installCommand": "npm ci",

  // Framework
  "framework": "nextjs",
  "outputDirectory": ".next",

  // ✨ NEW: Environment variables
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key"
  },

  // ✨ NEW: Region (Frankfurt = plus proche de la France)
  "regions": ["fra1"],

  // ✨ NEW: Timeout API routes
  "functions": {
    "app/api/**": {
      "maxDuration": 60
    }
  }
}
```

---

## 🔐 Secrets GitHub à ajouter (5 au total)

### Credentials Vercel (3)

| Secret | Valeur | Où le trouver |
|--------|--------|---------------|
| `VERCEL_TOKEN` | `vrv_xxxx...` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_xxxx...` ou username | https://api.vercel.com/v2/teams (avec token) |
| `VERCEL_PROJECT_ID` | `prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO` ✅ | Dashboard Vercel → Settings |

### Credentials Supabase (2)

| Secret | Valeur | Où le trouver |
|--------|--------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tzmilnltvvtsvdmrkhin.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → Settings → API → Anon key |

---

## 🚀 Flux de déploiement (Après configuration)

```
1. Developer pushes to main
   ↓
2. GitHub Actions triggered (vercel-deploy.yml)
   ├── Checkout code
   ├── Setup Node.js 20
   ├── npm ci
   ├── npm run type-check
   ├── npm run lint
   ├── npm run build (avec Supabase secrets)
   └── Deploy to Vercel (avec Vercel secrets)
   ↓
3. Vercel builds + deploys
   ├── Install dependencies
   ├── Run build command (npm run build)
   ├── Use environment variables (from vercel.json + GitHub Secrets)
   └── Deploy to production (https://vigitickets.vercel.app)
   ↓
4. Live!
   ├── Preview URL for PRs
   ├── Production URL for main
   └── Automatic rollback on error
```

---

## 📋 Checklist de configuration

- [ ] Créer VERCEL_TOKEN sur https://vercel.com/account/tokens
- [ ] Récupérer VERCEL_ORG_ID (API ou dashboard)
- [ ] Confirmer VERCEL_PROJECT_ID = `prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO`
- [ ] Récupérer NEXT_PUBLIC_SUPABASE_URL depuis Supabase
- [ ] Récupérer NEXT_PUBLIC_SUPABASE_ANON_KEY depuis Supabase
- [ ] Ajouter les 5 secrets dans GitHub (Settings → Secrets and variables → Actions)
- [ ] Trigger un test de déploiement (git push)
- [ ] Vérifier que https://vigitickets.vercel.app fonctionne
- [ ] Vérifier que les variables Supabase sont bien chargées

---

## 🔗 Références rapides

### GitHub Secrets
https://github.com/mobileappbyharis/vigidev-tickets/settings/secrets/actions

### Vercel Project
https://vercel.com/dashboard/project-settings?project=vigitickets

### Supabase Project
https://supabase.com/dashboard/project/tzmilnltvvtsvdmrkhin/settings/api

### CI/CD Status
https://github.com/mobileappbyharis/vigidev-tickets/actions

---

## 💡 Améliorations effectuées

✅ **Workflow GitHub Actions**
- Trigger clarifié (main seulement)
- Production deployment condition correcte
- Variables d'env centralisées
- Actions à jour

✅ **vercel.json**
- Environment variables déclarées
- Région Vercel optimisée (Frankfurt)
- Timeout API routes configuré
- Prêt pour production

✅ **Documentation**
- `VERCEL_SETUP.md` : Guide complet d'installation
- `DEPLOYMENT_CHANGES.md` : Ce fichier

---

## 🎯 Prochaines étapes

1. **Ajouter les 5 secrets GitHub** (voir tableau ci-dessus)
2. **Trigger un déploiement test** : `git push origin main`
3. **Vérifier dans GitHub Actions** : https://github.com/mobileappbyharis/vigidev-tickets/actions
4. **Confirmer le site fonctionne** : https://vigitickets.vercel.app

**Une fois fait → Migration Firebase → Vercel = COMPLÈTE ✅**

---

**Date d'update** : 2025-02-01
**Status** : ⏳ En attente des GitHub Secrets
