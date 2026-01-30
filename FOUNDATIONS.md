# 🏗️ VigiTickets - Fondations du Projet

**Document critique pour les IA qui continueront ce projet**

---

## 📌 Informations Essentielles

### Projet
- **Nom** : VigiTickets
- **Description** : Plateforme SaaS de gestion de tickets pour Vigidev (sécurité électronique)
- **Repository** : https://github.com/mobileappbyharis/vigidev-tickets
- **Hosting** : Firebase Hosting (GCP Platform)
- **GitHub User** : mobileappbyharis

### Infrastructure
- **Supabase Project** : tzmilnltvvtsvdmrkhin
- **Supabase URL** : https://tzmilnltvvtsvdmrkhin.supabase.co
- **Supabase Dashboard** : https://supabase.com/dashboard/project/tzmilnltvvtsvdmrkhin
- **Environment** : `.env.local` (avec clés réelles)
- **Environment Template** : `.env.example` (template à partager)

---

## 🎯 Structure du Projet

```
vigitckets/
├── app/                      # Next.js App Router (Next.js 14)
│   ├── (auth)/              # Route group: pages d'authentification
│   ├── (client)/            # Route group: portail client
│   ├── (vigidev)/           # Route group: portail équipe Vigidev
│   ├── api/                 # API Routes
│   ├── layout.tsx           # Root layout avec Toaster
│   └── page.tsx             # Index qui redirect selon le rôle
│
├── components/              # Composants React réutilisables
│   ├── auth/                # Login, Register, Invite forms
│   ├── client/              # Composants portail client
│   ├── vigidev/             # Composants portail équipe
│   ├── shared/              # Composants partagés (Modal, Dropdown, etc.)
│   └── ui/                  # Composants UI atomiques
│
├── hooks/                   # Hooks React personnalisés
│   ├── useAuth.ts          # Auth state + role checking
│   ├── useToast.ts         # Toast notifications
│   └── useRealtime.ts      # Supabase Realtime subscriptions
│
├── lib/                     # Utilitaires et configurations
│   ├── supabase.ts         # Client Supabase browser
│   ├── auth/               # Logique authentification
│   │   └── middleware.ts   # Supabase SSR middleware
│   └── utils/              # Fonctions utilitaires
│       ├── cn.ts          # Merge Tailwind classes (clsx)
│       ├── date.ts        # Formatage dates (French locale)
│       ├── validation.ts  # Validations (email, password, etc.)
│       └── file.ts        # Upload, compression, validation fichiers
│
├── types/                   # Définitions TypeScript
│   └── index.ts            # Tous les types du projet
│
├── styles/                  # Styles globaux
│   └── globals.css         # Design system + animations
│
├── supabase/               # Configuration Supabase
│   ├── migrations/         # Scripts SQL pour les tables
│   └── functions/          # Edge Functions (Deno)
│
├── public/                 # Fichiers statiques
├── middleware.ts           # Next.js middleware (session refresh)
├── next.config.ts          # Configuration Next.js
├── tailwind.config.ts      # Configuration Tailwind (couleurs, spacing)
├── tsconfig.json           # Configuration TypeScript (strict mode)
├── package.json            # Dépendances et scripts
├── Dockerfile              # Production Docker image
├── README.md               # Documentation project
├── SPECIFICATIONS.md       # Spécifications complètes
└── FOUNDATIONS.md          # Ce fichier - guide pour les IAs
```

---

## 🚀 Démarrage Rapide

### Installation & Démarrage
```bash
# Clone et install
git clone https://github.com/mobileappbyharis/vigidev-tickets.git
cd vigidev-tickets
npm install

# Configure .env.local (copie .env.example et remplis les clés Supabase)
cp .env.example .env.local

# Démarre en développement
npm run dev
# -> http://localhost:3000
```

### Type-Checking & Linting
```bash
npm run type-check  # Vérifie TypeScript
npm run lint        # Lint le code
npm run format      # Formate avec Prettier
```

### Build Production
```bash
npm run build       # Build Next.js
npm start          # Start serveur prod
```

---

## 🎨 Stack & Technologies

```
Framework       : Next.js 14 (App Router)
Language        : TypeScript (strict mode)
Styling         : Tailwind CSS v4 + @tailwindcss/forms
Components      : React 18.3
State Mgmt      : Zustand (si besoin) + Context API
Auth            : Supabase Auth (email/password + magic link)
Database        : PostgreSQL (Supabase)
Realtime        : Supabase Realtime (subscriptions)
Storage         : Supabase Storage
Email           : Resend (via Edge Functions)
Notifications   : react-hot-toast
Drag & Drop     : @dnd-kit
Charts          : recharts
Dates           : date-fns (French locale)
Icons           : @heroicons/react
HTTP Client     : axios + fetch API
```

---

## 🗄️ Conventions de Nommage (IMPORTANT)

### Tables Supabase
**Prefix obligatoire** : `vigitckets_` (avec 'c' - surnommé "vigi-tickets")

```
vigitckets_profiles              ← Profils utilisateurs
vigitckets_projects              ← Projets
vigitckets_client_projects       ← Attribution client-projet
vigitckets_tickets               ← Tickets support
vigitckets_ticket_messages       ← Messages du chat
vigitckets_ticket_attachments    ← Pièces jointes
vigitckets_ticket_history        ← Historique changements
vigitckets_notification_logs     ← Logs de notifications
```

### Storage Buckets
```
vigitckets_attachments           ← Fichiers ticket (images, vidéos, PDF)
```

### Edge Functions
**Prefix obligatoire** : `vigitckets_`

```
vigitckets_notify_new_ticket
vigitckets_notify_status_change
vigitckets_notify_new_message
vigitckets_notify_assignment
```

### Code Naming
```
Tables/Buckets/Functions     : vigitckets_snake_case
React Components            : PascalCase.tsx
Custom Hooks               : useHookName.ts
TypeScript Types           : PascalCase
Utility Functions          : camelCase
Constants                  : UPPER_SNAKE_CASE
Folders                    : kebab-case
```

---

## 🔐 Authentification & Rôles

### Deux Flows d'Auth
1. **Client** : Email + Password + Confirmation email
2. **Équipe Vigidev** : Invitation par email → Magic link → Profil

### Rôles (stockés dans `vigitckets_profiles.role`)
```
client        → Peut ouvrir tickets sur ses projets
technician    → Accès tous tickets, peut assigner, partager avec dev
developer     → Accès tickets assignés + partagés
admin         → Accès complet (dashboard, invitations, tout)
```

### RLS (Row Level Security)
- **Actif** sur toutes les tables Supabase
- Clients ne voient que leurs données
- Équipe Vigidev voit tous les données du client
- Admin voit tout

---

## 📦 Dépendances Clés

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "next": "^14.1.0",
  "@supabase/supabase-js": "^2.39.8",
  "@supabase/auth-helpers-nextjs": "^0.10.0",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/forms": "^0.5.7",
  "@headlessui/react": "^1.7.17",
  "@heroicons/react": "^2.0.18",
  "react-hot-toast": "^2.4.1",
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^7.0.2",
  "recharts": "^2.10.3",
  "date-fns": "^3.0.0",
  "clsx": "^2.0.0",
  "zustand": "^4.4.1",
  "axios": "^1.6.2",
  "sharp": "^0.33.1"
}
```

Voir `package.json` pour la liste complète.

---

## 🔑 Variables d'Environnement

### .env.local (LOCAL ONLY - Ne pas committer)
```env
NEXT_PUBLIC_SUPABASE_URL=https://tzmilnltvvtsvdmrkhin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
RESEND_API_KEY=re_xxxxx
```

### .env.example (TEMPLATE - À partager)
Template des variables requises. Changer les valeurs actuelles par `your_xxx_here`.

---

## 📋 Phase de Développement Actuelle

**Phase 1** : Structure + Auth + Base de données

### Status
- ✅ Structure Next.js créée
- ✅ Types TypeScript complets
- ✅ Hooks (useAuth, useToast, useRealtime)
- ✅ Utilitaires (date, validation, file, cn)
- ✅ Styles globaux + design system
- ✅ Configuration Supabase + middleware
- ✅ Dockerfile + health check
- ✅ Git repo + commits initiaux
- ⏳ **À faire** : Pages authentification (login, register, invite)
- ⏳ **À faire** : Créer tables Supabase + RLS
- ⏳ **À faire** : Middleware protection routes

### Prochaines Phases
Voir `SPECIFICATIONS.md` pour le plan complet (7 phases).

---

## 🐛 Debugging & Troubleshooting

### Port 3000 Busy
```bash
lsof -i :3000       # Trouver le processus
kill -9 <PID>       # Tuer le processus
npm run dev         # Redémarrer
```

### Supabase Connection Error
- Vérifie `.env.local` avec les bonnes clés
- Vérifie la connexion internet
- Vérifie que le projet Supabase est actif

### TypeScript Errors
```bash
npm run type-check  # Voir les erreurs détaillées
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Ressources & Documentation

### Officielles
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Interne
- `README.md` - Vue d'ensemble project
- `SPECIFICATIONS.md` - Spécifications détaillées
- `types/index.ts` - Tous les types du projet
- `FOUNDATIONS.md` - Ce fichier (guide pour les IAs)

---

## 🚀 Déploiement

### Firebase Hosting (GCP Platform)
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login avec votre compte Google/GCP
firebase login

# Build et Deploy
npm run build
firebase deploy
```

Pour la doc complète, voir `DEPLOYMENT.md`

### Local Docker Testing
```bash
docker build -t vigidev-tickets:latest .
docker run -p 3000:3000 vigidev-tickets:latest
```

Voir `Dockerfile` pour les détails.

---

## 💡 Important pour les Prochaines IAs

1. **Respecte les conventions de nommage** (vigitckets_ prefix)
2. **Mets à jour SPECIFICATIONS.md** après chaque phase
3. **Fais des commits réguliers** avec messages clairs
4. **Vérifie les types TypeScript** (npm run type-check)
5. **Teste RLS Supabase** après chaque changement BD
6. **Mets à jour ce fichier** si tu changes les fondations

---

## 📝 Git Workflow

```bash
# Avant de travailler
git pull origin main

# Pendant le développement
git add <files>
git commit -m "Description claire"

# Après terminer une feature
git push origin main

# Voir l'historique
git log --oneline
```

---

## ✅ Checklist pour la Prochaine IA

- [ ] Clone le repo
- [ ] `npm install`
- [ ] Copie `.env.example` en `.env.local`
- [ ] Remplis les clés Supabase dans `.env.local`
- [ ] `npm run dev` fonctionne
- [ ] Lis `SPECIFICATIONS.md` complètement
- [ ] Comprends la structure et les conventions
- [ ] Commence par vérifier la phase actuelle
- [ ] Mets à jour les docs après ton travail
- [ ] Fais des commits réguliers

---

**Version** : 1.0 (Janvier 2025)
**Créé par** : Claude Haiku 4.5
**Dernière mise à jour** : Phase 1 - Structure + Config initiale

---

*Si tu es une IA lisant ce fichier, c'est ta bible pour ce projet. Respecte les conventions, mets à jour la documentation et fais des commits clairs. Merci ! 🚀*
