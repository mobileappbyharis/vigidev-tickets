# 🔐 Configuration GCP & Firebase

Document centralisé pour toutes les infos GCP et Firebase du projet VigiTickets.

---

## 📋 Informations Projet GCP

### Organisation
- **Nom** : naviassistant.ai
- **URL** : https://console.cloud.google.com

### Projet Firebase
- **Nom du Projet** : navi-f913a (VigiTickets)
- **Numéro du Projet** : 824692790883
- **ID du Projet** : navi-f913a
- **Firebase Console** : https://console.firebase.google.com/project/navi-f913a

### Régions & Localisation
- **Région Supabase** : Europe (us-east-1 équivalent)
- **Région Firebase Hosting** : Edge cache global (cdn via Fastly)

---

## 🔑 Authentification & Clés

### Service Account pour CI/CD

**Nom du compte de service** : `firebase-adminsdk@navi-f913a.iam.gserviceaccount.com`

#### Créer une Clé JSON (pour GitHub Actions)

1. **GCP Console** : https://console.cloud.google.com/iam-admin/serviceaccounts
2. Sélectionner le projet `navi-f913a`
3. Cliquer sur le compte de service `firebase-adminsdk@...`
4. Onglet "Clés" → "Ajouter une clé" → "Créer une nouvelle clé"
5. Format : JSON
6. La clé sera téléchargée (garder privé !)

#### Alternative via `gcloud` CLI

```bash
# Set the GCP project
gcloud config set project navi-f913a

# Create service account key
gcloud iam service-accounts keys create ~/firebase-key.json \
  --iam-account=firebase-adminsdk@navi-f913a.iam.gserviceaccount.com

# Verify the key
cat ~/firebase-key.json
```

### GitHub Actions Secret

La clé JSON créée doit être ajoutée dans GitHub comme secret :

**Repo** : https://github.com/mobileappbyharis/vigidev-tickets

**Chemin** : Settings → Secrets and variables → Actions

**Secret Name** : `FIREBASE_SERVICE_ACCOUNT_NAVI_F913A`

**Value** : Contenu complet du fichier JSON (3-4 lignes de base64)

---

## 🚀 Firebase Hosting Configuration

### Projet Firebase
- **ID du Projet** : navi-f913a
- **URL par défaut** : https://navi-f913a.web.app
- **Domaine personnalisé** : (à configurer) tickets.vigidev.com

### Configuration firebase.json
```json
{
  "hosting": {
    "public": ".next/standalone/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 📊 Supabase Configuration

**Projet ID** : bgnzfhjsvldgejddzqtf

**URL** : https://bgnzfhjsvldgejddzqtf.supabase.co

**Dashboard** : https://supabase.com/dashboard/project/bgnzfhjsvldgejddzqtf

### Clés d'API (dans `.env.local` uniquement)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔐 Politique d'Administration GCP (iam.disableServiceAccountKeyCreation)

### Problème
Une politique GCP au niveau de l'organisation bloque la création de clés JSON pour les comptes de service.

### Solution
Pour créer une clé JSON, il faut désactiver cette politique pour le projet `navi-f913a`.

#### Option 1 : Désactiver au niveau du projet (Recommandé)
```bash
# D'abord, obtenir l'ID de l'organisation
gcloud organizations list

# Puis, créer une exception pour le projet
gcloud org-policies set-policy policy.yaml --project=navi-f913a
```

**Fichier `policy.yaml`** :
```yaml
name: projects/navi-f913a/policies/iam.disableServiceAccountKeyCreation
spec:
  rules:
    - allowAll: true
```

#### Option 2 : Désactiver au niveau de l'organisation (moins sécurisé)
```bash
# ID de l'organisation (remplacer par le vrai)
ORG_ID=$(gcloud organizations list --format='value(name)' | head -1)

# Supprimer la politique
gcloud org-policies delete iam.disableServiceAccountKeyCreation --organization=$ORG_ID
```

---

## 🔗 Intégrations

### GitHub Actions Workflows

**Fichiers** :
- `.github/workflows/firebase-hosting-merge.yml` - Déploie sur `main` push
- `.github/workflows/firebase-hosting-pull-request.yml` - Crée preview sur PR

**Secrets requis dans GitHub** :
- `FIREBASE_SERVICE_ACCOUNT_NAVI_F913A` - Clé JSON du service account
- `NEXT_PUBLIC_SUPABASE_URL` - URL Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anon Supabase

### Firebase → Supabase
Aucune intégration requise (découpling intentionnel). Firebase sert uniquement pour l'hébergement frontend.

---

## 📝 Checklist de Configuration

### Avant le déploiement
- [ ] Créer la clé JSON du service account Firebase
- [ ] Ajouter la clé dans GitHub Secrets
- [ ] Vérifier que le `.firebaserc` pointe vers `navi-f913a`
- [ ] Tester localement : `firebase deploy --dry-run`
- [ ] Tous les commits pushés à GitHub
- [ ] GitHub Actions workflows activés

### Après le déploiement
- [ ] Vérifier https://navi-f913a.web.app charge correctement
- [ ] Vérifier l'authentification Supabase fonctionne
- [ ] Vérifier les logs dans Firebase Console
- [ ] Configurer le domaine personnalisé (optionnel)

---

## 🔍 Debugging & Monitoring

### Firebase Console
- **Hosting** : Vérifier les déploiements et les performances
- **Build Logs** : Voir les erreurs de déploiement
- **Analytics** : Trafic et utilisation

### Localement
```bash
# Build local
npm run build

# Preview local du déploiement
firebase emulators:start

# Ou simplement tester
npm run dev
```

### CLI Firebase
```bash
# Login
firebase login

# List projects
firebase projects:list

# Deploy preview
firebase deploy --only hosting:navi-f913a --preview-channel=pr-preview

# View hosting history
firebase hosting:channel:list
```

---

## 📚 Ressources

- **Firebase Console** : https://console.firebase.google.com/project/navi-f913a
- **GCP Console** : https://console.cloud.google.com
- **Firebase Hosting Docs** : https://firebase.google.com/docs/hosting
- **Supabase Dashboard** : https://supabase.com/dashboard/project/bgnzfhjsvldgejddzqtf
- **GitHub Repo** : https://github.com/mobileappbyharis/vigidev-tickets

---

**Version** : 1.0 (Février 2026)
**Dernière mise à jour** : Phase 1 Completion
**Statut** : Ready for Firebase Deployment Setup
