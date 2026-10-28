# Location El hadja — version sans build

Architecture : **GitHub Pages (HTML/CSS/JavaScript)** + **Supabase**. Aucun Node, npm, Vite, React, TypeScript ou GitHub Actions n'est nécessaire.

## Mise en ligne
1. Supprimez l'ancien contenu du dépôt GitHub, y compris `.github/workflows`, `src`, `package.json`, les anciens `vite.config.ts` et `index.html`.
2. Envoyez **le contenu** de ce ZIP à la racine du dépôt, pas le dossier parent.
3. Dans `config.js`, remplacez `SUPABASE_URL` et `SUPABASE_ANON_KEY` (clé publique uniquement). Ne mettez **jamais** de service_role, clé secrète ou clé privée VAPID dans GitHub.
4. Dans Supabase SQL Editor, exécutez `supabase/migrations/001_initial.sql`, puis `002_cleanup.sql`. Le second demande l'extension pg_cron disponible sur le projet.
5. Dans GitHub → Settings → Pages, choisissez **Deploy from a branch** → `main` → `/(root)`, et enregistrez.
6. Ouvrez `https://VOTRE-COMPTE.github.io/Location_El_Hadja/`. Il n'y a pas de build.
7. Dans Supabase Authentication → URL Configuration, configurez l'URL GitHub Pages, et autorisez-la comme redirect URL. Activez **Authentication → Providers → Anonymous Sign-Ins**. Aucun e-mail ni mot de passe ne sera demandé.

## Pages
Tableau de bord, véhicules et formulaire distinct, maintenance filtrable par véhicule et formulaire distinct, finances filtrables par véhicule et total/mensuel avec choix du mois. CA et bénéfice en DA. Immatriculations au format courant `123456 123 16`.

## Maintenance et notifications
Les maintenances clôturées sont **supprimées définitivement** 7 jours après `completed_at` par le job pg_cron. Cela supprime leur historique et leur coût des totaux : si vous voulez conserver des historiques financiers, adaptez cette règle avant d'utiliser des données réelles. Pour recevoir les notifications push, configurez les clés VAPID, la fonction `supabase/functions/maintenance-push`, ses secrets et un planificateur côté Supabase (voir `supabase/CRON_EXAMPLE.sql`). Sans cela, le bouton d'abonnement ne suffit pas à envoyer des alertes. iPhone : installer depuis Safari sur l'écran d'accueil puis activer les notifications depuis l'app installée.

## Précisions
Cette application lit les données via Internet (Supabase). L'enveloppe PWA peut se charger hors connexion si elle est déjà mise en cache, mais les formulaires ne fonctionnent pas hors ligne. Les règles de sécurité RLS sont dans le SQL. Testez le projet et ses autorisations sur des données fictives avant utilisation réelle. Le module Supabase JS est chargé via un CDN ESM externe : pas d'installation npm, mais une connexion au CDN est nécessaire lors du premier chargement.

## Accès sans compte ni mot de passe
L'application ouvre automatiquement une session **anonyme Supabase** (`signInAnonymously`). Les règles RLS du SQL existant continuent de limiter les données à l'identité anonyme propre au navigateur. Il faut impérativement activer **Supabase → Authentication → Providers → Anonymous Sign-Ins** avant le test. Aucun écran de connexion n'est affiché.

**Limite importante :** chaque téléphone ou navigateur aura sa propre collection de véhicules et finances ; les données ne sont pas partagées automatiquement entre appareils. Si vous effacez les données du navigateur ou réinstallez l'application, vous risquez de perdre l'accès à cette identité, même si les enregistrements existent encore dans Supabase. Pour une flotte commune sur plusieurs appareils sans compte visible, il faudra ensuite une autre architecture, avec une protection d'accès et un mécanisme de récupération. L'URL publique et la clé anon ne doivent jamais servir à donner libre accès à toutes les données de la flotte.
