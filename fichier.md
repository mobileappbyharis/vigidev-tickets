# 📋 Plateforme de Gestion de Tickets Vigidev

## 📑 Sommaire
1. [Vue d'ensemble](#vue-densemble)
2. [Stack technologique](#stack-technologique)
3. [Architecture générale](#architecture-générale)
4. [Phases de développement](#phases-de-développement)
5. [Questions avant de commencer](#questions-avant-de-commencer)

---

## 🎯 Vue d'ensemble

**Objectif** : Créer une plateforme SaaS de gestion de tickets pour **Vigidev**, entreprise française spécialisée en sécurité électronique (contrôle d'accès, vidéosurveillance, anti-intrusion).

**Public** :
- **Clients** : Entreprises clientes de Vigidev (ouvrent des tickets sur leurs projets)
- **Équipe Vigidev** : Techniciens, Développeurs, Administrateurs (gèrent et résolvent les tickets)

**Fonctionnalités clés** :
- ✅ Double portail (Client / Équipe Vigidev)
- ✅ Système de rôles granulaire
- ✅ Chat en temps réel avec uploads (images, vidéos, PDF)
- ✅ Vue Kanban pour l'équipe
- ✅ Dashboard analytique pour les admins
- ✅ Notifications par email
- ✅ Historique d'activité avec timeline
- ✅ Déploiement sur Google Cloud Platform

---

## 💻 Stack technologique

```
Frontend        : Next.js 14 (App Router) + TypeScript + Tailwind CSS v4
Backend         : Supabase (PostgreSQL + Auth + Realtime + Storage)
Email           : Resend ou SendGrid (via Edge Functions)
Hosting         : Google Cloud Run (Next.js) + Supabase Cloud
Repository      : GitHub (mobileappbyharis/vigidev-tickets)
Domain Vigidev  : vigidev-france.com (pour contexte)
```

---

## 🏗️ Architecture générale

### Portails
```
/auth                  → Login/Register/Invitation
├── /login             (Client et Vigidev)
├── /register          (Client seulement)
└── /invite            (Équipe Vigidev seulement - magic link)

/client                → Portail Client
├── /projects          (Mes projets attribués)
├── /tickets           (Tous mes tickets)
├── /tickets/[id]      (Détail + Chat)
└── /profile           (Profil utilisateur)

/vigidev               → Portail Équipe (Technicien/Dev/Admin)
├── /projects          (Gestion des projets)
├── /clients           (Gestion des clients)
├── /tickets           (Liste tous les tickets)
├── /board             (Vue Kanban)
├── /dashboard         (Admin seulement)
└── /settings          (Admin seulement)
```

### Rôles et permissions
```
CLIENT
  - Création : Auto-inscription (email + password)
  - Accès : Ses projets attribués seulement
  - Actions : Créer ticket, répondre dans le chat

TECHNICIAN
  - Création : Invitation par admin (magic link)
  - Accès : Tous les tickets
  - Actions : Voir, assigner, changer statut, partager avec dev/admin, ajouter notes internes

DEVELOPER
  - Création : Invitation par admin
  - Accès : Tickets assignés + partagés avec lui
  - Actions : Répondre, modifier description, changer statut, partager avec admin

ADMIN
  - Création : Invitation par admin (premier admin manuel en BD)
  - Accès : TOUT (tous les tickets, conversations, logs)
  - Actions : Dashboard, inviter membres, gérer projets/clients, modifier n'importe quel ticket
```

### Tables Supabase

```sql
-- Profils utilisateurs (étend auth.users)
profiles
  id UUID (PK, lié à auth.users)
  email TEXT
  full_name TEXT
  role ENUM(client|technician|developer|admin)
  notify_new_ticket BOOLEAN (default: true)
  notify_status_change BOOLEAN (default: true)
  notify_new_message BOOLEAN (default: true)
  notify_assignment BOOLEAN (default: true)
  created_at TIMESTAMP
  updated_at TIMESTAMP

-- Projets
projects
  id UUID (PK)
  name TEXT (required)
  address TEXT (required)
  description TEXT
  created_by UUID (FK → profiles)
  created_at TIMESTAMP
  updated_at TIMESTAMP

-- Attribution client-projet
client_projects
  id UUID (PK)
  client_id UUID (FK → profiles, role=client)
  project_id UUID (FK → projects)
  assigned_by UUID (FK → profiles)
  assigned_at TIMESTAMP

-- Tickets
tickets
  id UUID (PK)
  project_id UUID (FK → projects)
  created_by UUID (FK → profiles)
  assigned_to UUID (FK → profiles, nullable)
  shared_with UUID[] (array de profiles.id)
  title TEXT (required)
  description TEXT
  status ENUM(Nouveau|Pris en charge|En cours|En attente client|Résolu|Clôturé) (default: Nouveau)
  priority ENUM(basse|moyenne|haute|urgente) (default: moyenne)
  created_at TIMESTAMP
  updated_at TIMESTAMP

-- Messages du chat ticket
ticket_messages
  id UUID (PK)
  ticket_id UUID (FK → tickets)
  author_id UUID (FK → profiles)
  content TEXT
  is_internal BOOLEAN (default: false) # Notes visibles uniquement par l'équipe
  created_at TIMESTAMP

-- Pièces jointes
ticket_attachments
  id UUID (PK)
  ticket_id UUID (FK → tickets)
  message_id UUID (FK → ticket_messages, nullable)
  file_url TEXT (chemin Supabase Storage)
  file_type ENUM(image|video|pdf|other)
  file_size INT (bytes)
  original_filename TEXT
  created_at TIMESTAMP

-- Historique changements de statut
ticket_history
  id UUID (PK)
  ticket_id UUID (FK → tickets)
  changed_by UUID (FK → profiles)
  old_status ENUM(...)
  new_status ENUM(...)
  comment TEXT (optionnel)
  created_at TIMESTAMP

-- Logs de notifications (audit)
notification_logs
  id UUID (PK)
  recipient_id UUID (FK → profiles)
  ticket_id UUID (FK → tickets, nullable)
  type ENUM(new_ticket|status_change|new_message|assignment)
  subject TEXT
  sent_at TIMESTAMP
  status ENUM(sent|failed)
  error_message TEXT (nullable)
```

### Storage Supabase
```
bucket: ticket-attachments
├── /tickets/{ticket_id}/
│   └── {file_name}
└── RLS : seul l'auteur du message + équipe Vigidev + propriétaire ticket
```

---

## 📅 Phases de développement

### PHASE 1️⃣ : Structure + Auth + Base de données (Fondations)

#### Objectif
Mettre en place la structure Next.js, l'authentification Supabase et la base de données avec RLS.

#### ✅ Tâches

**0. Initialisation Git & Repo**
```bash
# Git config
git init
git config user.name "Zie619"
git config user.email "ton@email.com"

# .gitignore
node_modules/
.next/
.env
.env.local
.env*.local
*.log
.vercel
dist/
build/

# GitHub
git remote add origin https://github.com/Zie619/vigidev-tickets.git
git branch -M main
git add .
git commit -m "Initial commit - project structure"
git push -u origin main
```

**1. Structure Next.js**
```
vigidev-tickets/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── invite/
│   ├── (client)/
│   │   ├── projects/
│   │   ├── tickets/
│   │   └── profile/
│   ├── (vigidev)/
│   │   ├── projects/
│   │   ├── clients/
│   │   ├── tickets/
│   │   ├── board/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── api/
│   │   ├── health/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── client/
│   ├── vigidev/
│   ├── shared/
│   └── ui/
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── types.ts
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useRealtime.ts
│   └── useUser.ts
├── styles/
│   └── globals.css
├── middleware.ts
├── .env.example
├── supabase/
│   ├── migrations/
│   └── functions/
└── next.config.ts
```

**2. Authentification Supabase**
- Setup Supabase Auth (projet donné)
- 2 flows :
  - **Client** : Email + Password + Confirmation email
  - **Vigidev** : Invitation par email (magic link + completer profil)
- Middleware pour protéger les routes par rôle
- Gestion des redirections (client → /client, vigidev → /vigidev)

**3. Base de données**
- Créer toutes les tables listées (voir Architecture générale)
- Activer RLS sur chaque table
- Policies de sécurité :
  - `profiles` : clients ne voient que leur profil
  - `projects` : vigidev voit tout, clients ne voient rien ici
  - `client_projects` : clients voient leurs attributions
  - `tickets` : clients voient leurs tickets, vigidev voit tous
  - `ticket_messages` : accès selon l'équipe + client créateur
  - `ticket_attachments` : accès selon les permissions du ticket

**4. Pages de base**
- `/login` → formulaire login (détecte le type client/vigidev)
- `/register` → formulaire inscription client
- `/invite` → page d'invitation (équipe)
- Layouts différents pour chaque portail

**5. Commits**
```bash
git add .
git commit -m "Phase 1 complete - Auth + DB structure + RLS"
git push origin main
```

**Questions à poser avant de coder Phase 1** :
- Domaine personnalisé pour les emails ? (ex: tickets@vigidev-france.com)
- URL Supabase et clés API déjà prêtes ?

---

### PHASE 2️⃣ : Gestion des Projets et Clients

#### Contexte
Phase 1 terminée : structure Next.js, auth Supabase, tables BD, RLS.

#### ✅ Tâches

**1. Portail Vigidev - Gestion Projets**
- Page `/vigidev/projects`
  - Liste tous les projets
  - Recherche + filtres
  - Bouton "Nouveau projet" → Modal (nom, adresse)
  - Actions : Modifier, Supprimer (confirmation), Voir détails
  - Affiche : nom, adresse, # clients, date création

- Page `/vigidev/projects/[id]`
  - Détails du projet
  - Liste clients attribués
  - Bouton "Attribuer client" (dropdown)
  - Bouton "Retirer client"

**2. Portail Vigidev - Gestion Clients**
- Page `/vigidev/clients`
  - Liste tous les clients (role=client)
  - Recherche par nom/email
  - Pour chaque : nom, email, date inscription, projets attribués
  - Clic → voir ses projets + ses tickets

**3. Portail Client - Mes projets**
- Page `/client/projects`
  - Liste projets attribués
  - Affiche : nom, adresse, # tickets ouverts
  - Clic → accès aux tickets du projet

**4. Composants réutilisables**
- `ProjectCard` (affichage projet)
- `ClientCard` (affichage client)
- `Modal` (création/édition)
- `Dropdown` (sélection - attribution)
- `EmptyState` (pas de données)

**5. Technique**
- Données en temps réel (Supabase Realtime)
- Validation formulaires
- Toasts erreurs/succès
- Vérifier RLS : clients ne voient que leurs projets

**6. Design**
- Épuré, minimaliste, professionnel
- Couleurs sobres (bleu/gris pour Vigidev)
- UX claire et intuitive

**7. Commits**
```bash
git add .
git commit -m "Phase 2 complete - Project and Client Management"
git push origin main
```

---

### PHASE 3️⃣ : Système de Tickets complet

#### Contexte
Phases 1-2 terminées. On a : auth, gestion projets, attribution.

#### ✅ Tâches

**1. Création de Ticket (Client)**
- Page `/client/projects/[projectId]/new-ticket`
- Formulaire : titre, description, priorité (basse/moyenne/haute/urgente)
- Upload fichiers (images, vidéos max 10s, PDF)
- Preview avant envoi
- Validation : titre min 10 chars, description obligatoire

**2. Liste des Tickets**
- **Client** `/client/tickets`
  - Tous mes tickets
  - Filtres : projet, statut, date
  - Tri : récent, ancien, priorité
  - Badges couleur statut/priorité

- **Vigidev** `/vigidev/tickets`
  - Tous les tickets
  - Filtres : projet, client, statut, priorité, assigné
  - Vue liste avec colonnes : ID, titre, client, projet, priorité, statut, assigné, dernière activité

**3. Détail Ticket**

*Header* :
- Titre, ID, statut (dropdown pour Vigidev), priorité
- Projet, client, dates création/update

*Chat/Discussion* :
- Messages chronologiques (comme Zendesk)
- Chaque message : auteur, date/heure, contenu, pièces jointes
- Input en bas : textarea + upload + envoyer
- Upload : jpg, png, webp, mp4 (max 10s, 50MB), PDF
- Preview inline des images, player vidéo

*Sidebar Vigidev* :
- Assignation : dropdown technicien/dev
- Partage : ajouter collaborateur
- Notes internes (équipe uniquement)
- Historique statuts

**4. Statuts**
```
Nouveau → Pris en charge → En cours → En attente client → Résolu → Clôturé
```
- Changement = entrée `ticket_history` + commentaire optionnel
- Client voit historique complet

**5. Assignation & Partage**
- Par défaut : non assigné
- Technicien : s'auto-assigne ou assigné par admin
- Partage : technicien + dev OR technicien + admin
- Si partagé = 2 personnes voient le ticket

**6. Temps réel**
- Nouveaux messages instantanés
- Changements de statut immédiats
- "X est en train d'écrire..." (nice to have)

**7. Storage**
- Bucket `ticket-attachments`
- Chemin : `/tickets/{ticket_id}/{filename}`
- RLS : participants + équipe seulement
- Compression images côté client

**8. Composants**
- `TicketCard`
- `TicketChat`
- `MessageBubble` (client vs équipe)
- `FileUploader` + preview
- `StatusBadge` + `PriorityBadge`
- `AssignmentDropdown`

**9. Design**
- Bulles chat différenciées
- Timestamps discrets
- Fichiers cliquables pour agrandir
- UX minimaliste

**10. Commits**
```bash
git add .
git commit -m "Phase 3 complete - Full Ticket System with Chat"
git push origin main
```

---

### PHASE 4️⃣ : Vues avancées et Dashboard

#### Contexte
Phases 1-3 terminées. Tickets complets avec chat.

#### ✅ Tâches

**1. Vue Kanban**
- Page `/vigidev/board`
- Colonnes = statuts (Nouveau | Pris en charge | En cours | En attente client | Résolu | Clôturé)
- Cartes draggables
- Card affiche : titre, client, priorité (couleur), assigné (avatar), dernière activité
- Drag & drop change statut (temps réel + historique)
- Filtres : projet, assigné, priorité
- Toggle "Mes tickets" vs "Tous les tickets"

**2. Dashboard Admin**
- Page `/vigidev/dashboard` (admin seulement)
- Stats :
  - Tickets ouverts (total)
  - Tickets résolus (cette semaine/mois)
  - Temps moyen résolution
  - Tickets par priorité (graphique)
- Activité récente :
  - 10 derniers tickets créés
  - 10 derniers changements de statut
  - Tickets urgents non assignés (alerte)
- Performance équipe :
  - Tickets par technicien/dev
  - Temps moyen première réponse
- Filtres : période (7j, 30j, 90j, custom), projet

**3. Timeline Client**
- Page `/client/tickets/[id]`
- Section Timeline verticale
- Événements : création, changement statut, nouveaux messages, fichiers
- Design : icônes + couleurs selon type
- Le client comprend immédiatement où en est le ticket

**4. "Mes Tickets" Amélioré (Client)**
- Page `/client/tickets`
- Onglets : En cours | Résolus | Tous
- Cartes : titre, projet, statut, priorité, date, indicateur "nouveau message"
- Badge notification si message non lu

**5. Composants**
- `KanbanBoard` + `KanbanColumn` + `KanbanCard` (draggable)
- `StatCard` (dashboard)
- `SimpleChart` (recharts ou chart.js)
- `Timeline` + `TimelineEvent`
- `NotificationBadge`

**6. Technique**
- Drag & drop : @dnd-kit/core ou react-beautiful-dnd
- Charts : recharts (léger)
- Stats côté serveur (Supabase functions ou requêtes optimisées)
- Dashboard cache (refresh 30s ou manuel, pas temps réel)

**7. Design**
- Dashboard sobres : cartes blanches, fond gris clair
- Graphiques aux couleurs Vigidev (bleu/gris)

**8. Commits**
```bash
git add .
git commit -m "Phase 4 complete - Kanban Board and Admin Dashboard"
git push origin main
```

---

### PHASE 5️⃣ : Temps réel, Polish, Déploiement

#### Contexte
Phases 1-4 terminées. Structure complète, avant production.

#### ✅ Tâches

**1. Temps Réel - Vérification**
- Nouveaux tickets → listes instantanées
- Messages chat → temps réel
- Changements de statut → partout (liste, kanban, détail)
- Kanban se met à jour quand quelqu'un d'autre drag
- Dashboard admin refresh (polling 30s)
- Subscriptions Supabase sur : `tickets`, `ticket_messages`, `ticket_history`

**2. Indicateurs Présence (Nice to have)**
- Qui est en ligne sur un ticket
- "X est en train d'écrire..." (Supabase Presence ou Broadcast)

**3. Polish UI/UX**

*Navigation* :
- Breadcrumbs toutes les pages
- Sidebar collapsible mobile
- Menu hamburger mobile

*Feedback* :
- Loading skeletons sur listes
- Toasts succès/erreurs
- Confirmations actions destructives
- Empty states clairs

*Accessibilité* :
- Labels sur inputs
- Focus visible
- Contraste suffisant

*Performance* :
- Pagination ou infinite scroll (listes longues)
- Lazy loading images
- Optimisation requêtes (pas N+1)

**4. Sécurité Finale**
- Revue RLS complète
- Client ne voit PAS tickets d'autres clients
- Client ne voit PAS notes internes
- Permissions upload (taille max, types)
- Sanitization inputs (XSS)

**5. Préparation Déploiement GCP**
- Dockerfile optimisé Next.js
- Variables d'env :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (côté serveur)
- Build + start commands
- Health check `/api/health`
- `.dockerignore`

**6. Seeds & Données Test**
- Script `/scripts/seed.ts`
- 3 projets, 5 clients, 2 techniciens, 1 dev, 1 admin
- 10 tickets variés (statuts, priorités)
- Messages + historique

**7. Pages Manquantes**
- `/404` personnalisée
- `/500` personnalisée
- Profil utilisateur (changer mot de passe, infos)
- Paramètres admin (invitations en attente)

**8. Checklist Finale**
- [ ] Toutes les pages fonctionnent
- [ ] Auth OK (login, register, logout, invitation)
- [ ] CRUD projets OK
- [ ] CRUD tickets OK
- [ ] Chat temps réel OK
- [ ] Upload fichiers OK
- [ ] Kanban drag & drop OK
- [ ] Dashboard stats OK
- [ ] Mobile responsive OK
- [ ] Pas d'erreurs console
- [ ] RLS testées manuellement

**9. Commits**
```bash
git add .
git commit -m "Phase 5 complete - Realtime, Polish, Deployment Ready"
git push origin main
```

---

### PHASE 6️⃣ : Système de Notifications avec Edge Functions

#### Contexte
Phases 1-5 terminées. On ajoute notifications par email (Supabase Edge Functions).

#### ✅ Tâches

**1. Structure Edge Functions**
```
/supabase/functions/
├── _shared/
│   ├── email-client.ts       # Client Resend/SendGrid
│   ├── templates.ts          # Templates emails HTML
│   └── supabase-client.ts    # Client Supabase admin
├── notify-new-ticket/
│   └── index.ts
├── notify-status-change/
│   └── index.ts
├── notify-new-message/
│   └── index.ts
├── notify-assignment/
│   └── index.ts
└── deno.json
```

**2. Fonction `notify-new-ticket`**
- Trigger : Webhook sur INSERT `tickets`
- Logique :
  - Récupérer ticket (payload)
  - Fetch projet + client
  - Fetch techniciens avec `notify_new_ticket = true`
  - Envoyer email à chaque
  - Logger dans `notification_logs`
- Template :
  - Sujet : `[Vigidev Tickets] Nouveau ticket : {titre}`
  - Contenu : client, projet, priorité, description (100 chars), bouton "Voir"

**3. Fonction `notify-status-change`**
- Trigger : Webhook sur UPDATE `tickets` (changement de statut)
- Logique :
  - Récupérer ticket + ancien/nouveau statut
  - Fetch client créateur
  - Vérifier `notify_status_change = true`
  - Envoyer email
  - Logger
- Template :
  - Sujet : `[Vigidev Tickets] Ticket #{id} - Statut mis à jour`
  - Contenu : titre, ancien → nouveau, commentaire, bouton

**4. Fonction `notify-new-message`**
- Trigger : Webhook sur INSERT `ticket_messages`
- Logique :
  - Récupérer message + ticket
  - Si auteur = client → notifier `assigned_to` + `shared_with`
  - Si auteur = équipe → notifier client créateur
  - Vérifier `notify_new_message = true` par destinataire
  - Ne pas notifier auteur du message
  - Logger
- Template :
  - Sujet : `[Vigidev Tickets] Nouveau message - Ticket #{id}`
  - Contenu : titre, auteur, aperçu (150 chars), bouton "Répondre"

**5. Fonction `notify-assignment`**
- Trigger : Webhook sur UPDATE `tickets` (changement `assigned_to`)
- Logique :
  - Récupérer ticket + personne assignée
  - Fetch projet + client
  - Vérifier `notify_assignment = true`
  - Envoyer email
  - Logger
- Template :
  - Sujet : `[Vigidev Tickets] Ticket #{id} vous a été assigné`
  - Contenu : titre, client, projet, priorité, bouton

**6. Client Email**
```typescript
// _shared/email-client.ts
import { Resend } from 'npm:resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

export async function sendEmail(to: string, subject: string, html: string) {
  return await resend.emails.send({
    from: 'Vigidev Tickets <tickets@vigidev-france.com>',
    to,
    subject,
    html,
  });
}
```

**7. Templates Email**
```typescript
// _shared/templates.ts
export function newTicketTemplate(data: {
  title: string;
  client: string;
  project: string;
  priority: string;
  description: string;
  ticketUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Nouveau Ticket</h1></div>
        <div class="content">
          <p><strong>Client :</strong> ${data.client}</p>
          <p><strong>Projet :</strong> ${data.project}</p>
          <p><strong>Priorité :</strong> ${data.priority}</p>
          <p><strong>Titre :</strong> ${data.title}</p>
          <p><strong>Description :</strong> ${data.description.substring(0, 100)}...</p>
          <p><a href="${data.ticketUrl}" class="button">Voir le ticket</a></p>
        </div>
        <div class="footer">
          <p>© 2025 Vigidev Tickets</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Similaire pour statusChangeTemplate, newMessageTemplate, assignmentTemplate
```

**8. Configuration Webhooks Supabase**
- Aller dans Supabase Dashboard
- SQL Editor → Créer triggers pour chaque fonction
- Les triggers envoient payloads aux Edge Functions

**9. Variables d'Env**
```env
RESEND_API_KEY=re_xxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
VIGIDEV_TICKET_BASE_URL=https://tickets.vigidev.com
```

**10. Commits**
```bash
git add .
git commit -m "Phase 6 complete - Email Notifications via Edge Functions"
git push origin main
```

---

### PHASE 7️⃣ : Setup & Déploiement Google Cloud Platform

#### Contexte
Phases 1-6 complètes. Prêt pour production sur GCP.

#### ✅ Tâches

**1. Configuration Next.js pour GCP**
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tzmilnltvvtsvdmrkhin.supabase.co'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
};

export default config;
```

**2. Dockerfile pour Cloud Run**
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**3. Health Check**
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok' }, { status: 200 });
}
```

**4. Variables d'Env GCP**
```
NEXT_PUBLIC_SUPABASE_URL=https://tzmilnltvvtsvdmrkhin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=https://tickets.vigidev.com
```

**5. Déploiement Cloud Run**
```bash
# Authentifier avec gcloud
gcloud auth login
gcloud config set project PROJECT_ID

# Build et push image
gcloud builds submit --tag gcr.io/PROJECT_ID/vigidev-tickets

# Déployer
gcloud run deploy vigidev-tickets \
  --image gcr.io/PROJECT_ID/vigidev-tickets \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=xxx,NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx \
  --memory 512Mi \
  --cpu 1
```

**6. Domain Custom GCP**
- Connecter domaine personnalisé dans Cloud Run
- DNS pointing vers GCP Load Balancer
- SSL auto avec Certificate Manager

**7. CI/CD GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/setup-gcloud@v1

      - run: gcloud builds submit --tag gcr.io/${{ env.PROJECT_ID }}/vigidev-tickets
      - run: |
          gcloud run deploy vigidev-tickets \
            --image gcr.io/${{ env.PROJECT_ID }}/vigidev-tickets \
            --region europe-west1 \
            --update-env-vars NEXT_PUBLIC_SUPABASE_URL=${{ secrets.SUPABASE_URL }}
```

**8. Documentation Déploiement**
- Créer `DEPLOYMENT.md` avec :
  - Instructions setup GCP
  - Variables d'env requises
  - Commandes build local/prod
  - Troubleshooting

**9. README Mise à jour**
```markdown
# Vigidev Tickets Platform

Plateforme SaaS de gestion de tickets pour Vigidev.

## Tech Stack
- Frontend: Next.js 14 + TypeScript + Tailwind
- Backend: Supabase + PostgreSQL
- Email: Resend
- Hosting: Google Cloud Run

## Setup Local
\`\`\`bash
npm install
cp .env.example .env.local
npm run dev
\`\`\`

## Déploiement
Voir [DEPLOYMENT.md](./DEPLOYMENT.md)

## License
Propriétaire
```

**10. Commits Finaux**
```bash
git add .
git commit -m "Phase 7 complete - GCP Cloud Run Deployment Ready"
git push origin main
```

---

## ❓ Questions avant de commencer

Avant de lancer Claude Code sur les phases, confirme :

### Auth & Sécurité
1. **Email domain** : Faut-il `tickets@vigidev-france.com` ou `vigidev-france.com` pour l'authentification ?
2. **Premier admin** : Comment tu veux initialiser le premier compte admin ? (manuel en BD, lien spécial, script seed ?)

### Infrastructure
3. **Domaine** : Tu as un domaine GCP/custom pour cette plateforme ? Ou on commence avec le domaine auto Cloud Run ?
4. **Région GCP** : Tu veux `europe-west1` (Belgique) ou une autre ?

### Email
5. **Domaine email** : Tu as accès à un domaine pour envoyer les emails ? (Resend demande un domaine pour la production)
6. **Nombre d'emails** : Plan Resend free (3000/mois) te suffit ?

### Base de données
7. **URL Supabase** : Tu peux accéder à ton dashboard : https://supabase.com/dashboard/project/tzmilnltvvtsvdmrkhin ?

### Workflow Général
8. **Priorités** : Y a-t-il une priorité entre les phases ? Ou on les fais dans l'ordre ?
9. **Testing** : Tu veux des tests unitaires/e2e ou juste testing manuel ?

**Réponds à ces questions (ou dis "ok pour les defaults") et je lance la Phase 1 ! 🚀**

---

## 🎨 Design Guidelines

- **Palette couleurs** : Bleu (#2563eb) + Gris (#64748b) + Blanc
- **Typography** : Inter (Tailwind default)
- **Spacing** : Système 4px (Tailwind)
- **Composants** : Minimalistes, pro, sobres
- **Mode sombre** : À considérer après MVP

---

## 📚 Références

- Vigidev : vigidev-france.com
- Supabase Dashboard : https://supabase.com/dashboard/project/tzmilnltvvtsvdmrkhin
- GitHub Repo : https://github.com/Zie619/vigidev-tickets
- Docs Next.js 14 : https://nextjs.org/docs
- Docs Supabase : https://supabase.com/docs

---

**Fin du document. Prêt pour Phase 1 ! 🎯**
