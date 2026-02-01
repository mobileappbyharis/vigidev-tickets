# 🚀 Vercel Deployment Setup Guide

Ce guide t'explique comment configurer la migration de **Firebase Hosting vers Vercel** avec auto-déploiement via GitHub Actions.

## ✅ État actuel

- ✅ Projet **deployé en production** : https://vigitickets.vercel.app
- ✅ GitHub Actions workflow **configuré**
- ✅ vercel.json **mis à jour**
- ⏳ **Secrets GitHub à ajouter** (dernière étape)

---

## 🔐 Les secrets à ajouter à GitHub

Tu dois ajouter **5 secrets** dans GitHub pour que le déploiement automatique fonctionne correctement.

### 1️⃣ VERCEL_TOKEN (Token d'authentification Vercel)

**Où le trouver :**
1. Va sur : https://vercel.com/account/tokens
2. Clique sur **"Create Token"**
3. Nomme-le : `GitHub Actions`
4. Sélectionne : **Full Access** (ou **Production/Preview deployments**)
5. Copie le token généré

**À ajouter dans GitHub :**
```
Secret name: VERCEL_TOKEN
Secret value: vrv_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 2️⃣ VERCEL_ORG_ID (ID de ton organisation Vercel)

**Où le trouver :**

**Option A : Via l'API (rapide)** ✅
```bash
curl -H "Authorization: Bearer TON_VERCEL_TOKEN" https://api.vercel.com/v2/teams
```

Cherche `"slug"` ou `"id"` dans la réponse. Ça ressemblera à :
```
"id": "team_xxxxxxxxxxxxxx"
```

**Option B : Via le dashboard Vercel**
1. Va sur : https://vercel.com/account/team (ou clique sur ⚙️ → Team)
2. Cherche **Team ID** ou **Team Slug** dans les paramètres
3. C'est généralement un format comme : `team_xxxxxxx` ou ton username

**À ajouter dans GitHub :**
```
Secret name: VERCEL_ORG_ID
Secret value: team_lf1DbQXhLsC49vm5h12ZussN
```

---

### 3️⃣ VERCEL_PROJECT_ID (ID du projet Vercel)

✅ **Tu l'as déjà :**
```
VERCEL_PROJECT_ID = prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO
```

**Confirmation :** Tu peux aussi le trouver :
1. Sur Vercel Dashboard : https://vercel.com/dashboard
2. Clique sur le projet **VigiTickets**
3. Va dans **Settings** → **General**
4. Cherche **Project ID**

**À ajouter dans GitHub :**
```
Secret name: VERCEL_PROJECT_ID
Secret value: prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO
```

---

### 4️⃣ NEXT_PUBLIC_SUPABASE_URL

**Où le trouver :**
1. Va sur : https://supabase.com/dashboard/project/bgnzfhjsvldgejddzqtf
2. **Settings** → **API** (en bas à gauche)
3. Cherche **Project URL** (commence par `https://`)

**À ajouter dans GitHub :**
```
Secret name: NEXT_PUBLIC_SUPABASE_URL
Secret value: https://bgnzfhjsvldgejddzqtf.supabase.co
```

---

### 5️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY

**Où le trouver :**
1. **Même endroit que le SUPABASE_URL** : Supabase Dashboard → **Settings** → **API**
2. Cherche **Anon public key** (commence par `eyJ...`)

⚠️ **IMPORTANT** : C'est la clé **ANON**, pas la **Service Role Key** !

**À ajouter dans GitHub :**
```
Secret name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Secret value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Comment ajouter les secrets à GitHub

1. Va sur : **https://github.com/mobileappbyharis/vigidev-tickets**
2. Clique sur **Settings** (en haut)
3. Cherche **Secrets and variables** → **Actions** (à gauche)
4. Clique sur **"New repository secret"** pour chaque secret
5. Remplis :
   - **Name** : Le nom du secret (ex: `VERCEL_TOKEN`)
   - **Secret** : La valeur copiée
6. Clique **"Add secret"**

✅ Fais ça pour les 5 secrets

---

## 🔍 Vérification : Comment vérifier que ça marche

### Test 1 : Vérifier les secrets sont bien ajoutés
```bash
# Aucune commande bash pour ça, mais tu peux vérifier dans GitHub UI
# Settings → Secrets and variables → Actions
# Tu dois voir : VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Test 2 : Déclencher le déploiement
```bash
# Fais un petit changement et push
git add .
git commit -m "ci: trigger deployment"
git push origin main
```

### Test 3 : Vérifier le déploiement
1. Va sur : https://github.com/mobileappbyharis/vigidev-tickets/actions
2. Tu dois voir le workflow **"Deploy to Vercel"** en cours
3. Attends que ça devienne **✅ green**
4. Vérifie que le site : https://vigitickets.vercel.app fonctionne

---

## 🎯 Résumé : Étapes à suivre

| # | Action | Status |
|---|--------|--------|
| 1 | Créer VERCEL_TOKEN sur https://vercel.com/account/tokens | ⏳ À faire |
| 2 | Trouver VERCEL_ORG_ID (API ou dashboard) | ⏳ À faire |
| 3 | Confirmer VERCEL_PROJECT_ID = `prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO` | ✅ Fait |
| 4 | Récupérer NEXT_PUBLIC_SUPABASE_URL depuis Supabase | ⏳ À faire |
| 5 | Récupérer NEXT_PUBLIC_SUPABASE_ANON_KEY depuis Supabase | ⏳ À faire |
| 6 | Ajouter les 5 secrets dans GitHub Settings | ⏳ À faire |
| 7 | Trigger un déploiement (git push) | ⏳ À faire |
| 8 | Vérifier que tout marche ✅ | ⏳ À faire |

---

## 🚨 Troubleshooting

### Erreur : "Vercel Token not found"
→ Vérifie que `VERCEL_TOKEN` est bien ajouté dans GitHub Secrets

### Erreur : "Project ID not found"
→ Vérifie que `VERCEL_PROJECT_ID` est correct : `prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO`

### Erreur : "Organization ID not found"
→ Vérифie que `VERCEL_ORG_ID` est au bon format (commence par `team_` ou c'est ton username)

### Le déploiement ne se déclenche pas
→ Vérifie que le workflow `.github/workflows/vercel-deploy.yml` est valide (aucune erreur YAML)

### Le build échoue
→ Vérifie dans **GitHub Actions** → Le job échoue où exactement ?
- `npm run type-check` ?
- `npm run lint` ?
- `npm run build` ?

---

## 📚 Ressources

- Vercel Docs : https://vercel.com/docs
- GitHub Actions Secrets : https://docs.github.com/en/actions/security-guides/encrypted-secrets
- Supabase API Keys : https://supabase.com/docs/guides/api

---

**Une fois les secrets ajoutés → prochaine étape = vérifier le déploiement ! 🚀**
