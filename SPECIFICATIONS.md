# 📋 Spécifications VigiTickets - Plateforme de Gestion de Tickets

**Projet** : VigiTickets
**Client** : Vigidev (Sécurité Électronique)
**URL Supabase** : https://tzmilnltvvtsvdmrkhin.supabase.co
**Repository** : https://github.com/mobileappbyharis/vigidev-tickets
**Vercel Project** : pgmhaouassi@gmail.com

---

## 📑 Sommaire
1. [Fondations du Projet](#fondations)
2. [Stack Technologique](#stack-technologique)
3. [Architecture Générale](#architecture-générale)
4. [Conventions de Nommage](#conventions-de-nommage)
5. [Phases de Développement](#phases-de-développement)
6. [Questions avant de commencer](#questions-avant-de-commencer)

---

## 🏗️ Fondations

### Setup Initial (COMPLÉTÉ ✅)

**Fichiers créés** :
- Configuration : `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`
- Types : `types/index.ts` (définitions complètes)
- Utilitaires : `lib/utils/` (date, validation, file, cn)
- Hooks : `hooks/` (useAuth, useToast, useRealtime)
- Styles : `styles/globals.css` (design system complet)
- Layout & Pages : `app/layout.tsx`, `app/page.tsx`, `app/api/health/route.ts`
- Auth : `lib/auth/middleware.ts`, `middleware.ts`
- Docker : `Dockerfile`, `.dockerignore`

**Commandes de démarrage** :
```bash
npm install                  # Installe les dépendances
npm run dev                 # Démarre le serveur de développement (localhost:3000)
npm run build               # Build pour la production
npm run type-check          # Vérifie les types TypeScript
npm run lint                # Lint le code
npm run format              # Formate avec Prettier
```

### Environment Variables (À configurer)
Copie `.env.example` en `.env.local` et remplis avec tes clés Supabase :
```env
NEXT_PUBLIC_SUPABASE_URL=https://tzmilnltvvtsvdmrkhin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
RESEND_API_KEY=re_xxxxx (À obtenir après setup Resend)
```

---

## 💻 Stack Technologique

```
Frontend        : Next.js 14 (App Router) + TypeScript + Tailwind CSS v4
Backend         : Supabase (PostgreSQL + Auth + Realtime + Storage)
Authentication  : Supabase Auth + SSR Cookies + JWT
Database        : PostgreSQL (Supabase Cloud)
Storage         : Supabase Storage (bucket: vigitckets_attachments)
Email           : Resend (via Supabase Edge Functions)
Realtime        : Supabase Realtime (subscriptions)
Hosting         : Google Cloud Run (ou Vercel pour MVP)
CI/CD           : GitHub Actions
Deployment      : Vercel (https://vercel.com avec pgmhaouassi@gmail.com)

Key Dependencies:
- @supabase/supabase-js + @supabase/auth-helpers-nextjs
- react-hot-toast (notifications)
- @dnd-kit (drag & drop Kanban)
- recharts (graphiques dashboard)
- date-fns (dates en français)
- zustand (state management - si besoin)
```

---

## 🏗️ Architecture Générale

### Portails & Routes
```
/auth                        → Pages d'authentification
├── /login                   (Email + Password pour client/vigidev)
├── /register                (Inscription client uniquement)
└── /invite                  (Magic link pour équipe Vigidev)

/client                       → Portail Client
├── /projects                (Mes projets attribués)
├── /projects/[projectId]    (Détails projet + ses tickets)
├── /tickets                 (Tous mes tickets)
├── /tickets/[ticketId]      (Détail ticket + Chat)
├── /tickets/[ticketId]/new-ticket (Créer ticket)
└── /profile                 (Profil utilisateur)

/vigidev                      → Portail Équipe Vigidev
├── /projects                (Gestion tous les projets)
├── /projects/[projectId]    (Détails + attribution clients)
├── /clients                 (Liste tous les clients)
├── /clients/[clientId]      (Détails client + ses tickets)
├── /tickets                 (Liste tous les tickets)
├── /tickets/[ticketId]      (Détail + Chat + Actions équipe)
├── /board                   (Vue Kanban par statut)
├── /dashboard               (Admin seulement - Stats)
└── /settings                (Admin seulement - Gestion)
```

### Rôles & Permissions

```
CLIENT
  - Création : Auto-inscription (email + password)
  - Accès : Ses projets attribués + ses tickets seulement
  - Actions : Créer ticket, répondre chat, voir historique

TECHNICIAN
  - Création : Invitation par admin (magic link)
  - Accès : TOUS les tickets
  - Actions : Voir, assigner, changer statut, partager, notes internes

DEVELOPER
  - Création : Invitation par admin (magic link)
  - Accès : Tickets assignés + partagés avec lui
  - Actions : Répondre, modifier, changer statut, partager admin

ADMIN
  - Création : Invitation par admin (premier admin = manuel en BD)
  - Accès : TOUT
  - Actions : Dashboard, inviter, gérer projets/clients, tout modifier
```

---

## 📝 Conventions de Nommage

### 🗄️ Tables Supabase (Préfixe : `vigitckets_`)

```sql
vigitckets_profiles              # Profils utilisateurs (étend auth.users)
vigitckets_projects              # Projets
vigitckets_client_projects       # Attribution client-projet
vigitckets_tickets               # Tickets support
vigitckets_ticket_messages       # Messages du chat
vigitckets_ticket_attachments    # Pièces jointes (images, vidéos, PDF)
vigitckets_ticket_history        # Historique changements de statut
vigitckets_notification_logs     # Logs de notifications (audit)
```

### 🪣 Storage Buckets (Préfixe : `vigitckets_`)

```
Bucket: vigitckets_attachments
├── /tickets/{ticket_id}/
│   ├── {uuid}_{filename}       (Image, Vidéo, PDF)
│   └── ...
```

### ⚡ Edge Functions (Préfixe : `vigitckets_`)

```
vigitckets_notify_new_ticket       # Notif nouveau ticket
vigitckets_notify_status_change    # Notif changement statut
vigitckets_notify_new_message      # Notif nouveau message
vigitckets_notify_assignment       # Notif assignation ticket
```

### 📝 Naming Rules

- **Tables** : `vigitckets_snake_case`
- **Colonnes** : `snake_case`
- **Composants React** : `PascalCase`
- **Hooks** : `useHookName`
- **Types** : `PascalCase`
- **Fonctions utilitaires** : `camelCase`
- **Constantes** : `UPPER_SNAKE_CASE`
- **Fichiers** : `kebab-case` sauf composants (`PascalCase.tsx`)

---

## 🗄️ Schéma Base de Données

### vigitckets_profiles
```sql
id UUID (PK, FK → auth.users.id)
email TEXT (unique)
full_name TEXT
role ENUM(client|technician|developer|admin)
notify_new_ticket BOOLEAN (default: true)
notify_status_change BOOLEAN (default: true)
notify_new_message BOOLEAN (default: true)
notify_assignment BOOLEAN (default: true)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### vigitckets_projects
```sql
id UUID (PK)
name TEXT (required)
address TEXT (required)
description TEXT
created_by UUID (FK → vigitckets_profiles.id)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### vigitckets_client_projects
```sql
id UUID (PK)
client_id UUID (FK → vigitckets_profiles, role=client)
project_id UUID (FK → vigitckets_projects)
assigned_at TIMESTAMP
assigned_by UUID (FK → vigitckets_profiles)
```

### vigitckets_tickets
```sql
id UUID (PK)
project_id UUID (FK → vigitckets_projects)
created_by UUID (FK → vigitckets_profiles)
assigned_to UUID (FK → vigitckets_profiles, nullable)
shared_with UUID[] (array)
title TEXT (required, min 10 chars)
description TEXT
status ENUM(Nouveau|Pris en charge|En cours|En attente client|Résolu|Clôturé)
priority ENUM(basse|moyenne|haute|urgente)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### vigitckets_ticket_messages
```sql
id UUID (PK)
ticket_id UUID (FK → vigitckets_tickets)
author_id UUID (FK → vigitckets_profiles)
content TEXT
is_internal BOOLEAN (default: false)
created_at TIMESTAMP
```

### vigitckets_ticket_attachments
```sql
id UUID (PK)
ticket_id UUID (FK → vigitckets_tickets)
message_id UUID (FK → vigitckets_ticket_messages, nullable)
file_url TEXT
file_type ENUM(image|video|pdf|other)
file_size INT
original_filename TEXT
created_at TIMESTAMP
```

### vigitckets_ticket_history
```sql
id UUID (PK)
ticket_id UUID (FK → vigitckets_tickets)
changed_by UUID (FK → vigitckets_profiles)
old_status ENUM(...)
new_status ENUM(...)
comment TEXT
created_at TIMESTAMP
```

### vigitckets_notification_logs
```sql
id UUID (PK)
recipient_id UUID (FK → vigitckets_profiles)
ticket_id UUID (FK → vigitckets_tickets, nullable)
type ENUM(new_ticket|status_change|new_message|assignment)
subject TEXT
sent_at TIMESTAMP
status ENUM(sent|failed)
error_message TEXT
```

### Storage: vigitckets_attachments
```
RLS : Seul auteur + équipe Vigidev + propriétaire ticket
Taille max : 50MB par fichier
Types : jpg, png, webp, mp4, pdf
Durée vidéo max : 10 secondes
```

---

## 📅 Phases de Développement

### PHASE 1️⃣ : Structure + Auth + Base de données (✅ EN COURS)

**État** : Fondations créées, prochaines étapes Git + Supabase + Auth pages

**Tâches restantes** :
1. ✅ Structure Next.js
2. ✅ Types TypeScript
3. ✅ Hooks & Utilitaires
4. ⏳ **Git init + Premier commit** (À faire)
5. ⏳ **Créer tables Supabase + RLS** (À faire)
6. ⏳ **Pages auth** (login, register, invite) (À faire)
7. ⏳ **Middleware protection routes** (À faire)

### PHASE 2️⃣ : Gestion Projets & Clients
- Pages /vigidev/projects, /vigidev/clients
- Pages /client/projects
- Composants réutilisables (ProjectCard, ClientCard, Modal, etc.)
- Temps réel avec Supabase Realtime

### PHASE 3️⃣ : Système de Tickets Complet
- Création tickets (client)
- Liste tickets + filtres
- Détail ticket + Chat en temps réel
- Upload fichiers (compression images, validation vidéo)
- Assignation & Partage
- Storage Supabase

### PHASE 4️⃣ : Vues Avancées & Dashboard
- Vue Kanban (drag & drop)
- Dashboard Admin (stats, graphiques)
- Timeline client (historique)

### PHASE 5️⃣ : Temps Réel, Polish, Déploiement
- Vérification Realtime complet
- Indicateurs présence
- Loading skeletons, empty states
- Sécurité finale (RLS, sanitization)
- Responsive mobile
- Préparation GCP/Vercel

### PHASE 6️⃣ : Notifications Email
- Edge Functions Supabase (4 fonctions)
- Templates email HTML
- Webhooks Supabase
- Resend API integration

### PHASE 7️⃣ : Déploiement Production
- Dockerfile optimisé
- GitHub Actions CI/CD
- Déploiement Vercel ou GCP Cloud Run
- Documentation finale

---

## ❓ Questions avant de commencer Phase 1 (Suite)

### Git & Vercel
1. **GitHub** : Username `mobileappbyharis` - OK ? ✅
2. **Vercel** : Email `pgmhaouassi@gmail.com` - OK ? ✅
3. **Premier commit** : Veux-tu que je fasse maintenant ? (git init, add, commit)

### Supabase
4. **Clés confirmées** ? Anon key + Service role key fournis ✅
5. **Prefix table** : `vigitckets_` (avec 'c') confirmé ? ✅
6. **Bucket storage** : `vigitckets_attachments` OK ? ✅

### Développement
7. **Mode déploiement** : Vercel (MVP rapide) ou GCP Cloud Run (production) ?
8. **Testing** : Tests unitaires/e2e ou juste testing manuel pour Phase 1 ?
9. **Priorités** : Suivre l'ordre des phases ou tu veux une priorité spécifique ?

---

## 🎨 Design Guidelines

- **Palette couleurs** : Bleu (#0284c7) + Gris (#475569) + Blanc (#ffffff)
- **Typography** : System fonts (sans-serif)
- **Spacing** : Système 4px (Tailwind)
- **Shadows** : Subtiles, pro
- **Composants** : Minimalistes, épurés
- **Mode sombre** : À considérer après MVP

---

## 📚 Documentation de Référence

### Ressources Officielles
- Next.js 14 : https://nextjs.org/docs
- Supabase : https://supabase.com/docs
- Tailwind CSS v4 : https://tailwindcss.com/docs
- TypeScript : https://www.typescriptlang.org/docs

### Accès Projet
- Supabase Dashboard : https://supabase.com/dashboard/project/tzmilnltvvtsvdmrkhin
- GitHub Repo : https://github.com/mobileappbyharis/vigidev-tickets
- Vercel Dashboard : https://vercel.com

### Clés & Credentials
```
Supabase URL : https://tzmilnltvvtsvdmrkhin.supabase.co
Anon Key : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (dans .env.local)
Service Role : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (dans .env.local)
GitHub Username : mobileappbyharis
Vercel Email : pgmhaouassi@gmail.com
```

---

## 🚀 Commandes Rapides

```bash
# Development
npm run dev                        # Démarre en local

# Production build
npm run build && npm start         # Build + test production local

# Code quality
npm run type-check && npm run lint # Vérifie tout
npm run format                     # Formate le code

# Git
git status                         # Vérifie les changements
git add .                          # Stage tous les fichiers
git commit -m "Message descriptif" # Commit
git push origin main               # Push vers GitHub

# Vercel deployment
vercel deploy                      # Deploy vers Vercel
```

---

## 📋 Checklist Avant Livraison (Par Phase)

### Phase 1 Checklist
- [ ] Git repo initialisé et connecté
- [ ] Clés Supabase dans .env.local
- [ ] Tables Supabase créées avec RLS
- [ ] Pages auth fonctionnelles
- [ ] Middleware protection routes OK
- [ ] Tous les types TypeScript compilent
- [ ] Zéro erreurs console

### Phase 2 Checklist
- [ ] Gestion projets OK
- [ ] Gestion clients OK
- [ ] Temps réel Supabase OK

... (À détailler par phase)

---

## 🔐 Points Sécurité

✅ RLS (Row Level Security) sur toutes les tables
✅ Authentification Supabase Auth (email + password / magic link)
✅ Validation inputs côté client et serveur
✅ Compression images avant upload
✅ Limitation taille fichiers (50MB max)
✅ HTTPS en production
✅ Service Role Key jamais exposée au frontend
✅ Sanitization des inputs (XSS prevention)

---

**Fin des spécifications. Prêt à continuer ! 🚀**

Prochaine étape : **Git init + Supabase setup + Pages auth**
