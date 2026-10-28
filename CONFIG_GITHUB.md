# Configuration sans GitHub Actions Secrets

1. Ouvre `.env.production` à la racine du dépôt GitHub.
2. Remplace `https://TON-PROJET.supabase.co` par l’URL du projet dans **Supabase → Project Settings → API**.
3. Remplace `TA_CLE_PUBLIQUE_ANON_OU_PUBLISHABLE` par la **clé anon / publishable** (jamais `service_role`, `secret`, mot de passe, clé VAPID privée).
4. Fais un commit. GitHub Actions utilise désormais directement `.env.production` pour `npm run build`.
5. Vérifie **Settings → Pages → Source: GitHub Actions**, puis le déploiement dans **Actions**.

⚠️ Toute variable `VITE_` est incluse dans le JavaScript public : ne jamais y insérer de secret privé. La protection des données repose sur les politiques RLS Supabase.

Le fichier contient des **valeurs d’exemple** : l’application ne pourra pas se connecter avant remplacement. Pour un test sans Supabase, utilise la version démo.

Les notifications nécessitent en plus une clé publique VAPID et une Edge Function Supabase avec sa clé privée conservée côté serveur.
