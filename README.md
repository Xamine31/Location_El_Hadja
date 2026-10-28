# Location El hadja — version sans build

Architecture : **GitHub Pages (HTML/CSS/JavaScript)** + **Supabase**. Aucun Node, npm, Vite, React, TypeScript ou GitHub Actions n'est nécessaire.

## Mise en ligne
1. Supprimez l'ancien contenu du dépôt GitHub, y compris `.github/workflows`, `src`, `package.json`, les anciens `vite.config.ts` et `index.html`.
2. Envoyez **le contenu** de ce ZIP à la racine du dépôt, pas le dossier parent.
3. Dans `config.js`, remplacez `SUPABASE_URL` et `SUPABASE_ANON_KEY` (clé publique uniquement). Ne mettez **jamais** de service_role, clé secrète ou clé privée VAPID dans GitHub.
4. Dans Supabase SQL Editor, exécutez `supabase/migrations/001_initial.sql`, puis `002_cleanup.sql`. Le second demande l'extension pg_cron disponible sur le projet.
5. Dans GitHub → Settings → Pages, choisissez **Deploy from a branch** → `main` → `/(root)`, et enregistrez.
6. Ouvrez `https://VOTRE-COMPTE.github.io/Location_El_Hadja/`. Il n'y a pas de build.
7. Dans Supabase Authentication → URL Configuration, configurez l'URL GitHub Pages, et autorisez-la comme redirect URL. Activez Email/Password.

## Pages
Tableau de bord, véhicules et formulaire distinct, maintenance filtrable par véhicule et formulaire distinct, finances filtrables par véhicule et total/mensuel avec choix du mois. CA et bénéfice en DA. Immatriculations au format courant `123456 123 16`.

## Maintenance et notifications
Les maintenances clôturées sont **supprimées définitivement** 7 jours après `completed_at` par le job pg_cron. Cela supprime leur historique et leur coût des totaux : si vous voulez conserver des historiques financiers, adaptez cette règle avant d'utiliser des données réelles. Pour recevoir les notifications push, configurez les clés VAPID, la fonction `supabase/functions/maintenance-push`, ses secrets et un planificateur côté Supabase (voir `supabase/CRON_EXAMPLE.sql`). Sans cela, le bouton d'abonnement ne suffit pas à envoyer des alertes. iPhone : installer depuis Safari sur l'écran d'accueil puis activer les notifications depuis l'app installée.

## Précisions
Cette application lit les données via Internet (Supabase). L'enveloppe PWA peut se charger hors connexion si elle est déjà mise en cache, mais les formulaires ne fonctionnent pas hors ligne. Les règles de sécurité RLS sont dans le SQL. Testez le projet et ses autorisations sur des données fictives avant utilisation réelle. Le module Supabase JS est chargé via un CDN ESM externe : pas d'installation npm, mais une connexion au CDN est nécessaire lors du premier chargement.
