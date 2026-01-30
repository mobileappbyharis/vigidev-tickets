# VigiTickets - Plateforme de Gestion de Tickets

Plateforme SaaS moderne pour la gestion de tickets support de **Vigidev**, entreprise française de sécurité électronique.

## 🎯 Fonctionnalités

- ✅ Double portail (Clients + Équipe Vigidev)
- ✅ Système de rôles granulaire (Client, Technicien, Développeur, Admin)
- ✅ Chat en temps réel avec upload d'images, vidéos et PDF
- ✅ Vue Kanban pour la gestion des tickets
- ✅ Dashboard analytique pour les administrateurs
- ✅ Notifications par email (Edge Functions Supabase)
- ✅ Historique d'activité avec timeline
- ✅ Sécurité RLS (Row Level Security) Supabase

## 💻 Stack Technologique

```
Frontend        : Next.js 14 (App Router) + TypeScript + Tailwind CSS v4
Backend         : Supabase (PostgreSQL + Auth + Realtime + Storage)
Email           : Resend (via Supabase Edge Functions)
Hosting         : Google Cloud Run
Database        : PostgreSQL (Supabase Cloud)
Authentication  : Supabase Auth + SSR Cookies
```

## 🚀 Démarrage Local

### Prérequis
- Node.js 20+
- npm ou yarn
- Compte Supabase configuré

### Installation

```bash
# Clone le repo
git clone https://github.com/Zie619/vigidev-tickets.git
cd vigidev-tickets

# Installe les dépendances
npm install

# Configure les variables d'environnement
cp .env.example .env.local

# Remplace les valeurs par tes clés Supabase
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

### Lancer en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
vigitckets/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Pages d'authentification
│   ├── (client)/          # Portail Client
│   ├── (vigidev)/         # Portail Équipe Vigidev
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout root
├── components/            # Composants React réutilisables
│   ├── auth/
│   ├── client/
│   ├── vigidev/
│   ├── shared/            # Composants partagés
│   └── ui/                # Composants UI atomiques
├── hooks/                 # Hooks personnalisés
│   ├── useAuth.ts
│   ├── useToast.ts
│   └── useRealtime.ts
├── lib/                   # Utilitaires et configurations
│   ├── supabase.ts        # Client Supabase
│   ├── auth/              # Logique auth
│   └── utils/             # Fonctions utilitaires
├── types/                 # Types TypeScript
├── styles/                # Styles globaux
└── supabase/              # Configuration Supabase
    ├── migrations/        # Migrations SQL
    └── functions/         # Edge Functions
```

## 🔐 Configuration Supabase

### Tables Requises

Les tables suivantes doivent être créées dans Supabase :

- `profiles` - Profils utilisateurs
- `projects` - Projets
- `client_projects` - Attribution client-projet
- `tickets` - Tickets support
- `ticket_messages` - Messages du chat
- `ticket_attachments` - Pièces jointes
- `ticket_history` - Historique des changements
- `notification_logs` - Logs de notifications

Voir `supabase/migrations/` pour les scripts SQL.

### RLS (Row Level Security)

Toutes les tables ont des policies RLS pour assurer la sécurité :
- Les clients ne voient que leurs propres tickets
- L'équipe Vigidev voit tous les tickets
- Les admins ont accès complet

## 🔑 Variables d'Environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Optional
NEXT_PUBLIC_CUSTOM_DOMAIN=tickets.vigidev.com
```

## 📚 Scripts Disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build pour la production
npm start            # Démarre le serveur de production
npm run type-check   # Vérifie les types TypeScript
npm run lint         # Lint le code
npm run format       # Formate le code avec Prettier
npm run seed         # Populate la BD avec des données de test
```

## 🚢 Déploiement sur Google Cloud Run

### Build Docker

```bash
docker build -t vigidev-tickets:latest .
```

### Push vers GCP

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/vigidev-tickets
```

### Déployer

```bash
gcloud run deploy vigidev-tickets \
  --image gcr.io/YOUR_PROJECT_ID/vigidev-tickets \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=xxx,NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx,SUPABASE_SERVICE_ROLE_KEY=xxx
```

Voir `DEPLOYMENT.md` pour les instructions détaillées.

## 🛡️ Sécurité

- Authentification via Supabase Auth
- RLS (Row Level Security) sur toutes les tables
- Validation des inputs côté client et serveur
- HTTPS en production
- API routes sécurisées avec vérification de rôle
- Compression des images avant upload
- Limitation de la taille des fichiers (50MB max)

## 📝 Authentification

### Flux Client
1. Inscription email + password
2. Confirmation email automatique
3. Accès au portail client

### Flux Équipe Vigidev
1. Admin invite un membre par email
2. Membre reçoit un magic link
3. Complète son profil
4. Accès au portail Vigidev

## 🎨 Design

- **Palette couleurs** : Bleu (#0284c7) + Gris (#475569) + Blanc
- **Framework** : Tailwind CSS v4
- **Icons** : Heroicons
- **Font** : System fonts
- **Design system** : Minimaliste et pro

## 📞 Support

Pour toute question ou problème :
1. Consulte la documentation Supabase
2. Vérifies les logs d'erreur en console
3. Contacte l'équipe Vigidev

## 📄 License

Propriétaire - Vigidev

---

**Prêt à démarrer ?** 🚀 Vois `DEPLOYMENT.md` pour les détails de mise en production.
