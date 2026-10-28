# Location El hadja — installation production (GitHub Pages + Supabase)

Cette version **n'est pas une démo** : les modifications sont enregistrées en base Supabase, et il faut une connexion réseau. Les données sont propres à chaque compte grâce aux politiques RLS.

## 1. Remplacer les fichiers GitHub

Dézipper le projet. Sur le dépôt `Location_El_Hadja`, **supprimer les anciens fichiers** puis déposer le contenu de ce dossier (en conservant `.github/workflows/deploy-pages.yml`). Si tu utilises Git local :

```bash
git add -A
git commit -m "Application Supabase véhicules finances maintenance"
git push origin main
```

Le projet utilise `HashRouter`, compatible avec GitHub Pages même pour `/Location_El_Hadja/`. Le chemin des ressources est déterminé automatiquement par `GITHUB_REPOSITORY` lors du déploiement.

## 2. Configurer Supabase

1. Créer un projet sur https://supabase.com et attendre la fin de son initialisation.
2. **SQL Editor → New query** : exécuter `supabase/migrations/001_initial.sql`.
3. **SQL Editor → New query** : exécuter `supabase/migrations/002_cleanup.sql` pour supprimer chaque jour les maintenances terminées depuis plus de sept jours.
4. **Authentication → Providers → Email** : activer la connexion e-mail. Garder la confirmation par e-mail activée en production.
5. Récupérer **Project URL** et **publishable key** (ou clé publique `anon` legacy) dans les paramètres du projet.

**Attention :** `002_cleanup.sql` utilise `pg_cron`. Si cette extension n'est pas disponible sur ton plan/projet, la requête de programmation peut échouer. Dans ce cas, faire exécuter chaque jour `select public.purge_completed_maintenance();` par un mécanisme Cron Supabase autorisé. La suppression des 7 jours n'est garantie qu'une fois le job activé.

## 3. Secrets GitHub Actions (pas Supabase service_role !)

Dans `Settings → Secrets and variables → Actions → New repository secret` :

- `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = clé **publique** Supabase
- `VITE_VAPID_PUBLIC_KEY` = clé publique VAPID, quand les push seront activés (optionnel pour faire fonctionner véhicules/finances/maintenance).

La clé `service_role` et la clé **privée** VAPID ne doivent **jamais** entrer dans les secrets commençant par `VITE_`.

Dans `Settings → Pages`, choisir **GitHub Actions**. Vérifier ensuite dans `Actions` que le workflow passe au vert.

## 4. Push de maintenance (en option, après la mise en service de la base)

Les notifications mobiles **nécessitent** le service worker HTTPS, l'autorisation sur l'appareil, la clé publique VAPID au build, une Edge Function Supabase et un déclenchement régulier.

```bash
npx web-push generate-vapid-keys
npx supabase login
npx supabase link --project-ref VOTRE_PROJECT_REF
npx supabase secrets set VAPID_PUBLIC_KEY="..." VAPID_PRIVATE_KEY="..." VAPID_SUBJECT="mailto:email@example.com" CRON_SECRET="SECRET_LONG_ALEATOIRE"
npx supabase functions deploy maintenance-push --no-verify-jwt
```

Dans Supabase, programmer un appel quotidien **POST** à `/functions/v1/maintenance-push` avec l'en-tête `x-cron-secret: SECRET_LONG_ALEATOIRE`. Adapter l'exemple `supabase/CRON_EXAMPLE.sql` aux paramètres du projet. Ne jamais exposer cette valeur dans le code navigateur ou le dépôt. La fonction refuse toute requête sans secret correct.

Sur iPhone, ouvrir le site avec Safari, **Ajouter à l'écran d'accueil**, ouvrir depuis l'icône puis appuyer sur **Activer les notifications**. Pour recevoir les notifications, autoriser la demande système. Sur Android/Windows, ouvrir la PWA et accepter les notifications.

**Note** : les alertes kilométriques sont déclenchées seulement après mise à jour du kilométrage dans la fiche véhicule. Le coût renseigné dans une maintenance est informatif : il **n'est pas** automatiquement déduit des finances pour éviter le double comptage. Enregistrer la dépense séparément dans Finances.

## 5. Test local

```bash
npm install
cp .env.example .env.local
# Compléter .env.local
npm run build
npm run dev
```

Ouvrir http://localhost:5173. Ne jamais mettre `.env.local` sur GitHub.

## Fonctionnalités

- Parc : liste distincte de la page ajouter/modifier, suppression, immatriculation algérienne, prix en DA.
- Maintenance : liste filtrée par voiture, page d'ajout/modification, date/kilométrage, clôture/réouverture, suppression automatique à J+7 via Supabase Cron.
- Finances : liste filtrée par voiture, total ou mois sélectionné, pages séparées d'ajout/modification, CA/dépenses/bénéfice en DA.
- Dashboard : résumé tous véhicules, toutes dates.
- Chaque utilisateur ne peut lire ou modifier que ses propres données grâce aux règles Supabase RLS.

## Points d'attention

- **Suppression définitive** : une maintenance terminée est effacée après sept jours, donc son historique n'est plus disponible. Les dépenses financières sont conservées séparément.
- Le champ plaque accepte les **wilayas 01–58**. Si l'immatriculation d'un véhicule suit une variante particulière, adapter `src/utils.ts`.
- Les fonctionnalités Supabase ont besoin d'Internet ; le service worker conserve une partie de l'interface mais ne fournit pas une base hors ligne synchronisée.
