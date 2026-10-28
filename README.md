# Location El hadja — PWA GitHub Pages + Supabase

Application de gestion de flotte installable sur iPhone, Android et Windows.

## Fonctions incluses

- Authentification Supabase par email/mot de passe
- Ajouter, modifier et supprimer des véhicules
- Immatriculation, marque, modèle, année, kilométrage, prix/date d'achat, statut, notes
- Recettes et dépenses par véhicule
- Chiffre d'affaires, dépenses et bénéfice global
- Maintenance par date et/ou kilométrage
- Notifications Web Push de maintenance
- PWA installable sur iOS/Android/Windows
- GitHub Pages pour l'hébergement
- Supabase pour Auth + PostgreSQL + Edge Function + Cron
- RLS : chaque compte ne voit que ses propres données

---

# 1. Prérequis

Installez :

- Git
- Node.js 22 LTS (ou version récente compatible)
- Un compte GitHub
- Un compte Supabase

Pour les Edge Functions, vous pourrez utiliser Supabase CLI via `npx` à l'étape 7.

# 2. Tester l'application sur le PC

Dans le dossier :

```bash
npm install
cp .env.example .env.local
```

Sous Windows PowerShell, si `cp` ne fonctionne pas :

```powershell
Copy-Item .env.example .env.local
```

Ne lancez pas encore l'application : créez d'abord Supabase et remplissez les variables ci-dessous.

# 3. Créer le projet Supabase

1. Créez un projet dans Supabase.
2. Ouvrez **SQL Editor**.
3. Copiez/exécutez entièrement :

```text
supabase/migrations/001_initial.sql
```

Le script crée toutes les tables, index, relations et règles RLS.

# 4. Récupérer les clés publiques Supabase

Dans **Project Settings / API** récupérez :

- Project URL
- Anon key / Publishable key

Dans `.env.local` :

```env
VITE_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_CLE_PUBLIQUE
VITE_VAPID_PUBLIC_KEY=ON_LA_GENERE_ETAPE_6
```

La clé `anon/publishable` est destinée au frontend. La sécurité des données repose sur Supabase Auth + RLS.

**Ne mettez jamais `service_role` dans `.env.local`, dans React, ni dans GitHub Pages.**

# 5. Tester véhicules + finances en local

Lancez :

```bash
npm run dev
```

Ouvrez l'URL affichée par Vite, souvent :

```text
http://localhost:5173
```

Créez un compte puis testez :

- Ajouter un véhicule
- Modifier son kilométrage
- Supprimer un véhicule
- Ajouter une recette
- Ajouter une dépense
- Ajouter une maintenance

Si Supabase demande une confirmation email et que vous ne la voulez pas pendant les essais, modifiez ce comportement dans **Authentication > Providers > Email**.

# 6. Générer les clés de notifications VAPID

Vous pouvez utiliser le package `web-push` :

```bash
npx web-push generate-vapid-keys
```

Vous obtenez :

```text
Public Key: ...
Private Key: ...
```

Dans `.env.local`, mettez uniquement la publique :

```env
VITE_VAPID_PUBLIC_KEY=VOTRE_CLE_PUBLIQUE_VAPID
```

La clé privée ira uniquement dans les secrets Supabase.

# 7. Déployer l'Edge Function Supabase

Utilisez le CLI via `npx` :

```bash
npx supabase login
npx supabase link --project-ref VOTRE_PROJECT_REF
```

Ajoutez les secrets serveur :

```bash
npx supabase secrets set VAPID_PUBLIC_KEY="VOTRE_CLE_PUBLIQUE_VAPID"
npx supabase secrets set VAPID_PRIVATE_KEY="VOTRE_CLE_PRIVEE_VAPID"
npx supabase secrets set VAPID_SUBJECT="mailto:votre-email@example.com"
npx supabase secrets set CRON_SECRET="UNE_LONGUE_CLE_ALEATOIRE"
```

`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont disponibles automatiquement dans une Edge Function Supabase hébergée.

Déployez :

```bash
npx supabase functions deploy maintenance-push --no-verify-jwt
```

L'Edge Function est protégée par `x-cron-secret`.

# 8. Programmer les notifications quotidiennes

Deux possibilités :

## Méthode A — Supabase Dashboard

Utilisez Supabase Cron pour appeler une fois par jour :

```text
https://VOTRE_PROJECT_REF.supabase.co/functions/v1/maintenance-push
```

avec l'en-tête :

```text
x-cron-secret: LA_MEME_VALEUR_QUE_CRON_SECRET
```

## Méthode B — SQL fourni

Le fichier :

```text
supabase/CRON_EXAMPLE.sql
```

contient un exemple utilisant `pg_cron`, `pg_net` et Supabase Vault. Mettez l'URL du projet et le secret Cron dans Vault avant d'exécuter le planning.

# 9. Tester les notifications

1. Ouvrez la PWA depuis HTTPS (GitHub Pages) sur l'appareil.
2. Sur la page **Maintenance**, cliquez **Activer les notifications**.
3. Acceptez la permission système.
4. Ajoutez une maintenance due aujourd'hui ou avec un kilométrage inférieur/égal au kilométrage actuel du véhicule.
5. Lancez manuellement la fonction pour tester :

```bash
curl -X POST \
  'https://VOTRE_PROJECT_REF.supabase.co/functions/v1/maintenance-push' \
  -H 'x-cron-secret: VOTRE_CRON_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### iPhone

Pour recevoir les Web Push sur iPhone, installez d'abord la PWA sur l'écran d'accueil depuis Safari, ouvrez cette version installée, puis activez les notifications depuis la page Maintenance.

# 10. Créer le dépôt GitHub

Créez un dépôt GitHub vide, par exemple :

```text
location-el-hadja
```

Puis dans le dossier :

```bash
git init
git add .
git commit -m "Location El hadja - GitHub Pages + Supabase"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/location-el-hadja.git
git push -u origin main
```

# 11. Ajouter les variables dans GitHub

Dans le dépôt :

**Settings > Secrets and variables > Actions > Secrets > New repository secret**

Ajoutez :

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_VAPID_PUBLIC_KEY
```

Ce sont des valeurs qui finissent dans le frontend compilé, mais utiliser la zone Secrets évite de les écrire directement dans le workflow ou le dépôt.

**Ne mettez jamais `SUPABASE_SERVICE_ROLE_KEY` ni `VAPID_PRIVATE_KEY` dans ces variables frontend.**

# 12. Activer GitHub Pages

Dans :

**Settings > Pages**

Pour **Source**, sélectionnez :

```text
GitHub Actions
```

Le fichier déjà fourni :

```text
.github/workflows/deploy-pages.yml
```

construit la PWA puis publie automatiquement `dist/` à chaque `git push` sur `main`.

Votre URL sera similaire à :

```text
https://VOTRE-COMPTE.github.io/location-el-hadja/
```

# 13. Installer la PWA

### iPhone

Safari > ouvrir l'URL > Partager > **Sur l'écran d'accueil** > ouvrir l'icône installée.

### Android

Chrome > ouvrir l'URL > menu > **Installer l'application** / **Ajouter à l'écran d'accueil**.

### Windows

Edge ou Chrome > ouvrir l'URL > icône **Installer** dans la barre d'adresse.

# 14. Domaine personnalisé (facultatif)

Vous pourrez ensuite utiliser par exemple :

```text
app.locationelhadja.com
```

Dans **GitHub > Settings > Pages > Custom domain**, indiquez votre domaine puis configurez le DNS chez votre registrar.

# Architecture finale

```text
iPhone / Android / Windows
           |
           v
      GitHub Pages
        PWA React
           |
           v
        Supabase
   +------------------+
   | Auth             |
   | PostgreSQL + RLS |
   | Edge Functions   |
   | Cron             |
   +------------------+
           |
           v
 Notifications Web Push
```

## Sécurité importante

Le frontend ne contient que des clés publiques. Les permissions sont contrôlées par Supabase RLS. Les secrets privilégiés (`service_role`, VAPID privée, CRON_SECRET) restent côté Supabase uniquement.
