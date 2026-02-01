# 🔐 GitHub Secrets Configuration Checklist

**URL où ajouter les secrets** : https://github.com/mobileappbyharis/vigidev-tickets/settings/secrets/actions

---

## ✅ Secrets à ajouter (5 au total)

### 1️⃣ VERCEL_TOKEN
**Catégorie** : Vercel Authentication
**Où obtenir** : https://vercel.com/account/tokens

**Instructions**:
1. Va sur https://vercel.com/account/tokens
2. Clique "Create Token"
3. Nomme le token: `GitHub Actions`
4. Permission: **Full Access**
5. Copie le token généré (commence par `vrv_`)
6. Ajoute dans GitHub Secrets

**Status**: ⏳ À faire
```
Secret name: VERCEL_TOKEN
Secret value: vrv_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 2️⃣ VERCEL_ORG_ID
**Catégorie** : Vercel Team/Organization
**Format** : `team_xxxxxxx` ou ton username

**Option A - Via l'API (Rapide)** ✅
```bash
# Exécute cette commande dans ton terminal avec le VERCEL_TOKEN ci-dessus
curl -H "Authorization: Bearer vrv_xxxx" https://api.vercel.com/v2/teams

# Cherche "id" ou "slug" dans la réponse
```

**Option B - Via Dashboard Vercel**
1. Va sur https://vercel.com/account/team
2. Cherche "Team ID" ou "Team Slug"
3. Copie la valeur

**Status**: ⏳ À faire
```
Secret name: VERCEL_ORG_ID
Secret value: team_xxxxxxxxxxxxxxxx (ou ton username)
```

---

### 3️⃣ VERCEL_PROJECT_ID
**Catégorie** : Vercel Project
**Valeur** : ✅ **DÉJÀ TROUVÉE**

```
Secret name: VERCEL_PROJECT_ID
Secret value: prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO
```

**Vérification** (optionnel):
1. Dashboard Vercel : https://vercel.com/dashboard
2. Clique sur "VigiTickets"
3. Settings → General → Project ID

**Status**: ✅ Fait (pré-rempli)

---

### 4️⃣ NEXT_PUBLIC_SUPABASE_URL
**Catégorie** : Supabase Configuration
**Valeur** : ✅ **DÉJÀ DISPONIBLE**

```
Secret name: NEXT_PUBLIC_SUPABASE_URL
Secret value: https://bgnzfhjsvldgejddzqtf.supabase.co
```

**Vérification** (optionnel):
1. Dashboard Supabase: https://supabase.com/dashboard/project/bgnzfhjsvldgejddzqtf
2. Settings → API (en bas)
3. Cherche "Project URL"

**Status**: ✅ Connu

---

### 5️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
**Catégorie** : Supabase API Key
**Type** : Anon public key (⚠️ PAS Service Role Key)

**Où obtenir**:
1. Dashboard Supabase: https://supabase.com/dashboard/project/bgnzfhjsvldgejddzqtf
2. Settings → API (en bas)
3. Cherche **"Anon public key"** (commence par `eyJ`)
4. Copie la clé

**⚠️ IMPORTANT** :
- ✅ Utilise la **clé ANON** (public, safe for frontend)
- ❌ N'utilise PAS la clé SERVICE_ROLE (secret, backend only)

**Status**: ⏳ À faire
```
Secret name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Secret value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs...
```

---

## 📝 Comment ajouter les secrets à GitHub

### Étape 1 : Va sur la page des secrets
**URL** : https://github.com/mobileappbyharis/vigidev-tickets/settings/secrets/actions

### Étape 2 : Pour chaque secret
1. Clique **"New repository secret"** (bouton vert en haut à droite)
2. **Name** : Copie exactement le nom du secret
3. **Secret** : Colle la valeur
4. Clique **"Add secret"**

### Étape 3 : Répète pour tous les secrets
Tu dois avoir 5 secrets au final:
- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## 🔍 Vérification

### Après avoir ajouté les secrets
1. Va sur: https://github.com/mobileappbyharis/vigidev-tickets/settings/secrets/actions
2. Tu dois voir les 5 secrets listés (avec des points noirs masquant les valeurs)
3. Si tu en vois moins → un secret n'a pas été ajouté

### Déclencher un test de déploiement
```bash
cd "/Users/haris/Documents/Navi AI Agents FZCO/Clients/Vigidev/Ticket WebApp/VigiTickets-CodeSource"

# Fais un petit changement (optionnel)
# git add .
# git commit -m "test: trigger deployment"

# Push pour déclencher le workflow
git push origin main
```

### Vérifier le déploiement
1. GitHub Actions: https://github.com/mobileappbyharis/vigidev-tickets/actions
2. Tu dois voir le workflow **"Deploy to Vercel"** en cours
3. Attends quelques minutes qu'il devienne **✅ green**
4. Visite https://vigitickets.vercel.app pour confirmer

---

## 🚨 Troubleshooting

### ❌ "Secret not found" error
→ Vérifie que tu as bien cliqué "Add secret" pour ce secret
→ Vérifie que le nom est exactement correct (cas sensible)

### ❌ "Vercel Token invalid"
→ Crée un nouveau token: https://vercel.com/account/tokens
→ Utilise "Full Access"

### ❌ Le workflow ne s'exécute pas
→ Vérifie que les 5 secrets sont bien ajoutés
→ Recharge la page GitHub Actions (F5)
→ Fais un nouveau push: `git push origin main`

### ❌ Le build échoue
→ Regarde le log du workflow sur GitHub Actions
→ Il devrait dire exactement où ça échoue
→ Erreurs possibles: npm, type-check, lint, build

---

## 📚 Ressources

- GitHub Secrets Doc : https://docs.github.com/en/actions/security-guides/encrypted-secrets
- Vercel API Keys : https://vercel.com/account/tokens
- Supabase Project : https://supabase.com/dashboard/project/bgnzfhjsvldgejddzqtf
- Vercel Project : https://vercel.com/dashboard/project-settings?project=vigitickets

---

## ✅ Résumé des étapes

| # | Action | Status |
|----|--------|--------|
| 1 | Créer VERCEL_TOKEN (https://vercel.com/account/tokens) | ⏳ À faire |
| 2 | Trouver VERCEL_ORG_ID (API ou dashboard) | ⏳ À faire |
| 3 | Confirmer VERCEL_PROJECT_ID = `prj_GJOuzLmBDzFZciMDbmAYKjRQmqrO` | ✅ Fait |
| 4 | Récupérer NEXT_PUBLIC_SUPABASE_URL | ✅ Connu: `https://bgnzfhjsvldgejddzqtf.supabase.co` |
| 5 | Récupérer NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase Dashboard) | ⏳ À faire |
| 6 | Ajouter les 5 secrets dans GitHub | ⏳ À faire |
| 7 | Déclencher un test: `git push origin main` | ⏳ À faire |
| 8 | Vérifier GitHub Actions → workflow ✅ green | ⏳ À faire |
| 9 | Confirmer site fonctionne: https://vigitickets.vercel.app | ⏳ À faire |

---

**Une fois complété → Migration Firebase → Vercel = COMPLÈTE ✅**

**Questions ?** Voir [VERCEL_SETUP.md](./VERCEL_SETUP.md) ou [CONFIG_UPDATE_SUMMARY.md](./CONFIG_UPDATE_SUMMARY.md)
