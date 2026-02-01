# 🚀 Guide de Déploiement VigiTickets

---

## Vercel Deployment (Production)

VigiTickets est déployé sur **Vercel** pour un déploiement rapide, fiable et facile à gérer.

### Option 1 : Déploiement automatique via GitHub Actions (Recommandé)

Le workflow `.github/workflows/vercel-deploy.yml` s'occupe du déploiement automatique :

- **Sur `main`** : Déploiement en production
- **Sur `develop`** : Déploiement en staging
- **Sur les PR** : Déploiement de preview automatique

À chaque `git push` :
```bash
git push origin main
# → GitHub Actions déclenche Vercel
# → Build + Test + Déploiement en ~2-3 min
# → App live à https://vigitickets.vercel.app
```

### Option 2 : Déploiement manuel via CLI (Rapide)

Pour tester rapidement en local :

```bash
# 1. Install Vercel CLI (si pas déjà fait)
npm i -g vercel

# 2. Login
vercel login

# 3. Build et déployer
npm run build
vercel deploy --prod
```

C'est beaucoup plus rapide que les GitHub Actions (2-3 min au lieu de 10).

### Configuration requise

**GitHub Secrets** (à configurer une seule fois) :

1. Va sur : https://github.com/mobileappbyharis/vigidev-tickets
2. Settings → Secrets and variables → Actions
3. Ajoute ces secrets :

```
VERCEL_TOKEN=<ton-token-vercel>
VERCEL_ORG_ID=<ton-org-id>
VERCEL_PROJECT_ID=<ton-project-id>
NEXT_PUBLIC_SUPABASE_URL=https://bgnzfhjsvldgejddzqtf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ta-cle-anon>
```

#### Comment obtenir les tokens Vercel :

1. **VERCEL_TOKEN** : https://vercel.com/account/tokens
   - Créer un nouveau token
   - Copy-paste dans GitHub Secrets

2. **VERCEL_ORG_ID** et **VERCEL_PROJECT_ID** :
   - Une fois le projet connecté sur Vercel
   - Settings → Project Settings → ID (en haut de la page)

### Environment Variables

**IMPORTANT**: Never commit real credentials to GitHub. Always use `.env.local` for secrets.

**Localement** (`.env.local` - NOT committed):
```env
NEXT_PUBLIC_SUPABASE_URL=https://bgnzfhjsvldgejddzqtf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**En production** (via Vercel Dashboard ou GitHub Secrets):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add custom domain → `tickets.vigidev.com`
3. Follow DNS setup instructions (add CNAME record)
4. SSL auto-configured by Vercel

### Monitoring & Logs

**Vercel Dashboard** : https://vercel.com/dashboard

- View deployment history
- Check build logs
- Monitor performance
- View analytics

**GitHub Actions** : https://github.com/mobileappbyharis/vigidev-tickets/actions

- Check workflow status
- View build logs in detail

### Preview Deployments

Chaque PR automatiquement :
1. Génère un URL de preview unique
2. Deploy la version PR avec les env vars
3. Affiche le lien dans les commentaires PR
4. Supprimé automatiquement quand la PR est fermée

Parfait pour tester avant de merger !

### Rollback

Si quelque chose se passe mal :

1. **Via Vercel Dashboard** :
   - Hosting → Deployments
   - Cliquer sur une version antérieure
   - Click "Promote to Production"

2. **Via git** :
   - `git revert <commit-sha>`
   - `git push origin main`
   - → Vercel redéploie automatiquement

### Performance

Vercel optimise automatiquement :
- ✅ Image optimization
- ✅ Code splitting
- ✅ CDN global caching
- ✅ Zero-downtime deployments
- ✅ Automatic scaling

### Troubleshooting

**Build fails** :
1. Check `.env` variables in Vercel dashboard
2. Check `npm run build` locally
3. Check GitHub Actions logs

**Slow performance** :
1. Check Supabase query performance
2. Enable Vercel Analytics
3. Check image optimization

**Domain not working** :
1. Check DNS records are propagated (wait 24h)
2. Check CNAME points to `cname.vercel-dns.com`
3. Check domain is verified in Vercel dashboard

---

## Supabase Configuration

Database: `bgnzfhjsvldgejddzqtf`
URL: https://supabase.com/dashboard/project/bgnzfhjsvldgejddzqtf

All tables have Row-Level Security (RLS) enabled. See FOUNDATIONS.md for details.

---

## Checklist Pré-Déploiement

- [ ] `.env.local` configuré localement
- [ ] `npm run build` réussit
- [ ] `npm run type-check` passe
- [ ] Pas d'erreurs console
- [ ] Tests manuels complets
- [ ] Tous les commits pushés
- [ ] GitHub Secrets configurés
- [ ] Vercel tokens configurés

---

**Version**: 2.0 (Février 2026)
**Updated**: Migrated to Vercel from Firebase
**Status**: Ready for Production Deployment
