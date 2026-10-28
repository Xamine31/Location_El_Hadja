# Location El hadja — Même données sur tous vos appareils, sans mot de passe

## Principe
L'application est un site statique HTML/CSS/JavaScript : aucun `npm install`, React, Vite, TypeScript, compilation ou GitHub Actions n'est nécessaire. Une même adresse e-mail, utilisée sur iPhone, PC et Android, correspond à un seul `auth.users.id` Supabase. Les tables sont déjà protégées par RLS sur `user_id`.

## 1. Hébergement GitHub Pages
Remplacez les anciens fichiers de votre dépôt GitHub par **le contenu** du dossier de ce ZIP (pas le dossier lui-même) : `index.html`, `app.js`, `style.css`, `config.js`, `sw.js`, `icons/`, `supabase/`, etc. Supprimez les vieux `.github/workflows`, `src/`, `vite.config.ts` s'ils existent. Dans Settings > Pages : `Deploy from a branch`, `main`, `/(root)`.

## 2. Config Supabase dans `config.js`
```js
window.ELHADJA_CONFIG = {
  SUPABASE_URL: "https://VOTRE-PROJET.supabase.co",
  SUPABASE_ANON_KEY: "VOTRE_CLE_PUBLIQUE_ANON_OU_PUBLISHABLE",
  VAPID_PUBLIC_KEY: ""
};
```
Ces informations sont publiques, car les utilisateurs les reçoivent dans leur navigateur. **Ne mettez jamais la service_role, une secret key, un mot de passe, ou une clé VAPID privée dans GitHub.**

## 3. Auth Supabase
Dans Supabase > Authentication > Providers > Email : activez Email (et l'envoi OTP / magic links). Configurez l'envoi d'e-mails pour un usage réel (SMTP personnalisé recommandé : service mail intégré limité). Les utilisateurs ouvrent l'application, renseignent leur e-mail et cliquent sur le lien reçu.

Dans Authentication > URL Configuration :
- **Site URL** : `https://VOTRE-COMPTE.github.io/Location_El_Hadja/` (remplacez par l'URL exacte de votre application)
- **Redirect URLs** : ajoutez exactement cette URL `https://VOTRE-COMPTE.github.io/Location_El_Hadja/`
- Si vous utilisez un domaine personnalisé, ajoutez son URL HTTPS exacte.

**Sur iPhone** : installez d'abord la PWA depuis Safari (Partager > Sur l'écran d'accueil) et demandez le lien depuis l'app. Pour faciliter la première connexion, ouvrez le lien d'e-mail sur le même appareil; selon iOS, le lien peut s'ouvrir dans Safari plutôt que dans la PWA. Dans ce cas, connectez-vous d'abord dans Safari, puis, si nécessaire, refaites l'authentification depuis la PWA. Les stockages Safari et PWA peuvent être séparés. En cas de difficulté, vous pouvez utiliser la version Safari pour vous connecter.

## 4. Tables Supabase
Dans SQL Editor, exécutez (si ce n'est pas déjà fait) `supabase/migrations/001_initial.sql`, puis `002_cleanup.sql`. **N'exécutez pas de script qui désactive les RLS.** Les données sont isolées par identifiant utilisateur.

## 5. Mode d'emploi
- À la première utilisation de chaque appareil : entrer **la même adresse e-mail**, ouvrir le lien dans la boîte de réception.
- Lors des ouvertures suivantes : l'application utilise la session conservée, sauf déconnexion / session effacée ou révoquée.
- Déconnexion disponible en bas des pages.
- Les données apparaissent identiques sur tous les appareils dès que vous actualisez la page (pas de synchronisation instantanée en temps réel).

## 6. Important : anciennes données anonymes
Les données créées avec les anciennes sessions anonymes **ne basculent pas automatiquement** vers ce compte e-mail. Si vous voulez les récupérer, identifiez l'ancien `user_id` et le nouvel `user_id` puis migrez-les de façon contrôlée par SQL avec sauvegarde, en gardant les liens entre véhicules, maintenance, finances et abonnements push. Ne supprimez pas les anciennes sessions/les données navigateur avant cette migration.

## 7. Notifications
Le bouton d'abonnement push est présent si `VAPID_PUBLIC_KEY` est renseignée. Les alertes à distance nécessitent toujours la configuration de l'Edge Function et du Cron Supabase. Sur iPhone, la PWA doit être installée à l'écran d'accueil et les notifications autorisées.

## 8. Sécurité
Ne rendez pas les tables publiques et ne créez pas de règles RLS de type `using (true)` pour éviter la connexion. Le lien par e-mail tient lieu d'authentification sans mot de passe. Pour un usage réel, protégez également l'accès à l'adresse e-mail et configurez SMTP.
